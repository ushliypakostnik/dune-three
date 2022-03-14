<template>
  <div class="game-panel">{{ $t('cash') }}: {{ cash }}</div>
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

    return {
      t,
      cash,
    };
  },
});
</script>

<style lang="stylus" scoped>
@import "~/src/stylus/_stylebase.styl"

$name = '.game-panel'

{$name}
  position fixed
  left 0
  right 0
  bottom 0
  z-index 2000
  background rgba(#000000, $opacites.funky)
  padding 1vw
  color $colors.primary
  $text("maria")
</style>
