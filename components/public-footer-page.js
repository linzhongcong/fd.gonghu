import footerPage from './public-footer-page.vue'
const footerPage={
  install:function(Vue){
    // Vue.component()是用来注册全局组件的
    Vue.component('footerPage',footerPage)
  }  // loading'这就是后面可以使用的组件的名字，install是vue实例上默认的一个方法
}
export default footerPage