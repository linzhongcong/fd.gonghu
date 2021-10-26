
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
 * 税额校验器： 小数点后2位
 * @param {Object} rule: 规则
 * @param {Any} value: 校验的值
 * @param {Function} callback: 回调
 */
export function taxationValidator (rule, value, callback) {
  if (!value) return callback();
  if (value > 100) return callback('请填写有效税额');
  let reg = /^(([1-9]\d*)|0)(\.\d{1,2})?$/;
  if (!reg.test(value)) return callback(new Error('请保留2位小数'));
  callback();
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
  discountTypeOptions,
  productTypeOptions,
  initSingleData,
  taxationValidator,
  formatPolicyStatus,
  formatAuditStatus,
}