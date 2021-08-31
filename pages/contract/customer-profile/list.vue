<template>
  <div>
    <Card>
      <Form slot="title" inline >
        <Row type="flex" justify="space-between" @keydown.native.enter.prevent="changeInp">
          <Col span="24">
            <!-- 商家名称 --> 
            <FormItem>
              <Input placeholder="请输入商家名称" v-model="client.search.merchant_name" clearable/>
            </FormItem>
            <!-- 商家类型 -->
            <FormItem >
              <Select v-model="client.search.merchant_type" placeholder="商家类型" @on-change="changeMerchantList">
                <Option v-for="item in merchantTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <!-- 门店等级 -->
            <FormItem>
              <Select v-model="client.search.facade_level" placeholder="门店等级" @on-change="changeLevelList">
                <Option v-for="item in shopLevelList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <!-- 门店名称 -->
            <FormItem>
              <Input v-model="client.search.name" placeholder="请输入门店名称" clearable/>
            </FormItem>
            <!-- 业务员 -->
            <FormItem>
              <Input v-model="client.search.salesman_name" placeholder="请输入业务员姓名" clearable/>
            </FormItem>
            <!-- 所属团队 -->
            <FormItem>
              <Input v-model="client.search.team_name" placeholder="请输入所属团队姓名" clearable/>
            </FormItem>
             <!-- 创建时间 -->
            <FormItem>
              <DatePicker :value="client.selectDate" type="daterange" split-panels placeholder="创建时间" @on-change="changeDate" style="width: 200px">
              </DatePicker>
            </FormItem>
            <Button type="primary" icon="ios-search" @click="changeInp" >查询</Button>
          </Col>
        </Row>

        <Row type="flex" justify="space-between"  >
          <Col span="24">
            <Button type="primary" @click="getAllot" >分配</Button>
            <Button type="primary" @click="tapDownload" >下载导入模板</Button>
            <Upload
              type="select"
              name="UploadForm[excel]"
              accept=".xls, .xlsx"
              :format="['xls','xlsx']"
              :max-size="51200"
              :headers="fileUploadHeaders"
              :action="fileUploadURL"
              :show-upload-list="false"
              :on-success="upLoadSuccess"
              :on-on-error="upLoadError"
              :on-progress="upLoadProgress"
              :on-exceeded-size="upLoadFileSize"
              :on-format-error="upLoadFormatErr"
            >
              <Button type="primary">导入</Button>
            </Upload>
            <Progress
              :stroke-width="5"
              v-show="client.upLoad.isShow"
              :percent="client.upLoad.percent"
            >
            </Progress>
          </Col>
        </Row>
      </Form>

      <div>
        <Row>
          <Table
            border
            ref="clientSelect"
            :loading="loading"
            :columns="client.columns"
            :data="client.list" >
            <template slot-scope="{ row, index }" slot="operate" >
              <Button type="info" size="small" ghost style="font-size: 15px; line-height: 100%;" v-if="row.enable_status === '启用'" @click="voidSwitch(index, row.contractor_id)" >
                <Icon type="ios-eye" />
              </Button>

              <Button size="small" style="font-size: 15px; line-height: 100%;" v-if="row.enable_status !== '启用'"  @click="voidSwitch(index, row.contractor_id)" >
                <Icon type="ios-eye-off-outline" />
              </Button>

              <Button type="primary" size="small" @click="getEdit(index, row.id)">
                <Icon type="md-create"/>
              </Button>
            </template>
          </Table>
          <div class="page-box">
            <div class="pages-L">共 {{ client.total }} 条</div>
            <div class="pages-r">
              <Page
                show-sizer
                show-elevator
                :total="client.total"
                :current="client.search.page"
                :page-size-opts="[10, 20, 30, 40]"
                @on-change="changePage"
                @on-page-size-change="changePageSize">
              </Page>
            </div>
          </div>
        </Row>
      </div>
    </Card>

    <!-- 分配弹窗 -->
    <Modal
      class="modal-tab"
      title="分配业务员"
      cancel-text="返回"
      @on-ok="postAllot"
      @on-cancel="clearAllot"
      v-model="allotData.isShow">
        <div class="ivu-table-wrapper">
          <div class="ivu-table ivu-table-samll ivu-table-border">
            <div class="ivu-table-body">
              <table cellspacing="0" cellpadding="0" border="0" width="100%">
                <tbody>
                  <tr>
                    <td class="td-left" >商家名称</td>
                    <td><span v-text="allotData.name"></span></td>
                  </tr>
                  <tr>
                    <td class="td-left">负责员工</td>
                    <td>
                      <Select
                        filterable remote
                        v-model="allotData.username"
                        :remote-method="getUser"
                        @on-change="selectUser"
                        placeholder="请输入员工姓名或工号"
                      >
                        <Option
                          v-for="option in allotData.userList"
                          :key="'user'+ option.id"
                          :value="option.username"
                          :label="`${option.real_name} / ${option.username}`"
                        >
                        </Option>
                      </Select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
    </Modal>

    <!-- 编辑弹窗 -->
    <Modal
      class="modal-tab"
      width="60"
      title="编辑商家"
      cancel-text="返回"
      @on-ok="postShop"
      @on-cancel="clearShop"
      v-model="shopEdit.isShow">
        <div class="ivu-table-wrapper">
          <div class="ivu-table ivu-table-samll ivu-table-border">
            <div class="ivu-table-body">
              <table cellspacing="0" cellpadding="0" border="0" width="100%">
                <tbody>
                  <tr>
                    <td class="td-left">商家名称</td>
                    <td><Input placeholder="请输入商家名称" v-model="shopEdit.info.merchant_name" /></td>
                    <td class="td-left" >商家类型</td>
                    <td>
                      <Select v-model="shopEdit.info.merchant_type" placeholder="商家类型" @on-change="changeMerchant" >
                        <Option v-for="item in merchantTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                      </Select>
                    </td>
                  </tr>
                  <tr>
                    <td class="td-left" >门店名称</td>
                    <td><Input placeholder="请输入门店名称" v-model="shopEdit.info.name" @on-change="changeLevel" /></td>
                    <td class="td-left" >门店等级</td>
                    <td>
                      <Select v-model="shopEdit.info.facade_level" placeholder="门店等级">
                        <Option v-for="item in shopLevelList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                      </Select>
                    </td>
                  </tr>
                  <tr>
                    <td class="td-left">备注</td>
                    <td rowspan="1" colspan="3">
                      <Input v-model="shopEdit.info.remark" type="textarea" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
    </Modal>
  </div>
