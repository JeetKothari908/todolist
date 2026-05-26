import json
import os
import sqlite3
import time
from contextlib import closing
from typing import Any

from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


DB_PATH = os.getenv("TODOLIST_DB", "todolist.sqlite3")
HISTORY_DB_PATH = os.getenv("TODOLIST_HISTORY_DB", "todolist_history.sqlite3")
AUTH_TOKEN = os.getenv("TODOLIST_TOKEN", "")
HISTORY_KEYS = {
    "data/widget/todo": "task",
    "data/widget/notes": "note",
    "data/widget/planOfDay": "plan",
}

app = FastAPI()
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
    conn.commit()
    return conn


def connect_history() -> sqlite3.Connection:
    conn = sqlite3.connect(HISTORY_DB_PATH)
    conn.execute("pragma foreign_keys = on")
    conn.executescript(
        """
        create table if not exists history_changes (
          id integer primary key autoincrement,
          store text not null,
          key text not null,
          kind text not null,
          value text,
          deleted integer not null default 0,
          recorded_at integer not null
        );

        create table if not exists tasks (
          id text primary key,
          contents text,
          completed integer,
          dismissed integer,
          due_date text,
          repeat text,
          parent_id text,
          list_id text,
          payload text not null,
          first_seen_at integer not null,
          last_seen_at integer not null
        );

        create table if not exists notes (
          id text primary key,
          type text not null,
          name text,
          parent_id text,
          contents text,
          deleted integer,
          deleted_at text,
          payload text not null,
          first_seen_at integer not null,
          last_seen_at integer not null
        );

        create table if not exists plans (
          plan_date text primary key,
          contents text not null,
          first_seen_at integer not null,
          last_seen_at integer not null
        );
        """
    )
    conn.commit()
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


def record_history(
    store: str,
    change: Change,
    recorded_at: int,
    conn: sqlite3.Connection,
) -> None:
    kind = HISTORY_KEYS.get(change.key)
    if kind is None:
        return

    value_json = None if change.deleted else json.dumps(change.value)
    conn.execute(
        """
        insert into history_changes (store, key, kind, value, deleted, recorded_at)
        values (?, ?, ?, ?, ?, ?)
        """,
        (store, change.key, kind, value_json, int(change.deleted), recorded_at),
    )

    if change.deleted or change.value is None:
        return

    if kind == "task":
        record_tasks(change.value, recorded_at, conn)
    elif kind == "note":
        record_notes(change.value, recorded_at, conn)
    elif kind == "plan":
        record_plans(change.value, recorded_at, conn)


def record_tasks(value: Any, recorded_at: int, conn: sqlite3.Connection) -> None:
    if not isinstance(value, dict) or not isinstance(value.get("items"), list):
        return

    for task in value["items"]:
        if not isinstance(task, dict) or not isinstance(task.get("id"), str):
            continue

        conn.execute(
            """
            insert into tasks (
              id, contents, completed, dismissed, due_date, repeat, parent_id,
              list_id, payload, first_seen_at, last_seen_at
            )
            values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            on conflict(id) do update set
              contents = excluded.contents,
              completed = excluded.completed,
              dismissed = excluded.dismissed,
              due_date = excluded.due_date,
              repeat = excluded.repeat,
              parent_id = excluded.parent_id,
              list_id = excluded.list_id,
              payload = excluded.payload,
              last_seen_at = excluded.last_seen_at
            """,
            (
                task["id"],
                task.get("contents"),
                bool_to_int(task.get("completed")),
                bool_to_int(task.get("dismissed")),
                task.get("dueDate"),
                json.dumps(task.get("repeat"))
                if task.get("repeat") is not None
                else None,
                task.get("parentId"),
                task.get("listId"),
                json.dumps(task),
                recorded_at,
                recorded_at,
            ),
        )


def record_notes(value: Any, recorded_at: int, conn: sqlite3.Connection) -> None:
    if not isinstance(value, dict) or not isinstance(value.get("items"), list):
        return

    for item in value["items"]:
        if not isinstance(item, dict) or not isinstance(item.get("id"), str):
            continue

        conn.execute(
            """
            insert into notes (
              id, type, name, parent_id, contents, deleted, deleted_at, payload,
              first_seen_at, last_seen_at
            )
            values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            on conflict(id) do update set
              type = excluded.type,
              name = excluded.name,
              parent_id = excluded.parent_id,
              contents = excluded.contents,
              deleted = excluded.deleted,
              deleted_at = excluded.deleted_at,
              payload = excluded.payload,
              last_seen_at = excluded.last_seen_at
            """,
            (
                item["id"],
                item.get("type") or "note",
                item.get("name"),
                item.get("parentId"),
                item.get("contents"),
                bool_to_int(item.get("deleted")),
                item.get("deletedAt"),
                json.dumps(item),
                recorded_at,
                recorded_at,
            ),
        )


def record_plans(value: Any, recorded_at: int, conn: sqlite3.Connection) -> None:
    if not isinstance(value, dict) or not isinstance(value.get("plans"), dict):
        return

    for plan_date, contents in value["plans"].items():
        if not isinstance(plan_date, str):
            continue

        conn.execute(
            """
            insert into plans (plan_date, contents, first_seen_at, last_seen_at)
            values (?, ?, ?, ?)
            on conflict(plan_date) do update set
              contents = excluded.contents,
              last_seen_at = excluded.last_seen_at
            """,
            (plan_date, str(contents), recorded_at, recorded_at),
        )


def bool_to_int(value: Any) -> int | None:
    if value is None:
        return None
    return int(bool(value))


@app.get("/health")
def health() -> dict[str, bool]:
    return {"ok": True}


@app.get("/v1/history/summary")
def history_summary(
    authorization: str | None = Header(default=None),
) -> dict[str, int]:
    check_auth(authorization)

    with closing(connect_history()) as conn:
        return {
            "changes": conn.execute(
                "select count(*) from history_changes",
            ).fetchone()[0],
            "tasks": conn.execute("select count(*) from tasks").fetchone()[0],
            "notes": conn.execute("select count(*) from notes").fetchone()[0],
            "plans": conn.execute("select count(*) from plans").fetchone()[0],
        }


@app.get("/v1/stores/{store:path}")
def get_store(
    store: str,
    authorization: str | None = Header(default=None),
) -> dict[str, list[dict[str, Any]]]:
    check_auth(authorization)

    with closing(connect()) as conn:
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

    with closing(connect()) as conn, closing(connect_history()) as history_conn:
        for change in body.changes:
            record_history(store, change, now, history_conn)
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
        conn.commit()
        history_conn.commit()

    return {"ok": True}
