<template>
  <div>
    <Card>
      <div slot="title">
        <Row @keydown.native.enter.prevent="getList('search')">
          <Col span="22">
            <Form inline>
              <Select v-model="searchData.ownership" placeholder="数据权限范围" @on-change="getList('search')">
                <Option v-for="(item, index) in dataPermissionRange" :value="item.value" :label="item.label" :key="'dataPer' + index"></Option>
              </Select>
              <Input
                v-model="searchData.job_number"
                placeholder="请输入工号"
                clearable
                class="mb-5"
              />
              <Input
                v-model="searchData.created_by"
                placeholder="请输入姓名"
                clearable
                class="mb-5"
              />
              <Select
                v-model="searchData.checkin_way"
                placeholder="拜访类型"
                @on-change="getList('search')"
                clearable
                class="mb-5"
              >
                <Option
                  v-for="item in visitTypeList"
                  :key="item.value"
                  :value="item.value"
                  >{{ item.label }}</Option
                >
              </Select>
              <Input class="mb-5" v-model="searchData.offline_dept_name" placeholder="系统部门" clearable />
              <DatePicker
                type="date"
                placeholder="签到时间"
                @on-change="getBeginTime"
                class="mb-5"
              ></DatePicker>
              <DatePicker
                type="date"
                placeholder="签退时间"
                @on-change="getEndTime"
                class="mb-5"
              ></DatePicker>
              <Input
                v-model="searchData.merchant_name"
                placeholder="公司名称"
                clearable
                class="mb-5"
              />
              <Input
                v-model="searchData.address"
                placeholder="签到地址"
                clearable
                class="mb-5"
              />
              <Row>
                <Button
                  type="primary"
                  @click="getExport"
                  :loading="loadingButton"
                  v-permission="'/v1/checkin-management/export'"
                  >导出考勤数据</Button
                >
              </Row>
            </Form>
          </Col>
          <Col span="2">
            <Button type="primary" icon="ios-search" @click="getList('search')">搜索</Button>
          </Col>
        </Row>
      </div>
      <div>
        <Row>
          <Table
            border
            ref="selection"
            :columns="listData.columns"
            :data="listData.data"
            :loading="loadingTable"
          ></Table>
        </Row>
        <Row>
          <div style="padding: 20px 0">
            <div style="float: left">共 {{ pageProps.total }} 条</div>
            <div style="float: right">
              <Page
                :total="pageProps.total"
                :current="pageProps.page"
                size="small"
                show-elevator
                show-sizer
                @on-change="changePage"
                @on-page-size-change="changePageSize"
              />
            </div>
          </div>
        </Row>
      </div>
    </Card>
  </div>
