import withNuxt from './.nuxt/eslint.config.mjs';
import pluginPrettier from 'eslint-config-prettier';
import pluginTailwind from 'eslint-plugin-better-tailwindcss';
import pluginQuery from '@tanstack/eslint-plugin-query';

export default withNuxt(
  {
    plugins: { 'better-tailwindcss': pluginTailwind },
    rules: pluginTailwind.configs.correctness.rules,
    settings: {
      'better-tailwindcss': {
        entryPoint: './src/assets/css/main.css',
      },
    },
  },
  ...pluginQuery.configs['flat/recommended'],
  {
    rules: {
      'vue/no-multiple-template-root': 'off',
      'better-tailwindcss/no-unknown-classes': 'off',
    }
  },
  pluginPrettier,
);
