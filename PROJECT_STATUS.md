# Project Status: Tabliss Chrome Extension with Enhanced Todo Widget

**Date:** February 9, 2026  
**Current Owner:** Jeet  
**Status:** Development - Feature Testing Phase

---

## Project Overview

Converting the [Tabliss](https://tabliss.io/) new-tab page into a Chrome extension with:
- Full Tabliss UI and functionality (backgrounds, widgets, settings)
- **New feature:** Enhanced todo widget anchored to bottom-right corner
- Support for offline storage and sync

**Final Deliverable:** Chrome extension (unpacked) that replaces the new-tab page.

---

## Current Progress

### ✅ Completed

- [x] Reviewed original Tabliss codebase structure and dependencies
- [x] Created standalone folder structure (`todo-extension/`)
- [x] Created minimal todo extension prototype (`todo-extension/`)
- [x] Copied full Tabliss codebase to `tabliss-fork/` for reference
- [x] Fixed npm package.json for Windows compatibility
  - Added `cross-env` package for environment variables
  - Replaced `node-sass` with `sass` (dart-sass, no native build)
- [x] Installed dependencies on `tabliss-main`: `npm install --ignore-scripts`
- [x] Started dev server successfully: `npm run dev:web`
- [x] App loads on `http://localhost:8080`

### ⚠️ In Progress

- [ ] Full functionality testing (loaded but needs verification)
- [ ] Identify bugs and missing features
- [ ] Build Chrome extension (production)

### 📋 Next Steps

1. **Test all features in dev mode:**
   - Time/greeting display
   - Background images
   - All widgets (time, greeting, search, weather, links, etc.)
   - Settings panel
   - Local storage persistence
   - Report any broken features

2. **Fix identified issues**

3. **Implement enhanced todo widget:**
   - Create new `src/plugins/widgets/todo-plus/` plugin
   - Features: due dates, subtasks, priorities, recurring
   - Position: bottom-right corner (floating)
   - Persistence: chrome.storage.local + fallback to localStorage

4. **Build and load as Chrome extension:**
   - Run: `npm run build:chromium`
   - Load unpacked: `dist/chromium/` folder

5. **Test in actual Chrome extension mode**

6. **Polish and deploy**

---

## Key Paths & Repos

```
c:\Users\jeetd\Documents\Github\todolist\
├── tabliss-main/          ← Active development (dev server running here)
├── tabliss-fork/          ← Copy for reference (built successfully)
├── todo-extension/        ← Minimal standalone extension (prototype, not currently used)
└── PROJECT_STATUS.md      ← This file
```

---

## Tech Stack

- **Frontend:** React 18 + TypeScript
- **Build:** Webpack 5 + Sass
- **Testing:** Jest
- **Storage:** Chrome.storage.local + IndexedDB fallback
- **Extension:** Manifest V3 (Chrome)

---

## NPM Scripts (tabliss-main)

```bash
# Start dev server (webpack-dev-server)
npm run dev:web

# Build for production (web)
npm run build:web

# Build for Chrome extension
npm run build:chromium

# Build for Firefox
npm run build:firefox

# Run tests
npm run test
```

---

## Known Issues & Notes

1. **Sass warnings (non-blocking):**
   - Legacy JS API deprecation warnings
   - Deprecated `darken()` color functions
   - Does not prevent build/runtime

2. **Windows compatibility:**
   - Fixed by adding `cross-env` to all scripts
   - Use `npm install --ignore-scripts` to avoid node-sass build

3. **No todo plugin yet:**
   - Removed from original codebase to avoid conflicts
   - Will add enhanced version after testing baseline

---

## Testing Checklist

After running `npm run dev:web` and opening `http://localhost:8080`:

- [ ] Page loads without errors
- [ ] Background image displays
- [ ] Time widget shows correct time
- [ ] Greeting widget shows appropriate message
- [ ] Other widgets render (search, weather, links, etc.)
- [ ] Settings panel opens (click gear icon or press 'S')
- [ ] Can add/remove widgets
- [ ] Can customize backgrounds
- [ ] Local storage persists on page reload
- [ ] No console errors
- [ ] No performance issues (lag, slowness)

---

## Chrome Extension Load Instructions

1. Run build: `npm run build:chromium` (in tabliss-main/)
2. Open `chrome://extensions`
3. Enable "Developer mode" (top-right toggle)
4. Click "Load unpacked"
5. Select: `c:\Users\jeetd\Documents\Github\todolist\tabliss-main\dist\chromium`
6. Open a new tab to see the extension in action

---

## Enhanced Todo Widget (Planned)

**Location:** `src/plugins/widgets/todo-plus/` (new)

**Features:**
- Add/edit/delete tasks
- Mark tasks complete (checkbox)
- Due dates (date + time picker)
- Subtasks (nested checklist)
- Priority levels (low/medium/high)
- Recurring flag (daily/weekly/monthly metadata)
- Sorting options (by priority, due date, custom)
- Clear completed tasks

**UI:**
- Compact floating panel, bottom-right corner
- Header with title + settings menu
- Scrollable task list
- Input field at bottom for new tasks
- Keyboard shortcut: 'T' to focus/toggle

**Storage:**
- Primary: `chrome.storage.local`
- Fallback: `localStorage` (when not in extension context)

---

## Questions & Decisions

- **React vs vanilla JS:** Keeping React (compiles to static bundle, easier to maintain)
- **Todo plugin approach:** Create new `todo-plus` plugin instead of modifying existing
- **Persistence:** Use existing chrome.storage adapter + fallback pattern
- **Scope:** Full Tabliss app first, then add enhanced todo feature

---

## Contacts & References

- **Tabliss GitHub:** https://github.com/tabliss/tabliss
- **Chrome Extension Docs:** https://developer.chrome.com/docs/extensions/
- **React:** https://react.dev/
- **TypeScript:** https://www.typescriptlang.org/

---

## Last Updated

**2026-02-09** – Initial project structure complete, dev server running, ready for feature testing
