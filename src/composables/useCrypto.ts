import useLocalStorage from "@/composables/useLocalStorage";
import useCurrencies from "@/composables/useCurrencies";
import useFavorites from "@/composables/useFavorites";
import { computed, readonly, ref } from "vue";
import {
  fetchCoins,
  fetchMarkets,
} from "@/api/crypto";
import {
  TCryptoList,
  TEntryCryptoData,
  TMarketParams,
  TCryptoData,
} from "@/api/api";


const cryptoList = ref<TCryptoList>({});
const itemsByPage = 150;

export default () => {
  const { currencyActive } = useCurrencies();
  const { changeFavorite, cryptoFavorites } = useFavorites();

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

  const fetchCryptosInfos = async (optimizedList: TCryptoData[]): Promise<void> => {
    const requestIds = optimizedList.filter((crypto) => !crypto.pricesByCurrencies[currencyActive]);

    if (!requestIds.length) {
      return;
    }

    const ids = requestIds.map((e) => e.id).join(",");

    const query: TMarketParams = {
      ids,
      vs_currency: currencyActive,
      per_page: itemsByPage,
      include_24h_vol: true,
      include_24hr_change: true,
      include_last_updated_at: true,
      sparkline: true,
    };

    const response = await fetchMarkets(query);

    if (!response) {
      return;
    }

    const responseArray: TEntryCryptoData[] = Object.values(response);

    if (!responseArray.length) {
      return;
    }

    for (let i = 0; i < responseArray.length; i++) {
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
        item.pricesByCurrencies[currencyActive] = {
          current_price,
          market_cap,
          total_volume,
          price_change_24h,
        };
        cryptoList.value[key] = item;
        if (cryptoFavorites.value[key]) changeFavorite(item, key);
      }
    }
  };

  return {
    cryptoList: readonly(cryptoList),
    isReadyCryptoList,
    fetchCryptoList,
    fetchCryptosInfos,
    itemsByPage,
  };
};