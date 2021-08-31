<template>
    <div>
        <Card>
            <div slot="title" style="text-align: right">
                <Button type="success" :loading="loadingSubmit" @click="submit('formData')">提交</Button>
                <Button @click="goBack">返回</Button>
            </div>
            <div>
                <Card>
                    <div slot="title">
                        <p>添加样品清单</p>
                    </div>
                    <div>
                        <Form ref="formData" :model="formData" :rules="formRule">
                            <Row type="flex" justify="start">
                                <Col :md="8">
                                <FormItem label="样品发货原因："  label-position="right" :label-width="120" prop="reason">
                                    <Select v-model="formData.reason" placeholder="请选择">
                                        <Option v-for="(item, index) in reasonList" :key="'reason' + index" :value="item.value" :label="item.value"></Option>
                                    </Select>
                                </FormItem>
                                </Col>
                                <Col :md="8">
                                <FormItem label="发货方式："  label-position="right" :label-width="120" prop="delivery_mode">
                                    <Select v-model="formData.delivery_mode" placeholder="请选择">
                                        <Option v-for="(item, index) in deliveryModeList" :key="'delivery' + index" :value="item.value" :label="item.label"></Option>
                                    </Select>
                                </FormItem>
                                </Col>
                                <Col :md="8">
                                <FormItem label="联系方式："  label-position="right" :label-width="120" prop="contact_phone">
                                    <Input v-model="formData.contact_phone" placeholder="请输入" clearable></Input>
                                </FormItem>
                                </Col>
                            </Row>
                            <Row type="flex" justify="start">
                                <Col :md="8">
                                <FormItem label="发货对象："  label-position="right" :label-width="120" prop="delivery_object">
                                    <Input v-model="formData.delivery_object" placeholder="请输入" clearable></Input>
                                </FormItem>
                                </Col>
                                <Col :md="8">
                                <FormItem label="渠道："  label-position="right" :label-width="120" prop="channel_type">
                                  <Select class="width-200px" placeholder="选择渠道" v-model="formData.channel_type" clearable>
                                    <Option v-for="item in channelList" :key="item.value" :value="item.value">{{ item.label }}</Option>
                                  </Select>
                                </FormItem>
                                </Col>
                                <Col :md="8">
                                <FormItem label="收货地址地区："  
                                label-position="right" 
                                :label-width="120" 
                                required   
                               >
                                    <Cascader :data="province" v-model="provinceSelect" @on-change="getProvince" placeholder="所在地区"></Cascader>
                                </FormItem>
                                </Col>
                            </Row>
                            <Row type="flex" justify="start">
                                <Col :md="24">
                                <FormItem label="收货详细地址："  label-position="right" :label-width="120" prop="receiving_address">
                                    <Input v-model="formData.receiving_address" placeholder="详细地址：如道路、门牌号、小区、楼栋号、单元室等" clearable></Input>
                                </FormItem>
                                </Col>
                            </Row>
                            <Row type="flex" justify="start">
                                <Col :md="24">
                                <FormItem label="样品发货凭证："  label-position="right" :label-width="120">
                                    <Upload
                                        name="UploadForm[file]"
                                        :action="fileUploadURL"
                                        :headers="fileUploadHeaders"
                                        :on-success="fileSuccess"
                                        :on-remove="fileRemove"
                                        :on-error="fileError"
                                        :default-file-list="defaultList"
                                    >
                                        <Button icon="md-add" type="dashed"></Button>
                                    </Upload>
                                </FormItem>
                                </Col>
                            </Row>
                            <Row class="margin-bottom-10">
                                <h4>样品清单</h4>
                            </Row>
                            <Row type="flex" justify="start" v-for="(items, index) in formData.orderProducts" :key="'productlist' + index">
                                <Col :md="4">
                                <FormItem
                                    label-position="top"
                                    label="产品名称"
                                    :prop="'orderProducts.' + index + '.pro_id'"
                                    :rules="{required: true, message: '产品不能为空', trigger: 'change'}"
                                >
                                    <Select v-model="items.pro_id" filterable @on-query-change="queryProductDebonce(...arguments, index)" @on-change="selectProduct(...arguments, index)">
                                        <Option v-for="item in productLists[index]" :key="'product' + item.pro_id" :value="item.pro_id" :label="item.pro_name"></Option>
                                    </Select>
                                </FormItem>
                                </Col>
                                <Col :md="2">
                                <FormItem label-position="top" label="规格">
                                    <Input v-model="items.standard" disabled></Input>
                                </FormItem>
                                </Col>
                                <Col :md="2">
                                <FormItem label-position="top" label="单位">
                                    <Input v-model="items.unit" disabled></Input>
                                </FormItem>
                                </Col>
                                <Col :md="2">
                                <FormItem label-position="top" label="零售价">
                                    <Input v-model="items.price" disabled></Input>
                                </FormItem>
                                </Col>
                                <Col :md="2">
                                <FormItem label-position="top" label="样品数量" required>
                                    <InputNumber :min="1" v-model="items.number" @on-change="changeNumber(...arguments, index)"></InputNumber>
                                </FormItem>
                                </Col>
                                <Col :md="3">
                                <FormItem label-position="top" label="样品货值">
                                    <Input v-model="items.value" disabled></Input>
                                </FormItem>
                                </Col>
                                <Col :md="2">
                                <FormItem label-position="top" label="箱规">
                                    <Input v-model="items.box_standard" disabled></Input>
                                </FormItem>
                                </Col>
                                <Col :md="5" style="display: flex;flex-direction: column;justify-content: center">
                                    <div style="padding-top:8px">
                                        <Button type="primary" @click="resetRow(index)">重置</Button>
                                        <Button icon="md-add" v-if="index == 0" @click="addRow(index)"></Button>
                                        <Button icon="md-remove" v-if="formData.orderProducts.length > 1" @click="removeRow(index)"></Button>
                                    </div>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Card>
                <Card>
                    <div slot="title"><p>补发订单合计</p></div>
                    <div>
                        <Form label-position="top">
                            <Row>
                                <Col :md="6">
                                <FormItem label="样品订单货值">
                                    <Input v-model="countTotalValue" disabled></Input>
                                </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col :md="24">
                                <FormItem label="样品订单备注">
                                    <Input v-model="formData.remark" type="textarea" :autosize="{minRows: 5}"></Input>
                                </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Card>
            </div>
        </Card>
    </div>
