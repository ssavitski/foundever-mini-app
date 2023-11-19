import { readonly, ref } from "vue";
import { TCryptoData, TCryptoList } from "@/composables/api/api";
import useLocalStorage from "@/composables/useLocalStorage";
import { LOCALSTORAGE_CRYPTO_FAVORITES } from "@/app.storages";


const loadFavorites = (): TCryptoList => {
  const favorites: TCryptoList = useLocalStorage.get(LOCALSTORAGE_CRYPTO_FAVORITES);

  if (favorites && Object.keys(favorites).length) {
    return favorites;
  }

  return {};
};

const cryptoFavorites = ref<TCryptoList>(loadFavorites());

export default () => {
  const addFavorite = ({ id, name, category, image, sparkline_in_7d, pricesByCurrencies }: TCryptoData) => {
    cryptoFavorites.value[id] = {
      id,
      name,
      image,
      category,
      sparkline_in_7d,
      symbol: name,
      pricesByCurrencies: Object.keys(pricesByCurrencies).length ? pricesByCurrencies : {},
    };

    useLocalStorage.set(LOCALSTORAGE_CRYPTO_FAVORITES, cryptoFavorites.value);
  };

  const changeFavorite = (favorite: TCryptoData, key: string) => {
    cryptoFavorites.value[key] = favorite;
  };

  const removeFavorite = (crypto: TCryptoData) => {
    delete cryptoFavorites.value[crypto.id];
    useLocalStorage.set(LOCALSTORAGE_CRYPTO_FAVORITES, cryptoFavorites.value);
  };

  return {
    cryptoFavorites: readonly(cryptoFavorites),
    addFavorite,
    removeFavorite,
    changeFavorite,
  };
};