import fetch from './fetch'

const user = (params) => {
  return fetch({
    url: '/v1/user',
    method: 'get',
    params: params,
  })
}

const login = (params) => {
  return fetch({
    url: '/v1/login/sign-in',
    method: 'post',
    data: params,
  })
}

const getCaptcha = (params) => {
  return fetch({
    url: '/v1/login/captcha',
    method: 'post',
    data: params,
  })
}

const getMenu = (id) => {
  return fetch({
    url: '/v1/user/menu',
    method: 'get',
  })
}

const getPermission = () => {
  return fetch({
    url: '/v1/user/access-route',
    method: 'GET',
  })
}

const getLog = (params) => {
  return fetch({
    url: '/v1/log',
    method: 'get',
    params: params,
  })
}

/**
 * 商品设置-显示
 * */
const productShow = (params) => {
  return fetch({
    url: '/v1/product/show',
    method: 'PATCH',
    data: params,
  })
}

/**
 * 商品设置-隐藏
 * */
const productNotShow = (params) => {
  return fetch({
    url: '/v1/product/not-show',
    method: 'PATCH',
    data: params,
  })
}

/**
 * 商品设置-缺货
 * */
const productShortage = (params) => {
  return fetch({
    url: '/v1/product/shortage',
    method: 'PATCH',
    data: params,
  })
}

/**
 * 商品设置-正常
 * */
const productNotShortage = (params) => {
  return fetch({
    url: '/v1/product/not-shortage',
    method: 'PATCH',
    data: params,
  })
}

/**
 * 收款账户 - 模糊查询
 * */
const queryRemittanceName = (params) => {
  return fetch({
    url: '/v1/receipt-bank/query-receivable-bank',
    method: 'get',
    params: params,
  })
}
/**
 * 收款账户 - 所有账户类型
 * */
const queryImportMode = (params) => {
  return fetch({
    url: '/v1/receipt-bank/bank-type-list',
    method: 'get',
    params: params,
  })
}
/**
 * 首页-获取待办通知
 * */
const informationModular = (params) => {
  return fetch({
    url: '/v1/message/index',
    method: 'get',
    params: params,
  })
}
/**
 * 首页-点击未读信息（修改状态未已读）
 * */
const informationRead = (params) => {
  return fetch({
    url: '/v1/message/read',
    method: 'post',
    data: params,
  })
}
/**
 * 获取所有权
 * */
const getOwnership = (params) => {
  return new Promise((resolve, reject) => {
    const data = [
      {
        label: '公司所有权',
        ownership: 'company',
      },
      {
        label: '部门所有权',
        ownership: 'department',
      },
      {
        label: '我的所有权',
        ownership: 'self',
      },
    ]
    resolve(data)
  })
}
/**
 * 类目管理-列表
 * */
const categoryManagementList = (params) => {
  return fetch({
    url: '/v1/category',
    method: 'GET',
    params: params,
  })
}

/**
 * 类目管理-显示
 * */
const categoryManagementShow = (params) => {
  return fetch({
    url: '/v1/category/show',
    method: 'PATCH',
    data: params,
  })
}

/**
 * 类目管理-隐藏
 * */
const categoryManagementNotShow = (params) => {
  return fetch({
    url: '/v1/category/not-show',
    method: 'PATCH',
    data: params,
  })
}

/**
 * 类目管理-添加
 * */
const categoryManagementCreate = (params) => {
  return fetch({
    url: '/v1/category',
    method: 'POST',
    data: params,
  })
}
/**
 * 类目管理-详情
 * */
const categoryManagementDetail = (id) => {
  return fetch({
    url: `/v1/category/${id}`,
    method: 'GET',
  })
}
/**
 * 类目管理-修改
 * */
const categoryManagementEdit = (params) => {
  return fetch({
    url: `/v1/category/${params.id}`,
    method: 'PATCH',
    data: params,
  })
}

/**
 * 商品管理-列表
 * */
const productManagementList = (params) => {
  return fetch({
    url: '/v1/product',
    method: 'GET',
    params: params,
  })
}
/**
 * 商品管理-详情
 * */
const productManagementDetails = (id) => {
  return fetch({
    url: `/v1/product/${id}`,
    method: 'GET',
    params: id,
  })
}

/**
 * 商品管理-添加
 * */
const productManagementCreate = (params) => {
  return fetch({
    url: '/v1/product',
    method: 'POST',
    data: params,
  })
}

/**
 * 商品管理-修改
 * ${params.id}
 * */
const productManagementEdit = (params) => {
  return fetch({
    // url: '/v1/product/update',
    url: `/v1/product/${params.id}`,
    method: 'PATCH',
    data: params,
  })
}

/**
 * 商品管理-导出
 * */
const productManagementDownload = (params) => {
  return fetch({
    url: '/v1/product/product-export',
    method: 'POST',
  })
}

/**
 * 商品管理-导入
 * */
const productManagementUpload = (params) => {
  return fetch({
    url: '/v1/product/product-import',
    method: 'POST',
    params: params,
  })
}

/**
 * 商品管理-删除
 * */
const productManagementDelete = (id) => {
  return fetch({
    url: `/v1/product/${id}`,
    method: 'DELETE',
    params: id,
  })
}
/**
 * 订单审核-列表
 * */
const orderReviewList = (params) => {
  return fetch({
    url: '/v1/order/index',
    method: 'get',
    params: params,
  })
}

/**
 * 订单审核-详情
 * */
const orderReviewDetails = (id) => {
  return fetch({
    url: `/v1/order/${id}`,
    method: 'get',
  })
}
/**
 * 订单发货-下载
 * */
const orderDeliveryExport = (id) => {
  return fetch({
    url: '/v1/order-delivery/order-delivery-export',
    method: 'get',
    params: {
      id,
    },
  })
}

/**
 * 订单审核-添加
 * */
const orderReviewCreate = (params) => {
  return fetch({
    url: '/v1/order/create',
    method: 'POST',
    data: params,
  })
}

/**
 * 订单审核-编辑
 * */
const orderReviewEdit = (params) => {
  return fetch({
    url: '/v1/order/update',
    method: 'PATCH',
    data: params,
  })
}
/**
 * 作废订单-列表
 * */
const orderCancellationList = (params) => {
  return fetch({
    url: '/v1/order-invalid',
    // url: '/v1/order-reissue-invalid',
    method: 'get',
    params: params,
  })
}
/**
 * 作废订单-作废
 * */
const orderCancellation = (params) => {
  return fetch({
    url: '/v1/order/invalid',
    method: 'POST',
    data: params,
  })
}
/**
 * 订单审核-删除
 * */
const orderReviewDelete = (id) => {
  return fetch({
    url: '/v1/order/' + id,
    method: 'DELETE',
  })
}
/**
 * 订单审核-经理审核
 * */
const orderReviewManagerAudit = (params) => {
  return fetch({
    url: '/v1/order/manager-audit',
    method: 'POST',
    data: params,
  })
}
/**
 * 订单审核-总监审核
 * */
const orderReviewDirectorAudit = (params) => {
  return fetch({
    url: '/v1/order/director-audit',
    method: 'POST',
    data: params,
  })
}

/**
 * 补发订单审核 - 审核
 * */
 const replacementOrderReviewManagerAudit = (params) => {
  return fetch({
    url: '/v1/order-reissue/manager-audit',
    method: 'POST',
    data: params,
  })
}

/**
 * 样品订单审核 - 初审
 * */
 const sampleOrderReviewManagerAudit = (params) => {
  return fetch({
    url: '/v1/order-sample/manager-audit',
    method: 'POST',
    data: params,
  })
}

/**
 * 样品订单审核 - 复审
 * */
 const sampleOrderReviewDirectorAudit = (params) => {
  return fetch({
    url: '/v1/order-sample/director-audit',
    method: 'POST',
    data: params,
  })
}

/**
 * 订单审核-查询商家
 * */
const orderReviewQueryContractor = (params) => {
  return fetch({
    url: '/v1/order/query-contractor',
    method: 'GET',
    params: params,
  })
}

/**
 * 订单审核-查询产品
 * */
const orderReviewQueryProduct = (params) => {
  return fetch({
    url: '/v1/order/query-product',
    method: 'GET',
    params: params,
  })
}

// 订单退款审核 - 退款 列表
const orderRefundList = (params) => {
  return fetch({
    url: '/v1/order-refund',
    method: 'GET',
    params,
  })
}
// 订单退款审核 - 退款 - 添加
const orderRefundAdd = (params) => {
  return fetch({
    url: '/v1/order-refund',
    method: 'POST',
    data: params,
  })
}
// 订单退款审核 - 退款 - 详情
const orderRefundDetails = (id) => {
  return fetch({
    url: `/v1/order-refund/${id}`,
    method: 'GET',
  })
}
// 订单退款审核 - 退款 - 删除
const orderRefundDelete = (id) => {
  return fetch({
    url: `/v1/order-refund/${id}`,
    method: 'DELETE',
  })
}

// 订单退款审核 - 退款 - 初审
const orderRefundAudit = (params) => {
  return fetch({
    url: '/v1/order-refund/audit',
    method: 'POST',
    data: params,
  })
}

// 订单退款审核 - 退款 - 复审
const orderRefundAuditSec = (params) => {
  return fetch({
    url: '/v1/order-refund/director-audit',
    method: 'POST',
    data: params,
  })
}

