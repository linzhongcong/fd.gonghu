<template>
  <div>
    <Card>
      <Row slot="title">
        <Col :sm="24" @keydown.native.enter.prevent="getList('search')">
          <Form ref="search" :model="search" class="search" :rules="rulesForm">
            <Col>
              <FormItem prop="ownership">
                <Input v-model="search.apply_num" placeholder="申请编号" clearable></Input>
              </FormItem>
              <FormItem prop="salesman">
                <Input v-model="search.facade_name" placeholder="门店名称" clearable></Input>
              </FormItem>
              <FormItem prop="merchant_name">
                <Input v-model="search.contact_name " placeholder="申请人" clearable></Input>
              </FormItem>
              <FormItem prop="merchant_type">
                <Input v-model="search.contact_phone" placeholder="联系电话" clearable></Input>
              </FormItem>
              <FormItem prop="nickname">
                <Input v-model="search.nickname" placeholder="微信昵称" clearable></Input>
              </FormItem>
              <FormItem style="float:right">
                <Col span="12">
                  <Button type="primary" icon="ios-search" @click="getList('search')" style="padding: 4px 15px">查询
                  </Button>
                </Col>
              </FormItem>
            </Col>
          </Form>
        </Col>
        <Col :sm="24">
          <Button type="primary" @click="acceptance">确认受理</Button>
          <Button type="primary" @click="hadleAcceptance">处理完成</Button>
        </Col>
      </Row>
      <Row class="margin-top-10">
        <Table border highlight-row :columns="applyColumns" :data="applyData" @on-selection-change="selectCheck"
               :loading="loading" size="small">
          <!-- 操作 -->
          <template slot-scope="{ row }" slot="action">
            <Poptip confirm title="您确认删除这条内容吗？" @on-ok="handleDelete(row.id)" transfer>
              <Button size="small">
                <Icon type="md-trash"/>
              </Button>
            </Poptip>
          </template>
        </Table>
        <div style="margin: 10px;overflow: hidden">
          <div class="pages-L">共 {{pageProps.totalCount}} 条</div>
          <div style="float: right;">
            <Page :total="pageProps.totalCount" size="small" :current="pageProps.currentPage" show-sizer show-elevator
                  @on-change="changePage" @on-page-size-change="changePageSize"></Page>
          </div>
        </div>
      </Row>
    </Card>
    <!-- 确认受理弹窗 -->
    <Modal
    v-model="acceptanceModal"
    :title="acceptanceTitle"
    width=800
    >
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-position="top">
        <Row>
          <Col :span="6">
            <FormItem label="申请编号" prop="name">
              <Input v-model="formValidate.apply_num" disabled></Input>
            </FormItem>
          </Col>
          <Col :span="6">
            <FormItem label="门店名称" prop="name">
              <Input v-model="formValidate.facade_name" disabled></Input>
            </FormItem>
          </Col>
          <Col :span="6">
            <FormItem label="门店详细地址" prop="name">
              <Input v-model="formValidate.facade_address" disabled></Input>
            </FormItem>
          </Col>
          <Col :span="6">
            <FormItem label="微信昵称" prop="nickname">
              <Input v-model="formValidate.nickname" disabled></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="6">
            <FormItem label="联系人" prop="contact_name">
              <Input v-model="formValidate.contact_name" disabled></Input>
            </FormItem>
          </Col>
          <Col :span="6">
            <FormItem label="联系电话" prop="contact_phone">
              <Input v-model="formValidate.contact_phone" disabled></Input>
            </FormItem>
          </Col>
          <Col :span="6">
            <FormItem label="申请时间" prop="created_at">
              <Input v-model="formValidate.created_at" disabled></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem label="备注说明" prop="remark">
              <Input v-model="formValidate.remark" disabled></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="12" v-for="(item, index) in formValidate.IDFiles" :key="index">
            <FormItem label="身份证-国徽面" prop="name" v-if="item.type == 2">
              <div>
                <a :href="baseUrl + item.url" target="_blank">
                  <img :src="baseUrl + item.url" width="200px"/>
                </a>
              </div>
            </FormItem>
            <FormItem label="身份证-人像面" prop="name" v-if="item.type == 1">
              <div>
                <a :href="baseUrl + item.url" target="_blank">
                  <img :src="baseUrl + item.url" width="200px"/>
                </a>
              </div>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="6">
            <FormItem label="确认受理人" prop="acceptor_name">
              <Input v-model="formValidate.acceptor_name" placeholder="自动获取当前用户" :disabled="true"/>
            </FormItem>
          </Col>
          <Col :span="6">
            <FormItem label="分配跟单业务员" prop="real_name">
              <Select :loading="isLoading" v-model="formValidate.real_name" filterable remote :remote-method="queryUser"
                      @on-change="selectUser" label-in-value placeholder="请输入工号或者姓名" :disabled="display">
                <Option v-for="option in userList" :key="'user'+option.id" :value="option.real_name"
                        :label="`${option.real_name}  / ${option.username}`"></Option>
              </Select>
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem label="受理意见" prop="accept_remark">
              <Input v-model="formValidate.accept_remark" :disabled="modalType != 'sure'"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row v-if="modalType != 'sure'">
          <Col :span="6">
            <FormItem label="拜访次数" prop="visit_count">
              <Input v-model="formValidate.visit_count" :disabled="modalType != 'handle'"></Input>
            </FormItem>
          </Col>
          <Col :span="6">
            <FormItem label="处理结果" prop="status">
              <Select v-model="formValidate.status" placeholder="商家类型" :disabled="modalType != 'handle'">
                <Option v-for="item in resuleList" :key="'businessType'+item.key" :value="item.key"
                        :label="item.label"></Option>
              </Select>
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem label="处理完成意见" prop="reviewer_remark">
              <Input v-model="formValidate.reviewer_remark" :disabled="modalType != 'handle'"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row v-if="modalType == 'handle'">
          <Col :span="2">
            <FormItem label="上传陌拜/回访截图" prop="name">
              <Upload ref="prepareFileUpload"
                      name="UploadForm[file]"
                      :on-progress="coaProgressFile"
                      :default-file-list="fileItems"
                      :on-success="coaSuccess"
                      :on-remove="filePrepareRemove"
                      :on-format-error="fileFormatError"
                      :max-size="51200"
                      :on-exceeded-size="fileMaxSize"
                      type="drag"
                      :action="fileUploadURL"
                      :headers="fileUploadHeaders"
                      style="display: inline-block">
                <div class="breadth header">
                  <Icon type="md-add" size="20"></Icon>
                </div>
              </Upload>
            </FormItem>
          </Col>
        </Row>
        <Row v-if="modalType == 'allMassage'">
          <Col :span="4" class="worship">
            <FormItem label="陌拜/回访截图">
              <img v-for="(item) in formValidate.fileItems" :src="baseUrl+item.url" alt="" :key="item.id">
            </FormItem>
          </Col>
        </Row>
        <Row v-if="modalType == 'see'">
          <Col :span="2" v-for="(item, index) in imgList" :key="index">
            <img :src="item.img" alt="">
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button type="success" size="small" :loading="modal_loading" @click="sureAcceptance"
                v-text="modalText"></Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import Cookies from 'js-cookie'
  import {SERVER_BASE_URL} from '~/api/config';

  export default {
    name: 'partner',
    data() {
      return {
        display: false,
        domainName: '',
        isLoading: false,
        fileItems: [],
        imgList: [],
        defaultList: [],
        baseUrl: `${SERVER_BASE_URL}/`,
        fileUploadURL: `${SERVER_BASE_URL}/v1/upload`,
        fileUploadHeaders: {
          Authorization: Cookies.get('authorization')
        },
        resuleList: [
          {key: '达成合作意向', label: '达成合作意向'},
          {key: '仅初步了解', label: '仅初步了解'},
          {key: '无法获得联系方式', label: '无法获得联系方式'}
        ],
        formValidate: {
          accept_remark: '',
        },
        ruleValidate: { // 弹窗规则
        },
        acceptanceModal: false, //确认受理弹窗
        modalType: '',
        modalText: '确认受理', // 详情弹窗类型
        acceptanceTitle: '',
        modal_loading: false,
        logTabs: 'details',
        // 详情弹窗id
        detailId: '',
        // 查询用户列表
        userList: [],
        // 列表点击的信息
        checkList: [],
        // 表单搜索
        search: {},
        loading: false,
        // 详情、审核、复审弹窗
        modal: {
          title: '',
          status: ''
        },
        // 审核
        auditList: {},
        // 列表分页属性
        pageProps: {
          page: 1,
          perPage: 10,
          currentPage: 1,
          totalCount: 0
        },
        // 列表数据
        applyData: [],
        // 列表字段
        applyColumns: [
          {type: 'selection', width: 65, align: 'center', 'fixed': 'left'},
          {
            title: '序号',
            key: 'index',
            width: 65,
            align: 'center',
            render: (h, params) => {
              return h('div', {
                attrs: {
                  class: params.row.product_type === '1' ? 'new' : ''
                }
              }, params.index + 1);
            }
          },
          {
            title: '申请编号',
            key: 'apply_num',
            minWidth: 200,
            align: 'center'
          },
          {title: '申请时间', key: 'created_at', minWidth: 90, align: 'center'},
          {title: '门店名称', key: 'facade_name', minWidth: 120, align: 'center'},
          {title: '门店详细地址', key: 'facade_address', minWidth: 110, align: 'center'},
          {
            title: '联系人',
            key: 'contact_name',
            minWidth: 130,
            align: 'center',
            ellipsis: true
          },
          {
            title: '微信昵称',
            key: 'nickname',
            minWidth: 130
          },
          {
            title: '手机号码',
            key: 'contact_phone',
            minWidth: 110,
            align: 'center'
          },
          {
            title: '受理状态',
            key: 'status',
            minWidth: 110,
            align: 'center',
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    this.acceptanceTitle = '状态详情页';
                    this.modalText = '返回';
                    this.modalType = 'allMassage';
                    this.display = true
                    this.acceptanceModal = true;
                    let id = params.row.id;
                    this.publicMasage(id)
                  }
                }
              }, params.row.status);
            }
          },
          {
            title: '确认受理人',
            key: 'acceptor_name',
            minWidth: 110,
            align: 'center',
          },
          {title: '跟单业务员', key: 'real_name', minWidth: 110, align: 'center'},
          {
            title: '受理时间',
            key: 'accept_time',
            minWidth: 110,
            align: 'center'
          },
          {title: '备注说明', key: 'remark', minWidth: 110, align: 'center', sortable: true},
          {key: 'action', title: '操作', width: 110, align: 'center', slot: 'action'}
        ],
        // 搜索按钮loading
        loadingVisible: false,
        // 详情
        partnerDetail: {
          columns: [
            {title: '序号', type: 'index', width: 65, align: 'center'},
            {title: '创建人', key: 'created_by', width: 100, align: 'center'},
            {
              title: '时间',
              key: 'created_at',
              align: 'center',
              render: (h, params) => {
                return h('div', this.formatDate(params.row.created_at));
              }
            },
            {title: '包材图稿', key: 'artwork', align: 'center'},
            {title: '包材AI', key: 'artworkAi', align: 'center'},
            {title: '状态备注', key: 'remark', align: 'center'},
            {
              title: '状态',
              key: 'status',
              align: 'center',
              render: (h, params) => {
                return h('div', this.artworksStatus(params.row.status));
              }
            },
            {title: '选择', align: 'center'}
          ],
          data: {
            opinion: '',
            is_pass: '',
            fileItems: [
              {
                downLoadHref: ''
              }
            ]
          },
          modal: false,
          loading: false,
          status: [],
          btnLoading: false
        },
        // 若文件没有上传完，设置提交按钮为禁止状态
        isDisabled: false,
        // 表单规则
        rulesForm: {},
        // 上传进度
        percentProgress: 0,
        // 上传显示
        isShowProgress: false,
      };
    },
    methods: {

      /**
       * 搜索用户列表
       * @param {String} value：用户名、工号
       */
      queryUser(value) {
        this.isLoading = true;
        this.$api.salesmanData({username: value})
          .then(res => {
            this.isLoading = false;
            if (res.code === 0) {
              if (!!res.data.length) {
                this.userList = res.data;
              }
            }
          });
      },

      /**
       * 选中用户
       * @param {Array} obj：用户数据
       */
      selectUser(obj) {
        if (obj) {
          let labelName = obj.label.split('/')[0]
          let labelJobNumber = obj.label.split('/')[1]
          let list = this.userList.filter(n => {
            return labelName.trim() === n.real_name && labelJobNumber.trim() === n.username;
          });
          this.formValidate.salesman_id = list[0].id;
        }

      },

      //确认受理 and 处理完成
      sureAcceptance() {
        if (this.modalType == 'sure') { //确认受理
          this.$api.contractorApplyAccept(
            {
              id: this.checkList[0].id,
              salesman_id: Number(this.formValidate.salesman_id),
              accept_remark: this.formValidate.accept_remark
            }
          )
            .then((res) => {
              if (res.code == 0) {
                this.$Message.warning(res.message);
                this.acceptanceModal = false;
                this.getList()
              }
            })
        }

        if (this.modalType == 'handle') { //处理完成
          this.$api.contractorApplyProcess({
            id: this.checkList[0].id,
            status: this.formValidate.status,
            visit_count: this.formValidate.visit_count,
            reviewer_remark: this.formValidate.reviewer_remark,
            fileItems: this.fileItems
          })
            .then(res => {
              this.acceptanceModal = false;
              this.$Message.warning(res.message);
              this.getList()
            })
        }

        if (this.modalType == 'allMassage') {
          this.acceptanceModal = false;
        }
      },

      /**
       * 初始化数据
       */
      init() {
        this.getList();
      },

      /**
       * 确认受理详情
       */
      acceptance() {

        // this.modalText = ''
        this.acceptanceTitle = this.modalText = '确认受理';
        console.log(this.modaltext);
        this.modalType = 'sure'
        this.formValidate.track_people = ''
        this.display = false;
        if (!this.checkList.length == 0) {
          if (this.checkList[0].status != '待受理') {
            this.$Message.warning('受理状态不是待受理！！！');
            return
          }
        }
        this.HandlingDetails()
      },

      //处理详情
      HandlingDetails(ids) {
        if (this.modalType != 'allMassage') {
          if (this.checkList.length == 1) {
            let params = this.checkList[0].id;
            this.publicMasage(params)
            this.openCommonModal('acceptanceModal');
          } else {
            this.$Message.warning('请选择!');
          }
        }
      },

      //公用详情

      publicMasage(ids) {
        this.$api.contractorApplyApply({id: ids})
          .then((res) => {
            console.log(res)
            this.formValidate = res.data;
            console.log(this.formValidate)
            if (this.modalType == 'sure') {
              this.formValidate.accept_remark = ''
            } else if (this.modalType == 'handle') {
              this.display = true
              this.formValidate.visit_count = ''
              this.formValidate.status = ''
              this.formValidate.reviewer_remark = ''
            }
          })
      },

      /**
       * 处理受理 button
       */
      hadleAcceptance() {
        this.acceptanceTitle = this.modalText = '处理完成';
        this.modalType = 'handle';
        if (!this.checkList.length == 0) {
          if (this.checkList[0].status != '已受理') {
            this.$Message.warning('受理状态不是已受理！！！');
            return
          }
        }
        this.HandlingDetails()
      },

      //全局弹窗
      openCommonModal(name) {
        this[name] = true;
      },

      /**
       * 查询合作商列表
       * @param {String} name：表单名称
       */
      getList(name) {
        let params = {};
        params = this.search;
        this.loading = true;
        params.page = this.pageProps.page;
        params.perPage = this.pageProps.perPage;
        for (let i in params) {
          if (!params[i]) delete params[i];
        }
        this.$api.contractorApplyList(params)
          .then(res => {
            this.loading = false;
            this.applyData = res.items;
            if (res._meta) {
              this.pageProps.totalCount = res._meta.totalCount;
            }
          });
      },

      /**
       * 列表点击信息
       * @param {Object} selection：用户信息
       */
      selectCheck(selection) {
        this.checkList = selection;
      },
      /**
       * 时间转化
       * @param {time} time: 时间戳
       */
      formatDate(time) {
        return this.$format(time, 'yyyy-MM-dd');
      },

      /**
       * 改变页数事件
       * @param {Number} e：返回的页数
       */
      changePage(e) {
        this.pageProps.page = e;
        this.getList();
      },

      /**
       * 改变页数事件
       * @param {Number} e：返回的页数
       */
      changePageSize(e) {
        this.pageProps.perPage = e;
        this.getList();
      },

      /**
       * 操作栏的编辑
       * @param {Number} 表单id
       */
      handleEdit(id) {
        this.$router.push({
          path: '/contract/partner-management-edit',
          query: {id: id}
        });
      },

      /**
       * 删除信息
       * @param {Number} 表单id
       */
      handleDelete(id) {
        this.$api.contractorApplyDel(id)
          .then(res => {
            if (res.code === 0) {
              this.$Message.success(res.message);
              this.getList();
            }
          });
      },

      /**
       * 重置
       * @param {String} name：表单名称
       */
      handleReset(name) {
        this.$refs[name].resetFields();
        this.getList();
      },

      /***
       * 合作方式
       * @param {String} pay：类型
       */
      paymentType(pay) {
        // let list = this.paymentList.filter((item) => {
        //     return item.value === pay;
        // });
      },

      /***
       * 商家类型
       * * @param {String} pay：类型
       */
      businessList(pay) {
        // let list = this.businessType.filter((item) => {
        //     return item.value === pay;
        // });
      },

      /***
       * 审核状态类型
       * * @param {String} status：类型
       */
      statusType(status) {
        // let list = this.statusList.filter((item) => {
        //     return status.indexOf(item.value) > -1;
      },


      // 文件上传限制
      fileMaxSize(file) {
        this.$Notice.warning({
          title: '超出文件大小限制',
          desc: '文件 ' + file.name + ' 太大，不能超过 50M。'
        });
      },
      // 文件格式验证失败
      fileFormatError(file) {
        this.$Notice.error({
          title: '文件格式错误',
          desc: '请上传正确的文件格式!'
        });
      },
      // 附件上传进度条
      coaProgressFile(event, file) {
        if (!event) return;
        this.isShowProgress = true;
        if (event.percent === 100) {
          this.isDisabled = false;
        } else {
          this.isDisabled = true;
        }
        // 延迟一下，接收有bug
        setTimeout(() => {
          if (file.status === 'fail') {
            this.$Notice.error({
              title: '文件上传失败!'
            });
          }
        }, 1000);
        if (file.percentage === 100) {
          this.isShowProgress = false;
        }
        this.isShowProgress = event.percent;
      },
      // 附件文件上传成功
      coaSuccess(res, file) {
        // 上传成功
        this.isShowProgress = false;
        if (res.status) {
          let data = res.data;
          this.fileItems.push(data);
        }
      },
      // 移除附件文件
      filePrepareRemove(file) {
        const fileList = this.fileItems;
        let obj = this.fileItems.splice(fileList.indexOf(file), 1);
      }
    },
    activated() {
      this.$store.commit('app/setSearchList', this.$route.query)
      this.init();
      let status = this.$route.query.status;
      if (status) {
        this.search.status = status;
      }else{
        this.search.status = '';
      }

    },
    watch: {
        $route:{
        deep: true,
        handler:function(newVal,oldVal){
          if(oldVal.name == newVal.name && Object.keys(newVal.query)){
              this.formData = {} 
              this.getList()
          }
        }
      }
      // $route (newVal) {
      //     this.getList('search');
      // }
    }
  };
