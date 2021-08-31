<template>
  <div>
    <Card>
      <div slot="title" style="text-align:right">
        <Button type="primary" @click="goBack()">返回</Button>
      </div>
      <div>
        <!-- 补发信息 -->
        <Card>
          <Row type="flex" justify="space-between" slot="title">
            <Col :md="8">
              <p>补发订单编号：{{ detailData.order_sn}}</p>
            </Col>
            <Col :md="8" class="col-right">
              <p>订单应收金额：{{ detailData.reissue_amount }}</p>
            </Col>
          </Row>
          <Row class="row-style">
            <Col :md="8">原订单编号：<a @click="goOrderDetail">{{ detailData.origin_order_sn }}</a></Col>
            <Col :md="8">创建人：{{ detailData.created_by }}</Col>
            <Col :md="8">创建时间：{{ formatDate(detailData.created_at) }}</Col>
          </Row>
          <Row class="row-style">
            <Col :md="8">商家名称：{{ detailData.merchant_name }}</Col>
            <Col :md="8">补发原因：{{ detailData.reason }}</Col>
          </Row>
          <Row class="row-style">
            <Col :md="8">业务员：{{ detailData.salesman }}</Col>
            <Col :md="8">备注：{{ detailData.remark }}</Col>
            <Col :md="8">补发凭证：
              <div class="file-style">
                <a v-for="(item, index) in detailData.files" :key="'file'+index" :href="baseUrl + item.url"
                   target="_blank">{{ item.title + '.' + item.extension }}</a>
              </div>
            </Col>
          </Row>
          <!-- <Row class="row-style">
            <Col :md="12">补发凭证：
              <div class="file-style">
                <a v-for="(item, index) in detailData.files" :key="'file'+index" :href="baseUrl + item.url"
                   target="_blank">{{ item.title + '.' + item.extension }}</a>
              </div>
            </Col>
          </Row> -->
        </Card>
        <!-- 未发信息 -->
        <Card>
          <Row type="flex" justify="space-between" slot="title">
            <Col :md="8">
              <p>原订单未发信息</p>
            </Col>
            <Col :md="8" class="col-right">
              <p>所选活动政策：<a @click="openPolicyDetail()">{{ detailData.contract_policy_name }}</a></p>
            </Col>
          </Row>
          <template v-if="unissuedData.order.length">
            <Row class="row-style">原订单未发清单</Row>
            <Row>
              <Table border :columns="unissuedData.orderColumns" :data="unissuedData.order" size="small"></Table>
            </Row>
          </template>
          <tempalte v-if="unissuedData.repurchase.length">
            <Row class="row-style">换购清单</Row>
            <Row>
              <Table border :columns="unissuedData.repurchaseColumns" :data="unissuedData.repurchase"
                     size="small"></Table>
            </Row>
          </tempalte>
          <tempalte v-if="unissuedData.backPoint.length">
            <Row class="row-style">返点清单</Row>
            <Row>
              <Table border :columns="unissuedData.backPointColumns" :data="unissuedData.backPoint"
                     size="small"></Table>
            </Row>
          </tempalte>
          <tempalte v-if="unissuedData.gift.length">
            <Row class="row-style">赠品清单</Row>
            <Row>
              <Table border :columns="unissuedData.giftColumns" :data="unissuedData.gift" size="small"></Table>
            </Row>
          </tempalte>
          <tempalte v-if="unissuedData.matching.length">
            <Row class="row-style">配赠清单</Row>
            <Row>
              <Table border :columns="unissuedData.matchingColumns" :data="unissuedData.matching" size="small"></Table>
            </Row>
          </tempalte>
        </Card>
        <!-- 补发信息 -->
        <Card>
          <Row type="flex" justify="space-between" slot="title">
            <Col :md="8">
              <p>补发订单信息</p>
            </Col>
          </Row>
          <template v-if="reissueData.order.length">
            <Row class="row-style">补发产品清单</Row>
            <Row>
              <Table border :columns="reissueData.orderColumns" :data="reissueData.order" size="small"></Table>
            </Row>
          </template>
          <template v-if="reissueData.repurchase.length">
            <Row class="row-style">换购清单</Row>
            <Row>
              <Table border :columns="reissueData.repurchaseColumns" :data="reissueData.repurchase"
                     size="small"></Table>
            </Row>
          </template>
          <template v-if="reissueData.backPoint.length">
            <Row class="row-style">返点清单</Row>
            <Row>
              <Table border :columns="reissueData.backPointColumns" :data="reissueData.backPoint" size="small"></Table>
            </Row>
          </template>
          <template v-if="reissueData.gift.length">
            <Row class="row-style">赠品清单</Row>
            <Row>
              <Table border :columns="reissueData.giftColumns" :data="reissueData.gift" size="small"></Table>
            </Row>
          </template>
          <template v-if="reissueData.matching.length">
            <Row class="row-style">配赠清单</Row>
            <Row>
              <Table border :columns="reissueData.matchingColumns" :data="reissueData.matching" size="small"></Table>
            </Row>
          </template>
          <Row type="flex" justify="space-between" style="margin:30px 0 10px 0">
            <Col :md="6">已补发金额：{{ detailData.reissue_amount }}</Col>
            <Col :md="6">未发应收金额：{{ detailData.unissued_amount }}</Col>
            <Col :md="6">实际订单应收金额：{{ detailData.total_order_amount }}</Col>
          </Row>
        </Card>
        <!-- 商家信息 -->
        <Card>
          <Row type="flex" justify="space-between" slot="title">
            <Col :md="8">
              <p>商家信息</p>
            </Col>
          </Row>
          <Row class="row-style">
            <Col :md="8">商家名称：{{ detailData.merchant_name }}</Col>
            <Col :md="8">系统/门店：{{ detailData.system_name }}</Col>
            <Col :md="8">门店店数量：{{ detailData.length }}</Col>
          </Row>
          <Row class="row-style">
            <Col :md="8">收货地址： {{ detailData.province+detailData.city+detailData.county+' '+detailData.receiving_address }}</Col>
            <Col :md="8">联系人：{{ detailData.contact_name }}</Col>
            <Col :md="8">联系电话：{{ detailData.contact_phone }}</Col>
          </Row>
          <Row class="row-style">
            <Col :md="8">付款方式： {{ formatPaymentMethod(detailData.payment_method) }}</Col>
            <Col :md="8">合作商政策：{{ detailData.partner_policy_name }}</Col>
            <Col :md="8">当前订单所选政策：<a @click="openPolicyDetail()">{{ detailData.contract_policy_name }}</a></Col>
          </Row>
        </Card>
        <!-- 审核信息-->
        <Card>
          <Row type="flex" justify="space-between" slot="title">
            <Col :md="8">
              <p>审核信息</p>
            </Col>
          </Row>
          <Row class="row-style">
            <Col :md="8">初审：{{ auditArrLength == 0 ? '无' : detailData.auditLogItems[auditArrLength-1].created_by }}
            </Col>
            <Col :md="8">审核结果：{{ auditArrLength == 0 ? '无' : (detailData.auditLogItems[auditArrLength-1].audit_pass == 1
              ? '通过' : '不通过') }}
            </Col>
            <Col :md="8">审核时间：{{ auditArrLength == 0 ? '无' :
              formatDate(detailData.auditLogItems[auditArrLength-1].created_at) }}
            </Col>
          </Row>
          <Row class="row-style">
            <Col :md="8">备注：{{ auditArrLength == 0 ? '无' : detailData.auditLogItems[auditArrLength-1].opinion }}</Col>
          </Row>
        </Card>
        <!-- 收款信息 -->
        <Card>
          <Row type="flex" justify="space-between" slot="title">
            <Col :md="8">
              <p>收款信息</p>
            </Col>
          </Row>
          <Row class="row-style">
            <Col :md="8">收款状态：{{ formatReceivablesStatus(detailData.receivables_status) }}</Col>
            <Col :md="8">收款提交时间：{{ formatDate(detailData.receipt_submission_at) }}</Col>
            <Col :md="8">收款完成时间： {{ formatDate(detailData.collection_completion_at) }}</Col>
          </Row>
        </Card>
        <!-- 发货信息 -->
        <Card>
          <Row type="flex" justify="space-between" slot="title">
            <Col :md="8">
              <p>发货信息</p>
            </Col>
          </Row>
          <Row class="row-style">
            <Col :md="8">发货方式：{{ !detailData.delivery ? '暂无' : (detailData.delivery_mode == 'express' ? '快递' : '物流')
              }}
            </Col>
            <Col :md="8">确认发货：{{ !detailData.delivery ? '暂无' : formatDeliveryStatus(detailData.delivery.delivery_status)
              }}
            </Col>
            <Col :md="8">确认时间：{{ !detailData.delivery ? '暂无' : formatDate(detailData.delivery.confirm_delivery_time)
              }}
            </Col>
          </Row>
          <Row class="row-style">
            <Col :md="8">缺货信息：{{ !detailData.delivery ? '暂无' : detailData.delivery.shortage_info }}</Col>
            <Col :md="8">其他异常：{{ !detailData.delivery ? '暂无' : detailData.delivery.remark }}</Col>
            <Col :md="8">物流单号：{{ !detailData.delivery ? '暂无' : detailData.delivery.logistics_id }}</Col>
          </Row>
          <Row class="row-style">
            <Col :md="8">下载出货单：<a @click="exportDispatchOrder">出货单文件</a></Col>
            <Col :md="16">下载物流单：
              <span v-if="!!detailData.delivery&&detailData.delivery.fileItems.length>0">
                            <a style="display: inline-block; margin-right:15px"
                               v-for="(item, index) in detailData.delivery.fileItems" :key="'file'+index"
                               :href="baseUrl + item.url" target="_blank">{{ item.title + '.' + item.extension }}</a>
                        </span>
              <span v-if="!detailData.delivery||detailData.delivery.fileItems.length == 0">暂无</span>
            </Col>
          </Row>
        </Card>
      </div>
    </Card>
    <PolicyDetail ref="policyDetail"/>
  </div>
