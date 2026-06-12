# Setup

This guide contains all setup instructions for LocalFlow: building the browser extension, running the sync server, opening the iOS app, setting up the Raspberry Pi, restarting the stack later, verifying sync, and debugging common setup issues.

## Browser Extension

Use this when installing or rebuilding the Chrome/Chromium extension locally.

1. Install dependencies and build the Chromium bundle from the repo root:

```powershell
cd extension
npm install
npm run build:chromium
```

2. Load the extension:

Open `chrome://extensions`, enable Developer mode, click "Load unpacked", and select:

```text
extension/dist/chromium
```

3. Open a new tab.

The LocalFlow extension works as a standalone local app by default. To use the private sync server, open Settings, go to Sync, turn on "Use Tailscale sync", enter the server URL and auth token, and keep Tailscale connected when you want remote syncing.

For development, run Webpack in watch mode:

```powershell
cd extension
npm run dev:chromium
```

Useful extension commands:

```powershell
npm test
npm run build:chromium
npm run build:firefox
npm run build:web
npm run translations
```

## Local Sync Server

Use this when running the FastAPI and SQLite sync server directly on your current machine instead of the Raspberry Pi.

On macOS/Linux:

```bash
cd server
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
export LOCALFLOW_TOKEN='replace-with-your-token'
uvicorn app:app --host 127.0.0.1 --port 8787
```

On Windows PowerShell:

```powershell
cd server
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
$env:LOCALFLOW_TOKEN = 'replace-with-your-token'
uvicorn app:app --host 127.0.0.1 --port 8787
```

Verify it locally:

```powershell
curl.exe "http://127.0.0.1:8787/health"
curl.exe -H "Authorization: Bearer replace-with-your-token" "http://127.0.0.1:8787/v1/stores/tabliss/config"
```

The health check should return `{"ok":true}`. The config endpoint should return JSON with a `changes` array.

## iOS App

Open the Xcode project:

```text
app/app.xcodeproj
```

The LocalFlow app uses SwiftUI and `SyncStore` to talk to the same sync API as the extension. Its main tabs are:

- Todos
- Notes
- Plan
- Alerts

Sync settings are editable in the app through the gear button. Build and run it from Xcode on a Mac.

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
scp -r .\server jkothari@raspberrypi.local:~/localflow-sync/
```

6. On the Pi, create the Python environment and install the server dependencies:

```bash
cd ~/localflow-sync/server
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

7. Start the sync API:

```bash
cd ~/localflow-sync/server
source .venv/bin/activate
export LOCALFLOW_TOKEN='jfiweokgerhotrwhtr'
uvicorn app:app --host 127.0.0.1 --port 8787
```

Leave this terminal running. The SQLite database will be created automatically at:

```text
~/localflow-sync/server/localflow.sqlite3
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
sudo nano /etc/localflow-sync.env
```

Add:

```bash
LOCALFLOW_TOKEN=jfiweokgerhotrwhtr
LOCALFLOW_DB=/home/jkothari/localflow-sync/server/localflow.sqlite3
```

2. Create the service:

```bash
sudo nano /etc/systemd/system/localflow-sync.service
```

Add:

```ini
[Unit]
Description=LocalFlow Sync API
After=network-online.target tailscaled.service
Wants=network-online.target

[Service]
User=jkothari
WorkingDirectory=/home/jkothari/localflow-sync/server
EnvironmentFile=/etc/localflow-sync.env
ExecStart=/home/jkothari/localflow-sync/server/.venv/bin/uvicorn app:app --host 127.0.0.1 --port 8787
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

3. Enable and start it:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now localflow-sync
sudo systemctl status localflow-sync
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
cd ~/localflow-sync/server
source .venv/bin/activate
export LOCALFLOW_TOKEN='jfiweokgerhotrwhtr'
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
cd "PATH\TO\extension"
npm install
npm run build:chromium
```

6. Load the extension:

Open `chrome://extensions`, enable Developer mode, click "Load unpacked", and select:

```text
PATH\TO\extension\dist\chromium
```

7. Open a new tab, open Settings, go to Sync, and turn on "Use Tailscale sync".

Use these values:

```text
Server URL: https://raspberrypi.tail2db278.ts.net
Auth token: jfiweokgerhotrwhtr
```

The extension can still be used with this setting off. When sync is on and the Pi is reachable, it should pull the latest state from the Pi.

## Verify Sync

1. Turn on "Use Tailscale sync" in the extension settings on both computers.
2. Add a test todo on one computer.
3. Wait a few seconds.
4. Open or reload a new tab on the other computer.
5. The test todo should appear.

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

With sync turned off, a healthy standalone startup logs:

```text
[todo-sync] disabled in settings
```

If no `[todo-sync]` logs appear, Chrome is probably running an older unpacked extension. Remove it from `chrome://extensions`, rebuild with `npm run build:chromium` from `extension`, and load `extension/dist/chromium` again.

If Tailscale Serve stops working, rerun:

```bash
sudo tailscale serve --https=443 http://127.0.0.1:8787
tailscale serve status
```
