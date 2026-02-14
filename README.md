Basic web extension for google chrome that changes your default new tab to have a decent to do list. 

## Overview

This is a Chrome extension built on top of [Tabliss](https://tabliss.io), a customizable New Tab page. It replaces your default new tab with a beautiful dashboard featuring a background wallpaper, search bar, clock, optional quotes, and most importantly, a full-featured task manager.

The project is built with **React 18**, **TypeScript**, and **Sass**, bundled with **Webpack**. It uses a plugin architecture where backgrounds and widgets are modular and can be added or removed. All user data is persisted to the browser's sync storage via a custom IndexedDB-backed reactive database.

### Build & Run

1. `npm install` to install dependencies.
2. `npm run build:chromium` to produce a production Chromium build (output goes to `dist/`).
3. Load the unpacked extension from `dist/` in `chrome://extensions`.

For development: `npm run dev:chromium` runs Webpack in watch mode.

### Settings

Clicking the gear icon (top-left) or pressing **S** opens the settings panel, where you can:

- Change the background wallpaper and its display settings (blur, luminosity).
- Toggle the **Quotes** widget on or off via a checkbox under the "Widgets" section.
- Change the language and time zone.
- Import, export, or reset all settings.

---

## How the To-Do List Works

The task manager is the core feature. It is a Momentum-style two-panel widget rendered in the bottom-right corner of the new tab page (only visible when the browser window is maximized or fullscreen).

### Two Panels

- **"Due Today"** — Shows tasks that are due today, overdue (due date in the past), or whose repeat schedule includes today. Can be toggled to show **"Finished Tasks"** instead.
- **"Inbox"** — Shows all other active tasks (no due date, or due in the future). Tasks are sorted by due date.

### Task Data Model

Each task is stored as a flat object:

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique identifier (generated via `nanoid`) |
| `contents` | `string` | The task text |
| `completed` | `boolean` | Whether the checkbox has been checked |
| `dismissed` | `boolean` | Whether the task has been sent to the Finished Tasks list |
| `dueDate` | `string?` | Optional due date in `YYYY-MM-DD` format |
| `repeat` | `Repeat?` | Optional recurring schedule (daily, weekly, or custom days) |
| `parentId` | `string?` | Links a completed repeat instance back to its parent task |

All tasks are stored as a single flat array and persisted automatically to the browser's sync storage via the `useSavedReducer` hook, which wraps React's `useReducer` and saves on every state change.

### Task Lifecycle

1. **Creating a task** — Type in the input field and press Enter or click the add button. You can optionally set a due date and/or a repeat schedule (daily, weekly, or specific days of the week) via the expandable menu.

2. **Checking off a task** — Clicking the checkbox marks the task as `completed`. The task **stays in its current list** (Due Today or Inbox) with strikethrough text and a blue filled checkbox. An "x" icon appears next to the task text.

3. **Dismissing a task** — Clicking the "x" icon on a checked-off task sets it as `dismissed`, which moves it to the **Finished Tasks** list. This is a two-step process: check off first, then dismiss.

4. **Unchecking a task** — Clicking the checkbox again on a completed task unchecks it and clears the dismissed flag, returning it to its normal active state.

5. **Deleting a task** — Open the task's options menu (three-dot icon on the right) to access due date/repeat settings or remove the task entirely.

### Overdue Tasks

Tasks with a due date before today are shown in the **"Due Today"** panel with their text and due date rendered in **red** to indicate they are overdue.

### Repeat Tasks

Tasks can be set to repeat on a schedule:

- **Daily** — due every day.
- **Weekly** — due on a specific day each week.
- **Custom** — due on selected days of the week (e.g., Mon/Wed/Fri).

When completing a repeating task, a menu appears with two options:

- **"Complete Instance"** — Marks just today's occurrence as done. A completed child record is created (linked via `parentId`), and the parent task's due date advances to the next scheduled occurrence.
- **"Complete Task"** — Permanently removes the entire repeating task.

### Finished Tasks

The "Finished Tasks" view (accessed via the dropdown on the Due Today panel header) shows all dismissed tasks. The **"Remove Finished Items"** button in the list menu permanently deletes all dismissed items.

### State Management

The task list uses a reducer pattern with the following actions:

| Action | Effect |
|---|---|
| `ADD_TODO` | Creates a new task |
| `REMOVE_TODO` | Permanently deletes a task |
| `TOGGLE_TODO` | Checks/unchecks a task (clears dismissed flag on uncheck) |
| `DISMISS_TODO` | Sends a completed task to the Finished Tasks list |
| `UPDATE_TODO` | Edits the task text (inline editing) |
| `UPDATE_TODO_META` | Updates due date and repeat settings |
| `COMPLETE_INSTANCE` | Marks a single occurrence as completed |
| `COMPLETE_TASK` | Permanently removes a repeating task |
| `COMPLETE_REPEAT_INSTANCE` | Completes today's repeat occurrence and advances to next date |
| `UNCOMPLETE_REPEAT_INSTANCE` | Reverses a repeat completion |

### Key Files

| File | Purpose |
|---|---|
| `src/plugins/widgets/todo-plus/TodoPlus.tsx` | Main UI component (1100+ lines) — panels, input, menus, rendering |
| `src/plugins/widgets/todo-plus/TodoPlus.sass` | All styling for the task manager |
| `src/plugins/widgets/todo/reducer.ts` | State reducer — defines the Todo type and all state transitions |
| `src/plugins/widgets/todo/actions.ts` | Action creators for all task operations |
| `src/plugins/widgets/todo/types.ts` | Data type definitions and defaults |
| `src/hooks/useSavedReducer.ts` | Hook that auto-persists reducer state to the database |
| `src/db/state.ts` | Database schema and default widget configuration |
| `src/db/action.ts` | Database-level actions (add/remove/reorder widgets) |

