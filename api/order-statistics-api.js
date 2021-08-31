import fetch from './fetch'

/**
 *订单管理-订单统计
 * */

// 订单统计列表
const getOrderStatisticsList = (params) => {
  return fetch({
    url: '/v1/order-received/index',
    method: 'GET',
    params
  })
}

// 订单统计列表-导出
const exportOrderStatisticsList = (params) => {
  return fetch({
    url: '/v1/order-received/order-received-export',
    method: 'GET',
    params
  })
}

// 订单统计分析-订单趋势
const getOrderTrend = (params) => {
  return fetch({
    url: '/v1/order-received/order-trend',
    method: 'GET',
    params
  })
}

// 订单统计分析-渠道分析
const getChannelAnalyze = (params) => {
  return fetch({
    url: '/v1/order-received/channel-analyze',
    method: 'GET',
    params
  })
}

// 订单统计分析-门店分析
const getsStoreAnalyze = (params) => {
  return fetch({
    url: '/v1/order-received/store-analyze',
    method: 'GET',
    params
  })
}

// 订单统计分析- 产品分析
const getProductAnalyze = (params) => {
  return fetch({
    url: '/v1/order-received/product-analyze',
    method: 'GET',
    params
  })
}



export default {
  getOrderStatisticsList,
  exportOrderStatisticsList,
  getOrderTrend,
  getChannelAnalyze,
  getsStoreAnalyze,
  getProductAnalyze
}