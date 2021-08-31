import fetch from './fetch'

/**
 *补发管理-补发订单审核-订单列表
 * */
const reissueList = (params) => {
  return fetch({
    url: '/v1/order-reissue',
    method: 'GET',
    params: params
  })
}

/**
 *补发管理-补发订单审核-添加订单
 * */
const reissueAdd = (params) => {
  return fetch({
    url: '/v1/order-reissue',
    method: 'POST',
    data: params
  })
}

/**
 *补发管理-补发订单审核-订单详情
 * */
const reissueDetail = (id) => {
  return fetch({
    url: `/v1/order-reissue/${id}`,
    method: 'GET'
  })
}

/**
 *补发管理-补发订单审核-修改订单
 * */
const reissueEdit = (params) => {
  return fetch({
    url: `/v1/order-reissue/${params.id}`,
    method: 'PATCH',
    data: params
  })
}

/**
 *补发管理-补发订单审核-发货单导出
 * */
const reissueDeliveryExport = (params) => {
  return fetch({
    url: '/v1/order-reissue/order-delivery-export',
    method: 'GET',
    params: params
  })
}

/**
 *补发管理-补发/样品作废订单列表 - 列表
 * */
const reissueInvalidList = (params) => {
  return fetch({
    url: '/v1/order-reissue-invalid',
    method: 'GET',
    params: params
  })
}

/**
 *补发管理 - 样品订单 - 列表
 * */
const sampleList = (params) => {
  return fetch({
    url: '/v1/order-sample',
    method: 'GET',
    params: params
  })
}

/**
 *补发管理 - 样品订单 - 添加
 * */
const sampleCreate = (params) => {
  return fetch({
    url: '/v1/order-sample',
    method: 'POST',
    data: params
  })
}

/**
 *补发订单 - 样品订单 - 修改
 * */
const sampleUpdate = (params) => {
  return fetch({
    url: `/v1/order-sample/${params.id}`,
    method: 'PATCH',
    data: params
  })
}

/**
 *补发管理 - 样品订单 - 详情
 * */
const sampleDetail = (id) => {
  return fetch({
    url: `/v1/order-sample/${id}`,
    method: 'GET'
  })
}

/**
 *补发管理 - 样品订单 - 出货单导出
 * */
const sampleDeliveryExport = (params) => {
  return fetch({
    url: '/v1/order-sample/order-delivery-export',
    method: 'GET',
    params: params
  })
}


export default {
  reissueList,
  reissueAdd,
  reissueDetail,
  reissueEdit,
  reissueDeliveryExport,
  reissueInvalidList,
  sampleList,
  sampleCreate,
  sampleUpdate,
  sampleDetail,
  sampleDeliveryExport,
}
