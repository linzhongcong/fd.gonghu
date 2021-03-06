import Vue from 'vue'
function padLeftZero (str) {
    return ('00' + str).substr(str.length);
}

const date = (time, fmt) => {
    if (!time || time === 'Invalid Date' || time === '0') {
        return '';
    }
    let date = new Date(Number(time) * 1000);
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }

    let obj = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (let k in obj) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = obj[k] + '';
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str));
        }
    }
    return fmt;
};
Vue.prototype.$format = date;
