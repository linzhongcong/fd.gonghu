<template>
  <div class="policy-edit">
    <Card>
      <Row slot="title" type="flex" justify="end">
        <Button style="margin-right: 10px;" type="warning">保存为草稿</Button>
        <Button type="success" @click="submit">提交</Button>
      </Row>
      <Form ref="form1" :model="baseInfo" :rules="baseInfoRules" :label-width="75" label-position="left">
        <!-- 基础信息 start -->
        <Card>
          <div slot="title"><span class="content-title">基础信息</span></div>
          <Row>
            <Col :md="7">
              <FormItem :label-width="85" label="政策名称：" prop="name">
                <Input v-model="baseInfo.name" />
              </FormItem>
            </Col>
            <Col :md="7">
              <FormItem :label-width="110" label="有效截止日期：" prop="date">
                <DatePicker v-model="baseInfo.date" type="date" placeholder="请选择有效截止日期"></DatePicker>
              </FormItem>
            </Col>
            <Col :md="7">
              <FormItem label="税额扣减：" prop="tax">
                <InputNumber
                  v-model="baseInfo.tax"
                  :min="0"
                  :max="100"
                  :formatter="value => `${value}%`"
                  :parser="value => value.replace('%', '')"
                  @on-change="value => value === null && (baseInfo.tax = 0)"/>
              </FormItem>
            </Col>
          </Row>
        </Card>
        <!-- 基础信息 end -->
        <!-- 适用客户 start -->
        <Card>
          <div slot="title"><span class="content-title">适用客户</span></div>
          <Row>
            <Col :md="14">
              <FormItem prop="suitPartner">
                <RadioGroup v-model="baseInfo.suitPartner" @on-change="handleRadioOnChange">
                  <Radio label="partner">指定客户</Radio>
                  <div style="display: inline-block;">
                    <Row type="flex">
                      <Radio label="type">指定客户类型：</Radio>
                      <FormItem 
                        prop="suitPartnerType"
                        :rules="baseInfo.suitPartner === 'type' ? { required: true, message: '该项目不能为空', trigger: 'change'} : {}">
                        <Select v-model="baseInfo.suitPartnerType" :disabled="baseInfo.suitPartner === 'partner'" style="width: 100px;">
                          <Option v-for="(item, index) in merchantType"
                            :value="item.value"
                            :label="item.label"
                            :key="`merchantType${index}`">
                          </Option>
                        </Select>
                      </FormItem>
                    </Row>
                  </div>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
          <div v-show="baseInfo.suitPartner === 'partner'">
            <Row v-for="(company, index) in baseInfo.companyInfo" :key="`company${index}`">
              <Col :md="7">
                <FormItem
                  label="公司名称："
                  :label-width="85"
                  :prop="`companyInfo.${index}.companyId`"
                  :rules="baseInfo.suitPartner === 'partner' ? { required: true, message: '该选项不能为空', trigger: 'change' } : {}"
                  >
                  <Select
                    v-model="company.companyId"
                    filterable
                    :loading="remoteLoading"
                    :remote-method="remoteCompanyDeb"
                    @on-change="(value) => handleSelectOnChange(value, 'companyOptions')">
                    <Option
                      v-for="item in companyOptions"
                      :value="item.id"
                      :label="item.merchantName"
                      :key="`companyOptions${item.id}`">
                    </Option>
                  </Select>
                </FormItem>
              </Col>
              <Col :md="7">
                <FormItem label="客户类型：">
                  <Input :value="company.type" disabled />
                </FormItem>
              </Col>
              <Col :md="7">
                <Button v-if="index === 0" @click="baseInfo.companyInfo.push({})">+</Button>
                <Button v-else @click="baseInfo.companyInfo.splice(index, 1)">-</Button>
              </Col>
            </Row>
          </div>
        </Card>
        <!-- 适用客户 end -->
      </Form>
      <!-- 基础折扣 start -->
      <Form ref="form2" :label-width="75" label-position="left">
        <Card style="margin-top: 16px;">
          <div slot="title"><span class="content-title">基础折扣</span></div>
          <Row v-for="(item, index) in baseDiscount" :key="`baseDiscount${index}`">
            <Col :md="7">
              <FormItem label="应收金额：">
                <Input v-model="item.cost" />
              </FormItem>
            </Col>
            <Col :md="5">
              <FormItem label="折扣:" :label-width="40">
                <InputNumber
                  style="width: 90%"
                  v-model="item.discount"
                  :min="0"
                  :max="100"
                  :formatter="value => `${value}%`"
                  :parser="value => value.replace('%', '')"
                  @on-change="value => value === null && (baseInfo.tax = 0)" />
              </FormItem>
            </Col>
            <Col :md="6">
              <FormItem label="货值：" :label-width="50">
                <Input style="width: 90%" disabled />
              </FormItem>
            </Col>
            <div>
              <Button v-if="index === 0" style="margin-right: 10px;" @click="baseDiscount.push({discount: null})">+</Button>
              <Button v-else style="margin-right: 10px;" @click="baseDiscount.splice(index, 1)">-</Button>
              <Button type="primary">重置</Button>
            </div>
          </Row>
        </Card>
      </Form>
      <!-- 基础折扣 end -->
      <!-- 单品折扣 start -->
      <Form ref="form3" :label-width="75" label-position="left">
        <Card style="margin-top: 16px;">
          <div slot="title"><span class="content-title">单品折扣</span></div>
          <Row v-for="(item, index) in singleDiscount" :key="`singleDiscount${index}`">
            <Col :md="7">
              <FormItem label="选择产品：">
                <Select
                  filterable
                  :loading="remoteLoading"
                  :remote-method="remoteProductDeb"
                  @on-change="(value) => handleSelectOnChange(value, 'productOptions')">
                  <Option v-for="item in productOptions" :value="item.id" :label="item.name" :key="`productOptions${item.id}`"></Option>
                </Select>
              </FormItem>
            </Col>
            <Col :md="7">
              <div style="display: flex;">
              <Select style="width: 80px; margin-right: 5px;" v-model="item.type">
                <Option v-for="item in discountTypeOptions" :value="item.value" :label="item.label" :key="`discountTypeOptions${item.value}`"></Option>
              </Select>
              <InputNumber style="width: 100px" v-if="item.type === 'discount'" />
              <Input style="width: 100px" v-else />
              </div>
            </Col>
          </Row>
        </Card>
      </Form>
      <!-- 单品折扣 end -->
      {{baseInfo}} <br/>
      {{baseDiscount}}
    </Card>
  </div>  
