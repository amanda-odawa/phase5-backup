module.exports = {
    env: {
      browser: true,
      es2020: true,
    },
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: ['react-hooks', 'react-refresh'],
    extends: [
      'eslint:recommended',
      'plugin:react-hooks/recommended',
    ],
    ignorePatterns: ['dist'],
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]', args: 'after-used', ignoreRestSiblings: true }],
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  };