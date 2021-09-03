<template>
  <div>
    <div class="merchantName" @click="detailModal = true">
      {{ rowData.merchantName }}
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
        <template v-for="(item,index) in popupForm.bankArray">
          <Row v-if="index < 1">
            <Col :span="22">
              <FormItem label="付款方式:">
                <Input v-model="mode" readonly>{{
                  filterMode(item.paymentType)
                }}</Input>
              </FormItem>
            </Col>
          </Row>
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
        </template>
        <template v-for="(val,index) in popupForm.alipayArray">
          <Row v-if="index < 1">
            <Col :span="22">
              <FormItem label="付款方式:">
                <Input v-model="otherMode" readonly>{{
                  filterMode(val.paymentType)
                }}</Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
              <Col :span="22">
                <FormItem label="支付宝户名:">
                  <Input v-model="val.alipayName" readonly></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col :span="22">
                <FormItem label="支付宝账号:">
                  <Input v-model="val.alipayNumber" readonly></Input>
                </FormItem>
              </Col>
            </Row>
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
      mode: "",
      otherMode: "",

      popupForm: {
      merchantName: undefined,
      merchantType: "",
      coBrand: "",
      bankArray:[],
      alipayArray:[],
    },
    };
  },
  created(){
    this.getDetail(this.rowData.id)
  },
  methods: {
    async getDetail(id) {
      try {
        let res = await this.$api.accountDetail({id})
        if(res.code === 0) {
          this.popupForm.merchantName = res.data.merchantName
          this.popupForm.merchantType = res.data.merchantType
          this.popupForm.coBrand = res.data.coBrand
          res.data.accountDetailList.forEach(item => {
            if(item.paymentType === 'bank'){
              this.popupForm.bankArray.push(item)
            }
             if(item.paymentType === 'alipay'){
              this.popupForm.alipayArray.push(item)
            }
          });
        }
      } catch (err) {
      }
    },

    filterMode(val) {
      if (val === "bank") return (this.mode = "银行转账");
      if (val === "alipay") return (this.otherMode = "支付宝转账");
    },
  },
};
</script>

<style lang="less" scoped>
.merchantName {
  color: #2d8cf0;
  cursor: pointer;
}
</style>