<template>
  <div class="design-panel">
    <ul>
      <li
        class="design-panel__item"
        :class="value === active && 'design-panel__item             --active'"
        v-for="value in CAN_BUILD"
        :key="`builds${value}`"
      >
        <a href="#" @click.prevent="changeLanguage(value)">{{ value }}</a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { CAN_BUILD } from '@/utils/constants';

import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DesignPanel',

  setup() {
    let changeActive: (value: string) => void;

    changeActive = () => {
      /* store.dispatch('layout/setField', {
        field: 'isPause',
        value: !isPause.value,
      }); */
    };

    return {
      CAN_BUILD,
      changeActive,
    };
  },
});
</script>

<style lang="stylus" scoped>
@import "~/src/stylus/_stylebase.styl"

$design-panel__width = 400px

.design-panel
  position fixed
  width $design-panel__width
  height 100%
  right 0
  top 0
  bottom 0
  z-index 1500
  background rgba(#000000, $opacites.funky)
</style>
