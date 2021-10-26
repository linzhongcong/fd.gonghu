export default [
  {
    name: 'order-management',
    icon: 'md-list',
    path: '/',
    title: '订单统计',
    children: [
      { title: '订单统计', path: '/v1/order-received/index', keepName: 'order-statistics', name: 'order-management/order-statistics' }
    ]
  },
  {
    path: '/employee-management',
    icon: 'ios-book',
    name: 'employee-management',
    title: '员工管理',
    children: [
      {
        title: '员工档案',
        path: '/v2/employee/index',
        keepName: 'employee-file',
        name: 'employee-management/employee-file'
      },
      {
        title: '组织架构',
        path: '/v2/offline-dept/dept-tree',
        keepName: 'organization',
        name: 'employee-management/organization'
      },
      {
        title: '团队管理',
        path: '/v1/manage-team/index',
        keepName: 'team-management',
        name: 'employee-management/team-management'
      },
      {
        title: '排行榜管理',
        path: '/v1/user-ranking-video/index',
        keepName: 'ranking-list',
        name: 'employee-management/ranking/ranking-list'
      },
      {
        title: '视频详情',
        keepName: 'ranking-video',
        name: 'employee-management/ranking/ranking-video'
      }
    ]
  },
  {
    path: '/field-management',
    icon: 'ios-book',
    name: 'field-management',
    title: '签到管理',
    children: [{
      title: '开拓签到',
      path: '/v1/checkin-management/index',
      keepName: 'attendance-management',
      name: 'field-management/attendance-management'
    },
    {
      title: '动销签到',
      path: '/v1/checkin-prettify-management/index',
      keepName: 'checkin-prettify-management',
      name: 'field-management/checkin-prettify-management'
    },
    {
      title: '补签审核',
      path: '/v1/checkin-prettify-management/index',
      keepName: 'retroactive-audit',
      name: 'field-management/retroactive-audit'
    },
    ]
  },
  {
    name: 'contract',
    icon: 'md-people',
    path: '/contract',
    title: '客户管理',
    children: [
      {
        title: '线索池',
        path: '/v2/leads/index',
        keepName: 'leads',
        name: 'contract/development-partner-management/development-partner'
      },
      {
        title: '潜在客户',
        path: '/v2/potential-customer/index',
        keepName: 'potential-customer',
        name: 'contract/potential-customer/customer'
      },
      {
        title: '合作客户',
        path: '/v2/partner/index',
        keepName: 'cooperative-customer',
        name: 'contract/cooperative-customer/cooperative-list'
      },
      {
        title: '合作门店',
        path: '/v2/facade/index',
        keepName: 'facade',
        name: 'contract/facade/list'
      },
      {
        title: '地址审核',
        path: '/v2/facade/index',
        keepName: 'address-audit',
        name: 'contract/address-audit/address-audit-list'
      },
      {
        title: '联系人',
        path: '/v2/contacts/index',
        keepName: 'contacts',
        name: 'contract/contact-list'
      },
      {
        title: '合作商列表',
        path: '/v1/contractor-management/index',
        keepName: 'partner',
        name: 'contract/partner-management'
      },
      // {
      //   title: '合作商草稿箱',
      //   path: '/v1/contractor-draft/index',
      //   keepName: 'partner-draft',
      //   name: 'contract/partner-draft'
      // },
      {
        title: '账户管理',
        path: '/v1/we-chat-user-contractor/index',
        keepName: 'account',
        name: 'contract/account-management'
      },
      {
        title: '申请合作商',
        path: '/v1/wechat-contractor-apply/index',
        keepName: 'apply-cooperation',
        name: 'contract/apply-cooperation'
      },
      {
        title: '客户档案',
        path: '/v1/customer-profile/index',
        keepName: 'customer-profile',
        name: 'contract/customer-profile/list'
      }
    ]
  },
  {
    name: 'policy',
    icon: 'logo-buffer',
    path: '/policy',
    title: '政策管理',
    children: [{
      title: '供货政策',
      path: '/v1/contract-policy-management/index',
      keepName: 'policy',
      name: 'policy/policy-management'
    },
      // {
      //   title: '合作商政策管理',
      //   path: '/v1/partner-policy/index',
      //   keepName: 'policy-partner',
      //   name: 'policy/policy-partner'
      // },
      // {
      //   title: '政策草稿箱',
      //   path: '/v1/contract-policy-draft/index',
      //   keepName: 'policy-draft',
      //   name: 'policy/policy-draft'
      // }
    ]
  },
  {
    name: 'products',
    icon: 'ios-archive-outline',
    path: '/products',
    title: '商城管理',
    children: [{
      title: '首页设置',
      path: '/v1/applet-home-setting/index',
      keepName: 'home-set',
      name: 'products/home-set'
    },
    {
      title: '类目设置',
      path: '/v1/category/index',
      keepName: 'category',
      name: 'products/category'
    },
    {
      title: '商品设置',
      path: '/v1/product/index',
      keepName: 'product',
      name: 'products/product'
    },
    {
      title: '商家活动列表',
      path: '/v1/merchant-activity-list/index',
      keepName: 'active',
      name: 'products/active-list'
    },
    {
      title: 'WIS资讯列表',
      path: '/v1/information-list/index',
      keepName: 'active',
      name: 'products/information-list'
    }
    ]
  },
  {
    name: 'order-management',
    icon: 'md-list',
    path: '/order-management',
    title: '订单管理',
    children: [{
      title: '订单审核',
      path: '/v1/order/index',
      keepName: 'review',
      name: 'order-management/review'
    },
    {
      title: '订单作废',
      path: '/v1/order-invalid',
      keepName: 'cancellation',
      name: 'order-management/cancellation'
    },
    {
      title: '订单草稿箱',
      path: '/v1/order-draft/index',
      keepName: 'review-draft',
      name: 'order-management/review-draft'
    },
    {
      title: '订单退款审核',
      path: '/v1/order-refund/index',
      keepName: 'refund',
      name: 'order-management/order-refund'
    },
    {
      title: '订单售后审核',
      path: '/v1/order-service/index',
      keepName: 'service',
      name: 'order-management/order-service'
    },
    {
      title: '外仓调货订单',
      path: '/v1/out-warehouse/index',
      keepName: 'the-cargo',
      name: 'order-management/the-cargo'
    },
    {
      title: '添加外仓调货订单',
      // path: '/v1/order-received/index',
      keepName: 'new-cargo',
      name: 'order-management/new-cargo'
    },
    {
      title: '审核',
      // path: '/v1/order-received/index',
      keepName: 'audit-cargo',
      name: 'order-management/audit-cargo'
    },
    {
      title: '详情',
      // path: '/v1/order-received/index',
      keepName: 'particulars-cargo',
      name: 'order-management/particulars-cargo'
    }
    ]
  },
  {
    name: 'replacement-management',
    icon: 'ios-list-box',
    path: '/replacement-management',
    title: '补发管理',
    children: [{
      title: '补发订单审核',
      path: '/v1/order-reissue/index',
      keepName: 'replacement-review',
      name: 'replacement-management/replacement-order-review/review'
    },
    {
      title: '样品订单审核',
      path: '/v1/order-sample/index',
      keepName: 'sample-review',
      name: 'replacement-management/sample-order-review/review'
    },
    {
      title: '补发/样品订单作废',
      path: '/v1/order-reissue-invalid/index',
      keepName: 'replacement-sample-invalid',
      name: 'replacement-management/replacement-sample-invalid'
    }
    ]
  },
  {
    name: 'order-receipt',
    icon: 'ios-list-box',
    path: '/order-receipt',
    title: '订单收款',
    children: [{
      title: '现款现货订单',
      path: '/v1/receipt-cash-on-delivery/index',
      keepName: 'cash',
      name: 'receipt/cash'
    },
    {
      title: '月结订单',
      path: '/v1/receipt-monthly/index',
      keepName: 'month',
      name: 'receipt/month'
    },
    {
      title: '实销实结订单',
      path: '/v1/receipt-real-sales/index',
      keepName: 'actual',
      name: 'receipt/actual'
    }
    ]
  },
  {
    name: 'order-delivery-management',
    icon: 'ios-list-box',
    path: '/order-delivery-management',
    title: '订单发货管理',
    children: [
      { title: '订单发货', path: '/v1/order-delivery/index', keepName: 'deliver', name: 'order-management/deliver' },
      { title: '补发订单发货', path: '/v1/order-reissue-delivery/index', keepName: 'replacement-deliver', name: 'order-delivery-management/replacement-deliver' },
      { title: '样品订单发货', path: '/v1/order-sample-delivery/index', keepName: 'sample-deliver', name: 'order-delivery-management/sample-deliver' },
      { title: '外仓调货发货', path: '/v1/out-source-deliver-goods/index', keepName: 'outside-calls', name: 'order-delivery-management/outside-calls-deliver' }
    ]
  },
  {
    name: 'inform-management',
    icon: 'md-list',
    path: '/inform-management',
    title: '通知管理',
    children: [{
      title: '钉钉通知',
      path: '/v1/manage-notice-ding/index',
      keepName: 'nailing-notice',
      name: 'inform-management/nailing-notice'
    }]
  },
  {
    name: 'sale',
    icon: 'ios-book',
    path: '/sale',
    title: '销售单管理',
    children: [{
      title: '销售单审核',
      path: '/v1/sales-order-management/index',
      keepName: 'sale-review',
      name: 'sale-order-management/sale-order-review/review'
    }]
  },
  {
    name: 'store',
    icon: 'ios-book',
    path: '/store',
    title: '库存单管理',
    children: [{
      title: '库存单审核',
      path: '/v1/stock-order-management/index',
      keepName: 'store-review',
      name: 'store-order-management/store-order-review/review'
    }]
  },
  {
    name: 'setting',
    icon: 'ios-settings',
    path: '/setting',
    title: '系统设置',
    children: [
      {
        title: '权限管理',
        path: '/v1/user/admin',
        name: 'setting/permission'
      },
      {
        title: '流程管理',
        path: '/workflow/default/index',
        name: 'setting/workflow'
      },
      {
        title: '角色管理',
        path: '/v2/auth/role-list',
        name: 'setting/role-manage'
      },
      {
        title: '新权限管理',
        path: '/v2/auth/permission-list',
        name: 'setting/role-permission'
      },
      {
        title: '票务审核人管理',
        path: '/v2/ticket-reviewer/index',
        name: 'setting/ticket-reviewer'
      }
    ]
  },
  {
    name: 'notebook',
    icon: 'ios-book',
    path: '/notebook',
    title: '使用指南',
    children: [{
      title: '使用手册',
      path: '/v1/notebook/index',
      name: 'notebook/notebook'
    }]
  }
]
