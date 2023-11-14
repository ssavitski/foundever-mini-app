<script setup lang="ts">

type TProps = {
  type: 'en' | 'fr';
  width?: string;
  isActive: boolean;
  mode: 'light' | 'dark',
};
const props = withDefaults(defineProps<TProps>(), {
  width: "30px",
  isLoading: false,
  isActive: true,
});

const imageSource = new URL(`../assets/img/flags/${props.type}.png`, import.meta.url).href;

</script>

<template>
  <div
    class="relative inline-block h-50 h-auto"
    :style="{ width: props.width }"
  >
    <img
      :class="{ isloading: props.isLoading, active: props.isActive, [props.mode]: true }"
      class="el-flags"
      :src="imageSource"
      style="width: 100%"
    />
  </div>
</template>

<style lang="scss" scoped>
.el-flags {
  transition: all 0.4s;

  &.active {
    border-radius: 5px;

    &.light {
      border: 2px solid rgba(0, 0, 0, 0.7);
    }

    &.dark {
      border: 2px solid rgba(255, 255, 255, 0.7);
    }
  }

  &:not(.active) {
    border-radius: 5px;
    cursor: pointer;
    opacity: 0.5;
    border: 2px solid rgba(0, 0, 0, 0);
  }

  &.isloading {
    border-radius: 5px;
    border: 2px dashed rgba(255, 255, 255, 0.4);
  }
}
</style>
