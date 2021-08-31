<template>
  <Modal v-model="show" :title="!popupForm.id ? '添加' : '编辑'" width="550">
    <Form
      ref="popupInfo"
      :model="popupForm"
      :rules="popupFormRules"
      :label-width="100"
    >
      <Row>
        <Col :span="22">
          <FormItem label="公司名称:" prop="companyName">
            <Input
              v-model="popupForm.companyName"
              placeholder="请输入公司名称"
            />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col :span="22">
          <FormItem label="客户类型:">
            <Input v-model="popupForm.customerType" disabled />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col :span="22">
          <FormItem label="合作品牌:">
            <Input v-model="popupForm.cooperativeBrand" disabled />
          </FormItem>
        </Col>
      </Row>
      <!-- 付款方式 -->
      <div
        v-for="(item, index) in popupForm.paymentData"
        :key="'payment' + index"
      >
        <Row>
          <Col :span="22">
            <FormItem
              label="付款方式:"
              :prop="`paymentData[${index}].mode`"
              :rules="{
                required: true,
                message: '请选择付款方式',
                trigger: 'blur',
              }"
            >
              <Select v-model="item.mode" @on-change="paymentChoice">
                <Option
                  v-for="val in paymentMode"
                  :value="val.value"
                  :key="val.value"
                  >{{ val.label }}</Option
                >
              </Select>
            </FormItem>
          </Col>
          <Col :span="2">
            <div v-if="index === 0">
              <Button
                icon="md-add"
                @click="() => popupForm.paymentData.push({ mode: 'Alipay' })"
              ></Button>
            </div>
            <Button
              v-else
              icon="md-remove"
              @click="() => removePaymentMode(index)"
            ></Button>
          </Col>
        </Row>
        <!-- 银行付款 -->
        <template v-if="item.mode === 'bank'">
          <Row>
            <Col :span="22">
              <FormItem
                label="开户银行:"
                :prop="`paymentData[${index}].openBank`"
                :rules="{
                  required: true,
                  message: '请输入正确的开户银行',
                  trigger: 'blur',
                  max: 50,
                }"
              >
                <Input v-model="item.openBank" placeholder="请输入开户银行" />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :span="22">
              <FormItem
                label="银行户名:"
                :prop="`paymentData[${index}].bankName`"
                :rules="{
                  required: true,
                  message: '请输入正确的银行户名',
                  trigger: 'blur',
                  max: 50,
                }"
              >
                <Input v-model="item.bankName" placeholder="请输入银行户名" />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :span="22">
              <FormItem
                label="银行账号:"
                :prop="`paymentData[${index}].bankAccount`"
                :rules="{
                  required: true,
                  message: '请输入正确的银行账号',
                  trigger: 'blur',
                  max: 50,
                }"
              >
                <Input
                  v-model="item.bankAccount"
                  placeholder="请输入银行账号"
                />
              </FormItem>
            </Col>
          </Row>
        </template>
        <!-- 支付宝付款 -->
        <template v-else>
          <Row>
            <Col :span="22">
              <FormItem
                label="支付宝户名:"
                :prop="`paymentData[${index}].AlipayName`"
                :rules="{
                  required: true,
                  message: '请输入正确的支付宝户名',
                  trigger: 'blur',
                  max: 50,
                }"
              >
                <Input
                  v-model="item.AlipayName"
                  placeholder="请输入支付宝户名"
                />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :span="22">
              <FormItem
                label="支付宝账号:"
                :prop="`paymentData[${index}].AlipayAccount`"
                :rules="{
                  required: true,
                  message: '请输入正确的支付宝账号',
                  trigger: 'blur',
                  max: 50,
                }"
              >
                <Input
                  v-model="item.AlipayAccount"
                  placeholder="请输入支付宝账号"
                />
              </FormItem>
            </Col>
          </Row>
        </template>
      </div>
    </Form>
    <div slot="footer">
      <Button @click="show = false">取消</Button>
      <Button type="primary" @click="preservation()">保存</Button>
    </div>
  </Modal>
</template>

<script>
export default {
  props: {
    tabData: {
      type: Object,
    },
  },
  data() {
    return {
      show: false,
      paymentMode: [
        {
          value: "bank",
          label: "银行转账",
        },
        {
          value: "Alipay",
          label: "支付宝转账",
        },
      ],
      popupForm: {
        id: "",
        companyName: undefined,
        customerType: undefined,
        cooperativeBrand: undefined,
        paymentData: [
          {
            mode: "bank",
          },
        ],
      },
      popupFormRules: {
        companyName: [
          {
            required: true,
            message: "请输入公司名",
            trigger: "blur",
          },
        ],
      },
      // 存储移除已有的系统信息
      recoveSystemInfo: [],
    };
  },
  methods: {
    init(id, rowData) {
      console.log(id, rowData);
      // this.$refs.popupInfo.resetFields();
      this.popupForm.id = id || 0;
      this.show = true;
      if (this.popupForm.id) {
        this.popupForm = rowData;
      }
    },
    paymentChoice(value) {
      console.log(value);
    },
    // 移除付款方式
    removePaymentMode(index) {
      const res = this.popupForm.paymentData.splice(index, 1);
      console.log(res);
      if (!!res[0].id) {
        res[0].del = true;
        this.recoveSystemInfo.push(res[0]);
      }
    },
    preservation() {
      this.$refs.popupInfo.validate((vaild) => {
        if (!vaild) return;
        this.tabData.data.push(this.popupForm);
        this.show = false;
      });
    },
  },
};
</script>