const SESSION_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

let timeoutId: NodeJS.Timeout | null = null;
let activityTimeout: NodeJS.Timeout | null = null;

export function initializeSessionTimeout(onTimeout: () => void) {
  const resetTimeout = () => {
    if (timeoutId) clearTimeout(timeoutId);
    if (activityTimeout) clearTimeout(activityTimeout);

    timeoutId = setTimeout(() => {
      onTimeout();
    }, SESSION_TIMEOUT_MS);
  };

  const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

  const handleActivity = () => {
    resetTimeout();
  };

  events.forEach((event) => {
    window.addEventListener(event, handleActivity);
  });

  resetTimeout();

  return () => {
    events.forEach((event) => {
      window.removeEventListener(event, handleActivity);
    });
    if (timeoutId) clearTimeout(timeoutId);
    if (activityTimeout) clearTimeout(activityTimeout);
  };
}

export function clearSessionTimeout() {
  if (timeoutId) clearTimeout(timeoutId);
  if (activityTimeout) clearTimeout(activityTimeout);
}
