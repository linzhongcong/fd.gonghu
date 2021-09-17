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
                <tbody>
                  <tr class="ivu-table-row">
                    <td class="head-bg">
                      <div class="ivu-table-cell">创建人</div>
                    </td>
                    <td>
                      <div class="ivu-table-cell">{{'123'}}</div>
                    </td>
                    <td class="head-bg">
                      <div class="ivu-table-cell">创建时间</div>
                    </td>
                    <td>
                      <div class="ivu-table-cell">{{'123'}}</div>
                    </td>
                  </tr>
                  <tr class="ivu-table-row">
                    <td class="head-bg">
                      <div class="ivu-table-cell">公司名称</div>
                    </td>
                    <td>
                      <div class="ivu-table-cell">{{'123'}}</div>
                    </td>
                    <td class="head-bg">
                      <div class="ivu-table-cell">系统/门店名称</div>
                    </td>
                    <td>
                      <div class="ivu-table-cell">{{'123'}}</div>
                    </td>
                  </tr>
                  <tr class="ivu-table-row">
                    <td class="head-bg">
                      <div class="ivu-table-cell">供货政策</div>
                    </td>
                    <td colspan="3">
                      <div class="ivu-table-cell">{{'123'}}</div>
                    </td>
                  </tr>
                  <tr class="ivu-table-row">
                    <td class="head-bg">
                      <div class="ivu-table-cell">结款方式</div>
                    </td>
                    <td>
                      <div class="ivu-table-cell">{{'123'}}</div>
                    </td>
                    <td class="head-bg">
                      <div class="ivu-table-cell">订单应收金额</div>
                    </td>
                    <td>
                      <div class="ivu-table-cell">{{'123'}}</div>
                    </td>
                  </tr>
                  <template v-if="true">
                    <tr>
                      <td class="head-bg">
                        <div class="ivu-table-cell">银行户名</div>
                      </td>
                      <td>
                        <div class="ivu-table-cell">{{'123'}}</div>
                      </td>
                      <td class="head-bg">
                        <div class="ivu-table-cell">银行账号</div>
                      </td>
                      <td>
                        <div class="ivu-table-cell">{{'123'}}</div>
                      </td>
                    </tr>
                    <tr>
                      <td class="head-bg">
                        <div class="ivu-table-cell">汇款金额</div>
                      </td>
                      <td>
                        <div class="ivu-table-cell">{{'123'}}</div>
                      </td>
                      <td class="head-bg">
                        <div class="ivu-table-cell">汇款时间</div>
                      </td>
                      <td>
                        <div class="ivu-table-cell">{{'123'}}</div>
                      </td>
                    </tr>
                  </template>
                  <tr class="ivu-table-row">
                    <td class="head-bg">
                      <div class="ivu-table-cell">附件凭证</div>
                    </td>
                    <td colspan="3">
                      <div class="file">
                        <a href="javascript:;" @click="handleDownLoadFile('url')">附件1</a>
                        <a href="javascript:;">附件2</a>
                      </div>
                    </td>
                  </tr>
                  <tr class="ivu-table-row">
                    <td class="head-bg">
                      <div class="ivu-table-cell">备注</div>
                    </td>
                    <td colspan="3">
                      <div class="ivu-table-cell">{{'123'}}</div>
                    </td>
                  </tr>
                </tbody>
                <!-- 产品清单 start -->
                <tbody>
                  <tr class="ivu-table-row">
                    <td colspan="4">
                      <div class="table-title">产品清单</div>
                    </td>
                  </tr>
                  <tr class="ivu-table-row">
                    <td colspan="4" class="table-content">
                      <Table :data="goodsData" :columns="goodsColumns"></Table>
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
                      <Table :data="giftData" :columns="giftColumns"></Table>
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
                        <RadioGroup v-model="resData.isDeal" @on-change="handleDealOnChange">
                          <Radio label="1">确认</Radio>
                          <Radio label="0">驳回</Radio>
                        </RadioGroup>
                      </div>
                    </td>
                    <td class="head-bg">
                      <div class="ivu-table-cell">发货方式</div>
                    </td>
                    <td>
                      <div class="ivu-table-cell">
                        <RadioGroup v-model="resData.sendMethod">
                          <Radio label="express" :disabled="!+resData.isDeal">快递</Radio>
                          <Radio label="logistics" :disabled="!+resData.isDeal">物流</Radio>
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
                          filterable
                          :loading="remoteLoading"
                          :remote-method="remoteMethod"
                          :disabled="!+resData.isDeal">
                          <Option v-for="(item, index) in remoteDataList" :value="item.id" :label="item.label" :key="`remoteDataList${index}`"></Option>
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
                        <Input placeholder="请输入" />
                      </div>
                    </td>
                  </tr>
                </tbody>
                <!-- 处理表单区域 end -->
              </table>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button @click="handleOnCancel">取消</Button>
        <Button type="primary" @click="handleOnOk">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'order-deal-modal',
  props: {
    show: { // 审核弹窗
      type: Boolean,
      default: false,
    },
    data: { // 表单数据
      type: Object,
      default() {
        return {};
      }
    },
    goodsData: { // 产品清单
      type: Array,
      default() {
        return [];
      }
    },
    giftData: { // 配赠清单
      type: Array,
      default() {
        return [];
      }
    },
    remoteLoading: { // 远程查询loading
      type: Boolean,
      default: false,
    },
    remoteMethod: { // 远程查询方法
      type: Function,
      default() {
        return () => {};
      }
    },
    remoteDataList: { // 远程查询列表
      type: Array,
      default() {
        return [];
      }
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
          key: 'name',
          minWidth: 200,
          align: 'center',
        },
        {
          title: '规格',
          key: 'name',
          minWidth: 120,
          align: 'center',
        },
        {
          title: '订货数量',
          key: 'name',
          minWidth: 120,
          align: 'center',
        },
        {
          title: '零售价',
          key: 'name',
          minWidth: 120,
          align: 'center',
        },
        {
          title: '折扣',
          key: 'name',
          minWidth: 120,
          align: 'center',
        },
        {
          title: '应收金额',
          key: 'name',
          minWidth: 120,
          align: 'center',
        },
        {
          title: '单位',
          key: 'name',
          minWidth: 120,
          align: 'center',
        },
        {
          title: '箱规',
          key: 'name',
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
          key: 'name',
          minWidth: 200,
          align: 'center',
        },
        {
          title: '规格',
          key: 'name',
          minWidth: 120,
          align: 'center',
        },
        {
          title: '订货数量',
          key: 'name',
          minWidth: 120,
          align: 'center',
        },
        {
          title: '零售价',
          key: 'name',
          minWidth: 120,
          align: 'center',
        },
        {
          title: '折扣',
          key: 'name',
          minWidth: 120,
          align: 'center',
        },
        {
          title: '配赠货值',
          key: 'name',
          minWidth: 120,
          align: 'center',
        },
        {
          title: '单位',
          key: 'name',
          minWidth: 120,
          align: 'center',
        },
        {
          title: '箱规',
          key: 'name',
          minWidth: 120,
          align: 'center',
        },
      ],
      resData: {
        isDeal: '1',
        sendMethod: 'express',
        addressId: '',
        remark: '',
      }
    }
  },
  watch: {
    show(newVal, oldVal) {
      if (newVal) {
        this.resData = JSON.parse(JSON.stringify(this.data));
      }
    }
  },
  methods: {
    /**
     * 下载文件
     */
    handleDownLoadFile(url) {
      window.open(url);
    },

    /**
     * 是否处理 选项发生变化
     * @param {String} option: 当前选中项
     */
    handleDealOnChange(option) {
      (!+option) && ['sendMethod', 'addressId'].forEach(item => this.resData[item] = '');
    },

    /**
     * 取消弹窗
     */
    handleOnCancel() {
      this.$emit('on-cancel');
    },

    /**
     * 确定
     */
    handleOnOk() {
      const { isDeal, sendMethod, addressId, remark } = this.resData;
      if (+isDeal) {
        if (sendMethod === '') return this.$Message.warning('请选择发货方式!');
        if (addressId === '') return this.$Message.warning('请选择收货地址!');
      }
      this.$emit('on-ok', {isDeal, sendMethod, addressId, remark});
    },
  }
}
</script>

<style lang="less" scpoed>
.order-deal-modal {
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