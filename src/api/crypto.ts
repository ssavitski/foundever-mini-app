import instance from "./instance";
import type {
  TCryptoList,
  TCryptoItem,
  TEntryCryptoData,
} from "@/stores/crypto.types";
import type {
  TCurrencies,
  TCoins,
  TMarkets,
} from "./api";


export const fetchCurrencies: () => TCurrencies = () => {
  return instance
    .get<string[]>('/simple/supported_vs_currencies')
    .then(({ data }) => data);
};

export const fetchCoins: TCoins = () => {
  return instance
    .get<TCryptoItem[]>('/coins/list')
    .then(({ data }) => data.reduce((list: TCryptoList, item: TCryptoItem) => {
      list[item.id] = { ...item, pricesByCurrencies: {} };

      return list;
    }, {}))
    .catch(error => {
      console.error(error);

      return {};
    });
};

export const fetchMarkets: TMarkets = (params = {}) => {
  return instance
    .get<TEntryCryptoData[]>('/coins/markets', { params })
    .then(({ data }) => data);
};

const cryptoApi = {
  fetchCurrencies,
  fetchCoins,
  fetchMarkets,
};

export default cryptoApi;
