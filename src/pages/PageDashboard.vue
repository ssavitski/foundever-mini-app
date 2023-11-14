<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useMeta } from "vue-meta";
import { useI18n } from "vue-i18n";
import {
  LayoutDashboard,
  ViewCryptoList,
  BaseLineCrypto,
  BaseLoader,
} from "../app.organizer";

import { ROUTE_CRYPTO_OVERVIEW, ROUTE_CRYPTO_FAVORITES } from "../app.routes";
import useCrypto from "@/composables/useCrypto";
import useFavorites from "@/composables/useFavorites";
import useCurrencies from "@/composables/useCurrencies";


useMeta({
  title: "Cryptoleet",
  description: "Dashboard",
});

const router = useRouter();
const routeIsHome = computed(
  () => router.currentRoute.value.name === ROUTE_CRYPTO_OVERVIEW.name
);
const routeIsFavorites = computed(
  () => router.currentRoute.value.name === ROUTE_CRYPTO_FAVORITES.name
);

const { t: print } = useI18n();

const { cryptoList, isReadyCryptoList } = useCrypto();
const { cryptoFavorites } = useFavorites();
const { isReadyCurrencies } = useCurrencies();
const isReadyCryptoStore = computed(
  () => isReadyCurrencies.value && isReadyCryptoList.value
);

const viewProps = computed(() => ({
  title: routeIsHome.value ? print('cryptocurrency_prices') : print('cryptocurrency_favorites'),
  cryptoList: routeIsHome.value ? cryptoList.value : cryptoFavorites.value,
  component: BaseLineCrypto,
}));

</script>

<template>
  <LayoutDashboard>
    <section
      v-if="!isReadyCryptoStore"
      class="flex flex-1 relative"
    >
      <BaseLoader :text="print('loading_data')" />
    </section>

    <ViewCryptoList
      v-else-if="routeIsHome || routeIsFavorites"
      v-bind="viewProps"
    />

    <router-view v-else />
  </LayoutDashboard>
</template>