</script>

<style lang="less" scoped>
  .ivu-input::-webkit-input-placeholder, .ivu-select-single .ivu-select-selection .ivu-select-placeholder {
    color: rgb(130, 130, 130);
  }

  .ivu-input, .ivu-select-selection {
    border: 1px solid rgb(184, 184, 184);
    color: #000;

  }

  .ivu-date-picker {
    width: 100%;
  }

  .breadth {
    width: 58px;
    height: 58px;
    line-height: 58px;
    float: left;
  }

  .ivu-upload-list {
    display: inline-block;
  }

  .ivu-upload-drag {
    width: 58px;
    display: inline-block;
    margin-top: 5px
  }

  .ivu-upload-list-file {
    float: left;
  }

  #printModal p {
    line-height: 1.8;
  }

  #printModal .ivu-table-wrapper {
    border-color: #495060;

    .ivu-table-border:before, .ivu-table-border:after {
      background-color: #495060;
    }

    td {
      border-right: 1px solid #495060;
      border-bottom: 1px solid #495060;
    }
  }

  .ivu-table-border {
    overflow: visible
  }

  .verification {
    overflow: hidden;
    margin-bottom: 0;
    height: 100%;
  }

  .verification .ivu-form-item-content, .verification .ivu-date-picker-rel {
    height: 100%;
  }

  .receiveDetailList a {
    width: 60px;
    height: 60px;
    display: block;
  }

  #collect-goods .ivu-modal-content {
    left: 5%
  }

  #collect-goods .ivu-table-cell:last-child {
    padding-left: 7px
  }

  .new {
    background: url(../../assets/images/new.png) no-repeat center center;
    background-size: 100%;
  }

  .partnerDetailAddress {
    height: 40px;
    border-bottom: 1px solid #e8eaec;

    &:last-child {
      border-bottom: none;
    }

    .head-bg {
      display: inline-block;
      line-height: 40px;
      border-right: 1px solid #e8eaec;
    }

    .head-bgs {
      display: inline-block;
      line-height: 40px;
    }
  }

  @media screen and (max-width: 640px ) {
    #opts button {
      margin-bottom: 5px;
    }

    .ivu-col-span-3 {
      width: 200px;
      margin-bottom: 5px;
    }
  }

  .worship /deep/ .ivu-form-item-content > img {
    width: 100px;
  }
</style>