</template>

<script>
  import PROVINCE from '~/plugins/area';
  import Cookies from 'js-cookie'
  import {SERVER_BASE_URL} from '~/api/config';

  export default {
    name: 'customer-profile',
    data() {
      return {
        loading: false,
        // 客户档案
        client: {
          // 查询条件
          search: {
            page: 1,
            perPage: 10,
            merchant_name: '',
            merchant_type: '',
            facade_level: '',
            name: '',
            salesman_name: '',
            start_time: '',
            end_time: '',
            team_name: ''
          },
          // 表头设置
          columns: [
            { width: '60', type: 'selection', align: 'center' },
            { title: '序号', type: 'index', align: 'center', width: '70' },
            { title: '商家名称', key: 'merchant_name', align: 'center',
              render: (h, params) => {
                return h('a', {
                  on: {
                    click: () => {
                      this.$router.push({
                        path: '/contract/customer-profile/info',
                        query: { id: params.row.id }
                      })
                    }
                  }
                }, params.row.merchant_name)
              }
            },
            { title: '商家类型', key: 'merchant_type', align: 'center', width: '70' },
            { title: '门店名称', key: 'name', align: 'center' },
            { title: '门店地址', key: 'address', align: 'center', width: '400' },
            { title: '门店等级', key: 'facade_level', align: 'center', width: '70' },
            { title: '创建人', key: 'created_by', align: 'center' },
            { title: '创建时间', key: 'created_at', align: 'center' },
            { title: '员工工号', key: 'salesman_username', align: 'center' },
            { title: '业务员', key: 'salesman_name', align: 'center' },
            { title: '所属团队', key: 'team_name', align: 'center' },
            { title: '备注', key: 'remark', align: 'center' },
            { title: '操作', slot: 'operate', align: 'center' },
          ],
          // 列表数据
          list: [],
          // 数据总数
          total: 0,
          // 被选中数据
          selectList: [],
          selectDate: [],
          // 上传状态
          upLoad: {
            isShow: false,
            percent: 0,
          }
        },
        // 商家类型
        merchantTypeList: [
          { value: '', label: '商家类型' },
          { value: 'cs', label: 'CS' },
          { value: 'ka', label: 'KA' },
          { value: 'otc', label: 'OTC' },
          { value: 'store', label: '便利店' },
          { value: 'other', label: '其他' }
        ],
        // 门店等级
        shopLevelList: [
          { value: '', label: '门店等级' },
          { value: 's', label: 'S' },
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
          { value: 'c', label: 'C' },
          { value: 'd', label: 'D' }
        ],
        // 分配弹窗设置
        allotData: {
          isShow: false,
          name: '',
          username: '',
          selectList: [],
          userList: [],
          info: {
            id: '',
            salesman_username: ''
          }
        },
        // 编辑弹窗设置
        shopEdit: {
          isShow: false,
          id: '',
          info: {
            merchant_name: '',
            merchant_type: '',
            facade_level: '',
            name: '',
            address: '',
            remark: ''
          }
        },
        // 模糊查询防抖设置
        queryUserDebonce: this.$debonce(this.getUser, 500),
        // 请求头设置
        fileUploadHeaders: {
          Authorization: Cookies.get('authorization')
        },
        // 上传路径
        fileUploadURL: `${SERVER_BASE_URL}/v1/customer-profile/customer-profile-import`,
      }
    },
    methods: {
      init() {
        this.changeInp()
      },

      // 模板下载
      tapDownload() {
        this.$api.customerExportDownload()
          .then(res => {
            if(res.code === 0) {
              location.href = res.data[0];
              this.$Message.success(res.message);
            }
            else {
              this.$Message.warning(res.message);
            }
          })
          .catch(err => {
            this.$Message.warning(err.message);
          })
      },

      // 文件上传 - 成功
      upLoadSuccess(res, file) {
        this.client.upLoad.isShow = false;
        // 上传状态判断
        if(res.code === 0) {
          this.$Message.success(res.message);
          this.client.upLoad.percent = 0;
          this.changeInp();
        }
        else {
          this.$Message.error(res.message);
          this.client.upLoad.percent = 0;
        }
      },

      // 文件上传 - 失败
      upLoadError(err, file) {
        this.$Message.error(err.message);
        this.client.upLoad.percent = 0;
      },

      // 文件上传 - 进度
      upLoadProgress(event, file) {
        this.client.upLoad.percent = 0;
        this.client.upLoad.isShow = true;
        setTimeout(() => {
          if (file.status === 'fail') {
            this.$Notice.error({
              title: '文件异常!'
            });
          }
        }, 1000);
        if (file.percentage === 100) {
          this.client.upLoad.isShow = false;
          this.client.upLoad.percent = 0;
        }
        this.client.upLoad.percent = event.percent;
      },

      // 文件上传 - 文件大小限制
      upLoadFileSize(file) {
        this.$Notice.warning({
          title: '超出文件大小限制',
          desc: '文件 ' + file.name + ' 太大，不能超过 50M。'
        });
        this.client.upLoad.percent = 0;
      },

      // 文件上传 - 格式验证
      upLoadFormatErr(file) {
        this.$Notice.error({
          title: '文件格式错误',
          desc: JSON.stringify(file)
        });
        this.client.upLoad.percent = 0;
      },

      // 重置列表
      changeInp() {
        this.client.upLoad.percent = 0;
        this.client.search.page = 1;
        this.client.search.perPage = 10;
        this.getList();
      },

      // 获取列表数据
      getList() {
        this.loading = true;
        let params = this.client.search;
        for(let i in params) {
          if(!!params[i] === false) {
            delete params[i]
          }
        }
        this.$api.contractorProfileList(params)
          .then(res => {
            this.client.list = res.items;
            this.client.total = res._meta.totalCount;
            this.loading = false;
          })
          .catch(err => {
            this.client.list = [];
            this.client.total = 0;
            this.loading = false;
          })
      },

      // 作废开关
      voidSwitch(index, id) {
        this.loading = true;
        let params = {
          id: id
        }
        this.$api.customerEnable(params)
          .then(res => {
            this.client.list[index].enable_status = this.client.list[index].enable_status === '启用' ? '作废' : '启用';
            this.$Message.success(res.message);
            this.loading = false;
          })
          .catch(err => {
            this.$Message.error(res.message);
            this.loading = false;
          })
      },

      // 切换页
      changePage(e) {
        this.client.search.page = e;
        this.getList();
      },

      // 切换页数
      changePageSize(e) {
        this.client.search.perPage = e;
        this.getList();
      },

      // 时间选择
      changeDate(date) {
        this.client.search.start_time = date[0];
        this.client.search.end_time = date[1];
        this.client.selectDate = date;
        this.changeInp()
      },

      // 下拉选择切换 - 列表
      // 商家类型
      changeMerchantList(e) {
        this.client.search.merchant_type = e;
        this.changeInp();
      },

      // 门店等级
      changeLevelList(e) {
        this.client.search.facade_level = e;
        this.changeInp()
      },

      // 下拉选择 - 弹窗
      // 商家类型
      changeMerchant(e) {
        this.shopEdit.info.merchant_type = e;
      },

      // 门店等级
      changeLevel(e) {
        this.shopEdit.info.facade_level = e;
      },

      // 分配设置
      getAllot() {
        this.client.selectList = this.$refs.clientSelect.getSelection();
        if(this.client.selectList.length > 1) {
          this.$Notice.error({
            title: '每次只可分配一个客户哦',
          });
          return false;
        }

        if(this.client.selectList.length === 0) {
          this.$Notice.error({
            title: '请选择',
          });
          return false;
        }

        this.allotData.name = this.client.selectList[0].merchant_name;
        this.allotData.info.id = this.client.selectList[0].contractor_id;

        this.allotData.isShow = true;

        console.log(this.client.selectList)
      },

      // 提交分配
      postAllot() {
        let params = this.allotData.info;
        this.$api.customerAssign(params)
          .then(res => {
            this.$Message.success(res.message);
            this.changeInp();
          })
          .catch(err => {
            this.$Message.error(err.message);
            this.changeInp();
          })
      },

      // 关闭分配弹窗
      clearAllot() {
        this.allotData.name = '';
        this.allotData.username = '';
        this.allotData.userList = [];
        this.allotData.info.id = '';
        this.allotData.info.salesman_username = '';
        this.allotData.isShow = false;
      },

      // 编辑弹窗
      getEdit(index, id) {
        let thisData = this.client.list[index]
        this.shopEdit.id = id;
        this.shopEdit.info = {
          merchant_name: thisData.merchant_name,
          name: thisData.name,
          address: thisData.address,
          remark: thisData.remark
        }
        this.merchantTypeList.forEach(item => {
          if(thisData.merchant_type === item.label) {
            this.shopEdit.info.merchant_type = item.value;
          }
        })
        this.shopLevelList.forEach(item => {
          if(thisData.facade_level === item.label) {
            this.shopEdit.info.facade_level = item.value;
          }
        })

        this.shopEdit.isShow = true;
      },

      // 员工搜索
      getUser(){
        let params = {
          username: this.allotData.username
        }
        this.$api.salesmanData(params)
          .then(res => {
            this.allotData.userList = res.data;
          })
          .catch(err => {
            this.allotData.userList = [];
          })
      },

      // 员工选择
      selectUser(e) {
        this.allotData.info.salesman_username = e;
      },

      // 修改提交
      postShop() {
        this.loading = true;
        let params = this.shopEdit.info;
        for(let i in params) {
          if(!!params[i] === false) {
            delete params[i]
          }
        }
        this.$api.customerEdit(params, this.shopEdit.id)
          .then(res => {
            this.$Message.success(res.message);
            this.changeInp();
            this.loading = false;
          })
          .catch(err => {
            this.$Message.error(res.message);
            this.changeInp();
            this.loading = false;
          })
      },

      // 关闭修改弹窗
      clearShop() {
        this.shopEdit.id = '';
        this.shopEdit.info = {
          merchant_name: '',
          merchant_type: '',
          facade_level: '',
          name: '',
          address: '',
          remark: ''
        }
        this.shopEdit.isShow = false;
      },

    },
    created() {
      this.init();
    },
    activated() {
      console.log("actuib");
      this.init();
    },
     watch:{
      $route:{
        deep: true,
        handler:function(newVal,oldVal){
          if(oldVal.name == newVal.name && Object.keys(newVal.query)){
              this.client.search = {} 
              this.getList()
          }
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  /deep/ .ivu-form-item {
    margin-bottom: 0.8%;
  }

  /deep/ .ivu-card-head,
  /deep/ .date-picker,
  /deep/ .ivu-card-head
  /deep/ .ivu-date-picker-editor {
    width: 100%;
  }

  /deep/ .ivu-upload {
    display: inline-block;
  }

  .modal-tab {
    border-color: #f3f3f3;
    width: 100%;

    td {
      text-align: center;
    }

    .td-left {
      background: #F0F0F0 !important;
      width: 20%;
    }
  }
</style>
