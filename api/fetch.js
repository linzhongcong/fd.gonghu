import Vue from 'vue'
import axios from 'axios'
import Cookies from 'js-cookie'
import { SERVER_BASE_URL } from './config'
import iView, { Notice } from 'view-design'
// import store from '../store'
// import { router } from '@/router'

Vue.use(iView)
// 设置用户信息action
/* const setUserInfo = function (user) {
 //store.dispatch(SET_USER_INFO, user)
 }; */

export default function fetch(options) {
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      baseURL: SERVER_BASE_URL,
      timeout: 20000,
      headers: {},
    })

    // http request 拦截器
    instance.interceptors.request.use(
      (config) => {
        config.headers.Authorization = Cookies.get('authorization')
        return config
      },
      (err) => {
        iView.LoadingBar.error()
        return Promise.reject(err)
      }
    )

    // http response 拦截器
    instance.interceptors.response.use(
      (response) => {
        return response
      },
      (error) => {
        iView.LoadingBar.error()
        return Promise.reject(error) // 返回接口返回的错误信息
      }
    )

    // 请求处理
    instance(options)
      .then((res) => {
        // 请求成功时,根据业务判断状态
        /*  if (code === port_code.success) {
                 resolve({code, msg, data})
                 return false
                 } else if (code === port_code.unlogin) {
                 setUserInfo(null)
                 router.replace({name: "login"})
                 } */
        let data = res.data
        if (data.code >= 1 && data.code !== 200) {
          let content = JSON.stringify(data.data)
          let title = data.message
          data.data = data.data || []
          if (data.data.length === 0) {
            content = data.message
            title = ''
          }
          Notice.warning({
            title: title,
            desc: 'code: ' + data.code + '</br>' + content,
          })
        }

        resolve(data)
        return false
      })
      .catch((error) => {
        let response = error.response
        let data = response.data
        // 401无效token
        if (data && data.status && data.status === 401) {
          // 退出登录
          // store.commit('logout', this)
          // store.commit('clearOpenedSubmenu')
          Notice.error({
            title: '登录信息失效，请重新登录！',
            desc: '错误代码：401',
          })
          setTimeout(() => {
            $nuxt.$router.push({
              path: '/login'
            })
          }, 2000)
          reject(error)
          return false
        }

        // 403无权限操作
        if (data && data.status && data.status === 403) {
          Notice.error({
            title: '您没有权限操作',
            desc: '错误代码：' + data.status,
            duration: 0,
          })
          reject(error)
          return false
        }

        // 400后台校验错误，需前端优化提示处理
        if(data && data.code === 400){
          Notice.error({
            title: '出错了',
            desc: '错误原因：' + data.message,
            duration: 5,
          })
          reject(data)
          return false
        }

        // 请求失败时,根据业务判断状态
        Notice.error({
          title: '出错了！',
          desc: '错误原因 ' + JSON.stringify(response),
          duration: 0,
        })
        reject(error)
      })
  })
}