</template>
<script>
import globalMixin from '~/plugins/mixin'
export default {
  name: 'attendance-management',
  mixins: [globalMixin],
  data() {
    return {
      loadingTable: false,
      loadingSelect: false,
      loadingButton: false,
      pageProps: {
        total: 10,
        page: 1,
        perPage: 10,
      },
      searchData: {
        ownership: 'company'
      },
      visitTypeList: [
        { value: 'street_worship', label: '陌拜' },
        { value: 'return_visit', label: '回访' },
        { value: 'no_shop', label: '无门店' },
        { value: 'maintain', label: '维护' },
      ],
      listData: {
        columns: [
          { type: 'selection', align: 'center', width: 60 },
          { title: '员工工号', key: 'jobNumber', align: 'center', width: 100 },
          {
            title: '员工姓名',
            align: 'center',
            width: 100,
            render: (h, params) => {
              return h(
                'div',
                {
                  style: {
                    color: '#1ba8f5',
                    cursor: 'pointer',
                  },
                  on: {
                    click: () => {
                      let type = params.row.checkinWay
                      if (type === 'street_worship') {
                        type = 'moobei'
                      } else if (type === 'return_visit') {
                        type = 'visit'
                      } else if (type === 'maintain') {
                        type = 'maintain'
                      } else {
                        type = 'default'
                      }
                      this.$router.push({
                        path: `/field-management/attendance-details/${type}`,
                        query: {
                          id: params.row.id,
                        },
                      })
                    },
                  },
                },
                params.row.createdBy
              )
            },
          },
          {
            title: '员工职务',
            key: 'jobStation',
            align: 'center',
            minWidth: 135,
          },
          // {
          //   title: '部门-中心',
          //   key: 'deptName',
          //   align: 'center',
          //   minWidth: 180,
          // },
          {
            title: '系统部门',
            key: 'offlineDeptName',
            align: 'center',
            minWidth: 180,
          },
          {
            title: '签到时间',
            align: 'center',
            width: 210,
            render: (h, params) => {
              let time = params.row.signin_at || params.row.signinAt,
                  day = new Date(time * 1000).getDay(),
                  week = ['日', '一', '二', '三', '四', '五', '六']
              return !+time
                ? h('span', '')
                : h('span', this.formatDate(time) + ` (星期${week[day]})`)
            },
          },
          {
            title: '签退时间',
            align: 'center',
            minWidth: 210,
            render: (h, params) => {
              let time = params.row.signout_at || params.row.signoutAt,
                  day = new Date(time * 1000).getDay(),
                  week = ['日', '一', '二', '三', '四', '五', '六']
              return !+time
                ? h('span', '')
                : h('span', this.formatDate(time) + ` (星期${week[day]})`)
            },
          },
          {
            title: '拜访时长',
            key: 'checkinLength',
            align: 'center',
            width: 100,
          },
          {
            title: '拜访类型',
            align: 'center',
            width: 100,
            render: (h, params) => {
              return h('span', this.formatCheckinWay(params.row.checkinWay))
            },
          },
          {
            title: '状态',
            align: 'center',
            minWidth: 100,
            render: (h, params) => {
              let status = params.row.isException
              if (status === 'no') {
                return h('span', '正常')
              } else if (status === 'yes') {
                return h('span', '异常')
              }
            },
          },
          {
            title: '签到地址',
            key: 'address',
            align: 'center',
            width: 150,
            tooltip: true,
          },
          {
            title: '签退地址',
            key: 'checkoutAddress',
            align: 'center',
            width: 150,
            tooltip: true,
          },
          {
            title: '公司名称',
            key: 'merchantName',
            align: 'center',
            width: 150,
          },
        ],
        data: [],
      },
    }
  },
  activated() {
    this.getList()
  },
  methods: {
    // 改变页码
    changePage(e) {
      this.pageProps.page = e
      this.getList()
    },
    // 改变每页显示数
    changePageSize(e) {
      this.pageProps.perPage = e
      this.getList()
    },

    getBeginTime(date) {
      this.searchData.startTime = date
    },

    getEndTime(date) {
      this.searchData.endTime = date
    },

    getList(type) {
      let params = JSON.parse(JSON.stringify(this.searchData))
      if (type == 'search') {
        this.pageProps.perPage = 10
        this.pageProps.page = 1
      }
      params.perPage = this.pageProps.perPage
      params.page = this.pageProps.page
      this.loadingTable = true
      this.$api
        .attendanceList(params)
        .then((res) => {
          if (res.code === 0) {
            let data = res.data
            this.listData.data = data.list
            this.pageProps.page = data.currentPage
            this.pageProps.total = data.totalCount
            this.searchData.ownership = data.ownership // 接口返回有问题，暂时屏蔽
            this.handleValidateDataPermissionRange(this, 'isGetDataPermissionRange', 'dataPermissionRange', data.ownership)
          }
        })
        .finally(() => {
          this.loadingTable = false
        })
    },

    getExport() {
      let params = JSON.parse(JSON.stringify(this.searchData))
      this.loadingButton = true
      this.$api
        .attendanceExport(params)
        .then((res) => {
          if (res.code == 0) {
            window.location.href = res.data.filePath
          }
        })
        .finally(() => {
          this.loadingButton = false
        })
    },

    formatDate(time, type) {
      type = type || 'yyyy-MM-dd hh:mm:ss'
      return this.$format(time, type)
    },

    formatCheckinWay(type) {
      let temp = ''
      switch (type) {
        case 'street_worship':
          temp = '陌拜'
          break
        case 'return_visit':
          temp = '回访'
          break
        case 'no_shop':
          temp = '无门店'
          break
        case 'maintain':
          temp = '维护'
          break
        default:
          break
      }
      return temp
    },
  },
}
</script>
<style lang="less" scoped>
.row-style {
  margin-top: 10px;
}
.div-modal {
  padding: 30px 25px 20px 5px;
}
.mb-5 {
  margin-bottom: 5px;
}
/deep/ .date-picker-editor {
  width: 150px;
}
</style>
