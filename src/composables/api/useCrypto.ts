import useInstance from "./useInstance";
import type {
  TCurrencies,
  TCoins,
  TMarkets,
  TCryptoList,
  TEntryCryptoData,
  TCryptoItem,
} from "./api";
import { useToast } from "vue-toast-notification";


export default () => {
  const instance = useInstance();
  const $toast = useToast();

  const fetchCurrencies: () => TCurrencies = () => {
    return instance
      .get<string[]>('/simple/supported_vs_currencies')
      .then(({ data }) => data);
  };
  
  const fetchCoins: TCoins = () => {
    return instance
      .get<TCryptoItem[]>('/coins/list')
      .then(({ data }) => data.reduce((list: TCryptoList, item: TCryptoItem) => {
        list[item.id] = { ...item, pricesByCurrencies: {} };
  
        return list;
      }, {}))
      .catch(error => {
        console.error(error);

        $toast.open({
          message: error,
          type: 'error',
        });
  
        return {};
      });
  };
  
  const fetchMarkets: TMarkets = (params = {}) => {
    return instance
      .get<TEntryCryptoData[]>('/coins/markets', { params })
      .then(({ data }) => data);
  };

  return {
    fetchCurrencies,
    fetchCoins,
    fetchMarkets,
  };
};
