<template>
  <div class="game-panel">
    <div>{{ $t('cash') }}: {{ cash }}</div>
    <div>
      {{
        new Date(Math.round(clock) * 1000)
          .toISOString()
          .match(/(\d\d:\d\d:\d\d)/)[0]
      }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import { key } from '@/store';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'GamePanel',

  setup() {
    const { t } = useI18n();

    const store = useStore(key);

    const cash = computed(() => store.getters['layout/cash']);
    const clock = computed(() => store.getters['layout/clock']);

    return {
      t,
      cash,
      clock,
    };
  },
});
</script>

<style lang="stylus" scoped>
@import "~/src/stylus/_stylebase.styl"

$name = '.game-panel'

{$name}
  display flex
  justify-content space-between
  position fixed
  left 0
  right 0
  bottom 0
  z-index 2000
  background rgba(#000000, $opacites.funky)
  padding 0.5vw 1vw
  color $colors.primary
  $text("maria")
</style>
