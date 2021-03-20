import { parseBalance } from "./parseBalance";
import { getCurrentProfit } from "./transactionUtils";

// get transactions not greater than current date
export const toDateTransactions = (txs) =>
  txs?.filter(
    (tx) =>
      new Date(tx.date).setHours(0, 0, 0, 0) <= new Date().setHours(0, 0, 0, 0)
  );

// total
export const total = (txs) => {
  const balance = toDateTransactions(txs)?.reduce((total, tx) => {
    let sum = total + tx.amount;
    if (tx.profit) sum += getCurrentProfit(tx);
    return sum;
  }, 0);
  return parseBalance(balance);
};

// available
export const available = (txs) => {
  const balance = toDateTransactions(txs)?.reduce((total, tx) => {
    if (tx.type === "investment") {
      let sum = total + tx.amount;
      const startDate = new Date(tx.date);
      const completeDate = startDate.setDate(startDate.getDate() + tx.duration);
      const complete = new Date() > completeDate;
      if (complete) sum += getCurrentProfit(tx);
      return sum;
    } else {
      return total + tx.amount;
    }
  }, 0);
  return parseBalance(balance);
};

// total
export const bonus = (txs) => {
  const balance = txs
    ?.filter((tx) => tx.type === "referral")
    ?.reduce((total, tx) => total + tx.amount, 0);
  return parseBalance(balance);
};

// total
export const deposit = (txs) => {
  const balance = toDateTransactions(txs)
    ?.filter((tx) => tx.type === "deposit")
    ?.reduce((total, tx) => total + tx.amount, 0);
  return parseBalance(balance);
};

// total
export const profit = (txs) => {
  const balance = toDateTransactions(txs)
    ?.filter((tx) => tx.type === "investment")
    ?.reduce((total, tx) => total + getCurrentProfit(tx), 0);
  return parseBalance(balance);
};
