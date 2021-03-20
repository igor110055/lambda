export const getCurrentProfit = (tx) => {
  if (!tx.autoIncrement) {
    return tx.profit;
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

    return tx.profit * progress;
  }
};
