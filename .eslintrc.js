module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended'
  ],
  // add your custom rules here
  rules: {
    'generator-star-spacing': 'off',
    "space-before-function-paren": 0,
    'nuxt/no-cjs-in-config': 'off',
    "vue/singleline-html-element-content-newline": "off",
    "no-unused-vars": "off",
    "prefer-const": "off"
  }
}
