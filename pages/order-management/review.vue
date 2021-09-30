<template>
  <div class="review">
    <Card>
      <div slot="title">
        <Row type="flex" justify="space-between" @keydown.enter.native="getList('new')">
          <Col :md="21">
            <Select v-model="searchData.ownership" placeholder="数据权限范围" @on-change="getList('new')">
              <Option v-for="(item, index) in dataPermissionRange" :value="item.value" :label="item.label" :key="`dataPermissionRange${index}`"></Option>
            </Select>
            <Input v-model="searchData.orderSn" placeholder="订单编号" clearable />
            <Input v-model="searchData.createdBy" placeholder="创建人" clearable />
            <Input v-model="searchData.merchantName" placeholder="商家名称" clearable />
            <Select v-model="searchData.orderForm" placeholder="订单来源" clearable @on-change="getList('new')">
              <Option v-for="(item, index) in orderFormOptions" :value="item.value" :label="item.label" :key="`orderFormOptions${index}`"></Option>
            </Select>
            <Select v-model="searchData.status" placeholder="状态" clearable @on-change="getList('new')">
              <Option v-for="(item, index) in statusOptions" :value="item.value" :label="item.label" :key="`statusOptions${index}`"></Option>
            </Select>
          </Col>
          <Col :md="3" style="text-align: right;">
            <Button type="primary" icon="ios-search" @click="getList('new')">查询</Button>
          </Col>
          <Col :md="24">
            <Button type="primary" @click="goToOrderEditPage(null)">添加</Button>
            <Button type="primary" @click="handleShowDealModal">处理</Button>
            <Button type="primary" @click="handleShowAuditModal('manage')">初审</Button>
            <Button type="primary" @click="handleShowAuditModal('director')">复审</Button>
            <Button type="primary" @click="handleShowInvalidModal">作废</Button>
            <Button type="primary" @click="goToReplacement">添加补发订单</Button>
            <Button type="primary" @click="handleExportData">导出数据</Button>
          </Col>
        </Row>
      </div>
      <div class="margin-top-10">
        <Table
          border
          highlight-row
          size="small"
          max-height='635'
          :data="tableList"
          :columns="tableColumns"
          :loading="tableLoading"
          @on-selection-change="tableOnSelectionChange"
        >
          <template slot-scope="{ row }" slot="action">
            <Tooltip placement="top" content="编辑" transfer>
              <Button type="primary" @click="goToOrderEditPage(row.id, row.status.split('/')[1])" size="small" :disabled="row.status === 'OrderWorkflow/cancel'" v-permission="'/v1/order/update'">
                <Icon type="md-create"/>
              </Button>
            </Tooltip>
            <Poptip confirm title="您确认删除这条内容吗？" @on-ok="handleDelete(row.id)" transfer>
              <Button size="small" :disabled="!['OrderWorkflow/draft', 'OrderWorkflow/cancel'].includes(row.status)" v-permission="'/v1/order/delete'">
                <Icon type="md-trash"/>
              </Button>
            </Poptip>
          </template>
        </Table>
        <div style="margin: 10px;overflow: hidden">
          <div class="pages-L">共 {{ pageProps.totalCount }} 条</div>
          <div style="float: right;">
            <Page
              show-sizer
              show-elevator
              size="small"
              :total="pageProps.totalCount"
              :current="pageProps.page"
              @on-change="(e) => pagerOnChange('page', e)"
              @on-page-size-change="(e) => pagerOnChange('perPage', e)">
            </Page>
          </div>
        </div>
      </div>
    </Card>

    <!-- 处理弹窗 start -->
    <OrderDealModal
      :show="dealModalObj.show"
      :data="dealModalObj.data"
      :remote-method="queryShippingDeb"
      :remote-loading="dealModalObj.remoteLoading"
      :remote-data-list="dealModalObj.remoteDataList"
      @on-ok="dealOnOk"
      @on-cancel="dealModalObj.show = false">
    </OrderDealModal>
    <!-- 处理弹窗 end -->

    <!-- 审核弹窗 start -->
    <OrderAuditModal
      :type="auditModalObj.type"
      :show="auditModalObj.show"
      :data="auditModalObj.data"
      :spin-loading="auditModalObj.spin"
      :submitting="auditModalObj.submitting"
      @on-ok="auditOnOk"
      @on-cancel="auditModalObj.show = false"
      @on-show-policy="handleShowPolicy">
    </OrderAuditModal>
    <!-- 审核弹窗 end -->

    <!-- 供货政策详情 start -->
    <PolicyAuditModal
      hide-auditer
      :show="policyModalObj.show"
      :data="policyModalObj.data"
      :spin-loading="policyModalObj.spinLoading"
      @on-ok="() => policyModalObj.show = false"
      @on-cancel="policyModalObj.show = false">
    </PolicyAuditModal>
    <!-- 供货政策详情 end -->

    <!-- 作废弹窗 start -->
    <OrderInvalidModal
      :id="invalidModalObj.id"
      :show="invalidModalObj.show"
      :submitting="invalidModalObj.submitting"
      @on-ok="invalidOnOk"
      @on-cancel="invalidModalObj.show = false">
    </OrderInvalidModal>
    <!-- 作废弹窗 end-->

    <!-- 导出数据弹窗 start -->
    <OrderExportModal
      :show="exportModalObj.show"
      :submitting="exportModalObj.submitting"
      @on-ok="exportOnOk"
      @on-cancel="exportModalObj.show = false">
    </OrderExportModal>
    <!-- 导出数据弹窗 end -->
  </div>
