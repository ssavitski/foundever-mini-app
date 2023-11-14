<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useMeta } from "vue-meta";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import { LayoutDashboard, ViewCryptoList, BaseLineCrypto } from "../app.organizer";

import { ROUTE_CRYPTO_OVERVIEW, ROUTE_CRYPTO_FAVORITES } from "../app.routes";
import { useCryptoStore } from "@/stores/crypto";

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

const cryptoStore = useCryptoStore();
const {
  cryptoList,
  cryptoFavorites,
} = cryptoStore;
const {
  isReadyCurrencies,
  isReadyCryptoList,
} = storeToRefs(cryptoStore);
const isReadyCryptoStore = computed(
  () => isReadyCurrencies.value && isReadyCryptoList.value
);

const viewProps = computed(() => ({
  title: routeIsHome.value ? print('cryptocurrency_prices') : print('cryptocurrency_favorites'),
  cryptoList: routeIsHome.value ? cryptoList : cryptoFavorites,
  component: BaseLineCrypto,
}));

</script>

<template>
  <LayoutDashboard>
    <section v-if="!isReadyCryptoStore" class="flex flex-1 relative">
      <BaseLoader :text="print('loading_data')" />
    </section>

    <ViewCryptoList
      v-else-if="routeIsHome || routeIsFavorites"
      v-bind="viewProps"
    />

    <router-view v-else />
  </LayoutDashboard>
</template>
