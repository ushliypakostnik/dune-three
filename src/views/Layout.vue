<template>
  <div class="layout">
    <Scene />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Scene from '@/components/Three/Scene/Scene.vue';

export default defineComponent({
  name: 'Layout',

  components: {
    Scene,
  },
});
</script>

<style scoped lang="stylus">
// @import "~/src/stylus/_stylebase.styl";

.layout
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  width 100vw
  height: 100vh

  img
    margin-top 10vh
    position relative

h1
  font-size 40px
  position relative
  color #ffffff
</style>
