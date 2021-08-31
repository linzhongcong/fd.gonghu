<template>
  <div>
    <Card>
      <div slot="title">
        <Row type="flex" justify="space-between"  @keydown.native.enter.prevent="getList('search')">
          <Col>
            <Select style="width: 160px;" v-model="searchData.ownership" placeholder="选择数据权限范围" @on-change="getList('search')">
              <Option v-for="(item, index) in dataPermissionRange" :value="item.value" :label="item.label" :key="'dataPer' + index"></Option>
            </Select>
            <Input v-model.trim="searchData.jobNumber" placeholder="请输入工号" style="width:150px"  clearable/>
            <Input v-model.trim="searchData.realName" placeholder="请输入姓名" style="width:150px" clearable/>
            <!-- <Select  v-model.trim="searchData.deptId" style="width: 180px" placeholder="请输入部门-中心" filterable  remote :remote-method="getDeptDebonce" :loading="loadingSelect" @on-change="getList('search')" clearable>
              <Option v-for="item in deptList" :key="item.id" :value="item.id" :label="item.deptname">
              </Option>
            </Select> -->
            <Select v-model.trim="searchData.jobStation" style="width: 180px" placeholder="请输入职位" filterable  remote :remote-method="getJobDebonce" :loading="loadingSelect" @on-change="getList('search')" clearable>
              <Option v-for="(item, index) in jobList" :key="index" :value="item.job_station" :label="item.job_station">
              </Option>
            </Select>
            <Input v-model.trim="searchData.offlineDeptName" placeholder="请输入系统部门" clearable />
            <Select  v-model.trim="searchData.resignAt" style="width: 100px" placeholder="员工状态" filterable @on-change="getList('search')" clearable>
              <Option v-for="(status, index) in jobStatusList" :key="index" :value="status.value" :label="status.label"/>
            </Select>
          </Col>
          <Col>
            <Button type="primary" icon="ios-search" @click="getList('search')">搜 索</Button>
          </Col>
        </Row>
        <Row type="flex" justify="space-between" class="row-style">
          <Col>
            <Button type="primary" @click="settingAble" v-permission="'/v2/employee/status'">禁用/启用</Button>
            <Button type="primary" :loading="exportBtnLoading" @click="handleExportDataClick" v-permission="'/v2/employee/export'">导出</Button>
          </Col>
        </Row>
      </div>
      <div>
        <Row>
          <Table border ref="selection" :columns="listData.columns" :data="listData.data" :loading="loadingTable" highlight-row @on-selection-change="getRow" size="small"></Table>
        </Row>
        <Row>
          <div style="padding: 20px 0">
            <div style="float: left">共 {{pageProps.total}} 条</div>
            <div style="float: right">
              <Page :total="pageProps.total" :current="pageProps.page" size="small" show-elevator show-sizer @on-change="changePage" @on-page-size-change="changePageSize"/>
            </div>
          </div>
        </Row>
      </div>
    </Card>
    
    <!-- 编辑弹窗 -->
    <Modal v-model="editModal" title="编辑" width="1000" @on-cancel="handleReset('editData')">
      <div class="div-modal">
        <Form ref="editData" :model="editData" :rules="ruleEditData" label-position="top" >
          <Row>
            <Col :md="6" :xs="24">
              <FormItem label="员工工号：">
                <Input v-model.trim="editData.username" disabled/>
              </FormItem>
            </Col>
            <Col :md="6" :xs="24">
              <FormItem label="员工姓名：">
                <Input v-model.trim="editData.realName" disabled/>
              </FormItem>
            </Col>
            <Col :md="6" :xs="24">
              <FormItem label="部门-中心：" prop="deptName">
                <Select v-model.trim="editData.deptName" placeholder="请输入部门-中心" filterable  remote :remote-method="getDeptDebonce" :loading="loadingSelect" v-if="selectShow" clearable>
                  <Option v-for="item in deptList" :key="item.id" :value="item.deptname" :label="item.deptname">
                  </Option>
                </Select>
              </FormItem>
            </Col>
            <Col :md="6" :xs="24">
              <FormItem label="职位：" prop="jobStation">
                <Select  v-model.trim="editData.jobStation" placeholder="职位" filterable  remote :remote-method="getJobDebonce" :loading="loadingSelect" v-if="selectShow" clearable>
                  <Option v-for="item in jobList" :key="item.id" :value="item.job_station" :label="item.job_station">
                  </Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :md="6" :xs="24">
              <FormItem label="联系方式：" prop="telephone">
                <Input v-model.trim="editData.telephone" number/>
              </FormItem>
            </Col>
            <Col :md="6" :xs="24">
              <FormItem label="微信号：">
                <Input v-model.trim="editData.weChatNum" />
              </FormItem>
            </Col>
            <Col :md="12" :xs="24">
              <FormItem label="个人简介：">
                <Input v-model.trim="editData.profile" />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :md="6" :xs="24">
              <FormItem label="在职情况：">
                <Input :value="editData.resignAt > 0 ? '离职' : '在职'" disabled/>
              </FormItem>
            </Col>
            <Col :md="6" :xs="24">
              <FormItem label="启用：">
                <Input :value="editData.canCheckin > 0 ? '启用' : '禁用'" disabled/>
              </FormItem>
            </Col>
            <Col :md="12" :xs="24">
              <FormItem label="头像" prop="headPhoto" class="upload" >
                <div class="demo-upload-list"  v-for="(item, index) in uploadList" :key="index">
                  <template v-if="item.url !=''">
                    <img :src="baseUrl + item.url" class="imgUpload" :hide="hidden">
                    <div class="demo-upload-list-cover">
                      <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                    </div>
                  </template>
                </div>
                <Upload ref="prepareFileUpload"
                        name="UploadForm[file]"
                        :default-file-list="headPhoto"
                        :on-success="coaSuccess"
                        :on-remove="filePrepareRemove"
                        :on-format-error="fileFormatError"
                        :max-size="51200"
                        :on-exceeded-size="fileMaxSize"
                        type="drag"
                        :action="fileUploadURL"
                        :headers="fileUploadHeaders"
                        :before-upload="fileBeforeUpload"
                        :show-upload-list="false"
                        style="display: flex">
                  <div class="breadth header">
                    <Icon type="md-add" size="20"></Icon>
                  </div>
                </Upload>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleSubmit('editData')" :loading="saveBtnLoading">保 存</Button>
      </div>
      <Spin  size="large" fix v-if="spinShow"></Spin>
    </Modal>

    <!-- 禁用/启用 -->
    <Modal
    v-model="Prohibitmodel"
    title="禁用/启用"
    :loading="true"
    @on-ok="okButton(checkList.canCheckin)"
    @on-cancel="Prohibitmodel  = false">
      <p>
        当前状态为：{{ checkList.canCheckin > 0 ? '启用' : '禁用' }}，
        <span> 是否{{ checkList.canCheckin  === '1' ? '禁用' : '启用' }}？</span>
      </p>
    </Modal>
  </div>
