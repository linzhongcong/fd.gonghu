import fetch from './fetch'

// 客户档案 - 列表
const contractorProfileList = (params) => {
  return fetch({
    url: '/v1/customer-profile',
    method: 'GET',
    params
  })
}

// 客户档案 - 启用（作废）
const customerEnable = (params) => {
  return fetch({
    url: '/v1/customer-profile/enable',
    method: 'POST',
    data: params
  })
}

// 客户档案 - 分配
const customerAssign = (params) => {
  return fetch({
    url: '/v1/customer-profile/assign',
    method: 'POST',
    data: params
  })
}

// 客户档案 - 修改
const customerEdit = (params, id) => {
  return fetch({
    url: `/v1/customer-profile/${id}`,
    method: 'PATCH',
    data: params
  })
}

// 客户档案 - 模板下载
const customerExportDownload = () => {
  return fetch({
    url: '/v1/customer-profile/customer-profile-export',
    method: 'POST',
  })
}

const basicInfo = (id) => {
  return fetch({
    url: `/v1/customer-profile/${id}`,
    method: 'GET'
  })
}

/**
 * 合作商列表 - 迁移
 */
 const contractorMigration = (id) => {
  return fetch({
    url: `/v2/contractor/migration?id=${id}`,
    method: 'PATCH',
  })
}



export default {
  // 客户档案
  contractorProfileList,
  customerEnable,
  customerAssign,
  customerEdit,
  customerExportDownload,
  basicInfo,
  contractorMigration,
}