<template>
    <Form ref="formData" :model="formData" :rules="formRules" label-position="left">
        <Card>
            <Row slot="title" style="text-align:right;">
                <Button type="success" :loading="buttonLoading" @click="submitForm('formData')" :disabled="isDisabled">提交</Button>
            </Row>
            <Row type="flex">
                <Col span="23" class="border-row">
                    <div class="title">订单</div>
                    <div class="basic">
                        <Row v-for="(item, index) in checkInfo" :key="index">
                            <Col :sm="8" :xs="24">
                                <FormItem label="订单号" :label-width="90">
                                    <Input v-model="item.order_sn" disabled></Input>
                                </FormItem>
                            </Col>
                            <Col :sm="8" :xs="24">
                                <FormItem label="合作商" :label-width="90">
                                    <Input v-model="item.merchant_name" disabled></Input>
                                </FormItem>
                            </Col>
                            <Col :sm="8" :xs="24">
                            <FormItem label="订单金额" :label-width="90">
                                <Input v-model="item.total_order_amount" disabled></Input>
                            </FormItem>
                            </Col>
                        </Row>
                    </div>
                </Col>
                <Col span="1"></Col>
            </Row>
            <Row type="flex" v-for="(item, indexReceipt) in formData.receipt" :key="indexReceipt">
                <Col span="23" class="border-row">
                    <div class="title">收款申请</div>
                    <div class="basic">
                        <Row>
                            <Col :sm="8" :xs="24">
                                <FormItem label="申请人：" :label-width="90">
                                    <Input v-model="item.created_by" disabled></Input>
                                </FormItem>
                            </Col>
                            <Col :sm="8" :xs="24">
                                <FormItem label="申请部门：" :label-width="90">
                                    <Input v-model="item.dept_name" disabled></Input>
                                </FormItem>
                            </Col>
                            <Col :sm="8" :xs="24">
                                <FormItem label="项目：" :prop="'receipt.' + indexReceipt + '.product'" :rules="{required: true, message: '该选项不能为空！', trigger: 'blur'}" :label-width="90">
                                    <Input v-model="item.product" placeholder="请输入项目名称"></Input>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col :sm="8" :xs="24">
                                <FormItem label="汇款户名：" :prop="'receipt.' + indexReceipt + '.remittance_name'" :rules="{required: true, message: '该选项不能为空！', trigger: 'blue', type:'string'}" :label-width="90">
                                    <AutoComplete
                                    :value="item.remittance_name"
                                    @on-search="v=> {queryRemittanceName(v, indexReceipt, 'name')}"
                                    @on-change="v => {getRemittanceName(v, indexReceipt, 'name')}"
                                    @on-select="v => {getRemittanceName(v, indexReceipt, 'name')}"
                                    placeholder="请输入汇款户名"
                                    style="">
                                        <Option v-for="(item,index) in queryremittanceNameList" :value="item.name" :key="'rename' + index">{{ item.name }}</Option>
                                    </AutoComplete>
                                </FormItem>
                            </Col>
                            <Col :sm="8" :xs="24">
                                <FormItem label="汇款账号：" :prop="'receipt.' + indexReceipt + '.remittance_account'" :rules="{required: true, message: '该选项不能为空！', trigger: 'blur'}" :label-width="90">
                                    <AutoComplete
                                    :value="item.remittance_account"
                                    @on-search="v=> {queryRemittanceName(v, indexReceipt, 'account')}"
                                    @on-change="v => {getRemittanceName(v, indexReceipt, 'account')}"
                                    @on-select="v => {getRemittanceName(v, indexReceipt, 'account')}"
                                    placeholder="请输入汇款账号">
                                        <Option v-for="(item,index) in queryremittanceNameList" :value="item.name" :key="'rename' + index">{{ item.account }}</Option>
                                    </AutoComplete>
                                </FormItem>
                            </Col>
                            <Col :sm="8" :xs="24">
                                <FormItem label="汇入方式：" :prop="'receipt.' + indexReceipt + '.import_mode'" :rules="{required: true, message: '该选项不能为空！', trigger: 'blur'}" :label-width="90">
                                    <Select v-model="item.import_mode" style="width:200px"  @on-change="(val) => { changePayType(val, item) }">
                                        <Option v-for="item in importType" :value="item.type" :key="item.type">{{ item.type }}</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col :sm="8" :xs="24">
                                <FormItem label="汇入户名：" :prop="'receipt.' + indexReceipt + '.import_name'" :rules="{required: true, message: '该选项不能为空！', trigger: 'blur'}" :label-width="90">
                                    <Input v-model="item.import_name" disabled placeholder="请输入汇入户名"></Input>
                                </FormItem>
                            </Col>
                            <Col :sm="8" :xs="24">
                                <FormItem label="汇入账号：" :prop="'receipt.' + indexReceipt + '.import_account'" :rules="{required: true, message: '该选项不能为空！', trigger: 'blur'}" :label-width="90">
                                    <div v-if="item.import_mode === '支付宝'" >{{item.import_account}}</div>
                                    <Select v-if="item.import_mode === '工商银行'" v-model="item.import_account" style="width:200px">
                                        <Option value="3602015009201434295">3602015009201434295</Option>
                                        <Option value="3602089119200082690">3602089119200082690</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col :sm="8" :xs="24">
                                <FormItem label="汇入金额："
                                :prop="'receipt.' + indexReceipt + '.import_amount'"
                                :rules="[
                                        {required: true, type: 'string', message: '该选项不能为空', trigger: 'change'},
                                        {
                                            validator(rule, value, callback) {
                                                const errors = [];
                                            if(value === '') {
                                                callback('该选项不能为空');
                                            }else if (!/^\d+(\.\d+)?$/.test(value)){
                                                callback('该选项为小数或者整数');
                                            }else {
                                                callback(errors)
                                            }}
                                        }]"
                                :label-width="90"
                                >
                                    <Input v-model="item.import_amount" placeholder="请输入汇入金额："></Input>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col :sm="8" :xs="24">
                                <FormItem label="汇入时间：" :prop="'receipt.' + indexReceipt + '.import_at'" :rules="{required: true, message: '该选项不能为空！', trigger: 'change', type: 'date'}" :label-width="90">
                                    <DatePicker v-model="item.import_at" type="date" style="width: 200px" placeholder="请选择汇入时间"></DatePicker>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col :sm="8" :xs="24">
                                <FormItem label="上传凭证" :rules="{required: true, message: '该选项不能为空！', trigger: 'blur'}" :label-width="90">
                                    <Upload @click.native="limtUpload(indexReceipt)" name="UploadForm[file]" :action="fileUploadMaterial" :headers="fileUploadHeaders"
                                            :default-file-list="formData.receipt[indexReceipt].fileItems"
                                            :max-size="51200"
                                            :before-upload="beforeUpload"
                                            :on-success="importSuccess"
                                            :on-progress="importProgress"
                                            :on-remove="prepareRemove"
                                            :on-preview="previewUpload"
                                            :on-exceeded-size="fileMaxSize"
                                            :on-format-error="fileFormatError"
                                            style="margin-left:1px;display:inline-block">
                                        <Button icon="md-add"></Button>
                                    </Upload>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col :sm="8" :xs="24">
                                <FormItem label="备注：" :label-width="90">
                                    <Input v-model="item.remark" placeholder="请输入备注"></Input>
                                </FormItem>
                            </Col>
                        </Row>
                    </div>
                </Col>
                <Col span="1">
                    <Button v-if="indexReceipt > 0" icon="md-remove" @click="removeItem(indexReceipt)"></Button>
                    <Button v-else icon="md-add" @click="addItem(indexReceipt)"></Button>
                </Col>
            </Row>
        </Card>
    </Form>
