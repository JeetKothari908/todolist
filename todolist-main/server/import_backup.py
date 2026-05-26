import json
import sqlite3
import sys
import time
from contextlib import closing
from pathlib import Path

from app import Change, DB_PATH, connect_history, record_history

STORE = "tabliss/config"
PREFIX = f"{STORE}/"


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit("Usage: python import_backup.py path/to/backup.json")

    backup_path = Path(sys.argv[1])
    with backup_path.open("r", encoding="utf-8") as file:
        backup = json.load(file)

    imported = 0
    history_imported = 0
    now = int(time.time())
    with closing(sqlite3.connect(DB_PATH)) as conn, closing(
        connect_history(),
    ) as history_conn:
        conn.execute(
            """
            create table if not exists kv (
              store text not null,
              key text not null,
              value text,
              deleted integer not null default 0,
              updated_at integer not null,
              primary key (store, key)
            )
            """
        )

        for full_key, value in backup.items():
            if not full_key.startswith(PREFIX):
                continue

            key = full_key[len(PREFIX) :]
            conn.execute(
                """
                insert into kv (store, key, value, deleted, updated_at)
                values (?, ?, ?, 0, ?)
                on conflict(store, key) do update set
                  value = excluded.value,
                  deleted = 0,
                  updated_at = excluded.updated_at
                """,
                (STORE, key, json.dumps(value), now),
            )
            imported += 1

            change = Change(key=key, value=value)
            record_history(STORE, change, now, history_conn)
            if key in {
                "data/widget/todo",
                "data/widget/notes",
                "data/widget/planOfDay",
            }:
                history_imported += 1

        conn.commit()
        history_conn.commit()

    print(f"Imported {imported} keys into {DB_PATH}")
    print(f"Imported {history_imported} history snapshots into the history database")


if __name__ == "__main__":
    main()
