<template>
  <div class="order-deal-modal">
    <Modal
      class="order-deal-modal"
      :value="show"
      title="订单处理"
      width="900"
      @on-cancel="handleOnCancel">
      <div class="rel">
        <div class="ivu-table-wrapper" style="margin-top: 20px;">
          <div class="ivu-table ivu-table-small ivu-table-border">
            <div class="ivu-table-body">
              <table cellspacing="0" cellpadding="0" border="0" width="100%">
                <!-- 基础详情 start -->
                <tbody>
                  <tr class="ivu-table-row">
                    <td class="head-bg">
                      <div class="ivu-table-cell">创建人</div>
                    </td>
                    <td>
                      <div class="ivu-table-cell">{{ detailData.createdBy }}</div>
                    </td>
                    <td class="head-bg">
                      <div class="ivu-table-cell">创建时间</div>
                    </td>
                    <td>
                      <div class="ivu-table-cell">{{ detailData.createdAt }}</div>
                    </td>
                  </tr>
                  <tr class="ivu-table-row">
                    <td class="head-bg">
                      <div class="ivu-table-cell">公司名称</div>
                    </td>
                    <td>
                      <div class="ivu-table-cell">{{ detailData.merchantName }}</div>
                    </td>
                    <td class="head-bg">
                      <div class="ivu-table-cell">系统/门店名称</div>
                    </td>
                    <td>
                      <div class="ivu-table-cell">{{ detailData.systemName }}</div>
                    </td>
                  </tr>
                  <tr class="ivu-table-row">
                    <td class="head-bg">
                      <div class="ivu-table-cell">供货政策</div>
                    </td>
                    <td colspan="3">
                      <div class="ivu-table-cell">{{ detailData.contractPolicyName }}</div>
                    </td>
                  </tr>
                  <tr class="ivu-table-row">
                    <td class="head-bg">
                      <div class="ivu-table-cell">结款方式</div>
                    </td>
                    <td>
                      <div class="ivu-table-cell">{{ detailData.paymentMethodText }}</div>
                    </td>
                    <td class="head-bg">
                      <div class="ivu-table-cell">订单应收金额</div>
                    </td>
                    <td>
                      <div class="ivu-table-cell">{{ detailData.totalOrderAmount }}</div>
                    </td>
                  </tr>
                  <template v-if="['spotCash', 'spot_cash'].includes(detailData.paymentMethod)">
                    <tr>
                      <td class="head-bg">
                        <div class="ivu-table-cell">{{ detailData.paymentType === 'alipay' ? '支付宝户名' : '银行户名' }}</div>
                      </td>
                      <td>
                        <div class="ivu-table-cell">{{ detailData.accountName }}</div>
                      </td>
                      <td class="head-bg">
                        <div class="ivu-table-cell">{{ detailData.paymentType === 'alipay' ? '支付宝账号' : '银行账号' }}</div>
                      </td>
                      <td>
                        <div class="ivu-table-cell">{{ detailData.accountNumber }}</div>
                      </td>
                    </tr>
                    <tr>
                      <td class="head-bg">
                        <div class="ivu-table-cell">汇款金额</div>
                      </td>
                      <td>
                        <div class="ivu-table-cell">{{ detailData.paymentMoney }}</div>
                      </td>
                      <td class="head-bg">
                        <div class="ivu-table-cell">汇款时间</div>
                      </td>
                      <td>
                        <div class="ivu-table-cell">{{ detailData.paymentDate }}</div>
                      </td>
                    </tr>
                    <tr class="ivu-table-row">
                      <td class="head-bg">
                        <div class="ivu-table-cell">附件凭证</div>
                      </td>
                      <td colspan="3">
                        <div class="file">
                          <a 
                            href="javascript:;"
                            v-for="(item, index) in detailData.orderFile"
                            @click="handleDownLoadFile(item.urlShow)"
                            :key="`orderFile-${index}`"
                          >
                            {{ item.title }}
                          </a>
                        </div>
                      </td>
                    </tr>
                  </template>
                  <tr class="ivu-table-row">
                    <td class="head-bg">
                      <div class="ivu-table-cell">备注</div>
                    </td>
                    <td colspan="3">
                      <div class="ivu-table-cell">{{ detailData.remark }}</div>
                    </td>
                  </tr>
                </tbody>
                <!-- 基础详情 end -->
                <!-- 产品清单 start -->
                <tbody>
                  <tr class="ivu-table-row">
                    <td colspan="4">
                      <div class="table-title">产品清单</div>
                    </td>
                  </tr>
                  <tr class="ivu-table-row">
                    <td colspan="4" class="table-content">
                      <Table :data="detailData.productList" :columns="goodsColumns"></Table>
                    </td>
                  </tr>
                </tbody>
                <!-- 产品清单 end -->
                <!-- 配赠清单 start -->
                <tbody>
                  <tr class="ivu-table-row">
                    <td colspan="4">
                      <div class="table-title">配赠清单</div>
                    </td>
                  </tr>
                  <tr class="ivu-table-row">
                    <td colspan="4" class="table-content">
                      <Table :data="detailData.giftList" :columns="giftColumns"></Table>
                    </td>
                  </tr>
                </tbody>
                <!-- 配赠清单 end -->
                <!-- 处理表单区域 start -->
                <tbody>
                  <tr class="ivu-table-row">
                    <td class="head-bg">
                      <div class="ivu-table-cell">是否处理</div>
                    </td>
                    <td>
                      <div class="ivu-table-cell">
                        <RadioGroup v-model="playload.disposeResult" @on-change="handleDealOnChange">
                          <Radio :label="1">确认</Radio>
                          <Radio :label="0">驳回</Radio>
                        </RadioGroup>
                      </div>
                    </td>
                    <td class="head-bg">
                      <div class="ivu-table-cell">发货方式</div>
                    </td>
                    <td>
                      <div class="ivu-table-cell">
                        <RadioGroup v-model="playload.deliveryMode">
                          <Radio label="express" :disabled="!playload.disposeResult">快递</Radio>
                          <Radio label="logistics" :disabled="!playload.disposeResult">物流</Radio>
                        </RadioGroup>
                      </div>
                    </td>
                  </tr>
                  <tr class="ivu-table-row">
                    <td class="head-bg">
                      <div>收货地址</div>
                    </td>
                    <td colspan="3">
                      <div class="ivu-table-cell">
                        <Select
                          ref="addressSelect"
                          v-model="playload.contractorAddrGroupId"
                          filterable
                          :loading="addressLoading"
                          :disabled="!playload.disposeResult">
                          <Option v-for="(item, index) in addressOptions" :value="item.id" :label="item.label" :key="`addressOptions${index}`"></Option>
                        </Select>
                      </div>
                    </td>
                  </tr>
                  <tr class="ivu-table-row">
                    <td class="head-bg">
                      <div>处理备注</div>
                    </td>
                    <td colspan="3">
                      <div class="ivu-table-cell">
                        <Input v-model="playload.remark" placeholder="请输入" />
                      </div>
                    </td>
                  </tr>
                </tbody>
                <!-- 处理表单区域 end -->
              </table>
            </div>
          </div>
        </div>
        <Spin v-show="spinLoading" :fix="true" size="large"></Spin>
      </div>
      <div slot="footer">
        <Button @click="handleOnCancel">取消</Button>
        <Button type="primary" :loading="submitting" @click="handleOnOk">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { formatOrderFrom, formatPaymentMethod } from '@/utils/order.js'
