export default {
  data() {
    return {
      merchantTypeList: [ // 客户类型
        { value: 'cs', label: 'CS' },
        { value: 'ka', label: 'KA' },
        { value: 'otc', label: 'OTC' },
        { value: 'keyAccount', label: '大客户' },
        { value: 'store', label: '便利店' },
        { value: 'newRetailing', label: '新零售' },
        { value: 'csDealers', label: 'CS经销商' },
        { value: 'kaDealers', label: 'KA经销商' },
        { value: 'other', label: '其他' },
      ]
    }
  },
  methods: {
     /**
     * 格式化客户类型
     * @param {String} type: 需要格式化的客户类型
     */
    formatMerchantType(type) {
      let res = ''
      switch (type) {
        case 'cs':
          res = 'CS'
          break;
        case 'ka':
          res = 'KA'
          break;
        case 'otc':
          res = 'OTC'
          break;
        case 'keyAccount':
          res = '大客户'
          break;
        case 'store':
          res = '便利店'
          break;
        case 'newRetailing':
          res = '新零售'
          break;
        case 'csDealers':
          res = 'CS经销商'
          break;
        case 'kaDealers':
          res = 'KA经销商'
          break;
        case 'other':
          res = '其他'
          break;
        case 'service':
          res = '服务商'
          break;
        default:
          break;
      }
      return res
    }
  },
  create() {},
}