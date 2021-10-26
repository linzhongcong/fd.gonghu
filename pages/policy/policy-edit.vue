<template>
  <div class="policy-edit">
    <Card>
      <Row slot="title" type="flex" justify="end">
        <Button style="margin-right: 10px;" type="warning" :loading="draftBtnLoading" :disabled="submitBtnLoading" @click="handleDraft">保存为草稿</Button>
        <Button type="success" :loading="submitBtnLoading" :disabled="draftBtnLoading" @click="handleSubmit">提交</Button>
      </Row>
      <Form ref="form1" :model="formData" :rules="baseInfoRules" :label-width="75" label-position="left">
        <!-- 基础信息 start -->
        <Card>
          <div slot="title"><span class="content-title">基础信息</span></div>
          <Row>
            <Col :md="7">
              <FormItem :label-width="85" label="政策名称：" prop="policyName">
                <Input v-model="formData.policyName" placeholder="请输入" />
              </FormItem>
            </Col>
            <Col :md="7">
              <FormItem :label-width="110" label="有效截止日期：" prop="deadlineAt">
                <DatePicker v-model="formData.deadlineAt" type="date" placeholder="请选择有效截止日期"></DatePicker>
              </FormItem>
            </Col>
            <Col :md="7">
              <FormItem label="税额扣减：" prop="taxDeduction">
                <Input style="width: 70px;" v-model="formData.taxDeduction" />%
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
              <FormItem prop="regularType">
                <RadioGroup v-model="formData.regularType" @on-change="handleRadioOnChange">
                  <Radio label="contractor">指定客户</Radio>
                  <div style="display: inline-block;">
                    <Row type="flex">
                      <Radio label="type">指定客户类型：</Radio>
                      <FormItem 
                        prop="assignMerchantType"
                        :rules="formData.regularType === 'type' ? { required: true, message: '该项目不能为空', trigger: 'change'} : {}">
                        <Select v-model="formData.assignMerchantType" :disabled="formData.regularType === 'contractor'" style="width: 100px;">
                          <Option v-for="(item, index) in merchantTypeOptions"
                            :value="item.value"
                            :label="item.label"
                            :key="`merchantTypeOptions${index}`">
                          </Option>
                        </Select>
                      </FormItem>
                    </Row>
                  </div>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
          <div v-show="formData.regularType === 'contractor'">
            <Row v-for="(contractor, index) in formData.regularContractorList" :key="`company${index}`">
              <Col :md="7">
                <FormItem
                  label="公司名称："
                  :label-width="85"
                  :prop="`regularContractorList.${index}.contractorId`"
                  :rules="formData.regularType === 'contractor' ? { required: true, message: '该选项不能为空', trigger: 'change' } : {}"
                  >
                  <Select
                    v-model="contractor.contractorId"
                    filterable
                    :loading="remoteLoading"
                    :remote-method="remoteCompanyDeb"
                    @on-change="(value) => handleSelectOnChange(value, 'companyOptions', contractor)">
                    <Option
                      v-for="(item, index) in companyOptions"
                      :value="item.id || item.contractorId"
                      :label="item.merchantName"
                      :key="`companyOptions${index}`">
                    </Option>
                  </Select>
                </FormItem>
              </Col>
              <Col :md="7">
                <FormItem label="客户类型：">
                  <Input :value="contractor.merchantType" disabled />
                </FormItem>
              </Col>
              <Col :md="7">
                <Button v-if="index === 0" @click="handleOnAddOption('regularContractorList', formData.regularContractorList)">+</Button>
                <Button v-else @click="handleOnRemoveOption(formData.regularContractorList, index)">-</Button>
              </Col>
            </Row>
          </div>
        </Card>
        <!-- 适用客户 end -->
        <!-- 基础折扣 statr -->
        <Card>
          <div slot="title"><span class="content-title">基础折扣</span></div>
          <Row v-for="(item, index) in formData.baseDiscountList" :key="`baseDiscountList${index}`">
            <Col :md="7">
              <FormItem
                label="应收金额："
                :prop="`baseDiscountList[${index}].startingAmount`"
                :rules="{required: false, validator: (r, v, cb) => validatePrice(v, item, cb), trigger: 'blur'}"
              >
                <Input v-model="item.startingAmount"/>
              </FormItem>
            </Col>
            <Col :md="5">
              <FormItem
                label="折扣："
                :label-width="50"
                :prop="`baseDiscountList[${index}].proportion`"
                :rules="{required: false, validator: (r, v, cb) => validatePercent(v, item, cb), trigger: 'blur'}"
              >
                <div style="display: flex;">
                  <Input style="width: 90%;" v-model="item.proportion"/>%
                </div>
              </FormItem>
            </Col>
            <Col :md="6">
              <FormItem label="货值：":label-width="50">
                <Input :value="handleCalcGoodsPrice(item.startingAmount, item.proportion)" style="width: 90%" disabled />
              </FormItem>
            </Col>
            <Col :md="6">
              <FormItem :label-width="0">
                <RowButton
                  :hide-add="!!index"
                  @on-add="handleOnAddOption('baseDiscountList', formData.baseDiscountList)"
                  @on-remove="handleOnRemoveOption(formData.baseDiscountList, index)"
                  @on-reset="handleOnResetOption(formData.baseDiscountList, index, 'baseDiscountList')">
                </RowButton>
              </FormItem>
            </Col>
          </Row>
        </Card>
        <!-- 基础折扣 end -->
        <!-- 单品折扣 start -->
        <Card>
          <div slot="title"><span class="content-title">单品折扣</span></div>
          <Row v-for="(item, index) in formData.productDiscountList" :key="`productDiscountList${index}`">
            <Col :md="7">
              <FormItem
                label="选择产品："
                :prop="`productDiscountList[${index}].objectId`"
                :rules="{required: false, validator: (r, v, cb) => validateSelect(v, item, cb), trigger: 'change'}">
                <Select
                  v-model="item.objectId"
                  filterable
                  :loading="remoteLoading"
                  :remote-method="remoteProductDeb"
                  @on-change="(value) => handleSelectOnChange(value, 'productOptions')">
                  <Option v-for="pOption in productOptions" :value="pOption.id" :label="pOption.name" :key="`productOptions${pOption.id}`"></Option>
                </Select>
              </FormItem>
            </Col>
            <Col :md="2">
              <FormItem
                :label-width="0"
                :prop="`productDiscountList[${index}].objectName`"
                :rules="{required: false, validator: (r, v, cb) => validateSelect(v, item, cb), trigger: 'change'}"
              >
                <Select
                  class="small-select"
                  v-model="item.objectName"
                  @on-change="option => handleTypeSelectOnChange('productDiscount' ,option, item)"
                >
                  <Option v-for="tOption in discountTypeOptions" :value="tOption.value" :label="tOption.label" :key="`discountTypeOptions${tOption.value}`"></Option>
                </Select>
              </FormItem>
            </Col>
            <Col :md="3">
              <FormItem
                v-if="item.objectName === 'discount'"
                :label-width="0"
                :prop="`productDiscountList[${index}].proportion`"
                :rules="{required: false, validator: (r, v, cb) => validatePercent(v, item, cb), trigger: 'blur'}"
                :key="`productDiscountList${index}.proportion`"
              >
                <Input style="width: 85%;" v-model="item.proportion" />%
              </FormItem>
              <FormItem
                v-else
                :label-width="0"
                :prop="`productDiscountList[${index}].directPrice`"
                :rules="{required: false, validator: (r, v, cb) => validatePrice(v, item, cb), trigger: 'blur'}"
                :key="`productDiscountList${index}.directPrice`"
              >
                <Input style="width: 85%;" v-model="item.directPrice" :disabled="!item.objectName" />
              </FormItem>
            </Col>
            <Col :md="6">
              <FormItem :label-width="0">
                <RowButton
                  :hide-add="!!index"
                  @on-add="handleOnAddOption('productDiscountList', formData.productDiscountList)"
                  @on-remove="handleOnRemoveOption(formData.productDiscountList, index)"
                  @on-reset="handleOnResetOption(formData.productDiscountList, index, 'productDiscountList')">
                </RowButton>
              </FormItem>
            </Col>
          </Row>
        </Card>
        <!-- 单品折扣 end -->
        <!-- 配赠活动 start -->
        <Card class="gift">
          <div slot="title"><span class="content-title">配赠活动</span></div>
          <Row class="gift-row" v-for="(item, index) in formData.matchingDiscountList" :key="`matchingDiscountList${index}`">
            <Col class="gift-box" span="22">
              <Row> 
                <Col :md="9">
                  <FormItem
                    label="配赠应收金额："
                    :label-width="100"
                    :prop="`matchingDiscountList[${index}].startingAmount`"
                    :rules="{required: false, validator: (r, v, cb) => validateMatchingDiscount('cost', v, item, cb), trigger: 'blur'}"
                  >
                    <Input v-model="item.startingAmount"/>
                  </FormItem>
                </Col>
              </Row>
              <div class="gift-content" v-for="(detail, dIndex) in item.detailList" :key="`${index}matchingActivityListDetailList${dIndex}`">
                <Row class="gift-sub-content">
                  <p style="padding-top: 8px; flex-shrink: 0;">配赠比例：</p>
                  <FormItem
                    :label-width="0"
                    :prop="`matchingDiscountList[${index}].detailList[${dIndex}].matchingMolecule`"
                    :rules="{required: false, validator: (r, v, cb) => validateMatchingDiscount('number', v, item, cb), trigger: 'blur'}"
                  >
                    <Input v-model="detail.matchingMolecule" style="width: 70px;"/> 比 
                  </FormItem>
                  <FormItem
                    :label-width="0"
                    :prop="`matchingDiscountList[${index}].detailList[${dIndex}].matchingDenominator`"
                    :rules="{required: false, validator: (r, v, cb) => validateMatchingDiscount('number', v, item, cb), trigger: 'blur'}"
                  >
                    <Input v-model="detail.matchingDenominator" style="width: 70px;"/> 赠 
                  </FormItem> 
                  <div class="sub-content-btn">
                    <Button v-if="dIndex === 0" @click="handleOnAddOption('matchingDetailList', item.detailList)">+</Button>
                    <Button v-else @click="handleOnRemoveOption(item.detailList, dIndex)">-</Button>
                  </div>
                </Row>
                <Row v-for="(product, pIndex) in detail.productList" :key="`${index}${dIndex}matchingActivityListDetailListProductList${pIndex}`">
                  <Col :md="9">
                    <div style="display: flex;">
                      <p style="padding-top: 8px; flex-shrink: 0;">购买产品：</p>
                      <FormItem
                        :label-width="0"
                        :prop="`matchingDiscountList[${index}].detailList[${dIndex}].productList[${pIndex}].conditionType`"
                        :rules="{required: false, validator: (r, v, cb) => validateMatchingDiscount('select', v, item, cb), trigger: 'change'}"
                      >
                        <Select v-model="product.conditionType" class="small-select">
                          <Option
                            v-for="(tOption, tIndex) in productTypeOptions"
                            :value="tOption.value"
                            :label="tOption.label"
                            :key="`productTypeOptions${tIndex}`">
                          </Option>
                        </Select>
                      </FormItem>
                      <FormItem
                        :label-width="0"
                        :prop="`matchingDiscountList[${index}].detailList[${dIndex}].productList[${pIndex}].conditionId`"
                        :rules="{required: false, validator: (r, v, cb) => validateMatchingDiscount('select', v, item, cb), trigger: 'change'}"
                      >
                        <Select
                          v-model="product.conditionId"
                          filterable
                          label-in-value
                          :loading="remoteLoading"
                          :remote-method="remoteProductDeb"
                          @on-change="(data) => data && handleSelectOnChangeHasLabel(product, 'conditionName', data.label, data.value, 'productOptions')">
                          <Option v-for="bpOption in productOptions" :value="bpOption.id" :label="bpOption.name" :key="`buyProductOptions${bpOption.id}`"></Option>
                        </Select>
                      </FormItem>
                    </div>
                  </Col>
                  <Col :md="9">
                    <div style="display: flex;">
                      <p style="padding-top: 8px; flex-shrink: 0;">可配赠产品：</p>
                      <FormItem
                        :label-width="0"
                        :prop="`matchingDiscountList[${index}].detailList[${dIndex}].productList[${pIndex}].objectName`"
                        :rules="{required: false, validator: (r, v, cb) => validateMatchingDiscount('select', v, item, cb), trigger: 'change'}"
                      >
                        <Select v-model="product.objectName" class="small-select">
                          <Option
                            v-for="(gtOption, gtIndex) in productTypeOptions"
                            :value="gtOption.value"
                            :label="gtOption.label"
                            :key="`productTypeOptions${gtIndex}`">
                          </Option>
                        </Select>
                      </FormItem>
                      <FormItem
                        :label-width="0"
                        :prop="`matchingDiscountList[${index}].detailList[${dIndex}].productList[${pIndex}].objectId`"
                        :rules="{required: false, validator: (r, v, cb) => validateMatchingDiscount('select', v, item, cb), trigger: 'change'}"
                      >
                        <Select
                          v-model="product.objectId"
                          filterable
                          label-in-value
                          :loading="remoteLoading"
                          :remote-method="remoteProductDeb"
                          @on-change="(data) => data && handleSelectOnChangeHasLabel(product, 'name', data.label, data.value, 'productOptions')">
                          <Option v-for="gpOption in productOptions" :value="gpOption.id" :label="gpOption.name" :key="`giftProductOptions${gpOption.id}`"></Option>
                        </Select>
                      </FormItem>
                    </div>
                  </Col>
                  <Col :md="6">
                    <FormItem :label-width="0">
                      <RowButton
                        :hide-add="!!pIndex"
                        @on-add="handleOnAddOption('matchingProductList', detail.productList)"
                        @on-remove="handleOnRemoveOption(detail.productList, pIndex)"
                        @on-reset="handleOnResetOption(detail.productList, pIndex, 'matchingProductList')">
                      </RowButton>
                    </FormItem>
                  </Col>
                </Row>
              </div>
            </Col>
            <Button v-if="index === 0" @click="handleOnAddOption('matchingDiscountList', formData.matchingDiscountList)">+</Button>
            <Button v-else @click="handleOnRemoveOption(formData.matchingDiscountList, index)">-</Button>
          </Row>
        </Card>
        <!-- 配赠活动 end -->
        <!-- 满赠活动 start -->
        <Card class="gift">
          <div slot="title"><span class="content-title">满赠活动</span></div>
          <Row class="gift-row" v-for="(item, index) in formData.giftDiscountList" :key="`giftDiscountList${index}`">
            <Col class="gift-box" span="22">
              <Row>
                <Col :md="9">
                  <FormItem
                    label="满赠应收金额："
                    :label-width="100"
                    :prop="`giftDiscountList[${index}].startingAmount`"
                    :rules="{required: false, validator: (r, v, cb) => validateGiftDiscount('cost', v, item, cb), trigger: 'blur'}"
                  >
                    <Input v-model="item.startingAmount"/>
                  </FormItem>
                </Col>
              </Row>
              <Row v-for="(gift, pIndex) in item.detailList" :key="`${index}detailList${pIndex}`">
                <Col :md="9">
                  <div style="display: flex;">
                    <p style="padding-top: 8px; flex-shrink: 0;">选择赠品：</p>
                    <FormItem
                      :label-width="0"
                      :prop="`giftDiscountList[${index}].detailList[${pIndex}].objectName`"
                      :rules="{required: false, validator: (r, v, cb) => validateGiftDiscount('select', v, item, cb), trigger: 'change'}"
                    >
                      <Select v-model="gift.objectName" style="width: 80px; margin-right: 5px;">
                        <Option
                          v-for="(tOption, tIndex) in productTypeOptions"
                          :value="tOption.value"
                          :label="tOption.label"
                          :key="`productTypeOptions${tIndex}`">
                        </Option>
                      </Select>
                    </FormItem>
                    <FormItem
                      :label-width="0"
                      :prop="`giftDiscountList[${index}].detailList[${pIndex}].objectId`"
                      :rules="{required: false, validator: (r, v, cb) => validateGiftDiscount('select', v, item, cb), trigger: 'change'}"
                    >
                      <Select
                        v-model="gift.objectId"
                        filterable
                        :loading="remoteLoading"
                        :remote-method="remoteProductDeb"
                        @on-change="(value) => handleSelectOnChange(value, 'productOptions')">
                        <Option v-for="pOption in productOptions" :value="pOption.id" :label="pOption.name" :key="`productOptions${pOption.id}`"></Option>
                      </Select>
                    </FormItem>
                  </div>
                </Col>
                <Col :md="9">
                  <FormItem
                    label="可赠数量："
                    :prop="`giftDiscountList[${index}].detailList[${pIndex}].number`"
                    :rules="{required: false, validator: (r, v, cb) => validateGiftDiscount('number', v, item, cb), trigger: 'blur'}"
                  >
                    <Input v-model="gift.number" style="width: 100px;"/>
                  </FormItem>
                </Col>
                <Col :md="6">
                  <FormItem :label-width="0">
                    <RowButton
                      :hide-add="!!pIndex"
                      @on-add="handleOnAddOption('giftDetailList', item.detailList)"
                      @on-remove="handleOnRemoveOption(item.detailList, pIndex)"
                      @on-reset="handleOnResetOption(item.detailList, pIndex, 'giftDetailList')">
                    </RowButton>
                  </FormItem>
                </Col>
              </Row>
            </Col>
            <Button v-if="index === 0" @click="handleOnAddOption('giftDiscountList', formData.giftDiscountList)">+</Button>
            <Button v-else @click="handleOnRemoveOption(formData.giftDiscountList, index)">-</Button>
          </Row>
        </Card>
        <!-- 满赠活动 end -->
        <!-- 返点活动 start -->
        <Card>
          <div slot="title"><span class="content-title">返点活动</span></div>
          <Row>
            <Col :md="8">
              <FormItem :label-width="0">
                <Checkbox v-model="formData.isRebate">启用返点</Checkbox>
              </FormItem>
            </Col>
          </Row>
        </Card>
        <!-- 返点活动 end -->
      </Form>

      <Spin v-if="spinShow" fix></Spin>
    </Card>
  </div>  
