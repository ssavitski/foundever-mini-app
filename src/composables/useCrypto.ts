import useLocalStorage from "@/composables/useLocalStorage";
import useCurrencies from "@/composables/useCurrencies";
import useFavorites from "@/composables/useFavorites";
import { computed, readonly, ref } from "vue";
import useCrypto from "@/composables/api/useCrypto";
import {
  TCryptoList,
  TEntryCryptoData,
  TMarketParams,
  TCryptoData,
} from "./api/api";


const cryptoList = ref<TCryptoList>({});
const maxPerPage = 250;
const itemsByPage = 150;
const maxUriLength = 8000;
const blocCurrent = ref(1);

export default () => {
  const { currencyActive } = useCurrencies();
  const { changeFavorite, cryptoFavorites } = useFavorites();
  const { fetchCoins, fetchMarkets } = useCrypto();

  const isReadyCryptoList = computed(() => !!Object.keys(cryptoList.value).length);

  const fetchCryptoList = async (): Promise<void> => {
    //DevNote: It's for cache API request for dev and not pay it ...
    if (isReadyCryptoList.value) {
      return;
    }

    const cacheCryptoList = useLocalStorage.get("temp_crypto");

    if (cacheCryptoList && Object.keys(cacheCryptoList).length) {
      cryptoList.value = cacheCryptoList;
      return;
    }

    cryptoList.value = await fetchCoins();

    useLocalStorage.set("temp_crypto", cryptoList.value);
  };

  const calcAndFetchMarkets: (strIds: string) => Promise<TEntryCryptoData[]>[] = (strIds) => {
    let ids = strIds;
    let resp: Promise<TEntryCryptoData[]>[] = [];

    if (strIds.length > maxUriLength) {
      const str = strIds.substring(0, maxUriLength);

      if (ids[maxUriLength + 1] !== ',') {
        const strLength = str.lastIndexOf(',');
        const nextIds = ids.slice(strLength + 1);
        ids = ids.slice(0, strLength);
        resp = calcAndFetchMarkets(nextIds);
      }
    }

    const query: TMarketParams = {
      ids,
      vs_currency: currencyActive.value,
      per_page: maxPerPage,
      include_24h_vol: true,
      include_24hr_change: true,
      include_last_updated_at: true,
      sparkline: true,
    };

    return [...resp, fetchMarkets(query)];
  };

  const fetchCryptosInfos = async (optimizedList: TCryptoData[]): Promise<void> => {
    const requestIds = optimizedList.filter((crypto) => !crypto.pricesByCurrencies[currencyActive.value]);

    if (!requestIds.length) {
      return;
    }

    let reqs: Promise<TEntryCryptoData[]>[] = [];

    for (let i = 0; i < requestIds.length; i += maxPerPage) {
      const ids = requestIds.slice(i, i + maxPerPage).map((e) => e.id).join(",");

      reqs = reqs.concat(calcAndFetchMarkets(ids));
    }

    if (!reqs || !reqs.length) {
      return;
    }

    for (let j = 0; j < reqs.length; j++) {
      const responseArray = await reqs[j] || [];

      let i = 0;

      const fillCryptoInfo = () => {
        if (i < responseArray.length) {
          setTimeout(fillCryptoInfo);
        } else {
          return;
        }
  
        do {
          const {
            id: key,
            image,
            sparkline_in_7d: { price: sparkline_in_7d },
            current_price,
            market_cap,
            total_volume,
            price_change_24h,
          } = responseArray[i];

          const item = cryptoList.value[key];

          if (item) {
            item.image = image;
            item.sparkline_in_7d = sparkline_in_7d;
            item.pricesByCurrencies[currencyActive.value] = {
              current_price,
              market_cap,
              total_volume,
              price_change_24h,
            };
            cryptoList.value[key] = item;
            if (cryptoFavorites.value[key]) changeFavorite(item, key);
          }
  
          i++;
        } while (i % 50 != 0 && i < responseArray.length);
      };
  
      fillCryptoInfo();
    }
  };

  const setBlocCurrent = (value: number) => {
    blocCurrent.value = value;
  };

  return {
    cryptoList: readonly(cryptoList),
    isReadyCryptoList,
    fetchCryptoList,
    fetchCryptosInfos,
    itemsByPage,
    blocCurrent,
    setBlocCurrent,
  };
};