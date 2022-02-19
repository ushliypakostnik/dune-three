<template>
  <div class="design-panel">
    <ul class="design-panel__builds">
      <li
        v-for="(value, index) in CAN_BUILD"
        :key="`builds${value}`"
        class="design-panel__item"
        :class="[
          value === active && 'design-panel__item--active',
          index + 1 > status && 'design-panel__item--unavailable',
        ]"
        @click.prevent="changeActive(value)"
      >
        {{ $t(`${value}`) }}<br /><br />{{ OBJECTS[value].price }}$
      </li>
      <li></li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import { key } from '@/store';
import { useI18n } from 'vue-i18n';

import { OBJECTS, CAN_BUILD } from '@/utils/constants';

export default defineComponent({
  name: 'DesignPanel',

  setup() {
    const { t } = useI18n();

    const store = useStore(key);

    let changeActive: (value: string) => void;

    const active = computed(() => store.getters['layout/activeBuild']);
    const status = computed(() => store.getters['layout/buildStatus']);

    changeActive = (value: string) => {
      store.dispatch('layout/setField', {
        field: 'activeBuild',
        value,
      });
    };

    return {
      OBJECTS,
      CAN_BUILD,
      active,
      status,
      t,
      changeActive,
    };
  },
});
</script>

<style lang="stylus" scoped>
@import "~/src/stylus/_stylebase.styl"

$name = '.design-panel'

$design-panel__width = 23vw

{$name}
  position fixed
  overflow-y auto
  width $design-panel__width
  height 100%
  right 0
  top 0
  bottom 0
  z-index 1500
  background rgba(#000000, $opacites.funky)
  padding 1vw

  &__builds
    list-style none
    display grid
    grid-template-columns 1fr 1fr
    grid-gap 1vw

  &__item
    @extend $flexCenter
    text-align center
    height 10vw
    border 2px solid $colors.primary
    color $colors.primary
    text-decoration none
    $text("nina")

{$name}__item--active
  pointer-events none
  color $colors.active
  border 2px solid $colors.active

{$name}__item--unavailable
  pointer-events none
  $opacity("psy")

{$name}__item--active a
  color $colors.active

{$name}__item:hover
  cursor pointer
  color $colors.stone
  border 2px solid $colors.stone
</style>
