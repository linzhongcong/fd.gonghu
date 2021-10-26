<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-15 10:45:21
 * @LastEditTime: 2020-12-14 14:11:21
 * @LastEditors: Please set LastEditors
 -->
<template>
    <div>
        <Card>
            <Row slot="title">
                <Col :sm="24">
                <Form ref="search" :model="search" class="search">
                    <FormItem>
                        <Select class="mb-5" v-model="search.ownership" placeholder="数据权限范围" @on-change="getList('search')">
                          <Option v-for="(item, index) in dataPermissionRange" :value="item.value" :label="item.label" :key="'dataPer' + index"></Option>
                        </Select>
                    </FormItem>
                    <FormItem>
                        <Input v-model="search.policyName" placeholder="政策名称" clearable @keydown.native.enter.prevent="getList('search')"></Input>
                    </FormItem>
                    <FormItem>
                        <Select v-model="search.enableStatus" placeholder="政策状态" @on-change="getList('search')">
                            <Option v-for="(item, index) in enableStatusOptions" :value="item.value" :label="item.label" :key="`enableStatusOptions${index}`"></Option>
                        </Select>
                    </FormItem>
                    <FormItem>
                        <Select v-model="search.status" placeholder="审核状态" @on-change="getList('search')">
                            <Option v-for="item in statusList" :value="item.key" :key="item.key" :label="item.value"></Option>
                        </Select>
                    </FormItem>
                    <FormItem style="float: right;">
                        <Button type="primary" icon="md-search" style="padding: 4px 15px" @click="getList('search')">查询</Button>
                        <Button icon="md-repeat" style="padding: 4px 15px" @click="handleReset('search')">重置</Button>
                    </FormItem>
                </Form>
                </Col>
                <Col :sm="24">
                    <router-link to="/policy/policy-edit">
                        <Button type="primary" v-permission="'/v2/contract-policy/create'">添加</Button>
                    </router-link>
                    <Button type="primary" :loading="auditBtnLoading" @click="handleClickButton('audit')" v-permission="'/v2/contract-policy/audit'">审核</Button>
                    <Button type="primary" @click="handleClickButton('disOrEnable')" v-permission="'/v2/contract-policy/enable-status'">启用/停用</Button>
                    <Progress v-show="isShowProgress" :percent="percentProgress"></Progress>
                </Col>
            </Row>
            <Row class="margin-top-10"  style="clear: both;">
                <Table :columns="columns" :data="data" border  :loading="loading" @on-selection-change="selectCheck" size="small">
                    <!-- 操作 -->
                    <template slot-scope="{ row }" slot="action">
                        <Tooltip placement="top" content="编辑" transfer>
                            <Button type="primary" size="small" @click="handleEdit(row)" v-permission="'/v2/contract-policy/update'">
                                <Icon type="md-create" />
                            </Button>
                        </Tooltip>
                        <Poptip confirm title="您确认删除这条内容吗？" @on-ok="handleDelete(row.id)" transfer>
                            <Button size="small" :disabled="row.status === 'auditPass'" v-permission="'/v2/contract-policy/delete'">
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
        <Modal v-model="disabledOrEnableObj.modal" title="启用/停用">
            <h3 style="text-align: center;">{{`确认${disabledOrEnableObj.enableStatus === 'enable' ? '启用' : '停用'}政策`}}</h3>
            <div slot="footer">
              <Button @click="closeModal('disabledOrEnableObj')">取消</Button>
              <Button type="primary" :loading="disabledOrEnableObj.onLoading" @click="disabledOrEnablePolicy(disabledOrEnableObj)">确定</Button>
            </div>
        </Modal>
        
        <!-- 适用商品的详情 -->
        <Modal v-model="regularProductInfo" title="适用商品明细" width='800' :closable="false">
          
        <Table :columns="apply.column" :data="apply.data" border ></Table>
        </Modal>

        <!-- 审核 -->
        <PolicyDetailModal ref="policyDetailModal" @on-success="getList"></PolicyDetailModal>
    </div>
</template>

