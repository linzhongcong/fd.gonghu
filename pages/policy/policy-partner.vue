<template>
    <div>
        <Card>
            <Row slot="title">
                <Col :sm="24">
                    <Form ref="search" :model="search" class="search">
                        <Row>
                            <Col :sm="19">
                                <FormItem>
                                    <Select class="mb-5" v-model="search.ownership" placeholder="数据权限范围" @on-change="getList('search')">
                                      <Option v-for="(item, index) in dataPermissionRange" :value="item.value" :label="item.label" :key="'dataPer' + index"></Option>
                                    </Select>
                                </FormItem>
                                <FormItem>
                                    <Input v-model="search.partner_policy_name" placeholder="合作商政策" clearable @keydown.native.enter.prevent="getList('search')"></Input>
                                </FormItem>
                            </Col>
                            <Col :sm="5" style="text-align:right; padding-right: 0;">
                                <FormItem>
                                    <Col span="12"><Button type="primary" icon="ios-search" @click="getList('search')" style="padding: 4px 15px">查询</Button></Col>
                                    <Col span="12"><Button type="default" icon="md-repeat" @click="getList(false)" style="padding: 4px 15px">重置</Button></Col>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </Col>
                <Col :sm="24">
                    <router-link to="/policy/policy-partner-edit">
                        <Button type="primary" v-permission="'/v1/partner-policy/create'">添加</Button>
                    </router-link>

                    <Progress v-show="isShowProgress" :percent="percentProgress"></Progress>
                </Col>
            </Row>
            <Row class="margin-top-10"  style="clear: both;">
                <Table :columns="columns" :data="data" border highlight-row :loading="loading" @on-current-change="checkTable" size="small">
                    <!-- 操作 -->
                    <template slot-scope="{ row }" slot="action">
                        <Tooltip placement="top" content="编辑" transfer>
                            <Button type="primary" size="small" @click="handleEdit(row.id, row)" v-permission="'/v1/partner-policy/update'">
                                <Icon type="md-create" />
                            </Button>
                        </Tooltip>
                        <Poptip confirm title="您确认删除这条内容吗？" @on-ok="handleDelete(row.id, row)" transfer>
                            <Button size="small" v-permission="'/v1/partner-policy/delete'">
                                <Icon type="md-trash" />
                            </Button>
                        </Poptip>
                    </template>
                </Table>
                <div style="margin: 10px;overflow: hidden">
                    <div class="pages-L">共 {{pageProps.totalCount}} 条</div>
                    <div style="float: right;">
                        <Page size="small" :total="pageProps.totalCount" :current="pageProps.currentPage" show-sizer show-elevator @on-change="changePage" @on-page-size-change="changePageSize"></Page>
                    </div>
                </div>
            </Row>
        </Card>
    </div>
</template>

