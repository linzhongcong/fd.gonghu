<template>
  <div>
    <card>
      <Form slot="title" inline >
        <Row type="flex" justify="space-between">
          <Col span="24">
            <!-- 所有权 -->
            <FormItem>
              <Select v-model="model1" placeholder="所有权" >
                <Option v-for="item in authorityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <!-- 商家名称 -->
            <FormItem>
              <Input placeholder="请输入商家名称" />
            </FormItem>
            <!-- 商家类型 -->
            <FormItem >
              <Select v-model="model1" placeholder="商家类型">
                <Option v-for="item in merchantTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <!-- 门店等级 -->
            <FormItem>
              <Select v-model="model1" placeholder="门店等级">
                <Option v-for="item in shopLevelList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <!-- 门店名称 -->
            <FormItem>
              <Input placeholder="请输入门店名称" />
            </FormItem>
            <!-- 业务员 -->
            <FormItem>
              <Input placeholder="请输入业务员姓名" />
            </FormItem>
            <!-- 所属团队 -->
            <FormItem>
              <Input placeholder="请输入所属团队姓名" />
            </FormItem>
             <!-- 创建时间 -->
            <FormItem>
              <DatePicker type="daterange" split-panels placeholder="创建时间" style="width: 200px"></DatePicker>
            </FormItem>
            <Button type="primary" icon="ios-search" >查询</Button>
          </Col>
        </Row>

        <Row type="flex" justify="space-between">
          <Col span="24">
            <Button type="primary">分配</Button>
            <Button type="primary">下载导入模板</Button>
            <Button type="primary">导入</Button>
          </Col>
        </Row>
      </Form>

      <div>
        <Row>
          <Table
            border
            :columns="client.columns"
            :data="client.list" >
            <template slot-scope="{}" slot="operate" >
            </template>
          </Table>
          <div class="page-box">
            <div class="pages-L">共 {{ client.total }} 条</div>
            <div class="pages-r">
              <Page
                show-sizer
                :total="client.total"
                :current="client.search.page"
                :page-size-opts="[10, 20, 30, 40]">
              </Page>
            </div>
          </div>
        </Row>
      </div>
    </card>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        // 客户档案
        client: {
          // 查询条件
          search: {
            page: 1,
            pageSize: 10,
          },
          // 表头设置
          columns: [
            { width: '60', type: 'selection', align: 'center' },
            { title: '序号', type: 'index', align: 'center' },
            { title: '商家名称', key: 'name', align: 'center' },
            { title: '商家类型', key: 'type', align: 'center' },
            { title: '门店名称', key: 'type', align: 'center' },
            { title: '门店地址', key: 'type', align: 'center' },
            { title: '门店等级', key: 'type', align: 'center' },
            { title: '创建人', key: 'type', align: 'center' },
            { title: '创建时间', key: 'type', align: 'center' },
            { title: '业务员', key: 'type', align: 'center' },
            { title: '所属团队', key: 'type', align: 'center' },
            { title: '备注', key: 'type', align: 'center' },
            { title: '操作', slot: 'operate', align: 'center' },
          ],
          // 列表数据
          list: [],
          // 数据总数
          total: 100,
        },
        // 权限
        authorityList: [
          { value: 'company', label: '公司所有权' },
          { value: 'department', label: '部门所有权' },
          { value: 'self', label: '个人所有权' }
        ],
        // 商家类型
        merchantTypeList: [
          { value: 'CS', label: 'CS' },
          { value: 'KA', label: 'KA' },
          { value: 'OTC', label: 'OTC' },
          { value: '便利店', label: '便利店' },
          { value: '其他', label: '其他' }
        ],
        // 门店等级
        shopLevelList: [
          { value: 'S', label: 'S' },
          { value: 'A', label: 'A' },
          { value: 'B', label: 'B' },
          { value: 'C', label: 'C' },
          { value: 'D', label: 'D' }
        ],

      }
    },
    activated() {

    },
    methods: {

    }
  }
</script>

<style scoped lang="less">
  /deep/ .ivu-form-item {
    margin-bottom: 0.8%;
  }

  /deep/ .page-box {
    margin: 10px;
    overflow: hidden;
  }

  /deep/ .pages-r {
    float: right;
  }

  /deep/ .ivu-card-head,
  /deep/ .date-picker,
  /deep/ .ivu-card-head
  /deep/ .ivu-date-picker-editor {
    width: 100%;
  }
</style>
