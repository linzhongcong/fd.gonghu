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
        <Button type="primary">添加</Button>
        <Button type="primary">通过</Button>
        <Button type="primary">驳回</Button>
      </Col>
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
    };
  },
  methods: {
    selectArea(value, data) {
      ["province", "city", "county"].forEach(
        (key, index) => (this.formData[key] = data[index] && data[index].label)
      );
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