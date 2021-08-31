<template>
    <Form ref="formData" id="form-data" :model="formData.data" label-position="top">
        <Card>
            <Row slot="title" style="text-align:right;">
                <Button type="success" :loading="buttonLoading" @click="submitForm('formData')" >提交</Button>
            </Row>
            <Row type="flex" justify="space-between">
                <Col :md="5">
                    <FormItem label="订单编号">
                        <Input v-model="formData.data.order_sn" disabled></Input>
                    </FormItem>
                </Col>
                <Col :md="5">
                    <FormItem label="审核状态">
                        <Input v-model="translateStatus[formData.data.status]" disabled></Input>
                    </FormItem>
                </Col>
                <Col :md="5">
                    <FormItem label="收款状态">
                        <Input v-model="translateReceiveStatus[formData.data.receivables_status]" disabled></Input>
                    </FormItem>
                </Col>
                <Col :md="5">
                    <FormItem label="付款时间">
                        <Input v-if="formData.data.collection_completion_at != 0" v-model="formData.data.collection_completion_at" disabled></Input>
                        <Input v-else value="暂无" disabled></Input>
                    </FormItem>
                </Col>
            </Row>
            <Row type="flex" justify="space-between">
                <Col :md="5">
                    <FormItem label="发货状态">
                        <Input v-if="formData.data.delivery" v-model="translateDeliveryStatus[formData.data.delivery.delivery_status]" disabled></Input>
                        <Input v-else value="暂无" disabled></Input>

                    </FormItem>
                </Col>
                <Col :md="5">
                    <FormItem label="导单状态">
                        <Input v-if="formData.data.delivery" v-model="translateDisposeStatus[formData.data.delivery.dispose_status]" disabled></Input>
                        <Input v-else value="暂无" disabled></Input>
                    </FormItem>
                </Col>
                <Col :md="5">
                    <FormItem label="订单来源">
                        <Input v-model="translateOrderForm[formData.data.order_form]" disabled></Input>
                    </FormItem>
                </Col>
                <Col :md="5">
                    <FormItem label="订单金额">
                        <Input v-model="formData.data.total_order_amount" disabled></Input>
                    </FormItem>
                </Col>
            </Row>
            <Row type="flex" justify="space-between">
                <Col :md="5">
                    <FormItem label="商家名称">
                        <Input v-model="formData.data.merchant_name" disabled></Input>
                    </FormItem>
                </Col>
                <Col :md="5">
                    <FormItem label="可退款金额">
                        <Input v-model="formData.data.total_order_amount" disabled></Input>
                    </FormItem>
                </Col>
                <Col :md="5">
                    <FormItem label="退款申请人">
                        <Input v-model="formData.data.name" disabled></Input>
                    </FormItem>
                </Col>
                <Col :md="5"></Col>
            </Row>
            <Row>
                <Col :md="12">
                    <FormItem label="退款理由" prop="opinion"
                              :rules="{required: true, message: '该选项不能为空', trigger: 'blur'}">
                        <Input v-model="formData.data.opinion" placeholder="订单已审核通过，商家无法线上退款，由助理确认尚未发货，可以发起退款。"></Input>
                    </FormItem>
                </Col>
            </Row>
            <Row class="margin-top-20">
                <Col :md="24">
                    <p class="warn">注意事项：</p>
                    <p class="warn">订单退款申请完成后，审核状态将变为已取消，收款状态变为已取消，将显示在【订单作废/取消】列表中，从而无法进行发货和导单，请确保退款申请前，该商家订单未进行发货；</p>
                </Col>
            </Row>
            <Spin fix v-show="loading"></Spin>
        </Card>
    </Form>
</template>
<script>
    import Cookies from 'js-cookie'
    export default {
        name: 'order-apply',
        data () {
            return {
                queryId: '',
                type: '',
                loading: false,
                formData: {
                    modal: false,
                    type: '',
                    title: '--',
                    subTitle: '退款理由',
                    data: {
                        opinion: '',
                        number: '',
                        type: '',
                        fileItems: []
                    }
                },
                buttonLoading: false,
                translateStatus: {
                    'OrderWorkflow/auditPending': '待审核',
                    'OrderWorkflow/auditFailure': '审核失败',
                    'OrderWorkflow/auditRecheckPending': '待复审',
                    'OrderWorkflow/auditRecheckPass': '复审通过',
                    'OrderWorkflow/auditRecheckFailure': '复审失败'
                },
                translateReceiveStatus: {
                    unpaid: '未付款',
                    paid: '已付款',
                    wait_receipt: '待收款',
                    receipt: '已收款'
                },
                translateDeliveryStatus: {
                    delivery_pending_notice: '待通知发货',
                    delivery_pending: '待发货',
                    delivery_finish: '已发货'
                },
                translateDisposeStatus: {
                    undisposed: '未处理',
                    disposed: '已处理',
                    exception_handling: '异常处理'
                },
                translateOrderForm: {
                    MiniProgram: '小程序',
                    backstage: '后台'
                }
            };
        },
        methods: {
            // 提交
            submitForm (name) {
                this.$refs[name].validate((valid) => {
                    if (!valid) {
                        this.$Message.error('请填写退款理由')
                        return false;
                    }
                    this.buttonLoading = true;
                    let params = {
                        id: this.queryId,
                        reason: this.formData.data.opinion
                    };

                    this.$api.orderRefundAdd(params)
                        .then(res => {
                            this.buttonLoading = false;
                            if (res.code == 0) {
                                this.$Message.success('编辑成功');
                                this.$store.commit('removeTag', this.$route.name);
                                this.$router.push({
                                    path: '/order-management/order-refund'
                                })
                            }
                        }).finally(() => {
                            this.buttonLoading = false;
                        });

                });
            },
            // 获取详情
            fetchData (id) {
                this.loading = true
                this.$api.orderReviewDetails(id)
                    .then(res => {
                        this.loading = false;
                        if (res.code == 0) {
                            this.formData.data = res.data;
                            let name = Cookies.get('real_name');
                            if (name) {
                                this.formData.data.name = name;
                            }
                        }
                    });
            }
        },
        mounted () {
            let id = this.$route.query.id;
            this.type = this.$route.query.type
            if (id) {
                this.queryId = id;
                this.fetchData(id);

            }

        }
    };
</script>

<style lang="less" scoped>
   .warn{
       font-size: 12px;
       color: #ed4014;
   }
</style>
