module.exports = {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#0f9aeb',
    height: '3px'
  },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '@/plugins/iview',
    {
      src: '@/plugins/calendar',
      ssr: false
    },
    '@/plugins/api',
    '@/plugins/format',
    '@/plugins/bottom',
    '@/plugins/upload',
    '@/plugins/img-modal',
    '@/plugins/table-list',
    '@/plugins/permission',
    '@/plugins/debonce'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  proxy: {},
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  },
  router: {
    routeNameSplitter: '/'
  }
}
