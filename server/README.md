# Todo List Sync Server

FastAPI and SQLite sync server for the extension.

## Raspberry Pi setup

```bash
cd ~/todolist-sync/server
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
export TODOLIST_TOKEN='replace-with-your-token'
uvicorn app:app --host 127.0.0.1 --port 8787
```

Import an exported extension storage backup:

```bash
python import_backup.py backup.json
```

Verify locally:

```bash
curl http://127.0.0.1:8787/health
curl -H "Authorization: Bearer replace-with-your-token" \
  http://127.0.0.1:8787/v1/stores/tabliss/config
```

Expose privately over Tailscale:

```bash
sudo tailscale serve --https=443 http://127.0.0.1:8787
tailscale serve status
```
