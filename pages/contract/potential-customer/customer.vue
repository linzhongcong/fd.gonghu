<template>
  <div>
    <Card>
      <!-- 筛选搜索区域 -->
      <Row
        slot="title"
        justify="space-between"
        @keydown.native.enter.prevent="getList('new')"
      >
        <Col style="margin-bottom: 10px;" span="22">
          <Select class="mb-5" v-model="formData.ownership" placeholder="数据权限范围" @on-change="getList('new')">
            <Option
              v-for="(item, index) in dataPermissionRange"
              :value="item.value"
              :label="item.label"
              :key="'dataPer' + index">
            </Option>
          </Select>
          <Input
            v-model="formData.merchantName"
            clearable
            placeholder="公司名称"
            class="mb-5"
          />
          <Select
            v-model="formData.merchantType"
            clearable
            placeholder="客户类型"
            class="mb-5"
          >
            <Option
              v-for="(item, index) in merchantTypeList"
              :key="'mType' + index"
              :value="item.value"
              :label="item.label"
            ></Option>
          </Select>
          <Input
            v-model="formData.salesmanName"
            clearable
            placeholder="负责人"
            class="mb-5"
          />
          <DatePicker
            v-model="createDate"
            type="daterange"
            @on-change="selectDate"
            placeholder="选择创建日期"
            class="mb-5"
          ></DatePicker>
          <Select
            v-model="formData.isAllocated"
            clearable
            placeholder="是否分配"
            class="mb-5"
          >
            <Option
              v-for="(item, index) in isAllocatedList"
              :key="'allocated' + index"
              :value="item.value"
              :label="item.label"
            ></Option>
          </Select>
          <Select v-model="formData.potentialStatus" placeholder="合作状态" clearable>
            <Option v-for="(item, index) in potentialStatusList" :value="item.value" :label="item.label" :key="'coStatus' + index"></Option>
          </Select>
        </Col>
        <Col span="2">
          <Button type="primary" icon="ios-search" @click="getList('new')"
            >搜索</Button
          >
        </Col>
        <Col span="24">
          <Button type="primary" @click="handleEdit('add')" v-permission="'/v2/potential-customer/allocate'">添加</Button>
          <Button type="primary" @click="handleDistribution" v-permission="'/v2/potential-customer/create'">分配</Button>
          <Button type="primary" @click="handleTakeBack" v-permission="'/v2/potential-customer/withdraw'">收回</Button>
          <Button type="primary" @click="handleCooperation" v-permission="'/v2/potential-customer/cooperate'">确认合作</Button>
          <Button type="primary" @click="handleApplyProtect" v-permission="'/v2/potential-customer/protect'">申请保护</Button>
          <Button type="primary" :loading="exportLoading" @click="handleExport" v-permission="'/v2/potential-customer/export'">导出</Button>
        </Col>
      </Row>
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
                type="primary"
                icon="md-create"
                size="small"
                @click="handleEdit(row.id)"
                v-permission="'/v2/potential-customer/update'"
              >
              </Button>
            </Tooltip>
            <Poptip
              confirm
              title="您确认删除这条内容吗？"
              @on-ok="handleDelete(row.id)"
              transfer
            >
              <Button size="small" icon="md-trash" v-permission="'/v2/potential-customer/delete'"></Button>
            </Poptip>
          </template>
        </Table>
        <div style="margin: 10px;overflow: hidden">
          <div class="pages-L">共 {{ pageProps.totalCount }} 条</div>
          <div style="float: right;">
            <Page
              :total="pageProps.totalCount"
              size="small"
              :current="pageProps.currentPage"
              show-sizer
              show-elevator
              @on-change="changePage"
              @on-page-size-change="changePageSize"
            ></Page>
          </div>
        </div>
      </Row>
    </Card>
    <!-- 确认回收模态框 start -->
    <Modal :loading="loading" v-model="takeBack.show" width="430">
      <p slot="header">
        <span>确认回收</span>
      </p>
      <div style="text-align:center">
        <p class="take-back-title">收回后潜在客户将无负责人</p>
        <Form
          ref="takeBack"
          :model="takeBack.formData"
          :rules="takeBack.rule"
          label-position="left"
          :label-width="75"
        >
          <FormItem label="收回理由:" prop="reason">
            <Input v-model="takeBack.formData.reason" type="textarea" />
          </FormItem>
        </Form>
      </div>
      <div slot="footer" style="display:flex; justify-content: flex-end;">
        <Button
          type="default"
          style="width:80px"
          @click="closeModal('takeBack')"
          long
          >取消</Button
        >
        <Button
          type="primary"
          style="width:80px"
          @click="confirmTakeBack('takeBack')"
          :loading="takeBack.btnLoading"
          long
          >确认</Button
        >
      </div>
    </Modal>
    <!-- 确认回收模态框 end -->
    <!-- 确认合作模态框 start -->
    <Modal :loading="loading" v-model="isCooperation" width="430">
      <p slot="header">
        <span>确认合作</span>
      </p>
      <div style="text-align:center">
        <p class="take-back-title">确认转换为合作客户</p>
      </div>
      <div slot="footer" style="display:flex; justify-content: flex-end;">
        <Button
          type="default"
          style="width:80px"
          @click="closeModal('isCooperation')"
          long
          >取消</Button
        >
        <Button
          type="primary"
          style="width:80px"
          @click="confirmCooperation"
          :loading="cooperationBtnLoading"
          long
          >确认</Button
        >
      </div>
    </Modal>
    <!-- 确认合作模态框 end -->
    <!-- 分配模态框 start -->
    <Modal
      :loading="loading"
      v-model="distribution.show"
      title="审核详情"
      width="800"
    >
      <div class="rel">
        <!-- 订单详情 start -->
        <div class="ivu-table-wrapper">
          <div class="ivu-table ivu-table-small ivu-table-border">
            <div class="ivu-table-body">
              <table cellspacing="0" cellpadding="0" border="0" width="100%">
                <tbody class="ivu-table-tbody">
                  <tr class="ivu-table-row">
                    <td class="head-bg w-300">
                      <div class="ivu-table-cell">公司名称</div>
                    </td>
                    <td>
                      <div class="ivu-table-cell">
                        <span
                          v-text="distribution.formData.merchantName"
                          class="policy-detail"
                        ></span>
                      </div>
                    </td>
                  </tr>
                  <tr class="ivu-table-row">
                    <td class="head-bg w-300">
                      <div class="ivu-table-cell">门店数量</div>
                    </td>
                    <td>
                      <div class="ivu-table-cell">
                        <span
                          v-text="distribution.formData.estimateFacadeNumber"
                        ></span>
                      </div>
                    </td>
                  </tr>
                  <tr class="ivu-table-row">
                    <td class="head-bg w-300">
                      <div class="ivu-table-cell">客户等级</div>
                    </td>
                    <td>
                      <div class="ivu-table-cell">
                        <span v-text="distribution.formData.level"></span>
                      </div>
                    </td>
                  </tr>
                  <tr class="ivu-table-row">
                    <td class="head-bg w-300">
                      <div class="ivu-table-cell">负责员工</div>
                    </td>
                    <td>
                      <div class="ivu-table-cell">
                        <Select
                          v-model="distribution.formData.id"
                          filterable
                          remote
                          :loading="distribution.loading"
                          :remote-method="searchEmploye"
                          @on-change="selectEmploye"
                          :placeholder="
                            this.distribution.formData.name
                              ? this.distribution.formData.name
                              : '请输入员工姓名/工号'
                          "
                        >
                          <Option
                            v-for="(item, index) in employeList"
                            :value="item.id"
                            :label="`${item.username} / ${item.real_name}`"
                            :key="index"
                          ></Option>
                        </Select>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <Spin v-show="" :fix="true" size="large"></Spin>
      </div>
      <div slot="footer">
        <Button type="default" @click="closeModal('distribution')">返回</Button>
        <Button
          type="primary"
          :loading="distribution.btnLoading"
          @click="confirmDistribution"
          >提交</Button
        >
      </div>
    </Modal>
    <!-- 分配模态框 end -->
    <!-- 申请保护模态框 start -->
    <Modal :loading="loading" v-model="applyProtect.show" width="430">
      <p slot="header">
        <span>确认申请保护？</span>
      </p>
      <div style="text-align:center">
        <Form
          ref="applyProtect"
          :model="applyProtect.formData"
          :rules="applyProtect.rule"
          label-position="left"
          :label-width="75"
        >
          <FormItem label="申请理由:" prop="reason">
            <Input v-model="applyProtect.formData.reason" type="textarea" />
          </FormItem>
        </Form>
      </div>
      <div slot="footer" style="display:flex; justify-content: flex-end;">
        <Button
          type="default"
          style="width:80px"
          @click="closeModal('applyProtect')"
          long
          >取消</Button
        >
        <Button
          type="primary"
          style="width:80px"
          @click="confirmApplyProtect('applyProtect')"
          :loading="applyProtect.btnLoading"
          long
          >确认</Button
        >
      </div>
    </Modal>
    <!-- 申请保护模态框 end -->
  </div>
