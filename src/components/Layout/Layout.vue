<template>
  <div v-if="isDesktop && isBro" class="layout">
    <Preloader>
      <Scene />

      <div class="layout__overlay" />

      <ul class="layout__messages">
        <li
          class="layout__message"
          v-for="(message, index) in messages"
          :key="`message${index}`"
        >
          {{ $t(`${message.text}`) }}
        </li>
      </ul>

      <transition name="fade2">
        <DesignPanel v-show="isDesignPanel" />
      </transition>

      <GamePanel />

      <transition name="fade">
        <div v-if="isPause && isGameLoaded" class="layout__blocker">
          <div class="layout__name">{{ $t('name') }}</div>

          <LangSwitch />

          <div class="layout__buttons">
            <button
              class="layout__button"
              type="button"
              @click.prevent.stop="play"
            >
              {{ $t('startbutton') }}
            </button>
            <button
              class="layout__button"
              type="button"
              @click.prevent.stop="restart"
            >
              {{ $t('restartbutton') }}
            </button>
          </div>

          <div class="layout__help">
            <div class="layout__keys">
              <p>{{ $t('key1') }}</p>
            </div>

            <div class="layout__keys">
              <p>{{ $t('key2') }}</p>
            </div>

            <div class="layout__keys">
              <p>{{ $t('key3') }}</p>
            </div>

            <div class="layout__copy">
              <p>{{ $t('copyright') }}</p>
            </div>
          </div>
        </div>
      </transition>
    </Preloader>
  </div>

  <Gate v-else-if="!isDesktop" face="gadgets" />
  <Gate v-else face="chrome" />
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ref, Ref } from 'vue';
import { useStore } from 'vuex';
import { key } from '@/store';
import { useI18n } from 'vue-i18n';

import Preloader from '@/components/Layout/Preloader.vue';
import Gate from '@/components/Layout/Gate.vue';
import Scene from '@/components/Scene/Scene.vue';
import LangSwitch from '@/components/Layout/LangSwitch.vue';
import DesignPanel from '@/components/Layout/DesignPanel.vue';
import GamePanel from '@/components/Layout/GamePanel.vue';

// Utils
import { ScreenHelper, restartDispatchHelper } from '@/utils/utilities';

export default defineComponent({
  name: 'Layout',

  components: {
    Preloader,
    Scene,
    LangSwitch,
    Gate,
    DesignPanel,
    GamePanel,
  },

  setup() {
    const { t } = useI18n();

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
    const isDesignPanel = computed(() => store.getters['layout/isDesignPanel']);
    const messages = computed(() => store.getters['game/messages']);

    onMounted(() => {
      onWindowResize();
      window.addEventListener('resize', onWindowResize, false);
    });

    onWindowResize = () => {
      isDesktop.value = ScreenHelper.isDesktop();
    };

    play = () => {
      store.dispatch('layout/setField', {
        field: 'isPause',
        value: !isPause.value,
      });
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
      isDesignPanel,
      messages,
      play,
      restart,
    };
  },
});
</script>

<style lang="stylus" scoped>
.layout
  @extend $viewport

  &__name
    color $colors.sea
    text-align center
    margin-top 15vh
    position relative
    $text("olga")

  &__overlay
    @extend $viewport
    display flex
    justify-content flex-end
    pointer-events none
    background linear-gradient(0deg, rgba($colors.primary, $opacites.jazz) 0%, rgba($colors.ghost, $opacites.rock) 100%)
    z-index 500

  &__messages
    @extend $viewport
    list-style none
    padding 0.5vw 1vw
    pointer-events none
    z-index 1000
    color $colors.sea

  &__message
    margin-bottom 0.5vw
    $text("maria")

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
    color $colors.sea
    $text("nina")

  &__help
    margin-top $gutter * 2

  &__keys
    margin-bottom $gutter / 2

  &__copy
    margin-top $gutter * 2
</style>