// 订单退款审核 - 退款 -  导出
const orderRefundExport = (params) => {
  return fetch({
    url: '/v1/order-refund/export',
    method: 'POST',
    data: params,
  })
}

// 订单售后审核 - 列表
const orderServiceList = (params) => {
  return fetch({
    url: '/v1/order-service',
    method: 'GET',
    params,
  })
}
// 订单售后审核 - 添加
const orderServiceAdd = (params) => {
  return fetch({
    url: '/v1/order-service',
    method: 'POST',
    data: params,
  })
}

// 订单售后审核 - 详情
const orderServiceDetails = (id) => {
  return fetch({
    url: `/v1/order-service/${id}`,
    method: 'GET',
  })
}

// 订单售后审核 -  删除
const orderServiceDelete = (id) => {
  return fetch({
    url: `/v1/order-service/${id}`,
    method: 'DELETE',
  })
}

// 订单售后审核 -  审核
const orderServiceAudit = (params) => {
  return fetch({
    url: '/v1/order-service/audit',
    method: 'POST',
    data: params,
  })
}
// 订单售后审核 - 关闭
const orderServiceClose = (params) => {
  return fetch({
    url: '/v1/order-service/close',
    method: 'POST',
    data: params,
  })
}

//外仓调货订单-主页
const warehouseList = (params) => {
  return fetch({
    url: `/v1/out-warehouse/index`,
    method: 'GET',
    params,
  })
}

//外仓调货订单-删除
const warehouseDeal = (params) => {
  return fetch({
    url: `/v1/out-warehouse/destroy`,
    method: 'DELETE',
    params,
  })
}

//外仓调货-详情页
const getwareData = (params) => {
  return fetch({
    url: `/v1/out-warehouse/view`,
    method: 'GET',
    params,
  })
}

//外仓调货-审核
const getwareaudit = (data) => {
  return fetch({
    url: `/v1/out-warehouse/audit`,
    method: 'POST',
    data,
  })
}

//外仓调货-打印
const warehousePrint = (params) => {
  return fetch({
    url: `/v1/out-warehouse/print-order`,
    method: 'GET',
    params,
  })
}

//外仓调货-模糊搜索-货号
const accountSearch = (params) => {
  return fetch({
    url: `/v1/product/account-number-search`,
    method: 'GET',
    params,
  })
}

//外仓调货-模板下载
const downtemp = (params) => {
  return fetch({
    url: `/v1/out-warehouse/out-warehouse-export`,
    method: 'GET',
    // params,
  })
}

//外仓调货-上传文件对数据处理
const inupdata = (data) => {
  return fetch({
    headers: {
      // formData: true,
      'Content-Type': 'multipart/form-data',
    },
    url: `/v1/out-warehouse/import-stock`,
    method: 'POST',
    data,
  })
}

// 外仓调货-修改
const alertData = (data) => {
  return fetch({
    url: `/v1/out-warehouse/update`,
    method: 'POST',
    data,
  })
}

// 外仓调货-添加
const wareAdd = (data) => {
  return fetch({
    url: '/v1/out-warehouse/create',
    method: 'POST',
    data,
  })
}

//平台模糊搜索
const wareptSearch = (params) => {
  return fetch({
    url: '/v1/contractor-management/partner-bring',
    method: 'GET',
    params,
  })
}

/**
 * 合作商管理接口 start
 * */

/**
 * 合作商列表-添加
 */
// const contractorCreate = params => {
// 	return fetch({
// 		url: '/v1/contractor-management',
// 		method: 'POST',
// 		data: params,
// 	})
// }
const contractorCreate = (params) => {
  return fetch({
    url: '/v2/contractor/create',
    method: 'POST',
    data: params,
  })
}
/**
 * 合作商列表-添加-城市级联
 */
const urbanCascade = (params) => {
  return fetch({
    url: '/v1/common/city-cascader',
    method: 'GET',
  })
}
/**
 * 合作商 - 获取合作商政策数据
 */
const getPartnerPolicyArray = (params) => {
  return fetch({
    url: '/v1/contractor-management/get-partner-policy-array',
    method: 'GET',
    params: params,
  })
}
/**
 * 合作商列表-列表
 */
const contractorList = (params) => {
  return fetch({
    url: '/v1/contractor-management',
    method: 'GET',
    params: params,
  })
}

/**
 * 合作商列表-详情
 * v1版本=用于审核
 */
const contractorDetail = (id) => {
  return fetch({
    url: `/v1/contractor-management/${id}`,
    method: 'GET',
  })
}
/**
 *
 * @param {v2} params
 * 用于编辑详情
 */
const editContractorDetail = (params) => {
  return fetch({
    url: `/v2/contractor/view`,
    method: 'GET',
    params,
  })
}

/**
 * 合作商列表-审核
 */
const contractorAudit = (params) => {
  return fetch({
    url: '/v1/contractor-management/audit',
    method: 'POST',
    data: params,
  })
}

/**
 * 合作商列表-删除
 */
const contractorDelete = (id) => {
  return fetch({
    url: `/v1/contractor-management/${id}`,
    method: 'DELETE',
  })
}

/**
 * 账号管理-列表
 */
const accountManagementList = (params) => {
  return fetch({
    url: '/v1/we-chat-user',
    method: 'GET',
    params: params,
  })
}
/**
 * 账号管理-解绑
 */
const accountManagementUnbind = (params) => {
  return fetch({
    url: '/v1/we-chat-user/unbind',
    method: 'POST',
    data: {
      id: params,
    },
  })
}
/**
 * 账号管理-详情
 */
const accountManagementDetails = (id) => {
  return fetch({
    url: `/v1/we-chat-user-contractor/view?id=${id}`,
    method: 'GET',
  })
}
/**
 * 账号管理-编辑（审核/禁用）
 */
const accountManagementTabAudit = (params, id) => {
  return fetch({
    url: `/v1/we-chat-user-contractor/${id}`,
    method: 'PATCH',
    data: params,
  })
}

/**
 * 获取合同政策数据
 */
const contractPolicy = (params) => {
  return fetch({
    url: '/v1/contractor-management/get-contract-policy-array',
    method: 'GET',
    params: params,
  })
}

/**
 * 获取业务员
 */
const salesmanData = (params) => {
  return fetch({
    url: '/v1/contractor-management/get-salesman-array',
    method: 'GET',
    params: params,
  })
}

/**
 * 导出
 */
const contractorExport = (params) => {
  return fetch({
    url: '/v1/contractor-management/contractor-export',
    method: 'POST',
    data: params,
  })
}
/**
 * 订单审核-查询单品折扣
 * */
const orderReviewQueryProductDiscount = (params) => {
  return fetch({
    // url: '/v1/order/get-discount',
    // url: '/v1/order/discount',
    url: '/v2/contract-policy/discount',
    method: 'POST',
    data: params,
  })
}

/**
 * 导入
 */
const contractorImport = (params) => {
  return fetch({
    url: '/v1/contractor-management/contractor-import',
    method: 'POST',
    data: params,
  })
}

/**
 * 合作商列表-修改-旧
 * 不知道是否全为新接口-TODO
 */
// const contractorUpdate = params => {
// 	return fetch({
// 		url: '/v1/contractor-management/update',
// 		method: 'PAtCH',
// 		data: params,
// 	})
// }
/**
 * 合作商列表-修改
 */
const contractorUpdate = (params) => {
  return fetch({
    url: `/v2/contractor/update?id=${params.id}`,
    method: 'PAtCH',
    data: params,
  })
}
/**
 * 合作商管理接口 end
 */

/**
 * 合同政策管理-列表
 */
const contractPoliceList = (params) => {
  return fetch({
    url: '/v1/contract-policy-management',
    method: 'get',
    params: params,
  })
}

/**
 * 合同政策管理-列表v2
 */
const contractPoliceListv2 = (params) => {
  return fetch({
    url: '/v2/contract-policy',
    method: 'get',
    params: params,
  })
}

/**
 * 合同政策管理-添加
 */
const addContractPolice = (params) => {
  return fetch({
    url: '/v1/contract-policy-management',
    method: 'POST',
    data: params,
  })
}
/**
 * 合同政策管理-添加v2
 */
const addContractPolicev2 = (params) => {
  return fetch({
    url: '/v2/contract-policy/create',
    method: 'POST',
    data: params,
  })
}
//--合同政策管理-适用商品-start
/**
 * 合同政策管理-适用商品-获取类目列表-0107版本-v2
 */
const getProductList = (params) => {
  return fetch({
    url: '/v2/category/get-category',
    method: 'GET',
    params: params,
  })
}
/**
 * 合同政策管理-适用商品-类目下商品列表-0107版本-v2
 */
const getProductCategoryList = (params) => {
  return fetch({
    url: '/v2/product/category-product',
    method: 'GET',
    params: params,
  })
}
/**
 * 合同政策管理-适用商品列表-0107版本-v2
 */
const getRegularProductList = (params) => {
  return fetch({
    url: '/v2/regular-product',
    method: 'GET',
    params: params,
  })
}
/**
 * 合同政策管理-适用商品列表-添加-0107版本-v2
 */
const addRegularProductList = (data) => {
  return fetch({
    url: '/v2/regular-product/create',
    method: 'POST',
    data,
  })
}
/**
 * 合同政策管理-适用商品列表-编辑-0107版本-v2
 */