export default {
  name: 'order-deal-modal',
  props: {
    show: { // 审核弹窗
      type: Boolean,
      default: false,
    },
    submitting: { // 确认loading
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      goodsColumns: [ // 产品清单 列
        {
          title: '产品名称',
          key: 'name',
          minWidth: 200,
          align: 'center',
        },
        {
          title: '条码',
          key: 'barcode',
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
          title: '订货数量',
          key: 'number',
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
          title: '应收金额',
          key: 'productAmount',
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
          title: '箱规',
          key: 'boxStandard',
          minWidth: 120,
          align: 'center',
        },
      ],
      giftColumns: [
        {
          title: '产品名称',
          key: 'name',
          minWidth: 200,
          align: 'center',
        },
        {
          title: '条码',
          key: 'barcode',
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
          title: '订货数量',
          key: 'number',
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
          title: '配赠货值',
          key: 'productAmount',
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
          title: '箱规',
          key: 'boxStandard',
          minWidth: 120,
          align: 'center',
        },
      ],
      playload: {
        disposeResult: '',
        deliveryMode: '',
        contractorAddrGroupId: '',
        remark: '',
      },
      spinLoading: false,
      detailData: { // 详情数据
        productList: [], // 产品清单
        giftList: [], // 配赠清单
      },

      // 收货地址
      addressLoading: false,
      addressOptions: [],
    }
  },
  watch: {
    show(newVal, oldVal) {
      if (newVal) {
        this.spinLoading = true;
        ['disposeResult', 'deliveryMode', 'contractorAddrGroupId', 'remark'].forEach(key => this.playload[key] = undefined);

        // 设置滚动条回到顶部
        const div = window.document.querySelector('.order-deal-modal .ivu-modal-body');
        this.$nextTick(() => div.scrollTop = 0);
      }
    }
  },
  methods: {
    // 获取订单详情
    async getDetail(id) {
      this.spinLoading = true;
      try {
        let { code, data } = await this.$api.orderReviewDetailsV2({id});
        if (code === 0) {
          this.getMerchantRecvingAddress(data.merchantName);
          data.orderFrom = formatOrderFrom(data.orderFrom);
          data.paymentMethodText = formatPaymentMethod(data.paymentMethod);
          data.giftList = [ ...data.giftProductList, ...data.matchingProductList ];

          this.detailData = data;
        }
      } catch (error) {}
      this.spinLoading = false;
    },

    // 获取商家收货地址
    async getMerchantRecvingAddress(name) {
      this.addressLoading = true;
      let { code, data } = await this.$api.getOrderContractorListV2({name});
      try {
        if (code === 0) {
          data[0].contractorReceivingAddrGroup.forEach(item => item.label = `${item.province}${item.city}${item.county} ${item.receivingAddress}`);
          this.addressOptions = data[0].contractorReceivingAddrGroup;
        }
      } catch (error) {}
      this.addressLoading = false;
    },

    // 下载文件
    handleDownLoadFile(url) {
      window.open(url);
    },

    /**
     * 是否处理 选项发生变化
     * @param {String} option: 当前选中项
     */
    handleDealOnChange(option) {
      if (!option) {
        this.$refs.addressSelect.setQuery(null);
        ['deliveryMode', 'contractorAddrGroupId'].forEach(item => this.playload[item] = undefined);
      }
    },

    // 取消弹窗
    handleOnCancel() {
      this.$emit('on-cancel');
    },

    /**
     * 确定
     */
    handleOnOk() {
      const { id } = this.detailData;
      let { disposeResult, deliveryMode, contractorAddrGroupId, remark } = this.playload;
      if (typeof disposeResult === 'undefined') return this.$Message.warning('请选择处理状态!');

      disposeResult = !!disposeResult;
      if (remark && remark.length > 200) return this.$Message.warning('备注大于200字符!');
      // 驳回
      if (!disposeResult) return this.$emit('on-ok', {id, remark, disposeResult});

      // 确认
      if (!deliveryMode) return this.$Message.warning('请选择发货方式!');
      if (!contractorAddrGroupId) return this.$Message.warning('请选择收货地址!');
      this.$emit('on-ok', { id, disposeResult, deliveryMode, contractorAddrGroupId, remark});
    },
  }
}
</script>

<style lang="less" scpoed>
.order-deal-modal {
  .ivu-modal-content .ivu-modal-body {
    max-height: 600px;
    overflow-y: auto
  }
  .file {
    a {
      &:not(:last-child):after {
        content: '，';
      }
    }
  }
  .table-title {
    font-weight: 700;
    text-align: left;
    padding-left: 20px;
  }
  .ivu-table {
    td.table-content {
      padding: 0;
      border: 0;
      .ivu-table-wrapper {
        border: 0;
        .ivu-table-row {
          td {
            &:last-child {
              border-right: 0;
            }
          }
        }
        .ivu-table-header {
          tr {
            th {
              &:last-child {
                border-right: 0;
              }
            }
          }
        }
      }
    }
  }
}
</style>