</template>

<script>
import globalMixin from '@/plugins/mixin.js';
import { formatOrderFrom, formatPaymentMethod, formatStatus, foramtReceivablesStatus, formatDisposeStatus } from '@/utils/order.js'
import OrderDealModal from '@/components/order-management/order-deal-modal.vue';
import OrderAuditModal from '@/components/order-management/order-audit-modal.vue';
import OrderExportModal from '@/components/order-management/order-export-modal.vue';
import OrderInvalidModal from '@/components/order-management/order-invalid-modal.vue';
import PolicyAuditModal from '@/components/policy/policy-audit-modal.vue';
export default {
  name: 'review',
  mixins: [globalMixin],
  components: {
    OrderDealModal,
    OrderAuditModal,
    OrderExportModal,
    OrderInvalidModal,
    PolicyAuditModal,
  },
  data() {
    return {
      // 查询参数
      searchData: {
        ownership: 'company',
      },
      pageProps: {
        page: 1,
        perPage: 10,
        totalCount: 0,
      },

      // 表格数据
      tableLoading: false,
      tableList: [], // 表格数据
      tableColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
          fixed: 'left',
        },
        {
          title: '序号',
          type: 'index',
          width: 70,
          align: 'center',
          fixed: 'left',
        },
        {
          title: '订单编号',
          minWidth: 200,
          fixed: 'left',
          align: 'center',
          render: (h, { row }) => {
            return h('a', {
              on: {
                click: () => row.status !== 'OrderWorkflow/draft' && this.$router.push(`/order-management/review-details?id=${row.id}`)
              }
            }, row.orderSn);
          }
        },
        {
          title: '创建人',
          key: 'createdBy',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '商家名称',
          key: 'merchantName',
          minWidth: 200,
          align: 'center'
        },
        {
          title: '系统/门店',
          key: 'systemName',
          minWidth: 200,
          align: 'center'
        },
        {
          title: '订单二维码',
          minWidth: 100,
          align: 'center',
          render: (h, { row }) => {
            const src = row.qrCode;
            return h('img', {
              domProps: { src },
              style: {
                width: '80%',
                padding: '8px',
                '-webkit-user-select': 'none'
              },
              on: {
                click: () => {
                  this.$Modal.info({
                    content: `<img src="${src}" style="padding-right: 40px;margin-top: 40px;minWidth: 100%" />`,
                    closable: true
                  })
                }
              }
            });
          }
        },
        {
          title: '订单来源',
          key: 'orderFromText',
          minWidth: 90,
          align: 'center',
        },
        {
          title: '下单时间',
          key: 'orderTime',
          minWidth: 100,
          align: 'center',
        },
        {
          title: '货号',
          minWidth: 300,
          align: 'center',
          ellipsis: true,
          render: (h, { row }) => {
            return h('div', {
              attrs: {
                class: 'sub-col'
              }
            }, [
              h('ul', row.pageProductList.map((item, value, index) => {
                return h('li', {}, item.itemNo);
              }))
            ]);
          }
        },
        {
          title: '数量',
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
              h('ul', params.row.pageProductList.map((item, value, index) => {
                return h('li', {}, parseInt(item.number));
              }))
            ]);
          }
        },
        {
          title: '结款方式',
          key: 'paymentMethodText',
          minWidth: 120,
          align: 'center',
        },
        {
          title: '订单金额',
          key: 'totalOrderAmount',
          minWidth: 150,
          align: 'center'
        },
        {
          title: '状态',
          key: 'statusText',
          minWidth: 120,
          align: 'center',
        },
        {
          title: '收款状态',
          key: 'receivablesStatusText',
          minWidth: 120,
          align: 'center',
        },
        {
          title: '导单状态',
          key: 'disposeStatusText',
          minWidth: 120,
          align: 'center',
        },
        {
          title: '导单处理时间',
          key: 'disposeTime',
          minWidth: 180,
          align: 'center',
        },
        {
          title: '操作',
          fixed: 'right',
          minWidth: 120,
          align: 'center',
          slot: 'action'
        }
      ],
      checkList: [], // 选中数据

      // 处理弹窗集合
      dealModalObj: {
        show: false,
        data: {},
        remoteLoading: false,
        remoteDataList: []
      },

      // 审核弹窗集合
      auditModalObj: {
        show: false,
        spin: false,
        submitting: false,
        type: 'manage',
        data: {
          productList: [],
          giftList: [],
        },
      },

      // 作废弹窗集合
      invalidModalObj: {
        id: '',
        show: false,
        submitting: false,
      },

      // 导出数据集合
      exportModalObj: {
        show: false,
        submitting: false,
      },

      // 政策详情弹窗集合
      policyModalObj: {
        show: false,
        spinLoading: false,
        data: {
          baseDiscountList: [],
          giftDiscountList: [],
          regularContractorList: [],
          matchingDiscountList: [],
          productDiscountList: [],
        },
      },

      // 下拉框选项
      orderFormOptions: [
        { value: 'backstage', label: '后台' },
        { value: 'dingTalk', label: '钉钉' },
      ],
      statusOptions: [
        { value: 'OrderWorkflow/wait', label: '待处理' },
        { value: 'OrderWorkflow/reject', label: '驳回' },
        { value: 'OrderWorkflow/auditPending', label: '待初审' },
        { value: 'OrderWorkflow/auditFailure', label: '初审不通过' },
        { value: 'OrderWorkflow/auditRecheckPending', label: '待复审' },
        { value: 'OrderWorkflow/auditRecheckFailure', label: '复审不通过' },
        { value: 'OrderWorkflow/auditRecheckPass', label: '复审通过' },
        { value: 'OrderWorkflow/cancel', label: '作废' },
        { value: 'OrderWorkflow/draft', label: '草稿' },
      ],

      queryShippingDeb: () => {},
    }
  },
  methods: {
    /**
     * 获取列表数据
     * @param {String} type: 查询类型 new/查新 
     */
    async getList(type = '') {
      this.tableLoading = true;
      let params = { ...this.searchData, page: this.pageProps.page, perPage: this.pageProps.perPage };
      !!type && (params.page = 1);
      try {
        let { code, data } = await this.$api.orderReviewList(params);
        if (code === 0) {
          data.list.forEach(item => {
            item.orderFromText = formatOrderFrom(item.orderFrom);
            item.paymentMethodText = formatPaymentMethod(item.paymentMethod);
            item.statusText = formatStatus(item.status);
            item.receivablesStatusText = foramtReceivablesStatus(item.receivablesStatus);
            item.disposeStatusText = formatDisposeStatus(item.disposeStatus);
          });

          this.pageProps.page = data.currentPage;
          this.pageProps.totalCount = data.totalCount;
          this.tableList = data.list;
        }
      } catch (error) {}
      this.tableLoading = false;
      this.checkList = [];
    },

    /**
     * 删除列表数据
     * @param {String|Number} id: 数据id
     */
    async handleDelete(id) {
      this.tableLoading = true;
      try {
        let { code } = await this.$api.orderReviewDelete({id});
        if (code === 0) {
          this.$Message.success('删除成功!');
          this.getList();
        }
      } catch (error) {
        this.tableLoading = false;
      }
    },

    /**
     * 订单详情
     * @param {String|Number} id: 订单详情id
     */
    async getOrderDeatil(id) {
      this.auditModalObj.spin = true;
      try {
        let { code, data } = await this.$api.orderReviewDetails({id});
        if (code === 0) {
          console.log(data)
          data.orderFromText = formatOrderFrom(data.orderFrom);
          data.paymentMethod = formatPaymentMethod(data.paymentMethod);
          data.giftList = [ ...data.giftProductList, ...data.matchingProductList ];
          data.auditLog.forEach(item => {
            item.createdAt = this.$format(item.createdAt, 'yyyy-MM-dd hh:mm');
            item.statusText = formatStatus(item.status);
          });

          this.auditModalObj.data = data;
        }
      } catch (error) {}
      this.auditModalObj.spin = false;
    },

    /**
     * 确认处理
     */
    async dealOnOk() {
      // to-do: 处理API
    },

    /**
     * 确认审核
     * @param {Object} payload: 审核数据: payload.type: manage/初审  director/复审
     */
    async auditOnOk(payload) {
      this.auditModalObj.submitting = true;
      const { type, ...params } = payload;
      const Interface = type === 'manage' ? 'orderReviewManagerAudit' : 'orderReviewDirectorAudit';
      try {
        let { code } = await this.$api[Interface](params);
        if (code === 0) {
          this.$Message.success('审核成功!');
          this.auditModalObj.show = false;

          this.getList();
        }
      } catch (error) {}
      this.auditModalObj.submitting = false;
    },

    /**
     * 确认作废
     * @param {Object} formData: 作废数据
     */
    async invalidOnOk(formData) {
      this.invalidModalObj.submitting = true;
      try {
        let { code } = await this.$api.orderCancellation(formData);
        if (code === 0) {
          this.$Message.success('作废成功!');
          this.invalidModalObj.id = '';
          this.invalidModalObj.show = false;

          this.getList();
        }
      } catch (error) {}
      this.invalidModalObj.submitting = false;
    },

    /**
     * 导出数据
     * @param {Object} formData: 导出数据参数
     */
    async exportOnOk(formData) {
      this.exportModalObj.submitting = true;
      try {
        const { code, data } = await this.$api.orderExport(formData);
        if (code === 0) {
          this.exportModalObj.show = false;
          this.$downLoad(data.url);
        }
      } catch (error) {}
      this.exportModalObj.submitting = false;
    },

    /**
     * 获取供货政策详情
     * @param {String} id: 政策id
     */
    async getPolicyDetail(id) {
      this.policyModalObj.spinLoading = true;
      try {
        let { code, data } = await this.$api.v2GetContractPolicyDetail({id})
        if (code === 0) {
          data.matchingDiscountList = this.flatMatchingDiscountList(data.matchingDiscountList);
          this.policyModalObj.data = data;
        }
      } catch (error) {}
      this.policyModalObj.spinLoading = false;
    },
    // 降维配赠活动 (适用政策详情)
    flatMatchingDiscountList(arr) {
      let newArr = JSON.parse(JSON.stringify(arr));
      newArr.forEach(item => {
        let tempDeatilList = [];
        item.detailList.forEach(dItem => {
          let obj = dItem.productList.splice(0, 1)[0];
          obj.matchingDenominator = dItem.matchingDenominator;
          obj.matchingMolecule = dItem.matchingMolecule;
          obj.firstFlag = true; // 首个数据标识
          tempDeatilList = [ ...tempDeatilList, obj, ...dItem.productList ];
        })
        item.detailList = tempDeatilList;
      });
      return newArr;
    },

    /**
     * 分页器变化
     * @param {String} props: 分页器更改属性
     * @param {Number} e: 页大小
     */
    pagerOnChange(props, e) {
      this.pageProps[props] = e;
      this.getList();
    },
    
    /**
     * 弹窗 初审/复审 
     * @param {String} type: 类型  初审/复审
     */
    handleShowAuditModal(type) {
      if (this.checkList.length !== 1) return this.$Message.warning('请选择一条数据!');
      const { status, id } = this.checkList[0];
      if (type === 'manage' && status !== 'OrderWorkflow/auditPending') return this.$Message.warning('请选择待初审数据!');
      if (type === 'director' && status !== 'OrderWorkflow/auditRecheckPending') return this.$Message.warning('请选择待复审数据!');

      this.auditModalObj.type = type;
      this.auditModalObj.show = true;
      this.getOrderDeatil(id);
    },

    // 弹窗 作废
    handleShowInvalidModal() {
      if (this.checkList.length !== 1) return this.$Message.warning('请选择一条数据!');
      const { receivablesStatus, id } = this.checkList[0];
      if (['paid', 'receipt', 'cancel'].includes(receivablesStatus)) return this.$Message.warning('已收款/已付款不可作废!');
      this.invalidModalObj.id = id;
      this.invalidModalObj.show = true;
    },

    // 弹窗 处理 
    handleShowDealModal() {
      this.dealModalObj.show = true;
    },

    /**
     * 弹窗 查看供货政策详情
     * @param {String|Number} id: 政策id
     */
    handleShowPolicy(id) {
      this.policyModalObj.show = true;
      this.getPolicyDetail(id);
    },

    // 导出数据
    handleExportData() {
      this.exportModalObj.show = true;
    },

    /**
     * 表格选项变化事件
     * @param {Array} selection: 当前选中数据
     */
    tableOnSelectionChange(selection) {
      this.checkList = selection;
    },

    // 添加补发订单
    goToReplacement() {
      if (this.checkList.length !== 1) return this.$Message.warning('请选择一条数据!');
      const { id, status } = this.checkList[0];
      if (status !== 'OrderWorkflow/auditRecheckPass') return this.$Message.warning('复审未通过!');
      this.$router.push(`/order-management/review-replacement-edit?origin_id=${id}`);
    },

    /**
     * 跳转订单添加/编辑页
     * @param {String|Number} id: 编辑时需要传入id
     * @param {String} type: 数据状态
     */
    goToOrderEditPage(id, type) {
      this.$router.push(`/order-management/review-edit${!!id ? `?id=${id}&type=${type}` : ''}`);
    },
  },
  activated() {
    this.checkList = [];
    this.getList();
  },
}
</script>

<style lang="less" scoped>
.review {
  /deep/ .sub-col ul li {
    list-style: none;
    padding-top: 4px;
    padding-bottom: 4px;
    // border-bottom: 1px solid #DCDEE2;
  }
}
</style>