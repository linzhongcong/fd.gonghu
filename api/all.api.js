import commonAPI from './common.api'
import reissueManagementApi from './reissue-management-api'
import orderDeliverManagement from './order-deliver-management-api'
import teamManagementApi from './team-management-api'
import orderStatisticsApi from './order-statistics-api'
import newEmployeeDetailApi from './newemployee-detail-api'
import contractorApi from './contractor-api'
import rolePermission from './role-permission'

/*
* 公共接口 => common.api.js
*
*/

const API = {
  ...commonAPI,
  ...reissueManagementApi,
  ...orderDeliverManagement,
  ...teamManagementApi,
  ...orderStatisticsApi,
  ...newEmployeeDetailApi,
  ...contractorApi,
  ...rolePermission,
}

export default API;
