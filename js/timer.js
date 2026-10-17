export const formatDuration = (ms) => { const minutes = Math.floor(ms / 60000); return `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, "0")}m`; };
export function elapsedFor(task, timer, now = Date.now()) { return task.timeSpentMs + (timer.activeTaskId === task.id ? Math.max(0, now - new Date(timer.startedAt).getTime()) : 0); }
/** Single optimized display loop; it cleans itself up for the page lifecycle. */
export function startTimerDisplay(store, render) { let frame; const tick = () => { if (store.getState().timer.activeTaskId) render(); frame = requestAnimationFrame(tick); }; frame = requestAnimationFrame(tick); return () => cancelAnimationFrame(frame); }
