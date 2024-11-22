import js from '@eslint/js';

export default [
  {
    files: ['**/*.js'],
    rules: js.configs.recommended.rules,
  },
  {
    files: ['**/*.js'],
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': 'warn',
    },
  },
  {
    files: ['**/*.js'],
    rules: {
      ...js.configs.all.rules,
      'no-unused-vars': 'warn',
    },
  },
];
