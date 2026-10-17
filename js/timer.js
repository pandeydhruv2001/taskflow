export const formatDuration = (ms) => { const minutes = Math.floor(ms / 60000); return `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, "0")}m`; };
export function elapsedFor(task, timer, now = Date.now()) { return task.timeSpentMs + (timer.activeTaskId === task.id ? Math.max(0, now - new Date(timer.startedAt).getTime()) : 0); }
/**
 * Refresh only visible timer labels once per second. This deliberately does
 * not trigger a board render: a running clock must never tear down a dialog,
 * drag operation, or focused card.
 */
export function startTimerDisplay(store, update) {
  let timeoutId = 0;
  const tick = () => {
    if (store.getState().timer.activeTaskId) update(store.getState());
    timeoutId = window.setTimeout(tick, 1000 - (Date.now() % 1000));
  };
  tick();
  return () => window.clearTimeout(timeoutId);
}
