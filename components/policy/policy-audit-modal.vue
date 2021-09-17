<template>
  <div class="policy-audit">
    <Modal
      class-name="policy-audit-modal"
      :value="show"
      :title="title"
      :width="width"
      :mask-closable="true"
      @on-cancel="handleOnCancel">
      <div class="rel">
        <div class="ivu-table-wrapper" style="border: transparent;">
          <div class="ivu-table ivu-table-small">
            <div class="ivu-table-body">
              <table cellspacing="0" cellpadding="0" border="0" width="100%">
                <!-- 基础信息 start -->
                <tbody class="ivu-table-tbody border">
                  <tr class="ivu-table-row">
                    <td class="head-bg">
                      <div class="ivu-table-cell">政策名称</div>
                    </td>
                    <td colspan="3">
                      <div class="ivu-table-cell">
                        <span>{{ data.policyName }}</span>
                      </div>
                    </td>
                    <td class="head-bg">
                      <div class="ivu-table-cell">有效截止日期</div>
                    </td>
                    <td colspan="3">
                      <div class="ivu-table-cell">
                        <span>{{ data.deadlineAt }}</span>
                      </div>
                    </td>
                  </tr>
                  <tr class="ivu-table-row">
                    <td class="head-bg">
                      <div class="ivu-table-cell">税率</div>
                    </td>
                    <td colspan="3">
                      <div class="ivu-table-cell">
                        <span>{{ data.taxDeduction + '%' }}</span>
                      </div>
                    </td>
                    <td class="head-bg">
                      <div class="ivu-table-cell">政策状态</div>
                    </td>
                    <td colspan="3">
                      <div class="ivu-table-cell">
                        <span>{{ data.enableStatus === 'enable' ? '在用' : '停用' }}</span>
                      </div>
                    </td>
                  </tr>
                  <tr class="ivu-table-row">
                    <td class="head-bg">
                      <div class="ivu-table-cell">创建人</div>
                    </td>
                    <td colspan="3">
                      <div class="ivu-table-cell">
                        <span>{{ data.createdBy }}</span>
                      </div>
                    </td>
                    <td class="head-bg">
                      <div class="ivu-table-cell">创建时间</div>
                    </td>
                    <td colspan="3">
                      <div class="ivu-table-cell">
                        <span>{{ data.createdAt }}</span>
                      </div>
                    </td>
                  </tr>
                  <tr class="ivu-table-row">
                    <td class="head-bg">
                      <div class="ivu-table-cell">审核人</div>
                    </td>
                    <td colspan="3">
                      <div class="ivu-table-cell">
                        <span>{{ data.auditBy }}</span>
                      </div>
                    </td>
                    <td class="head-bg">
                      <div class="ivu-table-cell">审核时间</div>
                    </td>
                    <td colspan="3">
                      <div class="ivu-table-cell">
                        <span>{{ data.auditAt }}</span>
                      </div>
                    </td>
                  </tr>
                  <tr class="ivu-table-row" v-if="hideAuditer" >
                    <td class="head-bg">
                      <div class="ivu-table-cell">审核结果</div>
                    </td>
                    <td colspan="7">
                      <div class="ivu-table-cell">{{ formatAuditStatus(data.status) }}</div>
                    </td>
                  </tr>
                </tbody>
                <!-- 基础信息 end -->

                <!-- 适用客户 start -->
                <tbody class="ivu-table-tbody">
                  <tr>
                    <td class="table-title" colspan="8"><p>适用客户</p></td>
                  </tr>
                </tbody>
                <template v-if="data.regularType === 'type'">
                  <tbody class="ivu-table-tbody border">
                    <tr>
                      <td class="head-bg" colspan="4">
                        <div class="ivu-table-cell">指定客户类型</div>
                      </td>
                      <td colspan="4">
                        <div class="ivu-table-cell">{{ formatMerchantType(data.assignMerchantType) }}</div>
                      </td>
                    </tr>
                  </tbody>
                </template>
                <template v-else>
                  <tbody class="ivu-table-tbody border">
                    <tr class="ivu-table-row">
                      <td class="head-bg" colspan="5">
                        <div class="ivu-table-cell">指定客户</div>
                      </td>
                      <td class="head-bg" colspan="3">
                        <div class="ivu-table-cell">客户类型</div>
                      </td>
                    </tr>
                    <tr class="ivu-table-row" v-for="(item, index) in data.regularContractorList" :key="`regularContractorList${index}`">
                      <td colspan="5">
                        <div class="ivu-table-cell">{{ item.merchantName }}</div>
                      </td>
                      <td colspan="3">
                        <div class="ivu-table-cell">{{ formatMerchantType(item.merchantType) }}</div>
                      </td>
                    </tr>
                  </tbody>
                </template>
                <!-- 适用客户 end -->

                <!-- 适用商品 start -->
                <!-- <tbody class="ivu-table-tbody">
                  <tr>
                    <td class="table-title" colspan="8"><p>适用商品</p></td>
                  </tr>
                </tbody>
                <tbody class="ivu-table-tbody border">
                  <template v-if="!suitGoodsData.length">
                    <tr class="ivu-table-row">
                      <td colspan="8">
                        <div class="ivu-table-cell">暂无数据</div>
                      </td>
                    </tr>
                  </template>
                  <template v-else>
                    <tr class="ivu-table-row">
                      <td class="head-bg" colspan="4">
                        <div class="ivu-table-cell">商品类目</div>
                      </td>
                      <td class="head-bg" colspan="1">
                        <div class="ivu-table-cell">商品数量</div>
                      </td>
                      <td class="head-bg" colspan="3">
                        <div class="ivu-table-cell">操作</div>
                      </td>
                    </tr>
                    <tr class="ivu-table-row" v-for="(item, index) in suitGoodsData" :key="`suitGoods${index}`">
                      <td colspan="4">
                        <div class="ivu-table-cell">{{item.leimu}}</div>
                      </td>
                      <td colspan="1">
                        <div class="ivu-table-cell">{{item.shuliang}}</div>
                      </td>
                      <td colspan="3">
                        <div class="ivu-table-cell">
                          <a href="javascript:;" @click="handleShowSuitGoodsDetail(item)">查看详情</a>
                        </div>
                      </td>
                    </tr>
                  </template>
                </tbody> -->
                <!-- 适用商品 end -->

                <!-- 基础折扣设置 start -->
                <template v-if="data.baseDiscountList.length > 0">
                  <tbody class="ivu-table-tbody">
                    <tr>
                      <td class="table-title" colspan="8"><p>基础折扣设置</p></td>
                    </tr>
                  </tbody>
                  <tbody class="ivu-table-tbody border">
                    <tr class="ivu-table-row" v-for="(item, index) in data.baseDiscountList" :key="`baseDiscountList${index}`">
                      <td class="head-bg">
                        <div class="ivu-table-cell">梯度折扣</div>
                      </td>
                      <td colspan="3">
                        <div class="ivu-table-cell">
                          <span>{{ item.proportion + '%' }}</span>
                        </div>
                      </td>
                      <td class="head-bg">
                        <div class="ivu-table-cell">应收金额</div>
                      </td>
                      <td colspan="3">
                        <div class="ivu-table-cell">
                          <span>{{ item.startingAmount }}</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </template>
                <!-- 基础折扣设置 end -->

                <!-- 品类折扣 start -->
                <!-- <tbody class="ivu-table-tbody">
                  <tr>
                    <td class="table-title" colspan="8"><p>品类折扣</p></td>
                  </tr>
                </tbody>
                <tbody class="ivu-table-tbody border">
                  <template v-if="!zhekou.length">
                    <tr class="ivu-table-row">
                      <td colspan="8">
                        <div class="ivu-table-cell">暂无数据</div>
                      </td>
                    </tr>
                  </template>
                  <template v-else>
                    <tr class="ivu-table-row" v-for="(item, index) in zhekou" :key="`categoryDiscount${index}`">
                      <td class="head-bg">
                        <div class="ivu-table-cell">品类</div>
                      </td>
                      <td colspan="3">
                        <div class="ivu-table-cell">
                          <span>{{'面膜'}}</span>
                        </div>
                      </td>
                      <td class="head-bg">
                        <div class="ivu-table-cell">折扣</div>
                      </td>
                      <td colspan="3">
                        <div class="ivu-table-cell">
                          <span>{{'35.00%'}}</span>
                        </div>
                      </td>
                    </tr>
                  </template>
                </tbody> -->
                <!-- 品类折扣 end -->

                <!-- 单品折扣 start -->
                <template v-if="data.productDiscountList.length > 0">
                  <tbody class="ivu-table-tbody">
                    <tr>
                      <td class="table-title" colspan="8"><p>单品折扣</p></td>
                    </tr>
                  </tbody>
                  <tbody class="ivu-table-tbody border">
                    <tr class="ivu-table-row" v-for="(item, index) in data.productDiscountList" :key="`productDiscountList${index}`">
                      <td class="head-bg">
                        <div class="ivu-table-cell">产品</div>
                      </td>
                      <td colspan="3">
                        <div class="ivu-table-cell">
                          <span>{{ item.name }}</span>
                        </div>
                      </td>
                      <td class="head-bg">
                        <div class="ivu-table-cell">{{ item.objectName === 'discount' ? '折扣' : '单价' }}</div>
                      </td>
                      <td colspan="3">
                        <div class="ivu-table-cell">
                          <span>{{ item.objectName === 'discount' ? `${item.proportion}%` : `${item.directPrice}` }}</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </template>
                <!-- 单品折扣 end -->

                <!-- 返点设置 start -->
                <!-- <tbody class="ivu-table-tbody">
                  <tr>
                    <td class="table-title" colspan="8"><p>返点设置</p></td>
                  </tr>
                </tbody>
                <tbody class="ivu-table-tbody border">
                  <template v-if="!zhekou.length">
                    <tr class="ivu-table-row">
                      <td colspan="8">
                        <div class="ivu-table-cell">暂无数据</div>
                      </td>
                    </tr>
                  </template>
                  <template v-else>
                    <tr class="ivu-table-row" v-for="(item, index) in zhekou" :key="`rebate${index}`">
                      <td class="head-bg">
                        <div class="ivu-table-cell">返点比例</div>
                      </td>
                      <td colspan="3">
                        <div class="ivu-table-cell">
                          <span>{{'面膜'}}</span>
                        </div>
                      </td>
                      <td class="head-bg">
                        <div class="ivu-table-cell">应收金额</div>
                      </td>
                      <td colspan="3">
                        <div class="ivu-table-cell">
                          <span>{{'35.00%'}}</span>
                        </div>
                      </td>
                    </tr>
                  </template>
                </tbody> -->
                <!-- 返点设置 end -->

                <!-- 换购设置 start -->
                <!-- <tbody class="ivu-table-tbody">
                  <tr>
                    <td class="table-title" colspan="8"><p>换购设置</p></td>
                  </tr>
                </tbody>
                <tbody class="ivu-table-tbody border">
                  <template v-if="!manjianData.length">
                    <tr class="ivu-table-row">
                      <td colspan="8">
                        <div class="ivu-table-cell">暂无数据</div>
                      </td>
                    </tr>
                  </template>
                  <template v-else>
                    <template v-for="(parent, pIndex) in manjianData">
                      <tr class="ivu-table-row">
                        <td class="head-bg">
                          <div class="ivu-table-cell">满足应收金额</div>
                        </td>
                        <td colspan="7">
                          <div class="ivu-table-cell">
                            <span>{{parent.cost}}</span>
                          </div>
                        </td>
                      </tr>
                      <tr v-for="(children, cIndex) in parent.details" :key="pIndex + 'exchange' + cIndex">
                        <td class="head-bg">
                          <div class="ivu-table-cell">类型</div>
                        </td>
                        <td>
                          <div class="ivu-table-cell">
                            <span>{{children.cost}}</span>
                          </div>
                        </td>
                        <td class="head-bg">
                          <div class="ivu-table-cell">换购产品</div>
                        </td>
                        <td colspan="2">
                          <div class="ivu-table-cell">
                            <span>{{children.zhekou}}</span>
                          </div>
                        </td>
                        <td class="head-bg">
                          <div class="ivu-table-cell">换购折扣</div>
                        </td>
                        <td colspan="2">
                          <div class="ivu-table-cell">
                            <span>{{children.zhekou}}</span>
                          </div>
                        </td>
                      </tr>
                    </template>
                  </template>
                </tbody> -->
                <!-- 换购设置 end -->

                <!-- 配赠设置 start -->
                <template v-if="data.matchingDiscountList.length > 0">
                  <tbody class="ivu-table-tbody">
                    <tr>
                      <td class="table-title" colspan="8"><p>配赠设置</p></td>
                    </tr>
                  </tbody>
                  <tbody class="ivu-table-tbody border">
                    <template v-for="(item, index) in data.matchingDiscountList">
                      <tr class="ivu-table-row">
                        <td class="head-bg">
                          <div class="ivu-table-cell">配赠应收金额</div>
                        </td>
                        <td colspan="7">
                          <div class="ivu-table-cell">
                            <span>{{ item.startingAmount }}</span>
                          </div>
                        </td>
                      </tr>
                      <tr v-for="(dItem, dIndex) in item.detailList" :key="index + 'matchingDetail' + dIndex">
                        <td class="head-bg">
                          <div class="ivu-table-cell">{{ dItem.firstFlag ? '配赠比例' : ''}}</div>
                        </td>
                        <td>
                          <div class="ivu-table-cell">
                            <span>{{ dItem.firstFlag ? `${dItem.matchingMolecule} : ${dItem.matchingDenominator} 赠` : '' }}</span>
                          </div>
                        </td>
                        <td class="head-bg">
                          <div class="ivu-table-cell">购买产品</div>
                        </td>
                        <td colspan="2">
                          <div class="ivu-table-cell">
                            <span>{{ dItem.conditionName }}</span>
                          </div>
                        </td>
                        <td class="head-bg">
                          <div class="ivu-table-cell">配赠产品</div>
                        </td>
                        <td colspan="2">
                          <div class="ivu-table-cell">
                            <span>{{ dItem.name }}</span>
                          </div>
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </template>
                <!-- 配赠设置 end -->

                <!-- 满减设置 start -->
                <!-- <tbody class="ivu-table-tbody">
                  <tr>
                    <td class="table-title" colspan="8"><p>满减设置</p></td>
                  </tr>
                </tbody>
                <tbody class="ivu-table-tbody border">
                  <template v-if="!manjianData.length">
                    <tr class="ivu-table-row">
                      <td colspan="8">
                        <div class="ivu-table-cell">暂无数据</div>
                      </td>
                    </tr>
                  </template>
                  <template v-else>
                    <template v-for="(parent, pIndex) in manjianData">
                      <tr class="ivu-table-row">
                        <td class="head-bg">
                          <div class="ivu-table-cell">满减应收金额</div>
                        </td>
                        <td colspan="7">
                          <div class="ivu-table-cell">
                            <span>{{parent.cost}}</span>
                          </div>
                        </td>
                      </tr>
                      <tr v-for="(children, cIndex) in parent.details" :key="pIndex + 'gift' + cIndex">
                        <td class="head-bg">
                          <div class="ivu-table-cell">直接优惠金额</div>
                        </td>
                        <td colspan="3">
                          <div class="ivu-table-cell">
                            <span>{{children.cost}}</span>
                          </div>
                        </td>
                        <td class="head-bg">
                          <div class="ivu-table-cell">整单折扣</div>
                        </td>
                        <td colspan="3">
                          <div class="ivu-table-cell">
                            <span>{{children.zhekou}}</span>
                          </div>
                        </td>
                      </tr>
                    </template>
                  </template>
                </tbody> -->
                <!-- 满减设置 end -->

                <!-- 满赠设置 start -->
                <template v-if="data.giftDiscountList.length > 0">
                  <tbody class="ivu-table-tbody">
                    <tr>
                      <td class="table-title" colspan="8"><p>满赠设置</p></td>
                    </tr>
                  </tbody>
                  <tbody class="ivu-table-tbody border">
                    <template v-for="(item, index) in data.giftDiscountList">
                      <tr class="ivu-table-row">
                        <td class="head-bg">
                          <div class="ivu-table-cell">满赠应收金额</div>
                        </td>
                        <td colspan="7">
                          <div class="ivu-table-cell">
                            <span>{{item.startingAmount}}</span>
                          </div>
                        </td>
                      </tr>
                      <tr v-for="(dItem, dIndex) in item.detailList" :key="index + 'giftDetail' + dIndex">
                        <td class="head-bg">
                          <div class="ivu-table-cell">类型</div>
                        </td>
                        <td>
                          <div class="ivu-table-cell">
                            <span>{{ dItem.objectName === 'product' ? '商品' : '' }}</span>
                          </div>
                        </td>
                        <td class="head-bg">
                          <div class="ivu-table-cell">换购产品</div>
                        </td>
                        <td colspan="2">
                          <div class="ivu-table-cell">
                            <span>{{ dItem.name }}</span>
                          </div>
                        </td>
                        <td class="head-bg">
                          <div class="ivu-table-cell">数量</div>
                        </td>
                        <td colspan="2">
                          <div class="ivu-table-cell">
                            <span>{{ dItem.number }}</span>
                          </div>
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </template>
                <!-- 满赠设置 end -->

                <!-- 审核结果 start -->
                <template v-if="!hideAuditer">
                  <!-- 占位 -->
                  <tbody class="ivu-table-tbody">
                    <tr>
                      <td class="table-title" colspan="8"></td>
                    </tr>
                  </tbody>
                  <!-- 占位 -->
                  <tbody class="ivu-table-tbody border" >
                    <tr class="ivu-table-row">
                      <td class="head-bg" colspan="4">
                        <div class="ivu-table-cell">审核结果</div>
                      </td>
                      <td colspan="4">
                        <div class="ivu-table-cell">
                          <RadioGroup v-model="auditResult">
                            <Radio :label="1">通过</Radio>
                            <Radio :label="0">不通过</Radio>
                          </RadioGroup>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </template>
                <!-- 审核结果 end -->
              </table>
            </div>
          </div>
        </div>
        <Spin v-show="spinLoading" :fix="true" size="large"></Spin>
      </div>
      <div slot="footer">
        <div v-if="hideAuditer">
          <Button type="primary" @click="handleOnOk">知道了</Button>
        </div>
        <div v-else>
          <Button @click="handleOnCancel">取消</Button>
          <Button type="primary" :disabled="spinLoading" @click="handleOnOk">确认</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { formatAuditStatus, formatMerchantType } from '@/utils/policy'