</template>

<script>
import utils, { discountTypeOptions } from './utils'
export default {
  name: 'policy-add',
  data() {
    return {
      merchantType: utils.merchantType,
      discountTypeOptions,
      baseInfo: {
        name: '',
        date: '',
        tax: 0,
        suitPartner: '',
        companyInfo: [{}]
      },
      baseDiscount: [ // 基础折扣
        {
          discount: null
        }
      ], 
      singleDiscount: [{}], // 单品折扣
      baseInfoRules: {
        'name': [{ required: true, message: '该选项不能为空', trigger: 'blur' }],
        'date': [{ required: true, type: 'date', message: '该选项不能为空', trigger: 'change' }],
        'tax': [{ required: false, validator: utils.taxationValidator, trigger: 'change' }],
        'suitPartner': [{ required: true, message: '该选项不能为空', trigger: 'change' }],
        'suitPartnerType': []
      },
      remoteLoading: false, // 远程搜索
      companyOptions: [], // 公司选项
      productOptions: [], // 产品选项
      remoteCompanyDeb: this.$debonce(this.remoteCompany, 500),
      remoteProductDeb: this.$debonce(this.remoteProduct, 500),
    }
  },
  methods: {
    submit() {
      this.$refs.form1.validate((v1) => {
        console.log('v1', v1);
      })
    },

    /**
     * 查询公司
     * @param {String} name: 公司名称
     */
    async remoteCompany(name) {
      if(!name.trim()) return false;
      this.remoteLoading = true;
      this.companyOptions = [ ...this.companyOptions.filter(item => item.selected) ]
      try {
        let res = await this.$api.cooperativeCustomerSearchPartner({name})
        if (res.code ===0) {
          this.companyOptions = utils.removeRepeatItem([ ...this.companyOptions, ...res.data])
          this.remoteLoading = false;
        }
      } catch (error) {
        this.remoteLoading = false;
      }
    },

    /**
     * 查询产品
     * @param {String} name: 产品名称
     */
    async remoteProduct(name) {
      this.remoteLoading = true;
      try {
        let res = await this.$api.getProductData({name})
        if (res.code ===0) {
          this.productOptions = utils.removeRepeatItem([ ...this.productOptions, ...res.data])
          this.remoteLoading = false;
        }
      } catch (error) {
        this.remoteLoading = false;
      }
    },

    /**
     * 模糊查询下拉框 - 选中事件
     * 为选中项设置selected属性为true, 去除未选中的选项
     * @param {String|Number} id: 选中项id
     * @param {String} key: 选项列表属性名称
     */
    handleSelectOnChange(id, key) {
      let tempArr = this[key];
      tempArr.find(item => item.id === id && (item.selected = true));
      this[key] = [ ...tempArr.filter(item => item.selected) ];
    },

    /**
     * 适用客户 - 单选框改变
     */
    handleRadioOnChange(option) {
      this.$nextTick(() => option === 'partner' && this.$refs.form1.validateField('suitPartnerType'))
    },
  },
  mounted() {
    const arr = [
      {
        companyId: '3677'
      },
      {
        companyId: '3679'
      },
      {
        companyId: '3704'
      }
    ]
    // 选项放置在页面渲染之后再赋值
    this.$nextTick(() => {
      this.companyOptions = [
      {
        id: '3677',
        merchantName: '广州胜洲投资有限公司',
        selected: true,
      },
      {
        id: '3679',
        merchantName: '广州宝洁有限公司',
        selected: true,
      },
      {
        id: '3704',
        merchantName: '广州巨辣电子商务有限公司',
        selected: true,
      },
    ]
    })
    this.baseInfo.suitPartner = 'partner'
    this.baseInfo.companyInfo = arr
  },
}
</script>

<style lang="less" scoped>
.policy-edit {
  .ivu-card-body {
    .ivu-card {  
      /deep/ .ivu-card-head {
        padding: 10px 12px;
      }
    }
  }
  .content-title {
    display: flex;
    align-items: center;
    font-weight: bold;
    font-size: 14px;
    &::before {
      display: block;
      content: '';
      width: 10px;
      height: 24px;
      border-radius: 2px;
      margin-right: 5px;
      background-color: rgb(128, 179, 255);
    }
  }
}
</style>