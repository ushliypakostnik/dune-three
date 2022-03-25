<template>
  <ul v-if="language" class="switch">
    <li
      class="switch__item"
      :class="value === language && 'switch__item--active'"
      v-for="value in languages"
      :key="`language${value}`"
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
import { defineComponent, computed, onMounted, nextTick } from 'vue';
import { useStore } from 'vuex';
import { key } from '@/store';
import { useI18n } from 'vue-i18n';

// Constants
import { LANGUAGES } from '@/utils/constants';

// Types
import { TLanguage } from '@/models/store';

export default defineComponent({
  name: 'LangSwitch',

  setup() {
    const { t, locale } = useI18n({
      inheritLocale: true,
      useScope: 'global',
    });

    const store = useStore(key);

    const language = computed(() => store.getters['layout/language']);

    const changeLanguage = (value: TLanguage) => {
      locale.value = value;
      store.dispatch('layout/setField', { field: 'language', value });
    };

    const languages = LANGUAGES.map((language): TLanguage => {
      return language;
    });

    onMounted(() => {
      // Позорный кряк ))) для подгрузки второго языка, чтобы не "моргал" при первой загрузке и первом переключении
      if (language.value === LANGUAGES[0]) {
        changeLanguage(LANGUAGES[1]);
        nextTick(() => {
          changeLanguage(LANGUAGES[0]);
        });
      } else {
        changeLanguage(LANGUAGES[0]);
        nextTick(() => {
          changeLanguage(LANGUAGES[1]);
        });
      }
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

<style lang="stylus" scoped>
.switch
  @extend $switch
</style>
