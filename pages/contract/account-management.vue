<template>
  <div>
    <Card>
      <!-- 筛选搜索区域 -->
      <Row slot="title">
        <Col :span="22">
          <Select v-model="formData.ownership">
            <Option
              v-for="item in jurisdictionData"
              :value="item.value"
              :key="item.value"
              >{{ item.label }}</Option
            >
          </Select>
          <Input
            v-model="formData.companyName"
            clearable
            placeholder="公司名称"
          />
          <Select v-model="formData.customerType" placeholder="客户类型">
            <Option
              v-for="item in merchantTypeList"
              :value="item.value"
              :key="item.value"
              >{{ item.label }}</Option
            >
          </Select>
          <Input v-model="formData.register" clearable placeholder="登记人" />
        </Col>
        <Col :span="2">
          <Button type="primary" icon="ios-search">搜索</Button>
        </Col>
        <Col :span="24">
          <Button type="primary" @click="openMode('popupInfo', 'add')"
            >添加</Button
          >
        </Col>
      </Row>
      <!-- 表格区域 -->
      <Row>
        <Table
          ref="selection"
          border
          highlight-row
          :columns="tableData.columns"
          :data="tableData.data"
          size="small"
        >
          <template slot-scope="{ row }" slot="companyName">
            <AccountManagementDetail :rowData="row" />
          </template>
          <template slot-scope="{ row }" slot="action">
            <Tooltip placement="top" content="编辑" transfer>
              <Button
                type="primary"
                icon="md-create"
                size="small"
                @click="openMode('popupInfo', 'edit', row)"
              ></Button>
            </Tooltip>
            <Poptip
              @on-ok="deleteRow(row.id)"
              confirm
              title="您确认删除这条内容吗？"
              transfer
            >
              <Button size="small" icon="md-trash"></Button>
            </Poptip>
          </template>
        </Table>
      </Row>
    </Card>

    <!-- 弹窗 -->
    <Modal
      v-model="popupShow"
      :title="popupType === 'add' ? '添加账号' : '编辑账号'"
      width="550"
    >
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
                <Select v-model="item.mode">
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
          <div v-if="item.mode === 'bank'">
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
          </div>
          <!-- 支付宝付款 -->
          <div v-if="item.mode === 'Alipay'">
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
          </div>
        </div>
      </Form>
      <div slot="footer">
        <Button @click="popupShow = false">取消</Button>
        <Button type="primary" @click="preservation()">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import globalMixin from "~/plugins/mixin";
import mixin from "./mixins";
import AccountManagementDetail from "../../components/contract/account-management-detail";
export default {
  name: "account",
  mixins: [globalMixin, mixin],
  components: {
    AccountManagementDetail,
  },
  data() {
    return {
      // 筛选搜索区域数据
      formData: {
        ownership: "company",
        customerType: "cs",
      },
      // 权限数据
      jurisdictionData: [
        {
          value: "company",
          label: "全部",
        },
        {
          value: "my",
          label: "我负责的",
        },
        {
          value: "department",
          label: "本部门的",
        },
        {
          value: "Subordinate",
          label: "本部门及下属部门的",
        },
      ],
      // 表格数据
      tableData: {
        columns: [
          {
            type: "selection",
            width: 60,
            align: "center",
          },
          {
            title: "公司名称",
            slot: "companyName",
            align: "center",
          },
          {
            title: "客户类型",
            key: "customerType",
            align: "center",
          },
          {
            title: "合作品牌",
            key: "cooperativeBrand",
            align: "center",
          },
          {
            title: "登记人",
            key: "registrant",
            align: "center",
          },
          {
            title: "登记时间",
            key: "time",
            align: "center",
          },
          {
            title: "操作",
            slot: "action",
            width: 150,
            align: "center",
          },
        ],
        data: [
          {
            id: 1,
            companyName: "凡岛网络",
            customerType: "CS",
            cooperativeBrand: "WIS",
            registrant: "lin",
            time: "2021-8-24",
          },
          {
            id: 2,
            companyName: "慕可生物",
            customerType: "KA",
            cooperativeBrand: "KONO",
            registrant: "chen",
            time: "2021-8-24",
          },
        ],
      },

      // 弹窗数据
      popupShow: false,
      popupType: "",
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
        companyName: "",
        customerType: "",
        cooperativeBrand: "",
        paymentData: [
          {
            mode: "bank",
            openBank: "",
            bankName: "",
            bankAccount: "",
            AlipayName: "",
            AlipayAccount: "",
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
    openMode(prop, type, data) {
      this.popupShow = true;
      this.popupType = type;
      this.$refs[prop].resetFields();
      if (prop === "popupInfo" && type === "edit") {
        // this.popupForm = data;
        this.popupForm = JSON.parse(JSON.stringify(data));
      }
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
        this.popupForm.paymentData.forEach((val) => {
          if (val.mode === "bank") {
            delete val.AlipayName;
            delete val.AlipayAccount;
          } else if (val.mode === "Alipay") {
            delete val.openBank;
            delete val.bankName;
            delete val.bankAccount;
          }
        });
        console.log(this.popupForm);
        this.tableData.data.push(JSON.parse(JSON.stringify(this.popupForm)));
        this.popupShow = false;
      });
    },
    deleteRow(id) {
      console.log(id);
      this.tableData.data = this.tableData.data.filter(
        (value) => value.id !== id
      );
    },
  },
};
</script>

<style lang="less" scoped>
</style>