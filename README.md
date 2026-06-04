# Todolist

Personal todo workspace built around a customized Tabliss new-tab extension, a private FastAPI sync server, and a SwiftUI iOS client. The extension is still the main daily surface: it replaces the browser new tab with a dashboard that includes todos, notes, plan-of-day, clock/search/background widgets, and optional private sync.

This repo is based on [Tabliss](https://tabliss.io) by Joel Shepherd and is licensed under [GPL-3.0](LICENSE.txt).

![Todo List](logo.png)

## Project Summary

The project has these main parts:

| Path | Purpose |
|---|---|
| `todolist-extension/` | React 18, TypeScript, Sass, and Webpack browser extension/PWA. This is the main new-tab dashboard and contains the widgets for todos, notes, plan of the day, backgrounds, search, time, quotes, and other Tabliss features. |
| `server/` | FastAPI and SQLite key-value sync API. It stores extension/iOS data under a shared store path, supports bearer-token auth, and is intended to run privately on a Raspberry Pi behind Tailscale Serve. |
| `todolistapp/` | SwiftUI iOS client for todos, notes, plan of day, and local notification groups. It reads/writes the same synced records as the extension. |
| `docs/` | Extension-focused docs, contributing notes, changelog, and translation instructions. |
| `setup.md` | Operational runbook for setting up, restarting, and verifying the Raspberry Pi sync stack. |

At a data level, the browser extension and iOS app share the same JSON records in the `tabliss/config` store:

- `data/default-todo` for todo items, due dates/times, repeat rules, custom lists, completion, and dismissed state.
- `data/default-notes` for notes and note folders.
- `data/default-plan-of-day` for day-keyed plan text.

The sync server exposes:

- `GET /health`
- `GET /v1/stores/{store}`
- `POST /v1/stores/{store}/changes`

## Features

- Momentum-style new-tab todo dashboard.
- Todos with due dates, due times, overdue styling, custom lists, completed/finished state, and repeat rules.
- Notes widget with note/folder data that syncs across clients.
- Plan-of-day widget for date-specific planning.
- Customizable Tabliss widgets and backgrounds.
- Optional private sync through a Raspberry Pi, SQLite, and Tailscale Serve.
- SwiftUI iOS client with tabs for Todos, Notes, Plan, and Alerts.
- Local iOS notification groups for todo reminders.

## Setup

All setup instructions live in [setup.md](setup.md), including:

- Building and loading the browser extension.
- Running the local FastAPI sync server.
- Opening the SwiftUI iOS app.
- Setting up the Raspberry Pi sync server.
- Restarting, verifying, debugging, and connecting new devices.

## Important Files

| File | Purpose |
|---|---|
| `todolist-extension/src/plugins/widgets/todo-plus/TodoPlus.tsx` | Main extension todo UI: panels, due date/time controls, repeats, custom lists, sorting, and rendering. |
| `todolist-extension/src/plugins/widgets/todo/reducer.ts` | Todo state transitions and data behavior. |
| `todolist-extension/src/plugins/widgets/notes/Notes.tsx` | Notes widget UI. |
| `todolist-extension/src/plugins/widgets/planOfDay/PlanOfDay.tsx` | Plan-of-day widget UI. |
| `todolist-extension/src/lib/db/storage.ts` | Local storage and remote sync plumbing. |
| `todolist-extension/src/db/state.ts` | Default extension database state and sync startup. |
| `server/app.py` | FastAPI sync API and SQLite persistence. |
| `server/import_backup.py` | Imports an exported extension storage backup into the server database. |
| `todolistapp/todolistapp/SyncStore.swift` | iOS sync, caching, and shared data model mapping. |
| `todolistapp/todolistapp/Models.swift` | Swift models for todos, notes, plans, and remote changes. |
| `todolistapp/todolistapp/TodoNotificationStore.swift` | Local iOS notification scheduling for todo reminders. |

## Privacy

The extension does not use analytics, telemetry, advertising, cookies, or third-party tracking. By default, extension data is stored locally in browser storage.

This fork also supports optional private sync. When sync is configured, todos, notes, plan data, and settings are sent only to the configured sync server. The intended deployment is a private Raspberry Pi reachable through Tailscale, not a public hosted service.

Stored app data can include:

- Todo text, due dates, due times, repeat schedules, completion state, and custom lists.
- Notes and note folders.
- Plan-of-day text.
- Extension settings such as background, language, time zone, and widget configuration.

You can delete local extension data by resetting settings in the extension or uninstalling the extension. Server-side data lives in the SQLite database configured for the sync server.

## More Docs

- [Raspberry Pi sync setup and recovery](setup.md)
- [Sync server notes](server/README.md)
- [Extension docs](docs/todolist-extension.md)
- [Translation guide](docs/TRANSLATING.md)
- [Contributing](docs/CONTRIBUTING.md)
- [Changelog](docs/CHANGELOG.md)

## License

This project is licensed under the [GNU General Public License v3.0](LICENSE.txt).

Based on [Tabliss](https://tabliss.io) by [Joel Shepherd](https://github.com/joelshepherd/tabliss).
