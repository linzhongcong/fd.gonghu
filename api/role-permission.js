import fetch from './fetch'

// 系统设置 - 角色管理 - 获取角色列表
const getRoleList = (params) => {
  return fetch({
    url: '/v2/auth/role-list',
    method: 'GET',
    params: params
  })
}

// 系统设置 - 角色管理 - 创建角色
const createRole = (params) => {
  return fetch({
    url: '/v2/auth/create-role',
    method: 'POST',
    data: params
  })
}

// 系统设置 - 角色管理 - 设置角色
const updateRole = (params) => {
  return fetch({
    url: '/v2/auth/update-role',
    method: 'PUT',
    data: params
  })
}

// 系统设置 - 角色管理 - 删除角色
const deleteRole = (params) => {
  return fetch({
    url: '/v2/auth/delete-role',
    method: 'DELETE',
    params: params
  })
}

// 系统设置 - 角色管理 - 获取员工列表
const getRoleEmployeeList = (params) => {
  return fetch({
    url: '/v2/auth/employee-list',
    method: 'GET',
    params: params
  })
}

// 系统设置 - 角色管理 - 关联员工
const connectRoleEmployee = (params) => {
  return fetch({
    url: '/v2/auth/associate-employee',
    method: 'PATCH',
    data: params
  })
}

// 系统设置 - 角色管理 - 删除关联员工
const deleteConnectRoleEmployee = (params) => {
  return fetch({
    url: '/v2/auth/remove-associate',
    method: 'PATCH',
    data: params
  })
}

// 系统设置 - 角色管理 - 获取权限数据
const getRolePermissionInfo = (params) => {
  return fetch({
    url: '/v2/auth/role-auth-info',
    method: 'GET',
    params: params
  })
}

// 系统设置 - 角色管理 - 保存权限数据
const saveRolePermissionInfo = (params) => {
  return fetch({
    url: '/v2/auth/authorization',
    method: 'POST',
    data: params
  })
}

// 系统设置 - 权限管理 - 获取权限菜单
const getPermissionMenu = (params) => {
  return fetch({
    url: '/v2/auth/search-menu',
    method: 'GET',
    params: params
  })
}

// 系统设置 - 权限管理 - 获取关联路由
const getPermissionConnectRoute = (params) => {
  return fetch({
    url: '/v2/auth/search-route',
    method: 'GET',
    params: params
  })
}

// 系统设置 - 权限管理 - 获取关联路由
const getPermissionConnectRule = (params) => {
  return fetch({
    url: '/v2/auth/search-rule',
    method: 'GET',
    params: params
  })
}

// 系统设置 - 权限管理 - 权限列表
const getPermissionList = (params) => {
  return fetch({
    url: '/v2/auth/permission-list',
    method: 'GET',
    params: params
  })
}

// 系统设置 - 权限管理 - 新建权限
const createPermission = (params) => {
  return fetch({
    url: '/v2/auth/create-permission',
    method: 'POST',
    data: params
  })
}

// 系统设置 - 权限管理 - 编辑权限
const updatePermission = (params) => {
  return fetch({
    url: '/v2/auth/update-permission',
    method: 'PUT',
    data: params
  })
}

// 系统设置 - 权限管理 - 删除权限
const deletePermission = (params) => {
  return fetch({
    url: '/v2/auth/delete-permission',
    method: 'DELETE',
    params: params
  })
}

export default {
  getRoleList,
  createRole,
  updateRole,
  deleteRole,
  getRoleEmployeeList,
  connectRoleEmployee,
  deleteConnectRoleEmployee,
  getPermissionMenu,
  getPermissionConnectRoute,
  getPermissionConnectRule,
  getPermissionList,
  createPermission,
  updatePermission,
  deletePermission,
  getRolePermissionInfo,
  saveRolePermissionInfo
}