</template>
<script>
  import {SERVER_BASE_URL} from '~/api/config'
  import Cookies from 'js-cookie'
  import globalMixin from '~/plugins/mixin'
  export default {
    name: 'employee-file',
    mixins: [globalMixin],
    data() {
      return {
        exportBtnLoading: false,
        saveBtnLoading: false,
        saveLoading: false,
        spinShow: false,
        notFoundText: '无匹配数据',
        Prohibitmodel:false,
        baseUrl: `${SERVER_BASE_URL}/`,
        fileUploadURL: `${SERVER_BASE_URL}/v1/upload`,
        // fileTargetUploadURL: `${SERVER_BASE_URL}/v1/employee/import-target`,
        fileUploadHeaders: {
          Authorization: Cookies.get('authorization')
        },
        uploadList: [],
        hidden:true,
        headPhoto:[],
        loadingTable: false,
        loadingSelect: false,
        editModal: false,
        selectShow: false,
        pageProps: {
          total: 10,
          page: 1,
          perPage: 10
        },
        ableData: {
          id: '',
          isDisable: ''
        },
        checkList:[],
        searchData: {
          ownership: 'company',
          jobNumber: '',
          realName: '',
          deptId: '',
          jobId: '',
          resignAt: '',
          jobStation: '',
        },
        editData: {
          loading: false
        },
        jobList: [],
        deptList: [],
        listData: {
          columns: [
            { type: 'selection', align: 'center', width: 60, fixed: 'left'},
            { title: '工号', key: 'username', align: 'center', width: 120, fixed: 'left' },
            {
              title: '姓名',
              key: 'realName',
              align: 'center',
              width: 120,
              fixed: 'left',
              render: (h, params) => {
                return h('span', {
                  style: {
                    color: '#2d8cf0',
                    cursor: 'pointer'
                  },
                  on: {
                    'click': () => {
                      this.$router.push({
                        path: '/employee-management/file-details',
                        query: { id: params.row.id, username: params.row.username }
                      })
                    }
                  }
                }, params.row.realName)
              }
            },
            // { title: '部门-中心', key: 'deptName', align: 'center', minWidth: 200 },
            { title: '系统部门', key: 'offlineDeptName', align: 'center', minWidth: 200 },
            { title: '职位', key: 'jobStation', align: 'center', minWidth: 140 },
            { title: '联系方式', key: 'telephone', align: 'center', minWidth: 200 },
            { 
              title: '员工状态',
              key: 'resignAt',
              align: 'center',
              width: 110,
              render: (h, params) => h('span', params.row.resignAt > 0 ? '离职' : '在职')
            },
            { 
              title: '系统状态',
              key: 'canCheckin',
              align: 'center',
              width: 110,
              render: (h, params) => h('span', params.row.canCheckin > 0 ? '启用' : '禁用')
            },
            {
              title: '操作',
              key: 'do',
              align: 'center',
              width: 100,
              fixed: 'right',
              render: (h, params) => {
                return h('div', [
                  h('Tooltip', {
                    props: {
                      content: '编辑',
                      placement: 'top'
                    }
                  }, [
                    h('Button', {
                      props: {
                        type: 'primary',
                        icon: 'md-create',
                        size: 'small'
                      },
                      style: {
                        marginRight: '3px'
                      },
                      directives: [
                        {
                          name: 'permission',
                          value: '/v2/employee/update'
                        }
                      ],
                      on: {
                        'click': () => {
                          this.selectShow = false;

                          setTimeout(()=>{
                            this.selectShow = true
                          })
                          this.spinShow = true
                          this.editModal = true
                          this.editData = JSON.parse(JSON.stringify(params.row));
                          this.editData.telephone = parseInt(this.editData.telephone)
                          this.$api.getEmployeeFilesDetail({id:params.row.id})
                          .then((res) =>{
                            if (res.code === 0) {
                              let data = res.data
                              this.spinShow = false
                              this.editData.target = data.target
                              this.editData.profile = data.profile
                              if (data.photo && data.photo.url) {
                                this.uploadList = [
                                  data.photo
                                ]
                              }
                            }
                          })
                        }
                      }
                    })
                  ]),
                  h('Poptip', {
                    props: {
                      confirm: true,
                      title: '您确认删除这条内容吗？',
                      transfer: true
                    },
                    on: {
                      'on-ok': () => {
                        let param = {
                          id: params.row.id
                        }
                        this.loadingTable = true
                        this.$api.deletEemployeeFile(param).then((res) => {
                          if (res.code === 0) {
                            this.$Message.success('删除成功')
                            this.getList()
                          }
                        })
                      }
                    }
                  },[
                    h('Button', {
                      props: {
                        icon: 'md-trash',
                        size: 'small',
                        disabled: params.row.resignAt > 0 ? false : true
                      },
                      directives: [
                        {
                          name: 'permission',
                          value: '/v2/employee/delete'
                        }
                      ]
                    })
                  ])
                ])
              }
            }
          ],
          data: []
        },
        selectioned: [],
        jobStatusList: [
          { value: 0, label: '在职' },
          { value: 1, label: '离职' },
        ],
        ruleEditData: {
          deptName: [
            { required: true, message: '部门-中心不能为空', trigger: 'change' }
          ],
          jobStation: [
            { required: true, message: '职位不能为空', trigger: 'change' }
          ],
          telephone: [
            { required: true, type:'number', message: '请填写正确的联系方式', trigger: 'blur' }
          ],
          target: { required: true, message: '目标不能为空', trigger: 'blur' }
        },
        getDeptDebonce:this.$debonce(this.getDept,500),
        getJobDebonce:this.$debonce(this.getJob,500),
        // getSystemDeptDeb:this.$debonce(this.getSystemDept,500)
      }
    },
    activated() {
      // 此处需要修改 -- 由通知过来会有问题
      if(this.$route.query.id_collect){
        this.searchData.id_collect=this.$route.query.id_collect||''
      }else{
        this.searchData.id_collect=''
      }
      this.getList()
    },

    methods: {

      handleRemove (file) {
        const fileList = this.uploadList;
        const filelistAfter = this.headPhoto
        let obj = this.uploadList.splice(fileList.indexOf(file), 1);
        let objs = this.headPhoto.splice(filelistAfter.indexOf(file), 1);
      },

      // 文件上传限制
      fileMaxSize (file) {
        this.$Notice.warning({
          title: '超出文件大小限制',
          desc: '文件 ' + file.name + ' 太大，不能超过 50M。'
        });
      },

      // 文件格式验证失败
      fileFormatError (file) {
        this.$Notice.error({
          title: '文件格式错误',
          desc: '请上传正确的文件格式!'
        });
      },

      coaSuccess (res, file) {
        // 上传成功
        this.isShowProgress = false;
        if (res.status) {
          let data = res.data;
          this.headPhoto.push(data);
          this.uploadList.push(data);
        }
      },

      fileBeforeUpload (){
        const check = this.uploadList.length < 1;
        if (!check) {
          this.$Notice.warning({
            title: '只能上传一张图片'
          });
        }
        return check;
      },

      // 移除附件文件
      filePrepareRemove (file) {
        const fileList = this.headPhoto;
        let obj = this.headPhoto.splice(fileList.indexOf(file), 1);
      },

      // 改变页码
      changePage (e) {
        this.pageProps.page = e
        this.getList()
      },

      // 改变每页显示数
      changePageSize (e) {
        this.pageProps.perPage = e
        this.getList()
      },

      // 获取职位
      getJob (query) {
        this.loadingSelect = true
        if(query){
          let params = {}
          params.jobStation = query
          this.$api.employeeFilesGetJob(params)
            .then((res) => {
              if(res.code == 0){
                this.jobList = res.data
              }
            })
        }
        this.loadingSelect = false
      },

      // 获取部门
      getDept (query) {
        this.loadingSelect = true
        if(query){
          let params = {}
          params.deptName = query
          this.$api.employeeFilesGetDept(params).then((res) => {
            if(res.code == 0){
              this.deptList = res.data
            }
          })
        }
        this.loadingSelect = false
      },

      getDeptId (value) {
        this.deptList.map((items) => {
          if(items.deptname == value){
            this.editData.deptId = items.id
          }
        })
      },

      getJobId (value) {
        this.jobList.map((items) => {
          if(items.job_station == value){
            this.editData.jobId = items.id
          }
        })
      },

      getList (type) {
        if(type == 'search'){
          this.pageProps.perPage = 10
          this.pageProps.page = 1
        }
        let params = this.searchData
        // 清除select后，给默认值
        if(typeof params.resignAt !== 'number'){
          params.resignAt = ''
        }
        if(!params.jobStation){
          params.jobStation = ''
        }
        if(!params.deptId){
          params.deptId = ''
        }
        if(!params.role){
          params.role = ''
        }
        params.perPage = this.pageProps.perPage
        params.page = this.pageProps.page
        this.loadingTable = true
        this.$api.getEmployeeFilesList(params).then((res)=>{
          if (res.code === 0) {
            let data = res.data
            this.listData.data = data.list
            this.pageProps.page = data.currentPage
            this.pageProps.perPage = data.perPage
            this.pageProps.total = data.totalCount
            this.searchData.ownership = data.ownership
            this.handleValidateDataPermissionRange(this, 'isGetDataPermissionRange', 'dataPermissionRange', data.ownership)
          }
        }).finally(() => {
          this.loadingTable = false
        })
      },
      // 获取当行数据
      getRow (selection) {
        this.selectioned = selection
      },
      // 选择操作
      selectionOper() {
        let selectioned = this.selectioned
        if(selectioned.length === 0) return '请选择'
        if(selectioned.length > 1) return '请选择一项操作'
        let currentRow = selectioned[0]
        this.checkList = currentRow
        this.ableData.id = currentRow.id
        this.ableData.isDisable = currentRow.canCheckin
      },
      // 启用或禁用
      settingAble () {
        let msg = this.selectionOper()
        if(msg) return  this.$Message.warning(msg)
        this.Prohibitmodel = true
      },

      // 导出
      handleExportDataClick() {
        this.exportBtnLoading = true
        let params = JSON.parse(JSON.stringify(this.searchData))
        this.$api.exportEmployeelFile(params).then(res => {
          if (res.code === 0) {
            let url = res.data.url
            let a = document.createElement('a')
            let name = url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'))
            a.href = url
            a.download = name
            a.click()
            a.remove()
          } else {
            this.$Message.error('导出失败')
          }
        }).finally(() => {
          this.exportBtnLoading = false
        })
      },

      okButton (status) {
        let params = JSON.parse(JSON.stringify(this.ableData))
        this.$api.setEmployeeFilesStatus(params).then((res) => {
          if(res.code == 0){
            this.$Message.success(`${status === '1' ? '禁用' : '启用'}成功！`)
            this.getList()
          }
        }).finally(() => {
          this.ableData.id = ''
          this.ableData.isDisable = ''
          this.Prohibitmodel = false
        })
      },

      // 编辑
      editSubmit () {
        
        this.getJobId(this.editData.jobStation)
        this.getDeptId(this.editData.deptName)
        let params = JSON.parse(JSON.stringify(this.editData))
        params.photo = this.uploadList
        this.$api.updateEmployeeFilesUpdate(params).then((res) => {
          if (res.code === 0) {
            this.$Message.success('编辑成功');
            this.editModal = false
            this.uploadList = [] // 清空上一次上传的图片
            this.handleReset('editData')
            this.getList()
          }
        })
        .finally(() => {
          this.spinShow = false
          this.saveBtnLoading = false
        })
      },

      //校验
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.saveBtnLoading = true
            this.editSubmit()
          } else {
            this.$Message.error('请填写信息!')
          }
        })
      },

      // 重置
      handleReset (name) {
        this.$refs[name].resetFields()
        this.editData = {}
        this.uploadList = []
      },
    },
    
    watch:{
      $route:{
        deep: true,
        handler:function(newVal,oldVal){
          if(oldVal.name == newVal.name && Object.keys(newVal.query)){
              this.searchData = {} 
              this.getList()
          }
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .row-style{
    margin-top: 10px;
  }
  .div-modal{
    padding: 30px 25px 20px 5px;
  }

  .upload /deep/ .ivu-form-item-content{
    display:flex
  }
  .header {
    padding: 12px 17px 12px 17px;
    line-height: 32px;
  }
  .ivu-upload-list {
    display: flex;
  }
  .imgUpload {
    width:60px;
  }
  .demo-upload-list{
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 4px;
  }
  .demo-upload-list img{
    width: 100%;
    height: 100%;
  }
  .demo-upload-list-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
  }
  .demo-upload-list:hover .demo-upload-list-cover{
    display: block;
  }
  .demo-upload-list-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }

  .review-table{
    text-align: center;
    border-collapse:collapse;
    width: 100%;
    table-layout: fixed;
    tr{
      td{
        border: 1px #dcdee2 solid;
        height: 45px;
        padding: 0 10px;
        width: 215px;
      }
      .table-title{
        width: 100px;
        background: #f8f8f9;
      }
    }
  }

  .target-modal-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 180px;
    .download-btn {
      color: #00a1e9;
    }
    .import-btn {
      margin-top: 50px;
    }
    .upload-wrap {
      display: flex;
      flex-direction: column;
    }
  }
</style>
