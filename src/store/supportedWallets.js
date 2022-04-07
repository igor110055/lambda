const supportedWallets = [
  {
    name: "Bitcoin",
    symbol: "BTC",
    id: "bitcoin",
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    id: "ethereum",
  },
  {
    name: "Litecoin",
    symbol: "LTC",
    id: "litecoin",
  },
  {
    name: "Ripple",
    symbol: "XRP",
    id: "ripple",
  },
  {
    name: "Bitcoin Cash",
    symbol: "BCH",
    id: "bitcoin-cash",
  },
  {
    name: "Chainlink",
    symbol: "LINK",
    id: "link",
  },
  {
    name: "Binance Coin",
    symbol: "BNB",
    id: "binancecoin",
  },
  {
    name: "Dogecoin",
    symbol: "DGE",
    id: "dogecoin",
  },
  {
    name: "Monero",
    symbol: "XMR",
    id: "monero",
  },
  {
    name: "Stellar",
    symbol: "XLM",
    id: "stellar",
  },
  {
    name: "Tron",
    symbol: "TRX",
    id: "tron",
  },
  {
    name: "Tether",
    symbol: "USDT",
    id: "tether",
  },
  {
    name: "USD Coin",
    symbol: "USDC",
    id: "usd-coin",
  },
  {
    name: "Tezos",
    symbol: "XTZ",
    id: "tezos",
  },
];

export const fiatWallets = [
  {
    name: "US Dollar",
    symbol: "USDC",
    id: "usd",
    visible: (user) => user?.profile?.country === "United States"
  }
];

export const getFiat = (id) => fiatWallets.find((w) => w.id.toLowerCase() === id?.toLowerCase())

export const getWalletId = (symbol) => {
  const wallet = supportedWallets.find(
    (w) => w.symbol.toLowerCase() === symbol?.toLowerCase()
  );
  return wallet?.id || "usd-coin";
};

export default supportedWallets;
