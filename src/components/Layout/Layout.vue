<template>
  <div v-if="isDesktop && isBro" class="layout">
    <Preloader>
      <Scene />

      <div v-if="isPause && isGameLoaded" class="layout__blocker">
        <div class="layout__name">{{ t('layout.name') }}</div>
        <LangSwitch />
        <div class="layout__buttons">
          <button class="layout__button" type="button" @click.prevent.stop="play">
            {{ $t('layout.startbutton') }}
          </button>
          <button class="layout__button" type="button" @click.prevent.stop="restart">
            {{ $t('layout.restartbutton') }}
          </button>
        </div>
        <div class="layout__help">
          <div class="layout__keys">
            <p>{{ $t('layout.key1') }}</p>
          </div>
          <div class="layout__copy">
            <p>{{ $t('layout.copyright') }}</p>
          </div>
        </div>
      </div>
    </Preloader>
  </div>

  <Gate v-else-if="!isDesktop" face="gadgets" />
  <Gate v-else face="chrome" />
  {{ isDesktop }}
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ref, Ref } from 'vue';
import { useStore } from 'vuex';
import { key } from '@/store';
import { useI18n } from 'vue-i18n';

import Preloader from '@/components/Layout/Preloader.vue';
import Gate from '@/components/Layout/Gate.vue';
import Scene from '@/components/Three/Scene/Scene.vue';
import LangSwitch from '@/components/Layout/LangSwitch.vue';

// Utils
import { ScreenHelper, restartDispatchHelper } from '@/utils/utilities';

export default defineComponent({
  name: 'Layout',

  components: {
    Preloader,
    Scene,
    LangSwitch,
    Gate,
  },

  setup() {
    const { t } = useI18n({
      inheritLocale: true,
      useScope: 'global',
    });

    const store = useStore(key);

    let isDesktop: Ref<boolean> = ref(false);
    const isBro = ScreenHelper.isBro();
    let onWindowResize: () => void;
    let play: () => void;
    let restart: () => void;

    const isGameLoaded = computed(
      () => store.getters['preloader/isGameLoaded'],
    );

    const isPause = computed(() => store.getters['layout/isPause']);

    onMounted(() => {
      onWindowResize();
      window.addEventListener('resize', onWindowResize, false);
    });

    onWindowResize = () => {
      isDesktop.value = ScreenHelper.isDesktop();
    };

    play = () => {
      store.dispatch('layout/togglePause', !isPause.value);
    };

    restart = () => {
      restartDispatchHelper(store);
    };

    return {
      t,
      isDesktop,
      isBro,
      isGameLoaded,
      isPause,
      play,
      restart,
    };
  },
});
</script>

<style lang="stylus" scoped>
@import "~/src/stylus/_stylebase.styl"

.layout
  @extend $viewport

  &__name
    color $colors.dark
    text-align center
    margin-top 15vh
    position relative
    $text("elena")

  &__blocker
    @extend $viewport
    text-align center
    background linear-gradient(0deg, rgba($colors.primary, $opacites.funky) 0%, rgba($colors.ghost, $opacites.psy) 100%)
    z-index 2000

  &__buttons
    display flex
    align-items center
    flex-direction column
    justify-content center

  &__button
    margin-top $gutter * 2
    @extend $button

  p
    margin-bottom $gutter
    color $colors.dark
    $text("nina")

  &__help
    margin-top $gutter * 2

  &__keys
    margin-bottom $gutter * 2
</style>