</template>
<script>
  import PROVINCE from '~/plugins/area';
  import Cookies from 'js-cookie'
  import { SERVER_BASE_URL } from '~/api/config';
export default {
    data() {
        return {
            // 文件上传
            fileUploadURL: `${SERVER_BASE_URL}/v1/upload`,
            fileUploadHeaders: {
                Authorization: Cookies.get('authorization')
            },
            channelList: [
              {value: 'CS', label: 'CS'},
              {value: 'KA', label: 'KA'},
              {value: 'OTC', label: 'OTC'},
              {value: '便利店', label: '便利店'},
              {value: '其他', label: '其他'}
            ],
            loadingSubmit: false,
            defaultList: [],
            formData: {
                fileItems: [],
                orderProducts: [
                    { pro_id: '', standard: '', unit: '', price: '', number: 0, value: 0, box_standard: ''}
                ]
            },
            formRule: {
                reason: [{ required: true, message: '请选择原因', trigger: 'change' }],
                delivery_mode: [{ required: true, message: '请选择发货方式', trigger: 'change' }],
                contact_phone: [{ required: true, message: '请选择联系方式', trigger: 'blur' }],
                delivery_object: [{ required: true, message: '请选择发货对象', trigger: 'blur' }],
                receiving_address: [{ required: true, message: '请选择收货地址', trigger: 'blur' }],
                channel_type: [{ required: true, message: '请选择渠道', trigger: 'change' }],
            },
            reasonList: [
                { value: '商家使用' },
                { value: '业务员样品' },
                { value: '商务合作' },
                { value: '第三方试用' },
                { value: '官方活动赞助' },
                { value: '其他' }
            ],
            deliveryModeList: [
                { value: 'express', label: '快递' },
                { value: 'logistics', label: '物流' },
                { value: 'noDelivery', label: '不发货' },
            ],
            productLists: [],
            productObj: { pro_id: '', standard: '', unit: '', price: '', number: 0, value: 0, box_standard: ''},
            province: [], // 省市区
            provinceSelect: [],
            queryProductDebonce:this.$debonce(this.queryProduct,500)
        }
    },
    methods: {
        fileSuccess(response, file, fileList) {
            if(response.code === 0){
                this.formData.fileItems.push(response.data)
            }else {
                this.$Message.error(response.message)
            }
        },
        fileRemove(file, fileList) {
            let index = this.formData.fileItems.findIndex((item) => {
                return file.name == item.name
            })
            this.formData.fileItems.splice(index, 1)
        },
        fileError(error, file, fileList) {
            this.$Message.error('上传失败')
        },
        queryProduct(query, index) {
            this.$api.orderReviewQueryProduct({name: query}).then((res) => {
                if(res.code === 0){
                    this.$set(this.productLists, index, res.data)
                }
            })
        },
        selectProduct(val, index) {
            this.productLists[index].map((item) => {
                if(item.pro_id == val) {
                    this.formData.orderProducts[index] = item
                    this.changeNumber(1, index)
                }
            })
        },
        changeNumber(num, index) {
            this.formData.orderProducts[index].number = num
            this.$set(this.formData.orderProducts[index], 'value', Math.round(this.formData.orderProducts[index].price*num*10000)/10000)
            this.addRow() // 通过改变数组长度，触发computed
            this.formData.orderProducts.splice(this.formData.orderProducts.length-1, 1)
        },
        resetRow(index) {
            this.formData.orderProducts.splice(index, 1, this.productObj)
        },
        addRow() {
            this.formData.orderProducts.push(JSON.parse(JSON.stringify(this.productObj)))
        },
        removeRow(index) {
            this.formData.orderProducts.splice(index, 1)
            this.productLists[index].length = 0
        },
        submit(name) {
          if (!this.provinceSelect.length) {
            this.$Message.error('请填写收货地址地区！');
            return false;
          }
            let params = JSON.parse(JSON.stringify(this.formData))
            this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.loadingSubmit = true
                        if(this.formData.id){
                            this.$api.sampleUpdate(params).then((res) => {
                                if(res.code === 0) {
                                    this.$Message.success('编辑成功')
                                    this.goBack()
                                }
                            }).finally(() => {
                                this.loadingSubmit = false
                            })
                        }else {
                            this.$api.sampleCreate(params).then((res) => {
                                if(res.code === 0) {
                                    this.$Message.success('添加成功')
                                    this.goBack()
                                }
                            }).finally(() => {
                                this.loadingSubmit = false
                            })
                        }
                    } else {
                        this.$Message.error('请填写信息');
                    }
                })
        },
        goBack() {
            this.$store.commit('removeTag', this.$route.name)
            this.$router.push({ path: '/replacement-management/sample-order-review/review' })
        },
        // 获取省市区
        getProvince (val, selectData) {
            // 省
            this.formData.province = selectData[0].label;
            this.formData.province_id = selectData[0].value;
            // 市
            this.formData.city = selectData[1].label;
            this.formData.city_id = selectData[1].value;
            // 区
            this.formData.county = selectData[2].label;
            this.formData.county_id = selectData[2].value;
        }
    },
    computed: {
        countTotalValue: function() {
            let total = 0
            this.formData.orderProducts.map((item) => {
                total += item.value
            })
            return total
        }
    },
    mounted() {
        this.province = PROVINCE;
        this.formData.id = this.$route.query.id
        if(this.formData.id) {
            this.$api.sampleDetail(this.formData.id).then((res) => {
                if(res.code === 0) {
                    this.$set(this.formData, 'delivery_mode', res.data.delivery_mode)
                    this.$set(this.formData, 'reason', res.data.reason)
                    this.$set(this.formData, 'delivery_object', res.data.delivery_object)
                    this.$set(this.formData, 'receiving_address', res.data.receiving_address)
                    this.$set(this.formData, 'remark', res.data.remark)
                    this.$set(this.formData, 'contact_phone', res.data.contact_phone)
                    this.formData.fileItems = res.data.files
                    this.formData.channel_type = res.data.channel_type
                    this.provinceSelect = [ res.data.province_id, res.data.city_id, res.data.county_id];
                    // 省
                    this.formData.province = res.data.province;
                    this.formData.province_id = res.data.province_id;
                    // 市
                    this.formData.city = res.data.city;
                    this.formData.city_id = res.data.city_id;
                    // 区
                    this.formData.county = res.data.county;
                    this.formData.county_id = res.data.county_id;
                    res.data.files.map((item) => {
                        let obj = {
                            name: item.title + '.' + item.extension,
                            url: item.url
                        }
                        this.defaultList.push(obj)
                    })
                    res.data.sampleOrderProducts.map((item) => {
                        item.number = +item.number
                        item.value = Math.round(item.price*item.number*10000)/10000
                        this.productLists.push([{ pro_id: item.pro_id, pro_name: item.pro_name }])
                    })
                    this.formData.orderProducts = res.data.sampleOrderProducts
                }
            })
        }
    }
}
</script>
