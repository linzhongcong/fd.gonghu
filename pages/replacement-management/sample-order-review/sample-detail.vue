<template>
  <div>
    <Card>
      <div slot="title" style="text-align:right">
        <Button type="primary" @click="goBack()">返回</Button>
      </div>
      <div>
        <!-- 补发信息 -->
        <Card>
          <Row type="flex" justify="start" slot="title">
            <Col :md="8">
              <p>样品订单编号：{{ detailData.order_sn}}</p>
            </Col>
          </Row>
          <Row class="row-style">
            <Col :md="8">样品订单编号：{{ detailData.order_sn }}</Col>
            <Col :md="8">创建人：{{ detailData.created_by }}</Col>
            <Col :md="8">创建时间：{{ formatDate(detailData.created_at) }}</Col>
          </Row>
          <Row class="row-style">
            <Col :md="8">发货对象：{{ detailData.delivery_object }}</Col>
            <Col :md="8">渠道：{{ detailData.channel_type }}</Col>
            <Col :md="8">样品发货原因：{{ detailData.reason }}</Col>
          </Row>
          <Row class="row-style">
            <Col :md="8">发货方式：{{ detailData.delivery_mode == 'express' ? '快递' : '物流' }}</Col>
            <Col :md="8">联系方式：{{ detailData.contact_phone }}</Col>
            <Col :md="8">备注：{{ detailData.remark }}</Col>
          </Row>
          <Row class="row-style">
            <Col :md="24">
              发货地址：{{ detailData.province + detailData.city + detailData.county + ' ' +detailData.receiving_address }}
            </Col>
          </Row>
          <Row class="row-style">
            <Col :md="24">补发凭证：
              <div class="file-style">
                <a v-for="(item, index) in detailData.files" :key="'file'+index" :href="baseUrl + item.url"
                   target="_blank">{{ item.title + '.' + item.extension }}</a>
              </div>
            </Col>
          </Row>
        </Card>
        <!-- 样品订单信息 -->
        <Card>
          <Row type="flex" justify="start" slot="title">
            <Col :md="8">
              <p>样品订单信息</p>
            </Col>
          </Row>
          <Row class="row-style">商品清单</Row>
          <Row>
            <Table border :columns="orderData.columns" :data="orderData.data" size="small"></Table>
          </Row>
          <Row class="row-style"><h4>样品货值：{{ detailData.product_value }}</h4></Row>
        </Card>
        <!-- 审核信息-->
        <Card>
          <Row type="flex" justify="space-between" slot="title">
            <Col :md="8">
              <p>审核信息</p>
            </Col>
          </Row>
          <Row class="row-style">
            <Col :md="8">初审：{{ auditArrLength == 0 ? '无' : detailData.auditLogItems[0].created_by }}
            </Col>
            <Col :md="8">审核结果：{{ auditArrLength == 0 ? '无' : (detailData.auditLogItems[0].audit_pass == 1
              ? '通过' : '不通过') }}
            </Col>
            <Col :md="8">审核时间：{{ auditArrLength == 0 ? '无' :
              formatDate(detailData.auditLogItems[0].created_at) }}
            </Col>
          </Row>
          <Row class="row-style">
            <Col :md="8">备注：{{ auditArrLength == 0 ? '无' : detailData.auditLogItems[0].opinion }}</Col>
          </Row>
          <!-- 总监 -->
          <Row class="row-style" >
            <Col :md="8">复审：{{ auditArrLength >= 2 ? detailData.auditLogItems[1].created_by : '无'}}
            </Col>
            <Col :md="8">审核结果：{{ auditArrLength >= 2 ?  (detailData.auditLogItems[0].audit_pass ==1 && detailData.auditLogItems[1].audit_pass == 1
              ? '通过' : '不通过'): '无' }}
            </Col>
            <Col :md="8">审核时间：{{ auditArrLength >= 2 ?  formatDate(detailData.auditLogItems[1].created_at): '无' }}
            </Col>
          </Row>
          <Row class="row-style">
            <Col :md="8">备注：{{ auditArrLength >= 2 ? detailData.auditLogItems[1].opinion: '无' }}</Col>
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
  </div>
</template>
<script>
  import {SERVER_BASE_URL} from '~/api/config';

  export default {
    data() {
      return {
        baseUrl: `${SERVER_BASE_URL}/`,
        detailData: {},
        orderData: {
          columns: [
            {key: 'pro_name', title: '产品名称', minWidth: 180, align: 'center'},
            {key: 'standard', title: '规格', width: 120, align: 'center'},
            {key: 'unit', title: '单位', width: 120, align: 'center'},
            {key: 'price', title: '零售价', width: 120, align: 'center'},
            {key: 'number', title: '数量', width: 120, align: 'center'},
            {key: 'product_value', title: '样品货值', width: 120, align: 'center'},
            {key: 'barcode', title: '条码', minWidth: 180, align: 'center'},
            {key: 'box_standard', title: '箱规', width: 120, align: 'center'}
          ],
          data: []
        },
        auditArrLength: 0
      }
    },
    methods: {
      formatPaymentMethod(type) { // 支付方式
        switch (type) {
          case 'monthly':
            return '月结'
          case 'spot_cash':
            return '现款现货'
          case 'real_sale':
            return '实销实结'
          default:
            return ''
        }
      },
      formatReceivablesStatus(type) { // 收款状态
        switch (type) {
          case 'wait_receipt':
            return '待付款'
          case 'spot_cash':
            return '现款现货'
          case 'real_sale':
            return '实销实结'
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
        this.$api.sampleDeliveryExport({id: this.detailData.id}).then((res) => {
          if (res.code === 0) {
            window.location.href = res.data[0]
          }
        })
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
      goBack() {
        this.$store.commit('removeTag', this.$route.name)
        this.$router.push({path: '/replacement-management/sample-order-review/review'})
      }
    },
    mounted() {
      let id = this.$route.query.id
      this.$api.sampleDetail(id).then((res) => {
        if (res.code == 0) {
          this.detailData = res.data
          this.auditArrLength = this.detailData.auditLogItems.length
          this.orderData.data = this.detailData.sampleOrderProducts
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
