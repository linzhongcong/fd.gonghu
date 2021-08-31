// js自动生成生成二维码
import Vue from 'vue'
import QRCode from 'qrcodejs2'

const QRCodeSC = (url) => {
  let qrcode = new QRCode('qrcode', { // qrcode html为标签id
    width: 100, // 长度
    height: 100, // 宽度
    text: url // 内容
  })
  return qrcode
}
Vue.prototype.$QRCodeSC = QRCodeSC
const qrcode = {
  QRCodeSC
};
export default qrcode;
// 使用方法设置一个id为qrcode的标签，调用this.$QRCodeSC方法比如： this.$QRCodeSC('http://www.baidu.com')