<script>
import globalMixin from '~/plugins/mixin'
export default {
    name: 'policy-partner',
    mixins: [globalMixin],
    data () {
        return {
            logData: { // 日志
                data: [],
                loading: false
            },
            logPage: { // 日志分页属性
                page: 1,
                perPage: 10,
                currentPage: 1,
                totalCount: 0
            },
            logTabs: 'details',
            detailId: '', // 详情弹窗id
            loadingVisible: false,
            detail: false,
            search: {
              ownership: 'company'
            },
            ownershipList: [],
            statusList: [
                {key: 'auditPending', value: '待审核'},
                {key: 'auditPass', value: '审核通过'},
                {key: 'auditFailure', value: '审核不通过'}
            ],
            checkList: [],
            columns: [
                { type: 'index', title: '序号', width: 65, align: 'center' },
                // { key: 'id', title: '合作商政策ID', minWidth: 100, sortable: true, align: 'center' },
                {
                    key: 'partnerPolicyName',
                    title: '合作商政策',
                    minWidth: 200,
                    sortable: true,
                    align: 'center'
                },
                {
                    key: 'policy_name',
                    title: '包含政策',
                    minWidth: 200,
                    sortable: true,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', {
                            attrs: {
                                class: 'sub-col'
                            },
                            props: ''
                        }, [
                            h('div', params.row.partnerPolicyGroup.map((item, value, index) => {
                                return h('p', {
                                }, item.contractPolicyName);
                            }))
                        ]);
                    }
                },
                { key: 'createdBy', title: '创建人', width: 140, sortable: true, align: 'center' },
                { key: 'remark', title: '备注', minWidth: 100, sortable: true, align: 'center' },
                { key: 'action', title: '操作', width: 150, align: 'center', slot: 'action' }
            ],
            data: [

            ],
            loading: false,
            // 列表分页属性
            pageProps: {
                page: 1,
                perPage: 10,
                currentPage: 1,
                totalCount: 0
            },
            percentProgress: 0,
            isShowProgress: false,
            detailsList: {
                modal: false,
                data: [],
                loading: true,
                showAuditDetail: false,
                is_pass: ''
            },
            enableList: {
                modal: false,
                radio: ''
            },
            modalType: '',
            baseList: [],
            categoryList: [],
            productList: [],
            backPointList: [],
            giftList: [],
            policyNameLists: [],
            policyNameLoading: false,
            queryContractPolicyList: []
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

        // 搜索
        getList (name) {
            let params;
            this.loading = true;

            if (name) {
                params = this.search;
            } else {
                params = this.search = {};
            }
            params.page = this.pageProps.page;
            params.perPage = this.pageProps.perPage;
            params.product_type = '1';
            // params.id = '';
            this.$api.policyPartnerList(params)
                .then(res => {
                    if (res.code === 0) {
                        let data = res.data;
                        this.data = data.list;
                        this.pageProps.totalCount = data.totalCount;
                        this.pageProps.currentPage = data.currentPage;
                        this.search.ownership = data.ownership;
                        this.handleValidateDataPermissionRange(this, 'isGetDataPermissionRange', 'dataPermissionRange', data.ownership);
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 重置
        handleReset (name) {
            this.search = {};
            this.getList();
        },
        // 启用
        viewEnables () {
            if (this.checkList.length !== 0) {
                this.enableList.modal = true;
                this.enableList.is_open = this.checkList.is_open;
            } else {
                this.$Message.warning('请选择！');
            }
        },
        sumbitEnable () {
            let params = {};
            params.is_open = this.enableList.is_open;
            params.id = this.checkList.id;
            this.$api.contractPoliceEnable(params).then(res => {
                if (res.code === 0) {
                    this.$Message.success(res.message);
                    this.getList();
                } else {
                    this.$Message.error(res.message);
                }
            });
        },
        closeModal (e) {
            this[e].modal = false;
        },
        // 日志
        getLog () {
            this.logData.loading = true;
        },
        // 日志---页码
        changeLogPage (e) {
            this.logPage.page = e;
            this.getLog();
        },
        // 日志---每页条数
        changeLogPageSize (e) {
            this.logPage.perPage = e;
            this.getLog();
        },
        // 搜索政策名称
        queryPolicyName (value) {
            let params = {};
            params.policy_name = value;
            params.id = '';
            this.policyNameLoading = true;
            this.$api.contractPoliceList(params).then(res => {
                this.policyNameLoading = false;
                if (res.items.length !== 0) {
                    this.policyNameLists = res.items;
                }
            });
        },
        // 操作栏的编辑
        handleEdit (id, row) {
            this.$router.push({
                path: '/policy/policy-partner-edit',
                query: { id: id }
            });
        },
        // 操作栏的删除
        handleDelete (id, row) {
            this.$api.policyPartnerDelete(id)
                .then(res => {
                    if (res.code === 0) {
                        this.$Message.success(res.message);
                        this.getList();
                    } else {
                        this.$Message.error(res.data[0]);
                    }
                });
        },
        // 列表选择
        checkTable (currentRow) {
            this.checkList = currentRow;
        },
        // 审核
        auditItem () {
            let params = {};
            params.id = this.checkList.id;
            params.is_pass = this.detailsList.is_pass;
            if (params.is_pass === '') {
                this.$Message.warning('审核结果不能为空！');
                return false;
            }
            this.$api.auditContractPolice(params)
                .then(res => {
                    if (res.code === 0) {
                        this.$Message.success(res.message);
                        this.closeModal('detailsList');
                        this.getList();
                    } else {
                        this.$Message.error(res.message);
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
        }
    },
    activated () {
        this.init('activated')
        // this.getList('activated')
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
    .detailsList-title {
        margin: 20px auto 10px;
    }
    .sub-col ul li{
        list-style: none !important;
        padding-top:4px;
        padding-bottom:4px;
    }
</style>