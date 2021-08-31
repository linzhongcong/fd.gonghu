<template>
    <div>
        <Card>
            <Row slot="title">
                <Col :sm="24">
                <Form ref="search" :model="search" class="search">
                    <FormItem>
                        <Select v-model="search.ownership" clearable placeholder="所有权" @on-change="getList('search')">
                            <Option v-for="item in ownershipList" :value="item.ownership" :key="item.ownership" :label="item.label"></Option>
                        </Select>
                    </FormItem>
                    <FormItem><Input v-model="search.name" placeholder="类目" clearable @keydown.native.enter.prevent="getList('search')" /></FormItem>
                    <FormItem>
                        <Button type="primary" icon="search" @click="getList('search')" style="padding: 4px 15px">查询</Button>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" icon="search" @click="getList(false)" style="padding: 4px 15px">重置</Button>
                    </FormItem>
                </Form>
                </Col>
                <Col :sm="24">
                    <router-link to="/products/category-edit">
                        <Button type="primary">新增类目</Button>
                    </router-link>
                    <Button type="primary" @click="display">显示隐藏</Button>
                </Col>
            </Row>
            <Row class="margin-top-10"  style="clear: both;">
                <Table :columns="columns" :data="data" border highlight-row :loading="loading" @on-selection-change="checkTable" size="small">
                    <!-- 操作 -->
                    <template slot-scope="{ row }" slot="action">
                        <Tooltip placement="top" content="编辑" transfer>
                            <Button type="primary" size="small" @click="handleEdit(row.id)">
                                <Icon type="md-create" />
                            </Button>
                        </Tooltip>
                        <!-- <Poptip confirm title="您确认删除这条内容吗？" @on-ok="handleDelete(row.id)" transfer>
                            <Button size="small">
                                <Icon type="md-trash" />
                            </Button>
                        </Poptip> -->
                    </template>
                    <!-- 删除 -->
                </Table>
                <div style="margin: 10px;overflow: hidden">
                    <div class="pages-L">共 {{pageProps.totalCount}} 条</div>
                    <div style="float: right;">
                        <Page size="small"
                              :total="pageProps.totalCount"
                              :current="pageProps.currentPage"
                              show-sizer show-elevator
                              @on-change="changePage"
                              @on-page-size-change="changePageSize"></Page>
                    </div>
                </div>
            </Row>
        </Card>
    </div>
</template>
<script>
export default {
    name: 'category',
    data () {
        return {
            loadingVisible: false,
            search: {},
            ownershipList: [],
            checkList: [],
            columns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                { key: 'name', title: '类目名称', minWidth: 100, sortable: true, align: 'center' },
                { key: 'sort_number', title: '排序', minWidth: 100, sortable: true, align: 'center' },
                { key: 'status', title: '是否显示', minWidth: 100, sortable: true, align: 'center' },
                { key: 'remark', title: '备注', minWidth: 100, sortable: true, align: 'center' },
                { key: 'action', title: '操作', width: 150, align: 'center', slot: 'action' }
            ],
            data: [],
            loading: true,
            // 列表分页属性
            pageProps: {
                page: 1,
                perPage: 10,
                currentPage: 1,
                totalCount: 0
            }
        };
    },
    methods: {
        init (name) {
            this.pageProps.page = 1;
            this.pageProps.perPage = 10;
            this.getList(name);
            // 加载所有权
            this.$api.getOwnership().then(res => {
                this.ownershipList = res;
            });
        },
        // 搜索  重置  获取列表
        getList (data) {
            this.loading = true;
            let params = {};
            if (data) {
                params = this.search;
            } else {
                params = this.search = {};
            }
            params.page = this.pageProps.page;
            params.perPage = this.pageProps.perPage;
            this.$api.categoryManagementList(params)
                .then(res => {
                    this.loading = false;
                    if (res.items) {
                        this.data = res.items;
                        this.pageProps = res._meta;
                    }
                });
        },
        closeModal (e) {
            this[e].modal = false;
        },
        // 操作栏的编辑
        handleEdit (id) {
            this.$router.push({
                path: '/products/category-edit',
                query: { id: id }
            });
        },
        // 删除
        handleDelete () {
            // 删除请求接口
        },

        //显示隐藏
        display () {
            if (this.checkList.length == 0) {
                this.$Message.warning('请选择')
            }else {
                // 请求数据
                this.checkList.forEach(element => {
                    if (element.status == '隐藏') {
                        let params = [];
                        this.checkList.forEach(value => {
                            params.push(value.id)
                        })
                        this.$api.categoryManagementShow({idArr:params})
                            .then(res =>{
                                this.$Message.success(res.message)
                                this.getList()
                            })
                    } else if (element.status == '显示') {
                        let params = [];
                        this.checkList.forEach(value => {
                            params.push(value.id)
                        })
                        this.$api.categoryManagementNotShow({idArr:params})
                            .then(res =>{
                                this.$Message.success(res.message)
                                this.getList();
                            })
                    }
                });
            }
        },

        //获取当行数据
        checkTable (currentRow) {
            this.checkList = currentRow;
        },
        changePage (e) {
            this.pageProps.page = e;
            this.getList();
        },
        changePageSize (e) {
            this.pageProps.perPage = e;
            this.getList();
        }
    },
    activated () {
        this.init('activated');
    }
};
</script>

<style lang="less">
    .ivu-input::-webkit-input-placeholder, .ivu-select-single .ivu-select-selection .ivu-select-placeholder {
        color: rgb(130, 130, 130);
    }
    .ivu-input, .ivu-select-selection {
        border: 1px solid rgb(184, 184, 184);
        color: #000;
    }
</style>

