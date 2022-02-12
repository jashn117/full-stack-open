module.exports = {
  env: {
    browser: true,
    commonjs: true,
    node: true,
    es2021: true,
    jest: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'linebreak-style': [1, 'windows'],
  },
};
