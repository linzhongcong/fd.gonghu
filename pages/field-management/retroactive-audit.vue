<template>
  <Card>
    <div slot="title">
      <Row :gutter="16">
        <Col span="22">
          <Select v-model="searchData.ownership" placeholder="数据权限范围">
            <Option
              v-for="(item, index) in dataPermissionRange"
              :value="item.value"
              :label="item.label"
              :key="'dataPer' + index"
            ></Option>
          </Select>
          <Input
            v-model="searchData.job_number"
            placeholder="请输入工号"
            clearable
            class="mb-5"
          />
          <Input
            v-model="searchData.created_by"
            placeholder="请输入姓名"
            clearable
            class="mb-5"
          />
          <Select
            v-model="searchData.checkin_way"
            placeholder="签到类型"
            clearable
            class="mb-5"
          >
            <Option
              v-for="item in signInType"
              :key="item.value"
              :value="item.value"
              >{{ item.label }}</Option
            >
          </Select>
          <Input
            class="mb-5"
            v-model="searchData.offline_dept_name"
            placeholder="系统部门"
            clearable
          />
          <DatePicker
            type="date"
            placeholder="补签时间"
            class="mb-5"
          ></DatePicker>
          <Input
            v-model="searchData.merchant_name"
            placeholder="公司名称"
            clearable
            class="mb-5"
          />
          <Select
            v-model="searchData.auditState"
            placeholder="审核状态"
            clearable
            class="mb-5"
          >
            <Option
              v-for="item in audit"
              :key="item.value"
              :value="item.value"
              >{{ item.label }}</Option
            >
          </Select>
          <Row>
            <Button type="primary">通过</Button>
            <Button type="primary">不通过</Button>
            <Button type="primary">导出考勤数据</Button>
          </Row>
        </Col>
        <Col span="2">
          <Button type="primary" icon="ios-search">搜索</Button>
        </Col>
      </Row>
    </div>
    <div>
      <Row>
        <Table
          border
          ref="listTable"
          :columns="listData.columns"
          :data="listData.data"
          :loading="loadingTable"
        ></Table>
      </Row>
      <Row>
        <div style="padding: 20px 0">
          <div style="float: left">共 {{ pageProps.total }} 条</div>
          <div style="float: right">
            <Page
              :total="pageProps.total"
              :current="pageProps.page"
              size="small"
              show-elevator
              show-sizer
            />
          </div>
        </div>
      </Row>
    </div>
  </Card>
</template>

<script>
export default {
  name: "retroactive-audit",
  data() {
    return {
      // 搜索区域数据
      searchData: {
        ownership: "company",
      },
      // 下拉选项
      dataPermissionRange: [
        { value: "company", label: "全部" },
        { value: "self", label: "我负责的" },
        { value: "department", label: "本部门的" },
        { value: "container", label: "本部门及下属部门的" },
      ],
      signInType: [
        { value: "visit", label: "回访" },
        { value: "maintain", label: "维护" },
        { value: "shop", label: "下店" },
      ],
      audit: [
        { value: "adopt", label: "通过" },
        { value: "unreviewed", label: "未审核" },
        { value: "Fail", label: "不通过" },
      ],
      // 列表数据
      listData: {
        columns: [
          { type: "selection", align: "center", width: 60 },
          { title: "员工工号", key: "jobNumber", align: "center", width: 100 },
          {
            title: "员工姓名",
            key: "jobName",
            align: "center",
            width: 100,
          },
          {
            title: "员工职务",
            key: "jobStation",
            align: "center",
            minWidth: 100,
          },
          {
            title: "补签理由",
            key: "auditProve",
            align: "center",
            minWidth: 120,
          },
          {
            title: "补签证明",
            key: "auditReason",
            align: "center",
            minWidth: 120,
          },
          {
            title: "系统部门",
            key: "offlineDeptName",
            align: "center",
            minWidth: 180,
          },
          {
            title: "签到类型",
            key: "signType",
            align: "center",
            minWidth: 180,
          },
          {
            title: "补签时间",
            align: "center",
            width: 210,
            render: (h, params) => {
              let time = params.row.signin_at || params.row.signinAt,
                day = new Date(time * 1000).getDay(),
                week = ["日", "一", "二", "三", "四", "五", "六"];
              return !+time
                ? h("span", "")
                : h("span", this.formatDate(time) + ` (星期${week[day]})`);
            },
          },
          {
            title: "公司名称",
            key: "merchantName",
            align: "center",
            width: 150,
          },
          {
            title: "门店名称",
            key: "storeName",
            align: "center",
            width: 150,
          },
          {
            title: "门店地址",
            key: "storeAddress",
            align: "center",
            width: 150,
          },
          {
            title: "审核状态",
            align: "center",
            minWidth: 100,
            render: (h, params) => {
              let status = params.row.isException;
              if (status === "no") {
                return h("span", "正常");
              } else if (status === "yes") {
                return h("span", "异常");
              }
            },
          },
        ],
        data: [],
      },
      pageProps: {
        total: 10,
        page: 1,
        perPage: 10,
      },
      loadingTable: false,
    };
  },
};
</script>

<style lang="less" scoped>
</style>