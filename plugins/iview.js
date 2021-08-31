import Vue from 'vue'
import ViewUI  from 'view-design'
import InputMiddle from '~/components/Input-middle'
import locale from 'view-design/dist/locale/zh-CN' // Change locale, check node_modules/iview/dist/locale

// import style
import 'view-design/dist/styles/iview.css';

Vue.use(ViewUI , {
  locale,
  size: 'default',
  transfer: true
})

Vue.prototype.$Message.config({
  duration: 3  // 设置3秒后消失
})

Vue.component('Input', InputMiddle)