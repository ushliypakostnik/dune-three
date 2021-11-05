<template>
  <div class="layout">
    <Preloader>
      <Scene />

      <div class="layout__name">{{ t("name") }}</div>
      <LangSwitch />
    </Preloader>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

import Preloader from '@/components/Layout/Preloader.vue';
import Scene from '@/components/Three/Scene/Scene.vue';
import LangSwitch from '@/components/Layout/LangSwitch.vue';

export default defineComponent({
  name: 'Layout',

  components: {
    Preloader,
    Scene,
    LangSwitch,
  },

  setup() {
    const { t } = useI18n({
      inheritLocale: true,
      useScope: 'global',
    });

    return {
      t,
    };
  },
});
</script>

<style scoped lang="stylus">
@import "~/src/stylus/_stylebase.styl"

.layout
  position fixed
  overflow hidden
  top 0
  left 0
  right 0
  bottom 0
  width 100vw
  height: 100vh

  &__name
    text-align center
    margin-top 15vh
    position relative
    $text("elena")
</style>
