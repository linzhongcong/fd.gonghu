import Vue from 'vue'

/**
 * 防抖函数
 * fn 源函数
 * delay  延迟时间
 * run 开头执行/结尾执行/两端执行(默认)
 */
function debonce(fn, delay, run = 'footer') {
  let timer = null
  // 等待函数
  const later = (what, params) => {
    timer = setTimeout(() => {
      if (run !== 'header') {
        fn.apply(what, params)
      }
      timer = null
    }, delay)
  }
  return (...params) => {
    // 如果开头执行函数
    if (run !== 'footer') {
      if (!timer) {
        fn.apply(this, params)
      }
    }
    clearTimeout(timer)
    return later(this, params)
  }
}

Vue.prototype.$debonce = debonce
