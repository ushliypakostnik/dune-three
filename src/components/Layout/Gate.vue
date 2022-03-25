<template>
  <div class="gate">
    <div class="gate__wrapper">
      <h3 class="gate__text" v-if="face === 'gadgets'">
        {{ $t('gadgetsgate') }}
      </h3>
      <h3 class="gate__text" v-else-if="face === 'chrome'">
        {{ $t('chromegate') }}
      </h3>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Gate',

  props: {
    face: {
      type: String,
      default: null,
      required: true,
    },
  },
});
</script>

<style lang="stylus" scoped>
.gate
  @extend $viewport
  background $colors.black
  color $colors.primary
  padding-left 10vw
  padding-right 10vw

  &__wrapper
    height 100%
    @extend $flexCenter

  &__text
    text-align center
    $text("katya")
</style>
