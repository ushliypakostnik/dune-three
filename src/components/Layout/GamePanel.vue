<template>
  <div class="game-panel">
    <div class="game-panel__left">
      <div class="game-panel__text-scale">
        {{ $t('cash') }}: {{ cash }}
        <span class="game-panel__text-scale-inner">({{ cashLimit }})</span>
      </div>
      <div class="game-panel__text-scale">
        {{ $t('energy') }}: {{ energy }}
        <span
          class="game-panel__text-scale-inner"
          :class="{ effect: energy < energyNeed && !isPause }"
          >({{ energyNeed }})</span
        >
      </div>
      <div class="game-panel__text-scale">
        {{ $t('food') }}: {{ food }}
        <span
          class="game-panel__text-scale-inner"
          :class="{ effect: food < foodNeed && !isPause }"
          >({{ foodNeed }})</span
        >
      </div>
      <div class="game-panel__scale">
        <span>{{ $t('health') }}: </span>
        <span
          class="game-panel__scale-body game-panel__scale-body--health"
          :class="{ effect: health < 20 && !isPause }"
          ><span :style="`width: ${health}%`"
        /></span>
      </div>
    </div>

    <div class="game-panel__right">
      {{
        new Date(Math.round(clock) * 1000)
          .toISOString()
          .match(/(\d\d:\d\d:\d\d)/)[0]
      }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { key } from '@/store';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'GamePanel',

  setup() {
    const { t } = useI18n();

    const store = useStore(key);

    const clock = computed(() => store.getters['layout/clock']);
    const isPause = computed(() => store.getters['layout/isPause']);

    // Показатели базы
    const cash = computed(() => store.getters['layout/cash']);
    const cashLimit = computed(() => store.getters['layout/cashLimit']);

    // Следим за уровнем health командного пункта
    const health = computed(() => store.getters['layout/health']);

    // Следим за энергией
    const energy = computed(() => store.getters['layout/energy']);
    const energyNeed = computed(() => store.getters['layout/energyNeed']);

    // Следим за едой
    const food = computed(() => store.getters['layout/food']);
    const foodNeed = computed(() => store.getters['layout/foodNeed']);

    return {
      t,
      clock,
      isPause,
      health,
      cash,
      cashLimit,
      energy,
      energyNeed,
      food,
      foodNeed,
    };
  },
});
</script>

<style lang="stylus" scoped>
$name = '.game-panel'

{$name}
  display flex
  justify-content space-between
  position fixed
  left 0
  right 0
  bottom 0
  z-index 2000
  background rgba($colors.dark, $opacites.funky)
  padding 0.5vw 1vw
  color $colors.primary
  $text("maria")

  +$small()
    $text("nina")

  &__left
    display flex
    align-items center

  &__right
    margin-left 40px

  &__text-scale
    margin-right 40px

    &-inner
      $opacity("psy")

  &__scale
    display flex
    align-items center

    &-body
      border 2px solid rgba($colors.primary, $opacites.psy)
      height 15px
      width 7vw
      transform translateY(-1px)

      > span
        display flex
        height 100%

      &--health
        > span
          background $colors.bird
</style>
