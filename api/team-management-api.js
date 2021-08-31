import fetch from './fetch'

/** 团队管理 */

// 首页
const getTeamManagementList = (params) => {
  return fetch({
    url: '/v1/manage-team/index',
    method: 'GET',
    params
  })
}

// 启用禁用
const setTeamManagementStatus = (data) => {
  return fetch({
    url: '/v1/manage-team/set',
    method: 'PATCH',
    data
  })
}

// 详情
const getTeamManagementDetail = (params) => {
  return fetch({
    url: `/v1/manage-team/view`,
    method: 'GET',
    params
  })
}

// 删除
const delTeamManagement = (params) => {
  return fetch({
    url: `/v1/manage-team/delete`,
    method: 'DELETE',
    params
  })
}

// 添加
const addTeamManagement = (data) => {
  return fetch({
    url: `/v1/manage-team/create`,
    method: 'POST',
    data
  })
}

// 修改
const editTeamManagement = (data) => {
  return fetch({
    url: `/v1/manage-team/update`,
    method: 'PATCH',
    data
  })
}

// 通过渠道获取团队大队
const getTeamBYChannel = (params) => {
  return fetch({
    url: `/v1/manage-team/channel-team`,
    method: 'GET',
    params
  })
}

// 小队获取
const getUnitTeam = (params) => {
  return fetch({
    url: `/v1/manage-team/element-pid`,
    method: 'GET',
    params
  })
}

// 任命分配 - 创建
const assignStaffRole = (data) => {
  return fetch({
    url: `/v1/manage-team-staff/create`,
    method: 'POST',
    data
  })
}

// 任命分配 - 成员表详情
const getStaffTeamDetail = (params) => {
  return fetch({
    url: `/v1/manage-team-staff/view`,
    method: 'GET',
    params
  })
}


export default {
  getTeamManagementList,
  setTeamManagementStatus,
  getTeamManagementDetail,
  delTeamManagement,
  addTeamManagement,
  editTeamManagement,
  getTeamBYChannel,
  getUnitTeam,
  assignStaffRole,
  getStaffTeamDetail
}
