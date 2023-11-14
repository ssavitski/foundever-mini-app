import { defineStore } from "pinia";
import useLocalStorage from "@/composables/useLocalStorage";
import { LOCALSTORAGE_CRYPTO_CURRENCY, LOCALSTORAGE_CRYPTO_FAVORITES } from "@/app.storages";
import type {
  TCryptoDefaultStates,
  TCryptoData,
  TEntryCryptoData,
  TMarketParams,
} from "./crypto.types";
import {
  fetchCurrencies,
  fetchCoins,
  fetchMarkets,
} from "@/api/crypto";

export const useCryptoStore = defineStore({
  id: "crypto",

  state: () =>
    ({
      cryptoList: {},
      currenciesList: [],
      currencyActive: useLocalStorage.get(LOCALSTORAGE_CRYPTO_CURRENCY) || 'eur',
      cryptoFavorites: _loadFavorites(),
      itemsByPage: 150,
    } as TCryptoDefaultStates),

  getters: {

    isReadyCurrencies: (state: TCryptoDefaultStates) => !!state.currenciesList.length,
    isReadyCryptoList: (state: TCryptoDefaultStates) => !!Object.keys(state.cryptoList).length,
  },

  actions: {
    async fetchCurrenciesList(): Promise<void> {
      //DevNote: It's for cache API request for dev and not pay it ...
      if (this.isReadyCurrencies) {
        return;
      }

      const cacheCurrencies = useLocalStorage.get("temp_currencies");

      if (cacheCurrencies?.length) {
        this.currenciesList = cacheCurrencies;
        return;
      } 

      this.currenciesList = await fetchCurrencies();
      useLocalStorage.set("temp_currencies", this.currenciesList);
    },

    async fetchCryptoList(): Promise<void> {
      //DevNote: It's for cache API request for dev and not pay it ...
      if (this.isReadyCryptoList) {
        return;
      }

      const cacheCryptoList = useLocalStorage.get("temp_crypto");

      if (cacheCryptoList && Object.keys(cacheCryptoList).length) {
        this.cryptoList = cacheCryptoList;
        return;
      }

      this.cryptoList = await fetchCoins();

      useLocalStorage.set("temp_crypto", this.cryptoList);
    },

    async fetchCryptosInfos(optimizedList: TCryptoData[]): Promise<void> {
      const requestIds = optimizedList.filter((crypto) => !crypto.pricesByCurrencies[this.currencyActive]);

      if (!requestIds.length) {
        return;
      }

      const ids = requestIds.map((e) => e.id).join(",");

      const query: TMarketParams = {
        ids,
        vs_currency: this.currencyActive,
        per_page: this.itemsByPage,
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

        const item = this.cryptoList[key];

        if (item) {
          item.image = image;
          item.sparkline_in_7d = sparkline_in_7d;
          item.pricesByCurrencies[this.currencyActive] = {
            current_price,
            market_cap,
            total_volume,
            price_change_24h,
          };
          this.cryptoList[key] = item;
          if (this.cryptoFavorites[key]) this.cryptoFavorites[key] = item;
        }
      }
    },

    setCurrencyActive(currency: string) {
      this.currencyActive = currency;
      useLocalStorage.set(LOCALSTORAGE_CRYPTO_CURRENCY, this.currencyActive);
    },

    addFavorite({ id, name }: TCryptoData) {
      this.cryptoFavorites[id] = {
        id,
        name,
        symbol: name,
        pricesByCurrencies: {},
      };

      useLocalStorage.set(LOCALSTORAGE_CRYPTO_FAVORITES, this.cryptoFavorites);
    },

    removeFavorite(crypto: TCryptoData) {
      delete this.cryptoFavorites[crypto.id];
      useLocalStorage.set(LOCALSTORAGE_CRYPTO_FAVORITES, this.cryptoFavorites);
    },
  },
});


const _loadFavorites = (): Record<string, TCryptoData> => {
  const favorites: Record<string, TCryptoData> = useLocalStorage.get(LOCALSTORAGE_CRYPTO_FAVORITES);

  if (favorites && Object.keys(favorites).length) {
    return favorites;
  }

  return {};
}