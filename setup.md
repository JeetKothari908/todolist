# Setup

This guide explains how to set up the Raspberry Pi sync server from scratch, restart it later, and connect a new computer to the synced extension.

## Raspberry Pi From Scratch

Use this when setting up a fresh Raspberry Pi to host the private SQLite sync database.

1. Flash Raspberry Pi OS Lite with Raspberry Pi Imager.

During imaging, enable SSH, set the hostname to `raspberrypi`, and create the user `jkothari`.

2. Boot the Pi, make sure it has internet, then SSH into it from Windows PowerShell:

```powershell
ssh jkothari@raspberrypi.local
```

If `.local` does not resolve, use the Pi's IP address from your router or the Raspberry Pi Imager screen.

3. Update the Pi and install basic tools:

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y python3 python3-venv python3-pip curl git
```

4. Install Tailscale and sign into the same tailnet as your other computers:

```bash
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up --ssh
```

Follow the login URL that Tailscale prints.

5. Copy the sync server folder from Windows to the Pi.

Run this from Windows PowerShell in the repo folder:

```powershell
scp -r .\server jkothari@raspberrypi.local:~/todolist-sync/
```

6. On the Pi, create the Python environment and install the server dependencies:

```bash
cd ~/todolist-sync/server
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

7. Start the sync API:

```bash
cd ~/todolist-sync/server
source .venv/bin/activate
export TODOLIST_TOKEN='jfiweokgerhotrwhtr'
uvicorn app:app --host 127.0.0.1 --port 8787
```

Leave this terminal running. The SQLite database will be created automatically at:

```text
~/todolist-sync/server/todolist.sqlite3
```

8. In a second SSH terminal, expose the local API privately through Tailscale Serve:

```bash
sudo tailscale serve --bg --https=443 http://127.0.0.1:8787
tailscale serve status
```

9. Verify from Windows PowerShell:

```powershell
curl.exe "https://raspberrypi.tail2db278.ts.net/health"
curl.exe -H "Authorization: Bearer jfiweokgerhotrwhtr" "https://raspberrypi.tail2db278.ts.net/v1/stores/tabliss/config"
```

The health check should return `{"ok":true}`. The config endpoint should return JSON with a `changes` array.

## Optional: Run The API Automatically On Boot

The manual `uvicorn` command works, but it stops when that SSH terminal closes. Use a `systemd` service if the Pi should restart the sync API automatically.

1. Create an environment file:

```bash
sudo nano /etc/todolist-sync.env
```

Add:

```bash
TODOLIST_TOKEN=jfiweokgerhotrwhtr
TODOLIST_DB=/home/jkothari/todolist-sync/server/todolist.sqlite3
```

2. Create the service:

```bash
sudo nano /etc/systemd/system/todolist-sync.service
```

Add:

```ini
[Unit]
Description=Todo List Sync API
After=network-online.target tailscaled.service
Wants=network-online.target

[Service]
User=jkothari
WorkingDirectory=/home/jkothari/todolist-sync/server
EnvironmentFile=/etc/todolist-sync.env
ExecStart=/home/jkothari/todolist-sync/server/.venv/bin/uvicorn app:app --host 127.0.0.1 --port 8787
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

3. Enable and start it:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now todolist-sync
sudo systemctl status todolist-sync
```

4. Make sure Tailscale Serve is still pointing at the API:

```bash
sudo tailscale serve --https=443 http://127.0.0.1:8787
tailscale serve status
```

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
```

The health check should return `{"ok":true}`. The config endpoint should return JSON with a `changes` array.

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
cd "PATH\TO\todolist-extension"
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
PATH\TO\todolist-extension\dist\chromium
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
```

## Debugging

Open DevTools on the new-tab page and check the Console for `[todo-sync]` logs.

A healthy startup looks like:

```text
[todo-sync] enabled: https://raspberrypi.tail2db278.ts.net
[todo-sync] starting remote sync: https://raspberrypi.tail2db278.ts.net
[todo-sync] request: GET /v1/stores/tabliss/config
```

If no `[todo-sync]` logs appear, Chrome is probably running an older unpacked extension. Remove it from `chrome://extensions`, rebuild with `npm run build:chromium` from `todolist-extension`, and load `todolist-extension/dist/chromium` again.

If Tailscale Serve stops working, rerun:

```bash
sudo tailscale serve --https=443 http://127.0.0.1:8787
tailscale serve status
```
