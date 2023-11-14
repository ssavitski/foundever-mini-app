<script setup lang="ts">
import { onMounted, provide } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import "./assets/css/index.css";
import "./assets/css/animate.css";
import { useAppProvider, IAppProvider } from "@/providers/app";
import useCrypto from "@/composables/useCrypto";
import useCurrencies from "@/composables/useCurrencies";


const router = useRouter();
const App: IAppProvider = useAppProvider(router);
provide("App", App);

const { locale } = useI18n();
locale.value = App.lang.value;

const { fetchCryptoList } = useCrypto();
const { fetchCurrenciesList } = useCurrencies();

onMounted(() => {
  fetchCurrenciesList();
  fetchCryptoList();
});
</script>

<template>
  <div id="app" :class="[App.theme.value]">
    <router-view />
  </div>
</template>
