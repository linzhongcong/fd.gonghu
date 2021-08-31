<template>
  <div>
    <Card>
      <Row slot="title">
        <Col span="22" @keydown.native.enter.prevent="getList('new')">
          <Select class="mb-5" v-model="formData.ownership" placeholder="数据权限范围" @on-change="getList('new')">
            <Option v-for="(item, index) in dataPermissionRange" :value="item.value" :label="item.label" :key="'dataPer' + index"></Option>
          </Select>
          <Input v-model="formData.merchantName" clearable placeholder="公司名称"/>
          <Input v-model="formData.systemName" clearable placeholder="系统/门店名称"/>
          <Input v-model="formData.number" clearable placeholder="门店编号"/>
          <Input v-model="formData.name" clearable placeholder="门店名称"/>
          <Cascader :data="area" v-model="formData.area" @on-change="selectArea" change-on-select placeholder="省/市/区" ></Cascader>
          <Select v-model="formData.cityLevel" clearable placeholder="城市等级">
            <Option v-for="(item, index) in cityLevelOption" :key="index" :value="item.value" :label="item.label"></Option>
          </Select>
          <Input v-model="formData.followBy" clearable placeholder="零售负责人"/>
          <Select v-model="formData.merchantType" clearable placeholder="客户类型">
            <Option v-for="(item, index) in merchantTypeList" :key="index" :value="item.value" :label="item.label"></Option>
          </Select>
        </Col>
        <Col span="2">
          <Button type="primary" icon="ios-search" @click="getList('new')">搜索</Button>
        </Col>
        <Col span="24">
          <Button type="primary" @click="add" v-permission="'/v2/facade/create'">添加</Button>
          <Button type="primary" @click="openModal('distribution')" v-permission="'/v2/facade/allocate'">零售分配</Button>
          <Button type="primary" @click="openModal('takeBack')" v-permission="'/v2/facade/return'">收回</Button>
          <Button type="primary" @click="openModal('importing')" v-permission="'/v2/facade/import'">导入</Button>
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
                <Button type="primary" @click="handleAction(row.id, 'edit')" icon="md-create" size="small" v-permission="'/v2/facade/update'"></Button>
              </Tooltip>
              <Poptip @on-ok="handleAction(row.id, 'delete')" confirm title="您确认删除这条内容吗？" transfer>
                <Button size="small" icon="md-trash" :disabled="row.status == 'auditPass'" v-permission="'/v2/facade/delete'"></Button>
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
    <Modal v-model="takeBack.show" title="确认收回">
      <h3>收回后该门店无零售负责人</h3>
      <Form ref="takeBack" :model="takeBack" :label-width="100">
        <FormItem label="收回理由:" prop="formData.reason" :rules="[{required: true, message: '该项目不能为空', trigger: 'blur'}]">
          <Input v-model="takeBack.formData.reason" type="textarea"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="closeModal('takeBack')">返回</Button>
        <Button @click="modalSubmit(confirmTakeBack, 'takeBack', true)" type="primary" :loading="modalButtonLoading">提交</Button>
      </div>
    </Modal>
    <Modal v-model="distribution.show" title="分配负责人">
      <div class="ivu-table-wrapper">
        <div class="ivu-table ivu-table-small ivu-table-border">
          <div class="ivu-table-body">
            <table cellspacing="0" cellpadding="0" border="0" width="100%">
              <tbody class="ivu-table-tbody">
                <tr class="ivu-table-row">
                  <td class="head-bg w-300">
                    <div class="ivu-table-cell">零售负责人</div>
                  </td>
                  <td colspan="2">
                    <div class="ivu-table-cell">
                      <Select
                        v-model="distribution.formData.followIds"
                        multiple
                        filterable
                        :loading="distribution.loading"
                        :remote-method="queryWorker"
                        @on-change="handleOnchangeWorker"
                        placeholder="请输入员工姓名/工号"
                      >
                        <Option v-for="(item, index) in workerList" :value="item.id" :label="item.full_name" :key="index"></Option>
                      </Select>
                    </div>
                  </td>
                  </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button @click="closeModal('distribution')">返回</Button>
        <Button @click="modalSubmit(confirmDistribution)" type="primary" :loading="modalButtonLoading">提交</Button>
      </div>
    </Modal>
    <Modal v-model="importing.show" title="导入" width="430">
      <div class="import-content">
        <div class="import-template">
          <a href="javascript:;" @click="downloadTemplate">点击下载导入模板</a>
        </div>
        <Upload
          name="UploadForm[excel]"
          :data="{version: 'v2'}"
          :format="['xlsx']"
          :show-upload-list="false"
          :action="facadeImportUrl"
          :headers="fileUploadHeaders"
          :before-upload="importBeforeUpload"
          :on-success="importFileSuccess"
          :on-error="importFileError"
          :on-format-error="importFormatError"
        >
          <Button :loading="importing.loading" type="primary">选择导入的文件</Button>
        </Upload>
        <div style="height: 15px;"></div>
      </div>
      <div slot="footer">
        <div style="height: 5px;"></div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { SERVER_BASE_URL } from '~/api/config'