</template>
<script>
  import {SERVER_BASE_URL} from '~/api/config';
  import PolicyDetail from '../../my-components/policy-detail-modal';

  export default {
    components: {
      PolicyDetail
    },
    data() {
      return {
        baseUrl: `${SERVER_BASE_URL}/`,
        detailData: {},
        unissuedData: {
          orderColumns: [
            {key: 'pro_name', title: '产品名称', minWidth: 180, align: 'center'},
            {key: 'standard', title: '规格', width: 100, align: 'center'},
            {key: 'unit', title: '单位', width: 100, align: 'center'},
            {key: 'price', title: '零售价', width: 110, align: 'center'},
            {key: 'discount', title: '折扣', width: 100, align: 'center'},
            {key: 'number', title: '未发数量', width: 120, align: 'center'},
            {key: 'total_price', title: '未发应收金额', width: 130, align: 'center'},
            {key: 'barcode', title: '条码', minWidth: 160, align: 'center'},
            {key: 'box_standard', title: '箱规', width: 100, align: 'center'}
          ],
          repurchaseColumns: [
            {key: 'pro_name', title: '产品名称', minWidth: 180, align: 'center'},
            {key: 'standard', title: '规格', width: 100, align: 'center'},
            {key: 'unit', title: '单位', width: 100, align: 'center'},
            {key: 'price', title: '零售价', width: 110, align: 'center'},
            {key: 'discount', title: '换购折扣', width: 100, align: 'center'},
            {key: 'number', title: '订货数量', width: 120, align: 'center'},
            {key: 'total_price', title: '换购应收', width: 130, align: 'center'},
            {key: 'barcode', title: '条码', minWidth: 160, align: 'center'},
            {key: 'box_standard', title: '箱规', width: 100, align: 'center'}
          ],
          backPointColumns: [
            {key: 'pro_name', title: '产品名称', minWidth: 180, align: 'center'},
            {key: 'standard', title: '规格', width: 100, align: 'center'},
            {key: 'unit', title: '单位', width: 100, align: 'center'},
            {key: 'price', title: '零售价', width: 110, align: 'center'},
            {key: 'discount', title: '折扣', width: 100, align: 'center'},
            {key: 'number', title: '订货数量', width: 120, align: 'center'},
            {key: 'total_price', title: '返点货值', width: 130, align: 'center'},
            {key: 'barcode', title: '条码', minWidth: 160, align: 'center'},
            {key: 'box_standard', title: '箱规', width: 100, align: 'center'}
          ],
          giftColumns: [
            {key: 'pro_name', title: '产品名称', minWidth: 180, align: 'center'},
            {key: 'standard', title: '规格', width: 100, align: 'center'},
            {key: 'unit', title: '单位', width: 100, align: 'center'},
            {key: 'price', title: '零售价', width: 110, align: 'center'},
            {key: 'discount', title: '换购折扣', width: 100, align: 'center'},
            {key: 'number', title: '订货数量', width: 120, align: 'center'},
            {key: 'total_price', title: '配赠货值', width: 130, align: 'center'},
            {key: 'barcode', title: '条码', minWidth: 160, align: 'center'},
            {key: 'box_standard', title: '箱规', width: 100, align: 'center'}
          ],
          matchingColumns: [
            {key: 'pro_name', title: '产品名称', minWidth: 180, align: 'center'},
            {key: 'standard', title: '规格', width: 100, align: 'center'},
            {key: 'unit', title: '单位', width: 100, align: 'center'},
            {key: 'price', title: '零售价', width: 110, align: 'center'},
            {key: 'discount', title: '折扣', width: 100, align: 'center'},
            {key: 'number', title: '满赠数量', width: 120, align: 'center'},
            {key: 'total_price', title: '返点货值', width: 130, align: 'center'},
            {key: 'barcode', title: '条码', minWidth: 160, align: 'center'},
            {key: 'box_standard', title: '箱规', width: 100, align: 'center'}
          ],
          order: [],
          repurchase: [],
          backPoint: [],
          gift: [],
          matching: [],
        },
        reissueData: {
          orderColumns: [
            {key: 'pro_name', title: '产品名称', minWidth: 180, align: 'center'},
            {key: 'standard', title: '规格', width: 100, align: 'center'},
            {key: 'unit', title: '单位', width: 100, align: 'center'},
            {key: 'price', title: '零售价', width: 110, align: 'center'},
            {key: 'discount', title: '折扣', width: 100, align: 'center'},
            {key: 'number', title: '补发数量', width: 120, align: 'center'},
            {key: 'total_price', title: '补发订货应收', width: 130, align: 'center'},
            {key: 'barcode', title: '条码', minWidth: 160, align: 'center'},
            {key: 'box_standard', title: '箱规', width: 100, align: 'center'}
          ],
          repurchaseColumns: [
            {key: 'pro_name', title: '产品名称', minWidth: 180, align: 'center'},
            {key: 'standard', title: '规格', width: 100, align: 'center'},
            {key: 'unit', title: '单位', width: 100, align: 'center'},
            {key: 'price', title: '零售价', width: 110, align: 'center'},
            {key: 'discount', title: '换购折扣', width: 100, align: 'center'},
            {key: 'number', title: '订货数量', width: 120, align: 'center'},
            {key: 'total_price', title: '换购应收', width: 130, align: 'center'},
            {key: 'barcode', title: '条码', minWidth: 160, align: 'center'},
            {key: 'box_standard', title: '箱规', width: 100, align: 'center'}
          ],
          backPointColumns: [
            {key: 'pro_name', title: '产品名称', minWidth: 180, align: 'center'},
            {key: 'standard', title: '规格', width: 100, align: 'center'},
            {key: 'unit', title: '单位', width: 100, align: 'center'},
            {key: 'price', title: '零售价', width: 110, align: 'center'},
            {key: 'discount', title: '折扣', width: 100, align: 'center'},
            {key: 'number', title: '订货数量', width: 120, align: 'center'},
            {key: 'total_price', title: '返点货值', width: 130, align: 'center'},
            {key: 'barcode', title: '条码', minWidth: 160, align: 'center'},
            {key: 'box_standard', title: '箱规', width: 100, align: 'center'}
          ],
          giftColumns: [
            {key: 'pro_name', title: '产品名称', minWidth: 180, align: 'center'},
            {key: 'standard', title: '规格', width: 100, align: 'center'},
            {key: 'unit', title: '单位', width: 100, align: 'center'},
            {key: 'price', title: '零售价', width: 110, align: 'center'},
            {key: 'discount', title: '换购折扣', width: 100, align: 'center'},
            {key: 'number', title: '订货数量', width: 120, align: 'center'},
            {key: 'total_price', title: '配赠货值', width: 130, align: 'center'},
            {key: 'barcode', title: '条码', minWidth: 160, align: 'center'},
            {key: 'box_standard', title: '箱规', width: 100, align: 'center'}
          ],
          matchingColumns: [
            {key: 'pro_name', title: '产品名称', minWidth: 180, align: 'center'},
            {key: 'standard', title: '规格', width: 100, align: 'center'},
            {key: 'unit', title: '单位', width: 100, align: 'center'},
            {key: 'price', title: '零售价', width: 110, align: 'center'},
            {key: 'discount', title: '折扣', width: 100, align: 'center'},
            {key: 'number', title: '满赠数量', width: 120, align: 'center'},
            {key: 'total_price', title: '返点货值', width: 130, align: 'center'},
            {key: 'barcode', title: '条码', minWidth: 160, align: 'center'},
            {key: 'box_standard', title: '箱规', width: 100, align: 'center'}
          ],
          order: [],
          repurchase: [],
          backPoint: [],
          gift: [],
          matching: [],
        },
        auditArrLength: 0
      }
    },
    methods: {
      formatPaymentMethod(type) { // 支付方式
        switch (type) {
          case 'monthly':
            return '月结'
          case 'spotCash':
            return '现款现货'
          case 'realSale':
            return '实销实结'
          default:
            return ''
        }
      },
      formatReceivablesStatus(type) { // 收款状态
        switch (type) {
          case 'wait_receipt':
            return '待付款'
          case 'unpaid':
            return '未付款'
          case 'paid':
            return '已付款'
          case 'receipt':
            return '已收款'
          default:
            return ''
        }
      },
      formatDeliveryStatus(type) { // 发货方式
        switch (type) {
          case 'express':
            return '快递'
          case 'logistics':
            return '物流'
          default:
            return ''
        }
      },
      exportDispatchOrder() {
        this.$api.reissueDeliveryExport({id: this.detailData.id}).then((res) => {
          if (res.code === 0) {
            window.location.href = res.data.filePath
          }
        })
      },
      goBack() {
        this.$store.commit('removeTag', this.$route.name)
        this.$router.push({path: '/replacement-management/replacement-order-review/review'})
      },
      formatDate(time) {  // 时间格式转换
        return this.$format(time, 'yyyy-MM-dd hh:mm:ss')
      },
      formatDeliveryStatus(type) {
        switch (type) {
          case 'delivery_pending_notice':
            return '待通知发货'
          case 'delivery_pending':
            return '待发货'
          case 'delivery_finish':
            return '已发货'
          default:
            return '';
        }
      },
      openPolicyDetail() {
        this.$refs.policyDetail.getAgreeDetail(this.detailData.contract_policy_id)
      },
      goOrderDetail() {
        this.$router.push({
          path: '/order-management/review-details',
          query: {
            id: this.detailData.origin_id
          }
        })
      }
    },
    mounted() {
      let id = this.$route.query.id
      this.$api.reissueDetail(id).then((res) => {
        if (res.code == 0) {
          this.detailData = res.data
          this.auditArrLength = this.detailData.auditLogItems.length
          this.detailData.unissuedProducts.forEach(items => {
            this.unissuedData[items.type].push(items)
          })
          this.detailData.reissueProducts.forEach(items => {
            this.reissueData[items.type].push(items)
          })
          this.detailData.length = this.detailData.facade.length
        }
      })
    }
  }
</script>
<style lang="less" scoped>
  .row-style {
    margin: 10px 0 20px 0;
  }

  .col-right {
    text-align: center;
  }

  .file-style {
    margin-left: 60px;
    margin-top: -20px;
    width: 950px;

    a {
      margin: 0 10px 7px 10px;
      display: inline-flex;
    }
  }
</style>
