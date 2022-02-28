import useSWR from "swr";

import { useWallets } from "./useWallets";

import axiosInstance from "../utils/axios";
import { parseBalance, rawBalance } from "../utils/parseBalance";

import { getWalletId } from "../store/supportedWallets";

const fetchCoinGecko = (ids) => {
  const coingecko = "https://api.coingecko.com/api/v3/simple/price";
  return axiosInstance
    .get(coingecko, {
      params: { ids, vs_currencies: "usd", include_24hr_change: "true" },
    })
    .then((res) => res.data);
};

export const useCoinValue = (symbol, usd = 1) => {
  if (symbol === "nft") symbol = "tether"
  
  const { wallets } = useWallets();
  const ids = wallets?.map((w) => getWalletId(w.symbol)).join(",");

  const { data } = useSWR(ids, fetchCoinGecko, {
    dedupingInterval: 10000,
  });

  const result = data
    ? data[getWalletId(symbol)] || { usd: 1, usd_24h_change: 1 }
    : { usd: 0, usd_24h_change: 0 };
  const rate = result.usd;

  const price = parseBalance(rate);
  const amount = parseBalance(rawBalance(usd) / parseFloat(rate), 8);
  const change = parseBalance(result.usd_24h_change);

  return { rate: price, amount, change };
};
