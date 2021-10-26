<template>
  <Card>
    <Row slot="title">
      <Col span="22">
        <Select
          class="mb-5"
          v-model="formData.ownership"
          placeholder="数据权限范围"
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
        <Input
          v-model="formData.systemName"
          clearable
          placeholder="系统/门店名称"
        />
        <Input v-model="formData.number" clearable placeholder="门店编号" />
        <Input v-model="formData.name" clearable placeholder="门店名称" />
        <Cascader
          :data="area"
          v-model="formData.area"
          @on-change="selectArea"
          change-on-select
          placeholder="省/市/区"
        ></Cascader>
        <Select v-model="formData.cityLevel" clearable placeholder="城市等级">
          <Option
            v-for="(item, index) in cityLevelOption"
            :key="index"
            :value="item.value"
            :label="item.label"
          ></Option>
        </Select>
        <Input v-model="formData.followBy" clearable placeholder="零售负责人" />
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
      </Col>
      <Col span="2">
        <Button type="primary" icon="ios-search">搜索</Button>
      </Col>
      <Col span="24">
        <Button type="primary" @click="addStores">添加</Button>
        <Button type="primary">通过</Button>
        <Button type="primary">驳回</Button>
      </Col>
    </Row>

    <Row>
      <Table
        border
        highlight-row
        :columns="listData.columns"
        :data="listData.data"
        :loading="loadingTable"
        size="small"
      >
        <!-- 操作 -->
        <template slot-scope="{ row }" slot="action">
          <Tooltip placement="top" content="编辑" transfer>
            <Button
              type="primary"
              @click="addStores(row.id, 'edit')"
              icon="md-create"
              size="small"
            ></Button>
          </Tooltip>
          <Poptip confirm title="您确认删除这条内容吗？" transfer>
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
          ></Page>
        </div>
      </div>
    </Row>
  </Card>
</template>

<script>
import mixins from "../mixins";
import area from "~/plugins/area.js";
export default {
  name: "address-audit",
  mixins: [mixins],
  data() {
    return {
      loadingTable: false,
      area,
      // 搜索区域数据
      formData: {
        ownership: "company",
        area: [],
      },
      // 下拉选项
      dataPermissionRange: [
        { value: "company", label: "全部" },
        { value: "self", label: "我负责的" },
        { value: "department", label: "本部门的" },
        { value: "container", label: "本部门及下属部门的" },
      ],
      cityLevelOption: {
        first: { value: "first", label: "一线城市" },
        newFirst: { value: "newFirst", label: "新一线城市" },
        second: { value: "second", label: "二线城市" },
        third: { value: "third", label: "三线城市" },
        fourth: { value: "fourth", label: "四线城市" },
        fifth: { value: "fifth", label: "五线城市" },
      },
      // 列表数据
      listData: {
        columns: [
          { type: "selection", width: 60, align: "center" },
          {
            title: "门店编号",
            key: "storesNumber",
            minWidth: 100,
            align: "center",
          },
          {
            title: "门店名称",
            key: "storesName",
            minWidth: 130,
            align: "center",
          },
          {
            title: "门店修正地址",
            key: "correctAddress",
            minWidth: 180,
            align: "center",
          },
          {
            title: "门店原地址",
            key: "sourceAddress",
            minWidth: 180,
            align: "center",
          },
          { title: "提交人", key: "submitOne", minWidth: 180, align: "center" },
          {
            title: "提交时间",
            key: "submitTime",
            minWidth: 180,
            align: "center",
          },
          {
            title: "零售负责人",
            key: "followBy",
            minWidth: 150,
            align: "center",
          },
          {
            title: "公司名称",
            key: "merchantName",
            minWidth: 200,
            align: "center",
          },
          {
            title: "系统/门店名称",
            key: "systemName",
            minWidth: 200,
            align: "center",
          },
          {
            title: "客户类型",
            key: "merchantType",
            minWidth: 100,
            align: "center",
          },
          { slot: "action", title: "操作", minWidth: 100, align: "center" },
        ],
        data: [
          {
            id: "123",
            storesNumber: "001",
            storesName: "城市码农",
            correctAddress: "上海世博大",
            sourceAddress: "上海滩",
            submitOne: "城市码农",
            submitTime: "2021-10-27",
            followBy: "linCong",
            merchantName: "世界第一",
            systemName: "OA系统",
            merchantType: "Boss",
          },
        ],
      },
      pageProps: {
        page: 1,
        perPage: 10,
        currentPage: 1,
        totalCount: 0,
      },
    };
  },
  methods: {
    selectArea(value, data) {
      ["province", "city", "county"].forEach(
        (key, index) => (this.formData[key] = data[index] && data[index].label)
      );
    },
    addStores(id, type) {
      if (type === "edit") {
        this.$router.push({
          path: "/contract/address-audit/edit",
          query: {
            id,
          },
        });
      } else {
        this.$router.push("/contract/address-audit/edit");
      }
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .ivu-card-head {
  .ivu-input-wrapper {
    margin-bottom: 8px;
  }
  .ivu-select {
    margin-bottom: 8px;
  }
  .ivu-cascader {
    display: inline-block;
    width: 200px;
    margin-bottom: 8px;
    vertical-align: middle;
    .ivu-input-wrapper {
      width: 100%;
      margin-bottom: 0;
    }
  }
}
</style>