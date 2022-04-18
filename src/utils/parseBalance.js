export const parseBalance = (balance, decimals = 2) => {
  return (
    balance?.toLocaleString("en-US", {
      style: "decimal",
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals,
    }) || "0.00"
  );
};

export const rawBalance = (balance) =>
  parseFloat(balance.toString().replaceAll(",", ""));