</template>

<script>
import Cookies from 'js-cookie'
import { SERVER_BASE_URL } from '~/api/config';
export default {
    data () {
        return {
            // 提交表单数据
            formData: {
                receipt: [
                    {
                        index: 0,
                        fileItems: [],
                        import_name: '广州慕可生物科技有限公司'
                    }
                ]
            },
            // 控制收款申请数量
            indexAdd: 0,
            // 表单规则
            formRules: {},
            // 提交按钮loading
            buttonLoading: false,
            // 提交按钮是否禁止
            isDisabled: false,
            // 汇入方式
            importType: [
                { type: '支付宝' },
                { type: '工商银行' }
            ],
            fileUploadHeaders: {
                Authorization: Cookies.get('authorization')
            },
            fileUploadMaterial: `${SERVER_BASE_URL}/v1/upload`,
            // 表单id多个 字符串
            checkInfo: [],
            // 限制上传文件件数的状态
            upStatus: true,
            // 获取点击上传按钮位置
            receiptIndex: 0,
            remittanceNameLoading: false,
            queryremittanceNameList:[]
        };
    },
    methods: {
        /**
         * 表单提交
         * @param {String} name：表单名称
         */
        fetchData (id) {
            this.$api.receiptMonthlyDouble(id)
                .then(res => {
                    if (res.code === 0) {
                        let data = {};
                        data = {
                            order_sn: res.data.order_sn,
                            merchant_name: res.data.merchant_name,
                            total_order_amount: res.data.total_order_amount,
                            receipt: [{
                                created_by: res.data.created_by,
                                fileItems: [],
                                import_name: '广州慕可生物科技有限公司'
                            }]
                        };
                        this.formData = data;
                        this.$api.loginMessage()
                            .then(res => {
                                if (res.code === 0) {
                                    this.$set(this.formData.receipt[0], 'dept_name', res.data.dept_name);
                                }
                            });
                    }
                });
        },
        // 查询汇款户名/汇款账户
        queryRemittanceName (json, currentIndex, remark) {
            this.remittanceNameLoading = true;
            let params = {};
            if (remark === 'name') {
                // 汇款户名
                params = {name: json};
            } else {
                // 汇款账号
                params = {account: json};
            }
            this.queryremittanceNameList = [];
            this.$api.queryRemittanceName(params)
                .then(res => {
                    this.remittanceNameLoading = false;
                    if (res.data.length > 0) {
                        this.queryremittanceNameList = res.data;
                    }
                });
        },
        // 获取汇款户名
        getRemittanceName (json, currentIndex, remark) {
            if (remark === 'name') {
                let formdataReceipt = this.formData.receipt;
                formdataReceipt[currentIndex].remittance_name = json;
                this.$set(this.formData, 'receipt', formdataReceipt);
            } else {
                let formdataReceipt = this.formData.receipt;
                formdataReceipt[currentIndex].remittance_account = json;
                this.$set(this.formData, 'receipt', formdataReceipt);
            }
        },
        submitForm (name) {
            this.$refs[name].validate((valid) => {
                if (!valid) {
                    this.$Message.warning('必选项不能为空!');
                } else {
                    let status = this.formData.receipt.some(n => {
                        return n.fileItems.length === 0;
                    });
                    if (status) {
                        this.$Message.warning('请上传凭证！');
                    } else {
                        let params = {};
                        params = JSON.parse(JSON.stringify(this.formData));
                        let idArr = [];
                        this.checkInfo.forEach(i => {
                            idArr.push(i.id);
                        });
                        params.id = idArr.join();
                        delete params.merchant_name;
                        delete params.order_sn;
                        delete params.total_order_amount;
                        this.buttonLoading = true;
                        this.$api.receiptMonthlyDouble(params)
                            .then(res => {
                                this.buttonLoading = false;
                                if (res.code === 0) {
                                    this.$Message.success(res.message);
                                    this.$router.push({
                                        path: '/receipt/month'
                                    });
                                }
                            });
                    }
                }
            });
        },

        /**
         * 增加收款申请
         */
        addItem () {
            this.indexAdd++;
            this.formData.receipt.push(
                {
                    index: this.indexAdd,
                    fileItems: [],
                    created_by: this.formData.receipt[0].created_by,
                    dept_name: this.formData.receipt[0].dept_name
                });
        },

        /**
         * 删除收款申请
         * @param {Number} index：收款表单位置
         * @return:
         */
        removeItem (index) {
            this.formData.receipt.splice(index, 1);
        },

        /**
         * 上传按钮点击事件 判断上传文件为一件
         * @param {Number} index： 收款表单位置
         * @return:
         */
        limtUpload (index) {
            this.receiptIndex = index;
            if (this.formData.receipt[index].fileItems.length >= 1) {
                this.upStatus = false;
            } else {
                this.upStatus = true;
            }
        },

        /**
         * 文件上传前函数 限制上传一份
         */
        beforeUpload () {
            // if (!this.upStatus) {
            //     this.$Message.warning('限制上传一份凭证！');
            //     return false;
            // }
        },

        /**
         * 上传文件成功
         */
        importSuccess (res, file, index) {
            // 上传成功
            if (res.code === 0) {
                this.$Message.success(res.message);
                let data = res.data;
                this.formData.receipt[this.receiptIndex].fileItems.push(data);
            } else {
                let desc = '';
                if (res.data !== '') {
                    let arr = [];
                    for (let i in res.data) {
                        arr.push((res.data[i]));
                    }
                    desc = JSON.stringify(arr.join());
                } else {
                    desc = res.message;
                }
                this.$Notice.error({
                    title: '导入失败！',
                    desc: res.message
                });
            }
        },

        /**
         * 移除文件列表
         * @param {Object} file：上传回调文件
         */
        prepareRemove (file) {
            setTimeout(() => {
                const fileList = this.formData.receipt[this.receiptIndex].fileItems;
                this.formData.receipt[this.receiptIndex].fileItems.splice(fileList.indexOf(file), 1);
            }, 0);
        },

        /**
         * 预览上传的文件
         * @param {Object} file：上传回调文件
         */
        previewUpload (file) {
            window.open(file.url_show);
        },

        /**
         * 文件的格式验证
         * @param {Object} file：上传回调文件
         */
        fileFormatError (file) {
            this.$Notice.error({
                title: '文件格式错误',
                desc: JSON.stringify(file)
            });
        },

        /**
         * 文件上传限制
         * @param {Object} file：上传回调文件
         */
        fileMaxSize (file) {
            this.$Notice.warning({
                title: '超出文件大小限制',
                desc: '文件 ' + file.name + ' 太大，不能超过 50M。'
            });
        },

        /**
         * 文件上传成功的进度条
         * @param {Object} event：上传回调文件
         * @param {Object} file：上传回调文件
         */
        importProgress (event, file) {
            if (!event) return;
            // 延迟一下，接收有bug
            setTimeout(() => {
                if (file.status === 'fail') {
                    this.$Notice.error({
                        title: '文件异常!'
                    });
                }
            }, 1000);
        },
        // 改变收款方式
        changePayType (type, item) {
            switch (type) {
                case '支付宝':
                    item.import_account = 'wishufu@mu-ke.com';
                    break;
                case '工商银行':
                    item.import_account = '';
                    break;
            }
        }
    },
    mounted () {
        let checkInfo = localStorage.getItem('monthly-order');
        this.checkInfo = JSON.parse(checkInfo);
        /**
         * 获取登录用户信息
         */
        this.$api.loginMessage()
            .then(res => {
                if (res.code === 0) {
                    this.$set(this.formData.receipt[0], 'dept_name', res.data.dept_name);
                    this.$set(this.formData.receipt[0], 'created_by', res.data.real_name);
                }
            });
        // 初始化汇入方式
        // this.$api.queryImportMode()
        //     .then(res => {
        //         this.importType = res.data;
        //     });
    },
    /**
     * 离开页面销毁
     */
    destroyed () {
        localStorage.removeItem('monthly-order');
    }
};
</script>

<style scoped lang="less">
    .border-row {
        margin-bottom:20px;
        border: 1px solid rgb(233,233,233);
    }
    .border-row .title {
        height: 40px;
        line-height: 40px;
        padding-left: 10px;
        font-size: 16px;
        color: #000;
        background-color: rgb(250,250,250);
        border-bottom: 1px solid rgb(233,233,233);
    }
    .border-row .basic {
        padding: 20px;
    }
    .border-span {
        border: 1px dashed rgb(221, 222, 225);
        border-radius: 5px;
        padding: 10px 15px 20px;
    }
    .address {
        margin-bottom: 20px;
    }
    .ivu-upload {
        display: flex !important;
        .ivu-btn-icon-only {
            padding: 20px 25px 20px;
        }
    }
</style>
