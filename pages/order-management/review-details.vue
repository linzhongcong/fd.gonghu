<template>
      <div>
        <Card style="position:relative;">
            <Row slot="title" style="text-align:right;">
                <Button type="primary" :loading="buttonLoading" @click="submitForm('formData')" :disabled="isDisabled">返回</Button>
            </Row>
            <Row class="border-row">
                <div class="title">
                    <div slot="title">
                        <Icon type="ios-film-outline"></Icon>
                         订单号：<span v-text="formData.order_sn"></span>
                         <div class="order-count">
                            <span style="color:#808695;">订单金额：</span>
                            <span style="color:red;font-size: 18px;" v-if="formData.total_order_amount != null">
                                ￥<span v-text="formData.total_order_amount"></span>
                            </span>
                            <span style="color:#2d8cf0;font-size: 18px;" v-else>
                                暂无
                            </span>
                        </div>
                    </div>
                </div>

                <div class="basic">
                    <Row style="padding: 15px 0;">
                        <Col :lg="8" :md="24" >创建人：<span v-text="formData.created_by"></span></Col>
                        <Col :lg="8" :md="24" >业务员：<span v-text="formData.salesman"></span></Col>
                        <Col :lg="8" :md="24" >创建时间：<span v-text="formData.created_at"></span></Col>
                    </Row>
                    <Row style="padding: 15px 0;">
                        <Col :lg="8" :md="24" >公司名称：<span v-text="formData.merchant_name"></span></Col>
                        <Col :lg="8" :md="24" >订单来源：<span v-text="orderFormChange(formData.order_form)"></span></Col>
                        <Col :lg="8" :md="24" >下单时间：<span v-text="formData.order_time"></span></Col>
                    </Row>
                    <Row style="padding: 15px 0;">
                        <Col :lg="8" :md="24" >
                            附件凭证：<span v-if="formData.orderFile.length !== 0">
                                <span v-for="(item, index) in formData.orderFile" :key="index">
                                  <a href="javascript:;" @click="showOrderFile(item)">{{item.title + '.' +item.extension}} </a>
                                </span>
                              </span>
                        </Col>
                        <Col :lg="8" :md="24" >
                            备注：<span v-if="formData.remark !== ''" v-text="formData.remark"></span><span v-else>暂无</span>
                        </Col>
                    </Row>
                </div>
            </Row>
            <Row class="border-row">
                <div class="title">
                    订单信息
                    <div class="order-count">
                        <span style="color:#808695;">所选政策：</span>
                        <span style="color:#0000FF;font-size: 18px; cursor: pointer;" @click="openPolicyDetail">{{formData.contract_policy_name}}</span>
                    </div>
                </div>
                <Row class="basic">
                    <p>商品</p>
                    <Col :span="24" style="margin-bottom:40px">
                        <Table border highlight-row :columns="productColumns.order" :data="formData.orderProduct"></Table>
                    </Col>
                    <section v-if="formData.repurchaseProduct !== undefined && formData.repurchaseProduct.length > 0 ">
                        <p>换购清单</p>
                        <Col :span="24" style="margin-bottom:40px">
                            <Table border highlight-row :columns="productColumns.repurchase" :data="formData.repurchaseProduct"></Table>
                        </Col>
                    </section>
                    <section v-if="formData.backPoint !== undefined && formData.backPoint.length > 0 ">
                        <p>返点清单</p>
                        <Col :span="24" style="margin-bottom:40px">
                            <Table border highlight-row :columns="productColumns.backPoint" :data="formData.backPoint"></Table>
                        </Col>
                    </section>
                    <section v-if="formData.matchingProduct !== undefined && formData.matchingProduct.length > 0">
                        <p>配赠清单</p>
                        <Col :span="24" style="margin-bottom:20px">
                            <Table border highlight-row :columns="productColumns.matching" :data="formData.matchingProduct"></Table>
                        </Col>
                    </section>
                    <section v-if="formData.giftProduct !== undefined && formData.giftProduct.length > 0">
                        <p>赠品清单</p>
                        <Col :span="24" style="margin-bottom:20px">
                            <Table border highlight-row :columns="productColumns.gift" :data="formData.giftProduct"></Table>
                        </Col>
                    </section>
                </Row>
                <div class="basic">
                    <Row style="margin-bottom:15px;">
                        <Col :sm="8">
                            满减优惠总金额：<span v-text="formData.reduction_amount"></span>
                        </Col>
                        <Col :sm="8">
                            返点额度：<span v-text="formData.rebate_limit"></span>
                        </Col>
                        <Col :sm="8">
                            返点货值：<span v-text="formData.rebate_amount"></span>
                        </Col>
                    </Row>
                    <Row style="margin-bottom:15px;">
                        <Col :sm="8">
                            换购应收总金额：<span v-text="formData.repurchase_amount"></span>
                        </Col>
                        <Col :sm="8">
                            配赠额度：<span v-text="formData.matching_limit"></span>
                        </Col>
                        <Col :sm="8">
                            配赠货值：<span v-text="formData.matching_amount"></span>
                        </Col>
                    </Row>
                    <Row style="margin-bottom:6px;">
                        <Col :sm="8">
                            订单应收金额：<span v-text="((formData.origin_order_amount*100)+(formData.repurchase_amount*100)-(formData.reduction_amount*100))/100"></span>
                        </Col>
                    </Row>
                </div>
            </Row>
            <Row class="border-row">
                <div class="title">审核信息</div>
                <div class="basic">
                    <div v-if="formData.auditLogItems.length > 0" >
                        <div v-for="(item,index) in formData.auditLogItems" :key="index">
                            <Row style="margin-bottom:6px;">
                                <Col :sm="8" v-if="index === 0">
                                    初审：<span v-text="item.created_by"></span>
                                </Col>
                                <Col :sm="8" v-else>
                                    复审：<span v-text="item.created_by"></span>
                                </Col>
                                <Col :sm="8">
                                    审核结果：<span v-text="auditStatusChange(item.audit_pass)"></span>
                                </Col>
                                <Col :sm="8">
                                    审核时间：<span v-text="timestampToTime(item.created_at)"></span>
                                </Col>
                            </Row>
                            <Row style="margin-bottom:6px;">
                                <Col :sm="8">
                                    备注：
                                    <template v-if="item.opinion">
                                        <span v-text="item.opinion"></span>
                                    </template>
                                    <template v-else>暂无</template>

                                </Col>
                            </Row>
                        </div>
                    </div>
                    <div v-else>暂无</div>
                </div>
            </Row>
            <Row class="border-row">
                <div class="title">商家信息</div>
                <div class="basic">
                    <Row style="margin-bottom:6px;">
                        <Col :lg="8" :md="24" >
                            商家名称：<span v-text="formData.merchant_name"></span>
                        </Col>
                        <Col :md="8" :sm="24" >
                            系统/门店：<span v-text="formData.system_name"></span>
                        </Col>
                        <Col :md="8" :sm="24" >
                            门店数量：<span v-text="formData.facade.length"></span>
                        </Col>
                        
                    </Row>
                    <Row style="margin-bottom:6px;">
                        <Col :lg="8" :md="24" >
                            收货地址：<span v-text="formData.receiving_address"></span>
                        </Col>
                        <Col :lg="8" :md="24" >
                            联系人：<span  v-text="formData.contact_name"></span>
                        </Col>
                        <Col :md="8" :sm="24" >
                            联系电话：<span v-text="formData.contact_phone"></span>
                        </Col>
                    </Row>
                    <Row style="margin-bottom:6px;">
                        <Col :md="8" :sm="24" >
                            付款方式：<span v-text="paymentMethodChange(formData.payment_method)"></span>
                        </Col>
                        <Col :lg="8" :md="24" >
                            合作商政策：<span v-text="formData.partner_policy_name"></span>
                        </Col>
                        <Col :md="8" :sm="24" >
                            当前合同政策：<a v-text="formData.contract_policy_name" @click="openPolicyDetail"></a>
                        </Col>
                    </Row>
                </div>
            </Row>
            <Row class="border-row">
                <div class="title">收款信息</div>
                <div class="basic">
                    <Row style="margin-bottom:6px;">
                        <Col :sm="8">
                            收款状态：<span v-text="receivablesStatusChange(formData.receivables_status)"></span>
                        </Col>
                        <Col :sm="8">收款提交时间：
                            <span v-if="toNumber(formData.receipt_submission_at) !== 0" v-text="formData.receipt_submission_at"></span>
                            <span v-else>暂无</span>
                        </Col>
                        <Col :sm="8">收款完成时间：
                            <span v-if="toNumber(formData.collection_completion_at) !== 0" v-text="formData.collection_completion_at"></span>
                            <span v-else>暂无</span>
                        </Col>
                    </Row>
                </div>
            </Row>
            <Row class="border-row">
                <div class="title">发货信息</div>
                <div class="basic">
                    <Row style="margin-bottom:6px;">
                        <Col :sm="8">
                            发货方式：
                            <span v-if="formData.delivery !== null" v-text="deliveryModeChange(formData.delivery.delivery_mode)"></span>
                            <span v-else>暂无</span>
                        </Col>
                        <Col :sm="8">
                            确认发货：
                            <span  v-if="formData.delivery !== null" v-text="deliveryStatusChange(formData.delivery.delivery_status)"></span>
                            <span v-else>暂无</span>
                        </Col>
                        <Col :sm="8">
                            确认时间：
                            <span v-if="toNumber(formData.confirm_delivery_time) !== 0" v-text="formData.confirm_delivery_time"></span>
                            <span v-else>暂无</span>
                        </Col>
                    </Row>
                    <Row style="margin-bottom:6px;">
                        <Col :sm="8">
                            缺货信息：
                            <span v-if="formData.delivery !== null && formData.delivery.shortage_info !== ''" v-text="formData.delivery.shortage_info"></span>
                            <span v-else>暂无</span>
                        </Col>
                    </Row>
                    <Row style="margin-bottom:6px;">
                        <Col :sm="8">
                            其他异常：
                            <div v-if="formData.delivery !== null &&  formData.delivery.remark !== ''">
                                <span v-text="formData.delivery.remark"></span>
                            </div>
                            <span v-else>暂无</span>
                        </Col>
                    </Row>
                    <Row style="margin-bottom:6px;">
                        <Col :sm="24">
                            下载出货单：<a @click="downLoad"  style="color:#5cadff"><Icon type="ios-paper" color="#515a6e" /> 出货单</a>
                        </Col>
                    </Row>
                    <Row style="margin-bottom:6px;">
                        <Col :sm="24">
                            下载物流单：
                            <div v-if="isFileItemsHasLength()" style="display: inline-block">
                                <a :href="downUrl" target="_blank" style="color:#5cadff"><Icon type="ios-paper" color="#515a6e"/>物流单</a>
                            </div>
                            <span v-else>暂无</span>
                        </Col>
                    </Row>

                </div>
            </Row>
            <Row class="border-row" v-if="formData.invalid_person != '' ">
                <div class="title">作废信息</div>
                <div class="basic">
                    <Row style="margin-bottom:6px;margin-top:20px">
                        <Col :sm="8">
                            作废人：
                            <span v-if="formData.invalid_person !== null" v-text="formData.invalid_person"></span>
                            <span v-else>暂无</span>
                        </Col>
                        <Col :sm="8">
                            作废时间：
                            <span  v-if="formData.invalid_at !== null" v-text="timestampToTime(formData.invalid_at)"></span>
                            <span v-else>暂无</span>
                        </Col>
                        <Col :sm="8">
                            作废说明：
                            <span v-if="formData.invalid_reason !== null &&  formData.invalid_reason !== ''">
                                <span v-text="formData.invalid_reason"></span>
                            </span>
                            <span v-else>暂无</span>
                        </Col>
                    </Row>
                </div>
            </Row>
            <PolicyDetail ref="policyDetail"/>
        </Card>
      </div>
