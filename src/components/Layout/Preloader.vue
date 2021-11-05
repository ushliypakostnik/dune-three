<template>
  <div class="preloader">
    <slot />
    <div v-if="!isGameLoaded" class="preloader__gate">
      <Loader />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex';
import { key } from '@/store';

import Loader from '@/components/Layout/Loader.vue';

export default defineComponent({
  name: 'Preloader',

  components: {
    Loader,
  },

  setup() {
    const store = useStore(key);

    const isGameLoaded = computed(
      () => store.getters['preloader/isGameLoaded'],
    );

    return {
      isGameLoaded,
    };
  },
});
</script>

<style lang="stylus" scoped>
@import "~/src/stylus/_stylebase.styl"

.preloader
  &__gate
    position fixed
    top 0
    left 0
    right 0
    bottom 0
    color $colors.white
    background $colors.black
    display flex
    justify-content center
    align-items center
    z-index 2000
    width 100%
    height 100%
</style>
