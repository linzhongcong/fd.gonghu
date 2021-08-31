<template>
  <div>
    <Card>
      <Row slot="title">
        <Col :sm="24">
          <Form ref="search" :model="search" class="search">
            <Row  @keydown.native.enter.prevent="getList('search')">
              <Col :sm="19" style="">
                <FormItem>
                  <Input v-model="search.service_sn" placeholder="售后编号" clearable></Input>
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
              </Col>
              <Col :sm="5" :xs="7" style="text-align:right;">
                <Button type="primary" icon="ios-search" @click="getList('search')">查询</Button>
                <!--                             <Button type="default" icon="md-repeat" @click="getList(false)" >重置</Button>-->
              </Col>
            </Row>
          </Form>
        </Col>
        <Col :sm="24">
          <Button type="primary" @click="tapAudit('audit')">审核</Button>
          <Button type="primary" @click="tapAudit('close')">售后关闭</Button>
        </Col>
      </Row>
      <Row class="margin-top-10">
        <Table class="review-list" border highlight-row :columns="serviceColumns" :data="serviceTableData"
               @on-selection-change="selectCheck" :loading="loading" size="small">
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
    <!-- 审核/关闭弹窗 -->
    <Modal v-model="serviceData.modal" :title="serviceData.title" width="900" class="service-modal">
      <div class="rel">
        <Form ref="serviceData" :model="serviceData.submitData" label-position="top">
          <Row>
            <Col :md="6">
              <FormItem label="订单号" prop="num">
                <Input v-model="serviceData.data.order_sn" disabled></Input>
              </FormItem>
            </Col>
            <Col :md="6">
              <FormItem label="合作商" prop="num">
                <Input v-model="serviceData.data.merchant_name" disabled></Input>
              </FormItem>
            </Col>
            <Col :md="6">
              <FormItem label="订单金额">
                <Input v-model="serviceData.data.total_order_amount" disabled></Input>
              </FormItem>
            </Col>
            <Col :md="6">
              <FormItem label="申请时间">
                <Input v-model="serviceData.data.created_at" disabled></Input>
              </FormItem>
            </Col>
            <Col :md="6">
              <FormItem label="申请来源">
                <Input v-model="serviceData.data.apply_source_desc" disabled></Input>
              </FormItem>
            </Col>
            <Col :md="6">
              <FormItem label="申请人">
                <Input v-model="serviceData.data.created_by" disabled></Input>
              </FormItem>
            </Col>
            <Col :md="6">
              <FormItem label="售后类型">
                <Input v-model="serviceData.data.service_type" disabled></Input>
              </FormItem>
            </Col>
            <Col :md="6">
              <FormItem label="申请原因">
                <Input v-model="serviceData.data.service_reason" disabled></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :md="24">
              <FormItem label="图片凭证">
                <template v-if="serviceData.data.fileItems">
                  <div
                  style="min-height: 200px;max-height: 320px;overflow-y: auto;overflow-x: hidden;border:1px solid #dcdee2">
                    <a target="_blank" style="margin-right: 6px" :href="fileUrl+ '/'+imgItem.url"
                       v-for="(imgItem) in serviceData.data.fileItems" :key="imgItem.id">
                      <img :src="fileUrl+'/'+imgItem.url" width="300px" height="auto"
                           :title="imgItem.title+'.'+ imgItem.extension" alt="">
                    </a>
                  </div>
                </template>
                <div v-else>暂无</div>
              </FormItem>
            </Col>
          </Row>
          <Row v-if="serviceData.type==='view'">
            <Col :md="6">
              <FormItem label="售后状态" :rules="{required: false}">
                <Input v-model="serviceData.data.status_desc" disabled></Input>
              </FormItem>
            </Col>
            <Col :md="6">
              <FormItem label="售后审核人">
                <Input v-model="serviceData.data.audit_by" disabled></Input>
              </FormItem>
            </Col>
            <Col :md="6">
              <FormItem label="售后审核时间">
                <Input v-model="serviceData.data.audit_at_desc" disabled></Input>
              </FormItem>
            </Col>
            <Col :md="24">
              <FormItem :label="serviceData.data.status_desc.indexOf('关闭') > -1 ? '关闭意见' : '审核意见'">
                <Input v-model="serviceData.data.opinion" disabled></Input>
              </FormItem>
            </Col>
          </Row>
          <Row v-if="serviceData.type !=='view'">
            <Col :md="24">
              <FormItem :label="serviceData.subTitle" prop="opinion"
                        :rules="{required: true, message: '该选项不能为空', trigger: 'blur'}">
                <Input v-model="serviceData.submitData.opinion" :placeholder="serviceData.placeholder"></Input>
              </FormItem>
            </Col>
          </Row>
          <Spin fix v-show="serviceData.loading"></Spin>

        </Form>
      </div>
      <div slot="footer">
        <Button @click="serviceData.modal=false">
          {{serviceData.type !== 'view' ? '取消' : '关闭'}}
        </Button>
        <Button 
        type="primary" 
        :loading="serviceData.btnLoading" 
        @click="confirmRefund('serviceData')"
        v-if="serviceData.type !== 'view'" >
        {{serviceData.type=='close' ? '确认关闭' : '确认售后'}}
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {SERVER_BASE_URL} from '~/api/config';

  export default {
    name: 'service',
    data() {
      return {
        firstEntry: true,
        // 发货信息-发货方式
        deliveryModeList: {
          express: '快递',
          logistics: '物流',
          null: '未知'
        },
        fileUrl: SERVER_BASE_URL,
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
        // 退款审核/关闭 弹窗
        serviceData: {
          btnLoading: false,
          modal: false,
          placeholder: '',
          type: '',
          title: '--',
          data: {
            opinion: '',
          },
          submitData: {
            opinion: '',
          },
          loading: false
        },
        orderType: [
          {
            value: 'backstage',
            label: '后台添加'
          },
          {
            value: 'MiniProgram',
            label: '小程序订单'
          }
        ],
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
        serviceTableData: [],
        // 列表表格
        serviceColumns: [
          {type: 'selection', width: 60, align: 'center', fixed: 'left', filterMultiple: false},
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
          {title: '售后编号', key: 'service_sn', minWidth: 180, align: 'center'},
          {
            title: '申请时间',
            key: 'order_time',
            minWidth: 100,
            align: 'center',
            render: (h, params) => {
              return h('span', this.formatDate(params.row.created_at, 'ymd'));
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
          {title: '申请来源', key: 'apply_source_desc', minWidth: 90, align: 'center'},
          {title: '售后申请人', key: 'created_by', minWidth: 120, align: 'center'},
          {
            title: '售后状态',
            key: 'status_desc',
            minWidth: 100,
            align: 'center',
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    this.tapAudit('view', params.row.id)
                  }
                }
              }, params.row.status_desc);
            }
          },
          {title: '售后类型', key: 'service_type', minWidth: 120, align: 'center'},
          {
            title: '图片凭证',
            key: 'order_time',
            minWidth: 120,
            align: 'center',
            render: (h, params) => {
              return h('div', params.row.fileItems.map((item, value, index) => {
                return h('a', {
                  style: {
                    display: 'block',
                  },
                  attrs: {
                    href: this.fileUrl + '/' + item.url,
                    target: '_blank'
                  }
                }, item.title + '.' + item.extension);
              }));
            }
          },
          {title: '申请售后原因', key: 'service_reason', minWidth: 120, align: 'center'},
          {title: '审核意见', key: 'opinion', minWidth: 100, align: 'center'},
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
        ]
      };
    },
    methods: {
      // 确认
      confirmRefund(name) {
        this.$refs[name].validate((valid) => {
          if (!valid) {
            this.$Message.error('必填项不能为空!');
            return false;
          }
          let params = this.serviceData.submitData;
          params.id = Number(this.serviceData.data.id);
          this.serviceData.btnLoading = true;
          if (this.serviceData.type == 'audit') {
            this.$api.orderServiceAudit(params)
              .then(res => {
                this.serviceData.btnLoading = false;
                if (res.code == 0) {
                  this.$Message.success(res.message)
                  this.serviceData.modal = false;
                  this.getList();
                }
              });
          } else {
            this.$api.orderServiceClose(params)
              .then(res => {
                this.serviceData.btnLoading = false;
                if (res.code == 0) {
                  this.$Message.success(res.message)
                  this.serviceData.modal = false;
                  this.getList();
                }
              });
          }

        })
      },
      init() {
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
        this.$api.orderServiceList(params)
          .then(res => {
            this.loading = false;
            this.serviceTableData = res.items;
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
      // 售后审核   请求详情
      tapAudit(type, id) {
        let checkList = this.checkList;

        if (type !== 'view') {
          if (checkList.length === 0) {
            return void this.$Message.warning('请选择！');
          } else if (checkList.length >= 2) {
            return void this.$Message.warning('只能选中一条！');
          }
          this.$refs['serviceData'].resetFields();
        }

        this.serviceData.type = type;
        this.serviceData.modal = true;
        let serviceId = '';
        if (type == 'close') {
          this.serviceData.title = '售后关闭';
          this.serviceData.subTitle = '关闭理由';
          this.serviceData.placeholder = '已确认无漏货！';
          serviceId = checkList[0].id
        } else if (type === 'audit') {
          this.serviceData.title = '售后审核';
          this.serviceData.subTitle = '审核意见';
          this.serviceData.placeholder = '已确认，请注意查收相关补发订单；';
          serviceId = checkList[0].id

        } else {
          this.serviceData.title = '售后详情';
          this.serviceData.subTitle = '审核意见';
          serviceId = id;
        }
        this.serviceData.loading = true;
        this.$api.orderServiceDetails(serviceId)
          .then(res => {
            this.serviceData.loading = false;
            if (res.code == 0) {
              this.serviceData.data = res.data;
              this.serviceData.data.created_at = this.formatDate(res.data.created_at);
              this.serviceData.data.audit_at_desc = this.formatDate(res.data.audit_at);

            }
          });

      },
      // 转换时间格式
      formatDate(time, json) {
        if (json === 'ymd') {
          return this.$format(time, 'yyyy-MM-dd ');
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
      handleDelete(id) {
        this.$api.orderServiceDelete(id)
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
  .service-modal /deep/ .ivu-modal-body {
    height: 600px;
    overflow: hidden;
    overflow-y: auto;
  }

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
