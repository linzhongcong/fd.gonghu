<template>
  <div class="review-edit">
    <Card>
      <Row slot="title" type="flex" justify="end">
        <Button :disabled="submitBtnLoading || draftBtnLoading" @click="goBack">返回</Button>
        <Button type="warning" :loading="draftBtnLoading" :disabled="submitBtnLoading" @click="saveDraft">保存为草稿</Button>
        <Button type="success" :loading="submitBtnLoading" :disabled="draftBtnLoading" @click="handleSubmit">提交</Button>
      </Row>
      <!--  -->
      <Form ref="form1" :model="formData" :rules="formDataRules" :label-width="95">
        <!-- 基础信息 start -->
        <Card>
          <div slot="title">
            <h3>基础信息</h3>
          </div>
          <Row>
            <Col :md="8">
              <FormItem label="商家名称：" prop="merchantId">
                <Select
                  v-model="formData.merchantId"
                  filterable
                  :loading="remoteContractLoading"
                  :remote-method="remoteContractDeb"
                  clearable
                  @on-change="val => handleMerchantOnChange(val)">
                  <Option
                    v-for="(item, index) in contractOptions"
                    :value="item.id"
                    :label="item.merchantName"
                    :key="`contractOptions${index}`">
                  </Option>
                </Select>
              </FormItem>
            </Col>
            <Col :md="8">
              <FormItem label="系统/门店：" prop="systemInfoId">
                <Select v-model="formData.systemInfoId" label-in-value @on-change="handleSystemInfoOnChange">
                  <Option
                    v-for="(item, index) in systemInfoOptions"
                    :value="item.id"
                    :label="item.name"
                    :key="`systemInfoOptions${index}`">
                  </Option>
                </Select>
              </FormItem>
            </Col>
            <Col :md="8">
              <FormItem label="下单时间：" prop="orderTime">
                <DatePicker style="width: 100%" v-model="formData.orderTime" type="date" placeholder="请选择有效截止日期"></DatePicker>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :md="16">
              <FormItem label="收货地址：" prop="contractorReceivingAddrGroupId">
                <Select v-model="formData.contractorReceivingAddrGroupId" @on-change="handleAddressOnChange">
                  <Option 
                    v-for="(item, index) in contractorReceivingAddrGroupOptions"
                    :value="item.id"
                    :label="item.receivingAddress"
                    :key="`contractorReceivingAddrGroupOptions${index}`">
                  </Option>
                </Select>
              </FormItem>
            </Col>
            <Col :md="8">
              <FormItem label="发货方式：" prop="deliveryMode">
                <Select v-model="formData.deliveryMode">
                  <Option
                    v-for="(item, index) in deliveryMethodOptions"
                    :value="item.value"
                    :label="item.label"
                    :key="`deliveryMethodOptions${index}`">
                  </Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :md="8">
              <FormItem label="联系人：">
                <div>{{ formData.contactName }}</div>
              </FormItem>
            </Col>
            <Col :md="8">
              <FormItem label="联系方式：">
                <div>{{ formData.contactPhone }}</div>
              </FormItem>
            </Col>
            <Col :md="8">
              <FormItem label="业务员：" prop="salesmanId">
                <Select v-model="formData.salesmanId" label-in-value @on-change="handleSalesmanOnChange">
                  <Option
                    v-for="(item, index) in followUserOptions"
                    :value="item.followId"
                    :label="item.fullName"
                    :key="`followUserOptions${index}`">
                  </Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :md="8">
              <FormItem label="结款方式：" prop="paymentMethod">
                <Select v-model="formData.paymentMethod" @on-change="handlePaymentMethodOnChange">
                  <Option
                    v-for="(item, index) in paymentMethodOptions"
                    :value="item.value"
                    :label="item.label"
                    :key="`paymentMethodOptions${index}`">
                  </Option>
                </Select>
              </FormItem>
            </Col>
            <Col :md="8" v-if="formData.paymentMethod === 'spotCash'">
              <FormItem label="收款方式：" prop="paymentType">
                <Select v-model="formData.paymentType" @on-change="handlePaymentTypeOnChange">
                  <Option
                    v-for="(item, index) in paymentTypeOptions"
                    :value="item.value"
                    :label="item.label"
                    :key="`paymentTypeOptions${index}`">
                  </Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <template v-if="!!formData.paymentType">
            <Row>
              <Col :md="8">
                <FormItem
                  prop="accountNumber"
                  :rules="{required: true, message: '该选项不能为空', trigger: 'change'}"
                  :label="formData.paymentType === 'alipay' ? '支付宝账号：' : '银行账号：'">
                  <Select v-model="formData.accountNumber" filterable label-in-value @on-change="handleAccountNumberOnChange">
                    <Option
                      v-for="(item, index) in accountOptions"
                      :value="item.accountNumber || item.alipayNumber"
                      :label="item.accountName || item.alipayName"
                      :key="`accountOptions${index}`">
                    </Option>
                  </Select>
                </FormItem>
              </Col>
              <Col :md="8">
                <FormItem :label="formData.paymentType === 'alipay' ? '支付宝户名：' : '银行户名：'">
                  <Input :value="formData.accountName" disabled />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col :md="8">
                <FormItem
                  prop="paymentDate"
                  label="汇款日期"
                  :rules="{required: true, type: 'date', message: '该选项不能为空', trigger: 'change'}">
                  <DatePicker type="date" v-model="formData.paymentDate"></DatePicker>
                </FormItem>
              </Col>
              <Col :md="8">
                <FormItem 
                  prop="paymentMoney"
                  label="汇款金额"
                  :rules="{required: true, validator: validPaymentMoney, trigger: 'change'}">
                  <Input v-model.trim="formData.paymentMoney" />
                </FormItem>
              </Col>
            </Row>
          </template>
          <Row>
            <Col>
              <FormItem label="附件凭证：" prop="orderFile">
                <Upload
                  name="UploadForm[file]"
                  :max-size="2048"
                  :action="fileUploadURL"
                  :headers="fileUploadHeaders"
                  :on-preview="handleOnPreviewFile"
                  :default-file-list="formData.orderFile"
                  :before-upload="handleFileBeforeUpload"
                  :on-success="handleFileUploadSuccess"
                  :on-error="handleFileUploadError"
                  :on-remove="handleRemoveFile"
                  :on-exceeded-size="handleFileExceededSize">
                  <Button icon="md-add" size="large" :disabled="fileUploading || formData.orderFile.length === 3"></Button>
                </Upload>
              </FormItem>
            </Col>
          </Row>
        </Card>
        <!-- 基础信息 end -->
        <Card>
          <div slot="title">
            <h3>政策与产品明细</h3>
          </div>

          <!-- 供货政策 start -->
          <div class="policy">
            <Row>
              <div class="sub-title">政策</div>
              <Col :md="16">
                <FormItem label="供货政策：" :label-width="85" prop="contractPolicyId">
                  <Select
                    clearable
                    filterable
                    class="policy-select"
                    :loading="remotePolicyLoading"
                    v-model="formData.contractPolicyId"
                    @on-change="val => handlePolicyOnChange(val)">
                    <Option
                      v-for="(item, index) in policyOptions"
                      :value="item.id"
                      :label="item.policyName"
                      :key="`policyOptions${index}`">
                    </Option>
                  </Select>
                  <a href="javascript:;" @click="handleShowPolicy(formData.contractPolicyId)">查看政策</a>
                </FormItem>
              </Col>
              <Col :md="8">
                <FormItem label="扣减税额：">
                  <span>{{ formData.taxDeduction }}</span>
                </FormItem>
              </Col>
            </Row>
          </div>
          <!-- 供货政策 end -->
          <!-- 产品清单 start -->
          <div class="product margin-bottom-10">
            <div class="sub-title">产品订单</div>
            <!-- 头部 -->
            <Row>
              <Col :md="3"><div class="product-title">产品名称</div></Col>
              <Col :md="3"><div class="product-title">条码</div></Col>
              <Col :md="2"><div class="product-title">规格</div></Col>
              <Col :md="2"><div class="product-title">单位</div></Col>
              <Col :md="2"><div class="product-title">零售价</div></Col>
              <Col :md="2"><div class="product-title">折扣</div></Col>
              <Col :md="2"><div class="product-title">订货数量</div></Col>
              <Col :md="2"><div class="product-title">货值</div></Col>
              <Col :md="2"><div class="product-title">订货应收</div></Col>
              <Col :md="2"><div class="product-title">箱规</div></Col>
            </Row>
            <!-- 内容 -->
            <Row v-for="(item, index) in formData.productList" :key="`formData.productList${index}`">
              <!-- 产品名称 -->
              <Col :md="3">
                <FormItem
                  :label-width="0"
                  :prop="`productList[${index}].id`"
                  :rules="{ required: false, validator: validProduct, trigger: 'change' }">
                  <Select
                    v-model="item.id"
                    clearable
                    filterable
                    :loading="remoteProductLoading"
                    :remote-method="remoteProductDeb"
                    :disabled="!formData.contractPolicyId || productDiscountSpin"
                    @on-change="val => handleOrderProductOnChange(val, item, index)">
                    <Option
                      v-for="(pOption, pIndex) in productOptions"
                      :value="pOption.pro_id"
                      :label="pOption.pro_name"
                      :key="`${index}productOptions${pIndex}`">
                      </Option>
                  </Select>
                </FormItem>
              </Col>
              <!-- 条码 -->
              <Col :md="3">
                <FormItem :label-width="0">
                  <Poptip trigger="hover" :disabled="!item.barcode" :content="item.barcode">
                    <Input :value="item.barcode" disabled />
                  </Poptip>
                </FormItem>
              </Col>
              <!-- 规格 -->
              <Col :md="2">
                <FormItem :label-width="0">
                  <Input :value="item.standard" disabled />
                </FormItem>
              </Col>
              <!-- 单位 -->
              <Col :md="2">
                <FormItem :label-width="0">
                  <Input :value="item.unit" disabled />
                </FormItem>
              </Col>
              <!-- 零售价 -->
              <Col :md="2">
                <FormItem :label-width="0">
                  <Input :value="item.price" disabled />
                </FormItem>
              </Col>
              <!-- 折扣 -->
              <Col :md="2">
                <FormItem :label-width="0">
                  <Input :value="item.discount" disabled />
                </FormItem>
              </Col>
              <!-- 订货数量 -->
              <Col :md="2">
                <FormItem
                  :label-width="0"
                  :prop="`productList[${index}].number`"
                  :rules="{ required: false, validator: validProductNumber, trigger: 'change'}">
                  <InputNumber 
                    :min="1"
                    v-model="item.number"
                    :disabled="!item.id || productDiscountSpin"
                    @on-change="val => productNumerOnChangeDeb(val, item)" />
                </FormItem>
              </Col>
              <!-- 货值 -->
              <Col :md="2">
                <FormItem :label-width="0">
                  <Poptip trigger="hover" :disabled="!item.productAmount" :content="item.productAmount">
                    <Input :value="item.productAmount" disabled />
                  </Poptip>
                </FormItem>
              </Col>
              <!-- 订货应收 -->
              <Col :md="2">
                <FormItem :label-width="0">
                  <Poptip trigger="hover" :disabled="!item.totalPrice" :content="item.totalPrice">
                    <Input :value="item.totalPrice" disabled />
                  </Poptip>
                </FormItem>
              </Col>
              <!-- 箱规 -->
              <Col :md="2">
                <FormItem :label-width="0">
                  <Input :value="item.boxStandard" disabled />
                </FormItem>
              </Col>
              <Col :md="1">
                <Button v-if="index === 0" :disabled="productDiscountSpin" @click="handleAddOption('productList', formData.productList)">+</Button>
                <Button v-else :disabled="productDiscountSpin" @click="handleRemoveOption('productList', formData.productList, index)">-</Button>
              </Col>
            </Row>
          </div>
          <!-- 产品清单 end -->

          <!-- 赠送区域 start -->
          <div class="gift">
            <!-- 配赠清单 start -->
            <div class="product" v-if="formData.matchingProductList.length > 0">
              <div class="sub-title">配赠清单</div>
              <Row>
                <Col :md="8">
                  <FormItem label="总配赠数量：" :label-width="85">
                    <Input :value="totalMatchingProductNumber" disabled />
                  </FormItem>
                </Col>
                <Col :md="8">
                  <FormItem label="总配赠货值：" :label-width="85">
                    <Input :value="totalMatchingProductPrice" disabled />
                  </FormItem>
                </Col>
              </Row>
              <!-- 头部 -->
              <Row>
                <Col :md="3"><div class="product-title">产品名称</div></Col>
                <Col :md="3"><div class="product-title">条码</div></Col>
                <Col :md="2"><div class="product-title">规格</div></Col>
                <Col :md="2"><div class="product-title">单位</div></Col>
                <Col :md="2"><div class="product-title">零售价</div></Col>
                <Col :md="2"><div class="product-title">配赠数量</div></Col>
                <Col :md="2"><div class="product-title">可赠数量</div></Col>
                <Col :md="2"><div class="product-title">配赠货值</div></Col>
                <Col :md="2"><div class="product-title">箱规</div></Col>
              </Row>
              <!-- 内容 -->
              <Row v-for="(item, index) in formData.matchingProductList" :key="`matchingProductList${index}`">
                <!-- 产品名称 -->
                <Col :md="3">
                  <FormItem :label-width="0">
                    <Poptip trigger="hover" :content="item.name">
                      <Input :value="item.name" disabled />
                    </Poptip>
                  </FormItem>
                </Col>
                <!-- 条码 -->
                <Col :md="3">
                  <FormItem :label-width="0">
                    <Poptip trigger="hover" :content="item.barcode">
                      <Input :value="item.barcode" disabled />
                    </Poptip>
                  </FormItem>
                </Col>
                <!-- 规格 -->
                <Col :md="2">
                  <FormItem :label-width="0">
                    <Input :value="item.standard" disabled />
                  </FormItem>
                </Col>
                <!-- 单位 -->
                <Col :md="2">
                  <FormItem :label-width="0">
                    <Input :value="item.unit" disabled />
                  </FormItem>
                </Col>
                <!-- 零售价 -->
                <Col :md="2">
                  <FormItem :label-width="0">
                    <Input :value="item.price" disabled />
                  </FormItem>
                </Col>
                <!-- 配赠数量 -->
                <Col :md="2">
                  <FormItem
                    :label-width="0"
                    :prop="`matchingProductList[${index}].number`"
                    :rules="{ required: false, validator: (rule, val, cb) => validGiftNumber(val, item.maxNumber, cb) }">
                    <InputNumber 
                      v-model="item.number"
                      :min="0"
                      @on-change="val => handleGiftNumberOnChange('matching', val, item, index)"/>
                  </FormItem>
                </Col>
                <!-- 可赠数量 -->
                <Col :md="2">
                  <FormItem :label-width="0">
                    <Poptip trigger="hover" :content="item.maxNumber">
                      <Input :value="item.maxNumber" disabled />
                    </Poptip>
                  </FormItem>
                </Col>
                <!-- 配赠货值 -->
                <Col :md="2">
                  <FormItem :label-width="0">
                    <Poptip trigger="hover" :content="$toFixed(item.number * item.price, 4)">
                      <Input :value="$toFixed(item.number * item.price, 4)" disabled />
                    </Poptip>
                  </FormItem>
                </Col>
                <!-- 箱规 -->
                <Col :md="2">
                  <FormItem :label-width="0">
                    <Input :value="item.boxStandard" disabled />
                  </FormItem>
                </Col>
              </Row>
            </div>
            <!-- 配赠清单 end -->

            <!-- 满赠清单 start -->
            <div class="product" v-if="formData.giftProductList.length > 0">
              <div class="sub-title">满赠清单</div>
              <Row>
                <Col :md="8">
                  <FormItem label="总满赠数量：" :label-width="85">
                    <Input :value="totalGiftProductNumber" disabled />
                  </FormItem>
                </Col>
                <Col :md="8">
                  <FormItem label="总满赠货值：" :label-width="85">
                    <Input :value="totalGiftProductPrice" disabled />
                  </FormItem>
                </Col>
              </Row>
              <!-- 头部 -->
              <Row>
                <Col :md="3"><div class="product-title">产品名称</div></Col>
                <Col :md="3"><div class="product-title">条码</div></Col>
                <Col :md="2"><div class="product-title">规格</div></Col>
                <Col :md="2"><div class="product-title">单位</div></Col>
                <Col :md="2"><div class="product-title">零售价</div></Col>
                <Col :md="2"><div class="product-title">满赠数量</div></Col>
                <Col :md="2"><div class="product-title">可赠数量</div></Col>
                <Col :md="2"><div class="product-title">满赠货值</div></Col>
                <Col :md="2"><div class="product-title">箱规</div></Col>
              </Row>
              <!-- 内容 -->
              <Row v-for="(item, index) in formData.giftProductList" :key="`giftProductList${index}`">
                <!-- 产品名称 -->
                <Col :md="3">
                  <FormItem :label-width="0">
                    <Poptip trigger="hover" :content="item.name">
                      <Input :value="item.name" disabled />
                    </Poptip>
                  </FormItem>
                </Col>
                <!-- 条码 -->
                <Col :md="3">
                  <FormItem :label-width="0">
                    <Poptip trigger="hover" :content="item.barcode">
                      <Input :value="item.barcode" disabled />
                    </Poptip>
                  </FormItem>
                </Col>
                <!-- 规格 -->
                <Col :md="2">
                  <FormItem :label-width="0">
                    <Input :value="item.standard" disabled />
                  </FormItem>
                </Col>
                <!-- 单位 -->
                <Col :md="2">
                  <FormItem :label-width="0">
                    <Input :value="item.unit" disabled />
                  </FormItem>
                </Col>
                <!-- 零售价 -->
                <Col :md="2">
                  <FormItem :label-width="0">
                    <Input :value="item.price" disabled />
                  </FormItem>
                </Col>
                <!-- 配赠数量 -->
                <Col :md="2">
                  <FormItem
                    :label-width="0"
                    :prop="`giftProductList[${index}].number`"
                    :rules="{ required: false, validator: (rule, val, cb) => validGiftNumber(val, item.maxNumber, cb) }">
                    <InputNumber 
                      v-model="item.number"
                      :min="0"
                      @on-change="val => handleGiftNumberOnChange('gift', val, item, index)"/>
                  </FormItem>
                </Col>
                <!-- 可赠数量 -->
                <Col :md="2">
                  <FormItem :label-width="0">
                    <Poptip trigger="hover" :content="item.maxNumber">
                      <Input :value="item.maxNumber" disabled />
                    </Poptip>
                  </FormItem>
                </Col>
                <!-- 配赠货值 -->
                <Col :md="2">
                  <FormItem :label-width="0">
                    <Poptip trigger="hover" :content="$toFixed(item.number * item.price, 4)">
                      <Input :value="$toFixed(item.number * item.price, 4)" disabled />
                    </Poptip>
                  </FormItem>
                </Col>
                <!-- 箱规 -->
                <Col :md="2">
                  <FormItem :label-width="0">
                    <Input :value="item.boxStandard" disabled />
                  </FormItem>
                </Col>
              </Row>
            </div>
            <!-- 满赠清单 end -->
            <Spin v-if="productDiscountSpin" fix></Spin>
          </div>
          <!-- 赠送区域 end -->

          <!-- 返点清单 start -->
          <div class="product margin-bottom-10">
            <div class="sub-title">返点清单</div>
            <!-- 头部 -->
            <Row>
              <Col :md="3"><div class="product-title">产品名称</div></Col>
              <Col :md="3"><div class="product-title">条码</div></Col>
              <Col :md="2"><div class="product-title">规格</div></Col>
              <Col :md="2"><div class="product-title">单位</div></Col>
              <Col :md="2"><div class="product-title">零售价</div></Col>
              <Col :md="2"><div class="product-title">订货数量</div></Col>
              <Col :md="2"><div class="product-title">货值</div></Col>
              <Col :md="2"><div class="product-title">订货应收</div></Col>
              <Col :md="2"><div class="product-title">箱规</div></Col>
            </Row>
            <!-- 内容 -->
            <Row v-for="(item, index) in formData.backPointProductList" :key="`formData.backPointProductList${index}`">
              <!-- 产品名称 -->
              <Col :md="3">
                <FormItem :label-width="0">
                  <Select
                    v-model="item.id"
                    clearable
                    filterable
                    :loading="remoteProductLoading"
                    :remote-method="remoteProductDeb"
                    :disabled="!formData.contractPolicyId"
                    @on-change="val => handleBackPointProductOnChange(val, item, index)">
                    <Option
                      v-for="(pOption, pIndex) in productOptions"
                      :value="pOption.pro_id"
                      :label="pOption.pro_name"
                      :key="`${index}backPoint-ProductOptions${pIndex}`">
                      </Option>
                  </Select>
                </FormItem>
              </Col>
              <!-- 条码 -->
              <Col :md="3">
                <FormItem :label-width="0">
                  <Poptip trigger="hover" :disabled="!item.barcode" :content="item.barcode">
                    <Input :value="item.barcode" disabled />
                  </Poptip>
                </FormItem>
              </Col>
              <!-- 规格 -->
              <Col :md="2">
                <FormItem :label-width="0">
                  <Input :value="item.standard" disabled />
                </FormItem>
              </Col>
              <!-- 单位 -->
              <Col :md="2">
                <FormItem :label-width="0">
                  <Input :value="item.unit" disabled />
                </FormItem>
              </Col>
              <!-- 零售价 -->
              <Col :md="2">
                <FormItem :label-width="0">
                  <Input :value="$toFixed(item.price, 4)" disabled />
                </FormItem>
              </Col>
              <!-- 订货数量 -->
              <Col :md="2">
                <FormItem
                  :label-width="0"
                  :prop="`backPointProductList[${index}].number`"
                  :rules="{ required: false, validator: validProductNumber, trigger: 'change'}">
                  <InputNumber 
                    :min="0"
                    v-model="item.number"
                    :disabled="!item.id"/>
                </FormItem>
              </Col>
              <!-- 货值 -->
              <Col :md="2">
                <FormItem :label-width="0">
                  <Poptip trigger="hover" :content="$toFixed(item.price * item.number, 4)">
                    <Input :value="$toFixed(item.price * item.number, 4)" disabled />
                  </Poptip>
                </FormItem>
              </Col>
              <!-- 订货应收 -->
              <Col :md="2">
                <FormItem :label-width="0">
                  <Poptip trigger="hover" :content="$toFixed(item.price * item.number, 4)">
                    <Input :value="$toFixed(item.price * item.number, 4)" disabled />
                  </Poptip>
                </FormItem>
              </Col>
              <!-- 箱规 -->
              <Col :md="2">
                <FormItem :label-width="0">
                  <Input :value="item.boxStandard || item.box_standard" disabled />
                </FormItem>
              </Col>
              <Col :md="1">
                <Button v-if="index === 0" :disabled="productDiscountSpin" @click="handleAddOption('backPointProductList', formData.backPointProductList)">+</Button>
                <Button v-else :disabled="productDiscountSpin" @click="handleRemoveOption('backPointProductList', formData.backPointProductList, index)">-</Button>
              </Col>
            </Row>
          </div>
          <!-- 返点清单 end -->

          <!-- 金额统计 start -->
          <div class="product">
            <div class="sub-title">金额统计</div>
            <Row>
              <Col :md="8">
                <FormItem label="订单应收金额：" :label-width="100">
                  <Input :value="$toFixed(formData.totalOrderAmount, 4)" disabled />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col :md="12">
                <FormItem label="订单备注：" :label-width="100">
                  <Input v-model="formData.remark" type="textarea" />
                </FormItem>
              </Col>
            </Row>
          </div>
          <!-- 金额统计 end -->
        </Card>
      </Form>
      <Spin v-if="detailSpinShow" fix></Spin>
    </Card>

    <!-- 政策详情 start -->
    <PolicyDetailModal ref="policyDetailModal"></PolicyDetailModal>
    <!-- 政策详情 end -->
  </div>  
