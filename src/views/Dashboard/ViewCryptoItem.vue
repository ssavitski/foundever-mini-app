<script setup lang="ts">
import { onMounted, computed } from "vue";
import { BaseCardCrypto } from "@/app.organizer";
import useCrypto from "@/composables/useCrypto";
import { TCryptoData } from "@/api/api";
import { useRouter } from "vue-router";
import { ROUTE_CRYPTO_OVERVIEW } from "@/app.routes";


const router = useRouter();
const { id } = router.currentRoute.value.params;

const { fetchCryptosInfos, cryptoList } = useCrypto();

const item = computed(() => cryptoList.value[`${id}`] as TCryptoData);


onMounted(() => {
  if (!item.value) {
    router.push({ name: ROUTE_CRYPTO_OVERVIEW.name });
  }

  fetchCryptosInfos([item.value]);
});

</script>

<template>
  <div class="flex flex-1 relative">
    <BaseCardCrypto :item="item" />
  </div>
</template>
