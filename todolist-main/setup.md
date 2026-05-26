# Setup

This guide is for an already configured Raspberry Pi sync server. Use it when moving the Pi, restarting it, or connecting a new computer to the synced extension.

## Raspberry Pi After Moving Or Restarting

1. Plug in the Pi and make sure it has internet.
2. SSH into it from a Tailscale-connected computer:

```powershell
ssh jkothari@raspberrypi.local
```

If `.local` does not resolve, use the Pi's Tailscale name or IP from the Tailscale admin console.

3. Start the sync API:

```bash
cd ~/todolist-sync/server
source .venv/bin/activate
export TODOLIST_TOKEN='jfiweokgerhotrwhtr'
export TODOLIST_DB='todolist.sqlite3'
export TODOLIST_HISTORY_DB='todolist_history.sqlite3'
uvicorn app:app --host 127.0.0.1 --port 8787
```

Leave this terminal running.

4. In a second SSH terminal, make sure Tailscale Serve is pointing at the API:

```bash
sudo tailscale serve --https=443 http://127.0.0.1:8787
tailscale serve status
```

5. Verify from Windows PowerShell:

```powershell
curl.exe "https://raspberrypi.tail2db278.ts.net/health"
curl.exe -H "Authorization: Bearer jfiweokgerhotrwhtr" "https://raspberrypi.tail2db278.ts.net/v1/stores/tabliss/config"
curl.exe -H "Authorization: Bearer jfiweokgerhotrwhtr" "https://raspberrypi.tail2db278.ts.net/v1/history/summary"
```

The health check should return `{"ok":true}`. The config endpoint should return JSON with a `changes` array. The history summary should return counts for `changes`, `tasks`, `notes`, and `plans`.

## Connect A New Computer

1. Install Tailscale on the computer and sign into the same tailnet.
2. Verify the Pi is reachable:

```powershell
curl.exe "https://raspberrypi.tail2db278.ts.net/health"
```

3. Clone or pull this private repo.
4. Install Node.js LTS if needed.
5. From the repo folder, install dependencies and build:

```powershell
cd "PATH\TO\todolist-main"
npm install
npm run build:chromium
```

The `.env` file already contains:

```env
SYNC_SERVER_URL=https://raspberrypi.tail2db278.ts.net
SYNC_AUTH_TOKEN=jfiweokgerhotrwhtr
```

6. Load the extension:

Open `chrome://extensions`, enable Developer mode, click "Load unpacked", and select:

```text
PATH\TO\todolist-main\dist\chromium
```

7. Open a new tab. It should pull the latest state from the Pi.

## Verify Sync

1. Add a test todo on one computer.
2. Wait a few seconds.
3. Open or reload a new tab on the other computer.
4. The test todo should appear.

You can also verify the server received data:

```powershell
curl.exe -H "Authorization: Bearer jfiweokgerhotrwhtr" "https://raspberrypi.tail2db278.ts.net/v1/stores/tabliss/config"
curl.exe -H "Authorization: Bearer jfiweokgerhotrwhtr" "https://raspberrypi.tail2db278.ts.net/v1/history/summary"
```

## Check The History Database On The Pi

The Pi now keeps two SQLite databases in `~/todolist-sync/server`:

```text
todolist.sqlite3
todolist_history.sqlite3
```

`todolist.sqlite3` is the functional sync database used by the extension. `todolist_history.sqlite3` preserves every task, note, and plan-of-day payload the server has seen.

Inspect recent saved history:

```bash
cd ~/todolist-sync/server
sqlite3 todolist_history.sqlite3 ".tables"
sqlite3 todolist_history.sqlite3 "select id, contents, first_seen_at, last_seen_at from tasks order by first_seen_at desc limit 10;"
sqlite3 todolist_history.sqlite3 "select id, name, contents from notes order by first_seen_at desc limit 10;"
sqlite3 todolist_history.sqlite3 "select plan_date, contents from plans order by plan_date desc limit 10;"
```

## Debugging

Open DevTools on the new-tab page and check the Console for `[todo-sync]` logs.

A healthy startup looks like:

```text
[todo-sync] enabled: https://raspberrypi.tail2db278.ts.net
[todo-sync] starting remote sync: https://raspberrypi.tail2db278.ts.net
[todo-sync] request: GET /v1/stores/tabliss/config
```

If no `[todo-sync]` logs appear, Chrome is probably running an older unpacked extension. Remove it from `chrome://extensions`, rebuild with `npm run build:chromium`, and load `dist/chromium` again.

If Tailscale Serve stops working, rerun:

```bash
sudo tailscale serve --https=443 http://127.0.0.1:8787
tailscale serve status
```
