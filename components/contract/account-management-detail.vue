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
        <template v-for="(item, index) in rowData.paymentData">
          <Row>
            <Col :span="22">
              <FormItem label="付款方式:">
                <Input v-model="item.mode" readonly></Input>
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
        </template>
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
    };
  },
};
</script>

<style lang="less" scoped>
.companyName {
  color: #2d8cf0;
  cursor: pointer;
}
</style>