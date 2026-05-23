<h1 align="center">Tabliss</h1>

<p align="center">A beautiful, customisable New Tab page for Firefox and Chrome.</p>

![Tabliss Screenshot](screenshot.png)

<p align="center"><a href="https://tabliss.io">https://tabliss.io</a></p>

## Usage

Install dependencies with `npm install` before running the following scripts.

- `npm run dev[:target]` Local development server
- `npm run build[:target]` Production build
- `npm run translations` Manage translation files

To develop with external services you will additionally need to signup for your own API keys
and enter them into your `.env` file. Get started by copying the example provided `cp .env.example .env`.

## Private Sync Setup

This fork can sync extension state through a private Raspberry Pi server exposed with Tailscale Serve.

### Raspberry Pi server

Copy `server/` to the Pi, then run:

```bash
cd ~/todolist-sync/server
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
export TODOLIST_TOKEN='jfiweokgerhotrwhtr'
uvicorn app:app --host 127.0.0.1 --port 8787
```

In another Pi terminal, expose the local FastAPI server through Tailscale:

```bash
sudo tailscale serve --https=443 http://127.0.0.1:8787
tailscale serve status
```

Verify from a Tailscale-connected computer:

```powershell
curl.exe "https://raspberrypi.tail2db278.ts.net/health"
curl.exe -H "Authorization: Bearer jfiweokgerhotrwhtr" "https://raspberrypi.tail2db278.ts.net/v1/stores/tabliss/config"
```

### Import an existing extension backup

Export browser extension local storage to JSON, copy it to the Pi, then run:

```bash
cd ~/todolist-sync/server
source .venv/bin/activate
python import_backup.py ../backup.json
```

The importer reads keys under `tabliss/config/` and writes them into `todolist.sqlite3`.

### Extension build

The sync URL and token are stored in `.env`:

```env
SYNC_SERVER_URL=https://raspberrypi.tail2db278.ts.net
SYNC_AUTH_TOKEN=jfiweokgerhotrwhtr
```

Build Chromium:

```powershell
npm install
npm run build:chromium
```

Load `dist/chromium` as an unpacked extension from `chrome://extensions`.

### Sync debugging

Open DevTools on the new-tab page and check the console for `[todo-sync]` logs. A healthy startup shows:

```text
[todo-sync] enabled: https://raspberrypi.tail2db278.ts.net
[todo-sync] starting remote sync: https://raspberrypi.tail2db278.ts.net
[todo-sync] request: GET /v1/stores/tabliss/config
```

If those logs do not appear, reload or remove and re-add the unpacked extension from the rebuilt `dist/chromium` directory.

## Translations

Checkout the guide to [adding translations](TRANSLATING.md).
