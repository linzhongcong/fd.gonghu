<template>
  <div class="policy-edit">
    <Card>
      <Row slot="title" type="flex" justify="end">
        <Button style="margin-right: 10px;" type="warning" :loading="draftBtnLoading" :disabled="submitBtnLoading" @click="handleDraft">保存为草稿</Button>
        <Button type="success" :loading="submitBtnLoading" :disabled="draftBtnLoading" @click="handleSubmit">提交</Button>
      </Row>
      <Form ref="form1" :model="baseInfo" :rules="baseInfoRules" :label-width="75" label-position="left">
        <!-- 基础信息 start -->
        <Card>
          <div slot="title"><span class="content-title">基础信息</span></div>
          <Row>
            <Col :md="7">
              <FormItem :label-width="85" label="政策名称：" prop="policyName">
                <Input v-model="baseInfo.policyName" placeholder="请输入" />
              </FormItem>
            </Col>
            <Col :md="7">
              <FormItem :label-width="110" label="有效截止日期：" prop="deadlineAt">
                <DatePicker v-model="baseInfo.deadlineAt" type="date" placeholder="请选择有效截止日期"></DatePicker>
              </FormItem>
            </Col>
            <Col :md="7">
              <FormItem label="税额扣减：" prop="taxDeduction">
                <Input style="width: 70px;" v-model="baseInfo.taxDeduction" />%
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
                <RadioGroup v-model="baseInfo.regularType" @on-change="handleRadioOnChange">
                  <Radio label="contractor">指定客户</Radio>
                  <div style="display: inline-block;">
                    <Row type="flex">
                      <Radio label="type">指定客户类型：</Radio>
                      <FormItem 
                        prop="assignMerchantType"
                        :rules="baseInfo.regularType === 'type' ? { required: true, message: '该项目不能为空', trigger: 'change'} : {}">
                        <Select v-model="baseInfo.assignMerchantType" :disabled="baseInfo.regularType === 'contractor'" style="width: 100px;">
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
          <div v-show="baseInfo.regularType === 'contractor'">
            <Row v-for="(contractor, index) in baseInfo.regularContractorList" :key="`company${index}`">
              <Col :md="7">
                <FormItem
                  label="公司名称："
                  :label-width="85"
                  :prop="`regularContractorList.${index}.contractorId`"
                  :rules="baseInfo.regularType === 'contractor' ? { required: true, message: '该选项不能为空', trigger: 'change' } : {}"
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
                <Button v-if="index === 0" @click="handleOnAddOption('regularContractorList', baseInfo.regularContractorList)">+</Button>
                <Button v-else @click="handleOnRemoveOption(baseInfo.regularContractorList, index)">-</Button>
              </Col>
            </Row>
          </div>
        </Card>
        <!-- 适用客户 end -->
      </Form>
      <!-- 基础折扣 start -->
      <Form class="form" ref="form2" :label-width="75" label-position="left">
        <Card>
          <div slot="title"><span class="content-title">基础折扣</span></div>
          <Row v-for="(item, index) in baseDiscountList" :key="`baseDiscountList${index}`">
            <Col :md="7">
              <FormItem label="应收金额：">
                <Input
                  v-model="item.startingAmount"
                  @on-blur="handleCalcGoodsPrice(item)"
                  @on-change="({target}) => handleValidateInputOnChange(target.value, item, 'startingAmountTips', 'cost')"/>
                <div class="ivu-form-item-error-tip" v-show="item.startingAmountTips">金额格式错误</div>
              </FormItem>
            </Col>
            <Col :md="5">
              <FormItem label="折扣：" :label-width="50">
                <div style="display: flex;">
                  <Input 
                    style="width: 90%;"
                    v-model="item.proportion"
                    @on-blur="handleCalcGoodsPrice(item)"
                    @on-change="({ target }) => handleValidateInputOnChange(target.value, item, 'proportionTips', 'discount')"/>%
                </div>
                <div class="ivu-form-item-error-tip" v-show="item.proportionTips">请保留2位小数</div>
              </FormItem>
            </Col>
            <Col :md="6">
              <FormItem label="货值：" :label-width="50">
                <Input :value="item.productAmount" style="width: 90%" disabled />
              </FormItem>
            </Col>
            <div>
              <RowButton
                :hide-add="index !== 0"
                @on-add="handleOnAddOption('baseDiscountList', baseDiscountList)"
                @on-remove="handleOnRemoveOption(baseDiscountList, index)"
                @on-reset="handleOnResetOption(baseDiscountList, index, 'baseDiscountList')">
              </RowButton>
            </div>
          </Row>
        </Card>
      </Form>
      <!-- 基础折扣 end -->
      <!-- 单品折扣 start -->
      <Form class="form" ref="form3" :label-width="75" label-position="left">
        <Card>
          <div slot="title"><span class="content-title">单品折扣</span></div>
          <Row v-for="(item, index) in productDiscountList" :key="`productDiscountList${index}`">
            <Col :md="7">
              <FormItem label="选择产品：">
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
            <Col :md="5">
              <FormItem :label-width="0">
                <div style="display: flex; margin-top: 2px;">
                  <Select class="small-select" v-model="item.objectName" @on-change="option => handleTypeSelectOnChange('productDiscount' ,option, item)">
                    <Option v-for="tOption in discountTypeOptions" :value="tOption.value" :label="tOption.label" :key="`discountTypeOptions${tOption.value}`"></Option>
                  </Select>
                  <template v-if="item.objectName === 'discount'">
                    <Input v-model="item.proportion" @on-change="({ target }) => handleValidateInputOnChange(target.value, item, 'directPriceTips', 'discount')" />%
                  </template>
                  <template v-else>
                   <Input v-model="item.directPrice" :disabled="!item.objectName" @on-change="({ target }) => handleValidateInputOnChange(target.value, item, 'directPriceTips', 'cost')" />
                  </template>
                </div>
                <div style="margin-left: 65px;" class="ivu-form-item-error-tip" v-show="item.directPriceTips">{{ `请保留${item.objectName === 'discount' ? 2 : 4}小数` }}</div>
              </FormItem>
            </Col>
            <div>
              <RowButton
                :hide-add="index !== 0"
                @on-add="handleOnAddOption('productDiscountList', productDiscountList)"
                @on-remove="handleOnRemoveOption(productDiscountList, index)"
                @on-reset="handleOnResetOption(productDiscountList, index, 'productDiscountList')">
              </RowButton>
            </div>
          </Row>
        </Card>
      </Form>
      <!-- 单品折扣 end -->
      <!-- 配赠活动 start -->
      <Form class="form" ref="form4" :label-width="75" label-position="left">
        <Card class="gift">
          <div slot="title"><span class="content-title">配赠活动</span></div>
          <Row class="gift-row" v-for="(item, index) in matchingDiscountList" :key="`matchingDiscountList${index}`">
            <Col class="gift-box" span="22">
              <Row> 
                <Col :md="9">
                  <FormItem label="配赠应收金额：" :label-width="100">
                    <Input 
                      v-model="item.startingAmount"
                      @on-change="({target}) => handleValidateInputOnChange(target.value, item, 'startingAmountTips', 'cost')"/>
                    <div class="ivu-form-item-error-tip" v-show="item.startingAmountTips">金额格式错误</div>
                  </FormItem>
                </Col>
              </Row>
              <div class="gift-content" v-for="(detail, dIndex) in item.detailList" :key="`${index}matchingActivityListDetailList${dIndex}`">
                <Row class="gift-sub-content">
                  <FormItem label="配赠比例：">
                    <Input 
                      v-model="detail.matchingMolecule"
                      style="width: 70px;"
                      @on-change="({target}) => handleValidateInputOnChange(target.value, detail, 'matchingMoleculeTips', 'int')"/> 比 
                    <Input
                      v-model="detail.matchingDenominator"
                      style="width: 70px;"
                      @on-change="({target}) => handleValidateInputOnChange(target.value, detail, 'matchingDenominatorTips', 'int')"/> 赠
                    <div class="ivu-form-item-error-tip" v-show="detail.matchingMoleculeTips">请填写整数</div>
                    <div style="margin-left: 95px;" class="ivu-form-item-error-tip" v-show="detail.matchingDenominatorTips">请填写整数</div>
                  </FormItem>
                  <div class="sub-content-btn">
                    <Button v-if="dIndex === 0" @click="handleOnAddOption('matchingDetailList', item.detailList)">+</Button>
                    <Button v-else @click="handleOnRemoveOption(item.detailList, dIndex)">-</Button>
                  </div>
                </Row>
                <Row v-for="(product, pIndex) in detail.productList" :key="`${index}${dIndex}matchingActivityListDetailListProductList${pIndex}`">
                  <Col :md="9">
                    <FormItem label="购买产品：">
                      <div style="display: flex;">
                        <Select v-model="product.conditionType" class="small-select">
                          <Option
                            v-for="(tOption, tIndex) in productTypeOptions"
                            :value="tOption.value"
                            :label="tOption.label"
                            :key="`productTypeOptions${tIndex}`">
                          </Option>
                        </Select>
                        <Select
                          v-model="product.conditionId"
                          filterable
                          label-in-value
                          :loading="remoteLoading"
                          :remote-method="remoteProductDeb"
                          @on-change="(data) => handleMidlleLabelSelectOnChange(data, product, 'conditionName', 'productOptions')">
                          <Option v-for="bpOption in productOptions" :value="bpOption.id" :label="bpOption.name" :key="`buyProductOptions${bpOption.id}`"></Option>
                        </Select>
                      </div>
                    </FormItem>
                  </Col>
                  <Col :md="9">
                    <FormItem label="可配赠产品：" :label-width="85">
                      <div style="display: flex;">
                        <Select v-model="product.objectName" class="small-select">
                          <Option
                            v-for="(gtOption, gtIndex) in productTypeOptions"
                            :value="gtOption.value"
                            :label="gtOption.label"
                            :key="`productTypeOptions${gtIndex}`">
                          </Option>
                        </Select>
                        <Select
                          v-model="product.objectId"
                          filterable
                          label-in-value
                          :loading="remoteLoading"
                          :remote-method="remoteProductDeb"
                          @on-change="(data) => handleMidlleLabelSelectOnChange(data, product, 'name', 'productOptions')">
                          <Option v-for="gpOption in productOptions" :value="gpOption.id" :label="gpOption.name" :key="`giftProductOptions${gpOption.id}`"></Option>
                        </Select>
                      </div>
                    </FormItem>
                  </Col>
                  <RowButton
                    :hide-add="pIndex !== 0"
                    @on-add="handleOnAddOption('matchingProductList', detail.productList)"
                    @on-remove="handleOnRemoveOption(detail.productList, pIndex)"
                    @on-reset="handleOnResetOption(detail.productList, pIndex, 'matchingProductList')">
                  </RowButton>
                </Row>
              </div>
            </Col>
            <Button v-if="index === 0" @click="handleOnAddOption('matchingDiscountList', matchingDiscountList)">+</Button>
            <Button v-else @click="handleOnRemoveOption(matchingDiscountList, index)">-</Button>
          </Row>
        </Card>
      </Form>
      <!-- 配赠活动 end -->
      <!-- 满赠活动 start -->
      <Form class="form" ref="form5" :label-width="75" label-position="left">
        <Card class="gift">
          <div slot="title"><span class="content-title">满赠活动</span></div>
          <Row class="gift-row" v-for="(item, index) in giftDiscountList" :key="`giftDiscountList${index}`">
            <Col class="gift-box" span="22">
              <Row>
                <Col :md="9">
                  <FormItem label="满赠应收金额：" :label-width="100">
                    <Input 
                      v-model="item.startingAmount"
                      @on-change="({target}) => handleValidateInputOnChange(target.value, item, 'startingAmountTips', 'cost')"/>
                    <div class="ivu-form-item-error-tip" v-show="item.startingAmountTips">金额格式错误</div>
                  </FormItem>
                </Col>
              </Row>
              <Row v-for="(gift, pIndex) in item.detailList" :key="`${index}detailList${pIndex}`">
                <Col :md="9">
                  <FormItem label="选择赠品：">
                    <div style="display: flex;">
                      <Select v-model="gift.objectName" style="width: 80px; margin-right: 5px;">
                        <Option
                          v-for="(tOption, tIndex) in productTypeOptions"
                          :value="tOption.value"
                          :label="tOption.label"
                          :key="`productTypeOptions${tIndex}`">
                        </Option>
                      </Select>
                      <Select
                        v-model="gift.objectId"
                        filterable
                        :loading="remoteLoading"
                        :remote-method="remoteProductDeb"
                        @on-change="(value) => handleSelectOnChange(value, 'productOptions')">
                        <Option v-for="pOption in productOptions" :value="pOption.id" :label="pOption.name" :key="`productOptions${pOption.id}`"></Option>
                      </Select>
                    </div>
                  </FormItem>
                </Col>
                <Col :md="9">
                  <FormItem label="可赠数量：">
                    <Input
                      v-model="gift.number"
                      style="width: 100px;"
                      @on-change="({target}) => handleValidateInputOnChange(target.value, gift, 'numberTips', 'int')"/>
                    <div class="ivu-form-item-error-tip" v-show="gift.numberTips">请填写整数</div>
                  </FormItem>
                </Col>
                <RowButton
                  :hide-add="pIndex !== 0"
                  @on-add="handleOnAddOption('giftDetailList', item.detailList)"
                  @on-remove="handleOnRemoveOption(item.detailList, pIndex)"
                  @on-reset="handleOnResetOption(item.detailList, pIndex, 'giftDetailList')">
                </RowButton>
              </Row>
            </Col>
            <Button v-if="index === 0" @click="handleOnAddOption('giftDiscountList', giftDiscountList)">+</Button>
            <Button v-else @click="handleOnRemoveOption(giftDiscountList, index)">-</Button>
          </Row>
        </Card>
      </Form>
      <!-- 满赠活动 end -->

      <Spin v-if="spinShow" fix></Spin>
    </Card>
  </div>  
