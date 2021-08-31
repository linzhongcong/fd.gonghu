import fetch from './fetch'

/** 员工档案详情优化 */

// 头像预览
const getAvatarUrl = (params) => {
  return fetch({
    url: '/v1/employee/preview',
    method: 'GET',
    params
  })
}

// 个人签到记录 信息
const getCheckInInfo = (params) => {
  return fetch({
    url: '/v1/employee-sign/statistics',
    method: 'GET',
    params
  })
}

// 个人签到记录 列表
const getCheckInList = (params) => {
  return fetch({
    url: '/v1/employee-sign',
    method: 'GET',
    params
  })
}

// 个人门店开扩统计 信息
const getStoreInfo = (params) => {
  return fetch({
    url: '/v1/employee-store-expansion/statistics',
    method: 'GET',
    params
  })
}

// 个人门店开扩统计 列表
const getStoreList = (params) => {
  return fetch({
    url: '/v1/employee-store-expansion',
    method: 'GET',
    params
  })
}

// 个人门店开扩统计 信息
const getHotelList = (params) => {
  return fetch({
    url: '/v1/employee-hotel',
    method: 'GET',
    params
  })
}

// 车票 列表
const getTrafficList = (params) => {
  return fetch({
    url: '/v1/employee-traffic',
    method: 'GET',
    params
  })
}

// 酒店 详情 酒店列表id
const getHotelDetail = (params) => {
  return fetch({
    url: '/v1/employee-hotel/view',
    method: 'GET',
    params
  })
}

// 车票 详情 车票信息id
const getTrafficDetail = (params) => {
  return fetch({
    url: '/v1/employee-traffic/view',
    method: 'GET',
    params
  })
}

// 车票 导出
const exportTrafficList = (params) => {
  return fetch({
    url: '/v1/employee-traffic/export',
    method: 'GET',
    params
  })
}

// 酒店 导出
const exportHotelList = (params) => {
  return fetch({
    url: '/v1/employee-hotel/export',
    method: 'GET',
    params
  })
}

// 列表主页 导出
const exportEmployeelList = (params) => {
  return fetch({
    url: '/v1/employee/export',
    method: 'GET',
    params
  })
}

// 列表主页 导出
const exportEmployeelFile = (params) => {
  return fetch({
    url: '/v2/employee/export',
    method: 'GET',
    params
  })
}


export default {
  getAvatarUrl,
  getCheckInInfo,
  getCheckInList,
  getStoreInfo,
  getStoreList,
  getHotelList,
  getTrafficList,
  getHotelDetail,
  getTrafficDetail,
  exportTrafficList,
  exportHotelList,
  exportEmployeelList,
  exportEmployeelFile
}
