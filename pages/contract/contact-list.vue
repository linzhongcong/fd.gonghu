<template>
  <div>
    <Card>
      <Row slot="title">
        <Col span="22" @keydown.native.enter.prevent="getList('new')">
          <Select class="mb-5" v-model="formData.ownership" placeholder="数据权限范围" @on-change="getList('new')">
            <Option v-for="(item, index) in dataPermissionRange" :value="item.value" :label="item.label" :key="'dataPer' + index"></Option>
          </Select>
          <Input v-model="formData.merchantName" clearable placeholder="公司名称"/>
          <Select v-model="formData.merchantType" clearable placeholder="客户类型">
            <Option v-for="(item, index) in merchantTypeList" :key="index" :value="item.value" :label="item.label"></Option>
          </Select>
          <Select v-model="formData.merchantKind" clearable placeholder="客户阶段">
            <Option v-for="(item, index) in merchantKindList" :key="index" :value="item.value" :label="item.label"></Option>
          </Select>
          <Input v-model="formData.createdBy" clearable placeholder="创建人"/>
          <DatePicker 
            v-model="formData.createDate"
            type="daterange"
            @on-change="selectDate"
            placeholder="选择创建时间"></DatePicker>
        </Col>
        <Col span="2">
          <Button type="primary" icon="ios-search" @click="getList('new')">搜索</Button>
        </Col>
        <Col span="24">
          <Button type="primary" @click="openModal('contactInfo', 'add')" v-permission="'/v2/contacts/create'">添加</Button>
          <Button type="primary" :loading="exportLoading" @click="exportContact" v-permission="'/v2/contacts/export'">导出</Button>
        </Col>
      </Row>
      <Row>
        <Table
          border
          highlight-row
          :columns="listData.columns"
          :data="listData.data"
          :loading="loadingTable"
          size="small"
          @on-selection-change="selectCheck">
            <!-- 操作 -->
            <template slot-scope="{ row }" slot="action">
              <Tooltip placement="top" content="编辑" transfer>
                <Button type="primary" @click="handleAction(row, 'edit')" icon="md-create" size="small" v-permission="'/v2/contacts/update'"></Button>
              </Tooltip>
              <Poptip @on-ok="handleAction(row.id, 'delete')" confirm title="您确认删除这条内容吗？" transfer>
                <Button size="small" icon="md-trash" :disabled="row.status == 'auditPass'" v-permission="'/v2/contacts/delete'"></Button>
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
    <Modal v-model="contactInfo.show" :title="`${contactInfo.type === 'add' ? '添加' : '编辑'}联系人`" width="550" @on-visible-change="(s) => {!s && closeModal('contactInfo')}">
      <Form ref="contactInfo" :model="contactInfo" :rules="contactInfo.rules" :label-width="100">
        <Row>
          <Col :md="24">
            <FormItem label="公司名称:" prop="formData.contractorId">
              <Select
                filterable
                v-model="contactInfo.formData.contractorId"
                :remote-method="debQueryCompany"
                :loading="contactInfo.queryLoading"
                @on-select="selectCompany"
                @on-query-change="companyKeyChange"
                :placeholder="contactInfo.formData.merchantName || '请输入公司名称'"
              >
                <Option v-for="(item, index) in companyList" :value="item.id" :label="item.merchantName" :key="index"></Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :md="12">
            <FormItem label="联系人姓名:" prop="formData.contactName">
              <Input v-model="contactInfo.formData.contactName"/>
            </FormItem>
          </Col>
          <Col :md="12">
            <FormItem label="联系人电话:" prop="formData.contactPhone">
              <Input v-model="contactInfo.formData.contactPhone"/>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :md="12">
            <FormItem label="联系人职务:" prop="formData.contactJob">
              <Input v-model="contactInfo.formData.contactJob"/>
            </FormItem>
          </Col>
          <Col :md="12">
            <FormItem label="客户阶段:">
              <Input :value="formatMerchantKindType(contactInfo.formData.merchantKind)" disabled/>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="closeModal('contactInfo')">取消</Button>
        <Button type="primary" :loading="contactInfo.btnLoading" @click="submitContact('contactInfo')">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import globalMixin from '~/plugins/mixin'