export default {
  name: 'polict-audit-modal',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '供货商详情'
    },
    hideAuditer: { // 隐藏审核器 默认: 不隐藏
      type: Boolean,
      default: false,
    },
    spinLoading: {
      type: Boolean,
      default: false,
    },
    width: {
      type: String | Number,
      default: 1000,
    },
    data: { // 详情数据
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      auditResult: '', // 审核结果
    }
  },
  watch: {
    show(newVal, oldVal) {
      if (newVal) {
        this.auditResult = '';
      }
    }
  },
  methods: {
    /**
     * 查看 - 适用商品详情
     * @param {Object} currentData: 当前点击的数据
     */
    handleShowSuitGoodsDetail(currentData) {
      currentData = JSON.parse(JSON.stringify(currentData));
      this.$emit('on-show-detail', currentData);
    },

    /**
     * 确认/知道了
     */
    handleOnOk() {
      if (!this.hideAuditer && this.auditResult === '') return this.$Message.warning('请选择审核结果!');
      const id = this.data.id,
        auditResult = this.auditResult ? true : false,
        res = this.hideAuditer ? {} : { auditResult, id };
      this.$emit('on-ok', res);
    },

    /**
     * 取消
     */
    handleOnCancel() {
      this.$emit('on-cancel');
    },

    /**
     * 转换审核状态
     */
    formatAuditStatus(status) {
      return formatAuditStatus(status);
    },

    /**
     * 转换客户类型
     */
    formatMerchantType(type) {
      return formatMerchantType(type);
    },
  },
}
</script>

<style lang="less" scoped>
.policy-audit-modal {
  .ivu-table {
    td {
      border-right: 1px solid #e8eaec;
    }
    th {
      border-right: 1px solid #e8eaec;
    }
    .ivu-table-tbody {
      position: relative;
      &.border::before {
        content: '';
        width: 100%;
        height: 1px;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        background-color: #e8eaec;
        z-index: 3;
      }
      &.border::after {
        content: '';
        width: 1px;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-color: #e8eaec;
        z-index: 3;
      }
      .table-title {
        border: 0;
        font-size: 14px;
        text-align: left;
      }
      .table-content {
        border: 0;
      }
    }
  }
}
</style>