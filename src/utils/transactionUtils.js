export const getCurrentProfit = (tx) => {
  let profit;
  if (!tx.autoIncrement) {
    profit = tx.profit;
  } else {
    const startDate = new Date(tx.date).getTime();
    const completeDate = new Date(tx.date).setDate(
      new Date(tx.date).getDate() + tx.duration
    );
    const span = completeDate - startDate;
    const elapsed = Date.now() - startDate;
    let progress = elapsed / span;
    if (progress > 1) progress = 1;
    if (progress < 0) progress = 0;

    profit = tx.profit * progress;
  }

  return profit + (tx.extra || 0);
};
