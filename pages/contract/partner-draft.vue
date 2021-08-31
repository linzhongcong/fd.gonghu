<template>
    <div>
        <Card>
            <Row slot="title">
                <Col :sm="24" @keydown.native.enter.prevent="getList('search')">
                    <Form ref="search" :model="search" class="search">
                        <Col> 
                            <FormItem>
                                <Input v-model="search.salesman" placeholder="业务员" clearable></Input>
                            </FormItem>
                            <FormItem>
                                <Input v-model="search.contact_name" placeholder="联系人" clearable></Input>
                            </FormItem>
                            <FormItem>
                                <Input v-model="search.merchant_name" placeholder="商家" clearable></Input>
                            </FormItem>
                            <FormItem>
                                <Select v-model="search.merchant_type" placeholder="商家类型" clearable @on-change="getList('search')">
                                    <Option v-for="item in businessType" :key="'businessType'+item.value" :value="item.value" :label="item.label"></Option>
                                </Select>
                            </FormItem>
                            <FormItem style="float:right">
                                <Col span="12"><Button type="primary" icon="ios-search" @click="getList('search')" style="padding: 4px 15px">搜索</Button></Col>
                            </FormItem>
                        </Col>
                    </Form>
                </Col>
            </Row>
            <Row class="margin-top-10">
                <Table border highlight-row :columns="partnerColumns" :data="partnerData" :loading="loading" size="small">
                    <!-- 操作 -->
                    <template slot-scope="{ row }" slot="action">
                        <Tooltip placement="top" content="编辑" transfer>
                            <Button type="primary" size="small" @click="handleEdit(row.id)">
                                <Icon type="md-create" />
                            </Button>
                        </Tooltip>
                        <Poptip confirm title="您确认删除这条内容吗？" @on-ok="handleDelete(row.id)" transfer>
                            <Button size="small">
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
        name: 'partner-draft',
        data () {
            return {
                logTabs: 'details',
                // 详情弹窗id
                detailId: '',
                // 审核状态转化
                statusList: [
                    { value: 'auditPending', label: '待审核' },
                    { value: 'auditPass', label: '审核通过' },
                    { value: 'auditFailure', label: '审核不通过' },
                    { value: 'draft', label: '草稿' }
                ],
                // 表单搜索
                search: {},
                // 所有权数据
                ownershipList: [
                    { value: 'company', label: '公司所有权' },
                    { value: 'department', label: '部门所有权' },
                    { value: 'self', label: '个人所有权' }
                ],
                loading: false,
                // 详情、审核、复审弹窗
                modal: {
                    title: '',
                    status: ''
                },
                // 详情弹窗
                detailsList: {
                    modal: false,
                    data: [],
                    loading: true,
                    remark: ''
                },
                // 审核
                auditList: {},
                // 商家类型
                businessType: [
                    { value: 'cs', label: 'CS'},
                    { value: 'ka', label: 'KA'},
                    { value: 'otc', label: 'OTC'},
                    { value: 'store', label: '便利店'},
                    { value: 'mother', label: '其他'}
                ],
                // 列表分页属性
                pageProps: {
                    page: 1,
                    perPage: 10,
                    currentPage: 1,
                    totalCount: 0
                },
                // 列表数据
                partnerData: [],
                // 列表字段
                partnerColumns: [
                    {type: 'selection', width: 65, align: 'center', 'fixed': 'left'},
                    {
                        title: '序号',
                        type: 'index',
                        width: 65,
                        align: 'center'
                    },
                    {
                        title: '商家名称',
                        key: 'merchant_name',
                        minWidth: 200,
                        align: 'center'
                    },
                    {title: '联系人', key: 'contact_name', minWidth: 90, align: 'center'},
                    {title: '联系电话', key: 'contact_phone', minWidth: 120, align: 'center'},
                    {title: '政策名称', key: 'partner_policy_name', minWidth: 110, align: 'center'},
                    {
                        title: '合同签约日期',
                        key: 'begin_at',
                        minWidth: 130,
                        align: 'center',
                        ellipsis: true,
                        render: (h, params) => {
                            return h('div', this.formatDate(params.row.begin_at));
                        }
                    },
                    { title: '合同到期日期',
                        key: 'end_at',
                        minWidth: 130,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', this.formatDate(params.row.end_at));
                        }
                    },
                    { title: '合作方式',
                        key: 'payment_method',
                        minWidth: 110,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', this.paymentType(params.row.payment_method));
                        }
                    },
                    {
                        title: '门店数量',
                        key: 'shop_num',
                        minWidth: 110,
                        align: 'center',
                    },
                    {
                        title: '业务员',
                        key: 'salesman',
                        minWidth: 110,
                        align: 'center',
                    },
                    {title: '创建人', key: 'created_by', minWidth: 110, align: 'center'},
                    {
                        title: '创建时间',
                        key: 'created_at',
                        minWidth: 120,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', this.formatDate(params.row.created_at));
                        }
                    },
                    {
                        title: '审核状态',
                        key: 'status',
                        minWidth: 110,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', this.statusType(params.row.status));
                        }
                    },
                    { key: 'action', title: '操作', width: 110, align: 'center', slot: 'action' }
                ],
                // 详情
                partnerDetail: {
                    // columns: [
                    //     {title: '序号', type: 'index', width: 65, align: 'center'},
                    //     {title: '创建人', key: 'created_by', width: 100, align: 'center'},
                    //     {
                    //         title: '时间',
                    //         key: 'created_at',
                    //         align: 'center',
                    //         render: (h, params) => {
                    //             return h('div', this.formatDate(params.row.created_at));
                    //         }
                    //     },
                    //     {title: '包材图稿', key: 'artwork', align: 'center'},
                    //     {title: '包材AI', key: 'artworkAi', align: 'center'},
                    //     {title: '状态备注', key: 'remark', align: 'center'},
                    //     {
                    //         title: '状态',
                    //         key: 'status',
                    //         align: 'center',
                    //         render: (h, params) => {
                    //             return h('div', this.artworksStatus(params.row.status));
                    //         }
                    //     },
                    //     {title: '选择', align: 'center'}
                    // ],
                    data: {
                        opinion: '',
                        is_pass: '',
                        fileItems:[
                            {
                                downLoadHref:''
                            }
                        ]
                    },
                    modal: false,
                    loading: false,
                    status: []
                },
                // 合作方式
                paymentList: [
                    { value: 'monthly', label: '月结' },
                    { value: 'spot_cash', label: '现款现货' },
                    { value: 'real_sale', label: '实销实结' }
                ]
            };
        },
        methods: {
            /**
             * 初始化数据
             */
            init () {
                this.getList();
            },
            /**
             * 查询合作商列表
             * @param {String} name：表单名称
             */
            getList (name) {
                let params = {};
                params = this.search;
                params.is_draft = 1;
                this.loading = true;
                params.page = this.pageProps.page;
                params.perPage = this.pageProps.perPage;
                this.$api.contractorDraftList(params)
                    .then(res => {
                        this.loading = false;
                        this.partnerData = res.items;
                        if (res._meta) {
                            this.pageProps.totalCount = res._meta.totalCount;
                        }
                    });
            },

            /**
             * 详情
             * @param {Number} id：订单编号
             */
            viewDetails (id) {
                this.partnerDetail.data = {};
                this.modal = {
                    title: '详情',
                    status: 'detail'
                };
                this.partnerDetail.modal = true;
                this.$api.contractorDetail(id)
                    .then(res => {
                        this.detailsList.loading = false;
                        if (res.code === 0) {
                            res.data.is_pass = res.data.is_pass ? res.data.is_pass : res.data.audit_pass;
                            this.partnerDetail.data = res.data;
                        }
                    });
                this.detailId = id;
            },

            /**
             * 关闭详情弹窗
             */
            closeModal (name) {
                this[name].modal = false;
            },

            /**
             * 时间转化
             * @param {time} time: 时间戳
             */
            formatDate (time) {
                return this.$format(time, 'yyyy-MM-dd');
            },

            /**
             * 改变页数事件
             * @param {Number} e：返回的页数
             */
            changePage (e) {
                this.pageProps.page = e;
                this.getList();
            },

            /**
             * 改变页数事件
             * @param {Number} e：返回的页数
             */
            changePageSize (e) {
                this.pageProps.perPage = e;
                this.getList();
            },

            /**
             * 操作栏的编辑
             * @param {Number} 表单id
             */
            handleEdit (id) {
                this.$router.push({
                    path: '/contract/partner-management-edit',
                    query: { id: id, type: 'draft' }
                });
            },

            /**
             * 删除信息
             * @param {Number} 表单id
             */
            handleDelete (id) {
                this.$api.contractorDraftDelete({id: id})
                    .then(res => {
                        if (res.code === 0) {
                            this.$Message.success(res.message);
                            this.getList();
                        }
                    });
            },

            /***
             * 合作方式
             * @param {String} pay：类型
             */
            paymentType (pay) {
                let list = this.paymentList.filter((item) => {
                    return item.value === pay;
                });
                return list[0] ? list[0].label : '';
            },

            /***
             * 商家类型
             * * @param {String} pay：类型
             */
            businessList (pay) {
                let list = this.businessType.filter((item) => {
                    return item.value === pay;
                });
                return list[0] ? list[0].label : '';
            },

            /***
             * 审核状态类型
             * * @param {String} status：类型
             */
            statusType (status) {
                let list = this.statusList.filter((item) => {
                    return status.indexOf(item.value) > -1;
                });
                return list[0] ? list[0].label : '';
            },
        },
        activated () {
            this.init();
        }
    };
</script>

<style lang="less" scoped>
    .ivu-table-border {
        overflow: visible
    }

    .partnerDetailAddress {
        height: 40px;
        border-bottom: 1px solid #e8eaec;
        &:last-child{
            border-bottom: none;
        }
        .head-bg {
            display:inline-block;
            line-height: 40px;
            border-right: 1px solid #e8eaec;
        }
        .head-bgs {
            display:inline-block;
            line-height: 40px;
        }
    }
</style>
