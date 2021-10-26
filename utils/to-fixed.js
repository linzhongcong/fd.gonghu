import Vue from 'vue';

/**
 * 截取数值
 * @param {Number|String} value: 数值
 * @param {Number} num: 位数
 * @param {Number} useRound: 启用四舍五入 默认：启用
 * @return {String} 处理后的字符串
 */
function toFixed(value, num, useRound = true) {
  value = value || 0;
  if (!num) return value.toString();
  // 启用四舍五入
  if (useRound) {
    const pow = 10 ** num;
    value = Math.round(value * pow) / pow;
  }

  let res = '';
  value = value.toString();
  if (value.includes('.')) {
    let [ pre, sub ] = value.split('.');
    sub.length < num && (sub = addZero(sub, num));
    res = `${pre}.${sub.slice(0, num)}`;
  } else {
    res = addZero(`${value}.`, num);
  }
  return res;
}

/**
 * 补0
 * @param {String|Number} val: 需补0的数值
 * @param {Number} n: 需补位数
 */
function addZero(val, n) {
  for (let i = 0; i < n; i++) {
    val += '0';
  }
  return val;
}

Vue.prototype.$toFixed = toFixed;