<script>
import globalMixin from '~/plugins/mixin'
import PolicyDetailModal from '@/components/policy/policy-detail-modal.vue'
import { formatPolicyStatus, formatAuditStatus } from '@/utils/policy'
export default {
    name: 'policy',
    components: {
      PolicyDetailModal
    },
    mixins: [globalMixin],
    data () {
        return {
            apply: {
              column: [
                { type: 'index', title: '序号', width: 65, align: 'center' },
                { key: 'product_name', title: '商品名称', minWidth: 200, align: 'center' },
                { key: 'policy_price', title: '政策价格', minWidth: 200, align: 'center' },
                { key: 'min_quantity', title: '起订量', minWidth: 100, align: 'center' },
                { key: 'is_required', title: '必选', minWidth: 100, align: 'center' , 
                    render: (h, params) => {
                      return h('div',params.row.is_required === '1' ? [h('Icon',{
                        props:{
                          type:'md-checkmark'
                        },
                        style:{
                          padding:'4px',
                          color:'#45cf2c',
                          fontSize:'18px',
                          fontWeight:700
                        }
                        })] : [h('Icon',{
                          props:{
                            type:'md-close'
                          },
                          style:{
                            padding:'4px',
                            color:'#ff5566',
                            fontSize:'18px',
                            fontWeight:700
                          }
                      })])
                    } 
                },
              ],
            },
            //s适用商品详情
            regularProductInfo: false,
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
              {key: 'draft', value: '草稿'},
              {key: 'auditPending', value: '待审核'},
              {key: 'auditPass', value: '审核通过'},
              {key: 'auditFailure', value: '审核不通过'}
            ],
            enableStatusOptions: [ // 政策状态
              { value: 'draft', label: '草稿' },
              { value: 'enable', label: '在用' },
              { value: 'disable', label: '停用' },
              { value: 'expired', label: '到期' },
            ],
            checkList: [],
            columns: [
                { type: 'selection', width: 60, align: 'center' },
                { type: 'index', title: '序号', width: 65, align: 'center' },
                {
                    key: 'policyName',
                    title: '政策名称',
                    minWidth: 200,
                    sortable: true,
                    align: 'center',
                    render: (h, { row }) => {
                        return h('a', {
                            on: {
                                click: () => {
                                    if (row.enableStatus === 'draft') return this.$Message.warning('草稿状态无详情!');
                                    this.handleShowPolicyModal('detail', row.id);
                                }
                            }
                        }, row.policyName);
                    }
                },
                {
                    key: 'deadlineAt',
                    title: '有效截止日期',
                    width: 110,
                    align: 'center'
                },
                { key: 'createdBy', title: '创建人', minWidth: 100, sortable: true, align: 'center' },
                {
                    key: 'createdAt',
                    title: '创建时间',
                    minWidth: 150,
                    sortable: true,
                    align: 'center',
                },
                {
                    key: 'enableStatus',
                    title: '政策状态',
                    minWidth: 120,
                    align: 'center',
                    render: (h, { row }) => h('span', formatPolicyStatus(row.enableStatus))
                },
                {   
                    key: 'status',
                    title: '审核状态',
                    width: 120,
                    align: 'center',
                    render: (h, { row }) => h('span', formatAuditStatus(row.status))
                },
                { key: 'action', title: '操作', width: 150, align: 'center', slot: 'action' }
            ],
            data: [],
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
            policyDetailList: {
              modal: false,
              data: {
                baseDiscount: [],
                categoryDiscount: [],
                productDiscount: [],
                backPointDiscount: [],
                giftDiscount: [],
                regularProductInfo:[]
              }
            },
            auditBtnLoading: false,
            disabledOrEnableObj: {
              modal: false,
              id: '',
              enableStatus: 'disable',
              onLoading: false,
            },
            modalType: '',
            policyNameLists: [],
            policyNameLoading: false
        };
    },
    methods: {
        init () {
            this.pageProps.page = 1;
            this.pageProps.perPage = 10;
            this.getList();
            // 加载所有权
            this.$api.getOwnership().then(res => {
                this.ownershipList = res;
            });
        },

        /**
         * 启用/禁用 请求API
         * @param {Object} data: 当前 启用/禁用 数据对象集合
         */
        async disabledOrEnablePolicy(data) {
          data.onLoading = true;
          const { id, enableStatus } = data;
          try {
            let res = await this.$api.contractPolicyEnableStatus({id, enableStatus});
            if (res.code === 0) {
              this.getList();
              data.onLoading = false;
              data.modal = false;
              this.$Message.success(`${data.enableStatus === 'enable' ? '启用' : '停用'}成功!`);
            }
          } catch (error) {
            data.onLoading = false;
          }
        },

        // 搜索
        getList () {
            this.loading = true;
            let params = this.search;
            params.page = this.pageProps.page;
            params.perPage = this.pageProps.perPage;
            params.product_type = '1';
            for (let i in params) {
                if (!params[i]) delete params[i];
            }
            params.id = '';
            this.$api.contractPoliceListv2(params)
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
                })
        },
        // 重置
        handleReset (name) {
            this.search = {};
            this.getList();
        },
        
        //适用商品查看详情
        seeRegularProductInfo(id,cateId){
          this.$api.getCategoryList({id: id,categoryId:cateId}).then(res => {
              if(res){
                this.regularProductInfo = true
                let { data } = res
                this.apply.data = data
              }
            })
        },
        formatActivity(prevArr, type) {
                let result = [];
                if(type == 'matching') {
                    let arr = prevArr.sort(function (a, b) { return a.matching_molecule - b.matching_molecule; });
                    arr.forEach((item) => {
                        let findResult = result.find(resultItem => (resultItem.matching_molecule + ',' + resultItem.matching_denominator) === (item.matching_molecule + ',' + item.matching_denominator));
                        if (findResult) {
                            findResult.list.push(item);
                        } else {
                            result.push({ matching_molecule: +item.matching_molecule, matching_denominator: +item.matching_denominator, list: [item] });
                        }
                    });
                } else {
                    let arr = prevArr.sort(function (a, b) { return a.starting_amount - b.starting_amount; });
                    arr.forEach((item) => {
                        let findResult = result.find(resultItem => resultItem.starting_amount === item.starting_amount);
                        if (findResult) {
                            findResult.list.push(item);
                        } else {
                            result.push({ starting_amount: item.starting_amount, list: [item] });
                        }
                    });
                }
                return result
        },

        /**
         * 单击按钮
         * @param {String} type: 单击的按钮类型
         */
        handleClickButton(type) {
          const checkList = this.checkList;
          if (checkList.length !== 1) return this.$Message.warning('请选择一条数据!');
          if (['expired', 'draft'].includes(checkList[0].enableStatus)) return this.$Message.warning('当前状态不可操作!'); // 草稿/到期 => 不可审核与启用禁用
          const data = checkList[0];
          switch (type) {
            case 'audit': // 审核
              if (data.status !== 'auditPending') return this.$Message.warning('当前数据已审核!');
              this.handleShowPolicyModal(type, data.id);
              break;
            case 'disOrEnable': // 禁用
              if (data.status === 'auditPending') return this.$Message.warning('当前数据待审核!');
              this.handleShowDisabledOrEnableModal(data);
              break;
            default:
              break;
          }
        },

        /**
         * 显示 启用/禁用 模态窗
         * @param {Number} isOpen: 启用/禁用   enable:启用  disable:禁用
         */
        handleShowDisabledOrEnableModal({ id, enableStatus }) {
          enableStatus = enableStatus === 'enable' ? 'disable' : 'enable';
          this.disabledOrEnableObj.id = id;
          this.disabledOrEnableObj.enableStatus = enableStatus;
          this.disabledOrEnableObj.modal = true;
        },
         
        /**
         * 展示 审核/政策详情 模态窗
         * @param {String} type: 展示类型： audit:审核  detail:详情
         * @param {String} id: 数据id
         */
        handleShowPolicyModal(type, id) {
          let title = '供货政策详情';
          let hideAuditer = true;
          type === 'audit' && (title = '审核') && (hideAuditer = false);

          this.$refs.policyDetailModal.initModal({ id, title, hideAuditer });
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
        // 操作栏的编辑
        handleEdit (data) {
          const { id, enableStatus } = data;
          this.$router.push({
            path: '/policy/policy-edit',
            query: { id, enableStatus }
          });
        },
        // 操作栏的删除
        handleDelete (id) {
          this.$api.v2DeleteContractPolicy({id})
            .then(res => {
              if (res.code === 0) {
                this.$Message.success(res.message);
                this.getList();
              }
            });
        },
        
        /**
       * 列表点击信息
       * @param {Object} selection：用户信息
       */
      selectCheck(selection) {
        this.checkList = selection
        // selection.length !=0 ?  this.checkList = selection[0] : this.checkList = {}

      },
        // 列表选择
        // checkTable (currentRow) {
        //     this.checkList = currentRow;
        // },
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
        // 启用状态转化
        formatIsOpen (isOpen) {
            return isOpen === '0' ? '否' : '是';
        },
        // 折扣比例转化
        formatProportion (num) {
            if(num!=''){
                return (num * 100).toFixed(2) + '%';
            } else {
                return num
            }
        },
    },
    activated () {
      let status = this.$route.query.status||'';
      if (status) {
        this.search.status = 'ContractPolicyWorkFlow/'+status;
      }else{
        this.search.status = '';

      }
      let idCollect=this.$route.query.id_collect||'';
      if(idCollect){
        this.search.id_collect = idCollect;
      }else{
        this.search.id_collect = '';

      }
      this.checkList = [];
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
    .detailsList-title {
        margin: 20px auto 10px;
    }
    .policyDetailList-wrap {
        height: 550px;
        overflow-y: scroll;
    }
    .policy-detail{
        cursor: pointer;
        color: #5cadff;
    }
    
.mathch-product{
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.product-items{
  flex: 1;
  height: 40px;
  line-height: 40px;
  border-right: 1px solid #e8eaec;
  border-top: 1px solid #e8eaec;
}

.width-110{
  width: 110px;
  height: 40px;
  line-height: 40px;
  border-right: 1px solid #e8eaec;
  border-top: 1px solid #e8eaec;
}
.width-108{
  width: 108px;
}
</style>