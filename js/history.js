import { cloneData } from "./utils.js";

/** Command history stores inverse operations, never whole-state snapshots. */
export function createHistory(limit = 50) {
  const undo = [], redo = [];
  return { push(command) { undo.push(command); if (undo.length > limit) undo.shift(); redo.length = 0; }, takeUndo() { const cmd = undo.pop(); if (cmd) redo.push(cmd); return cmd; }, takeRedo() { const cmd = redo.pop(); if (cmd) undo.push(cmd); return cmd; }, canUndo: () => undo.length > 0, canRedo: () => redo.length > 0, clear: () => { undo.length = 0; redo.length = 0; } };
}

/** Build inverse commands from the stable state immediately before an action. */
export function inverseFor(state, action) {
  const p = action.payload || {}, task = state.tasksById[p.taskId], column = state.columnsById[p.columnId];
  switch (action.type) {
    case "TASK_CREATE": return { undo: { type: "TASK_DELETE", payload: { taskId: p.task.id } }, redo: action };
    case "TASK_DELETE": return task ? { undo: { type: "TASK_CREATE", payload: { task: cloneData(task), restoreIndex: state.columnsById[task.columnId].taskIds.indexOf(task.id) } }, redo: action } : null;
    case "TASK_EDIT": return task ? { undo: { type: "TASK_EDIT", payload: { taskId: task.id, changes: cloneData(Object.fromEntries(Object.keys(p.changes).map((key) => [key, task[key]]))) } }, redo: action } : null;
    case "TASK_MOVE": case "TASK_REORDER": if (!task) return null; { const source = state.columnsById[task.columnId]; const generatedTaskId = p.generatedTaskId || (p.targetColumnId && task.recurring ? `generated-${task.id}-${p.now || ""}` : undefined); const redo = { ...action, payload: { ...p, generatedTaskId } }; return { undo: { type: "TASK_MOVE", payload: { taskId: task.id, targetColumnId: source.id, targetIndex: source.taskIds.indexOf(task.id), removeGeneratedTaskId: generatedTaskId } }, redo }; }
    case "SUBTASK_ADD": return { undo: { type: "SUBTASK_DELETE", payload: { taskId: p.taskId, subtaskId: p.subtask.id } }, redo: action };
    case "SUBTASK_DELETE": { const item = task?.subtasks.find((s) => s.id === p.subtaskId); return item ? { undo: { type: "SUBTASK_ADD", payload: { taskId: p.taskId, subtask: cloneData(item) } }, redo: action } : null; }
    case "SUBTASK_TOGGLE": return { undo: action, redo: action };
    case "COLUMN_CREATE": return { undo: { type: "COLUMN_DELETE", payload: { columnId: p.column.id } }, redo: action };
    case "COLUMN_EDIT": return column ? { undo: { type: "COLUMN_EDIT", payload: { columnId: column.id, title: column.title, wipLimit: column.wipLimit } }, redo: action } : null;
    case "COLUMN_REORDER": { const board = state.boardsById[p.boardId || state.activeBoardId]; return board ? { undo: { type: "COLUMN_REORDER", payload: { boardId: board.id, columnId: p.columnId, targetIndex: board.columnIds.indexOf(p.columnId) } }, redo: action } : null; }
    case "BOARD_RENAME": { const board = state.boardsById[p.boardId]; return board ? { undo: { type: "BOARD_RENAME", payload: { boardId: board.id, name: board.name } }, redo: action } : null; }
    default: return null;
  }
}
