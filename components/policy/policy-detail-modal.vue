<template>
  <div class="policy-detail">
    <Modal
      class-name="policy-detail-modal"
      v-model="show"
      :title="title"
      :width="width"
      :mask-closable="!submitLoading">
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
                        <span>{{ detailData.policyName }}</span>
                      </div>
                    </td>
                    <td class="head-bg">
                      <div class="ivu-table-cell">有效截止日期</div>
                    </td>
                    <td colspan="3">
                      <div class="ivu-table-cell">
                        <span>{{ detailData.deadlineAt }}</span>
                      </div>
                    </td>
                  </tr>
                  <tr class="ivu-table-row">
                    <td class="head-bg">
                      <div class="ivu-table-cell">税率</div>
                    </td>
                    <td colspan="3">
                      <div class="ivu-table-cell">
                        <span>{{ detailData.taxDeduction + '%' }}</span>
                      </div>
                    </td>
                    <td class="head-bg">
                      <div class="ivu-table-cell">政策状态</div>
                    </td>
                    <td colspan="3">
                      <div class="ivu-table-cell">
                        <span>{{ detailData.enableStatus === 'enable' ? '在用' : '停用' }}</span>
                      </div>
                    </td>
                  </tr>
                  <tr class="ivu-table-row">
                    <td class="head-bg">
                      <div class="ivu-table-cell">创建人</div>
                    </td>
                    <td colspan="3">
                      <div class="ivu-table-cell">
                        <span>{{ detailData.createdBy }}</span>
                      </div>
                    </td>
                    <td class="head-bg">
                      <div class="ivu-table-cell">创建时间</div>
                    </td>
                    <td colspan="3">
                      <div class="ivu-table-cell">
                        <span>{{ detailData.createdAt }}</span>
                      </div>
                    </td>
                  </tr>
                  <tr class="ivu-table-row">
                    <td class="head-bg">
                      <div class="ivu-table-cell">审核人</div>
                    </td>
                    <td colspan="3">
                      <div class="ivu-table-cell">
                        <span>{{ detailData.auditBy }}</span>
                      </div>
                    </td>
                    <td class="head-bg">
                      <div class="ivu-table-cell">审核时间</div>
                    </td>
                    <td colspan="3">
                      <div class="ivu-table-cell">
                        <span>{{ detailData.auditAt }}</span>
                      </div>
                    </td>
                  </tr>
                  <tr class="ivu-table-row" v-if="hideAuditer" >
                    <td class="head-bg">
                      <div class="ivu-table-cell">审核结果</div>
                    </td>
                    <td colspan="7">
                      <div class="ivu-table-cell">{{ detailData.statusText }}</div>
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
                <template v-if="detailData.regularType === 'type'">
                  <tbody class="ivu-table-tbody border">
                    <tr>
                      <td class="head-bg" colspan="4">
                        <div class="ivu-table-cell">指定客户类型</div>
                      </td>
                      <td colspan="4">
                        <div class="ivu-table-cell">{{ detailData.assignMerchantTypeText }}</div>
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
                    <tr class="ivu-table-row" v-for="(item, index) in detailData.regularContractorList" :key="`regularContractorList${index}`">
                      <td colspan="5">
                        <div class="ivu-table-cell">{{ item.merchantName }}</div>
                      </td>
                      <td colspan="3">
                        <div class="ivu-table-cell">{{ item.merchantTypeText }}</div>
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
                <template v-if="detailData.baseDiscountList.length > 0">
                  <tbody class="ivu-table-tbody">
                    <tr>
                      <td class="table-title" colspan="8"><p>基础折扣设置</p></td>
                    </tr>
                  </tbody>
                  <tbody class="ivu-table-tbody border">
                    <tr class="ivu-table-row" v-for="(item, index) in detailData.baseDiscountList" :key="`baseDiscountList${index}`">
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

                <!-- 单品折扣 start -->
                <template v-if="detailData.productDiscountList.length > 0">
                  <tbody class="ivu-table-tbody">
                    <tr>
                      <td class="table-title" colspan="8"><p>单品折扣</p></td>
                    </tr>
                  </tbody>
                  <tbody class="ivu-table-tbody border">
                    <tr class="ivu-table-row" v-for="(item, index) in detailData.productDiscountList" :key="`productDiscountList${index}`">
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

                <!-- 配赠设置 start -->
                <template v-if="detailData.matchingDiscountList.length > 0">
                  <tbody class="ivu-table-tbody">
                    <tr>
                      <td class="table-title" colspan="8"><p>配赠设置</p></td>
                    </tr>
                  </tbody>
                  <tbody class="ivu-table-tbody border">
                    <template v-for="(item, index) in detailData.matchingDiscountList">
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
                      <template v-for="(dItem, dIndex) in item.detailList">
                        <tr v-for="(pItem, pIndex) in dItem.productList">
                          <td class="head-bg">
                            <div class="ivu-table-cell">{{ !pIndex ? '配赠比例' : ''}}</div>
                          </td>
                          <td>
                            <div class="ivu-table-cell">
                              <span>{{ !pIndex ? `${dItem.matchingMolecule} : ${dItem.matchingDenominator} 赠` : '' }}</span>
                            </div>
                          </td>
                          <td class="head-bg">
                            <div class="ivu-table-cell">购买产品</div>
                          </td>
                          <td colspan="2">
                            <div class="ivu-table-cell">
                              <span>{{ pItem.conditionName }}</span>
                            </div>
                          </td>
                          <td class="head-bg">
                            <div class="ivu-table-cell">配赠产品</div>
                          </td>
                          <td colspan="2">
                            <div class="ivu-table-cell">
                              <span>{{ pItem.name }}</span>
                            </div>
                          </td>
                        </tr>
                      </template>
                    </template>
                  </tbody>
                </template>
                <!-- 配赠设置 end -->

                <!-- 满赠设置 start -->
                <template v-if="detailData.giftDiscountList.length > 0">
                  <tbody class="ivu-table-tbody">
                    <tr>
                      <td class="table-title" colspan="8"><p>满赠设置</p></td>
                    </tr>
                  </tbody>
                  <tbody class="ivu-table-tbody border">
                    <template v-for="(item, index) in detailData.giftDiscountList">
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
                          <div class="ivu-table-cell">满赠产品</div>
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
        <Spin v-show="spinLoading" fix size="large"></Spin>
      </div>
      <div slot="footer">
        <div v-if="hideAuditer">
          <Button type="primary" @click="closeModal">知道了</Button>
        </div>
        <div v-else>
          <Button @click="closeModal">取消</Button>
          <Button type="primary" :disabled="spinLoading" :loading="submitLoading" @click="handleOnSubmit">确认</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { formatMerchantType } from '@/utils/common.js';
