/**
 * author: liruiyong
 * 功能: 操作权限显隐
 * 使用方法: 需要绑定操作权限的元素，使用自定义指令  v-permission="此处为用户的操作权限"
 */

import Vue from 'vue'

Vue.directive('permission', {
  bind(el, binding, vnode, oldVnode) {
    const value = binding.value
    const limits = JSON.parse(window.localStorage.getItem('permissionList'))
    if (value) {
      const permissionUrl = value
      const hasPermission = limits.some(limit => permissionUrl === limit)
      if (!hasPermission) {
        el.style.display = 'none'
      }
    } else {
      throw new Error('need limits! Like v-permission="\'url\'"')
    }
  }
})
