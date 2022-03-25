<template>
  <div class="loader spin">
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox="0 0 50 50"
      xml:space="preserve"
    >
      <path
        fill="#000"
        d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z"
      ></path>
    </svg>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Loader',
});
</script>

<style lang="stylus" scoped>
@keyframes spin
  from
    transform rotate(0deg)

  to
    transform rotate(360deg)

.spin
  will-change transform
  animation spin linear $effects.duration * 10 infinite

.loader
  width $gutter * 8
  height $gutter * 8

  svg path
    fill $colors.primary
    width 100%
    height 100%
</style>
