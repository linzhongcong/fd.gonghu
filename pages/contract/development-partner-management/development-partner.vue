<template>
  <div>
    <Card>
      <!-- 筛选搜索区域 -->
      <Row slot="title" justify="space-between" @keydown.native.enter.prevent="getList('new')">
        <Col style="margin-bottom: 10px;" span="22">
          <Select class="mb-5" v-model="formData.ownership" placeholder="数据权限范围" @on-change="getList('new')">
            <Option
              v-for="(item, index) in dataPermissionRange"
              :value="item.value"
              :label="item.label"
              :key="'dataPer' + index">
            </Option>
          </Select>
          <Input v-model="formData.merchantName" clearable placeholder="公司名称" class="mb-5"/>
          <Select v-model="formData.merchantType" clearable placeholder="客户类型" class="mb-5">
            <Option
              v-for="(item, index) in merchantTypeList"
              :key="'status' + index"
              :value="item.value"
              :label="item.label"
            ></Option>
          </Select>
          <Input v-model="formData.facadeName" clearable placeholder="系统/门店名称" class="mb-5"/>
          <Input v-model="formData.facadeAddress" clearable placeholder="门店地址" class="mb-5"/>
          <Input v-model="formData.createdBy" clearable placeholder="创建人" class="mb-5"/>
          <DatePicker v-model="createDate" type="daterange" @on-change="selectDate" placeholder="选择创建日期"></DatePicker>
          <Select v-model="formData.leadsStatus" clearable placeholder="线索状态" class="mb-5">
            <Option
              v-for="(item, index) in leadsTypeList"
              :key="'status' + index"
              :value="item.value"
              :label="item.label"
            ></Option>
          </Select>
          <Select v-model="formData.level" clearable placeholder="客户等级" class="mb-5">
            <Option v-for="(item, index) in levelList" :key="'status' + index" :value="item.value" :label="item.label"></Option>
          </Select>
        </Col>
        <Col span="2">
          <Button type="primary" icon="ios-search" @click="getList('new')">搜索</Button>
        </Col>
        <Col span="24">
          <!-- <Button type="primary" @click="goToTransformPage" v-permission="'/v2/leads/convert'">转换</Button> -->
          <Button type="primary" :loading="exportLoading" @click="handleExport" v-permission="'/v2/leads/export'">导出</Button>
        </Col>
      </Row>
      <Tabs v-model="isTabValus" @on-click="tabsChange">
        <TabPane label="有效线索" name="valid">
          <Row class="margin-top-10">
            <Table
              border
              highlight-row
              :columns="listData.columns"
              :data="listData.data"
              :loading="loadingTable"
              size="small"
              @on-selection-change="selectCheck"
            >
              <!-- 操作 -->
              <template slot-scope="{ row }" slot="action">
                <Tooltip placement="top" content="编辑" transfer>
                  <Button
                    v-permission="'/v2/leads/update'"
                    type="primary"
                    icon="md-create"
                    :disabled="row.leadsStatus == 'converted' || row.leadsStatus == 'repeat'"
                    size="small"
                    @click="handleEdit(row.id)"
                  ></Button>
                </Tooltip>
                <Poptip confirm title="您确认删除这条内容吗？" @on-ok="handleDelete(row.id)" transfer>
                  <Button
                    v-permission="'/v2/leads/delete'"
                    size="small"
                    icon="md-trash"
                    :disabled="row.leadsStatus == 'converted' || row.leadsStatus == 'repeat'"
                  ></Button>
                </Poptip>
              </template>
            </Table>
            <div style="margin: 10px;overflow: hidden">
              <div class="pages-L">共 {{ validPage.totalCount }} 条</div>
              <div style="float: right;">
                <Page
                  :total="validPage.totalCount"
                  size="small"
                  :current="validPage.currentPage"
                  show-sizer
                  show-elevator
                  @on-change="changePage"
                  @on-page-size-change="changePageSize"
                ></Page>
              </div>
            </div>
          </Row>
        </TabPane>
        <TabPane label="存疑线索" name="invalid">
          <Row class="margin-top-10">
            <Table
              border
              highlight-row
              :columns="listData.columns"
              :data="listData.data"
              :loading="loadingTable"
              size="small"
              @on-selection-change="selectCheck"
            >
              <!-- 操作 -->
              <template slot-scope="{ row }" slot="action">
                <Tooltip placement="top" content="编辑" transfer>
                  <Button
                    v-permission="'/v2/leads/update'"
                    type="primary"
                    icon="md-create"
                    :disabled="row.leadsStatus == 'converted' || row.leadsStatus == 'repeat'"
                    size="small"
                    @click="handleEdit(row.id)"
                  ></Button>
                </Tooltip>
                <Poptip confirm title="您确认删除这条内容吗？" @on-ok="handleDelete(row.id)" transfer>
                  <Button
                    v-permission="'/v2/leads/delete'"
                    size="small"
                    icon="md-trash"
                    :disabled="row.leadsStatus == 'converted' || row.leadsStatus == 'repeat'"
                  ></Button>
                </Poptip>
              </template>
            </Table>
            <div style="margin: 10px;overflow: hidden">
              <div class="pages-L">共 {{ invalidPage.totalCount }} 条</div>
              <div style="float: right;">
                <Page
                  :total="invalidPage.totalCount"
                  size="small"
                  :current="invalidPage.currentPage"
                  show-sizer
                  show-elevator
                  @on-change="changePage"
                  @on-page-size-change="changePageSize"
                ></Page>
              </div>
            </div>
          </Row>
        </TabPane>
      </Tabs>
    </Card>
  </div>
