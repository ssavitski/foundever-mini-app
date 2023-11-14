<script setup lang="ts">
import { ref, computed, DefineComponent, defineExpose, VNodeRef } from "vue";
import { useInfiniteScroll } from "@vueuse/core";
import { Spinner } from "@/app.organizer";
import { TDynamicSort } from "./BaseDynamicSorts.vue";
import { useScroll } from '@vueuse/core'
import { TCryptoData } from "@/stores/crypto.types";


export type TParamsUpdateFilters = {
  ref: string,
  indexes: string[],
  values: string[],
};

type TDynamicsFilters = {
  [ref: string] : {
    indexes: string[],
    values: string[],
  }
};

type TProps = {
  items: Record<string, TCryptoData>,
  itemsByPage: number,
  blocCurrent: number,
  component: DefineComponent<any, any, any>,
  componentKey: keyof TCryptoData,
  noResultText: string,
  loaderColor?: string,
};

type TEmit = {
  (e: "onRequestNextBloc", {}): void,
  (e: "onChangeCurBloc", {}): void,
};

const props = defineProps<TProps>();
const emit = defineEmits<TEmit>();

const scroller = ref<VNodeRef & HTMLElement>();
const dynamicLoading = ref(false);
const dynamicFilters = ref({} as TDynamicsFilters);
const dynamicSorter = ref({} as TDynamicSort);


const filteredList = computed(() => {
  const filters = Object.entries(dynamicFilters.value)
  if (!filters.length) return Object.values(props.items);

  return Object.values(props.items).filter((item) => {
    for (let [, { indexes, values }] of filters) {
      for (let index of indexes) {
        for (let value of values) {
          if (
            (item[index as keyof TCryptoData] as string)
              .toLowerCase()
              .includes(value.toLowerCase())
          ) return true;
        }
      }
    }
  });
});

const orderedList = computed<TCryptoData[]>(() => {
  try {
    let ordered = filteredList.value.sort(dynamicSorter.value.sorter);
    if (dynamicSorter.value.order === "desc") ordered = ordered.reverse();
    return ordered;
  }
  catch(e) {
    console.warn(e);
    return filteredList.value;
  }
});

const optimizedList = computed(() => {
  return orderedList.value.slice(0, props.blocCurrent * props.itemsByPage);
});

let timeoutUpdateFilters: NodeJS.Timeout;

const onUpdateFilters = ({
  ref,
  indexes,
  values,
}: TParamsUpdateFilters) => {
  values = values.filter((e) => (e && e !== ''));
  if (values.length) {
    clearTimeout(timeoutUpdateFilters);
    dynamicLoading.value = true;
    timeoutUpdateFilters = setTimeout(() => {
      emit("onChangeCurBloc", 1);

      dynamicLoading.value = false;
      dynamicFilters.value[ref] = {
        indexes,
        values,
      };
      emit("onRequestNextBloc", optimizedList.value);
    }, 650);

    return;
  }

  delete dynamicFilters.value[ref];
  emit("onRequestNextBloc", optimizedList.value);
};

const onUpdateSorters = (sorter: TDynamicSort) => {
  dynamicSorter.value = sorter;
  emit("onRequestNextBloc", optimizedList.value);
};

const onReset = async() => {
  dynamicFilters.value = {} as TDynamicsFilters;

  emit("onChangeCurBloc", 1);

  if (scroller.value) scroller.value.scrollTo(0,0);
}

useScroll(scroller, { behavior: 'smooth' });

useInfiniteScroll(
  scroller,
  () => {
    emit("onChangeCurBloc", props.blocCurrent + 1);
    emit("onRequestNextBloc", orderedList.value.slice(0, (props.blocCurrent + 1) * props.itemsByPage));
  },
  { distance: 400 },
);

defineExpose({
  onUpdateFilters,
  onUpdateSorters,
  onReset,
});

</script>

<template>
  <div
    ref="scroller"
    class="scroller h-10 overflow-y-scroll flex-auto"
  >
    <div
      v-if="!optimizedList.length"
      class="flex flex-1 h-full text-4xl font-bold justify-center items-center"
      :style="{ color: props.loaderColor }"
    >
      {{ props.noResultText }}
    </div>
    <Spinner v-else-if="dynamicLoading" :color="props.loaderColor" />
    <template v-else>
      <component
        :is="props.component"
        v-for="item in optimizedList"
        :key="`${item[props.componentKey]}`"
        :item="item"
      />
    </template>
  </div>
</template>

<style lang="scss">
.scroller {
  scrollbar-color: #687dfa rgba(0,0,0,0.1);
  scrollbar-width: thin;
}
</style>
