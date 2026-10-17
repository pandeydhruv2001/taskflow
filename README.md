# TaskFlow

TaskFlow is a private, vanilla JavaScript Kanban board with boards, columns, tasks, recurring work, timers, analytics, import/export, undo/redo, and browser-local persistence.

The visual system starts with `css/foundation.css`, which supplies layered modern CSS resets, tokens, responsive layout primitives, accessibility fallbacks, and reduced-motion behavior. Product-specific themes and components remain in the other CSS files.

## Run locally

TaskFlow uses ES modules, so serve it over HTTP rather than opening `index.html` directly.

```powershell
cd C:\Users\pande\Desktop\Projects\taskflow
node serve.mjs
```

Open [http://localhost:4173](http://localhost:4173). The included server has no dependencies and serves the project on port 4173.

## Test

Open [http://localhost:4173/tests.html](http://localhost:4173/tests.html) to run the dependency-free pure-logic test runner. It covers validation, normalized-state invariants, moves, WIP limits, column deletion, recurrence month-end handling, undo/redo, and import ID remapping.

## Key interactions

- `N` creates a task; `/` focuses search.
- `Ctrl+Z`, `Ctrl+Shift+Z`, or `Ctrl+Y` control history.
- `Alt+Arrow` moves/reorders a focused task.
- Drag cards to move/reorder, or use the card’s ↔ move control.
- Task timers update in place once per second; they no longer rerender the board.

## Data and privacy

All data lives in browser `localStorage`; there is no backend. Export JSON before clearing browser data. When two tabs edit the same workspace, the last valid committed state wins. Imported data is validated before it replaces or merges with local data.