const editRegularProductList = (data) => {
  return fetch({
    url: '/v2/regular-product/update',
    method: 'PATCH',
    data,
  })
}
/**
 * 合同政策管理-适用商品列表-预删除-0107版本-v2
 */
const nodelRegularProductList = (params) => {
  return fetch({
    url: '/v2/regular-product/pre-delete',
    method: 'DELETE',
    params,
  })
}
/**
 * 合同政策管理-适用商品列表-确认删除删除-0107版本-v2
 */
const delRegularProductList = (params) => {
  return fetch({
    url: '/v2/regular-product/confirm-delete',
    method: 'DELETE',
    params,
  })
}
/**
 * 合同政策管理-订单审核的政策详情
 */
const getCategoryList = (params) => {
  return fetch({
    url: '/v2/contract-policy/regular-product',
    method: 'GET',
    params,
  })
}
//--合同政策管理-适用商品-end
/**
 * 合同政策管理-获取品类数据
 */
const getCategoryData = (params) => {
  return fetch({
    url: '/v1/contract-policy-management/get-category',
    method: 'get',
    params: params,
  })
}
/**
 * 合同政策管理-获取产品数据
 */
const getProductData = (params) => {
  return fetch({
    url: '/v1/contract-policy-management/get-product',
    method: 'get',
    params: params,
  })
}

/**
 * 合同政策管理-详情
 */
const getContractPoliceDetail = (id) => {
  return fetch({
    url: `/v1/contract-policy-management/${id}`,
    method: 'GET',
  })
}

/**
 * 合同政策管理-详情v2
 */
const getContractPoliceDetailv2 = (id) => {
  return fetch({
    url: `/v2/contract-policy/view?id=${id}`,
    method: 'GET',
  })
}

/**
 * 合同政策管理-审核
 */
const auditContractPolice = (params) => {
  return fetch({
    url: '/v1/contract-policy-management/audit',
    method: 'POST',
    data: params,
  })
}
/**
 * 合同政策管理-审核v2
 */
const auditContractPolicev2 = (params) => {
  return fetch({
    url: '/v2/contract-policy/audit',
    method: 'POST',
    data: params,
  })
}
/**
 * 合同政策管理-删除
 */
const contractPoliceDelete = (id) => {
  return fetch({
    url: `/v1/contract-policy-management/${id}`,
    method: 'DELETE',
    params: id,
  })
}

/**
 * 合同政策管理-删除v2
 */
const contractPoliceDeletev2 = (id) => {
  return fetch({
    url: `/v2/contract-policy/delete?id=${id}`,
    method: 'DELETE',
    params: id,
  })
}

/**
 * 合同政策管理-修改
 */
const contractPoliceEdit = (params) => {
  return fetch({
    url: '/v1/contract-policy-management/update',
    method: 'PATCH',
    data: params,
  })
}

/**
 * 合同政策管理-修改v2
 */
const contractPoliceEditv2 = (params, id) => {
  return fetch({
    url: `/v2/contract-policy/update?id=${id}`,
    method: 'PATCH',
    data: params,
  })
}

/**
 * 合同政策管理-启用
 */
const contractPoliceEnable = (params) => {
  return fetch({
    // url: '/v1/contract-policy-management/start-using',
    url: '/v2/contract-policy/start-using',
    method: 'POST',
    data: params,
  })
}

/***
 * 合作商政策管理 - 列表
 */
const policyPartnerList = (params) => {
  return fetch({
    url: '/v1/partner-policy/index',
    method: 'GET',
    params: params,
  })
}
/***
 * 合作商政策管理 - 添加
 */
const policyPartnerCreate = (params) => {
  return fetch({
    url: '/v1/partner-policy/create',
    method: 'POST',
    data: params,
  })
}
/***
 * 合作商政策管理 - 编辑
 */
const policyPartnerEdit = (params) => {
  return fetch({
    url: '/v1/partner-policy/update',
    method: 'PATCH',
    data: params,
  })
}
/***
 * 合作商政策管理 - 查询合同政策
 */
const queryContractPolicy = (params) => {
  return fetch({
    url: '/v1/partner-policy/query-contract-policy',
    method: 'GET',
    params: params,
  })
}

/***
 * 合作商政策管理 - 查询合同政策
 */
 const queryOrderContractPolicy = (params) => {
  return fetch({
    url: '/v1/order/query-contract-policy',
    method: 'GET',
    params: params,
  })
}

/***
 * 合作商政策管理 - 获取详情
 */
const getPolicyPartnerDetails = (id) => {
  return fetch({
    url: `/v1/partner-policy/${id}`,
    method: 'GET',
  })
}

/***
 * 合作商政策管理 - 删除
 */
const policyPartnerDelete = (id) => {
  return fetch({
    url: `/v1/partner-policy/${id}`,
    method: 'DELETE',
    data: id,
  })
}

// 合作商政策管理 - 门店补录列表
const storeList = (params) => {
  return fetch({
    url: '/v1/contractor-management/facade-supplement',
    method: 'GET',
    params: params,
  })
}

// 合作商政策管理 - 门店补录删除
const delStore = (id) => {
  return fetch({
    url: `/v1/contractor-management/facade-delete?id=${id}`,
    method: 'DELETE',
  })
}

// 合作商政策管理 - 门店补录删除
const auditStore = (params) => {
  return fetch({
    url: '/v1/contractor-management/facade-audit',
    method: 'POST',
    data: params,
  })
}

const storeCheck = (params) => {
  return fetch({
    url: '/v1/contractor-management/facade-check',
    method: 'POST',
    data: params,
  })
}

/***
 * 订单收款
 */

/***
 * 订单收款 - 现款现货订单 - 列表
 */
const receiptCashList = (params) => {
  return fetch({
    url: '/v1/receipt-cash-on-delivery',
    method: 'GET',
    params: params,
  })
}

/***
 * 订单收款 - 现款现货订单 - 详情
 */
const receiptCashDetail = (id) => {
  return fetch({
    url: `/v1/receipt-cash-on-delivery/${id}`,
    method: 'GET',
  })
}

/***
 * 订单收款 - 现款现货订单 - 收款
 */
const receiptCashReceipt = (params) => {
  return fetch({
    url: '/v1/receipt-cash-on-delivery/receipt',
    method: 'POST',
    data: params,
  })
}

/***
 * 订单收款 - 现款现货订单 - 收款详情
 */
const receiptCashReceiptView = (params) => {
  return fetch({
    url: '/v1/receipt-cash-on-delivery/receipt-view',
    method: 'GET',
    params: params,
  })
}

/***
 * 订单发货-列表
 */
const orderDeliverList = (params) => {
  return fetch({
    url: '/v1/order-delivery/index',
    method: 'get',
    params: params,
  })
}

/***
 * 公共分类：订单收款 - 现款现货订单 - 部门信息
 */
const loginMessage = (params) => {
  return fetch({
    url: '/v1/user/login-message',
    method: 'GET',
    params: params,
  })
}

/***
 * 订单发货-详情
 */
const orderDeliverDetail = (params) => {
  return fetch({
    url: '/v1/order-delivery/view',
    method: 'get',
    params: params,
  })
}

/***
 * 订单发货-导单处理
 */
const orderDeliverHandle = (params) => {
  return fetch({
    url: '/v1/order-delivery/dispose-delivery',
    method: 'POST',
    data: params,
  })
}
/***
 * 订单发货-订单导出
 */
const orderExport = (params) => {
  return fetch({
    url: '/v1/order-delivery/order-export',
    method: 'POST',
    data: params,
  })
}

/***
 * 订单收款 - 月结订单 - 列表
 */
const receiptMonthly = (params) => {
  return fetch({
    url: '/v1/receipt-monthly',
    method: 'GET',
    params: params,
  })
}

/***
 * 订单发货-下载
 */
const downlodaOrder = (params) => {
  return fetch({
    url: '/v1/order-delivery/order-delivery-export',
    method: 'get',
    params: params,
  })
}

/***
 * 订单收款 - 月结订单 - 详情
 */
const receiptMonthlyDetail = (id) => {
  return fetch({
    url: `/v1/receipt-monthly/${id}`,
    method: 'GET',
  })
}

/***
 * 订单收款 - 月结订单 - 收款详情
 */
const receiptMonthlyReceipt = (params) => {
  return fetch({
    url: '/v1/receipt-monthly/receipt-view',
    method: 'GET',
    params: params,
  })
}

/***
 * 订单收款 - 月结订单 - 批量收款
 */
const receiptMonthlyDouble = (params) => {
  return fetch({
    url: '/v1/receipt-monthly/receipt',
    method: 'POST',
    data: params,
  })
}

/***
 * 订单发货-通知发货
 */
const NotificationOfDelivery = (params) => {
  return fetch({
    url: '/v1/order-delivery/notice',
    method: 'POST',
    data: params,
  })
}

/***
 * 订单收款 - 实销实结订单 - 列表
 */
const realSales = (params) => {
  return fetch({
    url: '/v1/receipt-real-sales',
    method: 'GET',
    params: params,
  })
}

/***
 * 订单收款 - 实销实结订单 - 详情
 */
const realSalesDetail = (id) => {
  return fetch({
    url: `/v1/receipt-real-sales/${id}`,
    method: 'GET',
  })
}