import { formatAuditStatus } from '@/utils/policy.js';
export default {
  name: 'policy-detail-modal',
  props: {
    width: {
      type: String | Number,
      default: 1000,
    },
  },
  data() {
    return {
      show: false, // 弹窗展示
      title: '供货政策详情', // 标题
      spinLoading: false, // 加载loading
      hideAuditer: true, // 审核器，默认隐藏

      submitLoading: false, // 确认loading
      auditResult: '', // 审核结果

      detailData: {
        baseDiscountList: [],
        giftDiscountList: [],
        regularContractorList: [],
        matchingDiscountList: [],
        productDiscountList: [],
      },
    }
  },
  watch: {
    show(newVal, oldVal) {
      if (newVal) {
        // 设置滚动条回到顶部
        const div = window.document.querySelector('.policy-detail-modal .ivu-modal-body');
        this.$nextTick(() => div.scrollTop = 0);
      }
    }
  },
  methods: {
    /**
     * 获取政策详情
     * @param {String|Number} id: 详情id
     */
    async getDeatil(id) {
      this.show = true;
      this.spinLoading = true;
      try {
        const { code, data } = await this.$api.getContractPolicyDetailV2({id});
        if (code === 0) {
          data.statusText = formatAuditStatus(data.status);
          data.assignMerchantTypeText = formatMerchantType(data.assignMerchantType);
          data.regularContractorList.forEach(item => item.merchantTypeText = formatMerchantType(item.merchantType));
          this.detailData = data;
          this.spinLoading = false;
        }
      } catch (error) {}
    },

    /**
     * 审核
     * @param {Object} data: 请求数据
     */
    async auditPolicy(data) {
      this.submitLoading = true;
      try {
        let { code } = await this.$api.v2AuditContractPolicy(data);
        if (code === 0) {
          this.$Message.success('审核成功!');
          this.closeModal(false);
          this.$emit('on-success');
        }
      } catch (error) {}
      this.submitLoading = false;
    },

    /**
     * 初始化弹窗
     * @param {Object} data: 初始化弹窗参数
     * @param {Boolean} data.hideAuditer: 是否隐藏审核器
     * @param {String} data.title: 标题
     */
    initModal({id, hideAuditer = true, title = '供货政策详情'}) {
      this.hideAuditer = hideAuditer;
      this.title = title;

      this.auditResult = '';
      this.show = true;
      this.getDeatil(id);
    },

    /**
     * 关闭弹窗
     * @param {Boolean|Object} normal: 默认行为 如在模板直接调用此函数不传值,normal为Event(Object)
     */
    closeModal(normal = true) {
      if (normal && this.submitLoading) return false;
      this.show = false;
    },

    /**
     * 审核确认
     */
    handleOnSubmit() {
      if (this.auditResult === '') return this.$Message.warning('请选择审核结果!');
      const auditResult = !!this.auditResult;
      const id = this.detailData.id;

      this.auditPolicy({ id, auditResult });
    },
  },
}
</script>

<style lang="less" scoped>
/deep/ .policy-detail-modal {
  .ivu-modal-content .ivu-modal-body {
    max-height: 600px;
    overflow-y: auto
  }
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