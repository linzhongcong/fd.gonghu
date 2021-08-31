import fetch from './fetch'

/**
 *订单发货管理-订单发货-列表
 * */
const orderDeliveryList = (params) => {
  return fetch({
    url: '/v1/order-delivery',
    method: 'GET',
    params: params
  })
}

// 订单发货管理-详情
const orderDeliveryDetails = (id) => {
  return fetch({
    url: `/v1/order-delivery/${id}`,
    method: 'GET'
  })
}
// 订单发货管理-物流查询
const orderDeliveryQuery = (params) => {
  return fetch({
    url: '/v1/order-delivery/get-delivery',
    method: 'GET',
    params
  })
}
/**
 *订单发货管理-补发订单发货-列表
 * */
const reissueDeliveryList = (params) => {
  return fetch({
    url: '/v1/order-reissue-delivery',
    method: 'GET',
    params: params
  })
}

/**
 *订单发货管理-样品订单发货-列表
 * */
const sampleDeliveryList = (params) => {
  return fetch({
    url: '/v1/order-sample-delivery',
    method: 'GET',
    params: params
  })
}

/**
 *订单发货管理 - 订单发货 - 拆单提交
 * */
const separateOrder = (data) => {
  return fetch({
    url: '/v1/order-delivery/separate-order',
    method: 'POST',
    data
  })
}

/**
 *订单发货管理 - 订单发货 - 拆单审核
 * */
const separateOrderAudit = (data) => {
  console.log(data)
  return fetch({
    url: '/v1/order-delivery/separate-order-audit',
    method: 'POST',
    data
  })
}

/**
 *订单发货管理 - 补发订单发货 - 拆单提交/修改
 * */
const reissueSeparateOrder = (data) => {
  return fetch({
    url: '/v1/order-reissue-delivery/separate-order',
    method: 'POST',
    data
  })
}

/**
 *订单发货管理 - 补发订单发货 - 详情
 * */
const reissueDeliveryView = (params) => {
  return fetch({
    url: `/v1/order-reissue-delivery/view`,
    method: 'GET',
    params
  })
}

/**
 *订单发货管理 - 补发订单发货 - 审核
 * */
const reissueSeparateOrderAudit = (data) => {
  return fetch({
    url: '/v1/order-reissue-delivery/separate-order-audit',
    method: 'POST',
    data
  })
}


/**
 *订单发货管理 - 样品订单发货 - 详情
 * */
const orderSampleDeliveryDetail = (params) => {
  return fetch({
    url: `/v1/order-sample-delivery/${params.id}`,
    method: 'GET',
    params
  })
}


/**
 *订单发货管理 - 样品订单发货 - 拆单提交/修改
 * */
const sampleSeparateOrder = (data) => {
  return fetch({
    url: '/v1/order-sample-delivery/separate-order',
    method: 'POST',
    data
  })
}

/**
 *订单发货管理 - 样品订单发货 - 拆单审核
 * */
const sampleSeparateOrderAudit = (data) => {
  return fetch({
    url: '/v1/order-sample-delivery/separate-order-audit',
    method: 'POST',
    data
  })
}


/**
 * 外仓发货调货
 * **/
// 外仓发货调货详情
const warehouseDeliverDetails = (params) => {
  return fetch({
    url: '/v1/out-source-deliver-goods/view',
    method: 'GET',
    params: params
  })
}
// 外仓调货发货列表
const warehouseDeliverlist = (params) => {
  return fetch({
    url: '/v1/out-source-deliver-goods',
    method: 'GET',
    params: params
  })
}
// 获取发货信息
const shippingInformation = (params) => {
  return fetch({
    url: '/v1/out-source-deliver-goods/deliver-info',
    params: params
  })

}
// 导单处理
const importProcessing = (params) => {
  return fetch({
    url: '/v1/out-source-deliver-goods/delivery-dealing',
    method: 'POST',
    data: params
  })
}
// 发货设置
const shipmentSettings = (params) => {
  return fetch({
    url: '/v1/out-source-deliver-goods/deliver-setting',
    method: 'POST',
    data: params
  })
}
// 通知发货
const notificationShipment = (params) => {
  return fetch({
    url: '/v1/out-source-deliver-goods/notice',
    method: 'POST',
    data: params
  })
}
// 订单导出
const orderExportx = (params) => {
  return fetch({
    url: '/v1/out-source-deliver-goods/delivery-export',
    method: 'GET',
    params: params
  })
}

//补发货订单详情
const deliveryView = (params) => {
  return fetch({
    url: '/v1/order-reissue-delivery/view',
    method: 'GET',
    params: params
  })
}

const  deliveryDeliver = (params) => {
  return fetch({
    url: '/v1/out-source-deliver-goods/deliver-info',
    method: 'GET',
    params: params
  })
}

const deliveryDealing = (params) => {
  return fetch({
      url: 'http://yapi.tfgg5.com/mock/11/v1/out-source-deliver-goods/delivery-dealing',
      method: 'POST',
      params
  })
}


export default {
  orderDeliveryList,
  orderDeliveryDetails,
  orderDeliveryQuery,
  reissueDeliveryList,
  sampleDeliveryList,
  separateOrder,
  separateOrderAudit,
  reissueSeparateOrder,
  reissueDeliveryView,
  reissueSeparateOrderAudit,
  orderSampleDeliveryDetail,
  sampleSeparateOrder,
  sampleSeparateOrderAudit,
  orderExportx,
  deliveryView,
  deliveryDeliver,
  notificationShipment,
  shipmentSettings,
  importProcessing,
  shippingInformation,
  warehouseDeliverlist,
  warehouseDeliverDetails,
  deliveryDealing
}
