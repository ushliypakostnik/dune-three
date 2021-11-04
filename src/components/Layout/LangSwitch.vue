<template>
  <ul v-if="language" class="switch">
    <li
      class="switch__item"
      :class="value === language && 'switch__item--active'"
      v-for="value in languages"
      :key="value"
    >
      <a
        v-if="value !== language"
        href="#"
        @click.prevent="changeLanguage(value)"
        >{{ value }}</a
      >
      <span v-else>{{ value }}</span>
    </li>
  </ul>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, nextTick } from 'vue';
import { useStore } from 'vuex';
import { key } from '@/store';
import { useI18n } from 'vue-i18n';
// Constants
import { LANGUAGES } from '@/utils/constants';
// Types
import { Tlanguage } from '@/models/store.ts';

export default defineComponent({
  name: 'LangSwitch',

  setup() {
    const { t, locale } = useI18n({
      inheritLocale: true,
      useScope: 'global',
    });

    const store = useStore(key);

    const language = computed(() => store.getters['layout/language']);

    const changeLanguage = (value: Tlanguage) => {
      locale.value = value;
      store.dispatch('layout/changeLanguage', value);
    };

    const languages = LANGUAGES.map((language): Tlanguage => {
      return language.name;
    });

    onMounted(() => {
      if (!language.value) {
        // Позорный кряк ))) для подгрузки второго языка, чтобы не "моргал" при первой загрузке и первом переключении
        changeLanguage(LANGUAGES[1].name);
        nextTick(() => {
          changeLanguage(LANGUAGES[0].name);
        });
      } else changeLanguage(locale.value as string);
    });

    return {
      t,
      language,
      languages,
      changeLanguage,
    };
  },
});
</script>

<style scoped lang="stylus">
@import "~/src/stylus/_stylebase.styl";

.switch
  @extend $switch
</style>