</template>
<script>
import globalMixin from '~/plugins/mixin'
import mixin from '../mixins'
export default {
  name: 'leads',
  mixins: [globalMixin, mixin],
  data() {
    return {
      isTabValus: 'valid',
      exportLoading: false,
      createDate: [],
      checkList: [],
      formData: {
        ownership: 'company'
      },
      loadingTable: false,
      listData: {
        columns: [
          { type: 'selection', width: 60, align: 'center' },
          {
            key: 'merchantName',
            title: '公司名称',
            minWidth: 150,
            align: 'center',
          },
          {
            key: 'merchantType',
            title: '客户类型',
            minWidth: 100,
            align: 'center',
            render: (h, params) => h('span', this.formatMerchantType(params.row.merchantType))
          },
          {
            key: 'facadeName',
            title: '系统/门店名称',
            minWidth: 200,
            align: 'center',
            render: (h, params) => {
              return h(
                'a',
                {
                  on: {
                    click: () => {
                      this.$router.push({
                        path: '/contract/development-partner-management/development-details',
                        query: { id: params.row.id },
                      })
                    },
                  },
                },
                params.row.facadeName
              )
            },
          },
          { key: 'facadeAddress', title: '门店地址', minWidth: 180, align: 'center' },
          { key: 'createdBy', title: '创建人', minWidth: 125, align: 'center' },
          {
            key: 'createdAt',
            title: '创建时间',
            minWidth: 150,
            align: 'center',
            render: (h, params) => {
              return h('div', this.formatDate(params.row.createdAt))
            },
          },
          {
            key: 'leadsStatus',
            title: '线索状态',
            minWidth: 100,
            align: 'center',
            render: (h, params) => {
              let status = params.row.leadsStatus
              if (status === 'waitFollow') {
                return h('span', '待跟进')
              } else if (status === 'inFollow') {
                return h('span', '跟进中')
              } else if (status === 'converted') {
                return h('span', '已转换')
              } else if (status === 'repeat') {
                return h('span', '重复线索')
              }
            },
          },
          { key: 'action', title: '操作', align: 'center', minWidth: 100, slot: 'action' },
        ],
        data: [],
      },
      // 列表分页属性
      validPage: {
        page: 1,
        perPage: 10,
        currentPage: 1,
        totalCount: 0,
      },
      invalidPage: {
        page: 1,
        perPage: 10,
        currentPage: 1,
        totalCount: 0,
      },
      // 客户等级
      levelList: [
        { value: 'N', label: '无' },
        { value: 'A', label: 'A' },
        { value: 'B', label: 'B' },
        { value: 'C', label: 'C' },
        { value: 'D', label: 'D' },
      ],
      // 线索状态
      leadsTypeList: [
        { value: 'waitFollow', label: '待跟进' },
        { value: 'inFollow', label: '跟进中' },
        { value: 'converted', label: '已转换' },
        { value: 'repeat', label: '重复线索' },
      ],
    }
  },
  methods: {
    selectDate(date) {
      date[0] = date[0].trim() + ' 00:00:00'
      date[1] = date[1].trim() + ' 23:59:59'
      this.createDate = date
    },

    // 导出
    handleExport() {
      this.exportLoading = true
      let params = JSON.parse(JSON.stringify(this.formData))
      let date = this.createDate
      if (date[0].trim() != '00:00:00' && date[1].trim() != '23:59:59' && date[0].trim() != '' && date[1].trim() != '') {
        params.createdStartAt = new Date(date[0]).getTime() / 1000
        params.createdEndAt = new Date(date[1]).getTime() / 1000
      }
      params.leadsType = this.isTabValus
      this.$api
        .cuePoolExport(params)
        .then((res) => {
          if (res.code === 0) {
            location.href = res.data[0]
            this.exportLoading = false
            this.$Message.success('导出成功')
          }
        })
        .finally(() => {
          this.loadingTable = false
        })
    },

    // 切换标签
    tabsChange(name) {
      this.isTabValus = name
      this.getList('new')
    },

    // 编辑
    handleEdit(id) {
      this.$router.push({
        path: '/contract/development-partner-management/development-edit',
        query: {
          id,
        },
      })
    },

    // 改变页码
    changePage(e) {
      if (this.isTabValus === 'valid') {
        this.validPage.page = e
      }
      if (this.isTabValus === 'invalid') {
        this.invalidPage.page = e
      }
      this.getList()
    },

    // 改变页数
    changePageSize(e) {
      if (this.isTabValus === 'valid') {
        this.validPage.perPage = e
      }
      if (this.isTabValus === 'invalid') {
        this.invalidPage.perPage = e
      }
      this.getList()
    },

    getList(type = '') {
      let params = JSON.parse(JSON.stringify(this.formData))
      let date = this.createDate
      if (date[0].trim() != '00:00:00' && date[1].trim() != '23:59:59' && date[0].trim() != '' && date[1].trim() != '') {
        params.createdStartAt = new Date(date[0]).getTime() / 1000
        params.createdEndAt = new Date(date[1]).getTime() / 1000
      }
      if (this.isTabValus === 'valid') {
        params.leadsType = 'valid'
        params.page = this.validPage.page
        params.perPage = this.validPage.perPage
        if (type) {
          params.page = this.validPage.page = 1
        }
      } else if (this.isTabValus === 'invalid') {
        params.leadsType = 'invalid'
        params.page = this.invalidPage.page
        params.perPage = this.invalidPage.perPage
        if (type) {
          params.page = this.invalidPage.page = 1
        }
      }
      this.loadingTable = true
      this.$api
        .cuePoolList(params)
        .then((res) => {
          if (res.code === 0) {
            let data = res.data
            this.listData.data = data.list
            if (this.isTabValus === 'valid') {
              this.validPage.totalCount = data.totalCount
              this.validPage.currentPage = data.currentPage
            }
            if (this.isTabValus === 'invalid') {
              this.invalidPage.totalCount = data.totalCount
              this.invalidPage.currentPage = data.currentPage
            }
            this.formData.ownership = data.ownership
            this.handleValidateDataPermissionRange(this, 'isGetDataPermissionRange', 'dataPermissionRange', data.ownership)
          }
        })
        .finally(() => {
          this.loadingTable = false
        })
    },
    formatDate(time, type) {
      let format = type || 'yyyy-MM-dd hh:mm:ss'
      return this.$format(time, format)
    },

    // 跳转转换页面
    goToTransformPage() {
      if (this.isTabValus === 'effective') {
        let checkList = this.checkList
        if (checkList.length === 0) {
          return void this.$Message.warning('请选择！')
        } else if (checkList.length >= 2) {
          return void this.$Message.warning('只能选中一条！')
        } else {
          this.$router.push({
            path: '/contract/development-partner-management/development-confirm',
            query: {
              id: checkList[0].id,
            },
          })
        }
      } else {
      }
    },

    /**
     * 列表点击信息
     * @param {Object} selection：用户信息
     */
    selectCheck(selection) {
      this.checkList = selection
    },
    handleDelete(id) {
      this.$Modal.confirm({
        title: '确认删除',
        content: '删除此线索将同时删除关联的门店和联系人',
        loading: true,
        onOk: () => {
          this.$api.cuePoolDelCompanyInfo({ id }).then((res) => {
            if (res.code === 0) {
              this.$Message.success('删除成功')
              this.getList()
            }
          })
          .catch((err) => {
            this.$Notice.error({
              title: err.code,
              desc: err.message
            })
          })
          .finally(() => {
            this.$Modal.remove()
          })
        }
      })
    },
  },

  activated() {
    // 重置分页数据
    // this.validPage.page = this.invalidPage.page = 1
    // this.validPage.perPage = this.invalidPage.perPage = 10
    // this.validPage.currentPage = this.invalidPage.currentPage = 1
    // this.validPage.totalCount = this.invalidPage.totalCount = 0
    this.getList()
  },

  watch: {
    $route: {
      deep: true,
      handler: function(newVal, oldVal) {
        if (oldVal.name == newVal.name && Object.keys(newVal.query)) {
          this.formData = {}
          this.getList()
        }
      },
    },
  },
}
</script>
<style lang="less" scoped>
.detail-table {
  text-align: center;
  border-collapse: collapse;
  tr {
    td {
      border: 1px #dcdee2 solid;
      height: 45px;
      width: 127px;
      padding: 0 10px;
    }
  }
}
.td-title {
  background: #f8f8f9;
}
.modal-div {
  overflow-y: scroll;
  height: 420px;
}
.td-div {
  display: -webkit-box; /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
  display: -moz-box; /* 老版本语法: Firefox (buggy) */
  display: -ms-flexbox; /* 混合版本语法: IE 10 */
  display: -webkit-flex; /* 新版本语法: Chrome 21+ */
  display: flex; /* 新版本语法: Opera 12.1, Firefox 22+ */
  width: 100%;
  div {
    padding: 5px 0;
    line-height: 33px;
  }
}
.td-div-title {
  background: #f8f8f9;
  width: 127px;
  border-right: 1px #dcdee2 solid;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.td-div-content {
  width: 100%;
}
.td-div-border {
  border-bottom: 1px #dcdee2 solid;
}
.td-div-border:last-child {
  border-bottom: none;
}
.file-list {
  display: inline;
  margin: 10px 0;
  padding: 0 15px;
  box-sizing: border-box;
}

/deep/ .ivu-table-wrapper {
  border-bottom: 0;
  border-right: 0;
}

/deep/ .ivu-card-head .ivu-date-picker-editor {
  width: 200px;
}

.mb-5 {
  margin-bottom: 5px;
}
</style>
