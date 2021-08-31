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
                        <FormItem label="类目名称" prop="name">
                            <Input v-model="formData.name" clearable></Input>
                        </FormItem>
                    </Col>
                    <Col :xs="24" :sm="8">
                        <FormItem label="排序" prop="sort_number">
                            <Input v-model.number="formData.sort_number" clearable placeholder="默认最后"></Input>
                        </FormItem>
                    </Col>
                    <Col :xs="24" :sm="8">
                        <FormItem label="是否显示" prop="status">
                            <Select v-model="formData.status">
                                <Option v-for="(item, index) in enableList" :value="item.label" :key="item.enable + index">{{ item.label }}</Option>
                            </Select>
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
        // 验证排序为大于0的整数
        // const validateSortNumber = (rule, value, callback) => {
        //     if (value === '') {
        //         callback(new Error('该选项不能为空'));
        //     } else {
        //         if (Number.isInteger(Number(value)) && Number(value) > 0) {
        //             callback();
        //         } else {
        //             callback(new Error('请输入大于0的整数'));
        //         }
        //     }
        // };
        return {
            enableList:[
                { enable:'隐藏',label:'隐藏'},
                { enable:'显示',label:'显示'}
            ],
            queryId: '',
            loadingVisible: false,
            formData: {},
            formRules: {
                name: [
                    { required: true, message: '该选项不能为空', trigger: 'blur' }
                ],
                status: [
                    { required: true, message: '该选项不能为空', trigger: 'blur' }
                ],
                sort_number: [
                    { required: false }
                ],
                remark: [
                    { required: false }
                ]
            },
            buttonLoading: false,
            isDisabled: false // 判断提交按钮是否为禁止状态(文件上传没有完成时)
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
                if (formData.sort_number == undefined) {
                    formData.sort_number = '1'
                }
                if (this.queryId) {
                    // 修改
                    this.$api.categoryManagementEdit(formData)
                        .then(res => {
                            this.buttonLoading = false;
                            if (res.code == 0) {
                                this.$Message.success(res.message);
                                this.$router.push({ path: '/products/category' });
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
                    this.$api.categoryManagementCreate(formData)
                        .then(res => {
                            this.buttonLoading = false;
                            if (res.code == '0') {
                                this.$Message.success(res.message);
                                this.$router.push({ path: '/products/category' });
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
        // 获取类目详情
        fetchData (id) {
            this.$api.categoryManagementDetail(id)
                .then(res => {
                    this.formData = res.data;
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
<style lang="less">
.pro-upload-list {
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
    margin-left: 4px;
}

.pro-upload-list img {
    width: 100%;
    height: 100%;
}

.pro-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .6);
}

.pro-upload-list:hover .pro-upload-list-cover {
    display: block;
}

.pro-upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
}

.breadth {
    width: 58px;
    height: 58px;
    line-height: 58px;
}

.ivu-upload-list {
    display: inline-block;
}

.ivu-upload-drag {
    width: 58px;
    display: inline-block;
}

.ivu-upload-list-file {
    float: left;
    height: 58px;
}
</style>
