import json
import os
import sqlite3
import time
from typing import Any

from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


DB_PATH = os.getenv("LOCALFLOW_DB", "localflow.sqlite3")
AUTH_TOKEN = os.getenv("LOCALFLOW_TOKEN", "")

app = FastAPI(title="LocalFlow Sync API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["authorization", "content-type"],
)


def connect() -> sqlite3.Connection:
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
    return conn


def check_auth(authorization: str | None) -> None:
    if AUTH_TOKEN and authorization != f"Bearer {AUTH_TOKEN}":
        raise HTTPException(status_code=401, detail="Unauthorized")


class Change(BaseModel):
    key: str
    value: Any | None = None
    deleted: bool = False


class Changes(BaseModel):
    changes: list[Change]


@app.get("/health")
def health() -> dict[str, bool]:
    return {"ok": True}


@app.get("/v1/stores/{store:path}")
def get_store(
    store: str,
    authorization: str | None = Header(default=None),
) -> dict[str, list[dict[str, Any]]]:
    check_auth(authorization)

    with connect() as conn:
        rows = conn.execute(
            "select key, value, deleted from kv where store = ? order by key",
            (store,),
        ).fetchall()

    changes = []
    for key, value, deleted in rows:
        if deleted:
            changes.append({"key": key, "deleted": True})
        else:
            changes.append({"key": key, "value": json.loads(value)})

    return {"changes": changes}


@app.post("/v1/stores/{store:path}/changes")
def apply_changes(
    store: str,
    body: Changes,
    authorization: str | None = Header(default=None),
) -> dict[str, bool]:
    check_auth(authorization)
    now = int(time.time())

    with connect() as conn:
        for change in body.changes:
            if change.deleted:
                conn.execute(
                    """
                    insert into kv (store, key, value, deleted, updated_at)
                    values (?, ?, null, 1, ?)
                    on conflict(store, key) do update set
                      value = null,
                      deleted = 1,
                      updated_at = excluded.updated_at
                    """,
                    (store, change.key, now),
                )
            else:
                conn.execute(
                    """
                    insert into kv (store, key, value, deleted, updated_at)
                    values (?, ?, ?, 0, ?)
                    on conflict(store, key) do update set
                      value = excluded.value,
                      deleted = 0,
                      updated_at = excluded.updated_at
                    """,
                    (store, change.key, json.dumps(change.value), now),
                )

    return {"ok": True}
