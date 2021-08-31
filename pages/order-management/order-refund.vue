<template>
  <div>
    <Card>
      <Row slot="title">
        <Col :sm="24">
          <Form ref="search" :model="search" class="search">
            <Row @keydown.native.enter.prevent="getList('search')">
              <Col :sm="19" style="">
                <FormItem>
                  <Input v-model="search.refund_sn" placeholder="退款编号" clearable></Input>
                </FormItem>
                <FormItem>
                  <Input v-model="search.merchant_name" placeholder="商家" clearable></Input>
                </FormItem>
                <FormItem>
                  <Input v-model="search.order_sn" placeholder="订单号" clearable></Input>
                </FormItem>
                <FormItem>
                  <Select v-model="search.order_form" placeholder="订单来源" clearable @on-change="getList('search')">
                    <Option v-for="item in orderType" :key="item.value" :value="item.value"
                            :label="item.label"></Option>
                  </Select>
                </FormItem>
                <FormItem>
                  <Input v-model="search.created_by" placeholder="申请人" clearable></Input>
                </FormItem>
                <FormItem>
                  <Select v-model="search.status" placeholder="审核状态" clearable @on-change="getList('search')">
                    <Option v-for="item in auditStatus" :key="item.value" :value="item.value"
                            :label="item.label"></Option>
                  </Select>
                </FormItem>
                <FormItem>
                  <DatePicker type="date" v-model="startTime" placeholder="申请开始时间"
                              @on-change="v => changeTime(v, 'start')"></DatePicker>
                </FormItem>
                <FormItem>
                  <DatePicker type="date" v-model="endTime" placeholder="申请结束时间"
                              @on-change="v => changeTime(v, 'end')"></DatePicker>
                </FormItem>
              </Col>
              <Col :sm="5" :xs="7" style="text-align:right;">
                <Button type="primary" icon="ios-search" @click="getList('search')">查询</Button>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col :sm="24">
          <Button type="primary" @click="tapAudit('first')">初审</Button>
          <Button type="primary" @click="tapAudit('sec')">复审</Button>
          <Button type="primary" @click="exportData" :loading="exportLoading">导出数据</Button>
        </Col>
      </Row>
      <Row class="margin-top-10">
        <Table class="review-list" border highlight-row :columns="refundColumns" :data="reviewData"
               @on-selection-change="selectCheck" :loading="loading" size="small">
          <!-- 操作 -->
          <template slot-scope="{ row }" slot="action">
            <Poptip confirm title="您确认删除这条内容吗？" @on-ok="handleDelete(row,row.id)" transfer>
              <Button size="small" :disabled="row.service_progress !== 'close'">
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
    <!-- 审核/关闭弹窗 -->
    <Modal v-model="refundAudit.modal" :title="refundAudit.title" width="900">
      <div class="rel">
        <Form ref="refundAudit1" :model="refundAudit.submitData" label-position="top" :rules="ruleValidate">
          <Row>
            <Col :md="6">
              <FormItem label="订单号">
                <Input v-model="orderId_refundAudit" disabled></Input>
              </FormItem>
            </Col>
            <Col :md="6">
              <FormItem label="合作商">
                <Input v-model="merchantName_refundAudit"
                       disabled></Input>
              </FormItem>
            </Col>
            <Col :md="6">
              <FormItem label="订单金额">
                <Input v-model="totalOrderAmount_refundAudit"
                       disabled></Input>
              </FormItem>
            </Col>
            <Col :md="6">
              <FormItem label="申请时间">
                <Input v-model="createdAt_refundAudit" disabled></Input>
              </FormItem>
            </Col>
            <Col :md="6">
              <FormItem label="申请来源">
                <Input v-model="applySourceDesc_refundAudit"
                       disabled></Input>
              </FormItem>
            </Col>
            <Col :md="6">
              <FormItem label="申请人">
                <Input v-model="createdBy_refundAudit" />
              </FormItem>
            </Col>
            <Col :md="6">
              <FormItem label="退款金额">
                <Input v-model="refundableAmount_refundAudit"
                       disabled></Input>
              </FormItem>
            </Col>
            <Col :md="6">
              <FormItem label="退款理由">
                <Input v-model="reason_refundAudit" disabled></Input>
              </FormItem>
            </Col>
          </Row>
          <template v-if="refundAudit.type === 'sec'">
          <Row v-for="(logItem, index) in refundAudit.data.auditItems" :key="index">
            <Col :md="6">
              <FormItem :label="logItem.status == 'auditPending' ? '初审人' : '复审人'">
                <Input v-model="logItem.created_by" disabled></Input>
              </FormItem>
            </Col>
            <Col :md="6">
              <FormItem label="审核状态" prop="num">
                <Input v-model="logItem.audit_pass_desc" disabled></Input>
              </FormItem>
            </Col>
            <Col :md="6">
              <FormItem label="审核时间">
                <Input v-model="logItem.created_at" disabled></Input>
              </FormItem>
            </Col>
            <Col :md="6">
              <FormItem label="审核意见">
                <Input v-model="logItem.opinion" disabled></Input>
              </FormItem>
            </Col>
          </Row>
          </template>
          <Row>
            <Col :md="6">
              <FormItem :label="refundAudit.typeName" prop="is_pass">
                <RadioGroup v-model="refundAudit.submitData.is_pass">
                  <Radio label="1">通过</Radio>
                  <Radio label="0">不通过</Radio>
                </RadioGroup>
              </FormItem>
            </Col>
            <Col :md="18">
              <FormItem :label="refundAudit.subTitle" prop="opinion">
                <Input v-model="refundAudit.submitData.opinion"></Input>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Spin fix v-show="refundAudit.loading"></Spin>
      </div>
      <div slot="footer">
        <Button @click="refundAudit.modal=false">取消</Button>
        <Button type="primary" @click="confirmRefund('refundAudit1')" :loading="refundAudit.btnLoading">确认退款</Button>
      </div>
    </Modal>


    <!-- 审核状态 - 详情 -->
    <Modal v-model="auditDetails.modal" width="900" footer-hide>
      <div class="rel">
        <Divider>退款详情</Divider>
        <Form ref="refundAudit" label-position="top">
          <Row>
            <Col :md="6">
              <FormItem label="订单号"><Input v-model="orderId_auditDetails" disabled></Input></FormItem>
            </Col>
            <Col :md="6">
              <FormItem label="合作商"><Input v-model="merchantName_auditDetails" disabled></Input></FormItem>
            </Col>
            <Col :md="6">
              <FormItem label="订单金额"><Input v-model="totalOrderAmount_auditDetails" disabled></Input></FormItem>
            </Col>
            <Col :md="6">
              <FormItem label="申请时间"><Input v-model="createdAt_auditDetails" disabled></Input></FormItem>
            </Col>
            <Col :md="6">
              <FormItem label="申请来源"><Input v-model="applySourceDesc_auditDetails" disabled></Input></FormItem>
            </Col>
            <Col :md="6">
              <FormItem label="申请人"><Input v-model="createdBy_auditDetails" disabled></Input></FormItem>
            </Col>
            <Col :md="6">
              <FormItem label="退款金额"><Input v-model="refundableAmount_auditDetails" disabled></Input></FormItem>
            </Col>
            <Col :md="6">
              <FormItem label="退款理由"><Input v-model="reason_auditDetails" disabled></Input></FormItem>
            </Col>
          </Row>
        </Form>
        <Divider>审核记录</Divider>
        <Form ref="refundAudit" label-position="top">
          <Row v-for="(auditItem, index) in auditDetails.data.auditItems" :key="index">
            <Col :md="6">
              <FormItem :label="auditItem.status == 'auditPending' ? '初审人' : '复审人'">
                <Input v-model="auditItem.created_by" disabled></Input>
              </FormItem>
            </Col>
            <Col :md="6">
              <FormItem label="审核状态">
                <Input v-model="auditItem.audit_pass_desc" disabled></Input>
              </FormItem>
            </Col>
            <Col :md="6">
              <FormItem label="审核时间">
                <Input v-model="auditItem.created_at" disabled></Input>
              </FormItem>
            </Col>
            <Col :md="6">
              <FormItem label="审核意见">
                <Input v-model="auditItem.opinion" disabled></Input>
              </FormItem>
            </Col>
          </Row>
          <Row
          v-if="auditDetails.data.status =='OrderRefundWorkFlow/waitingRefund' || auditDetails.data.status =='OrderRefundWorkFlow/refunded'">
            <Col :md="6">
              <FormItem label="退款人">
                <Input value="商务后台" disabled></Input>
              </FormItem>
            </Col>
            <Col :md="6">
              <FormItem label="审核状态">
                <Input v-model="auditDetails.data.status_desc" disabled></Input>
              </FormItem>
            </Col>
            <Col :md="6">
              <FormItem label="退款时间">
                <Input v-model="auditDetails.data.refund_at_desc" disabled></Input>
              </FormItem>
            </Col>
            <Col :md="6">
              <FormItem label="实际退款金额">
                <Input v-model="auditDetails.data.actual_refund_amount" disabled></Input>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Spin fix v-show="auditDetails.loading"></Spin>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    name: 'refund',
    data() {
      return {
        firstEntry: true,
        startTime: '',
        endTime: '',
        // 发货信息-发货方式
        deliveryModeList: {
          express: '快递',
          logistics: '物流',
          null: '未知'
        },
        auditDetails: {
          modal: false,
          loading: false,
          data: {
            auditItems: [
              {
                created_by: '暂无',
                audit_pass_desc: '暂无',
                created_at: '暂无',
                opinion: '暂无'
              }
            ]
          },

        },
        modalType: '',
        baseList: [],
        categoryList: [],
        policyProductList: [],
        backPointList: [],
        giftList: [],
        policyNameLists: [],
        policyNameLoading: false,
        // 收款状态
        receivablesStatusList: {
          unpaid: '未付款',
          paid: '已付款',
          wait_receipt: '待付款',
          receipt: '已收款'
        },
        checkList: [],
        statusList: [
          {value: 'OrderWorkflow/auditPending', label: '待初审'},
          {value: 'OrderWorkflow/auditFailure', label: '初审未通过'},
          {value: 'OrderWorkflow/auditRecheckPending', label: '待复审'},
          {value: 'OrderWorkflow/auditRecheckFailure', label: '复审未通过'},
          {value: 'OrderWorkflow/auditRecheckPass', label: '复审通过'}
        ],
        search: {},
        ownershipList: [],

        productList: [
          {title: '产品名称', label: 'pro_name'},
          {title: '規格', label: 'standard'},
          {title: '单位', label: 'unit'},
          {title: '零售价', label: 'price'},
          {title: '折扣', label: 'discount'},
          {title: '进货价', label: 'purchasing_price'},
          {title: '订单数量', label: 'number'},
          {title: '订货总价', label: 'total_price'},
          {title: '条码', label: 'barcode'},
          {title: '箱规', label: 'box_standard'}
        ],
        exportLoading: false,
        // 退款审核/关闭 弹窗
        refundAudit: {
          modal: false,
          btnLoading: false,
          loading: false,
          type: '',
          title: '--',
          typeName: '',
          data: {
            opinion: '',
            number: ''
          },
          submitData: {
            is_pass: '',
            opinion: ''
          }
        },
        orderType: [
          {value: 'backstage', label: '后台添加'},
          {value: 'MiniProgram', label: '小程序订单'}
        ],
        auditStatus: [
          {value: 'OrderRefundWorkFlow/auditPending', label: '待初审'},
          {value: 'OrderRefundWorkFlow/auditRecheckPending', label: '待复审'},
          {value: 'OrderRefundWorkFlow/auditFailure', label: '初审不通过'},
          {value: 'OrderRefundWorkFlow/auditRecheckFailure', label: '复审不通过'},
          {value: 'OrderRefundWorkFlow/waitingRefund', label: '待财务退款'},
          {value: 'OrderRefundWorkFlow/refunded', label: '财务已退款'},
        ],
        translateAuditStatus: {
          auditPending: '待初审',
          auditFailure: '初审不通过',
          auditRecheckPending: '待复审',
          auditRecheckFailure: '复审不通过',
          waitingRefund: '待财务退款',
          refunded: '财务已退款'
        },
        // 订单来源
        orderForm: {
          MiniProgram: '小程序',
          backstage: '后台'
        },
        // 列表分页属性
        pageProps: {
          page: 1,
          perPage: 10,
          currentPage: 1,
          totalCount: 0,

        },
        reviewData: [],
        // 列表表格
        refundColumns: [
          {
            type: 'selection',
            width: 60,
            align: 'center',
            fixed: 'left',
            filterMultiple: false
          },
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
          {title: '支付编号', key: 'pay_sn', minWidth: 180, align: 'center'},
          {title: '退款编号', key: 'refund_sn', minWidth: 180, align: 'center'},
          {
            title: '申请时间',
            key: 'created_at',
            minWidth: 100,
            align: 'center',
            render: (h, params) => {
              return h('div', {}, this.formatDate(params.row.created_at));
            }

          },
          {title: '商家名称', key: 'merchant_name', minWidth: 180, align: 'center'},
          {
            key: 'id',
            title: '订单号',
            minWidth: 180,
            sortable: true,
            align: 'center',
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    this.$router.push({
                      path: '/order-management/review-details',
                      query: {id: params.row.order_id}
                    });
                  }
                }
              }, params.row.order_sn);
            }
          },
          {title: '订单来源', key: 'order_form_desc', minWidth: 90, align: 'center'},
          {
            title: '货号',
            key: 'product',
            minWidth: 170,
            align: 'center',
            ellipsis: true,
            render: (h, params) => {
              return h('div', {
                attrs: {
                  class: 'sub-col'
                }
              }, [
                h('ul', params.row.orderProduct.map((item, value, index) => {
                  return h('li', {}, item.item_no);
                }))
              ]);
            }
          },
          {
            title: '数量',
            key: 'product',
            minWidth: 100,
            align: 'center',
            ellipsis: true,
            render: (h, params) => {
              return h('div', {
                style: {
                  listStyle: 'none'
                },
                attrs: {
                  class: 'sub-col'
                }
              }, [
                h('ul', params.row.orderProduct.map((item, value, index) => {
                  return h('li', {}, parseInt(item.number));
                }))
              ]);
            }
          },
          {title: '订单金额', key: 'total_order_amount', minWidth: 120, align: 'center'},
          {
            title: '申请来源',
            key: 'apply_source_desc',
            minWidth: 90,
            align: 'center'
          },
          {title: '退款申请人', key: 'created_by', minWidth: 120, align: 'center'},

          {
            title: '审核状态',
            key: 'status_desc',
            minWidth: 100,
            align: 'center',
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    this.auditDetails.modal = true;
                    this.auditDetails.loading = true;
                    this.$api.orderRefundDetails(params.row.id)
                      .then(res => {
                        this.auditDetails.loading = false;
                        if (res.code == 0) {
                          this.auditDetails.data = res.data;
                          this.auditDetails.data.created_at = this.formatDate(res.data.created_at);
                          let data = this.auditDetails.data;
                          data.refund_at_desc = this.formatDate(data.refund_at)
                          if (data.auditItems !== undefined && data.auditItems.length > 0) {
                            data.auditItems.map(item => {
                              item.created_at = this.formatDate(item.created_at);
                              item.audit_pass_desc = this.filterAuditStatus(item.status, item.audit_pass)
                            })
                          } else if (data.auditItems !== undefined && data.auditItems.length == 0) {
                            let item = {
                              created_by: '暂无',
                              audit_pass_desc: '暂无',
                              created_at: '暂无',
                              opinion: '暂无'
                            };
                            data.auditItems.push(item)
                          }

                          this.auditDetails.data = data;
                        } else {

                        }
                      });
                  }
                }
              }, params.row.status_desc);
            }
          },
          {
            title: '服务进度',
            key: 'service_progress_desc',
            minWidth: 110,
            align: 'center'
          },
          {title: '退款金额', key: 'actual_refund_amount', minWidth: 120, align: 'center'},
          {
            title: '退款时间',
            key: 'refund_at_desc',
            minWidth: 100,
            align: 'center'
          },
          {title: '退款理由', key: 'reason', minWidth: 120, align: 'center'},

          {
            key: 'action',
            title: '操作',
            width: 100,
            align: 'center',
            slot: 'action'
          }
        ],
        loading: false,
        disposeList: [
          {value: 'undisposed', label: '未处理'},
          {value: 'disposed', label: '已处理'},
          {value: 'exception_handling', label: '异常处理'}
        ],
        ruleValidate: {
          is_pass: [{required: true, message: '该选项不能为空', trigger: 'change'}],
          opinion: [
            {required: true, message: '该选项不能为空', trigger: 'blur'},
          ]
        }
      };
    },
    computed: {
      orderId_refundAudit: {
        get: function () {
          return !this.refundAudit.data.order_sn ? '暂无' : this.refundAudit.data.order_sn // 订单号
        },
        set: function (value) {
          this.refundAudit.data.order_sn = value
        }
      },
      merchantName_refundAudit: {
        get: function () {
          return !this.refundAudit.data.merchant_name ? '暂无' : this.refundAudit.data.merchant_name; // 合作商
        },
        set: function (value) {
          this.refundAudit.data.merchant_name = value
        }
      },
      totalOrderAmount_refundAudit: {
        get: function () {
          return !this.refundAudit.data.total_order_amount ? '暂无' : this.refundAudit.data.total_order_amount; // 订单金额
        },
        set: function (value) {
          this.refundAudit.data.total_order_amount = value
        }
      },
      createdAt_refundAudit: {
        get: function () {
          return !this.refundAudit.data.created_at ? '暂无' : this.refundAudit.data.created_at; // 申请时间
        },
        set: function (value) {
          this.refundAudit.data.created_at = value
        }
      },
      applySourceDesc_refundAudit: {
        get: function () {
          return !this.refundAudit.data.apply_source_desc ? '暂无' : this.refundAudit.data.apply_source_desc; // 申请来源
        },
        set: function (value) {
          this.refundAudit.data.apply_source_desc = value
        }
      },
      createdBy_refundAudit: {
        get: function() {
          return !this.refundAudit.data.created_by ? '暂无' : this.refundAudit.data.created_by; // 申请人
        },
        set: function (value) {
          this.refundAudit.data.created_by = value
        }
      },
      refundableAmount_refundAudit: {
        get: function () {
          return !this.refundAudit.data.refundable_amount ? '暂无' : this.refundAudit.data.refundable_amount; // 退款金额
        },
        set: function (value) {
          this.refundAudit.data.refundable_amount = value
        }
      },
      reason_refundAudit: {
        get: function ()  {
          return !this.refundAudit.data.reason ? '暂无' : this.refundAudit.data.reason; // 退款理由 
        },
        set: function (value) {
          this.refundAudit.data.reason = value
        }
      },
      orderId_auditDetails: {
        get: function () {
          return !this.auditDetails.data.order_sn ? '暂无' : this.auditDetails.data.order_sn // 订单号
        },
        set: function (value) {
          this.auditDetails.data.order_sn = value
        }
      },
      merchantName_auditDetails: {
        get: function () {
          return !this.auditDetails.data.merchant_name ? '暂无' : this.auditDetails.data.merchant_name; // 合作商
        },
        set: function (value) {
          this.auditDetails.data.merchant_name = value
        }
      },
      totalOrderAmount_auditDetails: {
        get: function () {
          return !this.auditDetails.data.total_order_amount ? '暂无' : this.auditDetails.data.total_order_amount; // 订单金额
        },
        set: function (value) {
          this.auditDetails.data.total_order_amount = value
        }
      },
      createdAt_auditDetails: {
        get: function () {
          return !this.auditDetails.data.created_at ? '暂无' : this.auditDetails.data.created_at; // 申请时间
        },
        set: function (value) {
          this.auditDetails.data.created_at = value
        }
      },
      applySourceDesc_auditDetails: {
        get: function () {
          return !this.auditDetails.data.apply_source_desc ? '暂无' : this.auditDetails.data.apply_source_desc; // 申请来源
        },
        set: function (value) {
          this.auditDetails.data.apply_source_desc = value
        }
      },
      createdBy_auditDetails: {
        get:function() {
          return !this.auditDetails.data.created_by ? '暂无' : this.auditDetails.data.created_by; // 申请人
        },
        set: function (value) {
          this.auditDetails.data.created_by = value
        }
      },
      refundableAmount_auditDetails: {
        get: function () {
          return !this.auditDetails.data.refundable_amount ? '暂无' : this.auditDetails.data.refundable_amount; // 退款金额
        },
        set: function (value) {
          this.auditDetails.data.refundable_amount = value
        }
      },
      reason_auditDetails: {
        get: function ()  {
          return !this.auditDetails.data.reason ? '暂无' : this.auditDetails.data.reason; // 退款理由 
        },
        set: function (value) {
          this.auditDetails.data.reason = value
        }
      }
    },
    methods: {
      changeTime(e, remark) {
        remark === 'start' ? this.search.startTime = e : this.search.endTime = e;
        this.getList();
      },
      exportData() {
        // 判断是否有勾选列表项 || 是否有筛选搜索条件
        let checkList = this.checkList;
        let isEmpty = true; // 搜索区是否为空  默认为空
        let obj = this.search
        for (let i in obj) {
          if (!obj[i] || obj[i] == '') {
            isEmpty = true;
          } else {
            isEmpty = false;
            break;
          }
        }
        if (checkList.length == 0 && isEmpty) {
          return void this.$Message.error('请选择导出条件');
        }
        let params = {};
        params = {...this.search};
        let ids = []
        checkList.map(item => {
          if (item.id) {
            ids.push(Number(item.id));
          }
        })
        params.ids = ids;
        // if (isEmpty) {

        // }
        this.exportLoading = true;
        this.$api.orderRefundExport(params)
          .then(res => {
            if (res.code === 0) {
              let url = res.data[0]
              window.location.href = url;
              setTimeout(() => {
                this.$Message.success(res.message);
                this.exportLoading = false;
              }, 500)
            }
          });
      },
      // 退款审核
      confirmRefund(name) {
        this.$refs[name].validate((valid) => {
          if (!valid) {
            this.$Message.error('必填项不能为空!');
            return false;
          }
          let params = this.refundAudit.submitData
          params.id = this.refundAudit.data.id;
          this.refundAudit.btnLoading = true;
          if (this.refundAudit.type == 'first') {
            this.$api.orderRefundAudit(params)
              .then(res => {
                this.refundAudit.btnLoading = false;
                if (res.code === 0) {
                  this.$Message.success(res.message);
                  this.refundAudit.btnLoading = false;
                  this.refundAudit.modal = false;
                  this.getList();
                }
              });
          } else {
            this.$api.orderRefundAuditSec(params)
              .then(res => {
                this.refundAudit.btnLoading = false;
                if (res.code === 0) {
                  this.$Message.success(res.message);
                  this.refundAudit.btnLoading = false;
                  this.refundAudit.modal = false;
                  this.getList();
                }
              });
          }
        })
      },
      init() {
        // 加载所有权
        this.$api.getOwnership().then(res => {
          this.ownershipList = res;
        });
        this.getList();
      },
      // 查询
      getList(name) {
        let params;
        this.loading = true;
        params = JSON.parse(JSON.stringify(this.search));
        if (name == 'search') {
          this.pageProps.page = 1
        }
        params.page = this.pageProps.page;
        params.perPage = this.pageProps.perPage;
        this.firstEntry ? this.firstEntry = !this.firstEntry : delete params.id_collect // fix:从首页进来之后再筛选数据查询不准确
        this.checkList = []
        this.$api.orderRefundList(params)
          .then(res => {
            this.loading = false;
            this.reviewData = res.items;
            if (res._meta) {
              this.pageProps.totalCount = res._meta.totalCount;
              this.pageProps.currentPage = res._meta.currentPage;
            }
          });

      },
      // 获取被选中的列表
      selectCheck(selection) {
        this.checkList = selection;
      },
      filterAuditStatus(status, pass) {
        if (status == 'auditPending') {
          if (pass == '1') {
            return '初审通过'
          } else if (pass == '0') {
            return '初审不通过'
          }
        }
        if (status == 'auditRecheckPending') {
          if (pass == '1') {
            return '复审通过'
          } else if (pass == '0') {
            return '复审不通过'
          }
        }
      },
      // 初审/复审  打开弹窗，请求详情
      tapAudit(type) {
        let checkList = this.checkList;
        if (checkList.length === 0) {
          return void this.$Message.warning('请选择！');
        } else if (checkList.length >= 2) {
          return void this.$Message.warning('只能选中一条！');
        }
        if (type == 'first' && checkList[0].status !== 'OrderRefundWorkFlow/auditPending' && checkList[0].status !== 'OrderRefundWorkFlow/auditRecheckFailure') {
          return void this.$Message.warning('请选择待初审或复审不通过状态！');
        }
        if (type == 'sec' && checkList[0].status !== 'OrderRefundWorkFlow/auditRecheckPending') {
          return void this.$Message.warning('请选择待复审状态！');
        }
        this.refundAudit.submitData = {
          is_pass: '',
          opinion: ''
        }
        this.$refs['refundAudit1'].resetFields();
        // 初审
        if (type === 'first') {
          this.refundAudit.title = '退款初审';
          this.refundAudit.subTitle = '初审意见';
          this.refundAudit.typeName = '初审';
        }
        if (type === 'sec') {
          this.refundAudit.title = '退款复审';
          this.refundAudit.subTitle = '复审意见';
          this.refundAudit.typeName = '复审';
        }
        this.refundAudit.type = type;
        this.refundAudit.modal = true;
        this.refundAudit.loading = true;
        this.$api.orderRefundDetails(checkList[0].id)
          .then(res => {
            this.refundAudit.loading = false;
            if (res.code == 0) {
              this.refundAudit.data = res.data;
              this.refundAudit.data.created_at = this.formatDate(res.data.created_at);
              let data = this.refundAudit.data
              if (data.auditItems) {
                data.auditItems.map(item => {
                  item.created_at = this.formatDate(item.created_at);
                  item.audit_pass_desc = this.filterAuditStatus(item.status, item.audit_pass);
                })
                this.refundAudit.data = data;
              }
            } else {

            }
          });
      },
      // 转换时间格式
      formatDate(time, json) {
        if (json === 'ymd') {
          return this.$format(time, 'yyyy-MM-dd');
        } else {
          return this.$format(time, 'yyyy-MM-dd hh:mm');
        }
      },
      changePage(e) {
        this.pageProps.page = e;
        this.getList();
      },
      changePageSize(e) {
        this.pageProps.perPage = e;
        this.getList();
      },
      // 操作栏的编辑
      handleEdit(id) {
        this.$router.push({
          path: '/order-management/review-edit',
          query: {id: id}
        });
      },
      // 删除信息
      handleDelete(row, id) {
        // 删除
        this.$api.orderRefundDelete(id)
          .then(res => {
            if (res.code == 0) {
              this.$Message.success(res.message);
              this.getList();
            }
          });
      },
    },
    activated() {
      let status = this.$route.query.status||'';
      if (status) {
        this.search.status = status;
      }else{
        this.search.status = '';

      }
      let idCollect=this.$route.query.id_collect||'';
      if(idCollect){
        this.search.id_collect = idCollect;
      }else{
        this.search.id_collect = '';

      }

      this.init();
    },
    watch:{
      $route:{
        deep: true,
        handler:function(newVal,oldVal){
          if(oldVal.name == newVal.name && Object.keys(newVal.query)){
              this.search = {} 
              this.getList()
          }
        }
      }
    }
  };
</script>
<style lang="less">
  .sub-col ul li {
    list-style: none;
    padding-top: 4px;
    padding-bottom: 4px;
  }

  .remark-input > input {
    text-align: center;
    border: 0;
    outline: none;
    width: 500px;
  }
</style>