</template>
<script>
import { SERVER_BASE_URL } from '~/api/config';
import PolicyDetail from '../my-components/policy-detail-modal';
export default {
    components:{
        PolicyDetail
    },
    data () {
        return {
            showImgUrl: '',
            spinLoading: true,
            queryId: '',
            formData: {
                orderFile: [],
                created_at: '',
                facade: {
                    length: 0
                },
                delivery_mode: '',
                delivery: {},
                auditLogItems: [

                ],
                receivable: {
                    created_at: '',
                    update_at: ''
                }
            },
            formRules: {},
            buttonLoading: false,
            isDisabled: false,
            statusList: [
                { value: 'OrderWorkflow/auditPending', label: '待初审' },
                { value: 'OrderWorkflow/auditFailure', label: '初审未通过' },
                { value: 'OrderWorkflow/auditRecheckPending', label: '待复审' },
                { value: 'OrderWorkflow/auditRecheckFailure', label: '复审未通过' },
                { value: 'OrderWorkflow/auditRecheckPass', label: '复审通过' }
            ],
            auditLogInfo: {
                manager: {},
                director: {}
            },
            modalType: '',
            baseList: [],
            categoryList: [],
            productList: [],
            backPointList: [],
            giftList: [],
            policyNameLists: [],
            policyNameLoading: false,
            originTable:{
              // 满赠清单来源:
              categoryList:[{label:'类目',value:'category'},{label:'商品',value:'product'}], 
            },
            // 审核结果
            auditStatusList: [
                {key: '1', value: '通过'},
                {key: '0', value: '不通过'}
            ],
            // 付款方式
            paymentMethodList: [
                {key: 'monthly', value: '月结'},
                {key: 'spot_cash', value: '现款现货'},
                {key: 'spotCash', value: '现款现货'},
                {key: 'real_sale', value: '实销实结'},
                {key: 'realSale', value: '实销实结'}
            ],
            // 订单来源
            orderFormList: [
                {key: 'MiniProgram', value: '小程序'},
                {key: 'backstage', value: '后台'}
            ],
            // 收款状态
            receivablesStatusList: [
                {key: 'unpaid', value: '未付款'},
                {key: 'paid', value: '已付款'},
                {key: 'wait_receipt', value: '待收款'},
                {key: 'receipt', value: '已收款'}
            ],
            // 发货信息-发货方式
            deliveryModeList: [
                {key: 'express', value: '快递'},
                {key: 'logistics', value: '物流'}
            ],
            // 发货信息-发货状态（确认发货）
            deliveryStatusList: [
                {key: 'delivery_pending_notice', value: '待通知发货'},
                {key: 'delivery_pending', value: '待发货'},
                {key: 'delivery_finish', value: '已发货'}
            ],
            productColumns: {
                order: [
                    {
                        title: '产品名称',
                        key: 'pro_name',
                        align: 'center',
                        minWidth: 210
                    },
                    {
                        title: '规格',
                        key: 'standard',
                        align: 'center',
                        minWidth: 120
                    },
                    {
                        title: '单位',
                        key: 'unit',
                        align: 'center',
                        minWidth: 80
                    },
                    {
                        title: '零售价',
                        key: 'price',
                        align: 'center',
                        minWidth: 150
                    },
                    {
                        title: '折扣',
                        key: 'discount',
                        align: 'center',
                        minWidth: 80
                    },
                    {
                        title: '订货数量',
                        key: 'number',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '订货应收',
                        key: 'total_price',
                        align: 'center',
                        minWidth: 150
                    },
                    {
                        title: '条码',
                        key: 'barcode',
                        align: 'center',
                        minWidth: 200
                    },
                    {
                        title: '箱规',
                        key: 'box_standard',
                        align: 'center',
                        minWidth: 80
                    }
                ],
                backPoint: [
                    {
                        title: '产品名称',
                        key: 'pro_name',
                        align: 'center',
                        minWidth: 210
                    },
                    {
                        title: '规格',
                        key: 'standard',
                        align: 'center',
                        minWidth: 120
                    },
                    {
                        title: '单位',
                        key: 'unit',
                        align: 'center',
                        minWidth: 80
                    },
                    {
                        title: '零售价',
                        key: 'price',
                        align: 'center',
                        minWidth: 150
                    },
                    {
                        title: '折扣',
                        align: 'center',
                        minWidth: 80,
                        render: (h, params) => {
                            return h('div', '-');
                        }
                    },
                    {
                        title: '订货数量',
                        key: 'number',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '返点货值',
                        align: 'center',
                        minWidth: 150,
                        render: (h, params) => {
                            return h('div', params.row.number * params.row.price)
                        }
                    },
                    {
                        title: '条码',
                        key: 'barcode',
                        align: 'center',
                        minWidth: 200
                    },
                    {
                        title: '箱规',
                        key: 'box_standard',
                        align: 'center',
                        minWidth: 80
                    }
                ],
                gift: [
                    {
                        title: '来源',
                        key: 'object_name',
                        align: 'center',
                        minWidth: 80,
                        render: (h, params) => {
                          let text = ""
                          this.originTable.categoryList.forEach(item => {
                            if(params.row.object_name === item.value){
                              text = item.label
                            }
                          })
                          return h('div', text);
                        }
                    },
                    {
                        title: '产品名称',
                        key: 'pro_name',
                        align: 'center',
                        minWidth: 210
                    },
                    {
                        title: '规格',
                        key: 'standard',
                        align: 'center',
                        minWidth: 120
                    },
                    {
                        title: '单位',
                        key: 'unit',
                        align: 'center',
                        minWidth: 80
                    },
                    {
                        title: '零售价',
                        key: 'price',
                        align: 'center',
                        minWidth: 150
                    },
                    {
                        title: '折扣',
                        align: 'center',
                        minWidth: 80,
                        render: (h, params) => {
                            return h('div', '-');
                        }
                    },
                    {
                        title: '满赠数量',
                        key: 'number',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '返点货值',
                        align: 'center',
                        minWidth: 150,
                        render: (h, params) => {
                            return h('div', params.row.number * params.row.price)
                        }
                    },
                    {
                        title: '条码',
                        key: 'barcode',
                        align: 'center',
                        minWidth: 200
                    },
                    {
                        title: '箱规',
                        key: 'box_standard',
                        align: 'center',
                        minWidth: 80
                    }
                ],
                repurchase: [
                    {
                        title: '产品名称',
                        key: 'pro_name',
                        align: 'center',
                        minWidth: 210
                    },
                    {
                        title: '规格',
                        key: 'standard',
                        align: 'center',
                        minWidth: 120
                    },
                    {
                        title: '单位',
                        key: 'unit',
                        align: 'center',
                        minWidth: 80
                    },
                    {
                        title: '零售价',
                        key: 'price',
                        align: 'center',
                        minWidth: 150
                    },
                    {   
                        key: 'discount',
                        title: '换购折扣',
                        align: 'center',
                        minWidth: 80
                    },
                    {
                        title: '订货数量',
                        key: 'number',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '换购应收',
                        align: 'center',
                        minWidth: 150,
                        render: (h, params) => {
                            return h('div', +params.row.total_price)
                        }
                    },
                    {
                        title: '条码',
                        key: 'barcode',
                        align: 'center',
                        minWidth: 200
                    },
                    {
                        title: '箱规',
                        key: 'box_standard',
                        align: 'center',
                        minWidth: 80
                    }
                ],
                matching: [
                    {
                        title: '产品名称',
                        key: 'pro_name',
                        align: 'center',
                        minWidth: 210
                    },
                    {
                        title: '规格',
                        key: 'standard',
                        align: 'center',
                        minWidth: 120
                    },
                    {
                        title: '单位',
                        key: 'unit',
                        align: 'center',
                        minWidth: 80
                    },
                    {
                        title: '零售价',
                        key: 'price',
                        align: 'center',
                        minWidth: 150
                    },
                    {
                        title: '折扣',
                        align: 'center',
                        minWidth: 80,
                        render: (h, params) => {
                            return h('div', '-');
                        }
                    },
                    {
                        title: '订货数量',
                        key: 'number',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '配赠货值',
                        align: 'center',
                        minWidth: 150,
                        render: (h, params) => {
                            return h('div', +params.row.total_price)
                        }
                    },
                    {
                        title: '条码',
                        key: 'barcode',
                        align: 'center',
                        minWidth: 200
                    },
                    {
                        title: '箱规',
                        key: 'box_standard',
                        align: 'center',
                        minWidth: 80
                    }
                ]
            },
            downUrl: '',
            logData: { // 日志
                data: [],
                loading: false
            },
            fetchDataLoading: true,
        };
    },
    mounted () {
        let id = this.$route.query.id;
        if (id) {
            this.queryId = id;
            // 获取订单详情
            this.fetchData(id);
        };
    },
    methods: {
        showOrderFile(file) {
          let url = SERVER_BASE_URL + '/' + file.url
          let a = document.createElement('a')
          a.setAttribute('id', 'openFile')
          a.setAttribute('href', url)
          a.setAttribute('target', '_blank')
          // a.setAttribute('openFile', url.split('/').pop()) //分割路径，取出最后一个元素 点击自动下载文件失灵时启用
          if (document.getElementById('openFile')) {
            document.body.removeChild(document.getElementById('openFile'))
          }
          document.body.appendChild(a)
          a.click()
        },
        // 返回
        submitForm () {
            this.$store.commit('removeTag', this.$route.name);
            if (this.$route.query.redirect) {
                this.$router.push({ path: `/receipt/${this.$route.query.redirect}` });
            } else {
                // this.$router.push({ path: '/order-management/review' });
                this.$router.go(-1);
            }
        },
        completeZero (n) {
            return n < 10 ? '0' + n : n;
        },
        // 时间戳转换为日期格式
        timestampToTime (timestamp) {
            if (timestamp && timestamp > 0) {
                let date = new Date(timestamp * 1000);// 时间戳为10位需*1000，时间戳为13位的话不需乘1000
                let Y = date.getFullYear() + '-';
                let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                let D = this.completeZero(date.getDate()) + ' ';
                let h = this.completeZero(date.getHours()) + ':';
                let m = this.completeZero(date.getMinutes()) + ':';
                let s = this.completeZero(date.getSeconds());
                return Y + M + D + h + m + s;
            }
        },
        // 审核信息-审核结果 转化
        auditStatusChange (status) {
            for (let i in this.auditStatusList) {
                if (status == this.auditStatusList[i].key) {
                    return this.auditStatusList[i].value;
                }
            }
        },
        // 商家信息-付款方式 转化
        paymentMethodChange (status) {
            for (let i in this.paymentMethodList) {
                if (status == this.paymentMethodList[i].key) {
                    return this.paymentMethodList[i].value;
                }
            }
        },
        // 订单号-订单来源 转化
        orderFormChange (status) {
            for (let i in this.orderFormList) {
                if (status == this.orderFormList[i].key) {
                    return this.orderFormList[i].value;
                }
            }
        },
        // 收款信息-收款状态 转化
        receivablesStatusChange (status) {
            for (let i in this.receivablesStatusList) {
                if (status == this.receivablesStatusList[i].key) {
                    return this.receivablesStatusList[i].value;
                }
            }
        },
        // 发货信息-发货方式 转化
        deliveryModeChange (status) {
            for (let i in this.deliveryModeList) {
                if (status == this.deliveryModeList[i].key) {
                    return this.deliveryModeList[i].value;
                }
            }
        },
        // 发货信息-发货状态（确认发货）转化
        deliveryStatusChange (status) {
            for (let i in this.deliveryStatusList) {
                if (status == this.deliveryStatusList[i].key) {
                    return this.deliveryStatusList[i].value;
                }
            }
        },
        // 转化数字
        toNumber (json) {
            if (json === null || json === undefined) {
                return 0;
            } else {
                let a = parseInt(json);
                return a;
            }
        },
        // 启用状态转化
        formatIsOpen (isOpen) {
            return isOpen === '0' ? '否' : '是';
        },
        // 时间转化
        formatDate (time) {
            return this.$format(time, 'yyyy-MM-dd hh:mm');
        },
        // 折扣比例转化
        formatProportion (num) {
            return num * 100 + '%';
        },
        // 日志
        getLog () {
            this.logData.loading = true;
        },
        // 获取订单详情
        fetchData (id) {
            this.$api.orderReviewDetails(id)
                .then(res => {
                    this.fetchDataLoading = false;
                    if (res.code == 0) {
                        this.spinLoading = true;
                        this.formData = res.data;
                        if (!this.formData.delivery) {
                            // this.formData.delivery = {
                            //     delivery_status: '',
                            //     confirm_delivery_time: 0
                            // };
                        } else {
                            // 确认发货时间
                            this.formData.confirm_delivery_time = this.timestampToTime(this.formData.delivery.confirm_delivery_time);
                        }
                        // 订单号的下单时间&创建时间
                        this.formData.order_time = this.timestampToTime(this.formData.order_time);
                        this.formData.created_at = this.timestampToTime(this.formData.created_at);
                        // 商家详细地区地址
                        this.formData.receiving_address = this.formData.province + this.formData.city + this.formData.county + ' ' + this.formData.receiving_address
                        // 收货地址的联系人与联系电话
                        for(let i in this.formData.contractorReceivingAddrGroup ){
                          let new_address = this.formData.contractorReceivingAddrGroup[i].province + this.formData.contractorReceivingAddrGroup[i].city + this.formData.contractorReceivingAddrGroup[i].county + ' ' + this.formData.contractorReceivingAddrGroup[i].receiving_address
                          if(this.formData.contractorReceivingAddrGroup[i].id == this.formData.contractor_receiving_addr_group_id){
                            this.formData.contact_phone = this.formData.contractorReceivingAddrGroup[i].contact_information
                            this.formData.contact_name = this.formData.contractorReceivingAddrGroup[i].contact
                          }
                        }
                        // 收款信息
                        this.formData.receipt_submission_at = this.timestampToTime(this.formData.receipt_submission_at);
                        this.formData.collection_completion_at = this.timestampToTime(this.formData.collection_completion_at);
                        if (this.isFileItemsHasLength()) {
                            if (this.formData.delivery.fileItems !== '') {
                                for (let i in this.formData.delivery.fileItems) {
                                    this.downUrl = `${SERVER_BASE_URL}` + '/' + this.formData.delivery.fileItems[i].url;
                                }
                            }
                        }
                    }
                    this.getAgreeDetail(res.data.contract_policy_id);
                });
        },
        // 出货单下载
        downLoad () {
        
            this.$api.orderDeliveryExport(this.queryId)
          
                .then(res => {
                    if (res.code == 0) {
                        window.location.href = res.data.url;
                        this.$Message.success(res.message);
                    } else {
                        this.$Message.error(res.message);
                    }
                });
        },
        // 判断fileitems是否为空
        isFileItemsHasLength () {
            if (this.formData.delivery == null) {
                return false;
            } else {
                if (this.formData.delivery.fileItems === null) {
                    return false;
                } else {
                    if (this.formData.delivery.fileItems === '') {
                        return false;
                    } else {
                        if (this.formData.delivery.fileItems !== undefined&&this.formData.delivery.fileItems.length > 0) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }
            }
        },
        // 物流单下载
        downLoadDelivery () {
            if (this.formData.delivery !== null) {
                let d = this.formData.delivery.fileItems[0].url;
                window.location.href = `${SERVER_BASE_URL}` + '/' + d;
            } else {
                this.$Message.warning('暂无物流信息');
            }
        },
        addItem (index) {
            this.productIndex++;
            this.product.push({
                index: this.productIndex
            });
        },
        removeItem (index) {
            this.product.splice(index, 1);
        },
        findAuditStatus (json) {
            for (let i in this.statusList) {
                if (json == this.statusList[i].value) {
                    return this.statusList[i].label;
                }
            }
        },
        // 获取合同政策
        getAgreeDetail (id) {
            this.agreementDetailLoading = true;
            this.$api.getContractPoliceDetail(id)
                .then(res => {
                    this.agreementDetailLoading = false;
                    if (res.code === 0) {
                        let giftArr = res.data.giftDiscount.sort(function (a, b) { return a.starting_amount - b.starting_amount; });
                        let result = [];
                        giftArr.forEach((item) => {
                            let findResult = result.find(resultItem => resultItem.starting_amount === item.starting_amount);
                            if (findResult) {
                                findResult.list.push(item);
                            } else {
                                result.push({ starting_amount: item.starting_amount, list: [item] });
                            }
                        });
                        res.data.giftArr = result;
                        this.agreementDetail = res.data;
                    }
                });
        },
        openPolicyDetail() {
            this.$refs.policyDetail.getAgreeDetail(this.formData.contract_policy_id)
        }
    }

};
</script>
<style lang="less" scoped>
    .border-row {
        margin-bottom:20px;
        padding-bottom: 10px;
        border: 1px solid rgb(233,233,233);
        .add-table-list {
            padding: 30px 10px 40px;
            .header {
                margin-bottom: 10px;
            }
            .content {
                margin-bottom: 10px;
            }
        }
    }
    .border-row .title {
        height: 50px;
        line-height: 50px;
        padding-left: 10px;
        font-size: 18px;
        color: #000;
        background-color: rgb(250,250,250);
        border-bottom: 1px solid rgb(233,233,233);
    }
    .border-row .basic p{
        margin-bottom:4px;
        padding-left: 5px;
        padding-right: 5px;
    }
    .border-row .basic {
        padding: 10px;
    }
    .border-row .basic li{
        padding: 5px 0;
        color: #515a6e;
        font-size:14px;
        list-style: none;
    }
    .border-span {
        border: 1px dashed rgb(221, 222, 225);
        border-radius: 5px;
        padding: 10px 15px 20px;
    }
    .address {
        margin-bottom: 20px;
    }
    .demo-spin-container{
        display: inline-block;
        width: 200px;
        height: 100px;
        position: relative;
        border: 1px solid #eee;
    }
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
    .order-count{
        position: absolute;
        right: 3rem;
        top: 0;
    }
</style>