</template>
<script>
import globalMixin from '~/plugins/mixin'
import mixin from '../mixins'
export default {
  name: 'potential-customer',
  mixins: [globalMixin, mixin],
  data() {
    return {
      exportLoading: false,
      loading: false,
      canSend: true,
      // 申请保护
      applyProtect: {
        rule: {
          reason: [
            { required: true, message: '申请理由不能为空', trigger: 'blur' },
          ],
        },
        formData: {
          reason: '',
        },
        btnLoading: false,
        show: false,
      },
      // 分配
      distribution: {
        formData: {
          id: '',
          name: '',
          merchantName: '',
          estimateFacadeNumber: '',
          level: '',
        },
        btnLoading: false,
        loading: false,
        show: false,
      },
      employeList: [],
      // 收回
      takeBack: {
        rule: {
          reason: [
            { required: true, message: '收回理由不能为空', trigger: 'blur' },
          ],
        },
        formData: {
          reason: '',
        },
        btnLoading: false,
        show: false,
      },
      isCooperation: false,
      cooperationBtnLoading: false,
      checkList: [],
      createDate: [],
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
            render: (h, params) => {
              return h(
                'a',
                {
                  on: {
                    click: () => {
                      this.$router.push({
                        path: '/contract/potential-customer/customer-detail',
                        query: { id: params.row.id },
                      })
                    },
                  },
                },
                params.row.merchantName
              )
            },
          },
          {
            key: 'merchantType',
            title: '客户类型',
            minWidth: 100,
            align: 'center',
            render: (h, params) => h('span', this.formatMerchantType(params.row.merchantType))
          },
          { key: 'level', title: '客户等级', minWidth: 100, align: 'center' },
          {
            key: 'salesmanName',
            title: '负责人',
            minWidth: 100,
            align: 'center',
          },
          {
            title: '创建时间',
            minWidth: 150,
            align: 'center',
            render: (h, params) => {
              return h('div', this.formatDate(params.row.convertedAt))
            },
          },
          {
            title: '回收时间',
            minWidth: 150,
            align: 'center',
            render: (h, params) => {
              return h(
                'div',
                {
                  style: {
                    color: params.row.isAdvent === 'yes' ? 'red' : '',
                  },
                },
                this.formatDate(params.row.expireAt)
              )
            },
          },
          {
            title: '创建时间',
            minWidth: 150,
            align: 'center',
            render: (h, params) => {
              return h('div', this.formatDate(params.row.convertedAt))
            },
          },
          {
            title: '合作状态',
            key: 'potentialStatus',
            align: 'center',
            minWidth: 100,
            render: (h, params) => {
              let status = params.row.potentialStatus
              if (status) {
                return h('span', `${status === 'hadCo' ? '已' : '未'}合作`)
              }
            }
          },
          {
            key: 'action',
            title: '操作',
            align: 'center',
            minWidth: 100,
            slot: 'action',
          },
        ],
        data: [],
      },
      // 列表分页属性
      pageProps: {
        page: 1,
        perPage: 10,
        currentPage: 1,
        totalCount: 0,
      },
      // 是否分配
      isAllocatedList: [
        { value: 'yes', label: '已分配' },
        { value: 'no', label: '待分配' },
      ],
      potentialStatusList: [ // 合作状态
        { value: 'noCo', label: '未合作' },
        { value: 'hadCo', label: '已合作' },
      ],
    }
  },
  methods: {
    // 选择日期
    selectDate(date) {
      if (date[0] === '' && date[1] === '') {
        this.createDate = []
        return
      }
      date[0] = date[0].trim() + ' 00:00:00'
      date[1] = date[1].trim() + ' 23:59:59'
      this.createDate = date
    },

    // 关闭模态框
    closeModal(modal) {
      if (typeof this[modal] === 'boolean') {
        this[modal] = false
        return
      }
      this[modal].show = false
    },

    // 远程搜索
    searchEmploye(username) {
      this.distribution.loading = true
      this.$api.user({ username }).then((res) => {
        this.distribution.loading = false
        if (res.items.length !== 0) {
          this.employeList = res.items
        }
      })
    },

    // 选中搜索的员工
    selectEmploye(value) {
      this.distribution.formData.id = value
    },

    // 收回
    handleTakeBack() {
      // 只有负责人的情况下可以收回
      if (this.hasChecked()) {
        if (this.checkList[0].salesmanName != '') {
          this.takeBack.formData.reason = ''
          this.takeBack.show = true
        } else {
          this.$Message.warning('该数据无负责人，无法收回')
        }
      }
    },

    // 分配
    handleDistribution() {
      if (this.hasChecked()) {
        let check = this.checkList[0]
        this.distribution.formData.name = !check.salesmanName
          ? ''
          : `${check.salesmanUsername} / ${check.salesmanName}`
        this.distribution.formData.merchantName = check.merchantName
        this.distribution.formData.estimateFacadeNumber =
          check.estimateFacadeNumber
        this.distribution.formData.level = check.level
        this.employeList = []
        this.distribution.formData.id = ''
        this.distribution.show = true
      }
    },

    // 申请保护
    handleApplyProtect() {
      if (this.hasChecked()) {
        this.applyProtect.formData.reason = ''
        this.applyProtect.show = true
      }
    },

    // 确认合作
    handleCooperation() {
      if (this.hasChecked()) {
        this.$router.push({
          path: '/contract/cooperative-customer/cooperative-edit',
          query: {
            id: this.checkList[0].id,
            origin: 'customer'
          }
        })
        // this.isCooperation = true
      }
    },

    // 确认 - 合作
    confirmCooperation() {
      this.cooperationBtnLoading = true
      let id = this.checkList[0].id
      this.$api
        .potentialCustomerCooperate({ id })
        .then((res) => {
          if (res.code === 0) {
            this.$Message.success('确认合作成功')
            this.cooperationBtnLoading = false
            this.isCooperation = false
            this.getList('new')
          }
        })
        .catch((err) => {
          this.$Notice.warning({
            title: '提示：',
            desc: err.message,
          })
          this.cooperationBtnLoading = false
        })
    },

    // 确认 - 分配
    confirmDistribution() {
      this.distribution.btnLoading = true
      if (!this.distribution.formData.id) {
        this.$Message.warning('请选择需要分配的员工')
        this.distribution.btnLoading = false
        this.loading = false
        return
      }
      let salesmanId = +this.distribution.formData.id,
        id = +this.checkList[0].id
      this.$api
        .potentialCustomerAllocate({ salesmanId, id })
        .then((res) => {
          if (res.code === 0) {
            this.$Message.success('分配成功')
            this.distribution.btnLoading = false
            this.closeModal('distribution')
            this.distribution.formData.id = ''
            this.getList()
          }
        })
        .catch((err) => {
          this.$Notice.warning({
            title: '提示：',
            desc: err.message,
          })
          this.distribution.btnLoading = true
        })
    },

    // 确认 - 收回
    confirmTakeBack(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.takeBack.btnLoading = true
          let id = this.checkList[0].id,
            reason = this.takeBack.formData.reason
          this.$api
            .potentialCustomerWithdraw({ id, reason })
            .then((res) => {
              if (res.code === 0) {
                this.$Message.success('收回成功')
                this.takeBack.btnLoading = false
                this.closeModal('takeBack')
                this.getList()
              }
            })
            .catch((err) => {
              this.takeBack.btnLoading = false
            })
        }
      })
    },

    // 确认 - 申请保护
    confirmApplyProtect(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.applyProtect.btnLoading = true
          let id = +this.checkList[0].id,
            reason = this.applyProtect.formData.reason
          this.$api
            .potentialCustomerProtect({ id, reason })
            .then((res) => {
              if (res.code === 0) {
                this.$Message.success('申请保护成功')
                this.applyProtect.btnLoading = false
                this.applyProtect.formData.reason = ''
                this.applyProtect.show = false
                this.getList()
              }
            })
            .catch((err) => {
              this.$Notice.error({
                title: err.code,
                desc: err.message,
              })
              this.applyProtect.btnLoading = false
            })
        }
      })
    },

    // 是否选中
    hasChecked() {
      if (this.checkList.length === 0) {
        this.$Message.warning('请选择！')
        return false
      }
      if (this.checkList.length !== 1) {
        this.$Message.warning('只能选择一条！')
        return false
      } else {
        return true
      }
    },

    // // 跳转添加/编辑页面
    handleEdit(id) {
      if (id === 'add') {
        this.$router.push({
          path: '/contract/potential-customer/customer-edit',
        })
        return
      }
      this.$router.push({
        path: '/contract/potential-customer/customer-edit',
        query: {
          id,
        },
      })
    },

    // 改变页码
    changePage(e) {
      this.pageProps.page = e
      this.getList()
    },

    // 改变页数
    changePageSize(e) {
      this.pageProps.perPage = e
      this.getList()
    },

    // 导出
    handleExport() {
      this.exportLoading = true
      let params = JSON.parse(JSON.stringify(this.formData)),
        date = this.createDate
      if (!(date[0] === '' && date[1] === '') && date.length > 0) {
        params.convertStartAt = new Date(date[0]).getTime() / 1000
        params.convertEndAt = new Date(date[1]).getTime() / 1000
      }
      this.$api
        .potentialCustomerExport(params)
        .then((res) => {
          if (res.code === 0) {
            this.$Message.success('导出成功')
            window.location.href = res.data.url
            this.exportLoading = false
          }
        })
        .catch((err) => {
          this.$Notice.error({
            title: '导出失败',
            desc: err.message,
          })
          this.exportLoading = false
        })
    },

    getList(type = '') {
      let params = JSON.parse(JSON.stringify(this.formData)),
        date = this.createDate
      if (!(date[0] === '' && date[1] === '') && date.length > 0) {
        params.convertStartAt = new Date(date[0]).getTime() / 1000
        params.convertEndAt = new Date(date[1]).getTime() / 1000
      }
      params.page = type ? 1 : this.pageProps.page
      params.perPage = this.pageProps.perPage
      this.loadingTable = true
      this.$api
        .potentialCustomerList(params)
        .then((res) => {
          if (res.code === 0) {
            let data = res.data
            this.listData.data = data.list
            this.pageProps.totalCount = data.totalCount
            this.pageProps.currentPage = data.currentPage
            this.formData.ownership = data.ownership
            this.handleValidateDataPermissionRange(this, 'isGetDataPermissionRange', 'dataPermissionRange', data.ownership) // 全局minxin混入，处理数据权限范围选项
          }
        })
        .finally(() => {
          this.loadingTable = false
        })
    },

    formatDate(time, type) {
      let format = type || 'yyyy-MM-dd'
      return this.$format(time, format)
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
        content: '删除潜在客户将同时删除关联的门店和联系人',
        loading: true,
        onOk: () => {
          this.$api
            .potentialCustomerDelete({ id })
            .then((res) => {
              if (res.code === 0) {
                this.$Message.success('删除成功')
                this.getList()
              }
            })
            .catch((err) => {
              this.$Notice.error({
                title: err.code,
                desc: err.message,
              })
            })
            .finally(() => {
              this.$Modal.remove()
            })
        },
      })
    },
  },
  activated() {
    // 重置分页数据
    // this.pageProps.page = 1
    // this.pageProps.perPage = 10
    // this.pageProps.currentPage = 1
    // this.pageProps.totalCount = 0
    this.getList()
  },

  // watch: {
  //   $route: {
  //     deep: true,
  //     handler: function(newVal, oldVal) {
  //       if (oldVal.name == newVal.name && Object.keys(newVal.query)) {
  //         this.formData = {}
  //         this.getList()
  //       }
  //     },
  //   },
  // },
}
</script>
<style lang="less" scoped>
.ivu-form {
  .ivu-form-item-label {
    padding-right: 1px;
  }
}

/deep/ .ivu-card-head .ivu-date-picker-editor {
  width: 200px;
}

.take-back-title {
  padding: 20px 0;
  font-size: 24px;
  font-weight: bold;
  color: black;
}

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
  .ivu-table {
    .w-300 {
      width: 300px;
    }
  }
}
// .ivu-table-cell {
//   height: 100%;
// }

.mb-5 {
  margin-bottom: 5px;
}
</style>
