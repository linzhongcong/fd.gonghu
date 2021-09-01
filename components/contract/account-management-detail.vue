<template>
  <div>
    <div class="companyName" @click="detailModal = true">
      {{ rowData.companyName }}
    </div>
    <Modal v-model="detailModal" title="账号详情" width="550">
      <Form ref="detailInfo" :model="rowData" :label-width="100">
        <Row>
          <Col :span="22">
            <FormItem label="公司名称:">
              <Input v-model="rowData.companyName" readonly />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="22">
            <FormItem label="客户类型:">
              <Input v-model="rowData.customerType" readonly disabled />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="22">
            <FormItem label="合作品牌:">
              <Input v-model="rowData.cooperativeBrand" readonly disabled />
            </FormItem>
          </Col>
        </Row>
        <div
          v-for="(item, index) in rowData.paymentData"
          :key="'payment' + index"
        >
          <Row v-if="item.mode === 'bank'">
            <Col :span="22">
              <FormItem label="付款方式:">
                <Input v-model="mode" readonly>{{
                  filterMode(item.mode)
                }}</Input>
              </FormItem>
            </Col>
          </Row>
          <Row v-if="item.mode === 'Alipay'">
            <Col :span="22">
              <FormItem label="付款方式:">
                <Input v-model="otherMode" readonly>{{
                  filterMode(item.mode)
                }}</Input>
              </FormItem>
            </Col>
          </Row>
          <div v-if="item.mode === 'bank'">
            <Row>
              <Col :span="22">
                <FormItem label="开户银行:">
                  <Input v-model="item.openBank" readonly></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col :span="22">
                <FormItem label="银行户名:">
                  <Input v-model="item.bankName" readonly></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col :span="22">
                <FormItem label="银行账号:">
                  <Input v-model="item.bankAccount" readonly></Input>
                </FormItem>
              </Col>
            </Row>
          </div>
          <div v-else>
            <Row>
              <Col :span="22">
                <FormItem label="支付宝户名:">
                  <Input v-model="item.AlipayName" readonly></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col :span="22">
                <FormItem label="支付宝账号:">
                  <Input v-model="item.AlipayAccount" readonly></Input>
                </FormItem>
              </Col>
            </Row>
          </div>
        </div>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="detailModal = false">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  props: {
    rowData: {
      type: Object,
    },
  },
  data() {
    return {
      detailModal: false,
      mode: "",
      otherMode: "",
    };
  },
  methods: {
    filterMode(val) {
      if (val === "bank") return (this.mode = "银行转账");
      if (val === "Alipay") return (this.otherMode = "支付宝转账");
    },
  },
};
</script>

<style lang="less" scoped>
.companyName {
  color: #2d8cf0;
  cursor: pointer;
}
</style>