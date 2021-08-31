<template>
  <div class="policy-audit">
    <Modal
      class-name="policy-audit-modal"
      v-model="modalShow"
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
                        <span>{{'活动优惠政策'}}</span>
                      </div>
                    </td>
                    <td class="head-bg">
                      <div class="ivu-table-cell">有效截止日期</div>
                    </td>
                    <td colspan="3">
                      <div class="ivu-table-cell">
                        <span>{{'2019-12-12'}}</span>
                      </div>
                    </td>
                  </tr>
                  <tr class="ivu-table-row">
                    <td class="head-bg">
                      <div class="ivu-table-cell">税率</div>
                    </td>
                    <td colspan="3">
                      <div class="ivu-table-cell">
                        <span>{{'-'}}</span>
                      </div>
                    </td>
                    <td class="head-bg">
                      <div class="ivu-table-cell">政策状态</div>
                    </td>
                    <td colspan="3">
                      <div class="ivu-table-cell">
                        <span>{{'在用'}}</span>
                      </div>
                    </td>
                  </tr>
                  <tr class="ivu-table-row">
                    <td class="head-bg">
                      <div class="ivu-table-cell">创建人</div>
                    </td>
                    <td colspan="3">
                      <div class="ivu-table-cell">
                        <span>{{'邓晓萍'}}</span>
                      </div>
                    </td>
                    <td class="head-bg">
                      <div class="ivu-table-cell">创建时间</div>
                    </td>
                    <td colspan="3">
                      <div class="ivu-table-cell">
                        <span>{{'2019-08-14 21:32'}}</span>
                      </div>
                    </td>
                  </tr>
                  <tr class="ivu-table-row">
                    <td class="head-bg">
                      <div class="ivu-table-cell">审核人</div>
                    </td>
                    <td colspan="3">
                      <div class="ivu-table-cell">
                        <span>{{'邓晓萍'}}</span>
                      </div>
                    </td>
                    <td class="head-bg">
                      <div class="ivu-table-cell">审核时间</div>
                    </td>
                    <td colspan="3">
                      <div class="ivu-table-cell">
                        <span>{{'2019-08-14 21:32'}}</span>
                      </div>
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
                <tbody class="ivu-table-tbody border">
                  <template v-if="!suitPartnerData.length">
                    <tr class="ivu-table-row">
                      <td colspan="8">
                        <div class="ivu-table-cell">暂无数据</div>
                      </td>
                    </tr>
                  </template>
                  <template v-else>
                    <tr class="ivu-table-row">
                      <td class="head-bg" colspan="5">
                        <div class="ivu-table-cell">指定客户</div>
                      </td>
                      <td class="head-bg" colspan="3">
                        <div class="ivu-table-cell">客户类型</div>
                      </td>
                    </tr>
                    <tr class="ivu-table-row" v-for="(item, index) in suitPartnerData" :key="`suitPartner${index}`">
                      <td colspan="5">
                        <div class="ivu-table-cell">{{item.name}}</div>
                      </td>
                      <td colspan="3">
                        <div class="ivu-table-cell">{{item.type}}</div>
                      </td>
                    </tr>
                  </template>
                </tbody>
                <!-- 适用客户 end -->
                <!-- 适用商品 start -->
                <tbody class="ivu-table-tbody">
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
                </tbody>
                <!-- 适用商品 end -->
                <!-- 适用商品 - Table start
                <tbody class="ivu-table-tbody">
                  <tr>
                    <td class="table-title" colspan="8"><p>适用商品</p></td>
                  </tr>
                  <tr>
                    <td class="table-content" colspan="8">
                      <Table border :columns="suitGoodsColumns" :data="suitGoodsData"></Table>
                    </td>
                  </tr>
                </tbody>
                适用商品 - Table end -->
                <!-- 基础折扣设置 start -->
                <tbody class="ivu-table-tbody">
                  <tr>
                    <td class="table-title" colspan="8"><p>基础折扣设置</p></td>
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
                    <tr class="ivu-table-row" v-for="(item, index) in zhekou" :key="`baseDiscount${index}`">
                      <td class="head-bg">
                        <div class="ivu-table-cell">梯度折扣</div>
                      </td>
                      <td colspan="3">
                        <div class="ivu-table-cell">
                          <span>{{'50.00%'}}</span>
                        </div>
                      </td>
                      <td class="head-bg">
                        <div class="ivu-table-cell">应收金额</div>
                      </td>
                      <td colspan="3">
                        <div class="ivu-table-cell">
                          <span>{{'2000.00'}}</span>
                        </div>
                      </td>
                    </tr>
                  </template>
                </tbody>
                <!-- 基础折扣设置 end -->
                <!-- 品类折扣 start -->
                <tbody class="ivu-table-tbody">
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
                </tbody>
                <!-- 品类折扣 end -->
                <!-- 单品折扣 start -->
                <tbody class="ivu-table-tbody">
                  <tr>
                    <td class="table-title" colspan="8"><p>单品折扣</p></td>
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
                    <tr class="ivu-table-row" v-for="(item, index) in zhekou" :key="`singleDiscount${index}`">
                      <td class="head-bg">
                        <div class="ivu-table-cell">产品</div>
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
                </tbody>
                <!-- 单品折扣 end -->
                <!-- 返点设置 start -->
                <tbody class="ivu-table-tbody">
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
                </tbody>
                <!-- 返点设置 end -->
                <!-- 换购设置 start -->
                <tbody class="ivu-table-tbody">
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
                </tbody>
                <!-- 换购设置 end -->
                <!-- 配赠设置 start -->
                <tbody class="ivu-table-tbody">
                  <tr>
                    <td class="table-title" colspan="8"><p>配赠设置</p></td>
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
                          <div class="ivu-table-cell">配赠应收金额</div>
                        </td>
                        <td colspan="7">
                          <div class="ivu-table-cell">
                            <span>{{parent.cost}}</span>
                          </div>
                        </td>
                      </tr>
                      <tr v-for="(children, cIndex) in parent.details" :key="pIndex + 'gift' + cIndex">
                        <td class="head-bg">
                          <div class="ivu-table-cell">配赠比例</div>
                        </td>
                        <td>
                          <div class="ivu-table-cell">
                            <span>{{children.cost}}</span>
                          </div>
                        </td>
                        <td class="head-bg">
                          <div class="ivu-table-cell">购买产品</div>
                        </td>
                        <td colspan="2">
                          <div class="ivu-table-cell">
                            <span>{{children.zhekou}}</span>
                          </div>
                        </td>
                        <td class="head-bg">
                          <div class="ivu-table-cell">配赠产品</div>
                        </td>
                        <td colspan="2">
                          <div class="ivu-table-cell">
                            <span>{{children.zhekou}}</span>
                          </div>
                        </td>
                      </tr>
                    </template>
                  </template>
                </tbody>
                <!-- 配赠设置 end -->
                <!-- 满减设置 start -->
                <tbody class="ivu-table-tbody">
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
                </tbody>
                <!-- 满减设置 end -->
                <!-- 满赠设置 start -->
                <tbody class="ivu-table-tbody">
                  <tr>
                    <td class="table-title" colspan="8"><p>满赠设置</p></td>
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
                          <div class="ivu-table-cell">满赠应收金额</div>
                        </td>
                        <td colspan="7">
                          <div class="ivu-table-cell">
                            <span>{{parent.cost}}</span>
                          </div>
                        </td>
                      </tr>
                      <tr v-for="(children, cIndex) in parent.details" :key="pIndex + 'gift' + cIndex">
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
                          <div class="ivu-table-cell">数量</div>
                        </td>
                        <td colspan="2">
                          <div class="ivu-table-cell">
                            <span>{{children.zhekou}}</span>
                          </div>
                        </td>
                      </tr>
                    </template>
                  </template>
                </tbody>
                <!-- 满赠设置 end -->
                <!-- 审核结果 start -->
                <!-- 占位 -->
                <tbody class="ivu-table-tbody">
                  <tr>
                    <td class="table-title" colspan="8"></td>
                  </tr>
                </tbody>
                <!-- 占位 -->
                <tbody class="ivu-table-tbody border" v-if="!hideAuditer">
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
  computed: {
    modalShow: {
      get() { return this.show },
      set(value) {},
    }
  },
  data() {
    return {
      auditResult: 0, // 审核结果
      exchangeData: [{}],
      zhekou: [{}],
      suitGoodsColumns: [
        {
          key: 'leimu',
          title: '商品类目',
          align: 'center',
          minWidth: 300,
        },
        {
          key: 'shuliang',
          title: '商品数量',
          align: 'center',
          minWidth: 100,
        },
        {
          title: '操作',
          align: 'center',
          minWidth: 200,
          render: (h, params) => h('a', {
            
          }, '查看详情')
        }
      ],
      suitPartnerData: [
        {
          name: '大润发',
          type: 'KA',
        }
      ],
      suitGoodsData: [
        {
          leimu: '大润发',
          shuliang: 'KA',
        }
      ],
      manjianData: [
        {
          cost: 1000,
          details: [
            {
              cost: 100,
              zhekou: '10%'
            },
            {
              cost: 300,
              zhekou: '30%'
            }
          ]
        },
        {
          cost: 2000,
          details: [
            {
              cost: 200,
              zhekou: '20%'
            }
          ]
        }
      ]
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
      const res = this.hideAuditer ? {} : { auditResult: this.auditResult }
      this.$emit('on-ok', res)
    },

    /**
     * 取消
     */
    handleOnCancel() {
      this.$emit('on-cancel')
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