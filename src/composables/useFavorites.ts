import { readonly, ref } from "vue";
import { TCryptoData, TCryptoList } from "@/api/api";
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
  const addFavorite = ({ id, name }: TCryptoData) => {
    cryptoFavorites.value[id] = {
      id,
      name,
      symbol: name,
      pricesByCurrencies: {},
    };

    useLocalStorage.set(LOCALSTORAGE_CRYPTO_FAVORITES, cryptoFavorites);
  };

  const changeFavorite = (favorite: TCryptoData, key: string) => {
    cryptoFavorites.value[key] = favorite;
  };

  const removeFavorite = (crypto: TCryptoData) => {
    delete cryptoFavorites.value[crypto.id];
    useLocalStorage.set(LOCALSTORAGE_CRYPTO_FAVORITES, cryptoFavorites);
  };

  return {
    cryptoFavorites: readonly(cryptoFavorites),
    addFavorite,
    removeFavorite,
    changeFavorite,
  };
};