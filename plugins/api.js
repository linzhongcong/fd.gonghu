import Vue from 'vue'
import API from '~/api/all.api'
import Print from './print'
Vue.prototype.$api = API
Vue.use(API)
Vue.use(Print)
//
// Object.defineProperty(Vue.prototype, '$API', {
//   get: function () {
//     return API
//   }
// })
// Vue.use(API)