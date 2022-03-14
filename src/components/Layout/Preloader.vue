<template>
  <div class="preloader">
    <slot />
    <div v-if="!isGameLoaded" class="preloader__gate">
      <Loader />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch } from 'vue';
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

    // Следим загрузилась ли игра чтобы проверить с начала ли
    watch(
      () => store.getters['preloader/isGameLoaded'],
      () => {
        // Check is start
        if (store.getters['objects/isStart']) {
          store.dispatch('objects/setField', {
            field: 'isStart',
            value: false,
          });
        }
      },
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
    @extend $viewport
    @extend $flexCenter
    color $colors.white
    background $colors.black
    z-index 2000
</style>
