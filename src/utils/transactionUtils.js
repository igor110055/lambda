export const getProgress = (tx) => {
  if (!tx) return { span: 0, progress: 0 };

  const startDate = new Date(tx.date).getTime();
  const completeDate = new Date(tx.date).setDate(
    new Date(tx.date).getDate() + tx.duration
  );
  const span = completeDate - startDate;
  const elapsed = Date.now() - startDate;
  let progress = elapsed / span;
  if (progress > 1) progress = 1;
  if (progress < 0) progress = 0;

  return { span, progress };
};

export const getCurrentProfit = (tx) => {
  let profit;

  if (!tx.autoIncrement) {
    profit = tx.profit;
  } else {
    const { progress } = getProgress(tx);
    profit = tx.profit * progress;
  }

  return profit + (tx.extra || 0);
};
