<template>
  <div class="preloader">
    <slot />
    <div v-if="isReload" class="preloader__gate" />
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

    const isReload = computed(() => store.getters['layout/isReload']);

    // Следим загрузилась ли игра чтобы проверить с начала ли
    watch(
      () => store.getters['preloader/isGameLoaded'],
      (value) => {
        if (value) {
          // First balance
          store.dispatch('layout/balanceBase');
          store.dispatch('layout/setField', {
            field: 'isReload',
            value: false,
          });

          // Check is start
          if (store.getters['objects/isStart']) {
            store.dispatch('layout/setField', {
              field: 'health',
              value: 100,
            });
            store.dispatch('objects/setField', {
              field: 'isStart',
              value: false,
            });
          }
        }
      },
    );

    return {
      isGameLoaded,
      isReload,
    };
  },
});
</script>

<style lang="stylus" scoped>
.preloader
  &__gate
    @extend $viewport
    @extend $flexCenter
    color $colors.white
    background $colors.black
    z-index 2000
    $text('olga')
</style>