/***
 * 订单收款 - 实销实结订单 - 收款详情
 */
const realSalesReceipt = (params) => {
  return fetch({
    url: '/v1/receipt-real-sales/receipt-view',
    method: 'GET',
    params: params,
  })
}

/***
 * 订单收款 -  实销实结 - 批量收款
 */
const realSalesDouble = (params) => {
  return fetch({
    url: '/v1/receipt-real-sales/receipt',
    method: 'POST',
    data: params,
  })
}
/***
 * 订单发货-发货设置-详情
 */
const deliverSetDetail = (params) => {
  return fetch({
    url: '/v1/order-delivery/query-detail',
    method: 'GET',
    params: params,
  })
}
/**
 * 订单审核-获取返点和赠品额度
 * */
const orderReviewGetDiscountLimit = (params) => {
  return fetch({
    url: '/v1/order/get-limit',
    method: 'GET',
    params: params,
  })
}

/**
 * 订单发货-发货设置
 * */
const submitSet = (params) => {
  return fetch({
    url: `/v1/order-delivery/${params.id}`,
    method: 'PATCH',
    data: params,
  })
}

/**
 *员工档案-列表
 * */
const employeeFilesList = (params) => {
  return fetch({
    url: '/v1/employee',
    method: 'GET',
    params: params,
  })
}

/**
 *员工档案-列表
 * */
 const getEmployeeFilesList = (params) => {
  return fetch({
    url: '/v2/employee',
    method: 'GET',
    params: params,
  })
}

/**
 *员工档案-编辑
 * */
const employeeFilesUpdate = (params) => {
  return fetch({
    url: '/v1/employee/update',
    method: 'PATCH',
    data: params,
  })
}

/**
 *员工档案 - 编辑
 * */
 const updateEmployeeFilesUpdate = (params) => {
  return fetch({
    url: '/v2/employee/update',
    method: 'PUT',
    data: params,
  })
}

/**
 *员工档案-启用/禁用
 * */
const employeeFilesDisable = (params) => {
  return fetch({
    url: '/v1/employee/disable',
    method: 'PATCH',
    data: params,
  })
}

/**
 *员工档案-启用/禁用
 * */
 const setEmployeeFilesStatus = (params) => {
  return fetch({
    url: '/v2/employee/status',
    method: 'PATCH',
    data: params,
  })
}

/**
 *员工档案-详情
 * */
const employeeFilesDetail = (params) => {
  return fetch({
    url: '/v1/employee/view',
    method: 'GET',
    params: params,
  })
}

/**
 *员工档案-详情
 * */
 const getEmployeeFilesDetail = (params) => {
  return fetch({
    url: '/v2/employee/view',
    method: 'GET',
    params: params,
  })
}

/**
 *员工档案-删除
 * */
const employeeFilesDelete = (params) => {
  return fetch({
    url: '/v1/employee/delete',
    method: 'DELETE',
    params: params,
  })
}

/**
 *员工档案-删除
 * */
 const deletEemployeeFile = (params) => {
  return fetch({
    url: '/v2/employee/delete',
    method: 'DELETE',
    params: params,
  })
}

/**
 *员工档案 - 搜索职位
 * */
const employeeFilesGetJob = (params) => {
  return fetch({
    url: '/v1/search/jobs',
    method: 'GET',
    params: params,
  })
}

/**
 *员工档案 - 搜索部门
 * */
const employeeFilesGetDept = (params) => {
  return fetch({
    url: '/v1/search/dept',
    method: 'GET',
    params: params,
  })
}

/**
 *员工档案 - 头像预览接口
 * */
const employeePreview = (params) => {
  return fetch({
    url: '/v1/employee/preview',
    method: 'GET',
    params: params,
  })
}

// 员工管理-排行榜管理-列表
const rankingList = (params) => {
  return fetch({
    url: '/v1/user-ranking-video',
    method: 'GET',
    params: params,
  })
}

// 员工管理 - 组织架构 - 部门树
const getOrganizationDeptTree = (params) => {
  return fetch({
    url: '/v2/offline-dept/dept-tree',
    method: 'GET',
    params: params
  })
}

// 员工管理 - 组织架构 - 员工列表
const getOrganizationEmployeeList = (params) => {
  return fetch({
    url: '/v2/offline-dept/employee-list',
    method: 'GET',
    params: params
  })
}

// 员工管理 - 组织架构 - 部门信息
const getOrganizationDeptDetail = (params) => {
  return fetch({
    url: '/v2/offline-dept/view',
    method: 'GET',
    params: params
  })
}

// 员工管理 - 组织架构 - 新建部门
const createOrganizationDept = (params) => {
  return fetch({
    url: '/v2/offline-dept/create',
    method: 'POST',
    data: params
  })
}

// 员工管理 - 组织架构 - 设置部门
const updateOrganizationDept = (params) => {
  return fetch({
    url: '/v2/offline-dept/update',
    method: 'PATCH',
    data: params
  })
}

// 员工管理 - 组织架构 - 删除部门
const deleteOrganizationDept = (params) => {
  return fetch({
    url: '/v2/offline-dept/delete',
    method: 'DELETE',
    params: params
  })
}

// 员工管理 - 组织架构 - 添加员工
const addOrganizationEmployee = (params) => {
  return fetch({
    url: '/v2/offline-dept/add-employee',
    method: 'POST',
    data: params
  })
}

// 员工管理 - 组织架构 - 添加员工
const updateOrganizationEmployee = (params) => {
  return fetch({
    url: '/v2/offline-dept/update-employee',
    method: 'PATCH',
    data: params
  })
}

//员工排行榜审核
const beoffline = (data) => {
  return fetch({
    url: '/v1/user-ranking-video/audit',
    method: 'POST',
    data,
  })
}

//员工排行榜详情
const videoParticulars = (id) => {
  return fetch({
    url: `/v1/user-ranking-video/${id}`,
    method: 'GET',
  })
}

/**
 *合作商管理-申请合作商-列表
 * */
const contractorApplyList = (params) => {
  return fetch({
    url: '/v1/wechat-contractor-apply',
    method: 'GET',
    params: params,
  })
}

/**
 *合作商管理-申请合作商-确认受理-详情
 * */
const contractorApplyApply = (params) => {
  return fetch({
    url: '/v1/wechat-contractor-apply/view',
    method: 'GET',
    params: params,
  })
}

/**
 *合作商管理-申请合作商-确认受理
 * */
const contractorApplyAccept = (params) => {
  return fetch({
    url: '/v1/wechat-contractor-apply/accept',
    method: 'PATCH',
    data: params,
  })
}

/**
 *合作商管理-申请合作商-处理受理
 * */
const contractorApplyProcess = (params) => {
  return fetch({
    url: '/v1/wechat-contractor-apply/process',
    method: 'PATCH',
    data: params,
  })
}

/**
 *合作商管理-申请合作商-删除
 * */
const contractorApplyDel = (id) => {
  return fetch({
    url: `/v1/wechat-contractor-apply/${id}`,
    method: 'DELETE',
    params: id,
  })
}

/**
 *商品管理-首页设置
 * */
const appletHomeSettingIndex = (params) => {
  return fetch({
    url: '/v1/applet-home-setting/index',
    method: 'GET',
    params: params,
  })
}

/**
 *商品管理-首页设置-图片预览
 * */
const appletHomeSettingPreview = (params) => {
  return fetch({
    url: '/v1/applet-home-setting/preview',
    method: 'GET',
    params: params,
  })
}

/**
 *商品管理-首页设置-删除
 * */
const appletHomeSettingSetting = (id) => {
  return fetch({
    url: `/v1/applet-home-setting/${id}`,
    method: 'DELETE',
  })
}

/**
 *商品管理-首页设置-编辑
 * */
const appletHomeSettingUpdate = (params) => {
  return fetch({
    url: '/v1/applet-home-setting/update',
    method: 'PATCH',
    data: params,
  })
}

/**
 *商品管理-首页设置-添加
 * */
const appletHomeSettingCreate = (params) => {
  return fetch({
    url: '/v1/applet-home-setting/create',
    method: 'POST',
    data: params,
  })
}

/**
 *商品管理-首页设置-启用
 * */
const appletHomeSettingUse = (params) => {
  return fetch({
    url: '/v1/applet-home-setting/use',
    method: 'PATCH',
    data: params,
  })
}

/**
 *商品管理-首页设置-停用
 * */
const appletHomeSettingNotUse = (params) => {
  return fetch({
    url: '/v1/applet-home-setting/not-use',
    method: 'PATCH',
    data: params,
  })
}

/**
 *商品管理-首页设置-详情
 * */
const appletHomeSettingView = (params) => {
  return fetch({
    url: '/v1/applet-home-setting/view',
    method: 'GET',
    params: params,
  })
}

/**
 *签到管理 - 列表
 * */
const attendanceList = (params) => {
  return fetch({
    url: '/v1/checkin-management',
    method: 'GET',
    params: params,
  })
}

/**
 *签到管理 - 详情
 * */
const attendanceDetail = (params) => {
  return fetch({
    url: '/v1/checkin-management/view',
    method: 'GET',
    params: params,
  })
}

/**
 *签到管理 - 详情 - 获取问卷调查列表
 * */
