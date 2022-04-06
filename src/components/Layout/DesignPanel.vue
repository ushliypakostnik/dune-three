<template>
  <div class="design-panel">
    <div class="design-panel__tabs">
      <button
        class="design-panel__button"
        :class="{ 'design-panel__button--disabled': !isBuilds }"
        type="button"
        @click.prevent.stop="setIsBuilds"
      >
        {{ $t('builds') }}
      </button>

      <button
        class="design-panel__button"
        :class="{ 'design-panel__button--disabled': isBuilds }"
        type="button"
        @click.prevent.stop="setIsBuilds"
      >
        {{ $t('units') }}
      </button>
    </div>

    <div v-if="!isBuilds">
      <button
        class="design-panel__button"
        :class="{ 'design-panel__button--disabled': !isSelected }"
        type="button"
        @click.prevent.stop="setSell"
      >
        {{ $t('sell') }}
      </button>

      <ul
        class="design-panel__builds"
        :class="{ 'design-panel__builds--active': !isBuildingClock }"
      >
        <li
          v-for="value in CAN_BUILD"
          :key="`builds${value}`"
          class="design-panel__item"
          :class="[value === active && 'design-panel__item--active']"
          @click.prevent="changeActive(value)"
        >
          <div
            v-if="buildingProgress && value === active"
            class="design-panel__progress"
            :style="`height: ${buildingProgress}%`"
          />
          <div>
            <div class="design-panel__header">{{ $t(`${value}`) }}</div>
            <div class="design-panel__text design-panel__text--subheader">
              {{ $t('need') }}:
            </div>
            <div class="design-panel__text">
              {{ $t('cash') }}: {{ OBJECTS[value].need.cash }}
            </div>
            <div class="design-panel__text">
              {{ $t('energy') }}: {{ OBJECTS[value].need.energy }}
            </div>
            <div class="design-panel__text">
              {{ $t('food') }}: {{ OBJECTS[value].need.food }}
            </div>
            <div
              v-if="
                OBJECTS[value].gives.cash ||
                OBJECTS[value].gives.energy ||
                OBJECTS[value].gives.food
              "
              class="design-panel__text design-panel__text--subheader"
            >
              {{ $t('gives') }}:
            </div>
            <div v-if="OBJECTS[value].gives.cash" class="design-panel__text">
              {{ $t('cash') }}: +{{ OBJECTS[value].gives.cash }}
            </div>
            <div v-if="OBJECTS[value].gives.energy" class="design-panel__text">
              {{ $t('energy') }}: +{{ OBJECTS[value].gives.energy }}
            </div>
            <div v-if="OBJECTS[value].gives.food" class="design-panel__text">
              {{ $t('food') }}: +{{ OBJECTS[value].gives.food }}
            </div>
          </div>
        </li>
      </ul>
    </div>

    <div v-else></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, Ref } from 'vue';
import { useStore } from 'vuex';
import { key } from '@/store';
import { useI18n } from 'vue-i18n';

import { OBJECTS, CAN_BUILD } from '@/utils/constants';

export default defineComponent({
  name: 'DesignPanel',

  setup() {
    const { t } = useI18n();

    const store = useStore(key);

    let isBuilds: Ref<boolean> = ref(false);

    let changeActive: (value: string) => void;
    let setSell: () => void;
    let setIsBuilds: () => void;

    const active = computed(() => store.getters['layout/activeBuild']);
    const isBuildingClock = computed(
      () => store.getters['game/isBuildingClock'],
    );
    const buildingProgress = computed(
      () => store.getters['game/buildingProgress'],
    );
    const isSelected = computed(() => store.getters['game/isSelected']);

    setSell = () => {
      store.dispatch('game/setField', {
        field: 'isSell',
        value: true,
      });
    };

    setIsBuilds = () => {
      isBuilds.value = !isBuilds.value;
    };

    changeActive = (value: string) => {
      if (!isBuildingClock.value)
        store.dispatch('layout/setField', {
          field: 'activeBuild',
          value,
        });
    };

    return {
      OBJECTS,
      CAN_BUILD,
      active,
      isBuildingClock,
      buildingProgress,
      isSelected,
      isBuilds,
      t,
      changeActive,
      setSell,
      setIsBuilds,
    };
  },
});
</script>

<style lang="stylus" scoped>
$name = '.design-panel'

$design-panel__width = 460px

{$name}
  position fixed
  overflow-y auto
  width $design-panel__width
  height 100%
  right 0
  top 0
  bottom 0
  z-index 1500
  background rgba($colors.dark, $opacites.funky)
  padding 20px

  &__button
    width 100%
    margin-bottom $gutter
    $button($colors.primary)

    &--disabled
      pointer-events none
      $opacity("psy")

  &__tabs
    display flex

    {$name}__button
      margin-right 10px
      $text("maria")

      + {$name}__button
        margin-right 0
        margin-left 10px

  &__builds
    list-style none
    display grid
    grid-template-columns 1fr 1fr
    grid-gap 20px

    &--active
      {$name}__item:hover
        cursor pointer
        color $colors.stone
        border 2px solid $colors.stone

  &__item
    @extend $flexCenter
    position relative
    text-align center
    height 200px
    border 2px solid $colors.primary
    color $colors.primary
    text-decoration none

  &__header
    margin-bottom 10px
    $text("maria")

  &__text
    margin-bottom 5px
    $text("natasha")

    &--subheader
      margin-top 10px
      $opacity('psy')

  &__progress
    position absolute
    left 0
    right 0
    bottom 0
    background rgba($colors.active, $opacites.psy)

{$name}__item--active
  pointer-events none
  color $colors.active
  border 2px solid $colors.active

{$name}__item--active a
  color $colors.active
</style>
