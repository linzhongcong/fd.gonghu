<template>
  <div class="review-detail">
    <Card>
      <Row slot="title" type="flex" justify="end">
        <Button @click="goBack">返回</Button>
      </Row>
      <!-- 内容 -->
      <div>
        <!-- 订单编号 - 基础信息 -->
        <Card>
          <Row slot="title" type="flex" justify="space-between">
            <h3>订单编号：{{ detailData.orderSn }}</h3>
            <h3>订单金额：<span style="color: #ed4014;">￥{{ detailData.totalOrderAmount }}</span></h3>
          </Row>
          <div>
            <Row>
              <Col :md="8">
                <div class="row">
                  <div class="row-title">公司名称：</div>
                  <div class="row-label">{{ detailData.merchantName }}</div>
                </div>
              </Col>
              <Col :md="8">
                <div class="row">
                  <div class="row-title">系统/门店：</div>
                  <div class="row-label">{{ detailData.systemName }}</div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col :md="8">
                <div class="row">
                  <div class="row-title">收货地址：</div>
                  <div class="row-label">{{ detailData.receivingAddress }}</div>
                </div>
              </Col>
              <Col :md="8">
                <div class="row">
                  <div class="row-title">联系人：</div>
                  <div class="row-label">{{ detailData.contactName }}</div>
                </div>
              </Col>
              <Col :md="8">
                <div class="row">
                  <div class="row-title">联系电话：</div>
                  <div class="row-label">{{ detailData.contactPhone }}</div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col :md="8">
                <div class="row">
                  <div class="row-title">结款方式：</div>
                  <div class="row-label">{{ detailData.paymentMethodText }}</div>
                </div>
              </Col>
              <Col :md="8">
                <div class="row">
                  <div class="row-title">业务员：</div>
                  <div class="row-label">{{ detailData.salesman }}</div>
                </div>
              </Col>
              <Col :md="8">
                <div class="row">
                  <div class="row-title">下单时间：</div>
                  <div class="row-label">{{ detailData.orderTime }}</div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col :md="8">
                <div class="row">
                  <div class="row-title">订单来源：</div>
                  <div class="row-label">{{ detailData.orderFromText }}</div>
                </div>
              </Col>
              <Col :md="8">
                <div class="row">
                  <div class="row-title">创建人：</div>
                  <div class="row-label">{{ detailData.createdBy }}</div>
                </div>
              </Col>
              <Col :md="8">
                <div class="row">
                  <div class="row-title">创建时间：</div>
                  <div class="row-label">{{ detailData.createdAt }}</div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col :md="8">
                <div class="row">
                  <div class="row-title">附件凭证：</div>
                  <div class="row-label">
                    <div v-for="(item, index) in detailData.orderFile" :key="index">
                      <a href="javascript:;" @click="previewFile(item.extension, item.urlShow, item.title)">{{item.name}}</a>
                    </div>
                  </div>
                </div>
              </Col>
              <Col :md="8">
                <div class="row">
                  <div class="row-title">出货单：</div>
                  <div class="row-label"><a href="javascript:;" @click="downLoadDeliveryOrder(detailData.id, downLoadFlag)">出货单</a></div>
                </div>
              </Col>
              <Col :md="8">
                <div class="row">
                  <div class="row-title">备注：</div>
                  <div class="row-label">{{ detailData.remark }}</div>
                </div>
              </Col>
            </Row>
          </div>
        </Card>
        <!-- 订单信息 -->
        <Card>
          <Row slot="title" type="flex" justify="space-between">
            <h3>订单信息</h3>
            <h3>供货政策：<a href="javascript:;" @click="handleShowPolicy(detailData.contractPolicyId)">{{ detailData.contractPolicyName }}</a></h3>
          </Row>
          <div>
            <!-- 产品清单 -->
            <div class="repertoire">
              <div class="repertoire-title">产品清单</div>
              <div class="repertoire-content">
                <Table border :columns="repertoireColumns()" :data="detailData.productList"></Table>
              </div>
            </div>
            <!-- 配赠清单 -->
            <div class="repertoire">
              <div class="repertoire-title">配赠清单</div>
              <div class="repertoire-content">
                <Table border :columns="repertoireColumns('matching')" :data="detailData.matchingProductList"></Table>
              </div>
            </div>
            <!-- 赠品清单 -->
            <div class="repertoire">
              <div class="repertoire-title">赠品清单</div>
              <div class="repertoire-content">
                <Table border :columns="repertoireColumns('gift')" :data="detailData.giftProductList"></Table>
              </div>
            </div>
            <!-- 信息 -->
            <Row class="font-blod">
              <Col :md="8">
                <div class="row">
                  <div class="row-title">总产品数量：</div>
                  <div class="row-label">{{ detailData.totalProductQuantity }}</div>
                </div>
              </Col>
              <Col :md="8">
                <div class="row">
                  <div class="row-title">原订单应收金额：</div>
                  <div class="row-label">{{ detailData.originOrderAmount }}</div>
                </div>
              </Col>
              <Col :md="8">
                <div class="row">
                  <div class="row-title">实际订单应收金额：</div>
                  <div class="row-label">{{ detailData.totalOrderAmount }}</div>
                </div>
              </Col>
            </Row>
          </div>
        </Card>
        <!-- 审核信息 -->
        <Card>
          <Row slot="title" type="flex" justify="space-between">
            <h3>审核信息</h3>
          </Row>
          <div>
            <template v-for="item in detailData.auditLog">
              <Row>
                <Col :md="8">
                  <div class="row">
                    <div class="row-title" v-if="['OrderWorkflow/auditFailure', 'OrderWorkflow/auditRecheckPending'].includes(item.status)">初审：</div>
                    <div class="row-title" v-else-if="['OrderWorkflow/auditRecheckFailure', 'OrderWorkflow/auditRecheckPass'].includes(item.status)">复审：</div>
                    <div class="row-label">{{ item.createdBy }}</div>
                  </div>
                </Col>
                <Col :md="8">
                  <div class="row">
                    <div class="row-title">审核结果：</div>
                    <div class="row-label">{{ +item.auditPass ? '通过' : '不通过' }}</div>
                  </div>
                </Col>
                <Col :md="8">
                  <div class="row">
                    <div class="row-title">审核时间：</div>
                    <div class="row-label">{{ item.createdAt }}</div>
                  </div>
                </Col>
                <Col :md="24">
                  <div class="row">
                    <div class="row-title">备注：</div>
                    <div class="row-label">{{ item.opinion }}</div>
                  </div>
                </Col>
              </Row>
            </template>
            <div class="empty-tips" v-if="!detailData.auditLog.length">暂无数据</div>
          </div>
        </Card>
        <!-- 回款信息 -->
        <Card v-if="!!detailData.paymentType">
          <Row slot="title" type="flex" justify="space-between">
            <h3>回款信息</h3>
          </Row>
          <div>
            <Row>
              <Col :md="8">
                <div class="row">
                  <div class="row-title">{{ detailData.paymentType === 'bank' ? '银行户名：' : '支付宝户名：' }}</div>
                  <div class="row-label">{{ detailData.accountName }}</div>
                </div>
              </Col>
              <Col :md="8">
                <div class="row">
                  <div class="row-title">{{ detailData.paymentType === 'bank' ? '银行账号：' : '支付宝账号：' }}</div>
                  <div class="row-label">{{ detailData.accountNumber }}</div>
                </div>
              </Col>
            </Row>
          </div>
        </Card>
        <!-- 作废信息 -->
        <Card v-if="!!detailData.cancelPerson">
           <Row slot="title" type="flex" justify="space-between">
            <h3>作废信息</h3>
          </Row>
          <div>
            <Row>
              <Col :md="8">
                <div class="row">
                  <div class="row-title">作废人：</div>
                  <div class="row-label">{{ detailData.cancelPerson }}</div>
                </div>
              </Col>
              <Col :md="8">
                <div class="row">
                  <div class="row-title">作废时间：</div>
                  <div class="row-label">{{ detailData.cancelAt }}</div>
                </div>
              </Col>
              <Col :md="8">
                <div class="row">
                  <div class="row-title">作废说明：</div>
                  <div class="row-label">{{ detailData.cancelReason }}</div>
                </div>
              </Col>
            </Row>
          </div>
        </Card>
      </div>
      <Spin v-if="spinShow" fix></Spin>
    </Card>

    <!-- 政策详情 start -->
    <PolicyAuditModal
      hide-auditer
      :show="policyModalObj.show"
      :data="policyModalObj.data"
      :spin-loading="policyModalObj.spinLoading"
      @on-ok="() => policyModalObj.show = false"
      @on-cancel="policyModalObj.show = false">
    </PolicyAuditModal>
    <!-- 政策详情 end -->

    <!-- 查看大图 -->
    <ImgModal
      :show="imgModalObj.show"
      :imgIndex="imgModalObj.index"
      :imgArr="imgModalObj.list"
      @closeImgModal="closeImgModal">
    </ImgModal>
  </div>
