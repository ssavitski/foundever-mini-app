import { readonly, ref, computed } from "vue";
import useLocalStorage from "@/composables/useLocalStorage";
import {
  LOCALSTORAGE_CRYPTO_CURRENCY,
  LOCALSTORAGE_CRYPTO_CURRENCIES_LIST,
} from "@/app.storages";
import useCrypto from "@/composables/api/useCrypto";


const currenciesList = ref<string[]>([]);
const currencyActive = ref(useLocalStorage.get(LOCALSTORAGE_CRYPTO_CURRENCY) || 'eur');

export default () => {
  const { fetchCurrencies } = useCrypto();
  const isReadyCurrencies = computed(() => !!currenciesList.value.length);

  const fetchCurrenciesList = async (): Promise<void> => {
    //DevNote: It's for cache API request for dev and not pay it ...
    if (isReadyCurrencies.value) {
      return;
    }

    const cacheCurrencies = useLocalStorage.get(LOCALSTORAGE_CRYPTO_CURRENCIES_LIST);

    if (cacheCurrencies?.length) {
      currenciesList.value = cacheCurrencies;
      return;
    } 

    currenciesList.value = await fetchCurrencies();
    useLocalStorage.set(LOCALSTORAGE_CRYPTO_CURRENCIES_LIST, currenciesList.value);
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
