
export const manageTimer = (totalDuration, setRemainingTime, remainingTime, setShowExpiredModal) => {
  const timer = setInterval(() => {
    const startTime = Number(sessionStorage.getItem('A_B_C')) || 0;
    const expireTime = Number(sessionStorage.getItem('X_Y_Z')) || 0;
    const now = new Date().getTime();
    if (now !== startTime) {
      const elapsed = now - startTime;
      const newRemainingTime = totalDuration * 1000 - elapsed;
      const remainingSeconds = Math.floor(newRemainingTime / 1000);
      setRemainingTime(remainingSeconds);
    } else {
      setRemainingTime((prev) => prev - 1);
    }

    if (now >= expireTime || remainingTime <= 0) {
      setShowExpiredModal(true);
      clearInterval(timer);
    }
  }, 1000);

  return () => clearInterval(timer);
};