</template>

<script>
import { deepflatToObject, removeRepeatItem, formatMerchantType, merchantTypeOptions } from '@/utils/common.js';
import { discountTypeOptions, productTypeOptions, initSingleData, taxationValidator  } from '@/utils/policy.js';
import RowButton from '@/components/policy/row-button.vue';
const validatorMapKey = {
  // 校验器映射表
  number: (val, cb) => !/^\d+$/.test(val) ? cb('请输入整数') : cb(),
  cost: (val, cb) => !/^(([1-9]\d*)|0)(\.\d{1,4})?$/.test(val) ? cb('请输入有效金额') : cb(),
  discount: (val, cb) => !/^(([1-9]\d*)|0)(\.\d{1,2})?$/.test(val) ? cb('请输入有效折扣') : cb(),
}

export default {
  name: 'policy-edit',
  components: { RowButton },
  data() {
    return {
      id: '',
      merchantTypeOptions,
      productTypeOptions,
      discountTypeOptions,
      spinShow: false,
      submitBtnLoading: false, // 提交按钮Loading
      draftBtnLoading: false, // 草稿按钮Loading

      formData: { // 基础信息/适用客户
        policyName: '',
        deadlineAt: '', // 有效截止日期
        taxDeduction: 0,
        regularType: '', // 适用客户-单选按钮
        assignMerchantType: '', // 指定客户类型-类型
        regularContractorList: [{contractorId: '', merchantType: ''}], // 指定客户-公司名称
        
        isRebate: false, // 是否启用返点清单
        baseDiscountList: [{ startingAmount: '', proportion: '' }], // 基础折扣
        productDiscountList: [{ objectId: '', objectName: '', directPrice: '', }],
        matchingDiscountList: [ // 配赠活动
          {
            startingAmount: '',
            detailList: [
              {
                matchingMolecule: '',
                matchingDenominator: '',
                productList: [ {  objectId: '',  objectName: '',  conditionId: '',  conditionType: '',  } ] // 产品
              }
            ]
          }
        ],
        giftDiscountList: [ // 满赠活动
          {
            startingAmount: '',
            detailList: [ { objectName: '', objectId: '', number: '',} ] // 产品
          }
        ]
      },
      baseInfoRules: {
        'policyName': [{ required: true, message: '该选项不能为空', trigger: 'blur' }],
        'taxDeduction': [{ required: false, validator: taxationValidator, trigger: 'blur' }],
        'deadlineAt': [{ required: true, type: 'date', message: '该选项不能为空', trigger: 'change' }],
        'regularType': [{ required: true, message: '请选择适用客户', trigger: 'change' }],
      },
      remoteLoading: false, // 远程搜索
      companyOptions: [], // 公司选项
      productOptions: [], // 产品选项
      remoteCompanyDeb: this.$debonce(this.remoteCompany, 500),
      remoteProductDeb: this.$debonce(this.remoteProduct, 500),
    }
  },
  methods: {
    /**
     * 获取详情政策详情
     * @param {String|Number} id: 政策id
     */
    async getDetail(id) {
      this.spinShow = true;
      try {
        let { code, data } = await this.$api.getContractPolicyDetailV2({id});
        if (code === 0) {
          data.isRebate = !!+data.isRebate;
          ['baseDiscountList', 'productDiscountList', 'matchingDiscountList', 'giftDiscountList']
            .forEach(key => !data[key].length && (data[key] = [initSingleData[key]()]));  // 设置页面初始值
          data.regularContractorList.forEach(item => (item.selected = true) && (item.merchantType = formatMerchantType(item.merchantType)));

          const companyOptions = JSON.parse(JSON.stringify(data.regularContractorList)); // 选中的公司信息
          const { selectedProductList, ...formData } = data;
          selectedProductList.forEach(item => item.selected = true);
          !data.regularContractorList.length && (data.regularContractorList = [initSingleData['regularContractorList']()]); // 设置页面初始值
         
          this.formData = data;
          this.$nextTick(() => {
            this.productOptions = selectedProductList;
            this.companyOptions = companyOptions;
          })
          this.spinShow = false;
        }
      } catch (error) {}
    },

    /**
     * 获取政策草稿详情
     * @param {String|NUmber} id: 政策id
     */
    async getDraftDeatil(id) {
      this.spinShow = true;
      try {
        let { code, data } = await this.$api.getContractPolicyDraftDetailV2({id});
        if (code === 0) {
          let { id, content } = data;
          content = JSON.parse(content);
          content.formData.id = id;
          this.formData = content.formData;
          
          this.$nextTick(() => ['companyOptions', 'productOptions'].forEach(key => this[key] = content[key]));
          this.spinShow = false;
        }
      } catch (error) {}
    },

    /**
     * 查询公司
     * @param {String} name: 公司名称
     */
    async remoteCompany(name) {
      if(!name.trim()) return false;
      this.remoteLoading = true;
      this.companyOptions = [ ...this.companyOptions.filter(item => item.selected) ];
      try {
        let res = await this.$api.cooperativeCustomerSearchPartner({name});
        if (res.code ===0) {
          this.companyOptions = removeRepeatItem([ ...this.companyOptions, ...res.data]);
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
        let res = await this.$api.getProductData({name});
        if (res.code ===0) {
          this.productOptions = removeRepeatItem([ ...this.productOptions, ...res.data], 'id');
          this.remoteLoading = false;
        }
      } catch (error) {
        this.remoteLoading = false;
      }
    },

    /**
     * 保存草稿 - 新增草稿/修改草稿
     */
    async saveDraft(params) {
      this.draftBtnLoading = true;
      try {
        let res = await this.$api.saveContractPolicyDraft(params);
        if (res.code === 0) {
          this.$Message.success('保存成功!');
          this.$router.push('/policy/policy-management');
          this.draftBtnLoading = false;
        }
      } catch (error) {
        this.draftBtnLoading = false;
      }
    },

    /**
     * 提交 - 添加 / 编辑
     * @param {String} state: 提交状态  add => 添加  edit => 编辑
     * @return {Object} obj: 状态策略机
     * @param {Function} obj.init: 初始化函数
     * @param {Object} params: 提交参数
     */
    submit(state) {
      const obj = {
        status: '',
        state: {
          add: async (params) => {
            try {
              let res = await this.$api.v2CreateContractPolicy(params);
              if (res.code === 0) {
                this.$Message.success('添加成功!');
                this.$router.push('/policy/policy-management');
                this.submitBtnLoading = false;
              }
            } catch (error) {
              this.submitBtnLoading = false;
            }
          },
          edit: async (params) => {
            try {
              let res = await this.$api.v2UpdateContractPolicy(params);
              if (res.code === 0) {
                this.$Message.success('编辑成功!');
                this.$router.push('/policy/policy-management');
                this.submitBtnLoading = false;
              }
            } catch (error) {
              this.submitBtnLoading = false;
            }
          }
        },
        init: (params) => {
          this.submitBtnLoading = true;
          return obj.state[obj.status](params);
        },
      }
      obj.status = state;
      return obj;
    },

    /**
     * 模糊查询下拉框 - 选中事件
     * 为选中项设置selected属性为true, 去除未选中的选项
     * @param {String|Number} id: 选中项id
     * @param {String} key: 选项列表属性名称
     * @param {Object} currentData: 当前数据
     */
    handleSelectOnChange(id, key, currentData) {
      let tempArr = this[key];
      tempArr.find(item => {
        if (item.id === id) {
          key === 'companyOptions' && (currentData.merchantType = formatMerchantType(item.merchantType)); // 手动设置显示公司类型
          return item.selected = true;
        }
      });
      this[key] = [ ...tempArr.filter(item => item.selected) ];
    },

    /**
     * 模糊查询下拉框 - 选中事件（需要返回label）
     * 为选中项设置selected属性为true, 去除未选中的选项
     * @param {Object} currentData: 当前数据
     * @param {String} prop: 需要在当前对象追加的属性名
     * @param {String} label: 当前选中项的文本
     * @param {String|Number} id: 选中项id
     * @param {String} optionsKey: 选项列表属性名称
     */
    handleSelectOnChangeHasLabel(currentData, prop, label, id, optionsKey) {
      let tempArr = this[optionsKey];
      currentData[prop] = label;
      tempArr.find(item => item.id === id && (item.selected = true));
      this[optionsKey] = [ ...tempArr.filter(item => item.selected) ];
    },

    /**
     * 类型选择器变化
     */
    handleTypeSelectOnChange(type, option, data) {
      switch (type) {
        case 'productDiscount':
          option === 'discount' ? 
            (delete data.directPrice && this.$set(data, 'proportion', '')) :
            (delete data.proportion && this.$set(data, 'directPrice', ''));
          data.directPriceTips = false;
          break;
        default:
          break;
      }
    },

    /**
     * 适用客户 - 单选框改变
     */
    handleRadioOnChange(option) {
      this.$nextTick(() => {
        if (option === 'contractor') {
          this.formData.assignMerchantType = '';
          this.$refs.form1.validateField('assignMerchantType');
        }
      })
    },

    /**
     * 基础折扣 - 货值计算
     * @param {String} startingAmount: 应收金额
     * @param {String} proportion: 折扣
     */
    handleCalcGoodsPrice(startingAmount, proportion) {
      if ((!startingAmount && !proportion) || (proportion && proportion > 100)) return '';
      if (+proportion === 0) return startingAmount;
      return this.$toFixed(startingAmount * (proportion / 1000), 4);
    },

    /**
     * 新增选项
     * @param {String} key: 映射表对应属性名
     * @param {Array} target: 需新增的数组
     */
    handleOnAddOption(key, target) {
      const obj = initSingleData[key]();
      target.push(obj);
    },

    /**
     * 移除选项
     * @param {String} target: 需新增选项模块目标
     * @param {Number} index: 需删除元素下标
     */
    handleOnRemoveOption(target, index) {
      target.splice(index, 1);
    },

    /**
     * 重置选项
     * @param {Array} sourceArr: 源目标数组
     * @param {NUmber} index: 需重置的下标
     * @param {String} key: 映射表对应属性名
     */
    handleOnResetOption(sourceArr, index, key) {
      const obj = initSingleData[key]();
      sourceArr.splice(index, 1, obj);
    },

    /**
     * 提交
     */
    handleSubmit() {
      this.$refs.form1.validate((valid) => {
        if (valid) {
          let params = JSON.parse(JSON.stringify(this.formData));
          // 过滤空白选项
          ['baseDiscountList', 'matchingDiscountList', 'giftDiscountList']
            .forEach(key => params[key] = params[key].filter(item => item.startingAmount));
          params.productDiscountList = params.productDiscountList.filter(item => item.objectId);

          params.isRebate = +params.isRebate;
          params.deadlineAt = new Date(params.deadlineAt).getTime() / 1000;
          params.regularType === 'contractor' && (params.regularContractorIdList = params.regularContractorList.map(item => item.contractorId));
          delete params.status;
          delete params.enableStatus;
          delete params.regularContractorList;

          this.submit(this.id ? 'edit' : 'add').init(params);
        } else {
          this.$Message.warning('请填写完整表单!');
        }
      })
    },

    /**
     * 保存草稿
     */
    handleDraft() {
      let content = {},
        id = this.id,
        policyName = this.formData.policyName;
      if (!policyName) return this.$Message.warning('政策名称不能为空!');

      ['formData', 'companyOptions', 'productOptions'].forEach(key => content[key] = this[key]);

      const params = { id, policyName, content: JSON.stringify(content) };
      this.saveDraft(params);
    },

    /**
     * 校验配赠活动
     * @param {String} type: 校验框类型
     * @param {*} value: 当前值
     * @param {Object} currentData: 当前行数据
     * @param {Function} callback: 回调
     */
    validateMatchingDiscount(type, value, currentData, callback) {
      const obj = deepflatToObject(currentData.detailList); // 扁平detailList数组
      const arr = [ ...new Set([...Object.values(obj), currentData.startingAmount]) ];

      if (arr.every(item => !item)) return callback(); // 全空
      if (validatorMapKey[type]) return validatorMapKey[type](value, callback);
      !value ? callback('请选择') : callback();
    },

    /**
     * 校验满赠活动
     * @param {String} type: 校验框类型
     * @param {*} value: 当前值
     * @param {Object} currentData: 当前行数据
     * @param {Function} callback: 回调
     */
    validateGiftDiscount(type, value, currentData, callback) {
      const obj = deepflatToObject(currentData.detailList); // 扁平detailList数组
      const arr = [ ...new Set([...Object.values(obj), currentData.startingAmount]) ];

      if (arr.every(item => !item)) return callback();
      if (validatorMapKey[type]) return validatorMapKey[type](value, callback);
      !value ? callback('请选择') : callback();
    },

    // 校验金额
    validatePrice(value, currentData, callback) {
      const arr = Object.values(currentData);

      if (arr.every(item => !item)) return callback(); // 全为空时
      validatorMapKey.cost(value, callback);
    },

    // 校验折扣/税率 
    validatePercent(value, currentData, callback) {
      const arr = Object.values(currentData);

      if (arr.every(item => !item)) return callback();
      if (value > 100) return callback('请输入有效折扣');
      validatorMapKey.discount(value, callback);
    },

    // 校验选项
    validateSelect(value, currentData, callback) {
     const arr = Object.values(currentData);

      if (arr.every(item => !item)) return callback();
      !value ? callback('请选择') : callback();
    }

  },
  mounted() {
    const { id, enableStatus } = this.$route.query;
    this.id = id;
    if (id) {
      enableStatus === 'draft' ? this.getDraftDeatil(id) : this.getDetail(id);
    }
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
  .ivu-col {
    padding-right: 10px;
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
  .form {
    .ivu-card {
      margin-top: 16px;
    }
    .small-select {
      width: 85px;
      margin-right: 5px;
    }
  }
  .gift {
    /deep/ .ivu-card-body {
      padding-left: 11px;
    }
    .small-select {
      width: 85px;
      margin-right: 5px;
    }
    .gift-row {
      margin-bottom: 16px;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .gift-box {
      padding: 10px 4px;
      border: 1px dashed #ccc;
      margin-right: 10px;
      .gift-content {
        margin-bottom: 16px;
        .gift-sub-content {
          display: flex;
          padding-left: 5px;
          .sub-content-btn {
            margin: 1px 0 0 15px;
          }
        }
      }
    }
  }
}
</style>