const attendanceSurveyList = (params) => {
  return fetch({
    url: '/v1/checkin-management/survey-list',
    method: 'GET',
    params: params,
  })
}

/**
 *签到管理 - 导出
 * */
const attendanceExport = (params) => {
  return fetch({
    url: '/v1/checkin-management/export',
    method: 'GET',
    params: params,
  })
}

//美导签到-列表
const guideList = (params) => {
  return fetch({
    url: '/v1/checkin-prettify-management',
    method: 'GET',
    params: params,
  })
}

//美导签到，导出数据
const getDerive = (data) => {
  return fetch({
    url: '/v1/checkin-prettify-management/export',
    method: 'POST',
    data: data,
  })
}

//美导签到，签到详情
const guideDeit = (params) => {
  return fetch({
    url: '/v1/checkin-prettify-management/view',
    method: 'GET',
    params: params,
  })
}

/**
 *政策管理 - 政策草稿箱 - 列表
 * */
const policyDraftList = (params) => {
  return fetch({
    url: '/v1/contract-policy-draft',
    method: 'GET',
    params: params,
  })
}

/**
 *政策管理 - 政策草稿箱 - 列表
 * */
const policyDraftListv2 = (params) => {
  return fetch({
    url: '/v2/contract-policy-draft',
    method: 'GET',
    params: params,
  })
}

/**
 *政策管理 - 政策草稿箱 - 添加
 * */
const policyDraftAdd = (params) => {
  return fetch({
    url: '/v1/contract-policy-draft',
    method: 'POST',
    data: params,
  })
}

/**
 *政策管理 - 政策草稿箱 - 添加v2
 * */
const policyDraftAddv2 = (params) => {
  return fetch({
    url: '/v2/contract-policy-draft/create',
    method: 'POST',
    data: params,
  })
}

/**
 *政策管理 - 政策草稿箱 - 修改
 * */
const policyDraftUpdate = (params) => {
  return fetch({
    url: '/v1/contract-policy-draft/update',
    method: 'PATCH',
    data: params,
  })
}

/**
 *政策管理 - 政策草稿箱 - 修改v2
 * */
const policyDraftUpdatev2 = (params, id) => {
  return fetch({
    url: `/v2/contract-policy-draft/update?id=${id}`,
    method: 'PATCH',
    data: params,
  })
}

/**
 *政策管理 - 政策草稿箱 - 提交
 * */
const policyDraftSubmit = (params) => {
  return fetch({
    url: '/v1/contract-policy-draft/submit',
    method: 'POST',
    data: params,
  })
}

/**
 *政策管理 - 政策草稿箱 - 删除
 * */
const policyDraftDelete = (params) => {
  return fetch({
    url: `/v1/contract-policy-draft/${params.id}`,
    method: 'DELETE',
    params: params,
  })
}

/**
 *政策管理 - 政策草稿箱 - 删除v2
 * */
const policyDraftDeletev2 = (params) => {
  return fetch({
    url: `/v2/contract-policy-draft/delete?id=${params.id}`,
    method: 'DELETE',
    params: params,
  })
}

/**
 *合作商管理 - 合作商草稿 - 列表
 * */
const contractorDraftList = (params) => {
  return fetch({
    url: '/v1/contractor-draft',
    method: 'GET',
    params: params,
  })
}

/**
 *合作商管理 - 合作商草稿 - 添加
 * */
const contractorDraftAdd = (params) => {
  return fetch({
    url: '/v1/contractor-draft/create',
    method: 'POST',
    data: params,
  })
}

/**
 *合作商管理 - 合作商草稿 - 修改
 * */
const contractorDraftUpdate = (params) => {
  return fetch({
    url: '/v1/contractor-draft/update',
    method: 'PATCH',
    data: params,
  })
}

/**
 *合作商管理 - 合作商-收货地址 - 添加
 * */
const contractorAddAddress = (params) => {
  return fetch({
    url: '/v2/contractor-addr-group/create',
    method: 'POST',
    data: params,
  })
}

/**
 *合作商管理 - 合作商-收货地址 - 导入模版
 * */
const contractorTemplateAddress = (params) => {
  return fetch({
    url: '/v2/contractor-addr-group/template',
    method: 'GET',
    params,
  })
}

/**
 *合作商管理 - 合作商-收货地址 - 修改
 * */
const contractorEditAddress = (params) => {
  return fetch({
    url: '/v2/contractor-addr-group/update',
    method: 'PATCH',
    data: params,
  })
}
/**
 *合作商管理 - 合作商-收货地址 - 导入
 * */
const contractorPushAddress = (params) => {
  return fetch({
    url: '/v2/contractor-addr-group/import',
    method: 'PATCH',
    data: params,
  })
}
/**
 *合作商管理 - 合作商-收货地址 - 删除
 * */
const contractorDelAddress = (params) => {
  return fetch({
    url: '/v2/contractor-addr-group/delete',
    method: 'DELETE',
    params: params,
  })
}
/**
 *合作商管理 - 合作商-收货地址 - 列表
 * */
const contractorTabAddress = (params) => {
  return fetch({
    url: '/v2/contractor-addr-group',
    method: 'GET',
    params,
  })
}

/**
 *合作商管理 - 合作商-门店地址 - 添加
 * */
const contractorAddShopInfo = (params) => {
  return fetch({
    url: '/v2/facade/create',
    method: 'POST',
    data: params,
  })
}

/**
 *合作商管理 - 合作商-门店地址 - 导入模版
 * */
const contractorTemplateShop = (params) => {
  return fetch({
    url: '/v2/facade/template',
    method: 'GET',
    params,
  })
}
/**
 *合作商管理 - 合作商-门店地址 - 修改
 * */
const contractorEditShopInfo = (params) => {
  return fetch({
    url: '/v2/facade/update',
    method: 'PATCH',
    data: params,
  })
}
/**
 *合作商管理 - 合作商-门店地址 - 导入
 * */
const contractorPushShopInfo = (params) => {
  return fetch({
    url: '/v2/facade/import',
    method: 'PATCH',
    data: params,
  })
}
/**
 *合作商管理 - 合作商-门店地址 - 删除
 * */
const contractorDelShopInfo = (params) => {
  return fetch({
    url: '/v2/facade/delete',
    method: 'DELETE',
    params: params,
  })
}
/**
 *合作商管理 - 合作商-门店地址 - 列表
 * */
const contractorTabShopInfo = (params) => {
  return fetch({
    url: '/v2/facade',
    method: 'GET',
    params,
  })
}

/**
 *合作商管理 - 操作日志
 * */
const contractorOperationLog = (params) => {
  return fetch({
    url: '/v2/operation-log',
    method: 'GET',
    params: params,
  })
}

/**
 *合作商管理 - 客户门店 - 详情
 * */
const contractorFacadeDetail = (params) => {
  return fetch({
    url: '/v2/facade/view',
    method: 'GET',
    params: params,
  })
}

/**
 *合作商管理 - 客户门店 - 零售分配
 * */
const contractorFacadeAllocate = (params) => {
  return fetch({
    url: '/v2/facade/allocate',
    method: 'PUT',
    data: params,
  })
}

/**
 *合作商管理 - 客户门店 - 收回
 * */
const contractorFacadeReturn = (params) => {
  return fetch({
    url: '/v2/facade/return',
    method: 'PUT',
    data: params,
  })
}

/**
 *合作商管理 - 合作商草稿 - 提交
 * */
// const contractorDraftSubmit = params => {
// 	return fetch({
// 		url: '/v1/contractor-draft/submit',
// 		method: 'POST',
// 		data: params,
// 	})
// }
// v2版本
const contractorDraftSubmit = (params) => {
  return fetch({
    url: '/v2/contractor-draft/submit',
    method: 'POST',
    data: params,
  })
}
/**
 *合作商管理 - 合作商草稿 - 删除
 * */
const contractorDraftDelete = (params) => {
  return fetch({
    url: '/v1/contractor-draft/delete',
    method: 'DELETE',
    params: params,
  })
}

/**
 *订单管理 - 订单草稿 - 列表
 * */
const orderDraftList = (params) => {
  return fetch({
    url: '/v1/order-draft',
    method: 'GET',
    params: params,
  })
}

/**
 *订单管理 - 订单草稿 - 添加
 * */
const orderDraftAdd = (params) => {
  return fetch({
    url: '/v1/order-draft',
    method: 'POST',
    data: params,
  })
}

/**
 *订单管理 - 订单草稿 - 修改
 * */
const orderDraftUpdate = (params) => {
  return fetch({
    url: `/v1/order-draft/${params.id}`,
    method: 'PATCH',
    data: params,
  })
}

/**
 *订单管理 - 订单草稿 - 删除
 * */
const orderDraftDelete = (params) => {
  return fetch({
    url: '/v1/order-draft/delete',
    method: 'DELETE',
    params: params,
  })
}

/**
 *订单管理 - 订单添加编辑 - 获取特定的满赠类目商品
 * */
const getDeatilProduct = (params) => {
  return fetch({
    url: '/v2/product/get-product',
    method: 'GET',
    params,
  })
}
/**
 *合作商管理 - 开发合作商 - 列表
 * */
const developerContractorList = (params) => {
  return fetch({
    url: '/v1/developer-contractor/index',
    method: 'GET',
    params: params,
  })
}

/**
 *合作商管理 - 开发合作商 - 导出
 * */
