// @ts-check
import withNuxt from '.nuxt/eslint.config.mjs';
import stylistic from '@stylistic/eslint-plugin';
import vue from 'eslint-plugin-vue';

export default withNuxt(
  // Your custom configs here
  stylistic.configs.customize({
    indent: 2,
    quotes: 'single',
    semi: true,
    braceStyle: '1tbs',
  }),
  {
    plugins: {
      vue,
    },
    rules: {
      'vue/html-indent': ['error', 2],
      'vue/no-multi-spaces': 'error',
      'vue/template-curly-spacing': ['error', 'never'],
      'vue/func-call-spacing': ['error', 'never'],
      'vue/html-closing-bracket-spacing': 'error',
      'vue/comma-spacing': ['error', { before: false, after: true }],
      'vue/attribute-hyphenation': 'off',
      'vue/prop-name-casing': 'off',
      'vue/valid-v-for': 'off',
      'vue/require-v-for-key': 'off',
      'vue/v-on-event-hyphenation': 'off',
      '@typescript-eslint/consistent-type-imports': 'off',
      '@typescript-eslint/no-inferrable-types': 'error',
    },
  },
);