import Cookies from 'js-cookie'
import area from '~/plugins/area.js'
import globalMixin from '~/plugins/mixin'
import mixin from '../mixins'
export default {
  name: 'facade',
  mixins: [globalMixin, mixin],
  data() {
    return {
      area,
      facadeImportUrl: `${SERVER_BASE_URL}/v2/facade/import`,
      fileUploadHeaders: {
        Authorization: Cookies.get('authorization'),
      },
      listData: {
        columns: [
          { type: 'selection', width: 60, align: 'center'},
          { key: 'number', title: '门店编号', minWidth: 105, align: 'center'},
          { 
            title: '门店名称',
            minWidth: 130,
            align: 'center',
            render: (h, params) => {
              return h('a', {
                on: {
                  'click': () => {
                    this.$router.push({
                      path: '/contract/facade/detail',
                      query: {
                        id: params.row.id
                      }
                    })
                  }
                }
              }, params.row.name)
            }
          },
          { key: 'province', title: '省', minWidth: 100, align: 'center'},
          { key: 'city', title: '市', minWidth: 100, align: 'center'},
          { key: 'county', title: '区', minWidth: 100, align: 'center'},
          { key: 'address', title: '门店地址', minWidth: 180, align: 'center'},
          { 
            key: 'cityLevel',
            title: '城市等级',
            minWidth: 110,
            align: 'center',
            render: (h, params) => {
              let { cityLevel } = params.row
              return cityLevel ?
                      h('span', this.cityLevelOption[cityLevel].label) :
                      h('span', '')
            }
          },
          { 
            key: 'manageStatus',
            title: '经营状态',
            minWidth: 100,
            align: 'center',
            render: (h, params) => params.row.manageStatus === 'open' ? h('span', '在业') : h('span', '停业') 
          },
          { 
            title: '进驻品牌',
            minWidth: 120,
            align: 'center',
            render: (h, params) => h('span', params.row.inBrands.toUpperCase().replaceAll(',', '、'))
          },
          { key: 'followBy', title: '零售负责人', minWidth: 150, align: 'center'},
          { key: 'merchantName', title: '公司名称', minWidth: 200, align: 'center'},
          { key: 'systemName', title: '系统/门店名称', minWidth: 200, align: 'center'},
          { 
            title: '客户类型',
            minWidth: 100,
            align: 'center',
            render: (h, params) => h('span', this.formatMerchantType(params.row.merchantType))
          },
          { slot: 'action', title: '操作', minWidth: 100, align: 'center'},
        ],
        data: []
      },
      cityLevelOption: {
        first: { value: 'first', label: '一线城市' },
        newFirst: { value: 'newFirst', label: '新一线城市' },
        second: { value: 'second', label: '二线城市' },
        third: { value: 'third', label: '三线城市' },
        fourth: { value: 'fourth', label: '四线城市' },
        fifth: { value: 'fifth', label: '五线城市' },
      },
      formData: {
        ownership: 'company',
        area: []
      },
      checkList: [],
      workerList: [],
      pageProps: {
        page: 1,
        perPage: 10,
        currentPage: 1,
        totalCount: 0,
      },
      takeBack: {
        show: false,
        formData: {
          reason: '',
          version: 'v2'
        }
      },
      importing: {
        show: false,
        loading: false
      },
      distribution: {
        show: false,
        loading: false,
        formData: {
          followIds: [],
          version: 'v2'
        }
      },
      loadingTable: false,
      modalButtonLoading: false,
    }
  },
  methods: {
    async getList(type = '') {
      this.loadingTable = true
      let params = JSON.parse(JSON.stringify(this.formData))
      params.version = 'v2'
      params.page = this.pageProps.page
      params.perPage = this.pageProps.perPage
      delete params.area
      if(type) params.page = this.pageProps.page = 1
      try {
        let res = await this.$api.contractorTabShopInfo(params)
        if (res.code === 0) {
          let data = res.data
          this.listData.data = data.list
          this.pageProps.totalCount = data.totalCount
          this.pageProps.currentPage = data.currentPage
          this.formData.ownership = data.ownership
          this.handleValidateDataPermissionRange(this, 'isGetDataPermissionRange', 'dataPermissionRange', data.ownership)
        }
        this.loadingTable = false
      } catch (error) {
        this.loadingTable = false
      }
    },

    /**
     * 查询员工
     * @param {String} username: 查询关键词
     */
    async queryWorker(username) {
      this.distribution.loading = true
      try {
        let res = await this.$api.user({ username })
        const workerList = this.workerList,
          selectedIds = [ ...new Set(workerList.map(item => item.selected ? item.id : null)) ]
        this.workerList = [ ...workerList.filter(item => selectedIds.includes(item.id)), ...res.items.filter(item => !selectedIds.includes(item.id)) ]
        this.distribution.loading = false
      } catch (err) {
        this.distribution.loading = false
      }
    },

    /**
     * 零售负责人人选项发送变化
     * @param {Array} value: 当前选中项
     */
    handleOnchangeWorker(value) {
      this.workerList.forEach(item => item.selected = value.includes(item.id))
    },

    add() {
      this.$router.push('/contract/facade/edit')
    },
    
    async confirmTakeBack() {
      let params = JSON.parse(JSON.stringify(this.takeBack.formData))
      params.ids = this.checkList.map((item) => {
        return item.id
      })
      try {
        let res = await this.$api.contractorFacadeReturn(params)
        if(res.code === 0) {
          this.$Message.success('操作成功')
          this.modalButtonLoading = false
          this.closeModal('takeBack')
          this.getList()
        }
      } catch (err) {
        this.$Notice.error({
          title: err.code,
          desc: err.message
        })
        this.modalButtonLoading = false
      }
    },

    async confirmDistribution() {
      let params = JSON.parse(JSON.stringify(this.distribution.formData))
      if(!params.followIds.length) {
        this.modalButtonLoading = false
        return this.$Message.warning('请选择需要分配的员工')
      }
      params.ids = this.checkList.map((item) => item.id)
      try {
        let res = await this.$api.contractorFacadeAllocate(params)
        if(res.code === 0) {
          this.$Message.success('操作成功')
          this.modalButtonLoading = false
          this.closeModal('distribution')
          this.getList()
        }
      } catch (err) {
        this.modalButtonLoading = false
      }
    },

    selectArea(value, data) {
      ['province', 'city', 'county'].forEach((key, index) => this.formData[key] = data[index] && data[index].label)
    },

    async handleAction(id, type) {
      if(type === 'edit') {
        this.$router.push({
          path: '/contract/facade/edit',
          query: {
            id
          }
        })
      } else if(type === 'delete') {
        try {
          let res = await this.$api.contractorDelShopInfo({id, version: 'v2'})
          res.code === 0 && this.$Message.success('删除成功') && this.getList()
        } catch (err) {
          this.$Notice.error({
            title: err.code,
            desc: err.message
          })
        }
      }
    },

    changePage(e) {
      this.checkList = []
      this.pageProps.page = e
      this.getList()
    },
    
    changePageSize(e) {
      this.pageProps.perPage = e
      this.getList()
    },

    /**
     * 模态框提交按钮
     * @param {String} name: 注册的引用信息名字
     * @param {Function} callback: 一个回调函数
     * @param {Boolean} isForm: 是否开启表单验证，默认不开启
     */
    modalSubmit(callback, name, isForm = false) {
      this.modalButtonLoading = true
      if(isForm) {
        this.$refs[name].validate((valid) => {
          if(valid) {
            callback()
          }else {
            this.modalButtonLoading = false
          }
        })
      } else {
        callback()
      }
    },

    openModal(prop) {
      let checkList = this.checkList
      if(checkList.length === 0 && prop !== 'importing') return this.$Message.warning('请选择')
      // 清空表单数据
      switch (prop) {
        case 'takeBack':
          this.$refs.takeBack.resetFields()
          break
        case 'distribution':
          this.distribution.formData.followIds = []
          this.workerList = []
        default:
          break
      }
      this.modalButtonLoading = false
      this[prop].show = true
    },

    closeModal(prop) {
      this[prop].show = false
    },

    selectCheck(selection) {
      this.checkList = selection
    },

    importBeforeUpload(file) {
      this.importing.loading = true
    },

    importFileSuccess(res) {
      if(res.code === 0) {
        this.$Message.success('文件导入成功')
        this.importing.loading = false
        this.importing.show = false
        this.getList()
      }
      if(res.code === 301) {
        this.$Notice.error({
          title: '导入失败',
          desc: res.message,
          duration: 0
        })
        this.importing.loading = false
      }
    },

    importFileError(err, file, fileList) {
      this.$Notice.error({
        title: '导入失败',
        desc: file.message
      })
      this.importing.loading = false
    },

    importFormatError() {
      this.$Notice.error({
        title: '导入失败',
        desc: '请先下载导入模板再进行填写导入'
      })
    },
     
    async downloadTemplate() {
      try {
        let res = await this.$api.contractorTemplateShop({version: 'v2'})
        if(res.code === 0) {
          window.location.href = res.data.url
        }
      } catch (err) {
        this.$Notice.error({
          title: err.code,
          desc: err.message
        })
      }
    },
  },
  activated() {
    this.$route.query.companyName && (this.formData.merchantName = this.$route.query.companyName)
    this.checkList = []
    this.getList()
  }
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
  .ivu-cascader{
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

.import-content {
  text-align: center;
  .import-template {
    display: flex;
    justify-content: flex-end;
  }
}

.ivu-select-multiple {
  text-align: left;
}
</style>