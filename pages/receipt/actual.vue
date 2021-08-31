<template>
  <div>
    <Card>
      <Row slot="title">
        <Col :sm="24">
          <Form ref="search" :model="search" :rules="formRules" class="search">
            <Col>
              <!--                            <FormItem prop="ownership">-->
              <!--                                <Select v-model="search.ownership" clearable placeholder="所有权"  @on-change="getList('search')">-->
              <!--                                    <Option v-for="item in ownershipList" :value="item.ownership" :key="item.ownership" :label="item.label"></Option>-->
              <!--                                </Select>-->
              <!--                            </FormItem>-->
              <!--                            <FormItem prop="date">-->
              <!--                                <DatePicker v-model="search.date" @on-change="estimateTime" type="date" placeholder="请选择下单时间"></DatePicker>-->
              <!--                            </FormItem>-->
              <FormItem prop="date">
                <DatePicker v-model="search.import_at" @on-change="estimateImportTime" type="date" clearable
                            placeholder="请选择付款时间"></DatePicker>
              </FormItem>
              <FormItem prop="status">
                <Select v-model="search.receivables_status" placeholder="收款状态" clearable @on-change="getList('search')">
                  <Option v-for="item in gatherStatus" :value="item.value" :key="item.ownership"
                          :label="item.label"></Option>
                </Select>
              </FormItem>
              <FormItem prop="miniprogram_status">
                <Select v-model="search.miniprogram_status" placeholder="小程序订单状态" clearable
                        @on-change="getList('search')">
                  <Option v-for="item in miniprogramStatus" :value="item.value" :key="item.value"
                          :label="item.label"></Option>
                </Select>
              </FormItem>
              <FormItem prop="order_sn">
                <Input v-model="search.order_sn" @keydown.native.enter.prevent="getList('search')" placeholder="订单编号" clearable/>
              </FormItem>
              <FormItem prop="merchant_name">
                <Input v-model="search.merchant_name" @keydown.native.enter.prevent="getList('search')" placeholder="商家名称"/>
              </FormItem>
              <FormItem style="float:right">
                <Col :sm="12">
                  <Button type="primary" icon="md-search" @click="getList('search')">查询</Button>
                </Col>
                <Col :sm="12">
                  <Button icon="md-repeat" @click="handReset('search')">重置</Button>
                </Col>
              </FormItem>
            </Col>
          </Form>
        </Col>
        <Col :sm="24">
          <Button type="primary" @click="getherMoney">收款</Button>
          <Button type="primary" @click="applyFor">申请退款</Button>
        </Col>
      </Row>
      <Row class="margin-top-10" style="clear: both;">
        <Table :columns="columns" :data="formData" border highlight-row :loading="loading"
               @on-selection-change="checkTable" size="small">
        </Table>
        <div style="margin: 10px;overflow: hidden">
          <div class="pages-L">共 {{pageProps.totalCount}} 条</div>
          <div style="float: right;">
            <Page size="small" :total="pageProps.totalCount" :current="pageProps.currentPage" show-sizer show-elevator
                  @on-change="changePage" @on-page-size-change="changePageSize"></Page>
          </div>
        </div>
      </Row>
    </Card>
    <!-- 收款详情弹窗 -->
    <Modal v-model="detailsList.modal" title="收款详情" width="900" footer-hide>
      <div class="rel">
        <!-- 订单详情 start -->
        <div class="ivu-table-wrapper">
          <div class="ivu-table ivu-table-small ivu-table-border">
            <div class="ivu-table-body">
              <table cellspacing="0" cellpadding="0" border="0" width="100%">
                <tbody class="ivu-table-tbody">
                <tr class="ivu-table-row">
                  <td class="head-bg">
                    <div class="ivu-table-cell">订单号</div>
                  </td>
                  <td>
                    <div class="ivu-table-cell"><span>{{ detailsList.data.order_sn }}</span></div>
                  </td>
                  <td class="head-bg">
                    <div class="ivu-table-cell">合作商</div>
                  </td>
                  <td>
                    <div class="ivu-table-cell"><span>{{ detailsList.data.merchant_name }}</span></div>
                  </td>
                  <td class="head-bg">
                    <div class="ivu-table-cell">合作金额</div>
                  </td>
                  <td>
                    <div class="ivu-table-cell"><span>{{ detailsList.data.total_order_amount }}</span></div>
                  </td>
                </tr>
                <tr class="ivu-table-row">
                  <td class="head-bg">
                    <div class="ivu-table-cell">收款状态</div>
                  </td>
                  <td>
                    <div class="ivu-table-cell"><span>{{ gatherStatusList(detailsList.data.receivables_status) }}</span>
                    </div>
                  </td>
                  <td class="head-bg">
                    <div class="ivu-table-cell">收款提交时间</div>
                  </td>
                  <td>
                    <div class="ivu-table-cell">
                      <span
                      v-text="!detailsList.data.receipt_submission_at || detailsList.data.receipt_submission_at==0 ? '暂无' : formatDate(detailsList.data.receipt_submission_at)"></span>
                    </div>
                  </td>
                  <td class="head-bg">
                    <div class="ivu-table-cell">收款完成时间</div>
                  </td>
                  <td>
                    <div class="ivu-table-cell">
                      <span
                      v-text="!detailsList.data.collection_completion_at || detailsList.data.collection_completion_at==0 ? '暂无' : formatDate(detailsList.data.collection_completion_at)"></span>
                    </div>
                  </td>
                </tr>
                <tr class="ivu-table-row">
                  <td class="head-bg">
                    <div class="ivu-table-cell">订单来源</div>
                  </td>
                  <td>
                    <div class="ivu-table-cell">
                      <span v-text="orderType[detailsList.data.order_form]"></span>
                    </div>
                  </td>
                  <td class="head-bg">
                    <div class="ivu-table-cell">申请</div>
                  </td>
                  <td>
                    <div class="ivu-table-cell">
                      <span v-text="!detailsList.data.created_by ? '暂无' : detailsList.data.created_by"></span>
                    </div>
                  </td>
                </tr>
                <tr class="ivu-table-row">
                  <td colspan="6">
                  </td>
                </tr>
                <template v-for="(item) in detailsList.data.orderReceivable">
                  <div :key="item.id">
                  <tr class="ivu-table-row">
                    <td class="head-bg">
                      <div class="ivu-table-cell">支付编号</div>
                    </td>
                    <td colspan="5">
                      <div class="ivu-table-cell"><span
                      v-text="!detailsList.data.pay_sn  || detailsList.data.pay_sn == '' ? '暂无' : detailsList.data.pay_sn"></span>
                      </div>
                    </td>
                  </tr>
                  <tr class="ivu-table-row">
                    <td class="head-bg">
                      <div class="ivu-table-cell">汇款户名</div>
                    </td>
                    <td colspan="2">
                      <div class="ivu-table-cell"><span v-text="item.remittanceName"></span></div>
                    </td>
                    <td class="head-bg">
                      <div class="ivu-table-cell">汇款账号</div>
                    </td>
                    <td colspan="2">
                      <div class="ivu-table-cell"><span>{{ item.remittanceAccount }}</span></div>
                    </td>
                  </tr>
                  <tr class="ivu-table-row">
                    <td class="head-bg">
                      <div class="ivu-table-cell">汇款项目</div>
                    </td>
                    <td colspan="5">
                      <div class="ivu-table-cell"><span>{{ item.project }}</span></div>
                    </td>
                  </tr>
                  <tr class="ivu-table-row">
                    <td class="head-bg">
                      <div class="ivu-table-cell">汇入方式</div>
                    </td>
                    <td colspan="2">
                      <div class="ivu-table-cell"><span>{{ item.importMode }}</span></div>
                    </td>
                    <td class="head-bg">
                      <div class="ivu-table-cell">汇入户名</div>
                    </td>
                    <td colspan="2">
                      <div class="ivu-table-cell"><span>{{ item.importName }}</span></div>
                    </td>
                  </tr>
                  <tr class="ivu-table-row">
                    <td class="head-bg">
                      <div class="ivu-table-cell">汇入账号</div>
                    </td>
                    <td colspan="2">
                      <div class="ivu-table-cell"><span>{{ item.importAccount }}</span></div>
                    </td>
                    <td class="head-bg">
                      <div class="ivu-table-cell">汇入金额</div>
                    </td>
                    <td colspan="2">
                      <div class="ivu-table-cell"><span>{{ item.importAmount }}</span></div>
                    </td>
                  </tr>
                  <tr class="ivu-table-row">
                    <td class="head-bg">
                      <div class="ivu-table-cell">汇入时间</div>
                    </td>
                    <td colspan="2">
                      <div class="ivu-table-cell"><span>{{ formatDate(item.importAt) }}</span></div>
                    </td>
                    <td class="head-bg">
                      <div class="ivu-table-cell">上传凭证</div>
                    </td>
                    <td colspan="2">
                      <div class="ivu-table-cell" v-if="item.fileItems.length">
                        <a v-for="(link, linkIndex) in item.fileItems" :key="linkIndex" :href="link.url"
                           target="_blank">
                          {{ item.fileItems[linkIndex].title +'.'+ item.fileItems[linkIndex].extension}}
                        </a>
                        <!-- <a :href="downUrl[index1]" target="_blank">
                            {{ item.fileItems[0].title + '.' + item.fileItems[0].extension}}
                                                </a> -->
                      </div>
                    </td>
                  </tr>
                  <tr class="ivu-table-row">
                    <td class="head-bg">
                      <div class="ivu-table-cell">备注</div>
                    </td>
                    <td colspan="5">
                      <div class="ivu-table-cell"><span>{{ item.remark }}</span></div>
                    </td>
                  </tr>
                  <tr class="ivu-table-row">
                    <td colspan="6">
                    </td>
                  </tr>
                  </div>
                </template>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <Spin v-show="detailsList.loading" :fix="true" size="large"></Spin>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    name: 'actual',
    data() {
      return {
        // 上传凭证
        downUrl: [],
        // 搜索字段
        search: {},
        // 所有权数据
        ownershipList: [],
        // 收款状态
        gatherStatus: [
          {value: 'wait_receipt', label: '待付款'},
          {value: 'paid', label: '已付款'},
          {value: 'receipt', label: '已收款'},
          {value: 'unpaid', label: '未收款'}
        ],
        orderType: {
          backstage: '后台添加',
          MiniProgram: '小程序订单'
        },
        // 小程序订单状态
        miniprogramStatus: [
          {value: 'auditPending', label: '待审核'},
          {value: 'delivery_pending', label: '待发货'},
          {value: 'delivery_finish', label: '已发货'}
        ],
        // 审核状态
        alloutStatusList: [
          {value: 'auditPending', label: '待审核'},
          {value: 'auditFailure', label: '审核失败'},
          {value: 'auditRecheckPending', label: '待复审'},
          {value: 'auditRecheckFailure', label: '复审失败'},
          {value: 'auditRecheckPass', label: '复审通过'}
        ],
        loading: false,
        // 列表分页属性
        pageProps: {
          page: 1,
          perPage: 10,
          currentPage: 1,
          totalCount: 0
        },
        // 收款详情
        detailsList: {
          modal: false,
          data: {
            orderReceivable: [
              {
                remittanceName: '',
                remittanceAccount: '',
                project: '',
                importMode: '',
                fileItems: [],
                importAccount: '',
                importAmount: '',
                importAt: '',
                remark: ''
              }
            ]
          },
          loading: false
        },
        // 列表字段
        columns: [
          {type: 'selection', width: 60, align: 'center', fixed: 'left'},
          {type: 'index', title: '序号', width: 65, align: 'center'},
          {key: 'merchant_name', title: '商家名称', minWidth: 200, sortable: true, align: 'center'},
          {key: 'payment_method_desc', title: '结款方式', minWidth: 90, align: 'center'},
          {
            key: 'order_sn',
            title: '订单号',
            minWidth: 180,
            sortable: true,
            align: 'center',
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    // 跳转到订单管理-订单审核
                    let query = params.row.id;
                    if (params.row.kind == 'reissue') {  // 跳转补发详情
                      this.$router.push({
                        path: '/replacement-management/replacement-order-review/replacement-detail',
                        query: {
                          id: params.row.id
                        }
                      })
                    } else {
                      this.$router.push({
                        path: '/order-management/review-details',
                        query: {id: query, redirect: 'actual'}
                      });
                    }
                  }
                }
              }, params.row.order_sn);
            }
          },
          {key: 'order_form_desc', title: '订单来源', minWidth: 90, align: 'center'},

          {
            key: 'order_time',
            title: '下单时间',
            minWidth: 110,
            sortable: true,
            align: 'center',
            render: (h, params) => {
              return h('div', {}, this.formatDate(params.row.order_time));
            }
          },
          {
            key: 'product',
            title: '货号',
            minWidth: 160,
            sortable: true,
            align: 'center',
            render: (h, params) => {
              return h('div', params.row.product.map((item) => {
                return h('div', item.item_no);
              }));
            }
          },
          {
            key: 'net_weight',
            title: '数量',
            minWidth: 100,
            sortable: true,
            align: 'center',
            render: (h, params) => {
              return h('div', params.row.product.map((item) => {
                return h('div', item.number);
              }));
            }
          },
          {
            key: 'total_order_amount',
            title: '订单金额',
            width: 150,
            align: 'center'
          },
          {
            key: 'delivery_mode',
            title: '发货方式',
            width: 110,
            align: 'center',
            render: (h, params) => {
              return h('div', this.expressList(params.row.delivery_mode));
            }
          },
          {
            key: 'receivables_status',
            title: '收款状态',
            width: 100,
            align: 'center',
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    this.viewDetails(params.row.id, params.row.order_sn);
                  }
                }
              }, this.gatherStatusList(params.row.receivables_status));
            }
          },
          {
            key: 'status',
            title: '审核状态',
            width: 100,
            align: 'center',
            render: (h, params) => {
              return h('div', {}, this.alloutStatus(params.row.status));
            }
          },
          {key: 'miniprogram_status_desc', title: '小程序订单状态', minWidth: 100, align: 'center'},
          {key: 'import_mode_desc', title: '付款方式', minWidth: 100, align: 'center'},
          {key: 'import_at_desc', title: '付款时间', minWidth: 100, align: 'center'},
        ],
        // table数据
        formData: [],
        // 搜索表单验证规则 清空按钮作用
        formRules: {},
        // 选择列表的信息
        checkList: [],
        // 发货方式
        expressStatus: [
          {value: 'express', label: '快递'},
          {value: 'logistics', label: '物流'}
        ]
      };
    },
    methods: {
      estimateImportTime(estimateTimeArr) {
        this.search.import_at = estimateTimeArr;
        this.getList();
      },
      /***
       * 初始化信息
       */
      init() {
        this.$api.getOwnership().then(res => {
          this.ownershipList = res;
        });
        this.getList();
      },

      /**
       * 获取列表信息
       */
      getList() {
        let params = {};
        params = JSON.parse(JSON.stringify(this.search));
        params.page = this.pageProps.page;
        params.perPage = this.pageProps.perPage;
        this.loading = true;
        for (let i in params) {
          if (!params[i]) delete params[i];
        }
        this.$api.realSales(params)
          .then(res => {
            this.loading = false;
            this.formData = res.items;
            if (res._meta) {
              this.pageProps.totalCount = res._meta.totalCount;
            }
          });
      },

      /**
       * 选择table列表获取信息
       * @param {Array} selection：选中的列表信息
       */
      checkTable(selection) {
        this.checkList = selection;
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
       * 收款状态查看详情
       * @param {Number} id：订单id
       * @param {Number} order_sn：订单号
       */
      viewDetails(id, order_sn) {
        this.detailsList.modal = true;
        this.detailsList.loading = true;
        this.$api.realSalesReceipt({id: id})
          .then(res => {
            if (res.code === 0) {
              this.detailsList.data = {};
              this.detailsList.data = res.data;
              this.detailsList.data.order_sn = order_sn;
              if (this.detailsList.data.orderReceivable.length === 0) {
                this.detailsList.data.orderReceivable = [{
                  remittanceName: '',
                  remittanceAccount: '',
                  project: '',
                  importMode: '',
                  fileItems: [],
                  importAccount: '',
                  importAmount: '',
                  importAt: '',
                  remark: ''
                }];
              } else {
                for (let i in this.detailsList.data.orderReceivable) {
                  if (this.detailsList.data.orderReceivable[i].fileItems.length > 0) {
                    this.downUrl.push(this.detailsList.data.orderReceivable[i].fileItems[0].url);
                  }
                }
              }
            }
            this.detailsList.loading = false;
          });
      },

      /***
       * 重置搜索按钮
       * @param {String} name：表单名称 重置
       */
      handReset(name) {
        this.$refs[name].resetFields();
        this.getList();
      },

      /***
       * 收款判断
       */
      getherMoney() {
        let checkList = this.checkList;
        if (checkList.length === 0) {
          this.$Message.warning('请选择至少一项!');
          return;
        }
        // 判断是否都是待付款
        let payStatus = checkList.every(n => {
          return n.receivables_status === 'wait_receipt';
        });
        if (!payStatus) {
          this.$Message.warning('待付款状态下才可以进行收款!');
          return;
        }
        // 判断商家id是否相同
        let status = checkList.every(n => {
          return n.merchant_id === checkList[0].merchant_id;
        });
        if (!status) {
          this.$Message.warning('请选择同一个商家进行收款!');
          return;
        }
        let order = [];
        checkList.map(n => {
          let obj = {};
          obj.order_sn = n.order_sn;
          obj.merchant_name = n.merchant_name;
          obj.total_order_amount = n.total_order_amount;
          obj.id = n.id;
          order.push(obj);
        });
        localStorage.setItem('actually-order', JSON.stringify(order));

        this.$router.push({
          path: '/receipt/actual-edit'
        });
      },
      // 退款申请
      applyFor() {
        let checkList = this.checkList;
        if (checkList.length === 0) {
          return void this.$Message.warning('请选择！');
        } else if (checkList.length >= 2) {
          return void this.$Message.warning('只能选中一条！');
        }
        if (checkList[0].receivables_status !== 'paid' && checkList[0].receivables_status !== 'receipt') {
          return void this.$Message.warning('请选择已付款或已收款状态！');
        }
        this.$router.push({
          path: '/order-management/order-refund-apply',
          query: {id: checkList[0].id, type: 'actual'}
        });
      },

      /***
       * 收款状态转化中文显示
       * @param {String} value：收款状态 英文
       */
      gatherStatusList(value) {
        let list = this.gatherStatus.filter((item) => {
          return item.value === value;
        });
        return list[0] ? list[0].label : '';
      },

      /**
       * 审核状态转化中文显示
       *  @param {String} value：审核状态 英文
       */
      alloutStatus(value) {
        let list = this.alloutStatusList.filter((item) => {
          return value.indexOf(item.value) > 0;
        });
        return list[0] ? list[0].label : '';
      },

      /**
       * 发货方式转化中文显示
       * @param {String} value：发货方式 英文
       */
      expressList(value) {
        let list = this.expressStatus.filter((item) => {
          return value === item.value;
        });
        return list[0] ? list[0].label : '';
      },

      /***
       * 搜索表单-日期格式 2019-10-10
       * @param {Date} estimateTimeArr：DatePicker组件传入的值
       */
      estimateTime(estimateTimeArr) {
        let delivery = JSON.parse(JSON.stringify(this.search));
        delivery.date = estimateTimeArr;
        this.search = delivery;
        this.getList();
      },

      /***
       * 日期格式转化
       * @param {time} time：时间戳
       */
      formatDate(time) {
        return this.$format(time, 'yyyy-MM-dd');
      }
    },
    activated() {
      /**
       * 初始化列表数据、所有权数据
       */
      this.init();
    }
  };
</script>

<style>

</style>
