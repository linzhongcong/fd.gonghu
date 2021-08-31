
/**
 * 客户类型
 */
export const merchantType = {
  cs: { value: 'cs', label: 'CS' },
  ka: { value: 'ka', label: 'KA' },
  otc: { value: 'otc', label: 'OTC' },
  keyAccount: { value: 'keyAccount', label: '大客户' },
  csDealers: { value: 'csDealers', label: 'CS经销商' },
  kaDealers: { value: 'kaDealers', label: 'KA经销商' },
  store: { value: 'store', label: '便利店' },
  newRetailing: { value: 'newRetailing', label: '新零售' },
  other: { value: 'other', label: '其他' },
}

/**
 * 折扣选项
 */
export const discountTypeOptions = [
  { value: 'discount', label: '折扣' },
  { value: 'price', label: '单价' },
]

/**
 * 税额校验器： 小数点后4位
 * @param {Object} rule: 规则
 * @param {Any} value: 校验的值
 * @param {Function} callback: 回调
 */
export function taxationValidator (rule, value, callback) {
  if (~value.toString().indexOf('.') && value.split('.')[1].length > 4) return callback(new Error('请保留4位小数'));
  callback()
}

/**
 * 数组去重
 * @param {Array} arr: 需去重数据
 */
 export function removeRepeatItem(arr) {
  let hashMap = new Map();
  let resArr = new Array();
  for (let i = 0; i < arr.length; i++) {
    if (!hashMap.has(arr[i].id)) {
      hashMap.set(arr[i].id, arr[i]);
      resArr.push(JSON.parse(JSON.stringify(arr[i])));
    }
  }
  return resArr;
}

export default {
  merchantType,
  discountTypeOptions,
  taxationValidator,
  removeRepeatItem,
}