</template>

<script>
import { merchantType, discountTypeOptions, productTypeOptions, formatMerchantType, initSingleData, calcGoodsPrice, taxationValidator, validateOtherForm, removeRepeatItem } from '@/utils/policy'
import RowButton from '@/components/policy/row-button.vue'
export default {
  name: 'policy-add',
  components: { RowButton },
  data() {
    return {
      id: '',
      merchantType,
      productTypeOptions,
      discountTypeOptions,
      spinShow: false,
      submitBtnLoading: false, // 提交按钮Loading
      draftBtnLoading: false, // 草稿按钮Loading

      baseInfo: { // 基础信息/适用客户
        policyName: '',
        deadlineAt: '', // 有效截止日期
        taxDeduction: 0,
        regularType: '', // 适用客户-单选按钮
        assignMerchantType: '', // 指定客户类型-类型
        regularContractorList: [{contractorId: '', merchantType: ''}] // 指定客户-公司名称
      },
      baseDiscountList: [ // 基础折扣
        { startingAmount: '', proportion: '', productAmount: '', }
      ], 
      productDiscountList: [ // 单品折扣
        { objectId: '', objectName: '', directPrice: '', }
      ],
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
      ],
      baseInfoRules: {
        'policyName': [{ required: true, message: '该选项不能为空', trigger: 'blur' }],
        'deadlineAt': [{ required: true, type: 'date', message: '该选项不能为空', trigger: 'change' }],
        'taxDeduction': [{ required: false, validator: taxationValidator, trigger: 'change' }],
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
        let res = await this.$api.v2GetContractPolicyDetail({id});
        if (res.code === 0) {
          let formData = {}, data = res.data;
          ['baseDiscountList', 'productDiscountList', 'matchingDiscountList', 'giftDiscountList']
            .forEach(key => formData[key] = data[key].length ? data[key] : [ initSingleData[key]() ]); // 设置页面初始值

          let { baseDiscountList, productDiscountList, matchingDiscountList, giftDiscountList, selectedProductList, ...baseInfo } = data;
          formData.baseInfo = baseInfo;
          selectedProductList.forEach(item => item.selected = true);
          baseInfo.regularContractorList.forEach(item => (item.selected = true) && (item.merchantType = formatMerchantType(item.merchantType)));
          const companyOptions = JSON.parse(JSON.stringify(baseInfo.regularContractorList)); // 选中的公司信息
          !baseInfo.regularContractorList.length && (baseInfo.regularContractorList = [ initSingleData['regularContractorList']() ]); // 设置页面初始值
          
          ['baseInfo', 'baseDiscountList', 'productDiscountList', 'matchingDiscountList', 'giftDiscountList']
            .forEach(key => this[key] = formData[key]); // 赋值
          
          this.$nextTick(() => {
            this.productOptions = selectedProductList;
            this.companyOptions = companyOptions;
          })

          this.spinShow = false;
        }
      } catch (error) {
        
      }
    },

    /**
     * 获取政策草稿详情
     * @param {String|NUmber} id: 政策id
     */
    async getDraftDeatil(id) {
      this.spinShow = true;
      try {
        let res = await this.$api.v2GetContractPolicyDraftDetail({id});
        if (res.code === 0) {
          let { id, content } = res.data;
          content = JSON.parse(content);
          content.baseInfo.id = id;
          ['baseInfo', 'baseDiscountList', 'productDiscountList', 'matchingDiscountList', 'giftDiscountList']
            .forEach(key => this[key] = content[key]);
          
          this.$nextTick(() => ['companyOptions', 'productOptions'].forEach(key => this[key] = content[key]));
          this.spinShow = false;
        }
      } catch (error) {
        
      }
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
          this.productOptions = removeRepeatItem([ ...this.productOptions, ...res.data]);
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
     * 配赠活动产品 - 选择器中间处理
     * @param {Object} data: 当前选中数据
     * @param {Object} curentData:  当前数据
     * @param {String} prop: 需要在当前对象追加的属性名
     * @param {String} optionsKey: 选项列表属性名称
     */
    handleMidlleLabelSelectOnChange(data, currentData, prop, optionsKey) {
      if (!data) return false;
      this.handleSelectOnChangeHasLabel(currentData, prop, data.label, data.value, optionsKey);
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
          this.baseInfo.assignMerchantType = '';
          this.$refs.form1.validateField('assignMerchantType');
        }
      })
    },

    /**
     * 基础折扣 - 货值计算
     * @param {Object} currentData: 当前行数据
     */
    handleCalcGoodsPrice(currentData) {
      const { startingAmount, proportion } = currentData;
      currentData.productAmount = (startingAmount !== null && proportion !== null) ? calcGoodsPrice(+startingAmount, proportion) : '';
    },

    /**
     * 金额/折扣/整数 输入框内容校验
     * @param {String|Number} value: 当前值
     * @param {Object} currentData: 当前行数据
     * @param {String} key: 显示提示语属性
     * @param {String} type: 校验类型 int -> 整数， cost -> 金额， discount -> 折扣
     */
    handleValidateInputOnChange(value, currentData, key, type) {
      if (!value) return currentData[key] = false;
      let res = false;
      const reg = type === 'cost' ? (/^(([1-9]\d*)|0)(\.\d{1,4})?$/) :
                    type === 'discount' ? (/^(([1-9]\d*)|0)(\.\d{1,2})?$/) : (/^\d*$/);
      res = !reg.test(value);
      currentData[key] = res;
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
          const otherFormArr = [
            { errMsg: '请填写完整基础折扣', data: this.baseDiscountList },
            { errMsg: '请填写完整单品折扣', data: this.productDiscountList },
            { errMsg: '请填写完整配赠活动', data: this.matchingDiscountList },
            { errMsg: '请填写完整满赠活动', data: this.giftDiscountList }
          ]
          validateOtherForm(otherFormArr)
            .then(({validRes, msg}) => {
              if (!validRes) return this.$Message.warning(msg);
              let baseDiscountList = this.baseDiscountList.filter(item => item.productAmount),
                productDiscountList = this.productDiscountList.filter(item => item.objectId),
                giftDiscountList = this.giftDiscountList.filter(item => item.startingAmount),
                matchingDiscountList = this.matchingDiscountList.filter(item => item.startingAmount),
                params = { ...this.baseInfo, baseDiscountList, productDiscountList, giftDiscountList, matchingDiscountList, };
              params = JSON.parse(JSON.stringify(params));
              // 数据结构转换
              params.deadlineAt = new Date(params.deadlineAt).getTime() / 1000;
              params.regularType === 'contractor' && (params.regularContractorIdList = params.regularContractorList.map(item => item.contractorId));
              delete params.regularContractorList;
              delete params.status;
              delete params.enableStatus;

              this.submit(this.id ? 'edit' : 'add').init(params);
            })
        }
      })
    },

    /**
     * 保存草稿
     */
    handleDraft() {
      let content = {},
        id = this.id,
        policyName = this.baseInfo.policyName;
      if (!policyName) return this.$Message.warning('政策名称不能为空!');

      ['baseInfo', 'baseDiscountList', 'productDiscountList', 'matchingDiscountList', 'giftDiscountList', 'companyOptions', 'productOptions']
        .forEach(key => content[key] = this[key]);

      const params = { id, policyName, content: JSON.stringify(content) };
      this.saveDraft(params);
    },
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