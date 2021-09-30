/**
 * 转换客户类型
 * @param {String} type: 客户类型
 */
 export function toggleChangeMerchantType(type) {
  let resStr = '';
  switch (type) {
    case 'cs':
      resStr = 'CS';
      break;
    case 'CS':
      resStr = 'cs';
    case 'ka':
      resStr = 'KA';
      break;
    case 'KA':
      resStr = 'ka';
      break;
    case 'otc':
      resStr = 'OTC';
      break;
    case 'OTC':
      resStr = 'otc';
      break;
    case 'keyAccount':
      resStr = '大客户';
      break;
    case '大客户':
      resStr = 'keyAccount';
      break;
    case 'csDealers':
      resStr = 'CS经销商';
      break;
    case 'CS经销商':
      resStr = 'csDealers';
      break;
    case 'kaDealers':
      resStr = 'KA经销商';
      break;
    case 'KA经销商':
      resStr = 'kaDealers';
      break;
    case 'store':
      resStr = '便利店';
      break;
    case '便利店':
      resStr = 'store';
      break;
    case 'newRetailing':
      resStr = '新零售';
      break;
    case '新零售':
      resStr = 'newRetailing';
      break;
    case 'other':
      resStr = '其他';
      break;
    case '其他':
      resStr = 'other';
      break;
    default:
      break;
  }
  return resStr;
}

/**
 * 数组去重
 * @param {Array} arr: 需去重数据
 * @param {String} key: 作为判断的key
 */
 export function removeRepeatItem(arr, key) {
  let hashMap = new Map();
  let resArr = new Array();
  for (let i = 0; i < arr.length; i++) {
    if (!hashMap.has(arr[i][key])) {
      hashMap.set(arr[i][key], arr[i]);
      resArr.push(JSON.parse(JSON.stringify(arr[i])));
    }
  }
  return resArr;
}