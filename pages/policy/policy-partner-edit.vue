<template>
    <Form ref="formData" :model="formData" :rules="formRules">
        <Card>
            <Row slot="title" style="text-align:right;">
                <Button type="success" :loading="buttonLoading" @click="submitForm('formData')" :disabled="isDisabled">提交</Button>
            </Row>
            <Row class="card-wrap">
                <Col class="card-wrap_R" span="24">
                    <Row>
                        <Col :xs="24" :sm="8">
                            <FormItem label="合作商政策" prop="partner_policy_name">
                                <Input v-model="formData.partner_policy_name" clearable></Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col></Col>
                    </Row>
                    <Row>
                        <Col :xs="24" :sm="10" >
                            <FormItem label="合同政策" prop="partnerPolicyGroup">
                                <Row>
                                    <Col :xs="24" :sm="24" v-for="(item, index) in formData.partnerPolicyGroup" :key="'gift' + index" class="c-policy">
                                        <FormItem>
                                            <Select
                                                    :label="item.contract_policy_name"
                                                    v-model="item.contract_policy_id"
                                                    @keypress.native="isFirst = true"
                                                    @on-open-change="isFirst = true"
                                                    filterable
                                                    remote
                                                    :loading="queryPolicyLoading"
                                                    :remote-method="queryContractPolicyDebonce"
                                                    :label-in-value="true"
                                                    @on-change="v => {getContractPolicy(v, index)}">
                                                    <Option v-for="(option, index) in queryContractPolicyList"
                                                            :key="'queryContractPolicy' + option.contract_policy_id + index"
                                                            :value="option.contract_policy_id"
                                                            :label="option.contract_policy_name"></Option>
                                            </Select>
                                        </FormItem>

                                        <Button v-if="index > 0" icon="md-remove" @click="removeItem(index,'gift')"></Button>
                                        <Button v-else icon="md-add" @click="addItem(index)"></Button>
                                    </Col>
                                </Row>
                            </FormItem>

                        </Col>
                    </Row>
                    <Row>
                        <Col :xs="24" :sm="24">
                            <FormItem label="备注" prop="remark">
                                <Input v-model="formData.remark" type="textarea" placeholder="" />
                            </FormItem>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Card>
    </Form>
</template>
<script>
    export default {
        data () {
            // 验证数组里面的对象不能重复
            const validatePartnerPolicyGroup = (rule, value, callback) => {
                let newArr = []; // 定义去重后的数组为空数组
                let obj = {};
                // 编辑
                for (let i in value) {
                    if (!obj[value[i].contract_policy_id] && value[i].contract_policy_id !== undefined) {
                        newArr.push(value[i]);
                        obj[value[i].contract_policy_id] = true;
                    } else {
                        obj[value[i].contract_policy_id] = false;
                    }
                }
                if (JSON.stringify(value.sort()) == JSON.stringify(newArr.sort())) {
                    callback();
                } else {
                    callback(new Error('请正确填写合同政策！'));
                }
            };
            return {
                isFirst: false, // 判断是否第一次进来
                queryId: '',
                loadingVisible: false,
                queryPolicyLoading: false,
                formData: {
                    partnerPolicyGroup: [
                        {
                            index: '0',
                            contract_policy_name: ''
                        }
                    ]
                },
                policyIndex: 0,
                queryContractPolicyList: [],
                formRules: {
                    partner_policy_name: [
                        { required: true, message: '该选项不能为空', trigger: 'blur' }
                    ],
                    partnerPolicyGroup: [
                        { required: true, validator: validatePartnerPolicyGroup, trigger: 'blur' }
                    ],
                    remark: [
                        { required: false }
                    ]
                },
                buttonLoading: false,
                isDisabled: false, // 判断提交按钮是否为禁止状态(文件上传没有完成时)
                queryContractPolicyDebonce:this.$debonce(this.queryContractPolicy,500)
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
                    let formData = this.formData;
                    if (this.queryId) {
                        // 修改
                        this.$api.policyPartnerEdit(formData)
                            .then(res => {
                                this.buttonLoading = false;
                                if (res.code == 0) {
                                    this.$Message.success(res.message);
                                    this.$router.push({ path: '/policy/policy-partner' });
                                } else {
                                    if (res.data.length > 0) {
                                        for (let i in res.data) {
                                            this.$Message.warning(res.data[i]);
                                        }
                                    } else {
                                        this.$Message.error(res.message);
                                    }
                                }
                            });
                    } else {
                        // 新增
                        this.$api.policyPartnerCreate(formData)
                            .then(res => {
                                this.buttonLoading = false;
                                if (res.code == '0') {
                                    this.$Message.success(res.message);
                                    this.$router.push({ path: '/policy/policy-partner' });
                                } else {
                                    if (res.data.length > 0) {
                                        for (let i in res.data) {
                                            this.$Message.error(res.data[i]);
                                        }
                                    } else {
                                        this.$Message.error(res.message);
                                    }
                                }
                            });
                    }
                });
            },

            // 获取详情
            fetchData (id) {
                this.$api.getPolicyPartnerDetails(id)
                    .then(res => {
                        this.formData = res.data;
                        // this.queryContractPolicyList.push(this.formData.partnerPolicyGroup);

                        this.formData.partnerPolicyGroup.map((item) => {
                            this.queryContractPolicyList.push(item);
                        });
                    });
            },
            // 查询合同政策
            queryContractPolicy (json) {
                if (this.isFirst) {
                    this.queryPolicyLoading = true;
                    let params = {
                        name: json
                    }
                    this.$api.queryContractPolicy(params)
                        .then(res => {
                            this.queryPolicyLoading = false;
                            this.queryContractPolicyList = res.data;
                        });
                }
            },
            // 获取所点击的合同政策
            getContractPolicy (json, currentIndex) {
                this.formData.partnerPolicyGroup[currentIndex].contract_policy_id = json['value'];
                this.formData.partnerPolicyGroup[currentIndex].contract_policy_name = json['label'];
            },
            // 增加合同政策
            addItem (index) {
                this.policyIndex++;
                this.formData.partnerPolicyGroup.push({
                    index: this.policyIndex
                });
            },
            // 删除合同政策选项
            removeItem (index, other) {
                let policyList = this.formData.partnerPolicyGroup;
                policyList.splice(index, 1);
                this.policyIndex = Number(this.formData.partnerPolicyGroup.length) - 1;
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
<style lang="less">
    .c-policy .ivu-form-item{
        display: inline-block;
        width: 70%;
        margin-bottom: 10px;
    }
</style>
