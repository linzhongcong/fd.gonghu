/**
 * 票务审核人管理接口API
 */

import fetch from './fetch'

// 列表
const getTicketReviewerList = (params) => {
  return fetch({
    url: '/v2/ticket-reviewer',
    method: 'GET',
    params,
  })
}

// 添加
const createTicketReviewer = (data) => {
  return fetch({
    url: '/v2/ticket-reviewer/create',
    method: 'POST',
    data,
  })
}

// 编辑
const updateTicketReviewer = (data) => {
  return fetch({
    url: '/v2/ticket-reviewer/update',
    method: 'PATCH',
    data,
  })
}

// 删除
const deleteTicketReviewer = (params) => {
  return fetch({
    url: '/v2/ticket-reviewer/delete',
    method: 'DELETE',
    params,
  })
}

export default {
  getTicketReviewerList,
  createTicketReviewer,
  updateTicketReviewer,
  deleteTicketReviewer,
}
