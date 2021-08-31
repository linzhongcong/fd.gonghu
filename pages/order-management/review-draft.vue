<template>
    <div>
        <Card>
            <Row slot="title">
                <Col :sm="24">
                    <Form ref="search" :model="search" class="search">
                    <Row @keydown.native.enter.prevent="getList('search')">
                        <Col :sm="19" style="">
                            <FormItem>
                                <Select v-model="search.ownership" clearable placeholder="所有权" @on-change="getList('search')">
                                    <Option v-for="item in ownershipList" :value="item.ownership" :key="item.ownership" :label="item.label"></Option>
                                </Select>
                            </FormItem> 
                            <FormItem>
                                <Input v-model="search.merchant_name" placeholder="商家" clearable></Input>
                            </FormItem>
                            <FormItem>
                                <Input v-model="search.item_no" placeholder="货号" clearable></Input>
                            </FormItem>
                        </Col>
                        <Col :sm="5" style="text-align:right;">
                            <FormItem>
                                <Col span="12"><Button type="primary" icon="ios-search" @click="getList('search')" style="padding: 4px 15px">搜索</Button></Col>
                            </FormItem>
                        </Col>
                    </Row>
                    </Form>
                </Col>
            </Row>
            <Row class="margin-top-10">
                <Table class="review-list" border highlight-row :columns="reviewColumns" :data="reviewData" :loading="loading" size="small">
                <!-- 操作 -->
                <template slot-scope="{ row }" slot="action">
                    <Tooltip placement="top" content="编辑" transfe>
                        <Button type="primary" @click="handleEdit(row.id)" size="small" >
                            <Icon type="md-create" />
                        </Button>
                    </Tooltip>
                    <Poptip confirm title="您确认删除这条内容吗？" @on-ok="handleDelete(row.id)" transfer>
                        <Button size="small" >
                            <Icon type="md-trash" />
                        </Button>
                    </Poptip>

                </template>
            </Table>
                <div style="margin: 10px;overflow: hidden">
                    <div class="pages-L">共 {{pageProps.totalCount}} 条</div>
                    <div style="float: right;">
                        <Page :total="pageProps.totalCount" size="small" :current="pageProps.currentPage" show-sizer show-elevator @on-change="changePage" @on-page-size-change="changePageSize"></Page>
                    </div>
                </div>
            </Row>
        </Card>
    </div>
</template>

<script>
    export default {
        name: 'review-draft',
        data () {
            return {
                statusList: [
                    { value: 'OrderWorkflow/auditPending', label: '待初审' },
                    { value: 'OrderWorkflow/auditFailure', label: '初审未通过' },
                    { value: 'OrderWorkflow/auditRecheckPending', label: '待复审' },
                    { value: 'OrderWorkflow/auditRecheckFailure', label: '复审未通过' },
                    { value: 'OrderWorkflow/auditRecheckPass', label: '复审通过' },
                    { value: 'OrderWorkflow/draft', label: '草稿' }
                ],
                search: {},
                ownershipList: [],
                loading: false,
                // 列表分页属性
                pageProps: {
                    page: 1,
                    perPage: 10,
                    currentPage: 1,
                    totalCount: 0
                },
                reviewData: [],
                // 弹窗表格
                reviewColumns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center',
                        fixed: 'left',
                        filterMultiple: false
                    },
                    {
                        title: '序号',
                        type: 'index',
                        width: 65,
                        align: 'center'
                    },
                    {title: '商家名称', key: 'merchant_name', minWidth: 180, align: 'center'},
                    {   
                        key: 'order_sn',
                        title: '订单编号',
                        minWidth: 180,
                        align: 'center'
                    },
                    {
                        title: '创建时间',
                        key: 'created_at',
                        minWidth: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('span', this.formatDate(params.row.created_at));
                        }
                    },
                    {
                        title: '货号',
                        key: 'product',
                        minWidth: 170,
                        align: 'center',
                        ellipsis: true,
                        render: (h, params) => {
                            return h('div', {
                                attrs: {
                                    class: 'sub-col'
                                }
                            }, [
                                h('ul', params.row.product.map((item, value, index) => {
                                    return h('li', {
                                    }, item.item_no);
                                }))
                            ]);
                        }
                    },
                    {
                        title: '所选政策',
                        key: 'contract_policy_name',
                        minWidth: 90,
                        align: 'center'
                    },
                    {
                        title: '数量',
                        key: 'product',
                        minWidth: 100,
                        align: 'center',
                        ellipsis: true,
                        render: (h, params) => {
                            return h('div', {
                                style: {
                                    listStyle: 'none'
                                },
                                attrs: {
                                    class: 'sub-col'
                                }
                            }, [
                                h('ul', params.row.product.map((item, value, index) => {
                                    return h('li', {
                                    }, parseInt(item.number));
                                }))
                            ]);
                        }
                    },
                    {title: '订单应收金额', key: 'total_order_amount', minWidth: 120, align: 'center'},
                    {
                        title: '审核状态',
                        key: 'delivery_mode',
                        minWidth: 90,
                        align: 'center',
                        render: (h, params) => {
                            return h('span', this.findAuditStatus(params.row.status));
                        }
                    },
                    {
                        title: '创建人',
                        key: 'created_by',
                        minWidth: 100,
                        align: 'center'
                    },
                    {
                        key: 'action',
                        title: '操作',
                        width: 100,
                        align: 'center',
                        slot: 'action'
                    }
                ],
            };
        },
        methods: {
            // 检索审核状态
            findAuditStatus (json) {
                for (let i in this.statusList) {
                    if (json == this.statusList[i].value) {
                        return this.statusList[i].label;
                    }
                }
            },
            init () {
                // 加载所有权
                this.$api.getOwnership().then(res => {
                    this.ownershipList = res;
                });
                this.getList();
            },
            // 查询
            getList (name) {
                let params = this.search;
                if(name == 'search'){
                    params.page = 1
                }
                this.loading = true;
                params.page = this.pageProps.page;
                params.perPage = this.pageProps.perPage;
                params.is_draft = 1
                this.$api.orderDraftList(params).then((res) => {
                    this.reviewData = res.items
                    this.pageProps.page = res._meta.currentPage
                    this.pageProps.perPage = res._meta.perPage
                    this.pageProps.totalCount = res._meta.totalCount
                }).finally(()=>{
                    this.loading = false
                })
            },
            // 折扣比例转化
            formatProportion (num) {
                return num * 100 + '%';
            },
            // 转换时间格式
            formatDate (time, json) {
                if (json === 'ymd') {
                    return this.$format(time, 'yyyy-MM-dd ');
                } else {
                    return this.$format(time, 'yyyy-MM-dd hh:mm');
                }
            },
            changePage (e) {
                this.pageProps.page = e;
                this.getList('search');
            },
            changePageSize (e) {
                this.pageProps.perPage = e;
                this.getList('search');
            },
            // 操作栏的编辑
            handleEdit (id) {
                this.$router.push({
                    path: '/order-management/review-edit',
                    query: { id: id, type: 'draft' }
                });
            },
            // 删除信息
            handleDelete (id) {
                this.$api.orderDraftDelete({id: id})
                    .then(res => {
                        if (res.code == 0) {
                            this.$Message.success(res.message);
                            this.getList();
                        }
                    });
            },
        },
        activated () {
            this.init();
        }
    };
</script>

<style lang="less">
    .sub-col ul li{
        list-style: none;
        padding-top:4px;
        padding-bottom:4px;
    }
    .remark-input > input{
        text-align:center;
        border: 0;
        outline:none;
        width:500px;
    }
</style>
