import json
import os
import sqlite3
import sys
import time
from pathlib import Path


DB_PATH = Path(os.getenv("LOCALFLOW_DB", "localflow.sqlite3"))
STORE = "tabliss/config"
PREFIX = f"{STORE}/"


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit("Usage: python import_backup.py path/to/backup.json")

    backup_path = Path(sys.argv[1])
    with backup_path.open("r", encoding="utf-8") as file:
        backup = json.load(file)

    conn = sqlite3.connect(DB_PATH)
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

    imported = 0
    now = int(time.time())
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

    conn.commit()
    print(f"Imported {imported} keys into {DB_PATH}")


if __name__ == "__main__":
    main()
