
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
 * 产品选项
 */
export const productTypeOptions = [
  { value: 'product', label: '商品' },
]

/**
 * 政策模块数据初始化结构 - 映射表
 */
export const initSingleData = {
  regularContractorList() {
    return {
      contractorId: '', // 公司名称id
      merchantType: '', // 公司类型
    };
  },
  baseDiscountList() { // 基础折扣
    return {
      startingAmount: '', // 应收金额
      proportion: '', // 折扣
      productAmount: '', // 货值
    };
  },
  productDiscountList() { // 单品折扣
    return {
      objectId: '', // 产品id
      objectName: '', //折扣类型 折扣/单价
      directPrice: '', // 折扣率/单价金额
    };
  },
  matchingDiscountList() { // 配赠活动
    return { 
      startingAmount: '', // 配赠应收金额
      detailList: [ // 详情列表
        {
          matchingMolecule: '', // 配赠比例 配
          matchingDenominator: '', // 配赠比例 增
          productList: [ // 产品列表
            {
              conditionId: '', // 购买产品id
              conditionType: '', // 购买产品类型
              objectId: '', // 配赠产品id
              objectName: '', // 配赠产品类型
            }
          ],
        }
      ],
    };
  },
  matchingDetailList() { // 配赠活动详情列表
    return {
      matchingMolecule: '',
      matchingDenominator: '',
      productList: [
        {
          conditionId: '',
          conditionType: '',
          objectId: '',
          objectName: '',
        }
      ],
    }
  },
  matchingProductList() { // 配赠产品
    return {
      conditionId: '',
      conditionType: '',
      objectId: '',
      objectName: '',
    }
  },
  giftDiscountList() { // 满赠活动
    return {
      startingAmount: '', // 满赠应收金额
      detailList: [ // 满赠产品
        {
          objectName: '', // 满赠产品类型
          objectId: '', // 满赠产品id
          number: '', // 可赠数量
        }
      ],
    }
  },
  giftDetailList() { // 满赠产品
    return {
      objectName: '',
      objectId: '',
      number: '',
    }
  },
}

/**
 * 税额校验器： 小数点后4位
 * @param {Object} rule: 规则
 * @param {Any} value: 校验的值
 * @param {Function} callback: 回调
 */
export function taxationValidator (rule, value, callback) {
  if (!value) return callback();
  let reg = /^(([1-9]\d*)|0)(\.\d{1,2})?$/;
  if (!reg.test(value)) return callback(new Error('请保留2位小数'));
  callback();
}

/**
 * 计算货值
 * @param {Number} cost: 金额
 * @param {Number} discount: 折扣（百分数）
 * @return {String} 保留四位小数计算结果
 */
export function calcGoodsPrice(cost, discount) {
  discount /= 100; // 百分比换算小数
  const value = isNaN(cost / discount) ? 0 : cost / discount;
  return repairEnd(Math.round(value * 10000) / 10000, 4);
}

/**
 * 辅助函数 - 末尾补0
 * @param {Number} num: 需要补位值
 * @param {Number} len: 需要补位长度
 * @return {String} 补位完成的字符串
 */
function repairEnd(num, len) {
  let str = num.toString();
  if (/^\d+$/.test(str)) {
    str += '.0000';
  } else if (str === 'Infinity') {
    str = 'NULL';
  } else {
    const endNum = str.split('.')[1];
    for (let i = endNum.length; i < len; i++) {
      str += '0';
    }
  }
  return str;
}

/**
 * 其他表单校验
 * @param {Array} arr: 校验表单项，必须为对象数组 [{ errMsg: '校验不通过提示语', data: [{key: '需校验数据格式'}] }]
 * @return {Promise} resolve: obj.validRes: true=>校验通过 false=>校验不通过  obj.msg: 返回的信息
 */
export function validateOtherForm(arr) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < arr.length; i++) {
      let data = arr[i].data;
      if (!Array.isArray(data)) {
        console.error('data must be a Array');
        reject('表单格式错误');
      }
      const flatObj = deepflatToObject(data), // 扁平好的对象结构
        isValue = Object.values(flatObj).some(item => !['', null, undefined, false].includes(item)), // 是否填写
        isAllValue = Object.values(flatObj).every(item => !['', null, undefined, true].includes(item)); // 是否全部填写完整
      if (isValue && !isAllValue) return resolve({ validRes: false, msg: arr[i].errMsg || '请填写完整表单' });
    }
    return resolve({ validRes: true, msg: 'OK!' });
  })
}

/**
 * 辅助函数 - 递归扁平数组
 * @param {Array} arr: 需扁平数组
 * @param {String} subfix: 后缀标识名
 * @return {Object} 扁平好的对象
 */
function deepflatToObject(arr, subfix = '') {
  let resObj = {};
  for (let i = 0; i < arr.length; i++) {
    let obj = arr[i];
    for (let key in obj) {
      const value = obj[key];
      Array.isArray(value) ? resObj = { ...resObj, ...deepflatToObject(value, `${subfix}${i}`) } : resObj[`_${key}${subfix}${i}`] = value;
    }
  }
  return resObj;
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

/**
 * 格式化客户类型
 * @param {String} type: 格式化类型
 */
export function formatMerchantType(type) {
  let resName = '';
  switch (type) {
    case 'cs':
      resName = 'CS';
      break;
    case 'ka':
      resName = 'KA'
      break;
    case 'otc':
      resName = 'OTC'
      break;
    case 'keyAccount':
      resName = '大客户'
      break;
    case 'csDealers':
      resName = 'CS经销商'
      break;
    case 'kaDealers':
      resName = 'KA经销商'
      break;
    case 'store':
      resName = '便利店'
      break;
    case 'newRetailing':
      resName = '新零售'
      break;
    case 'other':
      resName = '其他'
      break;
    default:
      break;
  }
  return resName;
}

/**
 * 格式化政策状态
 * @param {String} type: 需要转话类型
 * @return {String} 转换后的格式
 */
export function formatPolicyStatus(type) {
  let str = '';
  switch (type) {
    case 'draft':
      str = '草稿';
      break;
    case 'enable':
      str = '在用';
      break;
    case 'disable':
      str = '停用';
      break;
    case 'expired':
      str = '到期';
      break;
    default:
      break;
  }
  return str;
}

/**
 * 格式化审核状态
 * @param {String} type: 需要转话类型
 * @return {String} 转换后的格式
 */
export function formatAuditStatus(type) {
  let str = '';
  switch (type) {
    case 'draft':
      str = '草稿';
      break;
    case 'auditPending':
      str = '待审核';
      break;
    case 'auditPass':
      str = '审核通过';
      break;
    case 'auditFailure':
      str = '审核不通过';
      break;
    default:
      break;
  }
  return str;
}

export default {
  merchantType,
  discountTypeOptions,
  productTypeOptions,
  initSingleData,
  taxationValidator,
  calcGoodsPrice,
  validateOtherForm,
  removeRepeatItem,
  formatMerchantType,
  formatPolicyStatus,
  formatAuditStatus,
}