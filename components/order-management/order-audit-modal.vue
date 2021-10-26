<template>
  <div class="order-audit">
    <Modal
      class-name="order-audit-modal"
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
                      <div class="ivu-table-cell">创建人</div>
                    </td>
                    <td>
                      <div class="ivu-table-cell">
                        <span>{{ data.createdBy }}</span>
                      </div>
                    </td>
                    <td class="head-bg">
                      <div class="ivu-table-cell">创建时间</div>
                    </td>
                    <td>
                      <div class="ivu-table-cell">
                        <span>{{ data.createdAt }}</span>
                      </div>
                    </td>
                    <td class="head-bg">
                      <div class="ivu-table-cell">业务员</div>
                    </td>
                    <td>
                      <div class="ivu-table-cell">
                        <span>{{ data.salesman }}</span>
                      </div>
                    </td>
                  </tr>
                  <tr class="ivu-table-row">
                    <td class="head-bg">
                      <div class="ivu-table-cell">订单来源</div>
                    </td>
                    <td>
                      <div class="ivu-table-cell">
                        <span>{{ data.orderFrom }}</span>
                      </div>
                    </td>
                    <td class="head-bg">
                      <div class="ivu-table-cell">结款方式</div>
                    </td>
                    <td>
                      <div class="ivu-table-cell">
                        <span>{{ data.paymentMethod }}</span>
                      </div>
                    </td>
                    <td class="head-bg">
                      <div class="ivu-table-cell">送货方式</div>
                    </td>
                    <td>
                      <div class="ivu-table-cell">
                        <span>{{ data.deliveryMode }}</span>
                      </div>
                    </td>
                  </tr>
                  <tr class="ivu-table-row">
                    <td class="head-bg">
                      <div class="ivu-table-cell">商家名称</div>
                    </td>
                    <td>
                      <div class="ivu-table-cell">
                        <span>{{ data.merchantName }}</span>
                      </div>
                    </td>
                    <td class="head-bg">
                      <div class="ivu-table-cell">系统/门店</div>
                    </td>
                    <td>
                      <div class="ivu-table-cell">
                        <span>{{ data.systemName }}</span>
                      </div>
                    </td>
                    <td class="head-bg">
                      <div class="ivu-table-cell">供货政策</div>
                    </td>
                    <td>
                      <div class="ivu-table-cell">
                        <a href="javascript:;" @click="showContractPolicy(data.contractPolicyId)">{{ data.contractPolicyName }}</a>
                      </div>
                    </td>
                  </tr>
                  <tr class="ivu-table-row">
                    <td class="head-bg">
                      <div class="ivu-table-cell">订单编号</div>
                    </td>
                    <td>
                      <div class="ivu-table-cell">
                        <span>{{ data.orderSn }}</span>
                      </div>
                    </td>
                    <td class="head-bg">
                      <div class="ivu-table-cell">下单时间</div>
                    </td>
                    <td>
                      <div class="ivu-table-cell">
                        <span>{{ data.orderTime }}</span>
                      </div>
                    </td>
                    <td class="head-bg">
                      <div class="ivu-table-cell">订单应收金额</div>
                    </td>
                    <td>
                      <div class="ivu-table-cell">
                        <span>{{ data.totalOrderAmount }}</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="head-bg">
                      <div class="ivu-table-cell">附件凭证</div>
                    </td>
                    <td colspan="5">凭证</td>
                  </tr>
                  <tr>
                    <td class="head-bg">
                      <div class="ivu-table-cell">备注</div>
                    </td>
                    <td colspan="5">
                      <span>{{ data.remark }}</span>
                    </td>
                  </tr>
                </tbody>
                <!-- 基础信息 end -->

                <!-- 商品清单 start -->
                <tbody class="ivu-table-tbody">
                  <tr>
                    <td class="table-title"><p>商品清单</p></td>
                  </tr>
                </tbody>
                <tbody class="ivu-table-tbody">
                  <tr class="ivu-table-row">
                    <td class="border-none" colspan="6">
                      <Table border :columns="productListColumns" :data="data.productList"></Table>
                    </td>
                  </tr>
                </tbody>
                <!-- 商品清单 end -->

                <!-- 赠品清单 start -->
                <tbody class="ivu-table-tbody">
                  <tr>
                    <td class="table-title"><p>赠品清单</p></td>
                  </tr>
                </tbody>
                <tbody class="ivu-table-tbody">
                  <tr class="ivu-table-row">
                    <td class="border-none" colspan="6">
                      <Table border :columns="giftListColumns" :data="data.giftList"></Table>
                    </td>
                  </tr>
                </tbody>
                <!-- 赠品清单 end -->

                <!-- 审核数据 start -->
                <tbody class="ivu-table-tbody">
                  <tr>
                    <td class="table-title"></td>
                  </tr>
                </tbody>
                <!-- 复审 -->
                <template v-if="type === 'director'">
                  <tbody class="ivu-table-tbody border">
                    <tr>
                      <td class="head-bg">
                        <div class="ivu-table-cell">初审</div>
                      </td>
                      <td>
                        <div class="ivu-table-cell">
                          <span>{{ data.auditLog.createdBy }}</span>
                        </div>
                      </td>
                      <td class="head-bg">
                        <div class="ivu-table-cell">审核时间</div>
                      </td>
                      <td>
                        <div class="ivu-table-cell">
                          <span>{{ data.auditLog.createdAt }}</span>
                        </div>
                      </td>
                      <td class="head-bg">
                        <div class="ivu-table-cell">审核结果</div>
                      </td>
                      <td>
                        <div class="ivu-table-cell">
                          <span>{{ data.auditLog.status }}</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td class="head-bg">
                        <div class="ivu-table-cell">备注</div>
                      </td>
                      <td colspan="5">
                        <div class="ivu-table-cell">
                          <span>{{ data.auditLog.opinion }}</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td class="head-bg">
                        <div class="ivu-table-cell">审核结果</div>
                      </td>
                      <td colspan="5">
                        <div class="ivu-table-cell">
                          <RadioGroup v-model="isPass">
                            <Radio :label="1">通过</Radio>
                            <Radio :label="0">不通过</Radio>
                          </RadioGroup>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td class="head-bg">
                        <div class="ivu-table-cell">备注</div>
                      </td>
                      <td colspan="5">
                        <div class="ivu-table-cell">
                          <Input v-model="remark" />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </template>
                <!-- 初审 -->
                <template v-else>
                  <tbody class="ivu-table-tbody border">
                    <tr>
                      <td class="head-bg">
                        <div class="ivu-table-cell">审核结果</div>
                      </td>
                      <td colspan="2">
                        <div class="ivu-table-cell">
                          <RadioGroup v-model="isPass">
                            <Radio :label="1">通过</Radio>
                            <Radio :label="0">不通过</Radio>
                          </RadioGroup>
                        </div>
                      </td>
                      <td class="head-bg">
                        <div class="ivu-table-cell">是否需要复审</div>
                      </td>
                      <td colspan="2">
                        <div class="ivu-table-cell">
                          <RadioGroup v-model="needDirectorAudit">
                            <Radio :label="1" :disabled="disabledDirectorAudit">是</Radio>
                            <Radio :label="0" :disabled="disabledDirectorAudit">否</Radio>
                          </RadioGroup>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td class="head-bg">
                        <div class="ivu-table-cell">备注</div>
                      </td>
                      <td colspan="5">
                        <div class="ivu-table-cell">
                          <Input v-model="remark" />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </template>
                <!-- 审核数据 end -->
              </table>
            </div>
          </div>
        </div>
        <Spin v-show="spinLoading" :fix="true" size="large"></Spin>
      </div>
      <div slot="footer">
        <Button @click="handleOnCancel">取消</Button>
        <Button type="primary" :disabled="spinLoading" :loading="submitting" @click="handleOnOk">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'order-audit-modal',
  props: {
    width: { // 宽度
      type: String | Number,
      default: 1000,
    },
    type: {
      type: String,
      default: 'manage', // 审核类型： manage/初审（默认）  director/复审
    },
    show: { // 展示
      type: Boolean,
      default: false,
    },
    spinLoading: { // 加载状态
      type: Boolean,
      default: false,
    },
    submitting: { // 是否提交中
      type: Boolean,
      default: false,
    },
    data: { // 数据
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    title() {
      return this.type === 'manage' ? '初审' : '复审';
    },
    disabledDirectorAudit() {
      return this.isPass ? false : (this.needDirectorAudit = null, true);
    },
  },
  data() {
    return {
      isPass: null, // 是否通过
      needDirectorAudit: null, // 是否需要复审
      remark: null, // 备注

      productListColumns: [
        { title: '产品名称', key: 'name', align: 'center', minWidth: 210 },
        { title: '规格', key: 'standard', align: 'center', minWidth: 120 },
        { title: '单位', key: 'unit', align: 'center', minWidth: 80, className: 'colspan' },
        { title: '零售价', key: 'price', align: 'center', minWidth: 150 },
        { title: '折扣', key: 'discount', align: 'center', minWidth: 80 },
        { title: '订货数量', key: 'number', align: 'center', minWidth: 100 },
        { title: '订货应收', key: 'totalPrice', align: 'center', minWidth: 150 },
        { title: '条码', key: 'barcode', align: 'center', minWidth: 200, className: 'colspan' },
        { title: '箱规', key: 'boxStandard', align: 'center', minWidth: 80 }
      ],
      giftListColumns: [
        { title: '产品名称', key: 'name', align: 'center', minWidth: 210 },
        { title: '规格', key: 'standard', align: 'center', minWidth: 120, className: 'colspan' },
        { title: '单位', key: 'unit', align: 'center', minWidth: 80 },
        { title: '零售价', key: 'price', align: 'center', minWidth: 150, className: 'colspan' },
        { title: '折扣', key: 'discount', align: 'center', minWidth: 80 },
        { title: '赠品数量', key: 'number', align: 'center', minWidth: 100, className: 'colspan' },
        { title: '条码', key: 'barcode', align: 'center', minWidth: 200, className: 'colspan' },
        { title: '箱规', key: 'boxStandard', align: 'center', minWidth: 80 }
      ]
    }
  },
  watch: {
    show(newVal, oldVal) {
      if (newVal) {
        ['isPass', 'needDirectorAudit', 'remark'].forEach(key => this[key] = null);
      }
    },
  },
  methods: {
    // 确认
    handleOnOk() {
      const { type, isPass, needDirectorAudit, remark } = this;
      const id = this.data.id;
      if (!this.isSelectDone()) return this.$Message.warning('请选择审核结果!');

      this.$emit('on-ok', { 
        id,
        type,
        remark,
        isPass: !!isPass,
        needDirectorAudit: type === 'manage' ? !!needDirectorAudit : false,
      })
    },

    // 取消
    handleOnCancel() {
      this.$emit('on-cancel');
    },

    // 校验是否已经选择  true/已选择  false/未选择
    isSelectDone () {
      const { type, isPass, needDirectorAudit } = this;
      return type === 'director' ? typeof isPass === 'number': isPass === 0 || (typeof isPass === 'number' && typeof needDirectorAudit === 'number');
    },

    /**
     * 查看供货政策
     * 触发事件 on-show-policy
     * @param {String|Number} id: 政策id
     */
    showContractPolicy(id) {
      this.$emit('on-show-policy', id);
    },

    /**
     * 转换审核文本
     * @param {String} status: 审核标识
     */
    transformAuditLabel(status) {
      let label = '';
      ['OrderWorkflow/auditFailure', 'OrderWorkflow/auditRecheckPending'].includes(status) && (label = '初审');
      ['OrderWorkflow/auditRecheckFailure'].includes(status) && (label = '复审');
      return label;
    },
  }
}
</script>

<style lang="less" scoped>
/deep/ .order-audit-modal {
  .ivu-modal-content .ivu-modal-body {
    max-height: 600px;
    overflow-y: auto
  }
  .ivu-table {
    td {
      border-right: 1px solid #e8eaec;
      &.border-none {
        border-bottom: 0;
        .ivu-table-border {
          &::after {
            width: 0;
          }
          td, th {
            &:last-child, &.colspan {
              border-right: 0;
            }
          }
        }
      }
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