import mixin from './mixins'
export default {
  name: 'contacts',
  mixins: [globalMixin, mixin],
  data() {
    return {
      listData: {
        columns: [
          { type: 'selection', width: 60, align: 'center'},
          { 
            title: '公司名称',
            minWidth: 150,
            align: 'center',
            render: (h, params) => {
              return h('a', {
                on: {
                  'click': () => this.goToDetail(params.row.merchantKind, params.row.contractorId).init()
                }
              }, params.row.merchantName)
            }
          },
          {
            title: '客户阶段',
            minWidth: 120,
            align: 'center',
            render: (h, params) => {
              return h('span', this.formatMerchantKindType(params.row.merchantKind))
            }
          },
          { 
            title: '客户类型',
            minWidth: 120,
            align: 'center',
            render: (h, params) => h('span', this.formatMerchantType(params.row.merchantType))
          },
          { key: 'contactName', title: '联系人姓名', minWidth: 110, align: 'center'},
          { key: 'contactPhone', title: '联系人电话', minWidth: 130, align: 'center'},
          { key: 'contactJob', title: '联系人职务', minWidth: 120, align: 'center'},
          { key: 'createdBy', title: '创建人', minWidth: 110, align: 'center'},
          {
            title: '创建时间',
            minWidth: 140,
            align: 'center',
            render: (h, params) => {
              return h('span', this.formatDate(params.row.createdAt))
            }
          },
          { slot: 'action', title: '操作', minWidth: 100, align: 'center'},
        ],
        data: []
      },
      merchantKindList: [
        { value: 'leads', label: '销售线索'},
        { value: 'potential', label: '潜在客户'},
        { value: 'cooperation', label: '合作客户'},
      ],
      formData: {
        ownership: 'company'
      },
      checkList: [],
      companyList: [],
      pageProps: {
        page: 1,
        perPage: 10,
        currentPage: 1,
        totalCount: 0,
      },
      loadingTable: false,
      exportLoading: false,
      contactInfo: {
        show: false,
        queryLoading: false,
        btnLoading: false,
        type: '',
        formData: {
          id: undefined,
          contractorId: '',
          merchantName: undefined,
          contactName: '',
          contactPhone: '',
          contactJob: '',
          merchantKind: '',
        },
        rules: {
          'formData.contractorId': [{ required: true, message: '该项目不能为空', trigger: 'change' }],
          'formData.contactName': [{ required: true, message: '该项目不能为空', trigger: 'blur' }],
          'formData.contactPhone': [{ required: true, message: '请输入1-50个字符', trigger: 'blur', max: 50 }],
          'formData.contactJob': [{ required: false, message: '不可超过50个字符', trigger: 'blur', max: 50 }],
        }
      },
      debQueryCompany: this.$debonce(this.queryCompany, 500)
    }
  },
  methods: {
    async getList(type = '') {
      this.loadingTable = true
      let res, params = JSON.parse(JSON.stringify(this.formData))
      params.page = this.pageProps.page
      params.perPage = this.pageProps.perPage
      delete params.createDate
      if(type) {
        params.page = this.pageProps.page = 1
      }
      try {
        res = await this.$api.cooperativeContactsList(params)
        if (res.code === 0) {
          let data = res.data
          this.listData.data = data.list
          this.pageProps.totalCount = data.totalCount
          this.pageProps.currentPage = data.currentPage
          this.formData.ownership = data.ownership
          this.handleValidateDataPermissionRange(this, 'isGetDataPermissionRange', 'dataPermissionRange', data.ownership)
        }
        this.loadingTable = false
      } catch (err) {
        this.loadingTable = false
      }
    },

    async queryCompany(name) {
      if(!name.trim()) return
      let res, merchantKinds = ['leads', 'potential', 'cooperation']
      this.contactInfo.queryLoading = true
      try {
        res = await this.$api.cooperativeCustomerSearchPartner({ name, merchantKinds })
        if(res.code === 0) {
          this.contactInfo.queryLoading = false
          res.data.length != 0 ? this.companyList = res.data : ''
        }
      } catch (error) {
        this.contactInfo.queryLoading = false
      }
    },

    selectCompany(target) {
      target = target || {}
      // 过滤匹配的客户阶段
      this.contactInfo.formData.contractorId = target.value
      let temp = this.companyList.find(item => item.id === target.value)
      this.contactInfo.formData.merchantKind = temp.merchantKind
    },

    selectDate(date) {
      this.formData.createdStartAt = date[0] ? new Date(date[0] + ' 00:00:00').getTime() / 1000 : undefined
      this.formData.createdEndAt = date[1] ? new Date(date[1] + ' 23:59:59').getTime() / 1000 : undefined
    },

    submitContact(name) {
      this.$refs[name].validate(async (valid) => {
        if(valid) {
          this.contactInfo.btnLoading = true
          let res, params = JSON.parse(JSON.stringify(this.contactInfo.formData))
          delete params.merchantKind
          delete params.merchantName
          try {
            res = !params.id ? await this.$api.cooperativeContactsCreate(params) : await this.$api.cooperativeContactsUpdate(params)
            if(res.code === 0) {
              this.$Message.success('操作成功')
              this.contactInfo.btnLoading = false
              this.closeModal('contactInfo')
              this.getList()
            }
          } catch (err) {
            this.$Notice.error({
              title: err.code,
              desc: err.message
            })
            this.contactInfo.btnLoading = false
          }
        }
      })
    },
    
    async delContactInfo(id) {
      let res
      try {
        res = await this.$api.cooperativeContactsDelete({id})
        if(res.code === 0) {
          this.$Message.success('操作成功')
          this.getList()
        }
      } catch (err) {
        this.$Notice.error({
          title: err.code,
          desc: err.message
        })        
      }
    },

    handleAction(rowData, type) {
      if(type === 'edit') {
        this.openModal('contactInfo', type, rowData)
      } else if(type === 'delete') {
        this.delContactInfo(rowData)
      }
    },

    changePage(e) {
      this.pageProps.page = e
      this.getList()
    },
    
    changePageSize(e) {
      this.pageProps.perPage = e
      this.getList()
    },

    openModal(prop, type, data) {
      const fieldArr = ['id', 'contractorId', 'merchantName', 'contactName', 'contactPhone', 'contactJob', 'merchantKind']
      // 清空表单数据
      if(prop === 'contactInfo' && type === 'add') {
        fieldArr.forEach(item => this[prop].formData[item] = undefined)
      } else if(prop === 'contactInfo' && type === 'edit') {
        fieldArr.forEach(item => this[prop].formData[item] = data[item])
        this.$refs[prop].validate()
        data.merchantName && this.queryCompany(data.merchantName)
      }
      this[prop].type = type
      this[prop].show = true
    },

    async exportContact() {
      this.exportLoading = true
      let res, params = JSON.parse(JSON.stringify(this.formData))
      delete params.createDate
      try {
        res = await this.$api.contractorContactsExport(params)
        if(res.code === 0) {
          window.location.href = res.data.url
          this.$Message.success('操作成功')
          this.exportLoading = false
        }
      } catch (err) {
        this.$Notice.error({
          title: err.code,
          desc: err.message
        })
        this.exportLoading = false
      }
    },

    closeModal(prop) {
      this[prop].show = false
      this[prop].formData.contractorId = undefined
    },

    selectCheck(selection) {
      this.checkList = selection
    },

    companyKeyChange(query) {
      // 解决首次输入空格下拉框显示id
      if(!query.trim()) {
        this.contactInfo.formData.contractorId = ''
        return false
      }
    },

    goToDetail(state, id) {
      const obj = {
        status: '',
        state: {
          'leads': (id) => {
            this.$router.push({
              path: '/contract/development-partner-management/development-details',
              query: { id }
            })
          },
          'potential': (id) => {
            this.$router.push({
              path: '/contract/potential-customer/customer-detail',
              query: { id }
            })
          },
          'cooperation': (id) => {
            this.$router.push({
              path: '/contract/cooperative-customer/cooperative-detail',
              query: { id }
            })
          }
        },
        init: () => {
          return obj.state[obj.status](id)
        }
      }
      obj.status = state
      return obj
    },

    formatMerchantKindType(type) {
      let temp = ''
      switch(type) {
        case 'leads':
          temp = '销售线索'
          break;
        case 'potential':
          temp = '潜在客户'
          break;
        case 'cooperation':
          temp = '合作客户'
          break;
        default:
          break;
      }
      return temp
    },

    formatDate(time, type) {
      type = type || 'yyyy-MM-dd'
      return this.$format(time, type)
    },

  },
  activated() {
    const companyName = this.$route.query.companyName
    !!companyName && (this.formData.merchantName = companyName)
    this.getList()
  },
}
</script>

<style lang="less" scoped>
/deep/ .ivu-card-head {
  .ivu-input-wrapper {
    margin-bottom: 8px;
  }
  .ivu-select {
    margin-bottom: 8px;
  }
  .ivu-date-picker{
    display: inline-block;
    width: 200px;
    margin-bottom: 8px;
    vertical-align: middle;
    .ivu-input-wrapper {
      width: 100%;
      margin-bottom: 0;
    }
  }
}

.ivu-modal {
  .ivu-modal-content {
    .ivu-modal-body {
      h3 {
        font-size: 22px;
        text-align: center;
        margin-bottom: 15px;
      }
    }
  }
}

</style>