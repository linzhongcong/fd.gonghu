<template>
    <Form ref="formData" id="form-data" :model="formData.submitData" label-position="top">
        <Card>
            <Row slot="title" style="text-align:right;">
                <Button type="success" :loading="buttonLoading" @click="submitForm('formData')" >提交</Button>
            </Row>
            <Row type="flex" justify="space-between">
                <Col :md="5">
                    <FormItem label="订单编号">
                        <Input v-model="formData.data.order_sn" disabled ></Input>
                    </FormItem>
                </Col>
                <Col :md="5">
                    <FormItem label="审核状态" prop="num">
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
                    <FormItem label="发货状态" >
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
                    <FormItem label="商家名称" >
                        <Input v-model="formData.data.merchant_name" disabled></Input>
                    </FormItem>
                </Col>
                <Col :md="5">
                    <FormItem label="售后申请人">
                        <Input v-model="formData.data.name" disabled></Input>
                    </FormItem>
                </Col>
                <Col :md="5">
                    <FormItem label="售后类型" prop="service_type"
                              :rules="{required: true, message: '该选项不能为空', trigger: 'change',type: 'array'}">
                        <Select v-model="formData.submitData.service_type" clearable multiple>
                            <Option v-for="item in serviceType" :value="item" :key="item" :label="item"></Option>
                        </Select>
                    </FormItem>
                </Col>
                <Col :md="5">
                    <FormItem label="图片凭证" prop="fileItems"
                              :rules="{required: true, message: '该选项不能为空', trigger: 'change',type:'array'}">
                        <Upload ref="prepareFileUpload"
                                name="UploadForm[file]"
                                :on-progress="ProgressFile"
                                :default-file-list="formData.submitData.fileItems"
                                :on-success="fileSuccess"
                                :on-remove="filePrepareRemove"
                                :on-format-error="fileFormatError"
                                :on-preview="previewUpload"
                                :format="['jpg','jpeg','webp','svg','png','gif','pdf','bmp']"
                                :max-size="51200"
                                :on-exceeded-size="fileMaxSize"
                                type="drag"
                                :action="fileUploadURL"
                                :headers="fileUploadHeaders"
                                style="display: inline-block">
                            <Button type="primary" style="width:100px">上传</Button>
                        </Upload>
                    </FormItem>
                </Col>

            </Row>
            <Row>
                <Col :md="12">
                    <FormItem label="申请售后理由" prop="service_reason"
                              :rules="{required: true, message: '该选项不能为空', trigger: 'blur'}">
                        <Input v-model="formData.submitData.service_reason" placeholder="商家电话联系到缺少货物，由助理帮忙发起售后，请尽快审核，补发相应商品给商家；"></Input>
                    </FormItem>
                </Col>
            </Row>
            <Row class="margin-top-20">
                <Col :md="24">
                    <p class="warn">注意事项：</p>
                    <p class="warn">售后申请服务，请业务员尽量说服商家自行发起申请，否则出现信息不一致等情况后果由业务员自行承担；</p>
                </Col>
            </Row>
            <Spin fix v-show="loading"></Spin>
        </Card>
    </Form>
</template>
<script>
    import Cookies from 'js-cookie'
    import { SERVER_BASE_URL } from '~/api/config';
    export default {
        name: 'order-apply',
        data () {
            return {
                loading: false,
                queryId: '',
                // 文件上传
                fileUploadURL: `${SERVER_BASE_URL}/v1/upload`,
                fileUploadHeaders: {
                    Authorization: Cookies.get('authorization')
                },
                loadingVisible: false,
                formData: {
                    modal: false,
                    type: '',
                    title: '--',
                    subTitle: '退款理由',
                    data: {

                    },
                    submitData: {
                        service_type: '',
                        fileItems: [],
                        service_reason: ''
                    }
                },
                buttonLoading: false,
                isService: false,
                serviceType: ['缺货', '漏货', '损坏', '异物', '换货', '其他'],
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
                        return false;
                    }
                    this.buttonLoading = true;
                    let params = this.formData.submitData;
                    params.id = this.formData.data.id;
                    console.log(params)
                    // return false;
                    this.$api.orderServiceAdd(params)
                        .then(res => {
                            this.buttonLoading = false;
                            if (res.code == 0) {
                                this.$Message.success('编辑成功');
                                this.$store.commit('removeTag', this.$route.name);
                                this.$router.push({
                                    path: '/order-management/order-service'
                                })
                            }
                        }).finally(() => {
                        this.buttonLoading = false;
                    });

                });
            },
            // 文件上传限制
            fileMaxSize (file) {
                this.$Notice.warning({
                    title: '超出文件大小限制',
                    desc: '文件 ' + file.name + ' 太大，不能超过 50M。'
                });
            },
            // 文件格式验证失败
            fileFormatError (file) {
                this.$Notice.error({
                    title: '文件格式错误',
                    desc: '请上传正确的文件格式!'
                });
            },
            // 附件上传进度条
            ProgressFile (event, file) {
                if (!event) return;
                this.isShowProgress = true;
                if (event.percent === 100) {
                    this.isDisabled = false;
                } else {
                    this.isDisabled = true;
                }
                // 延迟一下，接收有bug
                setTimeout(() => {
                    if (file.status === 'fail') {
                        this.$Notice.error({
                            title: '文件上传失败!'
                        });
                    }
                }, 1000);
                if (file.percentage === 100) {
                    this.isShowProgress = false;
                }
                this.isShowProgress = event.percent;
            },
            // 附件文件上传成功
            fileSuccess (res, file) {
                // 上传成功
                this.isShowProgress = false;
                if (res.status) {
                    let data = res.data;
                    this.$Message.success(res.message)
                    this.formData.submitData.fileItems.push(data);
                }
            },
            // 移除附件文件
            filePrepareRemove (file) {
                const fileList = this.formData.data.fileItems;
                this.formData.submitData.fileItems.splice(fileList.indexOf(file), 1);
            },
            previewUpload (file) {
                window.open(file.url);
            },
            // 获取详情
            fetchData (id) {
                this.loading = true;
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
            if (id) {
                this.queryId = id;
                this.fetchData(id);
            }
        }
    };
</script>

<style lang="less" scoped>
    #form-data /deep/ .ivu-upload{
        border:none;
        text-align: left;
    }
   .warn{
       font-size: 12px;
       color: #ed4014;
   }
   .breadth {
       width: 36px;
       height: 36px;
       line-height: 36px;
   }

</style>