</template>

<script>
import Cookies from 'js-cookie';
import { SERVER_BASE_URL } from '@/api/config';
import { removeRepeatItem } from '@/utils/common.js'
import { initData, validOrderFile, hasProduct } from '@/utils/order.js';
import PolicyDetailModal from '@/components/policy/policy-detail-modal.vue';

export default {
  components: { PolicyDetailModal },
  data() {
    return {
      detailSpinShow: false,
      submitBtnLoading: false,
      draftBtnLoading: false,

      // 文件上传
      fileUploading: false, // 文件上传标识
      fileUploadURL: `${SERVER_BASE_URL}/v1/upload/create`, // 文件上传地址
      fileUploadHeaders: { // 文件上传头部信息
        Authorization: Cookies.get('authorization'),
      },
      
      // 表单
      formData: {
        paymentMethod: '',
        paymentType: '',
        accountNumber: '',
        accountName: '',
        orderFile: [], // 附件
        productList: [ { id: '', number: 1 } ], // 产品订单
        backPointProductList: [ {id: '', number: 1} ], // 返点产品清单
        matchingProductList: [], // 配赠清单
        giftProductList: [], // 满赠清单
      },
      formDataRules: { // 表单规则
        merchantId: [{ required: true, message: '该选项不能为空', trigger: 'change' }],
        systemInfoId: [{ required: true, message: '该选项不能为空', trigger: 'change' }],
        orderTime: [{ required: true, type: 'date', message: '该选项不能为空', trigger: 'change' }],
        contractorReceivingAddrGroupId: [{ required: true, message: '该选项不能为空', trigger: 'change' }],
        deliveryMode: [{ required: true, message: '该选项不能为空', trigger: 'change' }],
        salesmanId: [{ required: true, message: '该选项不能为空', trigger: 'change' }],
        paymentMethod: [{ required: true, message: '该选项不能为空', trigger: 'change' }],
        paymentType: [{ required: true, message: '该选项不能为空', trigger: 'change' }],
        accountNumber: [{ required: true, message: '该选项不能为空', trigger: 'change' }],
        alipayNumber: [{ required: true, message: '该选项不能为空', trigger: 'change' }],
        contractPolicyId: [{ required: true, message: '该选项不能为空', trigger: 'change' }],
        orderFile: [{ required: true, validator: (rule, value, callback) => validOrderFile(this.formData.orderFile, callback), trigger: 'change' }],
      },
      
      // 选项
      systemInfoOptions: [], // 系统/门店数据 
      contractorReceivingAddrGroupOptions: [], // 收货地址+联系人 数据
      followUserOptions: [], // 业务员选项
      paymentMethodOptions: [], // 结款方式 
      accountOptions: [], // 账户选项
      soucreAccountOptions: [], // 账户选项源数组
      paymentTypeOptions: [ // 付款方式
        { value: 'bank', label: '银行转账' },
        { value: 'alipay', label: '支付宝转账' },
      ],
      deliveryMethodOptions: [ // 发货方式
        { value: 'express', label: '快递' },
        { value: 'logistics', label: '物流' },
      ],
      
      // 供货政策
      remotePolicyLoading: false,
      policyOptions: [], // 供货政策选项

      // 远程查询公司名称
      remoteContractLoading: false,
      remoteContractDeb: this.$debonce(this.remoteContract, 500),
      contractOptions: [], // 公司数据列表

      // 远程查询产品
      remoteProductLoading: false,
      remoteProductDeb: this.$debonce(this.remoteProduct, 500),
      productOptions: [],

      // 产品订单 - 订货数量 防抖
      productDiscountSpin: false,
      productNumerOnChangeDeb: this.$debonce(this.handleProductNumerOnChange, 500),
    }
  },
  computed: {
    totalMatchingProductNumber() { // 总配赠数量
      const matchingProductList = this.formData.matchingProductList;
      return matchingProductList.reduce((acc, { number }) => acc + number, 0);
    },
    totalMatchingProductPrice() { // 总配赠货值
      const matchingProductList = this.formData.matchingProductList;
      return this.$toFixed(matchingProductList.reduce((acc, { number, price }) => acc + number * price, 0), 4);
    },
    totalGiftProductNumber() { // 总满赠数量
      const giftProductList = this.formData.giftProductList;
      return giftProductList.reduce((acc, { number }) => acc + number, 0);
    },
    totalGiftProductPrice() { // 总满赠货值
      const giftProductList = this.formData.giftProductList;
      return this.$toFixed(giftProductList.reduce((acc, { number, price }) => acc + number * price, 0), 4);
    },
  },
  methods: {
    /**
     * 订单提交
     * @param {Object} params: 提交数据
     * @param {String} type: 提交类型： add/新增  edit/编辑
     */
    async submitOrder(params, type) {
      this.submitBtnLoading = true;
      const Interface = type === 'edit' ? 'orderReviewEdit' : 'orderReviewCreate';
      try {
        let { code } = await this.$api[Interface](params);
        if (code === 0) {
          this.$Message.success(type === 'edit' ? '编辑成功!' : '添加成功!');
          this.$router.push('/order-management/review');
        }
      } catch (error) {}
      this.submitBtnLoading = false;
    },

    /**
     * 保存草稿
     */
    async saveDraft() {
      this.draftBtnLoading = true;
      const content = this.transformDraftData('json');
      const id = this.$route.query.id;
      try {
        let { code } = await this.$api.saveOrderDraft({id, content});
        if (code === 0) {
          this.$Message.success('保存成功!');
          this.$router.push('/order-management/review');
        }
      } catch (error) {}
      this.draftBtnLoading = false;
    },

    /**
     * 查询商家
     * @param {String} name: 商家名称
     */
    async remoteContract(name) {
      this.remoteContractLoading = true;
      try {
        let { code, data } = await this.$api.getOrderContractorListV2({name});
        if (code === 0) {
          this.contractOptions = data;
        }
      } catch (error) {}
      this.remoteContractLoading = false;
    },
    
    /**
     * 获取商家 - 供货政策
     * @param {String|Number} contractorId: 合作客户id
     * @param {String} merchantType: 客户类型
     */
    async getContractPolicy(contractorId, merchantType) {
      this.remotePolicyLoading = true;
      try {
        let { code, data } = await this.$api.getContractPolicy({contractorId, merchantType});
        if (code === 0) {
          this.policyOptions = data;
        }
      } catch (error) {}
      this.remotePolicyLoading = false;
    },

    /**
     * 查询产品
     * @param {String} name: 产品名称
     */
    async remoteProduct(name) {
      this.remoteProductLoading = true;
      try {
        let { code, data } = await this.$api.orderReviewQueryProduct({name});
        if (code === 0) {
          this.productOptions = removeRepeatItem([ ...this.productOptions, ...data ], 'pro_id');
        }
      } catch (error) {}
      this.remoteProductLoading = false;
    },

    /**
     * 获取产品折扣
     * @param {Object} params: 获取产品折扣数据
     */
    async getProductDiscount(params) {
      this.productDiscountSpin = true;
      try {
        let { code, data } = await this.$api.orderReviewQueryProductDiscount(params);
        if (code === 0) {
          data.giftProductList = data.giftProductList || [];
          data.matchingProductList = data.matchingProductList || [];
          
          ['giftProductList', 'matchingProductList', 'productList', 'totalOrderAmount'].forEach(key => this.formData[key] = data[key]);
        }
      } catch (error) {}
      this.productDiscountSpin = false;
    },

    /**
     * 获取订单详情
     * @param {String|Number} id: 订单id
     */
    async getOrderDeatil(id) {
      this.detailSpinShow = true;
      try {
        let { code, data } = await this.$api.orderReviewDetailsV2({id});
        if (code === 0) {
          await this.remoteContract(data.merchantName); // 查询商家 -> 阻塞后续操作
          await this.getContractPolicy(data.merchantId, data.merchantType);
          const productOptions = [ ...data.productList, ...data.backPointProductList ];

          !data.backPointProductList.length && (data.backPointProductList = [initData['backPointProductList']()]);
          this.formData = data;
          
          this.handleMerchantOnChange(data.merchantId, false); // 手动触发商家change事件
          this.handlePolicyOnChange(data.contractPolicyId, false); // 手动触发供货政策事件
          this.handlePaymentTypeOnChange(data.paymentType); // 手动触发收款方式change事件

          this.$nextTick(() => {
            // 产品选项
            this.productOptions = productOptions.map(item => {
              return {
                pro_id: item.id,
                pro_name: item.name,
                unit: item.unit,
                price: item.price,
                barcode: item.barcode,
                standard: item.standard,
                boxStandard: item.boxStandard,
                selected: true,
              }
            });
          })
        }
      } catch (error) {
        this.$Message.error('数据加载失败,请重新进入!');
      }
      this.detailSpinShow = false;
    },

    /**
     * 获取草稿详情
     * @param {String|Number} id: 草稿id
     */
    async getDraftDetail(id) {
      this.detailSpinShow = true;
      try {
        let { code, data } = await this.$api.orderDraftDeatil({id});
        if (code === 0) {
          this.transformDraftData('obj', data.content);
        }
      } catch (error) {}
      this.detailSpinShow = false;
    },

    /**
     * 商家信息 变化事件
     * @param {String} val: 选中的值
     * @param {Boolean} request: 是否调起请求: 是/true(默认)  否/false
     */
    handleMerchantOnChange(val, request = true) {
      if (!val) { // 清空商家 => 清除表单
        this.$refs.form1.resetFields();
        this.formData.orderFile = [];
        this.formData.productList = [ initData['productList']() ]
        this.$nextTick(() => {
          ['systemInfoOptions', 'contractorReceivingAddrGroupOptions', 'followUserOptions', 'paymentMethodOptions', 'accountOptions', 'policyOptions', 'productOptions']
            .forEach(key => this[key] = []);
        });
        return false;
      }

      const merchantInfo = JSON.parse(JSON.stringify(this.contractOptions.find(item => item.id === val)));
      merchantInfo.contractorReceivingAddrGroup.forEach(item => item.receivingAddress = `${item.province}${item.city}${item.county} ${item.receivingAddress}`);
      this.formData.merchantName = merchantInfo.merchantName;
      this.formData.merchantType = merchantInfo.merchantType;
      this.systemInfoOptions = merchantInfo.systemInfo;
      this.followUserOptions = merchantInfo.followUserInfo;
      this.soucreAccountOptions = merchantInfo.accountList;
      this.paymentMethodOptions = merchantInfo.contractsList;
      this.contractorReceivingAddrGroupOptions = merchantInfo.contractorReceivingAddrGroup;

      request && this.getContractPolicy(merchantInfo.id, merchantInfo.merchantType); // 获取供货政策
    },

    /**
     * 收货地址 变化事件
     * @param {Stirng|Numebr} val: 选中的值
     */
    handleAddressOnChange(val) {
      const addressInfo = this.contractorReceivingAddrGroupOptions.find(item => item.id === val) || {};

      ['receivingAddress', 'province', 'provinceId', 'city', 'cityId', 'county', 'countyId'].forEach(key => this.formData[key] = addressInfo[key]);
      this.formData.contactName = addressInfo.contact;
      this.formData.contactPhone = addressInfo.contactInformation;
    },

    /**
     * 业务员 - 变化事件
     * @param {Object} data: 当前选中信息
     */
    handleSalesmanOnChange(data = {}) {
      this.formData.salesman = data.label && data.label.split('/')[1];
    },

    /**
     * 系统门店 变化事件
     * @param {Object} data: 当前选中信息
     */
    handleSystemInfoOnChange(data = {}) {
      this.formData.systemName = data.label;
    },

    /**
     * 基础信息 - 收款 选择器变化事件
     * @param {String} paymentType: 选择器类型
     */
    handlePaymentTypeOnChange(paymentType) {
      this.accountOptions = this.soucreAccountOptions.filter(item => item.paymentType === paymentType);
    },

    /**
     * 付款账户
     * @param {Object} data: 当前选中项信息
     */
    handleAccountNumberOnChange(data = {}) {
      this.formData.accountName = data.label;
    },

    /**
     * 结款方式 选择事件
     * @param {String} val: 选中的值
     */
    handlePaymentMethodOnChange(val) {
      ['paymentType', 'accountNumber', 'accountName'].forEach(key => this.formData[key] = '');
    },

    /**
     * 供货政策 变化事件
     * @param {String} val: 选中的值
     * @param {Boolean} autoChange: 是否自动触发change: 是/true(默认)  否/false
     */
    handlePolicyOnChange(val, autoChange = true) {
      const formData = this.formData;
      if (autoChange) {
        ['taxDeduction', 'contractPolicyName', 'totalOrderAmount'].forEach(key => formData[key] = '');
        ['productList', 'backPointProductList'].forEach(key => formData[key] = [initData[key]()]);
        this.resetAllGifts();
      }
      if (!val) return false;

      const { taxDeduction, policyName } = this.policyOptions.find(item => item.id === val) || {};   
      formData.taxDeduction = `${taxDeduction}%`;
      formData.contractPolicyName = policyName;
    },

    /**
     * 产品订单 - 产品变化事件
     * @param {String} val: 选中的值
     * @param {Object} rowData: 当前行数据
     * @param {Object} rowIndex: 当前行下标
     */
    handleOrderProductOnChange(val, rowData, rowIndex) {
      const contractPolicyId = this.formData.contractPolicyId,
        formProducts = this.formData.productList,
        productList = formProducts.filter(item => item.id);
      
      if(!val) return !productList.length ? this.resetAllGifts(rowIndex) : this.resetProductData(formProducts, 'productList', rowIndex, true); // 清空最后一个产品时重置需要新增一行
      if (hasProduct(productList, val, 'id')) return this.resetProductData(formProducts, 'productList', rowIndex) && this.$Message.warning('已有相同产品');

      this.fillProductProp(rowData, val);
      this.getProductDiscount({contractPolicyId, productList});
    },

    // 返点清单产品 - 变化事件
    handleBackPointProductOnChange(val, rowData, rowIndex) {
      const formBackPointProducts = this.formData.backPointProductList,
        backPointProductList = formBackPointProducts.filter(item => item.id);
      
      if (!val) return void this.resetProductData(formBackPointProducts, 'backPointProductList', rowIndex, true);
      if (hasProduct(backPointProductList, val, 'id')) return this.resetProductData(formBackPointProducts, 'backPointProductList', rowIndex) && this.$Message.warning('已有相同产品');
      
      this.fillProductProp(rowData, val);
    },
    
    /**
     * 填充产品属性： 条码/规格/单位/零售价
     * @param {Object} rowData: 当前行数据
     * @param {String|Number} id: 当前id
     */
    fillProductProp(rowData, id) {
      const productInfo = this.productOptions.find(item => (item.pro_id === id) && (item.selected = true));
      ['barcode', 'standard', 'price', 'unit', 'box_standard', 'boxStandard'].forEach(key => rowData[key] = productInfo[key]);
      this.productOptions = this.productOptions.filter(item => item.selected);
    },

    /**
     * 产品数量变化事件
     * @param {Number} val: 当前变化的值
     * @param {Object} rowData: 当前行数据
     */
    handleProductNumerOnChange(val, rowData) {
      if (!val) return this.resetAllGifts();
      rowData.number = val = parseInt(val);

      const { productList, contractPolicyId } = this.formData;
      this.getProductDiscount({productList, contractPolicyId});
    },

    /**
     * 赠送数量变化事件
     * @param {String} type: 变化目标
     * @param {Number} val: 当前变化的值
     * @param {Object} rowData: 当前行数据
     * @param {Number} rowIndex: 当前行下标
     */
    handleGiftNumberOnChange(type, val, rowData, rowIndex) {
      this.$nextTick(() => {
        if (val === null) return rowData.number = 0;
        rowData.number = parseInt(val)
      });
    },

    /**
     * 查看政策
     * @param {String} id: 政策id
     */
    handleShowPolicy(id) {
      if (!id) return false;

      this.$refs.policyDetailModal.initModal({ id });
    },

    /**
     * 新增选项
     * @param {String} keyName: 映射表键名
     * @param {Array} sourceArr: 原数组
     */
    handleAddOption(keyName, sourceArr) {
      sourceArr.push(initData[keyName]());
    },

    /**
     * 移除选项
     * @param {String} type: 变化目标
     * @param {Array} sourceArr: 原数组
     * @param {Number} index: 移除元素下标
     */
    handleRemoveOption(type, sourceArr, index) {
      switch (type) {
        case 'productList':
          const { contractPolicyId, productList } = this.formData;
          productList.splice(index, 1);
          this.$nextTick(() => this.getProductDiscount({contractPolicyId, productList}));
          break;
        case 'backPointProductList':
          this.formData.backPointProductList.splice(index, 1);
        default:
          break;
      }
    },

    /**
     * 附件上传前回调
     */
    handleFileBeforeUpload() {
      if (this.formData.orderFile.length > 2) {
        this.$Notice.warning({
          title: '上传失败',
          desc: '附件凭证不能超过3个',
        })
        return false;
      }
      this.fileUploading = true;
    },

    /**
     * 附件上传成功回调
     * @param {Object} response: 成功响应信息
     * @param {Object} file: 当前上传成功文件
     * @param {Array} fileList: 已上传文件
     */
    handleFileUploadSuccess(response, file, fileList) {
      response.code === 0 && this.formData.orderFile.push(response.data);
      this.fileUploading = false;
    },

    /**
     * 附件上传失败回调
     * @param {Object} error: 失败响应信息
     * @param {Object} file: 当前上传失败文件
     * @param {Array} fileList: 上传失败文件
     */
    handleFileUploadError(error, file, fileList) {
      this.$Notice.error({
        title: '上传失败',
        desc: error.message,
        duration: 0
      })
      this.fileUploading = false;
    },

    /**
     * 删除附件 回调
     * @param {Object} file: 当前移除文件信息
     * @param {Array} fileList: 移除的文件列表
     */
    handleRemoveFile(file, fileList) {
      const orderFile = this.formData.orderFile;
      orderFile.splice(orderFile.findIndex(item => item.uid === file.uid), 1);
    },

    /**
     * 文件超出大小
     * @param {Object} file: 当前文件信息
     */
    handleFileExceededSize(file) {
      this.$Notice.warning({title: '文件大小不能超过2M!'});
      this.fileUploading = false;
    },

    /**
     * 预览已上传的文件
     * @param {Object} file: 当前被点击的已上传文件
     */
    handleOnPreviewFile(file) {
      window.open(file.url_show || file.urlShow);
    },

    /**
     * 检验产品
     * @param {String} value: 当前值
     * @param {Function} callback: 回调
     */
    validProduct(rule, value, callback) {
      if (!value) return callback(new Error('该选项不能为空'));
      callback();
    },

    // 检验产品数量
    validProductNumber(rule, value, callback) {
      typeof value == 'number' && (value = value.toString());
      if (!value) return callback(new Error('该选项不能为空'));
      callback();
    },

    // 校验
    validPaymentMoney(rule, value, callback) {
      if (!value) return callback(new Error('该选项不能为空'));
      /^(([1-9]\d*)|0)(\.\d{1,4})?$/.test(value) ? callback() : callback('请输入有效金额');
    },

    /**
     * 配赠数量校验
     * @param {Number|String} currentVal: 当前值
     * @param {Number|String} maxVal: 最大值
     * @param {Function} callback: 回调函数
     */
    validGiftNumber(currentVal, maxVal, callback) {
      if (currentVal > maxVal) return callback(new Error('超过可赠数量'));
      callback();
    },

    /**
     * 提交
     */
    handleSubmit() {
      this.$refs.form1.validate(valid => {
        if (valid) {
          this.submitBtnLoading = true;
          let params = JSON.parse(JSON.stringify(this.formData));
          params.paymentMoney = +params.paymentMoney;
          params.orderTime = new Date(params.orderTime).getTime() / 1000;
          params.paymentDate = new Date(params.paymentDate).getTime() / 1000;

          this.submitOrder(params, 'id' in this.$route.query ? 'edit' : 'add');
        }
      });
    },

    /**
     * 重置赠送区域
     * @param {Number} resetProductIndex: 是否重置产品订单的某行数据: 否 => null (默认) / 是 => 传入当前行数据下标
     */
    resetAllGifts(resetProductIndex = null) {
      if (resetProductIndex !== null) {
        this.resetProductData(this.formData.productList, 'productList', resetProductIndex, true);
      }
      ['matchingProductList', 'giftProductList'].forEach(key => this.formData[key] = []);
    },

    /**
     * 重置某行产品数据
     * @param {Array} sourceArr: 源数组
     * @param {String} keyName: 映射表键名
     * @param {Number} rowIndex: 当前行下标
     * @param {Boolean} isAdd: 是否创建一行新数据
     */
    resetProductData(sourceArr, keyName, rowIndex, isAdd = false) {
      this.$nextTick(() => isAdd ? sourceArr.splice(rowIndex, 1, initData[keyName]()) : sourceArr.splice(rowIndex, 1));
      return true;
    },

    /**
     * 草稿数据转换
     * @param {String} type: 转换类型  json/json串  obj/对象
     * @param {Object|String} content: 转换内容
     */
    transformDraftData(type, content = {}) {
      const keyMaps = [ // 映射键名
        'formData',
        'policyOptions',
        'accountOptions',
        'productOptions',
        'contractOptions',
        'followUserOptions',
        'systemInfoOptions',
        'paymentMethodOptions',
        'soucreAccountOptions',
        'contractorReceivingAddrGroupOptions',
      ];
      if (type === 'json') {
        keyMaps.forEach(key => content[key] = this[key]);
        return JSON.stringify(content);
      }
      content = JSON.parse(content);
      keyMaps.forEach(key => this[key] = content[key]);
    },

    // 格式化日期
    formatDate(time, type = 'yyyy-MM-dd') {
      return this.$format(time, type);
    },

    // 返回
    goBack() {
      this.$router.push('/order-management/review');
    }
  },
  mounted () {
    const { id, type } = this.$route.query;
    !!id && (type === 'draft' ? this.getDraftDetail(id) : this.getOrderDeatil(id));
  }
}
</script>

<style lang="less" scoped>
.review-edit {
  .ivu-card-head {
    .ivu-btn {
      margin-right: 10px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
  .policy {
    .policy-select {
      width: 70%;
      margin-right: 5px;
    }
  }
  .product {
    .product-title {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 10px;
      &:hover {
        cursor: default;
        text-overflow: inherit;
        overflow: inherit;
      }
    }
    .ivu-input-number {
      width: 100%;
    }
  }
  .gift {
    position: relative;
  }
  .sub-title {
    font-weight: 700;
    padding: 10px 0;
  }
  .ivu-form-item-error {
    .ivu-btn {
      border-color: #ed4014;
    }
  }
}
</style>