</template>

<script>
import { formatPaymentMethod, formatOrderFrom } from '@/utils/order.js';
import PolicyAuditModal from '@/components/policy/policy-audit-modal.vue';

export default {
  components: {PolicyAuditModal},
  data() {
    return {
      spinShow: false,
      downLoadFlag: false, // 下载标识

      // 详情数据
      detailData: {
        auditLog: [],
      },

      // 政策模态窗
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

      // 展示大图
      imgModalObj: {
        show: false,
        index: 0,
        list: [],
      }
    }
  },
  methods: {
    /**
     * 获取详情
     * @param {Stringt} id: 订单id1
     */
    async getDetail(id) {
      this.spinShow = true;
      try {
        let { code, data } = await this.$api.orderReviewDetails({id});
        if (code === 0) {
          data.paymentMethodText = formatPaymentMethod(data.paymentMethod);
          data.orderFromText = formatOrderFrom(data.orderFrom);

          this.detailData = data;
          this.spinShow = false;
        }
      } catch (error) {
        this.spinShow = false;
      }
      
    },

    /**
     * 下载出货单
     */
    async downLoadDeliveryOrder(id, downing) {
      if (downing) return false;
      this.downLoadFlag = true;
      try {
        let { code, data } = await this.$api.orderDeliveryExport({id});
        code === 0 && this.$download(data.url);
      } catch (error) {}
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
          this.policyModalObj.spinLoading = false;
        }
      } catch (error) {
        this.policyModalObj.spinLoading = false;
      }
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
     * 清单表头
     * @param {String} type: 清单类型  matching: 配赠清单   gift: 赠品清单
     * @return {Array} 表头
     */
    repertoireColumns(type) {
      const arr = [ // 产品清单表头
        {
          title: '产品名称',
          key: 'name',
          minWidth: 200,
          align: 'center',
        },
        {
          title: '规格',
          key: 'standard',
          minWidth: 120,
          align: 'center',
        },
        {
          title: '单位',
          key: 'unit',
          minWidth: 120,
          align: 'center',
        },
        {
          title: '零售价',
          key: 'price',
          minWidth: 120,
          align: 'center',
        },
        {
          title: '折扣',
          key: 'discount',
          minWidth: 120,
          align: 'center',
        },
        {
          title: '订货数量',
          key: 'number',
          minWidth: 120,
          align: 'center',
        },
        {
          title: '订货应收',
          key: 'totalPrice',
          minWidth: 150,
          align: 'center',
        },
        {
          title: '条码',
          key: 'barcode',
          minWidth: 150,
          align: 'center',
        },
        {
          title: '箱规',
          key: 'boxStandard',
          minWidth: 120,
          align: 'center',
        },
      ];
      if (type === 'matching') {
        arr[5].title = '配赠数量';
        arr[6].title = '配赠货值';
      }
      if (type === 'gift') {
        arr[5].title = '满赠数量';
        arr[6].title = '满赠货值';
      }
      return arr;
    },

    /**
     * 展示供货政策
     * @param {String} id: 政策id
     */
    handleShowPolicy(id) {
      this.getPolicyDetail(id);
      this.policyModalObj.show = true;
    },

    /**
     * 预览附件
     * @param {String} extension: 文件后缀
     * @param {String} url: 文件URL
     * @param {String} fileName: 文件名
     */
    previewFile(extension, url, fileName) {
      if (['jpg', 'png', 'jpeg', 'gif'].includes(extension)) {
        this.imgModalObj.list = [ url ];
        return this.imgModalObj.show = true;
      }

      // 文件触发下载
      this.$download(url);
    },

    // 关闭鱼片弹窗
    closeImgModal({ show, arr }) {
      this.imgModalObj.list = arr;
      this.imgModalObj.show = show;
    },

    // 返回
    goBack() {
      this.$router.push('/order-management/review');
    }
  },
  mounted () {
    this.getDetail(this.$route.query.id);
  }
}
</script>

<style lang="less" scoped>
.review-detail {
  .row {
    padding: 8px 0;
    display: flex;
    .row-title {
      flex-shrink: 0;
    }
  }
  .repertoire {
    padding: 0 5px;
    margin-bottom: 16px;
    .repertoire-title {
      margin-bottom: 10px;
    }
  }
  .empty-tips {
    text-align: center;
  }
  .font-blod {
    font-weight: bold;
  }
}
</style>