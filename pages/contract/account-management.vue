<template>
  <div>
    <Card>
      <!-- 筛选搜索区域 -->
      <Row slot="title">
        <Col :span="22" @keydown.native.enter.prevent="getList('new')">
          <Select
            class="mb-5"
            v-model="formData.ownership"
            placeholder="数据权限范围"
            @on-change="getList('new')"
          >
            <Option
              v-for="(item, index) in dataPermissionRange"
              :value="item.value"
              :label="item.label"
              :key="'dataPer' + index"
            ></Option>
          </Select>
          <Input
            v-model="formData.merchantName"
            clearable
            placeholder="公司名称"
          />
          <Select
            v-model="formData.merchantType"
            clearable
            placeholder="客户类型"
          >
            <Option
              v-for="(item, index) in merchantTypeList"
              :key="index"
              :value="item.value"
              :label="item.label"
            ></Option>
          </Select>
          <Input v-model="formData.createdBy" clearable placeholder="登记人" />
        </Col>
        <Col :span="2">
          <Button type="primary" icon="ios-search" @click="getList('new')"
            >搜索</Button
          >
        </Col>
        <Col :span="24">
          <Button type="primary" @click="openMode('popupForm', 'add')"
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
          :loading="loadingTable"
          :columns="tableData.columns"
          :data="tableData.data"
          size="small"
        >
          <template slot-scope="{ row }" slot="merchantName">
            <AccountManagementDetail :rowData="row" :monitor="change" />
          </template>
          <template slot-scope="{ row }" slot="action">
            <Tooltip placement="top" content="编辑" transfer>
              <Button
                type="primary"
                icon="md-create"
                size="small"
                @click="openMode('popupForm', 'edit', row)"
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
        <div style="margin: 10px; overflow: hidden">
          <div class="pages-L">共 {{ pageProps.totalCount }} 条</div>
          <div style="float: right">
            <Page
              :total="pageProps.totalCount"
              size="small"
              :current="pageProps.currentPage"
              show-sizer
              show-elevator
              @on-change="changePage"
              @on-page-size-change="changePageSize"
            ></Page>
          </div>
        </div>
      </Row>
    </Card>

    <!-- 弹窗 -->
      <Modal
      v-model="popupShow"
      :title="popupType === 'add' ? '添加账号' : '编辑账号'"
      width="550"
    >
      <Form
        ref="popupForm"
        :model="popupForm"
        :rules="popupFormRules"
        :label-width="100"
      >
        <Row>
          <Col :span="22">
            <FormItem label="公司名称:" prop="contractorId">
              <Select
                filterable
                v-model="popupForm.contractorId"
                :remote-method="debQueryCompany"
                :loading="queryLoading"
                @on-select="selectCompany"
                @on-query-change="companyKeyChange"
                :placeholder="popupForm.merchantName || '请输入公司名称'"
              >
                <Option
                  v-for="(item, index) in companyList"
                  :value="item.id"
                  :label="item.merchantName"
                  :key="index"
                ></Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="22">
            <FormItem label="客户类型:">
              <Input
                :value="formatMerchantType(popupForm.merchantType)"
                disabled
              />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="22">
            <FormItem label="合作品牌:">
              <Input :value="filterCoBrand(popupForm.coBrand)" disabled />
            </FormItem>
          </Col>
        </Row>
        <!-- 付款方式 -->
        <div
          v-for="(item, index) in popupForm.accountDetailList"
          :key="'payment' + index"
        >
          <Row>
            <Col :span="22">
              <FormItem
                label="付款方式:"
                :prop="`accountDetailList[${index}].paymentType`"
                :rules="{
                  required: true,
                  message: '请选择付款方式',
                  trigger: 'blur',
                }"
              >
                <Select v-model="item.paymentType">
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
                  @click="
                    () =>
                      popupForm.accountDetailList.push({
                        paymentType: 'alipay',
                      })
                  "
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
          <div v-if="item.paymentType === 'bank'">
            <Row>
              <Col :span="22">
                <FormItem
                  label="开户银行:"
                  :prop="`accountDetailList[${index}].accountOpenFrom`"
                  :rules="{
                    required: true,
                    message: '请输入正确的开户银行',
                    trigger: 'blur',
                    max: 50,
                  }"
                >
                  <Input
                    v-model="item.accountOpenFrom"
                    maxlength="50"
                    placeholder="请输入开户银行"
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col :span="22">
                <FormItem
                  label="银行户名:"
                  :prop="`accountDetailList[${index}].accountName`"
                  :rules="{
                    required: true,
                    message: '请输入正确的银行户名',
                    trigger: 'blur',
                    max: 50,
                  }"
                >
                  <Input
                    v-model="item.accountName"
                    maxlength="50"
                    placeholder="请输入银行户名"
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col :span="22">
                <FormItem
                  label="银行账号:"
                  :prop="`accountDetailList[${index}].accountNumber`"
                  :rules="{
                    required: true,
                    message: '请输入正确的银行账号',
                    trigger: 'blur',
                    max: 50,
                  }"
                >
                  <Input
                    v-model="item.accountNumber"
                    maxlength="50"
                    placeholder="请输入银行账号"
                  />
                </FormItem>
              </Col>
            </Row>
          </div>
          <!-- 支付宝付款 -->
          <div v-if="item.paymentType === 'alipay'">
            <Row>
              <Col :span="22">
                <FormItem
                  label="支付宝户名:"
                  :prop="`accountDetailList[${index}].alipayName`"
                  :rules="{
                    required: true,
                    message: '请输入正确的支付宝户名',
                    trigger: 'blur',
                    max: 50,
                  }"
                >
                  <Input
                    v-model="item.alipayName"
                    maxlength="50"
                    placeholder="请输入支付宝户名"
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col :span="22">
                <FormItem
                  label="支付宝账号:"
                  :prop="`accountDetailList[${index}].alipayNumber`"
                  :rules="{
                    required: true,
                    message: '请输入正确的支付宝账号',
                    trigger: 'blur',
                    max: 50,
                  }"
                >
                  <Input
                    v-model="item.alipayNumber"
                    maxlength="50"
                    placeholder="请输入支付宝账号"
                  />
                </FormItem>
              </Col>
            </Row>
          </div>
        </div>
      </Form>
      <div slot="footer">
        <Button @click="closeModal('popupForm')">取消</Button>
        <Button type="primary" :loading="btnLoading" @click="preservation()"
          >保存</Button
        >
      </div>
      <Spin size="large" fix v-if="spinShow"></Spin>
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
      spinShow: false,
      // 筛选搜索区域数据
      formData: {
        ownership: "company",
      },

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
            slot: "merchantName",
            align: "center",
          },
          {
            title: "客户类型",
            key: "merchantType",
            align: "center",
            render: (h, params) =>
              h("span", this.formatMerchantType(params.row.merchantType)),
          },
          {
            title: "合作品牌",
            key: "coBrand",
            align: "center",
            render: (h, params) => {
              let brand = params.row.coBrand,
                arr = [];
              if (brand === "") return h("span", "");
              arr = brand.split(",");
              if (arr.length > 1) {
                return h("span", "WIS、KONO");
              } else if (arr[0] === "wis") {
                return h("span", "WIS");
              } else if (arr[0] === "kono") {
                return h("span", "KONO");
              }
            },
          },
          {
            title: "登记人",
            key: "createdBy",
            align: "center",
          },
          {
            title: "登记时间",
            key: "createdAt",
            align: "center",
          },
          {
            title: "操作",
            slot: "action",
            width: 150,
            align: "center",
          },
        ],
        data: [],
      },

      loadingTable: false,
      pageProps: {
        page: 1,
        perPage: 10,
        currentPage: 1,
        totalCount: 0,
      },
      // 搜索公司名称数据
      companyList: [],

      // 弹窗数据
      popupShow: false,
      queryLoading: false,
      btnLoading: false,
      popupType: "",
      paymentMode: [
        {
          value: "bank",
          label: "银行转账",
        },
        {
          value: "alipay",
          label: "支付宝转账",
        },
      ],
      popupForm: {
        id: undefined,
        contractorId: "",
        merchantName: undefined,
        merchantType: "",
        coBrand: "",
        accountDetailList: [
          {
            paymentType: "bank",
            accountOpenFrom: "",
            accountName: "",
            accountNumber: "",
            alipayName: "",
            alipayNumber: "",
          },
        ],
      },
      popupFormRules: {
        contractorId: [
          {
            required: true,
            message: "请输入公司名",
            trigger: "change",
          },
        ],
      },
      // 存储移除已有的系统信息
      recoveSystemInfo: [],
      // 远程搜索的方法
      debQueryCompany: this.$debonce(this.queryCompany, 500),
      change: 0,
    };
  },
  activated() {
    const companyName = this.$route.query.companyName;
    !!companyName && (this.formData.merchantName = companyName);
    this.getList();
  },
  methods: {
    filterCoBrand(params) {
      let brand = params;
      // 解决空数组问题
      let arr = [brand];
      if (arr[0] === "wis") {
        return "WIS";
      } else if (arr[0] === "kono") {
        return "KONO";
      } else if (arr[0] === "kono,wis" || arr[0] === "wis,kono") {
        return "WIS，KONO";
      } else {
        return "";
      }
    },
    // 获取列表数据
    async getList(type = "") {
      this.loadingTable = true;
      let params = JSON.parse(JSON.stringify(this.formData));
      params.page = this.pageProps.page;
      params.perPage = this.pageProps.perPage;
      if (type) {
        params.page = this.pageProps.page = 1;
      }
      try {
        let res = await this.$api.accountList(params);
        if (res.code === 0) {
          this.tableData.data = res.data.list;
          this.pageProps.totalCount = res.data.totalCount;
          this.pageProps.currentPage = res.data.currentPage;
          this.formData.ownership = res.data.ownership;
          this.handleValidateDataPermissionRange(
            this,
            "isGetDataPermissionRange",
            "dataPermissionRange",
            res.data.ownership
          );
        }
        this.loadingTable = false;
      } catch (err) {
        this.loadingTable = false;
      }
    },

    openMode(prop, type, data) {
      this.popupShow = true;
      this.popupType = type;
      this.$refs[prop].resetFields();
      this.popupForm = {
        accountDetailList: [
          {
            paymentType: "bank",
            accountOpenFrom: "",
            accountName: "",
            accountNumber: "",
            alipayName: "",
            alipayNumber: "",
          },
        ],
      };
      if (prop === "popupForm" && type === "edit") {
         this.spinShow = true
        this.getEdit(data);
      }
    },

    closeModal(prop) {
      this.popupShow = false;
      this[prop].contractorId = undefined;
    },

    // 模糊搜索 
    async queryCompany(name) {
      if (!name.trim()) return;
      let res,
        merchantKinds = ["leads", "potential", "cooperation"];
      this.queryLoading = true;
      try {
        res = await this.$api.cooperativeCustomerSearchPartner({
          name,
          merchantKinds,
        });
        if (res.code === 0) {
          this.popupForm.merchantType = res.data[0].merchantType;
          this.popupForm.coBrand = res.data[0].coBrand
          this.queryLoading = false;
          res.data.length != 0 ? (this.companyList = res.data) : "";
        }
      } catch (error) {
        this.queryLoading = false;
      }
    },

    selectCompany(target) {
      // this.$nextTick(() => {
      //   target = target || {};
      // })
      
    },

    companyKeyChange(query) {
      // 解决首次输入空格下拉框显示id
      if (!query.trim()) {
        this.popupForm.contractorId = "";
        return false;
      }
    },

    // 移除付款方式
    removePaymentMode(index) {
      const res = this.popupForm.accountDetailList.splice(index, 1);
      if (!!res[0].id) {
        res[0].del = true;
        this.recoveSystemInfo.push(res[0]);
      }
    },

    // 提交表单
    preservation() {
      this.$refs.popupForm.validate(async (vaild) => {
        if (!vaild) return;
        this.btnLoading = true;
        this.popupForm.accountDetailList.forEach((val) => {
          if (val.paymentType === "bank") {
            delete val.alipayName;
            delete val.alipayNumber;
          } else if (val.paymentType === "alipay") {
            delete val.accountOpenFrom;
            delete val.accountName;
            delete val.accountNumber;
          }
        });
        let res,
          params = JSON.parse(JSON.stringify(this.popupForm));
        delete params.merchantType;
        delete params.coBrand;
        params.contractorId = params.contractorId - 0;
        try {
          res = !params.id
            ? await this.$api.addAccount(params)
            : await this.$api.accountUpdate(params);
          if (res.code === 0) {
            this.$Message.success("操作成功");
            this.btnLoading = false;
            this.closeModal("popupForm");
            this.getList();
            if (params.id) this.change++;
          }
        } catch (err) {
          this.$Notice.error({
            title: err.code,
            desc: err.message,
          });
          this.btnLoading = false;
        }
      });
    },

    // 获取编辑数据
    async getEdit(data) {
      try {
        let res = await this.$api.accountDetail({ id: data.id });
        if (res.code === 0) {
          this.popupForm = JSON.parse(JSON.stringify(res.data));
          data.merchantName && this.queryCompany(data.merchantName);
          this.spinShow = false
        }
      } catch (err) {
        this.spinShow = false
      }
    },

    // 删除
    async deleteRow(id) {
      let res;
      try {
        res = await this.$api.accountDelete({ id });
        if (res.code === 0) {
          this.$Message.success("操作成功");
          this.getList();
        }
      } catch (err) {
        this.$Notice.error({
          title: err.code,
          desc: err.message,
        });
      }
    },

    changePage(e) {
      this.pageProps.page = e;
      this.getList();
    },

    changePageSize(e) {
      this.pageProps.perPage = e;
      this.getList();
    },
  },
};
</script>

<style lang="less" scoped>
</style>