const developerContractorExport = (params) => {
  return fetch({
    url: '/v1/developer-contractor/contractor-export',
    method: 'POST',
    data: params,
  })
}

/**
 *合作商管理 - 开发合作商 - 详情
 * */
const developerContractorDetail = (params) => {
  return fetch({
    url: '/v1/developer-contractor/view',
    method: 'GET',
    params: params,
  })
}

/**
 *合作商管理 - 线索池 - 列表
 * */
const cuePoolList = (params) => {
  return fetch({
    url: '/v2/leads',
    method: 'GET',
    params: params,
  })
}

/**
 *合作商管理 - 线索池 - 详情
 * */
const cuePoolDeatil = (params) => {
  return fetch({
    url: '/v2/leads/view',
    method: 'GET',
    params: params,
  })
}

/**
 *合作商管理 - 线索池 - 获取公司工商信息
 * */
const cuePoolGetCompanyInfo = (params) => {
  return fetch({
    url: '/v2/company-info',
    method: 'GET',
    params: params,
  })
}

/**
 * 合作商管理 - 线索池 - 更新信息
 * */
const cuePoolUpdateCompanyInfo = (params) => {
  return fetch({
    url: '/v2/leads/update',
    method: 'PATCH',
    data: params,
  })
}

/**
 * 合作商管理 - 线索池 - 删除信息
 * */
const cuePoolDelCompanyInfo = (params) => {
  return fetch({
    url: '/v2/leads/delete',
    method: 'DELETE',
    params: params,
  })
}

/**
 * 合作商管理 - 线索池 - 拜访日志
 * */
const cuePoolLog = (params) => {
  return fetch({
    url: '/v2/contractor/log',
    method: 'GET',
    params: params,
  })
}

/**
 * 合作商管理 - 线索池 - 导出
 * */
const cuePoolExport = (params) => {
  return fetch({
    url: '/v2/leads/export',
    method: 'GET',
    params: params,
  })
}

/**
 * 合作商管理 - 潜在客户 - 列表
 * */
const potentialCustomerList = (params) => {
  return fetch({
    url: '/v2/potential-customer',
    method: 'GET',
    params: params,
  })
}

/**
 * 合作商管理 - 潜在客户 - 详情
 * */
const potentialCustomerDeatil = (params) => {
  return fetch({
    url: '/v2/potential-customer/view',
    method: 'GET',
    params: params,
  })
}

/**
 * 合作商管理 - 潜在客户 - 删除
 * */
const potentialCustomerDelete = (params) => {
  return fetch({
    url: '/v2/potential-customer/delete',
    method: 'DELETE',
    params: params,
  })
}

/**
 * 合作商管理 - 潜在客户 - 添加
 * */
const potentialCustomerCreate = (params) => {
  return fetch({
    url: '/v2/potential-customer/create',
    method: 'POST',
    data: params,
  })
}

/**
 * 合作商管理 - 潜在客户 - 编辑更新
 * */
const potentialCustomerUpdate = (params) => {
  return fetch({
    url: '/v2/potential-customer/update',
    method: 'PATCH',
    data: params,
  })
}

/**
 * 合作商管理 - 潜在客户 - 申请保护
 * */
const potentialCustomerProtect = (params) => {
  return fetch({
    url: '/v2/potential-customer/protect',
    method: 'PATCH',
    data: params,
  })
}

/**
 * 合作商管理 - 潜在客户 - 确认合作
 * */
const potentialCustomerCooperate = (params) => {
  return fetch({
    url: '/v2/potential-customer/cooperate',
    method: 'PUT',
    data: params,
  })
}

/**
 * 合作商管理 - 潜在客户 - 收回
 * */
const potentialCustomerWithdraw = (params) => {
  return fetch({
    url: '/v2/potential-customer/withdraw',
    method: 'PATCH',
    data: params,
  })
}

/**
 * 合作商管理 - 潜在客户 - 分配
 * */
const potentialCustomerAllocate = (params) => {
  return fetch({
    url: '/v2/potential-customer/allocate',
    method: 'PATCH',
    data: params,
  })
}

/**
 * 合作商管理 - 潜在客户 - 导出
 * */
const potentialCustomerExport = (params) => {
  return fetch({
    url: '/v2/potential-customer/export',
    method: 'GET',
    params: params,
  })
}

/**
 * 合作商管理 - 合作客户 - 列表
 * */
const cooperativeCustomerList = (params) => {
  return fetch({
    url: '/v2/partner',
    method: 'GET',
    params: params,
  })
}

/**
 * 合作商管理 - 合作客户 - 详情
 * */
const cooperativeCustomerDeatil = (params) => {
  return fetch({
    url: '/v2/partner/view',
    method: 'GET',
    params: params,
  })
}

/**
 * 合作商管理 - 合作客户 - 详情 - 拜访记录
 * */
 const cooperativeCustomerDeatilCheckinLog = (params) => {
  return fetch({
    url: '/v2/partner/checkin-log',
    method: 'GET',
    params: params,
  })
}

/**
 * 合作商管理 - 合作客户 - 查询上级客户
 * */
const cooperativeCustomerSearchPartner = (params) => {
  return fetch({
    url: '/v2/partner/search',
    method: 'GET',
    params: params,
  })
}

/**
 * 合作商管理 - 合作客户 - 删除
 * */
const cooperativeCustomerDelete = (params) => {
  return fetch({
    url: '/v2/partner/delete',
    method: 'DELETE',
    params: params,
  })
}

/**
 * 合作商管理 - 合作客户 - 添加
 * */
const cooperativeCustomerAdd = (params) => {
  return fetch({
    url: '/v2/partner/create',
    method: 'POST',
    data: params,
  })
}

/**
 * 合作商管理 - 合作客户 - 编辑
 * */
const cooperativeCustomerUpdate = (params) => {
  return fetch({
    url: '/v2/partner/update',
    method: 'PATCH',
    data: params,
  })
}

/**
 * 合作商管理 - 合作客户 - 商务分配
 * */
const cooperativeCustomerAssign = (params) => {
  return fetch({
    url: '/v2/partner/assign',
    method: 'PATCH',
    data: params,
  })
}

/**
 * 合作商管理 - 合作客户 - 审核
 * */
const cooperativeCustomerAudit = (params) => {
  return fetch({
    url: '/v2/partner/audit',
    method: 'POST',
    data: params,
  })
}

/**
 * 合作商管理 - 合作客户 - 收回
 * */
const cooperativeCustomerRevoke = (params) => {
  return fetch({
    url: '/v2/partner/revoke',
    method: 'PATCH',
    data: params,
  })
}

/**
 * 合作商管理 - 合作客户 - 合作设置
 * */
const cooperativeCustomerSetting = (params) => {
  return fetch({
    url: '/v2/partner/setting-cooperate',
    method: 'PATCH',
    data: params,
  })
}

/**
 * 合作商管理 - 合作客户 - 下级客户
 * */
const cooperativeCustomerChildCustomer = (params) => {
  return fetch({
    url: '/v2/partner/child-customer',
    method: 'GET',
    params: params,
  })
}

/**
 * 合作商管理 - 合作客户 - 客户编辑 - 联系人列表
 * */
const cooperativeContactsList = (params) => {
  return fetch({
    url: '/v2/contacts',
    method: 'GET',
    params: params,
  })
}

/**
 * 合作商管理 - 合作客户 - 客户编辑 - 添加联系人
 * */
const cooperativeContactsCreate = (params) => {
  return fetch({
    url: '/v2/contacts/create',
    method: 'POST',
    data: params,
  })
}

/**
 * 合作商管理 - 合作客户 - 客户编辑 - 编辑联系人
 * */
const cooperativeContactsUpdate = (params) => {
  return fetch({
    url: '/v2/contacts/update',
    method: 'PATCH',
    data: params,
  })
}

/**
 * 合作商管理 - 合作客户 - 客户编辑 - 删除联系人
 * */
const cooperativeContactsDelete = (params) => {
  return fetch({
    url: '/v2/contacts/delete',
    method: 'DELETE',
    params: params,
  })
}

/**
 * 合作商管理 - 联系人 - 导出
 * */
const contractorContactsExport = (params) => {
  return fetch({
    url: '/v2/contacts/export',
    method: 'GET',
    params: params,
  })
}


/**
 * 合作商管理 - 搜索系统信息
 * */
 const getSystemInfo = (params) => {
  return fetch({
    url: '/v2/facade/system-info',
    method: 'GET',
    params: params,
  })
}

/**
 * 合作商管理 - 获取合作商政策数据
 * */
const getPartnerPolicy = (params) => {
  return fetch({
    url: '/v2/contractor/get-partner-policy-array',
    method: 'GET',
    params: params,
  })
}

/**
 *合作商管理 - 开发合作商 - 确认合同 - 列出商家信息
 * */
const developerContractorConfirmDetail = (params) => {
  return fetch({
    url: '/v1/developer-contractor/confirm',
    method: 'GET',
    params: params,
  })
}

/**
 *合作商管理 - 开发合作商 - 确认合同 - 提交确认操作
 * */
const developerContractorConfirm = (params) => {
  return fetch({
    url: '/v1/developer-contractor/confirm',
    method: 'POST',
    data: params,
  })
}

/**
 *合作商管理 - 开发合作商 - 待确认合作的合作商详请信息
 * */
