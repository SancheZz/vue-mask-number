module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: [
    '@vue/standard',
  ],

  parserOptions: {
    ecmaVersion: 2021,
  },

  rules: {
    semi: ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    'operator-linebreak': ['error', 'before'],
  },

  // overrides
  overrides: [
    // typescript and vue files
    {
      files: [
        '**/*.ts',
        '**/*.vue',
      ],
      env: {
        node: true,
        browser: true,
      },
      extends: [
        'plugin:vue/essential',
        '@vue/standard',
        '@vue/typescript/recommended',
      ],
      parser: 'vue-eslint-parser',
      parserOptions: {
        ecmaVersion: 2021,
        parser: '@typescript-eslint/parser',
      },
      rules: {
        'no-console': 'off',
        'no-debugger': 'off',
        semi: 'off',
        'no-unused-vars': 'off',

        'comma-dangle': [
          'error',
          'always-multiline',
        ],

        'operator-linebreak': [
          'error',
          'before',
        ],

        'sort-imports': ['error', {
          ignoreDeclarationSort: true,
        }],

        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/semi': ['error', 'always'],
      },
    },

    // playwright
    {
      files: [
        '**/__tests__/*.ts',
        '**/tests/e2e/**/*.spec.ts',
      ],
      env: {
        node: true,
      },
      extends: [
        'plugin:jest-playwright/recommended',
      ],
      parser: '@typescript-eslint/parser',
      rules: {
        '@typescript-eslint/no-var-requires': 0,
      },
    },
  ],
};
