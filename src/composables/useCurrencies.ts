import { readonly, ref, computed } from "vue";
import useLocalStorage from "@/composables/useLocalStorage";
import { LOCALSTORAGE_CRYPTO_CURRENCY } from "@/app.storages";
import {
  fetchCurrencies,
} from "@/api/crypto";

const currenciesList = ref<string[]>([]);
const currencyActive = ref(useLocalStorage.get(LOCALSTORAGE_CRYPTO_CURRENCY) || 'eur');

export default () => {
  const isReadyCurrencies = computed(() => !!currenciesList.value.length);

  const fetchCurrenciesList = async (): Promise<void> => {
    //DevNote: It's for cache API request for dev and not pay it ...
    if (isReadyCurrencies.value) {
      return;
    }

    const cacheCurrencies = useLocalStorage.get("temp_currencies");

    if (cacheCurrencies?.length) {
      currenciesList.value = cacheCurrencies;
      return;
    } 

    currenciesList.value = await fetchCurrencies();
    useLocalStorage.set("temp_currencies", currenciesList.value);
  };

  const setCurrencyActive = (currency: string) => {
    currencyActive.value = currency;
    useLocalStorage.set(LOCALSTORAGE_CRYPTO_CURRENCY, currencyActive.value);
  };

  return {
    currenciesList: readonly(currenciesList),
    currencyActive: readonly(currencyActive),
    isReadyCurrencies,
    setCurrencyActive,
    fetchCurrenciesList,
  };
};
