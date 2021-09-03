<template>
  <div>
    <div class="merchantName" @click="detailModal = true">
      {{ popupForm.merchantName }}
    </div>
    <Modal v-model="detailModal" title="账号详情" width="550">
      <Form ref="detailInfo" :model="popupForm" :label-width="100">
        <Row>
          <Col :span="22">
            <FormItem label="公司名称:">
              <Input v-model="popupForm.merchantName" readonly />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="22">
            <FormItem label="客户类型:">
              <Input v-model="popupForm.merchantType" readonly disabled />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="22">
            <FormItem label="合作品牌:">
              <Input v-model="popupForm.coBrand" readonly disabled />
            </FormItem>
          </Col>
        </Row>
        <div
          v-for="(item, index) in popupForm.accountDetailList"
          :key="'payment' + index"
        >
          <Row v-if="item.paymentType === 'bank'">
            <Col :span="22">
              <FormItem label="付款方式:">
                <Input v-model="mode" readonly>{{
                  filterMode(item.paymentType)
                }}</Input>
              </FormItem>
            </Col>
          </Row>
          <Row v-if="item.paymentType === 'alipay'">
            <Col :span="22">
              <FormItem label="付款方式:">
                <Input v-model="otherMode" readonly>{{
                  filterMode(item.paymentType)
                }}</Input>
              </FormItem>
            </Col>
          </Row>
          <div v-if="item.paymentType === 'bank'">
            <Row>
              <Col :span="22">
                <FormItem label="开户银行:">
                  <Input v-model="item.accountOpenFrom" readonly></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col :span="22">
                <FormItem label="银行户名:">
                  <Input v-model="item.accountName" readonly></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col :span="22">
                <FormItem label="银行账号:">
                  <Input v-model="item.accountNumber" readonly></Input>
                </FormItem>
              </Col>
            </Row>
          </div>
          <div v-else>
            <Row>
              <Col :span="22">
                <FormItem label="支付宝户名:">
                  <Input v-model="item.alipayName" readonly></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col :span="22">
                <FormItem label="支付宝账号:">
                  <Input v-model="item.alipayNumber" readonly></Input>
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
    id: {
      type: String,
    },
  },
  data() {
    return {
      detailModal: false,
      mode: "",
      otherMode: "",

      popupForm: {
      contractorId: "",
      merchantName: undefined,
      merchantType: "",
      coBrand: "",
      accountDetailList: [
        {
          paymentType: "",
          accountOpenFrom: "",
          accountName: "",
          accountNumber: "",
          alipayName: "",
          alipayNumber: "",
        },
      ],
    },
    };
  },
  created(){
    this.getDetail(this.id)
  },
  methods: {
    async getDetail(id) {
      try {
        let res = await this.$api.accountDetail({id})
        console.log(res);
        if(res.code === 0) {
          this.popupForm = res.data
        }
      } catch (err) {
      }
    },
    filterMode(val) {
      if (val === "bank") return (this.mode = "银行转账");
      if (val === "alipay") return (this.otherMode = "支付宝转账");
    },
    // paymentSeparate(){
    //   this.popupForm.accountDetailList.forEach(val => {
    //     console.log(val);
    //     if(val.paymentType === 'bank'){

    //     }
    //   })
    // }
  },
};
</script>

<style lang="less" scoped>
.merchantName {
  color: #2d8cf0;
  cursor: pointer;
}
</style>