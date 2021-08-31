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
          <Button type="primary" @click="openModal()">添加</Button>
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
                @click="openModal(row.id, row)"
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
    <AccountManagementModal
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      :tabData="tableData"
    />
  </div>
</template>

<script>
import globalMixin from "~/plugins/mixin";
import mixin from "./mixins";
import AccountManagementModal from "../../components/contract/account-management-modal";
import AccountManagementDetail from "../../components/contract/account-management-detail";
export default {
  name: "account",
  mixins: [globalMixin, mixin],
  components: {
    AccountManagementModal,
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
      addOrUpdateVisible: false,
    };
  },
  methods: {
    openModal(id, rowData) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, rowData);
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