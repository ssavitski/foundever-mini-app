<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { onBeforeRouteUpdate } from "vue-router";
import {
  ref,
  computed,
  inject,
  DefineComponent,
  onMounted,
  Ref,
} from "vue";
import {
  BaseTitle,
  BaseInputFilter,
  BaseSelectFilter,
  BaseDynamicSorts,
  BaseDynamicList,
  BaseLineCrypto,
} from "@/app.organizer";
import useCurrencies from "@/composables/useCurrencies";
import useCrypto from "@/composables/useCrypto";
import { TCryptoData } from "@/api/api";
import { IAppProvider } from "@/providers/app";


const App = inject<IAppProvider>("App");

const props = defineProps<{
  title: string,
  cryptoList: Record<string, TCryptoData>,
  component: DefineComponent<any, any, any>,
}>();

const { t: print } = useI18n();

const { currenciesList, currencyActive, setCurrencyActive } = useCurrencies();
const { fetchCryptosInfos, itemsByPage, blocCurrent, setBlocCurrent } = useCrypto();

const dynamicController = ref() as Ref<typeof BaseDynamicList>;
const refInputFilter = ref() as Ref<typeof BaseInputFilter>;

const updatePricesForList = (orderedCryptoList: TCryptoData[]) => {
  const toUpdatePricesList = orderedCryptoList.filter((e) => !e.pricesByCurrencies[currencyActive.value]);

  fetchCryptosInfos(toUpdatePricesList);
};

const cryptoData = computed(() =>
  Object.values(props.cryptoList).slice(0, blocCurrent.value * itemsByPage)
);

const onCurrencyChange = (currency: string) => {
  if (currency !== currencyActive.value) {
    setCurrencyActive(currency);

    fetchCryptosInfos(cryptoData.value);
  }  
};

const currenciesListOptions = computed(() => {
  return currenciesList.value.map((c) => {
    return {
      value: c,
      label: c,
    };
  });
});

onBeforeRouteUpdate(() => {
  if (refInputFilter) refInputFilter.value.reset();
  if (dynamicController) dynamicController.value.onReset();
});

onMounted(async () => {
  fetchCryptosInfos(cryptoData.value);
});
</script>

<template>
  <div
    class="flex flex-1 flex-col pt-16 w-full lg:w-5/6 max-w-screen-xl self-center"
  >
    <div class="flex flex-col max-w-screen w-full bg-blue mx-auto">
      <div class="flex grid grid-cols-1 md:grid-cols-5">
        <div class="flex col-span-2 justify-center md:justify-start">
          <BaseTitle :text="title" class="-mt-3 mr-4 a-05 fadeInLeft" />
        </div>
        <div class="flex col-span-3 items-center justify-center md:justify-start mb-2 md:mb-0">
          <BaseInputFilter
            ref="refInputFilter"
            index="name"
            :search-indexes="['name', 'symbol']"
            :controller="dynamicController"
            class="rounded-l-full h-10 shadow p-2 outline-0 a-05 d-500 fadeInDown"
            :placeholder="print('search_a_name') + '...'"
          />
          <BaseSelectFilter
            index="currency"
            :default="currencyActive"
            :options="currenciesListOptions"
            @onChange="onCurrencyChange"
            class="rounded-r-full h-10 shadow uppercase font-bold pl-3 a-08 d-500 fadeInDown"
          />
        </div>
      </div>
      <div class="flex flex-1 mt-1">
        <BaseDynamicSorts
          class="h-10 pb-1 rounded-r-full shadowshadow a-05 d-200 fadeInDown"
          :controller="dynamicController"
        />
      </div>
    </div>

    <div v-if="cryptoData.length" class="db-list flex-1 flex flex-col p-1">
      <BaseDynamicList
        class="d-400 a-04 fadeInUp"
        component-key="id"
        ref="dynamicController"
        :items="props.cryptoList"
        :items-by-page="itemsByPage"
        :bloc-current="blocCurrent"
        :component="BaseLineCrypto"
        :no-result-text="print('no_result')"
        :loader-color="App?.theme.value === 'dark' ? 'white' : 'black'"
        @onRequestNextBloc="(data: TCryptoData[]) => updatePricesForList(data)"
        @onChangeCurBloc="(value: number) => setBlocCurrent(value)"
      />
    </div>
  </div>
</template>
