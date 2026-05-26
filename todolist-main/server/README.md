# Todo List Sync Server

FastAPI and SQLite sync server for the extension.

The server keeps two SQLite databases:

- `todolist.sqlite3`: functional sync state. It stores the latest value for each extension key.
- `todolist_history.sqlite3`: append-only history plus easy query tables for every task, note, and daily plan the server has seen.

## Raspberry Pi setup

```bash
cd ~/todolist-sync
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
export TODOLIST_TOKEN='replace-with-your-token'
export TODOLIST_DB='todolist.sqlite3'
export TODOLIST_HISTORY_DB='todolist_history.sqlite3'
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
curl -H "Authorization: Bearer replace-with-your-token" \
  http://127.0.0.1:8787/v1/history/summary
```

Expose privately over Tailscale:

```bash
sudo tailscale serve --https=443 http://127.0.0.1:8787
tailscale serve status
```

## History database

The history database is created automatically when the server receives matching sync data. It captures these extension keys:

- `data/widget/todo` into `tasks`
- `data/widget/notes` into `notes`
- `data/widget/planOfDay` into `plans`

Every matching sync payload is also preserved in `history_changes`, so previous snapshots remain available even when a task is completed, a note is deleted, or a plan is edited.

Inspect it on the Pi:

```bash
sqlite3 todolist_history.sqlite3 ".tables"
sqlite3 todolist_history.sqlite3 "select id, contents, first_seen_at, last_seen_at from tasks order by first_seen_at desc limit 10;"
sqlite3 todolist_history.sqlite3 "select plan_date, contents from plans order by plan_date desc limit 10;"
```