const developerContractorConfirmShow = (params) => {
  return fetch({
    url: '/v1/developer-contractor/contractor',
    method: 'GET',
    params: params,
  })
}

/**
 *销售单管理 - 列表
 * */
const salesReviewList = (params) => {
  return fetch({
    url: '/v1/sales-order-management/index',
    method: 'GET',
    params: params,
  })
}

/**
 *销售单管理 - 修改页面详情
 * */
const salesReviewDetail = (params) => {
  return fetch({
    url: '/v1/sales-order-management/view',
    method: 'GET',
    params: params,
  })
}

/**
 *销售单管理 - 新增
 * */
const salesReviewCreate = (params) => {
  return fetch({
    url: '/v1/sales-order-management/create',
    method: 'POST',
    data: params,
  })
}

/**
 *销售单管理 - 编辑
 * */
const salesReviewEdit = (params) => {
  return fetch({
    url: '/v1/sales-order-management/update',
    method: 'PATCH',
    data: params,
  })
}

/**
 *销售单管理 - 审核
 * */
const salesReviewAudit = (params) => {
  return fetch({
    url: '/v1/sales-order-management/audit',
    method: 'PATCH',
    data: params,
  })
}

/**
 *销售单管理 - 删除
 * */
const salesReviewDelete = (params) => {
  return fetch({
    url: '/v1/sales-order-management/delete',
    method: 'DELETE',
    params: params,
  })
}

/**
 *库存单管理 - 列表
 * */
const stockReviewList = (params) => {
  return fetch({
    url: '/v1/stock-order-management/index',
    method: 'GET',
    params: params,
  })
}

/**
 *库存单管理 - 修改页面详情
 * */
const stockReviewDetail = (params) => {
  return fetch({
    url: '/v1/stock-order-management/view',
    method: 'GET',
    params: params,
  })
}

/**
 *库存单管理 - 新增
 * */
const stockReviewCreate = (params) => {
  return fetch({
    url: '/v1/stock-order-management/create',
    method: 'POST',
    data: params,
  })
}

/**
 *库存单管理 - 编辑
 * */
const stockReviewEdit = (params) => {
  return fetch({
    url: '/v1/stock-order-management/update',
    method: 'PATCH',
    data: params,
  })
}

/**
 *库存单管理 - 审核
 * */
const stockReviewAudit = (params) => {
  return fetch({
    url: '/v1/stock-order-management/audit',
    method: 'PATCH',
    data: params,
  })
}

/**
 *库存单管理 - 删除
 * */
const stockReviewDelete = (params) => {
  return fetch({
    url: '/v1/stock-order-management/delete',
    method: 'DELETE',
    params: params,
  })
}

/**
 *销售单管理、销售单管理 - 门店查询
 * */
const facadeQuery = (params) => {
  return fetch({
    url: '/v1/order/query-facade',
    method: 'GET',
    params: params,
  })
}
/**
 *合作商列表详情 - 详情订单信息
 * */
const getContractDetailOrder = (params) => {
  return fetch({
    url: '/v1/contractor-detail/view',
    method: 'GET',
    params: params,
  })
}
const getContractoreDetail = (params) => {
  return fetch({
    url: `/v1/contractor-management/${params.id}`,
    method: 'GET',
  })
}
/**
 *合作商列表详情 - 详情信息
 * */
const getContractoreTable = (params) => {
  return fetch({
    url: '/v1/contractor-detail',
    method: 'GET',
    params: params,
  })
}

/**
 * 商品设置-导入下载商品
 * */
const productTemplate = (params) => {
  return fetch({
    url: '/v1/product/product-template',
    method: 'POST',
    data: params,
  })
}

/**
 * 商品设置-详情设置
 * */
const productDetailSetting = (params) => {
  return fetch({
    url: '/v1/product/detail-setting',
    method: 'POST',
    data: params,
  })
}

/**
 * 商品设置-添加、编辑 货号唯一性判断
 * */
const productEditItemNum = (params) => {
  return fetch({
    url: '/v1/product/verify-item-number',
    method: 'GET',
    params,
  })
}
/**
 * 商品设置-选择导入文件
 * */
const productImport = (params) => {
  return fetch({
    url: '/v1/product/product-import',
    method: 'POST',
    data: params,
  })
}

/**
 * 商品设置-选择导出
 * */
const productExport = (params) => {
  return fetch({
    url: '/v1/product/product-export',
    method: 'POST',
    data: params,
  })
}

/**
 * 商品设置-产品图片预览
 * */
const productPreview = (params) => {
  return fetch({
    url: '/v1/product/preview',
    method: 'POST',
    data: params,
  })
}

/**
 * 商品设置-商家活动列表
 * */
const merchantActivityListLndex = (params) => {
  return fetch({
    url: '/v1/merchant-activity-list/index',
    method: 'GET',
    params: params,
  })
}

/**
 * 商品设置-商家活动预览
 * */
const merchantActivityListPreview = (params) => {
  return fetch({
    url: '/v1/merchant-activity-list/preview',
    method: 'GET',
    params: params,
  })
}

/**
 * 商品设置-显示
 * */
const merchantActivityListShow = (params) => {
  return fetch({
    url: '/v1/merchant-activity-list/show',
    method: 'PATCH',
    data: params,
  })
}

/**
 * 商品设置-隐藏
 * */
const merchantActivityListNotShow = (params) => {
  return fetch({
    url: '/v1/merchant-activity-list/not-show',
    method: 'PATCH',
    data: params,
  })
}

/**
 * 商品设置-删除
 * */
const merchantActivityListDel = (id) => {
  return fetch({
    url: `/v1/merchant-activity-list/${id}`,
    method: 'DELETE',
    data: id,
  })
}

/**
 * 商品设置-新增海报
 * */
const merchantActivityListCreate = (params) => {
  return fetch({
    url: '/v1/merchant-activity-list/create',
    method: 'POST',
    data: params,
  })
}

/**
 * 商品设置-编辑
 * */
const merchantActivityListUpdate = (params) => {
  return fetch({
    url: '/v1/merchant-activity-list/update',
    method: 'PATCH',
    data: params,
  })
}

/**
 * 商品设置-编辑
 * */
const merchantActivityListView = (params) => {
  return fetch({
    url: '/v1/merchant-activity-list/view',
    method: 'GET',
    params: params,
  })
}

/**
 * WIS-资讯列表-列表
 * */
const informationListLndex = (params) => {
  return fetch({
    url: '/v1/information-list/index',
    method: 'GET',
    params: params,
  })
}

/**
 * WIS-资讯列表-预览
 * */
const informationListPreviewS = (params) => {
  return fetch({
    url: '/v1/information-list/preview',
    method: 'GET',
    params: params,
  })
}

/**
 * WIS-资讯列表-详情
 * */
const informationListView = (params) => {
  return fetch({
    url: '/v1/information-list/view',
    method: 'GET',
    params: params,
  })
}

/**
 * WIS-资讯列表-预览
 * */
const informationListPreview = (params) => {
  return fetch({
    url: '/v1/information-listt/preview7',
    method: 'GET',
    params: params,
  })
}

/**
 * WIS-资讯列表-添加
 * */
const informationListCreate = (params) => {
  return fetch({
    url: '/v1/information-list/create',
    method: 'POST',
    data: params,
  })
}

/**
 * WIS-资讯列表-编辑
 * */
const informationListUpdate = (params) => {
  return fetch({
    url: '/v1/information-list/update',
    method: 'PATCH',
    data: params,
  })
}

/**
 * WIS-资讯列表-显示
 * */
const informationListShow = (params) => {
  return fetch({
    url: '/v1/information-list/show',
    method: 'PATCH',
    data: params,
  })
}

/**
 * WIS-资讯列表-隐藏
 * */
const informationListNotShow = (params) => {
  return fetch({
    url: '/v1/information-list/not-show',
    method: 'PATCH',
    data: params,
  })
}

/**
 * WIS-资讯列表-删除
 * */
const informationListDele = (id) => {
  return fetch({
    url: `/v1/information-list/${id}`,
    method: 'DELETE',
  })
}

/**
 * 通知管理-钉钉通知-列表
 * */
const nailingListShow = (params) => {
  return fetch({
    url: '/v1/manage-notice-ding/index',
    method: 'GET',
    params: params,
  })
}

/**
 *通知管理-钉钉通知-添加通知
 * */
const nailingListAdd = (params) => {
  return fetch({
    url: '/v1/manage-notice-ding/create',
    method: 'POST',
    data: params,
  })
}

/**
 * 通知管理-钉钉通知-通知更新
 * */
const nailingListUpdate = ({ params, uuid }) => {
  return fetch({
    url: `/v1/manage-notice-ding/update?uuid=${uuid}`,
    method: 'PATCH',
    data: params,
  })
}

/**
 *通知管理-钉钉通知-删除通知
 * */
const nailingListDel = (params) => {
  return fetch({
    url: '/v1/manage-notice-ding/delete',
    method: 'DELETE',
    params: params,
  })
}

// 员工档案 - 导入目标
const importEmployeeTarget = (params) => {
  return fetch({
    url: `/v1/employee/import-target`,
    method: 'POST',
    data: params,
  })
}

// 员工档案 - 目标导入模板 ( 下载 )
const downloadEmployeeTargetTmpl = () => {
  return fetch({
    url: `/v1/employee/export-target-temp`,
    method: 'GET',
  })
}

