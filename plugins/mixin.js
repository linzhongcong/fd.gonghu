let MIXIN = {
  data() {
    return {
      dataPermissionRange: [ // 数据范围权限
        { value: 'company', label: '全部' },
        { value: 'self', label: '我负责的' },
        { value: 'department', label: '本部门的' },
        { value: 'container', label: '本部门及下属部门的' },
      ],
      isGetDataPermissionRange: false, // 是否已经最高数据权限范围
    }
  },
  created() {},

  methods: {
    /**
     * 校验是否已经获取数据范围权限最高范围: 全部 - 本部门及下属部门 - 本部门 - 我负责的
     * @param {Object} that: 每个Vue组件实例
     * @param {String} hasPermissionRange: 是否已经取得最高权限
     * @param {String} dataPermissionRange: 数据权限范围
     * @param {String} ownership: 获取到的最高权限范围
     */
    handleValidateDataPermissionRange(that, hasPermissionRange, dataPermissionRange, ownership) {
      let isGetDataPermRange = that[hasPermissionRange],
          _dataPermissionRange = [ ...that[dataPermissionRange] ]
      if (!isGetDataPermRange) {
        that[hasPermissionRange] = true // 标记已取得最高权限
        if (ownership === '') {
          that[dataPermissionRange] = []
        } else if (ownership === 'company') { // 全公司
          that[dataPermissionRange] = _dataPermissionRange.slice(0)
        } else if (ownership === 'container') { // 本部门及以下
          that[dataPermissionRange] = _dataPermissionRange.slice(1)
        } else if (ownership === 'department') { // 本部门
          that[dataPermissionRange] = _dataPermissionRange.slice(1, 3)
        } else if (ownership === 'self') { // 自己
          that[dataPermissionRange] = _dataPermissionRange.slice(1, 2)
        }
      }
    }
  },
  mounted() {},
};
export default MIXIN;
