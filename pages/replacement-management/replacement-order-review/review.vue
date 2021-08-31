<template>
  <div>
    <Card>
      <div slot="title" style="position: relative;">
        <Form inline>
          <Row  @keydown.native.enter.prevent="getList('search')">
            <FormItem>
              <Select v-model="searchData.ownership" placeholder="数据权限范围" @on-change="getList('search')">
                <Option v-for="(item, index) in dataPermissionRange" :value="item.value" :label="item.label" :key="'dataPer' + index"></Option>
              </Select>
            </FormItem>
            <FormItem>
              <Input v-model="searchData.created_by" placeholder="创建人" clearable></Input>
            </FormItem>
            <FormItem>
              <Input v-model="searchData.salesman" clearable placeholder="业务员"></Input>
            </FormItem>
            <FormItem>
              <Input v-model="searchData.merchant_name" clearable placeholder="商家"></Input>
            </FormItem>
            <FormItem>
              <Input v-model="searchData.origin_order_sn" clearable placeholder="原订单编号"></Input>
            </FormItem>
            <FormItem>
              <Input v-model="searchData.order_sn" clearable placeholder="补发订单编号"></Input>
            </FormItem>
            <FormItem>
              <Select v-model="searchData.status" clearable placeholder="状态" @on-change="getList('search')">
                <Option v-for="(item, index) in statusList" :key="'status'+index" :value="item.value"
                        :label="item.label"></Option>
              </Select>
            </FormItem>
            <FormItem>
              <Select v-model="searchData.reason" clearable placeholder="补发原因" @on-change="getList('search')">
                <Option v-for="(item, index) in reasonList" :key="'status'+index" :value="item.value"
                        :label="item.label"></Option>
              </Select>
            </FormItem>
            <FormItem>
              <Button type="primary" icon="ios-search" @click="getList('search')">查 询</Button>
            </FormItem>
          </Row>
          <Row>
            <Col :sm='20'>
              <Button type="primary" @click="openModal('review')" v-permission="'/v1/order/manager-audit'">审 核</Button>
              <Button type="primary" @click="openModal('invalid')" v-permission="'/v1/order/invalid'">作 废</Button>
              <Button type="primary" @click="exportData.modal = true" v-permission="'/v1/order-delivery/order-export'">导出数据</Button>
            </Col>
              <!-- <div style="color:red;position: absolute;bottom:0;right:0;font-size: 0.875rem">网店管家每30分钟获取一次已处理订单</div> -->
          
          </Row>
        </Form>
      </div>
      <div>
        <Table border max-height='640' ref="selection" :columns="listData.columns" :data="listData.data"
              highlight-row :loading="loadingTable" size="small" @on-selection-change="select">
          <!-- 操作 -->
          <template slot-scope="{ row }" slot="action">
            <Tooltip placement="top" content="编辑" transfer>
              <Button type="primary" icon="md-create" size="small"
                      :disabled="row.status === 'OrderWorkflow/auditRecheckPass' || row.status === 'OrderWorkflow/cancel'" @click="handleEdit(row)"
                      v-permission="'/v1/order-reissue/update'">
              </Button>
            </Tooltip>
            <Poptip confirm title="您确认删除这条内容吗？" @on-ok="handleDelete(row)" transfer>
              <Button size="small" icon="md-trash" :disabled="row.status === 'OrderWorkflow/auditRecheckPass' || row.status === 'OrderWorkflow/cancel'" v-permission="'/v1/order/delete'">
              </Button>
            </Poptip>
          </template>
        </Table>
      </div>
      <div style="margin: 10px;overflow: hidden">
        <div class="pages-L">共 {{pageProps.totalCount}} 条</div>
        <div style="float: right;">
          <Page :total="pageProps.totalCount" size="small" :current="pageProps.currentPage" show-sizer show-elevator
                @on-change="changePage" @on-page-size-change="changePageSize"></Page>
        </div>
      </div>
    </Card>
    <!-- 审核 -->
    <Modal
    v-model="modalReview"
    title="补发订单审核"
    width="75%"
    >
      <div class="modal-div">
        <Row>
          <table class="review-table">
            <tbody>
            <tr>
              <td class="td-style">创建人</td>
              <td>{{ detailData.created_by }}</td>
              <td class="td-style">创建时间</td>
              <td>{{ detailData.created_at }}</td>
              <td class="td-style">原订单编号</td>
              <td>{{ detailData.origin_order_sn }}</td>
            </tr>
            <tr>
              <td class="td-style">补发订单编号</td>
              <td>{{ detailData.order_sn }}</td>
              <td class="td-style">补发原因</td>
              <td>{{ detailData.reason }}</td>
              <td class="td-style">业务员</td>
              <td>{{ detailData.salesman }}</td>
            </tr>
            <tr>
              <td class="td-style">商家名称</td>
              <td>{{ detailData.merchant_name }}</td>
              <td class="td-style">系统/门店</td>
              <td>{{ detailData.system_name }}</td>
              <td class="td-style">订单所选政策</td>
              <td>{{ detailData.contract_policy_name }}</td>
            </tr>
            <tr>
              <td class="td-style">实际补发应收金额</td>
              <td>{{ detailData.reissue_amount }}</td>
              <td class="td-style">订单应收金额</td>
              <td>{{ detailData.total_order_amount }}</td>
              <td class="td-style">下单时间</td>
              <td>{{ detailData.salesman }}</td>
            </tr>
            <tr>
              <td class="td-style">补发凭证</td>
              <td colspan="5">
                <a style="display: block;margin: 5px 0;" v-for="(item, index) in detailData.files" :key="'file'+index" :href="`${SERVER_BASE_URL}/${item.url}`"
                   target="_blank">{{ item.title + '.' + item.extension }}</a>
              </td>
            </tr>
            <tr>
              <td class="td-style">备注</td>
              <td colspan="5">{{detailData.remark}}</td>
            </tr>
            
            </tbody>
          </table>
        </Row>
        <template v-if="unissuedData.order.data.length">
          <Row class="row-style">
            <h3>未发商品清单</h3>
          </Row>
          <Row>
            <Table border highlight-row ref="selection" :columns="unissuedData.order.columns"
                   :data="unissuedData.order.data" size="small"></Table>
          </Row>
        </template>
        <template v-if="unissuedData.repurchase.data.length">
          <Row class="row-style">
            <div>换购清单</div>
          </Row>
          <Row>
            <Table border highlight-row ref="selection" :columns="unissuedData.repurchase.columns"
                   :data="unissuedData.repurchase.data" size="small"></Table>
          </Row>
        </template>
        <template v-if="unissuedData.backPoint.data.length">
          <Row class="row-style">
            <div>返点清单</div>
          </Row>
          <Row>
            <Table border highlight-row ref="selection" :columns="unissuedData.backPoint.columns"
                   :data="unissuedData.backPoint.data" size="small"></Table>
          </Row>
        </template>
        <template v-if="unissuedData.gift.data.length">
          <Row class="row-style">
            <div>赠品清单</div>
          </Row>
          <Row>
            <Table border highlight-row ref="selection" :columns="unissuedData.gift.columns"
                   :data="unissuedData.gift.data" size="small"></Table>
          </Row>
        </template>
        <template v-if="unissuedData.matching.data.length">
          <Row class="row-style">
            <div>配赠清单</div>
          </Row>
          <Row>
            <Table border highlight-row ref="selection" :columns="unissuedData.matching.columns"
                   :data="unissuedData.matching.data" size="small"></Table>
          </Row>
        </template>

        <template v-if="reissueData.order.data.length">
          <Row class="row-style">
            <h3>补发订单清单</h3>
          </Row>
          <Row>
            <Table border highlight-row ref="selection" :columns="reissueData.order.columns"
                   :data="reissueData.order.data" size="small"></Table>
          </Row>
        </template>
        <template v-if="reissueData.repurchase.data.length">
          <Row class="row-style">
            <div>换购清单</div>
          </Row>
          <Row>
            <Table border highlight-row ref="selection" :columns="reissueData.repurchase.columns"
                   :data="reissueData.repurchase.data" size="small"></Table>
          </Row>
        </template>
        <template v-if="reissueData.backPoint.data.length">
          <Row class="row-style">
            <div>返点清单</div>
          </Row>
          <Row>
            <Table border highlight-row ref="selection" :columns="reissueData.backPoint.columns"
                   :data="reissueData.backPoint.data" size="small"></Table>
          </Row>
        </template>
        <template v-if="reissueData.matching.data.length">
          <Row class="row-style">
            <div>配赠清单</div>
          </Row>
          <Row>
            <Table border highlight-row ref="selection" :columns="reissueData.matching.columns"
                   :data="reissueData.matching.data" size="small"></Table>
          </Row>
        </template>
        <template v-if="reissueData.gift.data.length">
          <Row class="row-style">
            <div>赠品清单</div>
          </Row>
          <Row>
            <Table border highlight-row ref="selection" :columns="reissueData.gift.columns"
                   :data="reissueData.gift.data" size="small"></Table>
          </Row>
        </template>
        <Row class="row-style">
          <table class="review-table">
            <tbody>
            <tr>
              <td class="td-style">审核结果</td>
              <td colspan="6" style="text-align: left">
                <RadioGroup v-model="reviewData.is_pass">
                  <Radio label="1">通过</Radio>
                  <Radio label="0">不通过</Radio>
                </RadioGroup>
              </td>
            </tr>
            <tr>
              <td class="td-style">备注</td>
              <td colspan="6">
                <Input type="textarea" :rows="2" v-model="reviewData.opinion"/>
              </td>
            </tr>
            </tbody>
          </table>
        </Row>
      </div>
      <div slot="footer">
        <Button @click="closeModal('review')">取消</Button>
        <Button type="primary" @click="reviewOrder" :loading="loadingButton">确认</Button>
      </div>
      <Spin fix v-if="spinShow"/>
    </Modal>
    <!-- 作废 -->
    <Modal
    v-model="modalInvalid"
    title="作废"
    width="60%"
    >
      <div style="padding: 10px 35px 0 10px">
        <Form label-position="right" :label-width="100">
          <FormItem label="作废说明：">
            <Input v-model="invalidData.invalid_reason" type="textarea" :rows="5"/>
          </FormItem>
          <FormItem label="作废确认：">
            <Checkbox v-model="invalidData.confirm">已确认作废</Checkbox>
          </FormItem>
          <FormItem label=" ">
            <div style="color: red">备注：确认作废提交后，订单流程将终止，且状态无法改变！</div>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="closeModal('invalid')">取消</Button>
        <Button type="error" @click="confirmInvalid" :loading="loadingButton">确认</Button>
      </div>
    </Modal>
    <!-- 导出数据 -->
    <Modal v-model="exportData.modal" title="导出数据" width="800">
      <div>
        <Row>
          <Col :md="24">选择导出条件：</Col>
        </Row>
        <Row>
          <Form label-position="right" :label-width="100">
            <Col span="12" offset="6">
              <FormItem label="下单时间：">
                <DatePicker type="daterange" placement="bottom-end" placeholder="开始时间和结束时间" style="min-width: 80px"
                            @on-change="getExportDate"></DatePicker>
              </FormItem>
            </Col>
            <Col span="12" offset="6">
              <FormItem label="处理状态：">
                <Select v-model="exportData.data.disposeStatus" clearable style="width:120px">
                  <Option v-for="(item, index) in disposeList" :value="item.value" :key="'export'+index"
                          :label="item.label"></Option>
                </Select>
              </FormItem>
            </Col>
          </Form>
        </Row>
      </div>
      <div slot="footer">
        <Button type="default" @click="closeModal('exportData')">关闭</Button>
        <Button type="primary" :loading="exportData.loading" @click="submitExport">提交</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
 import {SERVER_BASE_URL} from '~/api/config';
 import globalMixin from '~/plugins/mixin';
  export default {
    name: 'replacement-review',
    mixins: [globalMixin],
    data() {
      return {
        SERVER_BASE_URL,
        loadingTable: false,
        loadingButton: false,
        modalInvalid: false,
        modalReview: false,
        spinShow: false,
        firstEntry: true,
        selectList: [],
        searchData: {
          ownership: 'company'
        },
        detailData: {},
        invalidData: {},
        reviewData: {},
        reasonList: [
          {value: '漏发产品', label: '漏发产品'},
          {value: '退回重发', label: '退回重发'},
          {value: '产品破损', label: '产品破损'},
          {value: '产品质量', label: '产品质量'},
          {value: '快递丢件', label: '快递丢件'},
          {value: '地址不详被退回', label: '地址不详被退回'},
          {value: '快件被查扣退回', label: '快件被查扣退回'},
          {value: '客服未添加赠品', label: '客服未添加赠品'},
          {value: '产品缺货', label: '产品缺货'},
          {value: '发错产品', label: '发错产品'},
          {value: '特殊物流发货', label: '特殊物流发货'}
        ],
        statusList: [
          {value: 'OrderWorkflow/auditPending', label: '待审核'},
          {value: 'OrderWorkflow/auditFailure', label: '审核失败'},
          {value: 'OrderWorkflow/auditRecheckPass', label: '审核通过'},
          {value: 'OrderWorkflow/cancel', label: '作废'},
        ],
        receivablesList: [
          {value: 'wait_receipt', label: '待付款'},
          {value: 'unpaid', label: '未付款'},
          {value: 'paid', label: '已付款'},
          {value: 'receipt', label: '已收款'}
        ],
        exportData: { //导出数据
          modal: false,
          loading: false,
          data: {
            dispose_status: '',
            kind: 'reissue',
            start_time: '',
            end_time: ''
          }
        },
        disposeList: [
          {value: 'undisposed', label: '未处理'},
          {value: 'disposed', label: '已处理'},
          {value: 'exception_handling', label: '异常处理'}
        ],
        // 列表分页属性
        pageProps: {
          page: 1,
          perPage: 10,
          totalCount: 0
        },
        listData: {
          columns: [
            {type: 'selection', minWidth: 60, align: 'center',fixed:'left'},
            {title: '序号', type: 'index', width: 70, align: 'center', fixed:'left'},
            {title: '创建人', key: 'created_by', width: 100, align: 'center'},
            {
              title: '关联订单编号',
              minWidth: 180,
              align: 'center',
              fixed:'left',
              render: (h, params) => {
                return h('a', {
                  on: {
                    'click': () => {
                      this.$router.push({
                        path: '/order-management/review-details',
                        query: {
                          id: params.row.origin_id
                        }
                      })
                    }
                  }
                }, params.row.order_sn)
              }
            },
            {
              title: '补发订单编号',
              minWidth: 200,
              fixed:'left',
              align: 'center',
              render: (h, params) => {
                return h('a', {
                  on: {
                    'click': () => {
                      this.$router.push({
                        path: '/replacement-management/replacement-order-review/replacement-detail',
                        query: {
                          id: params.row.id
                        }
                      })
                    }
                  }
                }, params.row.reissue_order_sn)
              }
            },
            {
              title: '订单二维码',
              minWidth: 110,
              align: 'center',
              render: (h, params) => {
                return h('img', {
                  domProps: {
                    src: params.row.qr_code
                  },
                  style: {
                    width: '80%',
                    padding: '8px'
                  },
                  on: {
                    click: () => {
                      this.$Modal.info({
                        content: `<img src="${params.row.qr_code}" style="padding-right: 40px;margin-top: 40px;width: 100%" />`,
                        closable: true
                      })
                    }
                  }
                });
              }
            },
            {key: 'merchant_name', title: '商家名称', minWidth: 200, align: 'center'},
            {key: 'system_name', title: '系统/门店名称', minWidth: 200, align: 'center'},
            {key: 'reason', title: '补发原因', minWidth: 150, align: 'center'},
            {
              title: '补发货号',
              minWidth: 230,
              align: 'center',
              render: (h, params) => {
                return h('div', {
                  attrs: {
                    class: 'item-style'
                  }
                }, [h('ul', params.row.reissueOrderProduct.map((item) => {
                  return h('li', item.item_no)
                }))])
              }
            },
            {
              title: '补发数量',
              minWidth: 150,
              align: 'center',
              render: (h, params) => {
                return h('div', {
                  attrs: {
                    class: 'item-style'
                  }
                }, [h('ul', params.row.reissueOrderProduct.map((item) => {
                  return h('li', item.number)
                }))])
              }
            },
            {key: 'total_order_amount', title: '订单应收金额', minWidth: 130, align: 'center'},
            {key: 'status_desc', title: '状态', minWidth: 120, align: 'center'},
            {
              key: 'receivables_status',
              title: '收款状态',
              minWidth: 150,
              align: 'center',
              render: (h, params) => {
                return h('div', this.formatReceivables(params.row.receivables_status))
              }
            },
            {key: 'dispose_status_desc', title: '导单状态', minWidth: 150, align: 'center'},
            {
              title: '导单处理时间',
              key: 'dispose_time',
              minWidth: 180,
              align: 'center',
              render:(h,params) => {
                let new_dispose_time = new Date(params.row.dispose_time).getTime()
                return h('span',new_dispose_time === 0 ? '——' :params.row.dispose_time)
              }},
            {title: '操作', minWidth: 120, align: 'center', slot: 'action',fixed: 'right'}
          ],
          data: []
        },
        unissuedData: {
          order: {
            columns: [
              {key: 'pro_name', title: '产品名称', width: 180, align: 'center'},
              {key: 'standard', title: '规格', width: 120, align: 'center'},
              {key: 'unit', title: '单位', width: 100, align: 'center'},
              {key: 'price', title: '零售价', width: 100, align: 'center'},
              {key: 'discount', title: '折扣', width: 110, align: 'center'},
              {key: 'number', title: '订货数量', width: 120, align: 'center'},
              {key: 'total_price', title: '订单应收', width: 120, align: 'center'},
              {key: 'barcode', title: '条码', minWidth: 110, align: 'center'},
              {key: 'box_standard', title: '箱规', width: 110, align: 'center'}
            ],
            data: []
          },
          repurchase: {
            columns: [
              {key: 'pro_name', title: '产品名称', width: 180, align: 'center'},
              {key: 'standard', title: '规格', width: 120, align: 'center'},
              {key: 'unit', title: '单位', width: 100, align: 'center'},
              {key: 'price', title: '零售价', width: 100, align: 'center'},
              {key: 'discount', title: '换购折扣', width: 110, align: 'center'},
              {key: 'number', title: '订货数量', width: 120, align: 'center'},
              {key: 'total_price', title: '换购应收', width: 120, align: 'center'},
              {key: 'barcode', title: '条码', minWidth: 110, align: 'center'},
              {key: 'box_standard', title: '箱规', width: 110, align: 'center'}
            ],
            data: []
          },
          backPoint: {
            columns: [
              {key: 'pro_name', title: '产品名称', width: 180, align: 'center'},
              {key: 'standard', title: '规格', width: 120, align: 'center'},
              {key: 'unit', title: '单位', width: 100, align: 'center'},
              {key: 'price', title: '零售价', width: 100, align: 'center'},
              {key: 'discount', title: '折扣', width: 110, align: 'center'},
              {key: 'number', title: '订货数量', width: 120, align: 'center'},
              {key: 'total_price', title: '返点货值', width: 120, align: 'center'},
              {key: 'barcode', title: '条码', minWidth: 110, align: 'center'},
              {key: 'box_standard', title: '箱规', width: 110, align: 'center'}
            ],
            data: []
          },
          matching: {
            columns: [
              {key: 'pro_name', title: '产品名称', width: 180, align: 'center'},
              {key: 'standard', title: '规格', width: 120, align: 'center'},
              {key: 'unit', title: '单位', width: 100, align: 'center'},
              {key: 'price', title: '零售价', width: 100, align: 'center'},
              {key: 'discount', title: '换购折扣', width: 110, align: 'center'},
              {key: 'number', title: '订货数量', width: 120, align: 'center'},
              {key: 'total_price', title: '配赠货值', width: 120, align: 'center'},
              {key: 'barcode', title: '条码', minWidth: 110, align: 'center'},
              {key: 'box_standard', title: '箱规', width: 110, align: 'center'}
            ],
            data: []
          },
          gift: {
            columns: [
              {key: 'pro_name', title: '产品名称', width: 180, align: 'center'},
              {key: 'standard', title: '规格', width: 120, align: 'center'},
              {key: 'unit', title: '单位', width: 100, align: 'center'},
              {key: 'price', title: '零售价', width: 100, align: 'center'},
              {key: 'discount', title: '折扣', width: 110, align: 'center'},
              {key: 'number', title: '满赠数量', width: 120, align: 'center'},
              {key: 'total_price', title: '返点货值', width: 120, align: 'center'},
              {key: 'barcode', title: '条码', minWidth: 110, align: 'center'},
              {key: 'box_standard', title: '箱规', width: 110, align: 'center'}
            ],
            data: []
          },
        },
        reissueData: {
          order: {
            columns: [
              {key: 'pro_name', title: '产品名称', width: 180, align: 'center'},
              {key: 'standard', title: '规格', width: 120, align: 'center'},
              {key: 'unit', title: '单位', width: 100, align: 'center'},
              {key: 'price', title: '零售价', width: 100, align: 'center'},
              {key: 'discount', title: '折扣', width: 110, align: 'center'},
              {key: 'number', title: '订单数量', width: 120, align: 'center'},
              {key: 'total_price', title: '返点货值', width: 120, align: 'center'},
              {key: 'barcode', title: '条码', minWidth: 110, align: 'center'},
              {key: 'box_standard', title: '箱规', width: 110, align: 'center'}
            ],
            data: []
          },
          repurchase: {
            columns: [
              {key: 'pro_name', title: '产品名称', width: 180, align: 'center'},
              {key: 'standard', title: '规格', width: 120, align: 'center'},
              {key: 'unit', title: '单位', width: 100, align: 'center'},
              {key: 'price', title: '零售价', width: 100, align: 'center'},
              {key: 'discount', title: '换购折扣', width: 110, align: 'center'},
              {key: 'number', title: '订货数量', width: 120, align: 'center'},
              {key: 'total_price', title: '换购应收', width: 120, align: 'center'},
              {key: 'barcode', title: '条码', minWidth: 110, align: 'center'},
              {key: 'box_standard', title: '箱规', width: 110, align: 'center'}
            ],
            data: []
          },
          backPoint: {
            columns: [
              {key: 'pro_name', title: '产品名称', width: 180, align: 'center'},
              {key: 'standard', title: '规格', width: 120, align: 'center'},
              {key: 'unit', title: '单位', width: 100, align: 'center'},
              {key: 'price', title: '零售价', width: 100, align: 'center'},
              {key: 'discount', title: '折扣', width: 110, align: 'center'},
              {key: 'number', title: '订货数量', width: 120, align: 'center'},
              {key: 'total_price', title: '返点货值', width: 120, align: 'center'},
              {key: 'barcode', title: '条码', minWidth: 110, align: 'center'},
              {key: 'box_standard', title: '箱规', width: 110, align: 'center'}
            ],
            data: []
          },
          matching: {
            columns: [
              {key: 'pro_name', title: '产品名称', width: 180, align: 'center'},
              {key: 'standard', title: '规格', width: 120, align: 'center'},
              {key: 'unit', title: '单位', width: 100, align: 'center'},
              {key: 'price', title: '零售价', width: 100, align: 'center'},
              {key: 'discount', title: '折扣', width: 110, align: 'center'},
              {key: 'number', title: '订单数量', width: 120, align: 'center'},
              {key: 'total_price', title: '返点货值', width: 120, align: 'center'},
              {key: 'barcode', title: '条码', minWidth: 110, align: 'center'},
              {key: 'box_standard', title: '箱规', width: 110, align: 'center'}
            ],
            data: []
          },
          gift: {
            columns: [
              {key: 'pro_name', title: '产品名称', width: 180, align: 'center'},
              {key: 'standard', title: '规格', width: 120, align: 'center'},
              {key: 'unit', title: '单位', width: 100, align: 'center'},
              {key: 'price', title: '零售价', width: 100, align: 'center'},
              {key: 'discount', title: '折扣', width: 110, align: 'center'},
              {key: 'number', title: '满赠数量', width: 120, align: 'center'},
              {key: 'total_price', title: '返点货值', width: 120, align: 'center'},
              {key: 'barcode', title: '条码', minWidth: 110, align: 'center'},
              {key: 'box_standard', title: '箱规', width: 110, align: 'center'}
            ],
            data: []
          }
        }
      }
    },
    methods: {
      // 改变页码
      changePage(e) {
        this.pageProps.page = e;
        this.getList();
      },
      // 改变页数
      changePageSize(e) {
        this.pageProps.perPage = e;
        this.getList();
      },
      getList(type) {
        if (type == 'search') {
          this.pageProps.page = 1
        }
        let params = JSON.parse(JSON.stringify(this.searchData))
        params.page = this.pageProps.page
        params.perPage = this.pageProps.perPage
        this.firstEntry ? this.firstEntry = !this.firstEntry : delete params.id_collect // fix:从首页进来之后再筛选数据查询不准确
        this.loadingTable = true
        this.$api.reissueList(params).then((res) => {
          if (res.code === 0) {
            let data = res.data,
                pageProps = this.pageProps
            this.listData.data = data.list
            pageProps.page = data.currentPage
            pageProps.perPage = data.perPage
            pageProps.totalCount = data.totalCount
            pageProps.currentPage = data.currentPage
            this.searchData.ownership = data.ownership
            this.handleValidateDataPermissionRange(this, 'isGetDataPermissionRange', 'dataPermissionRange', data.ownership)
          }
        }).finally(() => {
          this.loadingTable = false
        })
      },
      formatReceivables(type) {
        return this.receivablesList.map((item) => {
          if (type == item.value) {
            return item.label
          }
        })
      },
      getDetail(id) {
        this.resetUnissueAndReissueData()
        this.spinShow = true
        this.$api.reissueDetail(id).then((res) => {
          if (res.code == 0) {
            this.detailData = res.data
            this.detailData.created_at = this.$format(res.data.created_at, 'yyyy-MM-dd')
            this.spinShow = false
            let {unissuedProductsList, reissueProductsList} = res.data
            for (let key in unissuedProductsList) {
              this.unissuedData[key].data = unissuedProductsList[key]
            }
            for (let key in reissueProductsList) {
              this.reissueData[key].data = reissueProductsList[key]
            }
          }
        })
      },
      // 清空详情未发补发订单数据
      resetUnissueAndReissueData() {
        for (let key in this.unissuedData) {
          this.unissuedData[key].data = []
        }
        for (let key in this.reissueData) {
          this.reissueData[key].data = []
        }
      },
      select(selection) {
        if (selection.length == 1) {
          this.selectList = selection
        } else {
          this.selectList.length = 0
        }
      },
      openModal(type) {
        if (this.selectList.length != 0) {
          this.getDetail(this.selectList[0].id)
          if (type == 'review') {
            if (this.selectList[0].status === 'OrderWorkflow/auditPending') {
              this.modalReview = true
              this.reviewData = {} // 清除缓存
            } else {
              this.$Message.error('已审核')
            }
          } else {
            if (this.selectList[0].receivables_status === 'paid') {
              this.$Message.error(this.selectList[0].receivables_status_desc + '不可作废')
            } else {
              this.modalInvalid = true
              this.invalidData = {}
            }
          }
        } else {
          this.$Message.error('请选择一个')
        }
      },
      closeModal(type) {
        if (type == 'review') {
          this.modalReview = false
        } else if (type == 'exportData') {
          this.exportData.modal = false
        } else {
          this.modalInvalid = false
        }
      },
      confirmInvalid() {
        if (!this.invalidData.invalid_reason) {
          this.$Message.error("请填写确认说明")
        } else if (!this.invalidData.confirm) {
          this.$Message.error("请确认作废")
        } else {
          let params = {
            invalid_reason: this.invalidData.invalid_reason,
            id: this.selectList[0].id
          }
          this.loadingButton = true
          this.$api.orderCancellation(params).then((res) => {
            if (res.code === 0) {
              this.modalInvalid = false
              this.$Message.success('作废成功')
              this.selectList.length = 0
              this.getList()
            }
          }).finally(() => {
            this.loadingButton = false
          })
        }
      },
       // 审核通过自动导出订单
      subAutoExl(id,pass){
          let params = {
              disposeStatus:'disposed'
            }
            params.ids = []
            params.ids.push(id)
           if(Number(pass) === 1){
                  this.$api.orderDeliverHandle(params).then(res => {
                  if (res.code === 0) {
                    this.$Message.success('该订单已同步网店管家')
                    this.getList()
                  }
              })
          }
  
      },
      reviewOrder() {
        let params = JSON.parse(JSON.stringify(this.reviewData))
        params.id = this.selectList[0].id
        if(params.is_pass !== params.is_pass !== undefined || params.is_pass !== null ){
          params.is_review = params.is_pass == 0 ? 1 : 0;
        }
        this.loadingButton = true
        this.$api.replacementOrderReviewManagerAudit(params).then((res) => {
          // this.subAutoExl(params.id,params.is_pass)
          this.modalReview = false
          this.$Message.success('审核成功')
          this.selectList.length = 0
          this.getList()
        }).finally(() => {
          this.loadingButton = false
        })
      },
      handleEdit(row) {
        if (row.status === 'OrderWorkflow/auditRecheckPass') {
          this.$Message.warning('审核通过不可编辑')
        } else {
          this.$router.push({
            path: '/order-management/review-replacement-edit',
            query: {
              id: row.id,
              origin_id: row.origin_id
            }
          })
        }
      },
      handleDelete(row) {
        if (row.status === 'OrderWorkflow/auditRecheckPass') {
          this.$Message.warning('审核通过不可删除')
        } else {
          this.$api.orderReviewDelete(row.id).then((res) => {
            if (res.code === 0) {
              this.getList()
              this.$Message.success('删除成功')
            }
          })
        }
      },
      // 导出数据选择日期
      getExportDate(e) {
        this.exportData.data.startTime = e[0];
        this.exportData.data.endTime = e[1];
      },
      // 数据导出
      submitExport() {
        let params = this.exportData.data
        this.exportData.loading = true
        this.$api.orderExport(params).then((res) => {
          if (res.code === 0) {
            window.location.href = res.data.url
            this.exportData.modal = false
          }
        }).finally(() => {
          this.exportData.loading = false
        })
      }
    },
    activated() {
      let status = this.$route.query.status||'';
      if (status) {
        this.searchData.status = status;
      }else{
        this.searchData.status = '';

      }
      let idCollect=this.$route.query.id_collect||'';
      if(idCollect){
        this.searchData.id_collect = idCollect;
      }else{
        this.searchData.id_collect = '';

      }
      this.getList()
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
  /deep/ .item-style {
    li {
      list-style: none;
      line-height: 35px;
      border-bottom: 1px #dcdee2 solid;
      margin: 0 -18px;
    }

    li:last-child {
      border-bottom: none;
    }
  }

  /deep/ .review-table {
    border-collapse: collapse;
    width: 100%;
    tr {
      td {
        border: 1px #dcdee2 solid;
        text-align: center;
        height: 50px;
        /*padding: 10px 20px;*/
        width: 110px;
      }
    }
  }

  .modal-div {
    height: 380px;
    overflow-y: scroll;
    padding: 0 10px;
  }

  .td-style {
    background: #e8eaec7a;
    width: 170px;
  }

  .row-style {
    margin: 25px 0 10px 0;
  }
</style>
