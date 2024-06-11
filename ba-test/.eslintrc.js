// monkey-patches es-lint to work with the monorepo configuration
// @see https://github.com/eslint/eslint/issues/3458#issuecomment-648719715
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  extends: [
    'airbnb',
    'plugin:@typescript-eslint/recommended',
    'plugin:promise/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['promise', 'prettier', 'babel'],
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    'prettier/prettier': 'error',
    'operator-linebreak': 'off',
    'arrow-parens': 'off',
    '@typescript-eslint/indent': 'off',
    'object-curly-newline': 'off',
    'implicit-arrow-linebreak': 'off',
    'import/no-unresolved': 'off',
    'no-unused-expressions': 'off',
    'babel/no-unused-expressions': 'off',
    'no-console': 'off',
    'no-await-in-loop': 'off',
    'no-plusplus': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-nested-ternary': 'off',
    camelcase: 'off',
    'babel/camelcase': 1,
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        mjs: 'never',
        ts: 'never',
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.ts', '.eslintrc.js'],
      rules: {
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: true,
          },
        ],
      },
    },
  ],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts', '.json'],
      },
    },
  },
  globals: {
    spyOn: 'readonly',
  },
  parserOptions: { tsconfigRootDir: __dirname },
};