export default {
  user,
  login,
  getCaptcha,
  getOwnership,
  getMenu,
  getPermission,
  getLog,
  queryRemittanceName,
  queryImportMode,
  informationRead,
  orderReviewList,
  orderReviewDetails,
  orderReviewCreate,
  orderReviewEdit,
  orderReviewDelete,
  orderReviewManagerAudit,
  orderReviewDirectorAudit,
  sampleOrderReviewManagerAudit,
  sampleOrderReviewDirectorAudit,
  replacementOrderReviewManagerAudit,
  orderReviewQueryContractor,
  orderReviewQueryProduct,
  orderRefundList,
  orderRefundAdd,
  orderRefundDetails,
  orderRefundDelete,
  orderRefundAudit,
  orderRefundAuditSec,
  orderRefundExport,
  orderServiceList,
  orderServiceAdd,
  orderServiceDetails,
  orderServiceDelete,
  orderServiceAudit,
  orderServiceClose,
  warehouseList,
  warehouseDeal,
  getwareData,
  getwareaudit,
  warehousePrint,
  accountSearch,
  downtemp,
  inupdata,
  alertData,
  wareAdd,
  wareptSearch,
  contractorCreate,
  urbanCascade,
  getPartnerPolicyArray,
  contractorList,
  contractorDetail,
  editContractorDetail,
  contractorAudit,
  contractorDelete,
  contractPolicy,
  accountManagementList,
  accountManagementUnbind,
  accountManagementDetails,
  accountManagementTabAudit,
  salesmanData,
  contractorExport,
  contractorImport,
  contractorUpdate,
  orderReviewQueryProductDiscount,
  orderReviewGetDiscountLimit,
  categoryManagementList,
  categoryManagementCreate,
  categoryManagementDetail,
  categoryManagementEdit,
  productManagementList,
  productManagementCreate,
  productManagementEdit,
  productManagementDetails,
  productManagementDownload,
  productManagementUpload,
  productManagementDelete,
  informationModular,
  contractPoliceList,
  contractPoliceListv2, // 列表v2
  addContractPolice,
  addContractPolicev2, // 添加v2
  getCategoryData,
  getCategoryList, //v2
  getProductList, //v2
  getProductCategoryList, //v2
  getRegularProductList, //v2
  addRegularProductList, //v2
  editRegularProductList, //v2
  nodelRegularProductList, //v2
  delRegularProductList, //v2
  getProductData,
  getContractPoliceDetail,
  getContractPoliceDetailv2, //合同政策管理 - 详情
  auditContractPolice,
  auditContractPolicev2, // 合同政策管理 - 审核
  contractPoliceDelete,
  contractPoliceDeletev2, // 合同政策 删除
  contractPoliceEdit,
  contractPoliceEditv2,
  contractPoliceEnable,
  policyPartnerList,
  policyPartnerCreate,
  policyPartnerEdit,
  queryContractPolicy,
  getPolicyPartnerDetails,
  policyPartnerDelete,
  receiptCashList,
  receiptCashDetail,
  receiptCashReceipt,
  receiptCashReceiptView,
  loginMessage,
  receiptMonthly,
  receiptMonthlyDetail,
  receiptMonthlyReceipt,
  receiptMonthlyDouble,
  realSales,
  realSalesDetail,
  realSalesReceipt,
  realSalesDouble,
  orderDeliverList,
  orderDeliverDetail,
  orderDeliverHandle,
  orderExport,
  downlodaOrder,
  NotificationOfDelivery,
  deliverSetDetail,
  submitSet,
  orderDeliveryExport,
  orderCancellationList,
  orderCancellation,
  employeeFilesList,
  employeeFilesUpdate,
  employeeFilesDisable,
  employeeFilesDetail,
  employeeFilesDelete,
  employeeFilesGetJob,
  employeeFilesGetDept,
  attendanceList,
  attendanceDetail,
  attendanceSurveyList,
  attendanceExport,
  guideList,
  getDerive,
  guideDeit,
  developerContractorList,
  getDeatilProduct,
  developerContractorExport,
  developerContractorDetail,
  developerContractorConfirmDetail,
  developerContractorConfirm,
  developerContractorConfirmShow,
  policyDraftList,
  policyDraftListv2,
  policyDraftAdd,
  policyDraftAddv2, // 合同政策草稿 - 添加v2
  policyDraftUpdate,
  policyDraftUpdatev2, // 合同政策草稿 - 修改v2
  policyDraftSubmit,
  policyDraftDelete,
  policyDraftDeletev2,
  contractorDraftList,
  contractorDraftAdd,
  contractorDraftUpdate,
  contractorDraftSubmit,
  contractorAddAddress,
  contractorEditAddress,
  contractorPushAddress,
  contractorDelAddress,
  contractorTabAddress,
  contractorAddShopInfo,
  contractorEditShopInfo,
  contractorPushShopInfo,
  contractorDelShopInfo,
  contractorTabShopInfo,
  contractorDraftDelete,
  contractorTemplateShop,
  contractorTemplateAddress,
  orderDraftList,
  orderDraftAdd,
  orderDraftUpdate,
  orderDraftDelete,
  salesReviewList,
  salesReviewDetail,
  salesReviewCreate,
  salesReviewEdit,
  salesReviewAudit,
  salesReviewDelete,
  facadeQuery,
  stockReviewList,
  stockReviewDetail,
  stockReviewCreate,
  stockReviewEdit,
  stockReviewAudit,
  stockReviewDelete,
  getContractoreDetail,
  getContractoreTable,
  employeePreview,
  rankingList,
  beoffline,
  videoParticulars,
  contractorApplyList,
  contractorApplyApply,
  contractorApplyDel,
  contractorApplyAccept,
  contractorApplyProcess,
  getContractDetailOrder,
  appletHomeSettingIndex,
  appletHomeSettingPreview,
  appletHomeSettingSetting,
  appletHomeSettingUpdate,
  appletHomeSettingCreate,
  appletHomeSettingUse,
  appletHomeSettingView,
  appletHomeSettingNotUse,
  categoryManagementShow,
  categoryManagementNotShow,
  productShow,
  productNotShow,
  productShortage,
  productNotShortage,
  productTemplate,
  productImport,
  productExport,
  productPreview,
  merchantActivityListLndex,
  merchantActivityListShow,
  merchantActivityListNotShow,
  merchantActivityListDel,
  merchantActivityListCreate,
  merchantActivityListUpdate,
  merchantActivityListView,
  informationListLndex,
  informationListView,
  informationListPreview,
  informationListCreate,
  informationListUpdate,
  informationListShow,
  informationListNotShow,
  informationListDele,
  productDetailSetting,
  productEditItemNum,
  merchantActivityListPreview,
  informationListPreviewS,
  nailingListShow,
  nailingListAdd,
  nailingListUpdate,
  nailingListDel,
  storeList,
  delStore,
  auditStore,
  storeCheck,
  importEmployeeTarget,
  downloadEmployeeTargetTmpl,
  cuePoolList, // v2
  cuePoolDeatil, // v2
  cuePoolGetCompanyInfo, // v2
  cuePoolUpdateCompanyInfo, // v2
  cuePoolDelCompanyInfo, // v2
  cuePoolLog, // v2
  cuePoolExport, // v2
  potentialCustomerList, // v2
  potentialCustomerCreate, // v2
  potentialCustomerUpdate, // v2
  potentialCustomerDeatil, // v2
  potentialCustomerDelete, // v2
  potentialCustomerProtect, // v2
  potentialCustomerCooperate, // v2
  potentialCustomerWithdraw, // v2
  potentialCustomerAllocate, // v2
  cooperativeCustomerList, // v2
  cooperativeCustomerDeatil, // v2
  cooperativeCustomerSearchPartner, // v2
  cooperativeCustomerChildCustomer, // v2
  cooperativeCustomerAdd, // v2
  cooperativeCustomerDelete, // v2
  cooperativeCustomerUpdate, // v2
  cooperativeCustomerAssign, // v2
  cooperativeCustomerAudit, // v2
  cooperativeCustomerRevoke, // v2
  cooperativeCustomerSetting, // v2
  cooperativeContactsCreate, // v2
  cooperativeContactsList, // v2
  cooperativeContactsUpdate, // v2
  cooperativeContactsDelete, // v2
  getPartnerPolicy, // v2
  contractorFacadeDetail, // v2
  contractorFacadeAllocate, // v2
  contractorFacadeReturn, // v2
  contractorContactsExport, // v2
  contractorOperationLog, // v2
  potentialCustomerExport, // v2
  getOrganizationDeptTree, // v2
  getOrganizationEmployeeList, // v2
  getOrganizationDeptDetail, // v2
  createOrganizationDept, // v2
  updateOrganizationDept, // v2
  deleteOrganizationDept, // v2
  addOrganizationEmployee, // v2
  updateOrganizationEmployee, // v2
  getEmployeeFilesList, // v2
  getEmployeeFilesDetail, // v2
  updateEmployeeFilesUpdate, // v2
  setEmployeeFilesStatus, // v2
  deletEemployeeFile, // v2
  getSystemInfo, //v2
  cooperativeCustomerDeatilCheckinLog, //v2
  queryOrderContractPolicy, // v2
}
