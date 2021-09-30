/**
 * 重置数据
 * @param {String} keyName: 需重置属性名
 */
export const initData = {
  productList() { // 订单产品
    return {
      id: '',
      barcode: '',
      standard: '',
      unit: '',
      price: '',
      discount: '',
      number: 1,
      productAmount: '',
      totalPrice: '',
      boxStandard: '',
    }
  },
}

/**
 * 校验附件凭证
 * @param {Array} fileList: 附件凭证数组
 * @param {Function} callback: 校验回调
 */
export function validOrderFile(fileList, callback) {
  if (fileList.length === 0) return callback(new Error('该选项不能为空'));
  callback();
}

/**
 * 检测是否已有相同产品
 * @param {Array} productList: 产品数组
 * @param {String|Number} value: 比较的值
 * @param {String} key: 比较的属性名
 * @return {Boolean} true:是  false:否
 */
export function hasProduct(productList, value, key) {
  let count = 0;
  for (let i = 0; i < productList.length; i++) {
    const item = productList[i];
    item[key] === value && count++;
    if (count > 1) return true;
  }
  return false;
}

/**
 * 格式化结款方式
 * @param {String} method: 结款方式
 * @return {String} 格式化后的内容
 */
export function formatPaymentMethod(method) {
  let str = '';
  switch (method) {
    case 'monthly':
      str = '月结';
      break;
    case 'spot_cash':
    case 'spotCash':
      str = '现货现款';
      break;
    case 'real_sale':
    case 'realSale':
      str = '实销实结';
      break;
    default:
      break;
  }
  return str;
}

/**
 * 格式化订单来源
 * @param {String} from: 订单来源
 * @return {String} 格式化后的内容
 */
 export function formatOrderFrom(from) {
  let str = '';
  switch (from) {
    case 'backstage':
      str = '后台';
      break;
    case 'dingTalk':
      str = '钉钉';
      break;
    default:
      break;
  }
  return str;
}

/**
 * 格式化状态
 */
export function formatStatus(status) {
  let str = '';
  switch (status) {
    case 'OrderWorkflow/wait':
      str = '待处理';
      break;
    case 'OrderWorkflow/reject':
      str = '驳回';
      break;
    case 'OrderWorkflow/auditPending':
      str = '待初审';
      break;
    case 'OrderWorkflow/auditFailure':
      str = '初审不通过';
      break;
    case 'OrderWorkflow/auditRecheckPending':
      str = '待复审';
      break;
    case 'OrderWorkflow/auditRecheckFailure':
      str = '复审不通过';
      break;
    case 'OrderWorkflow/auditRecheckPass':
      str = '复审通过';
      break;
    case 'OrderWorkflow/cancel':
      str = '作废';
      break;
    case 'OrderWorkflow/draft':
      str = '草稿';
      break;
    default:
      break;
  }
  return str;
}

/**
 * 格式化收款状态
 */
export function foramtReceivablesStatus(status) {
  let str = '';
  switch (status) {
    case 'unpaid':
      str = '未付款';
      break;
    case 'paid':
      str = '已付款';
      break;
    case 'wait_receipt':
      str = '待付款';
      break;
    case 'receipt':
      str = '已收款';
      break;
    default:
      break;
  }
  return str;
}

/**
 * 格式化导单状态
 */
export function formatDisposeStatus(status) {
  let str = '';
  switch (status) {
    case 'undisposed':
      str = '未导单';
      break;
    case 'disposed':
      str = '已导单';
      break;
    case 'exception_handling':
      str = '异常导单';
      break;
    default:
      break;
  }
  return str;
}