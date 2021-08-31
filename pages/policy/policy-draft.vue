<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-15 10:45:21
 * @LastEditTime: 2020-10-26 10:15:15
 * @LastEditors: Seven
 -->
<template>
    <div>
        <Card>
            <Row slot="title">
                <Col :sm="24">
                <Form ref="search" :model="search" class="search">
                    <FormItem>
                        <Input v-model="search.policy_name" placeholder="政策名称" clearable @keydown.native.enter.prevent="getList('search')"></Input>
                    </FormItem>
                    <FormItem>
                        <Select v-model="search.policy_type" placeholder="政策类型" @on-change="getList('search')" clearable>
                            <Option v-for="item in typeList" :value="item.key" :key="item.key" :label="item.value"></Option>
                        </Select>
                    </FormItem>
                    <FormItem style="float: right;">
                        <Button type="primary" icon="md-search" style="padding: 4px 15px" @click="getList('search')">搜索</Button>
                    </FormItem>
                </Form>
                </Col>
            </Row>
            <Row class="margin-top-10"  style="clear: both;">
                <Table :columns="listDate.columns" :data="listDate.data" border highlight-row :loading="loading" size="small" @on-selection-change="selectCheck">
                    <!-- 操作 -->
                    <template slot-scope="{ row }" slot="action">
                        <Tooltip placement="top" content="编辑" transfer>
                            <Button type="primary" size="small" @click="handleEdit(row.id, row)">
                                <Icon type="md-create" />
                            </Button>
                        </Tooltip>
                        <Poptip confirm title="您确认删除这条内容吗？" @on-ok="handleDelete(row.id, row)" transfer>
                            <Button size="small">
                                <Icon type="md-trash" />
                            </Button>
                        </Poptip>
                    </template>
                </Table>
                <div style="margin: 10px;overflow: hidden">
                    <div class="pages-L">共 {{pageProps.totalCount}} 条</div>
                    <div style="float: right;">
                        <Page size="small" :total="pageProps.totalCount" :current="pageProps.page" show-sizer show-elevator @on-change="changePage" @on-page-size-change="changePageSize"></Page>
                    </div>
                </div>
            </Row>
        </Card>
    </div>
</template>

<script>
export default {
    name: 'policy-draft',
    data () {
        return {
            checkList:[],
            search: {
                policy_name: '',
                policy_type: '',
                is_draft: 1
            },
            ownershipList: [],
            typeList: [
                {key: 'yes', value: '活动'},
                {key: 'no', value: '非活动'},
                {key: '-', value: '无'}
            ], 
            listDate: {
                columns: [
                    { type: 'selection', width: 60, align: 'center' },
                    { type: 'index', title: '序号', width: 65, align: 'center' },
                    { key: 'policy_name', title: '政策名称', minWidth: 100, align: 'center' },
                    { key: 'created_by', title: '创建人', minWidth: 100, align: 'center' },
                    {
                        key: 'created_at', 
                        title: '创建时间', 
                        minWidth: 100,  
                        align: 'center',
                        // render: (h, parmas) => {
                        //     return h('div', this.formatDate(parmas.row.created_at))
                        // }
                    },
                    { key: 'status', title: '审核状态', minWidth: 100, align: 'center' },
                    { key: 'policy_type', title: '政策类型', minWidth: 100, align: 'center' },
                    { key: 'policy_validity', title: '政策有效期', minWidth: 100, align: 'center' },
                    { key: 'action', title: '操作', width: 150, align: 'center', slot: 'action' }
                ],
                data: [],
            },
            loading: false,
            // 列表分页属性
            pageProps: {
                page: 1,
                perPage: 10,
                totalCount: 0
            }
        };
    },
    methods: {
        init () {
            this.getList();
            // 加载所有权
            this.$api.getOwnership().then(res => {
                this.ownershipList = res;
            });
        },
        // 搜索
        getList (type) {
            this.loading = true;
            let params = this.search;
            params.page = this.pageProps.page;
            params.perPage = this.pageProps.perPage;
            if(type == 'search'){
                params.page = 1
            }
            this.$api.policyDraftListv2(params)
                .then((res) => {
                    this.listDate.data = res.items
                    this.pageProps.page = res._meta.currentPage
                    this.pageProps.perPage = res._meta.perPage
                    this.pageProps.totalCount = res._meta.totalCount
                }).finally(() => {
                    this.loading = false;
                })
        },
        // 操作栏的编辑 TODO:跳转未完成
        handleEdit (id, row) {
            this.$router.push({
                path: '/policy/policy-edit',
                query: { id: id, type: 'draft' }
            });
        },

        // 操作栏的删除 FIXME:
        handleDelete (id, row) {
            this.$api.policyDraftDeletev2({id: id})
                    .then((res) => {
                        if (res.code === 0) {
                            this.$Message.success(res.message);
                            this.getList();
                        }
                    });
        },
        // 切换页码
        changePage (e) {
            this.pageProps.page = e;
            this.getList();
        },
        // 设置每页显示的条数
        changePageSize (e) {
            this.pageProps.perPage = e;
            this.getList();
        },
        // 时间转化
        formatDate (time) {
            return this.$format(time, 'yyyy-MM-dd hh:mm');
        },
        // 日期转化
        formatDays (time) {
            return this.$format(time, 'yyyy-MM-dd');
        },
        /**
       * 列表点击信息
       * @param {Object} selection：用户信息
       */
      selectCheck(selection) {
        this.checkList = selection;
      },
    },
    activated () {
        this.init();
    },
    watch:{
      $route:{
        deep: true,
        handler:function(newVal,oldVal){
          if(oldVal.name == newVal.name && Object.keys(newVal.query)){
              this.search = {} 
              this.getList()
          }
        }
      }
    }
};
</script>

<style lang="less" scoped>
    .ivu-input::-webkit-input-placeholder, .ivu-select-single .ivu-select-selection .ivu-select-placeholder {
        color: rgb(130, 130, 130);
    }
    .ivu-input, .ivu-select-selection {
        border: 1px solid rgb(184, 184, 184);
        color: #000;

    }
</style>