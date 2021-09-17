<template>
  <div>
    <Form ref="formData" :model="formData" :rules="formRules" label-position="right">
      <Card>
        <Row slot="title" style="text-align:right;">
          <Button @click="goBack">返回</Button>
          <Button type="warning" @click="openDraft">保存为草稿</Button>
          <Button type="success" :loading="buttonLoading" @click="submitForm('formData')" :disabled="isDisabled">
            提交
          </Button>
        </Row>
        <Row class="border-row">
          <div class="title">基础信息</div>
          <div class="basic">
            <Row>
              <Col :md="8" :sm="24">
                <FormItem label="商家名称：" :label-width="90" prop="merchant_name">
                  <Select :label="formData.merchant_name"
                          @keypress.native="isFirst = true"
                          @on-open-change="isFirst = true"
                          v-model="formData.merchant_id"
                          :loading="mechantLoading"
                          filterable
                          clearable
                          remote
                          @on-change="getMerchant"
                          :label-in-value="true"
                          placeholder="商家名称"
                          :remote-method="queryContractorDebonce"
                          style="max-width: 200px"
                          :disabled="isMiniProgram">
                    <Option v-for="(option, index) in queryContranctorList"
                            :key="'queryContranctorList' + index"
                            :value="option.id"
                            :label="option.merchant_name"
                    ></Option>
                  </Select>
                </FormItem>
              </Col>
              <Col :md="8" :sm="24">
                <FormItem label="系统/门店：" :label-width="90" prop="systemInfoId">
                  <Select v-model="formData.systemInfoId"
                          filterable
                          placeholder="选择系统/门店"
                          style="max-width: 200px"
                          :disabled="isMiniProgram">
                    <Option v-for="(option, index) in systemInfoList"
                            :key="'systemInfoList' + index"
                            :value="option.id"
                            :label="option.name"
                    ></Option>
                  </Select>
                </FormItem>
              </Col>
              <Col :md="8" :sm="24">
                <FormItem label="下单时间：" :label-width="90" prop="order_time">
                  <DatePicker
                  v-model="formData.order_time"
                  type="datetime"
                  placement="bottom-end"
                  format="yyyy-MM-dd HH:mm"
                  placeholder="Select date"
                  style="max-width:200px"
                  :disabled="isMiniProgram"></DatePicker>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col :sm="16" :xs="24">
                <FormItem label="收货地址：" :label-width="90" prop="contractor_address_id">
                  <Select :label="formData.new_receiving_address"
                          v-model="formData.contractor_address_id"
                          filterable
                          @keypress.native="isFirst = true"
                          @on-open-change="isFirst = true"
                          @on-change="chooseAddress"
                          :label-in-value="true"
                          :disabled="isMiniProgram"
                          style="max-width: 665px;">
                    <Option v-for="(option, index) in formData.contractorReceivingAddrGroup"
                            :key="'contractorReceivingAddrGroup' + index"
                            :value="option.id"
                            :label="option.newAddress"></Option>
                  </Select>
                </FormItem>
              </Col>
              <Col :md="8" :sm="24">
                <FormItem label="发货方式：" prop="delivery_mode" :label-width="90">
                  <Select :label="formData.delivery_mode"
                          v-model="formData.delivery_mode"
                          @on-change="getDeliveryMode"
                          label-in-value
                          placeholder="发货方式"
                          style="max-width:200px"
                          :disabled="isMiniProgram">
                    <Option v-for="option in deliveryModeList" :key="'deliveryModeList' + option.key"
                            :value="option.key"
                            :label="option.value"></Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col :md="8" :sm="24">
                <FormItem label="联系人：" :label-width="90">
                  <span v-text="formData.contact_name"></span>
                </FormItem>
              </Col>
              <Col :md="8" :sm="24">
                <FormItem label="联系方式：" :label-width="90">
                  <span v-text="formData.contact_phone"></span>
                </FormItem>
              </Col>
              <Col :md="8" :sm="24">
                <FormItem label="业务员：" :label-width="90" prop="follow_id">
                  <Select v-model="formData.follow_id" style="max-width:200px">
                    <Option
                      v-for="(item, index) in followUserInfoList"
                      :value="item.follow_id"
                      :label="item.full_name"
                      :key="`followUserInfoList${index}`">
                    </Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col :sm="24">
                <FormItem label="附件凭证：" :label-width="90" prop="orderFile">
                  <Upload
                    name="UploadForm[file]"
                    :before-upload="fileBeforeUpload"
                    :on-success="fileUploadSuccess"
                    :on-error="fileUploadError"
                    :default-file-list="formData.orderFile"
                    :action="fileUploadURL"
                    :on-remove="handleRemoveFile"
                    :headers="fileUploadHeaders"
                  >
                    <Button icon="md-add" size="large"></Button>
                  </Upload>
                </FormItem>
              </Col>
              
            </Row>
          </div>
        </Row>
        <Row class="border-row">
          <div class="title">下单政策和产品清单</div>
          <div class="add-table-list">
            <Row>
              <div class="item-title">政策</div>
              <Col :sm="24" style="white-space:nowrap;">
                <Row>
                  <Col :sm="12">
                    <FormItem prop="partner_policy_id" label="合作商政策：" :label-width="90">
                      <Select
                        v-model="formData.partner_policy_id"
                        :label-in-value="true"
                        @on-change="getPartnerPolicy"
                        :disabled="isMiniProgram"
                        style="max-width:200px;">
                          <Option v-for="(option, index) in partnerPolicyList"
                                  :key="'partnerPolicyList' + index"
                                  :value="option.id"
                                  :label="option.partner_policy_name"></Option>
                      </Select>
                    </FormItem>
                  </Col>
                  <Col :sm="12">
                    <FormItem label="付款方式：" :label-width="90">
                      <span v-text="paymentMethod[formData.payment_method]"></span>
                    </FormItem>
                  </Col>
                </Row>
              </Col>
              <Col :sm="24" style="white-space:nowrap;">
                <FormItem prop="contract_policy_id" label="合同政策：" :label-width="90">
                  <Select
                  filterable
                  v-model="formData.contract_policy_id"
                  @keypress.native="isFirst = true"
                  @on-open-change="isFirst = true"
                  :label-in-value="true"
                  @on-change="getContractPolicy"
                  :disabled="isMiniProgram"
                  :loading="remoteContractPolicyLoading"
                  style="max-width:200px;">
                    <Option v-for="(option, index) in contractPolicyList"
                            :key="'partnerPolicy' + index"
                            :value="option.contract_policy_id"
                            :label="option.contract_policy_name"></Option>
                  </Select>
                  <Button type="primary" style="margin-left: 10px" @click="openPolicyDetail">查看政策</Button>
                  <PolicyDetail ref="policyDetail"/>
                </FormItem>
              </Col>
            </Row>
            <!-- 货值清单 -->
            <Row class="item">
              <Row>
                <div class="item-title">产品清单</div>
              </Row>
              <Row class="header">
                <Col v-for="(item, index) in productList" :key="index"
                     :sm="index === 0 ? 3 : 2">
                  <span>{{ item.title }}</span>
                </Col>
              </Row>
              <Row class="content" v-for="(item, indexContent) in formData.orderProduct" :key="indexContent">
                <!-- 产品名称 -->
                <Col :sm="3">
                  <FormItem>
                    <Select :label="item.pro_name"
                            v-model="item.pro_id"
                            :loading="productLoading"
                            filterable
                            remote
                            clearable
                            :remote-method="queryProductDebonce"
                            @keypress.native="isFirst = true"
                            @on-open-change="isFirst = true"
                            @on-change="v=>{getProduct(v,indexContent, 'orderProduct')}"
                            :label-in-value="true"
                            placeholder="产品名称"
                            :disabled="isMiniProgram">
                      <Option v-for="(option, index) in queryProductList"
                              :key="'queryProductList' + option.pro_id + index"
                              :value="option.pro_id" :label="option.pro_name"></Option>
                    </Select>
                  </FormItem>
                </Col>
                <!-- 条码 -->
                <Col :sm="2">
                  <FormItem>
                    <Input v-model="item.barcode" readonly></Input>
                  </FormItem>
                </Col>
                <!-- 规格 -->
                <Col :sm="2">
                  <FormItem>
                    <Input v-model="item.standard" disabled></Input>
                  </FormItem>
                </Col>
                <!-- 单位 -->
                <Col :sm="2">
                  <FormItem>
                    <Input v-model="item.unit" disabled></Input>
                  </FormItem>
                </Col>
                <!-- 零售价 -->
                <Col :sm="2">
                  <FormItem>
                    <Input v-model="item.price" disabled></Input>
                  </FormItem>
                </Col>
                <!-- 折扣 -->
                <Col :sm="2">
                  <FormItem>
                    <Input v-model="item.discount" disabled></Input>
                  </FormItem>
                </Col>
                <!-- 订货数量 -->
                <Col :sm="2">
                  <FormItem>
                    <InputNumber :min="1" v-model="item.number"
                                 @on-change="v=>{validProductNumber(v,indexContent)}"
                                 :disabled="isMiniProgram"
                                 style="min-width: 55px;"
                    ></InputNumber>
                  </FormItem>
                </Col>
                <!-- 货值 -->
                <Col :sm="2">
                  <FormItem>
                    <Input :value="item.originalPrice" disabled></Input>
                  </FormItem>
                </Col>
                <!-- 订单应收 -->
                <Col :sm="2">
                  <FormItem>
                    <Input v-model="item.total_price" disabled></Input>
                  </FormItem>
                </Col>
                <!-- 箱规 -->
                <Col :sm="2">
                  <FormItem>
                    <Input v-model="item.box_standard" disabled></Input>
                  </FormItem>
                </Col>
                <div v-if="isMiniProgram === false">
                  <Button v-if="indexContent > 0" icon="md-remove" @click="removeItem(indexContent)"></Button>
                  <Button v-else icon="md-add" @click="addItem(indexContent)"></Button>
                  <Button type="primary" @click="clearItem(indexContent ,'orderProduct')">重置</Button>
                </div>
              </Row>
            </Row>
            <!-- 返点清单 -->
            <Row class="item" v-if="formData.backPointLimit && formData.backPointLimit > 0 && formData.backPoint.length > 0">
              <Row>
                <div class="item-title">返点清单</div>
              </Row>
              <Row>
                <Col :md="8" :sm="24">
                  <FormItem label="返点应收金额：" :label-width="110">
                    <Input v-model="formData.backPointStartingAmount" disabled style="max-width: 300px;"></Input>
                  </FormItem>
                </Col>
                <Col :md="8" :sm="24">
                  <FormItem label="获得返点额度：" :label-width="110">
                    <Input v-model="formData.backPointLimit" disabled style="max-width: 300px;"></Input>
                  </FormItem>
                </Col>
                <Col :md="8" :sm="24">
                  <FormItem label="选购返点货值：" :label-width="110">
                    <Input v-model="backPointSelectValue" disabled style="max-width: 300px;"></Input>
                  </FormItem>
                </Col>
              </Row>
              <Row class="header">
                <Col v-for="(item, index) in backProductList" :key="index"
                     :sm="index == 0 ? 3 : 2">
                  <span>{{ item.title }}</span>
                </Col>
              </Row>
              <Row class="content" v-for="(item, index) in formData.backPoint" :key="'backPoint' + index">
                <!-- 产品名称 -->
                <Col :sm="3">
                  <FormItem>
                    <Select :label="formData.backPoint[index].pro_name"
                            v-model="formData.backPoint[index].pro_id"
                            :loading="productLoading"
                            filterable
                            clearable
                            remote
                            :remote-method="queryProduct"
                            @keypress.native="isFirst = true"
                            @on-open-change="isFirst = true"
                            @on-change="v=>{getProduct(v,index, 'backPoint')}"
                            :label-in-value="true"
                            placeholder="产品名称"
                            :disabled="isMiniProgram">
                      <Option v-for="(option, index) in queryProductList"
                              :key="'queryProductList' + option.pro_id + index"
                              :value="option.pro_id" :label="option.pro_name"></Option>
                    </Select>
                  </FormItem>
                </Col>
                <!-- 条码 -->
                <Col :sm="2">
                  <FormItem>
                    <Input v-model="item.barcode" readonly></Input>
                  </FormItem>
                </Col>
                <!-- 规格 -->
                <Col :sm="2">
                  <FormItem>
                    <Input v-model="item.standard" disabled></Input>
                  </FormItem>
                </Col>
                <!-- 单位 -->
                <Col :sm="2">
                  <FormItem>
                    <Input v-model="item.unit" disabled></Input>
                  </FormItem>
                </Col>
                <!-- 零售价 -->
                <Col :sm="2">
                  <FormItem>
                    <Input v-model="item.price" disabled></Input>
                  </FormItem>
                </Col>
                <!-- 折扣 -->
                <Col :sm="2">
                  <FormItem>
                    <Input disabled value="无"></Input>
                  </FormItem>
                </Col>
                <!-- 订货数量 -->
                <Col :sm="2">
                  <FormItem>
                    <InputNumber :min="1" v-model="item.number"
                                 @on-change="getLimitPrice(index, 'backPoint')" :disabled="isMiniProgram"></InputNumber>
                  </FormItem>
                </Col>
                <!-- 返点货值 -->
                <Col :sm="2">
                  <FormItem>
                    <Input class="rebateInput" disabled
                           :value="item.rebateValue"
                           :class="(Number(item.rebateValue) || 0) > (Number(item.rebateLimit) || 0) ? 'error': ''"></Input>
                  </FormItem>
                </Col>
                <!-- 返点额度 -->
                <Col :sm="2">
                  <FormItem>
                    <Input disabled :value="item.rebateLimit"></Input>
                  </FormItem>
                </Col>
                <!-- 箱规 -->
                <Col :sm="2">
                  <FormItem>
                    <Input v-model="item.box_standard" disabled></Input>
                  </FormItem>
                </Col>
                <div v-if="isMiniProgram === false">
                  <Button v-if="index > 0" icon="md-remove" @click="removeItem(index,'backPoint')"></Button>
                  <Button v-else icon="md-add" @click="addItem(index, 'backPoint')"></Button>
                  <Button type="primary" @click="clearItem(index, 'backPoint')">重置</Button>
                </div>
              </Row>
            </Row>
            <!-- 换购活动清单 -->
            <Row class="item" v-if="formData.repurchaseStartingAmount && formData.repurchaseStartingAmount > 0 && formData.repurchaseProduct.length > 0">
              <Row>
                <div class="item-title">换购活动清单</div>
              </Row>
              <Row>
                <Col :md="6" :sm="24">
                  <FormItem label="换购应收金额：" :label-width="100">
                    <Input v-model="formData.repurchaseStartingAmount" disabled style="max-width: 300px;"></Input>
                  </FormItem>
                </Col>
              </Row>
              <Row class="header">
                <Col v-for="(item, index) in repurchaseProductList" :key="index"
                     :sm="index == 0 ? 3 : 2">
                  <span>{{ item.title }}</span>
                </Col>
              </Row>
              <Row class="content" v-for="(item, index) in formData.repurchaseProduct" :key="'repurchase' + index">
                <!-- 产品名称 -->
                <Col :sm="3">
                  <FormItem>
                    <Select placeholder="产品名称" v-model="formData.repurchaseProduct[index].pro_id" filterable
                            @on-change="v => {getActivityProduct(v, 'repurchaseProduct', index)}">
                      <Option v-for="(option, i) in repurchaseList" :key="'repurchaseList' + option.pro_id + i"
                              :value="option.pro_id" :label="option.pro_name"></Option>
                    </Select>
                  </FormItem>
                </Col>
                <!-- 条码 -->
                <Col :sm="2">
                  <FormItem>
                    <Input v-model="item.barcode" readonly></Input>
                  </FormItem>
                </Col>
                <!-- 规格 -->
                <Col :sm="2">
                  <FormItem>
                    <Input v-model="item.standard" disabled></Input>
                  </FormItem>
                </Col>
                <!-- 单位 -->
                <Col :sm="2">
                  <FormItem>
                    <Input v-model="item.unit" disabled></Input>
                  </FormItem>
                </Col>
                <!-- 零售价 -->
                <Col :sm="2">
                  <FormItem>
                    <Input v-model="item.price" disabled></Input>
                  </FormItem>
                </Col>
                <!-- 换购折扣-->
                <Col :sm="2">
                  <FormItem>
                    <Input v-model="item.discount" disabled></Input>
                  </FormItem>
                </Col>
                <!-- 订货数量 -->
                <Col :sm="2">
                  <FormItem>
                    <InputNumber :min="1" v-model="item.number"
                                 @on-change="getLimitPrice(index, 'repurchaseProduct')"
                                 :disabled="isMiniProgram"></InputNumber>
                  </FormItem>
                </Col>
                <!-- 换购货值 -->
                <Col :sm="2">
                  <FormItem>
                    <Input disabled v-model="item.total_value"></Input>
                  </FormItem>
                </Col>
                <!-- 换购应收金额 -->
                <Col :sm="2">
                  <FormItem>
                    <Input disabled v-model="item.receivable"></Input>
                  </FormItem>
                </Col>
                <!-- 箱规 -->
                <Col :sm="2">
                  <FormItem>
                    <Input v-model="item.box_standard" disabled></Input>
                  </FormItem>
                </Col>
                <div v-if="isMiniProgram === false">
                  <Button v-if="index > 0" icon="md-remove" @click="removeItem(index,'repurchaseProduct')"></Button>
                  <Button v-else icon="md-add" @click="addItem(index, 'repurchaseProduct')"></Button>
                  <Button type="primary" @click="clearItem(index, 'repurchaseProduct')">重置</Button>
                </div>
              </Row>
            </Row>
            <!-- 配赠活动清单 FIXME:-->
            <Row class="item" v-if="formData.matchingLimit > 0 && formData.matchingProduct.length > 0">
              <Row>
                <div class="item-title">配赠活动清单</div>
              </Row>
              <Row>
                <Col :md="6" :sm="24">
                  <FormItem label="获得配赠额度：" :label-width="100">
                    <Input v-model="formData.matchingLimit" disabled></Input>
                  </FormItem>
                </Col>
                <Col :md="6" :sm="24">
                  <!-- 自己计算-->
                  <FormItem label="选购配赠货值：" :label-width="100">
                    <Input v-model="matchingSelectSelectValue" disabled></Input>
                  </FormItem>
                </Col>
              </Row>
              <Row class="header">
                <Col v-for="(item, index) in matchingProductList" :key="index"
                     :sm="index == 0 ? 5 : 2">
                  <span>{{ item.title }}</span>
                </Col>
              </Row>
              <Row class="content" v-for="(item, index) in formData.matchingProduct" :key="'matchingProduct' + index">
                <!-- 产品名称 -->
                <Col :sm="2">
                    <Select v-model="item.object_name" style="width:110%" disabled v-if="item.object_name === 'product'" >
                        <Option value="product" :key="product + index">商品</Option>
                    </Select>
                    <Select v-model="item.category_name" style="width:100%" @on-change="selCategoryListMatching($event, index)" label-in-value v-else>
                        <Option v-for="(option,opIndex) in categoryListMatching" :value="option.category_name" :tag='option.category_id' :key="option.category_id + opIndex + index + 1">{{ option.category_name }}</Option>
                    </Select>
                </Col>
                <Col :sm="3">
                  <FormItem>
                    <Input :value="item.pro_name" disabled v-if="item.object_name === 'product'" ></Input>
                    <Select  v-model="item.pro_id"
                            filterable
                            clearable
                            remote
                            v-else
                            @on-query-change="queryCategoryDebonceMatching($event,index,item)"
                            @on-change="selectCategoryMatching($event,index,item)"
                            label-in-value
                            placeholder="产品名称"
                           >
                      <Option v-for="(option) in queryCategoryListMatching[index]"
                              :key="'queryCategoryListMatching' + option.pro_id + index"
                              :value="option.pro_id">{{option.pro_name}}</Option>
                    </Select>
                  </FormItem>
                </Col>
                <!-- 条码 -->
                <Col :sm="2">
                  <FormItem>
                    <Input v-model="item.barcode" readonly></Input>
                  </FormItem>
                </Col>
                <!-- 规格 -->
                <Col :sm="2">
                  <FormItem>
                    <Input v-model="item.standard" disabled></Input>
                  </FormItem>
                </Col>
                <!-- 单位 -->
                <Col :sm="2">
                  <FormItem>
                    <Input v-model="item.unit" disabled></Input>
                  </FormItem>
                </Col>
                <!-- 零售价 -->
                <Col :sm="2">
                  <FormItem>
                    <Input v-model="item.price" disabled></Input>
                  </FormItem>
                </Col>
                <!-- 折扣 -->
                <Col :sm="2">
                  <FormItem>
                    <Input disabled value="无"></Input>
                  </FormItem>
                </Col>
                <!-- 订货数量 -->
                <Col :sm="2">
                  <FormItem>
                    <InputNumber :min="0" v-model="item.number"
                                 @on-change="getLimitPrice(index, 'matchingProduct')"
                                 :disabled="isMiniProgram"></InputNumber>
                  </FormItem>
                </Col>
                <!-- 配赠货值 -->
                <Col :sm="2">
                  <FormItem>
                    <Input class="rebateInput" disabled
                           :value="item.rebateValue"
                           :class="(Number(item.rebateValue) || 0) > computedMatchLimit(item.rebateValue) ? 'error': ''"></Input>
                  </FormItem>
                </Col>
                <!-- 配赠额度 -->
                <Col :sm="2">
                  <FormItem>
                    <Input disabled :value="computedMatchLimit(item.rebateValue)"></Input>
                  </FormItem>
                </Col>
                <!-- 箱规 -->
                <Col :sm="2">
                  <FormItem>
                    <Input v-model="item.box_standard" disabled></Input>
                  </FormItem>
                </Col>
                <!-- 隐藏加号，显示折扣已有的 -->
                <div v-if="isMiniProgram === false">
                  <Button v-if="index > 0" icon="md-remove" @click="removeItem(index,'matchingProduct')"></Button>
                  <Button v-else icon="md-add" @click="addItem(index, 'matchingProduct')"></Button>
                  <Button type="primary" @click="clearItem(index, 'matchingProduct')">重置</Button>
                </div>
              </Row>
            </Row>
            <!-- 满赠活动清单 -->
            <Row class="item" v-if="giftBox.length && formData.giftStartingAmount>0">
              <Row>
                <div class="item-title">满赠活动清单</div>
              </Row>
              <Row>
                <Col :md="6" :sm="24">
                  <FormItem label="满赠应收金额：" :label-width="100">
                    <Input v-model="formData.giftStartingAmount" disabled style="max-width: 300px;"></Input>
                  </FormItem>
                </Col>
              </Row>
              <Row class="header">
                <Col v-for="(item, index) in giftProductList" :key="index"
                     :sm="index === 0  ? 5 : (index === (4 || 5) ? 2 : 3)">
                  <span>{{ item.title }}</span>
                </Col>
              </Row>
              <Row class="content" v-for="(item, index) in giftBox" :key="'gift' + index">
                <!-- 产品类型 -->
                <Col :sm="2">
                  <FormItem> 
                    <Select v-model="item.object_name" style="width:110%" disabled v-if="item.object_name === 'product'" >
                        <Option value="product" :key="product + index">商品</Option>
                    </Select>
                    <Select v-model="item.category_name" style="width:110%" @on-change="selCategoryList($event,index)" v-else label-in-value>
                        <Option v-for="(option,opIndex) in categoryList[index]" :value="option.name" :tag='option.category_id' :key="option.category_id + opIndex + index + 1">{{ option.name }}</Option>
                    </Select>
                  </FormItem>
                </Col>
                <!-- 产品名称 -->
                <Col :sm="3">
                  <FormItem>
                    <Input :value="item.pro_name" disabled v-if="item.object_name === 'product'" ></Input>
                    <Select  v-model="item.pro_id"
                            v-else
                            filterable
                            remote
                            clearable
                            @on-query-change="queryCategoryDebonce($event,index)"
                            @on-change="selectCategory($event,index)"
                            label-in-value
                            :loading="categoryLoading"
                            placeholder="产品名称"
                           >
                      <Option v-for="(option, indexList) in queryCategoryList[index]"
                              :key="'queryCategoryList' + option.id + indexList + index"
                              :value="option.id || option.pro_id" :label="option.name||option.pro_name"></Option>
                    </Select>
                  </FormItem>
                </Col>
                <!-- 规格 -->
                <Col :sm="3">
                  <FormItem>
                    <Input v-model="item.standard" disabled></Input>
                  </FormItem>
                </Col>
                <!-- 单位 -->
                <Col :sm="3">
                  <FormItem>
                    <Input v-model="item.unit" disabled></Input>
                  </FormItem>
                </Col>
                <!-- 零售价 -->
                <Col :sm="3">
                  <FormItem>
                    <Input v-model="item.price" disabled></Input>
                  </FormItem>
                </Col>
                <!--购买数量 -->
                <Col :sm="2">
                  <FormItem>
                    <InputNumber :min='0' 
                                  :disabled="item.object_name === 'product' ? true : false" 
                                  :max='Number(item.number)' 
                                  v-model="item.gift_number"
                                  @on-change="changeGiftNumber(index,item.category_id,item.object_name)"
                     ></InputNumber>
                  </FormItem>
                </Col>
                <!--可赠 数量 -->
                <Col :sm="2">
                  <FormItem>
                    <Input disabled :value="item.number" ></Input>
                  </FormItem>
                </Col>
                <!-- 箱规 -->
                <Col :sm="3">
                  <FormItem>
                    <Input disabled :value="item.box_standard"></Input>
                  </FormItem>
                </Col>
                <div v-if="isMiniProgram === false">
                  <Button v-if="index > 0" icon="md-remove" @click="removeItem(index,'giftBox')"></Button>
                  <Button v-else icon="md-add" @click="addItem(index, 'giftBox')"></Button>
                  <Button type="primary" @click="clearItem(index, 'giftBox')">重置</Button>
                </div>
              </Row>
            </Row>
            <!-- 满减活动清单 -->
            <Row class="item" v-if="formData.reductionStartingAmount>0">
              <Row>
                <div class="item-title">满减活动清单</div>
              </Row>
              <Row>
                <Col :md="6" :sm="24">
                  <FormItem label="满减应收金额：" :label-width="100">
                    <Input v-model="formData.reductionStartingAmount" disabled style="max-width: 300px;"></Input>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col :md="7" :sm="24">
                  <FormItem label="满减优惠金额" label-position="top">
                    <Input v-model="formData.reductionAmount" disabled></Input>
                  </FormItem>
                </Col>
                <Col :md="7" :sm="24">
                  <FormItem label="优惠折扣" label-position="top">
                    <Input v-model="formData.reductionProportion" disabled></Input>
                  </FormItem>
                </Col>
                <Col :md="7" :sm="24">
                  <FormItem label="总优惠金额" label-position="top">
                    <Input v-model="totalDiscount" disabled></Input>
                  </FormItem>
                </Col>
              </Row>
            </Row>
            <!-- 金额统计 -->
            <Row class="item">
              <Row>
                <div class="item-title">金额统计</div>
              </Row>
              <Row>
                <Col :md="6" :sm="24">
                  <FormItem label="订单应收金额：" :label-width="100">
                    <Input v-model="orderReceivable" disabled style="max-width: 300px;"></Input>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col :md="12" :sm="24">
                  <FormItem label="订单备注：" :label-width="100">
                    <Input v-model="formDataRemark" type="textarea" :rows="4" :readonly="isMiniProgram"
                          style="max-width: 760px;"></Input>
                  </FormItem>
                </Col>
              </Row>
            </Row>
          </div>
        </Row>
      </Card>
    </Form>
    <!-- 草稿 -->
    <Modal v-model="draftModal" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>是否存为草稿</span>
      </p>
      <div style="text-align:center">
        <p>存为草稿将在订单草稿列表生成一条数据</p>
      </div>
      <div slot="footer">
        <Button :loading="draftBtnModal" @click="keepDraft('continue')">保存并继续</Button>
        <Button :loading="draftBtnModal" @click="keepDraft('exit')">保存并退出</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import { SERVER_BASE_URL } from '~/api/config'
  import Cookies from 'js-cookie'
  import PolicyDetail from '../my-components/policy-detail-modal';

  export default {
    components: {
      PolicyDetail
    },
    data: function () {
      const validateContractPolicyName = (rule, value, callback) => {
        if (this.isMiniProgram) {
          callback();
        } else if (value === '') {
          callback(new Error('该选项不能为空'));
        } else {
          callback();
        }
      };

      const uploadFile = (rule, value, callback) => {
        if (this.formData.orderFile.length === 0) {
          callback(new Error('该项目不能为空'))
        } else if(this.formData.orderFile.length > 3) {
          callback(new Error('附件凭证不超过3个'))
        } else {
          callback()
        }
      }
      return {
        fileUploadURL: `${SERVER_BASE_URL}/v1/upload/create`,
        fileUploadHeaders: {
          Authorization: Cookies.get('authorization'),
        },
        openGift: true,
        // 满赠-类目选择:
        categoryList:[[]], 
        /**
         * 放置配赠-商品类目-为一维数组-仅存放类目的数据
         */
        categoryListMatching:[],//配赠所有的类目 
        categoryLoading:false,//类型
        policyId: 0,
        isSameProid: false,
        isMiniProgram: false, // 判断是否小程序订单
        isFirst: false,
        formDataRemark: '',
        username: '',
        createdAt: '',
        formData: {
          merchant_name: '', // 公司名称id
          systemInfoId: '', // 系统门店id
          partner_policy_id: '', // 合作商政策id
          contract_policy_id: '', // 合同政策id
          order_form: 'backstage',
          orderProduct: [
            {
              index: '',
              number: 0
            }
          ],
          backPoint: [
            {
              index: '',
              number: 0
            }
          ],
          repurchaseProduct: [
            {
              number: 0,

            }
          ],
          matchingProduct: [
            {
              number: 0
            }
          ],
          giftProduct: [],//满赠商品
          giftCategory: [],//满赠类目
          backPointLimit: 0, // 返点额度
          totalOrderAmount: 0, // 订单总应收金额
          totalProductNumber: 0, // 订单总货值
          reductionAmount: 0, // 满减优惠金额
          reductionProportion: 0, // 整单折扣
          matchingLimit: 0, // 配赠额度
          reductionStartingAmount: 0, // 满减活动起始金额
          repurchaseStartingAmount: 0, // 换购活动应收金额
          backPointStartingAmount: 0, // 返点活动应收金额
          giftStartingAmount: 0, // 赠品活动应收金额
          // donation_limit: 0,
          receiving_address: '',
          contractor_address_id: '', // 收货地址id
          new_receiving_address:'',
          contact_name:'',
          contact_phone:'',
          orderFile: [], // 凭证
          follow_id: '', // 业务员id
        },
        giftBox: [],//满赠 类目商品总和
        formRules: {
          merchant_name: [
            {required: true, message: '该选项不能为空', trigger: 'change'}
          ],
          systemInfoId: [
            {required: true, message: '该选项不能为空', trigger: 'change'}
          ],
          order_time: [
            {required: true, message: '该选项不能为空', type: 'date', trigger: 'change'}
          ],
          delivery_mode: [
            {required: true, message: '该选项不能为空', trigger: 'change'}
          ],
          contract_policy_id: [
            {required: true, validator: validateContractPolicyName, trigger: 'change', type: 'string'}
          ],
          partner_policy_id: [
            {required: true, validator: validateContractPolicyName, trigger: 'change', type: 'string'}
          ],
          contractor_address_id: [
            {required: true, message: '该选项不能为空', trigger: 'change'}
          ],
          orderFile: [
            {required: true, validator: uploadFile, trigger: 'change'}
          ],
          follow_id: [
            {required: true, message: '该选项不能为空', trigger: 'change'}
          ],
        },
        buttonLoading: false,
        isDisabled: false,
        businessType: [
          {value: '0', label: 'KA'},
          {value: '1', label: 'CS'},
          {value: '2', label: '便利店'},
          {value: '3', label: 'OTC'},
          {value: '4', label: '其他'}
        ],
        cooperationType: [
          {value: '0', label: '现款现货'},
          {value: '1', label: '月结'},
          {value: '2', label: '实销实结'}
        ],
        productList: [
          {title: '产品名称'},
          {title: '条码'},
          {title: '规格'},
          {title: '单位'},
          {title: '零售价'},
          {title: '折扣'},
          {title: '订货数量'},
          {title: '货值'},
          {title: '订单应收'},
          {title: '箱规'}
        ],
        backProductList: [
          {title: '产品名称'},
          {title: '条码'},
          {title: '规格'},
          {title: '单位'},
          {title: '零售价'},
          {title: '折扣'},
          {title: '订货数量'},
          {title: '返点货值'},
          {title: '返点额度'},
          {title: '箱规'}
        ],
        giftProductList: [
          {title: '赠品名称'},
          {title: '规格'},
          {title: '单位'},
          {title: '零售价'},
          {title: '购买数量'},
          {title: '可赠数量'},
          {title: '箱规'}
        ],
        repurchaseProductList: [
          {title: '产品名称'},
          {title: '条码'},
          {title: '规格'},
          {title: '单位'},
          {title: '零售价'},
          {title: '换购折扣'},
          {title: '订货数量'},
          {title: '换购货值'},
          {title: '换购应收金额'},
          {title: '箱规'}
        ],
        matchingProductList: [
          {title: '产品名称'},
          {title: '条码'},
          {title: '规格'},
          {title: '单位'},
          {title: '零售价'},
          {title: '折扣'},
          {title: '订货数量'},
          {title: '配赠货值'},
          {title: '配赠额度'},
          {title: '箱规'}
        ],
        productIndex: 0,
        backPointIndex: 0,
        giftIndex: 0,
        repurchaseIndex: 0,
        product: [
          {}
        ],
        currentProduct: {}, // 当前选择的商品
        queryContranctorList: [], // 查询商家返回的数据
        queryProductList: [],
        repurchaseList: [], // 折扣接口返回换购商品
        matchingList: [], // 折扣接口返回配赠商品--0107舍弃
        queryCategoryList:[[]],//满赠的类目商品
        /**
         * 放置配赠-商品下拉框-为二维数组
         */
        queryCategoryListMatching:[[]],//配赠的类目商品-0107新增
        mechantLoading: false,
        productLoading: false,
        // 支付方式
        paymentMethod: {
          monthly: '月结',
          spot_cash: '现货现款',
          spotCash: '现货现款',
          real_sale: '实销实结',
          realSale: '实销实结'
        },
        // 订单来源
        orderFormList: {
          MiniProgram: '小程序',
          backstage: '后台'
        },
        // 发货方式
        deliveryModeList: [
          {key: 'express', value: '快递'},
          {key: 'logistics', value: '物流'},
          // {key: 'noDelivery', value: '不发货'},
        ],
        isClear: false,
        // 合同政策
        isShowAgreementDetail: false,
        agreementDetailLoading: false,
        agreementDetail: {
          policy_name: '',
          isOpen: null,
          created_by: '',
          created_at: 0,
          reviewer: '',
          audit_at: 0,
          baseDiscount: [],
          categoryDiscount: [],
          productDiscount: [],
          giftDiscount: []
        },
        // allCount: 0,
        editType: '', //编辑类型  添加或草稿
        draftModal: false, //草稿弹窗
        draftBtnModal: false,
        draftTurn: false, //保存草稿是否跳转
        draftId: '', //是否继续编辑草稿
        queryContractorDebonce: this.$debonce(this.queryContractor, 500),
        queryProductDebonce: this.$debonce(this.queryProduct, 500),
        queryCategoryDebonce: this.$debonce(this.queryCategory, 500),
        queryCategoryDebonceMatching: this.$debonce(this.queryCategoryMatching, 500),
        queryTimer:null,
        
        systemInfoList: [], // 系统/门店 选项列表
        partnerPolicyList: [], // 合作商政策 选项列表
        contractPolicyList: [], // 合同 选项列表
        followUserInfoList: [], // 业务员 选项列表
        remoteContractPolicyLoading: false, // 加载合同loading
      };
    },
    watch: {
      //监听满赠活动
      'giftBox': {
        deep:true,
        handler: function(newVal,oldVal){
          // console.log('giftBox')
          if(newVal.length > 0){
            // 进行类目的判断
            /**
             * 数据格式
             * [{
             *      id：'',
             *      arr:[]
             *   },
             * ]
             */
            let categoryArr = [] // 放置所有的类目
            categoryArr = newVal.filter(item => item.object_name === 'category')
            let cateIdsArr = [] //存储各个对应id的数组
            if(categoryArr.length === 0) return
            categoryArr.forEach((itemA,i) => {
              if(i === 0){
                cateIdsArr[0] = {
                  id:itemA.category_id,
                  arr:[itemA]
                }
              }else{
                cateIdsArr.forEach((itemB,j) => {
                  //没有ID就跳过
                  if(itemA.category_id){
                    if(itemA.category_id !== itemB.id ){
                      //如果不等于-就放置
                      let obj = {
                        id: itemA.category_id,
                        arr: [itemA]
                      }
                      cateIdsArr.push(obj)
                    }else{
                      cateIdsArr[j].arr.push(itemA)
                    }
                }
                })
              }
            })
            // 开始对比类目 各个 id 的可赠数量以及 购买数量
            cateIdsArr.forEach((itemA,i) => {
              if(itemA.id){
                itemA.arr.forEach((itemB,j) => {
                  if(itemA.arr[j+1]){
                    //下一层存在
                    // 如果下一项存在-并且购买数量存在
                    if(itemB.gift_number && itemB.number){
                      //-当前的-剩余的可赠数量-即下一个的可赠数量
                      const litNumber = Number(itemB.number) - Number(itemB.gift_number)
                      itemA.arr[j+1] ? itemA.arr[j+1].number =  litNumber :''
                      if(itemA.arr[j+1].gift_number){
                        //如果存在
                        if(Number(itemA.arr[j+1].gift_number) > litNumber){
                          this.$Notice.error({title:'警告',desc:'满赠类目型商品超过可赠数量'})
                          return
                        }
                      }
                    }
                  }
                })
              }
            })
          }
        }
      },
      // 返点
      'formData.backPoint': {
        handler(nVal, oVal) {
          // console.log('formData.backPoint')
          let totalOrderAmount = 0;
          nVal.forEach(backPoint => {
            if (backPoint.hasOwnProperty('total_price')) {
              totalOrderAmount += Number(backPoint['total_price']);
            }
          });
          if (this.formData.backPointLimit < totalOrderAmount) {
            this.$Message.warning('返点总额超过返点额度！');
            this.isDisabled = true;
            this.$set(this.formData, 'backPoint', oVal);
          } else {
            this.isDisabled = false;
          }
        },
        immediate: true,
        deep: true
      },
      // 配赠
      'formData.matchingProduct': {
        handler(nVal, oVal) {
          let totalOrderAmount = 0;
          nVal.forEach(matching => {
            if (matching.hasOwnProperty('rebateValue')) {
              totalOrderAmount += Number(matching['rebateValue']);
            }
          });
          if (this.formData.matchingLimit < totalOrderAmount) {
            this.$Message.warning('返点总额超过配赠额度！');
            this.isDisabled = true;
            this.$set(this.formData, 'matchingProduct', oVal);
          } else {
            this.isDisabled = false;
          }
        },
        immediate: true,
        deep: true
      }
    },
    methods: {
      // 附件凭证上传
      fileBeforeUpload() {
        if(this.formData.orderFile.length > 2) {
          this.$Notice.warning({
            title: '上传失败',
            desc: '附件凭证不能超过3个',
          })
          return false
        }
      },

      fileUploadSuccess(response, file, fileList) {
        if(response.code === 0) {
          this.formData.orderFile.push(response.data)
        }
      },

      fileUploadError(error, file, fileList) {
        this.$Notice.error({
          title: '上传失败',
          desc: error.message,
          duration: 0
        })
      },

      handleRemoveFile(file, fileList) {
        this.formData.orderFile.forEach((item, index) => {
          if(item.uid === file.uid) {
            this.formData.orderFile.splice(index, 1)
            return
          }
        })
      },

      // 是否存为草稿
      openDraft() {
        if (!!this.formData.merchant_name) {
          this.draftModal = true
        } else {
          this.$Message.error('请填写商家名称')
        }
      },
      // 选择是否存为草稿并继续填写/退出
      keepDraft(remark) {
        this.draftBtnModal = true;
        let formData = JSON.parse(JSON.stringify(this.formData));
        if (formData.status) {
          formData.status = formData.status.replace(/OrderWorkflow\//, '');
        }
        formData.remark = this.formDataRemark;
        // 判断收货地址
        for (let i in this.formData.contractorReceivingAddrGroup) {
          if (this.formData.new_receiving_address == this.formData.contractorReceivingAddrGroup[i].newAddress) {
            this.formData.province = this.formData.contractorReceivingAddrGroup[i].province;
            this.formData.province_id = this.formData.contractorReceivingAddrGroup[i].province_id;
            this.formData.city = this.formData.contractorReceivingAddrGroup[i].city;
            this.formData.city_id = this.formData.contractorReceivingAddrGroup[i].city_id;
            this.formData.county = this.formData.contractorReceivingAddrGroup[i].county;
            this.formData.county_id = this.formData.contractorReceivingAddrGroup[i].county_id;
          }
        }
        let params;
        if (this.formData.backPointLimit && this.formData.backPointLimit > 0) {
          params = {...formData, rebate_product_amount: this.rebateValue || 0};
        } else {
          params = {...formData, rebate_product_amount: this.rebateValue || 0, backPoint: [], rebate_amount: undefined};
        }
        params.orderProduct = params.orderProduct.filter(function (item) {
          return item.number > 0
        })
        params.backPointProduct = []
        this.formData.backPoint.map(item => {
          if (item.pro_id) {
            params.backPointProduct.push(item)
          }
        })
        params.repurchaseProduct = this.formData.repurchaseProduct.filter(item => {
          return item.pro_id
        })
        params.matchingProduct = this.formData.matchingProduct.filter(item => {
          return item.pro_id
        })
        if (!!this.draftId) { //选择继续编辑
          this.editType = 'draft'
          params.id = this.draftId
        }
        if (this.editType == 'draft') { //修改
          this.$api.orderDraftUpdate(params).then((res) => {
            if (res.code === 0) {
              if (!!remark) { // 是否为被动保存
                this.$Message.success('保存成功')
              }
              if (remark == 'exit') {
                this.$store.commit('removeTag', this.$route.name);
                this.$router.push({path: '/order-management/review'})
                this.draftTurn = true
              } else if (remark == 'continue') {
                this.draftModal = false
              }
            } else {
              this.$Message.error(res.message);
            }
          }).finally(() => {
            this.draftBtnModal = false
          })
        } else {
          this.$api.orderDraftAdd(params).then((res) => { // 添加
            if (res.code === 0) {
              if (!!remark) {
                this.$Message.success('保存成功')
              }
              if (remark == 'exit') {
                this.$router.push({path: '/order-management/review'})
                this.draftTurn = true
              } else if (remark == 'continue') {
                this.draftModal = false
                this.draftId = res.data
                this.editType = 'draft'
              }
            } else {
              this.$Message.error(res.message);
            }
          }).finally(() => {
            this.draftBtnModal = false
          })
        }
      },
      // 查询商家
      queryContractor(json) {
        if (this.isFirst) {
          this.mechantLoading = true;
          let params = {name: json};
          this.$api.orderReviewQueryContractor(params)
            .then(res => {
              this.mechantLoading = false;
              if (res.data.length > 0) {
                this.queryContranctorList = res.data;
              }
            });
        }
      },
      // 获取商家的名称和id
      getMerchant(json) {
        json = json || {}
        this.formData.new_receiving_address = ''
        this.formData.contractor_address_id = ''
        this.formData.contact_name = ''
        this.formData.contact_phone = ''
        this.formData.systemInfoId = ''
        this.formData.partner_policy_id = ''
        this.formData.contract_policy_id = ''
        this.formData.follow_id = ''
        this.followUserInfoList = []
        this.systemInfoList = []
        this.partnerPolicyList = []
        this.contractPolicyList = []
        this.formData.contractorReceivingAddrGroup = []
        this.formData.merchant_name = json.label;
        this.formData.merchant_id = json.value;
        for (let i in this.queryContranctorList) {
          if (json.label === this.queryContranctorList[i].merchant_name && json.value === this.queryContranctorList[i].id) {
            this.formData.salesman = this.queryContranctorList[i].real_name; // 业务员
            this.formData.salesman_id = this.queryContranctorList[i].salesman_id; // 业务员id
            this.formData.payment_method = this.queryContranctorList[i].payment_method; // 支付方式
            this.formData.receiving_address = this.queryContranctorList[i].receiving_addr; // 收货地址
            this.formData.contractorReceivingAddrGroup = this.queryContranctorList[i].contractorReceivingAddrGroup.map(v => {
              return {
                ...v,
                newAddress:v.province + v.city + v.county +' '+ v.receiving_address
              }
            }); // 所有收货地址（数组）
            this.followUserInfoList = this.queryContranctorList[i].followUserInfo; // 业务员
            this.systemInfoList = this.queryContranctorList[i].systemInfo; // 所有系统/门店（数组）
            this.partnerPolicyList = this.queryContranctorList[i].partnerInfoByContracts; // 所有合作商政策
            !this.formData.contractorReceivingAddrGroup ?  this.formatDate.new_receiving_address =this.formData.contractorReceivingAddrGroup[0].newAddress :  this.formatDate.new_receiving_address = ''
          }
        }
        // 商家的名称改变时,清空已选的商品
        this.formData.orderProduct = [
          {
            index: '',
            number: 0
          }
        ];
        this.formData.backPoint = [
          {
            index: '',
            number: 0
          }
        ];
        this.formData.repurchaseProduct = [{number: 0}];
        this.formData.matchingProduct = [{number: 0}];
        this.formData.giftProduct = [];
        this.formData.backPointLimit = 0; // 返点额度
        // this.formData.donation_limit = 0;
        this.formData.rebate_amount = 0;
        this.formData.donation_amount = 0;
      },
      // 模糊查询品类
      queryCategory(value, index) {
        if(!value) return
        if(!this.giftBox[index].category_name && this.giftBox[index].object_name !== 'product') return this.$Notice.error({title:'警告',desc:'请先选择类型'})
        this.categoryLoading = true
        let params = {
          name: value || this.giftBox[index].pro_name,
          categoryId: this.giftBox[index].category_id?this.giftBox[index].category_id:this.giftBox[index].id,
        }
        this.$api.getDeatilProduct(params).then((res) => {
          this.categoryLoading = false
          if (res.data.length !== 0) {
            this.queryCategoryList[index] = res.data
          }
        })
      },

      // 选择品类
      selectCategory(obj, index) {
        if (!!obj) {
          let list = this.queryCategoryList[index].filter((n) => {
            return obj.label === n.name && obj.value === n.id
          })
          list[0].name ? this.giftBox[index].pro_name =  list[0].name : this.giftBox[index].pro_name = ''
          list[0].id ? this.giftBox[index].pro_id =  list[0].id : this.giftBox[index].pro_id =''
          list[0].box_standard ? this.giftBox[index].box_standard =  list[0].box_standard : this.giftBox[index].box_standard = ''
          list[0].price ? this.giftBox[index].price =  list[0].price : this.giftBox[index].price =''
          list[0].standard ? this.giftBox[index].standard =  list[0].standard : this.giftBox[index].standard =''
          list[0].unit ? this.giftBox[index].unit =  list[0].unit : this.giftBox[index].unit =''
          // 校验是否有相同的商品
          let idArr = this.giftBox.filter(item => item.pro_id === list[0].id)
          if(idArr.length > 1){
            //有相同商品
            this.$Notice.warning({title:'提示',desc:'已有相同商品'})
            this.$nextTick(() => {
              // this.$set(this.giftBox,index,{})
              this.giftBox[index].pro_name = ''
              this.giftBox[index].pro_id = ''
              this.giftBox[index].box_standard = ''
              this.giftBox[index].price = ''
              this.giftBox[index].standard = ''
              this.giftBox[index].unit = ''
            })
          }

        }
      },
      //计算同类目的可赠送数量-在选择类目下进行判断
      getGiftNumber(index,id,type){
        if(index){
          /**
           *  TODO==============
           *  //开始计算
           * // 这是一个计算公式，可能会对所有的满赠产品打乱
           * 缺点，是只对选择类目的商品进行计算
           */
          // 计算该类目的id 改变类目，计算可配置数量
          if(this.giftBox[index-1]){
            let preArr = JSON.parse(JSON.stringify(this.giftBox))
            preArr.slice(0,index)
            //筛选出在他之上的同id的同类型的
            preArr = preArr.filter(item => item.object_name === type && item.category_id === id)
            if(preArr.length !== 0) {
              if(!preArr[preArr.length - 2]) return
              if(preArr[0].object_name == 'product') return
              let preNum  = Number(preArr[preArr.length - 2].number) -  Number(preArr[preArr.length - 2].gift_number)
              if(preNum <= 0) {
                this.$Notice.error({
                  title:'警告',
                  desc:'满赠第'+( index + 1 )+'项已经超过可赠送数量'
                })
                // this.giftBox[index].gift_number = Number(0)
              }else{
                this.giftBox[index].number = preNum
                // this.giftBox[index].gift_number = Number(1)              
              }
            }
          }
          
        }
      },
      //改变购买数量
      changeGiftNumber(index,id,type){
        if(index && id && type){
          //当数量齐全的时候
          this.getGiftNumber(index,id,type)
        }
      },
      //改变满赠类目
      selCategoryList(val,index){
        if(!val) return
        let cateList = JSON.parse(JSON.stringify(this.categoryList))
        if(val.value === '商品'){
          let product = this.giftBox.filter(item => item.object_name === 'product')
            this.$set(this.giftBox,index,product[0])
          this.getGiftNumber(index,val.tag,'product')
          return
        }
        cateList[index].forEach(item => {
          if(val.value === item.name){
            item.category_name = item.name
            delete item['name']
            // 重置
            this.$set(this.giftBox,index,{...item})
            this.queryCategoryList[index] = []
          }
        })
        this.getGiftNumber(index,val.tag,'category')
      },
      // 模糊查询品类-配赠
      queryCategoryMatching(value, index,item) {
        if(!item.category_id) return this.$Notice.warning({title:'提示',desc:'请先选择类型'})
        let params = {
          name: value,
          categoryId: item.category_id 
        }
        this.$api.getDeatilProduct(params).then((res) => {
          if (res.data.length !== 0) {
            res.data = res.data.map(item => {
              item.object_name = item.object_name ? item.object_name : this.formData.matchingProduct[index].object_name
              item.pro_id = item.id ? item.id : item.pro_id
              item.pro_name = item.name
              delete item.id
              delete item.name
              return item
            })
            this.queryCategoryListMatching[index].length =0
            this.$set(this.queryCategoryListMatching,index,[...res.data])
          }
        })
      },
      //改变满赠类目-配赠
      selCategoryListMatching(data, index){
        if (!data) return
        this.$set(this.formData.matchingProduct, index, {number: 0, category_id: data.tag, category_name: data.value, object_name: data.label})
        this.queryCategoryListMatching[index] = []
      },
      // 选择品类-配赠
      selectCategoryMatching(obj, index,item) {
        if (!!obj) {
          let list = this.queryCategoryListMatching[index].filter((n) => {
            return obj.label === n.pro_name && obj.value === n.pro_id
          })
          if(list.length > 0){
            //判断是否有重复
             const ids =  this.formData.matchingProduct.filter(item => item.pro_id === list[0].pro_id)
             if(ids.length > 1) {
                this.$Notice.warning({title:'提示',desc:'已有相同商品'})
                this.$nextTick(() => {

                  this.formData.matchingProduct[index].pro_name = ''
                  this.formData.matchingProduct[index].pro_id = ''
                  this.formData.matchingProduct[index].box_standard = ''
                  this.formData.matchingProduct[index].price = ''
                  this.formData.matchingProduct[index].standard = ''
                  this.formData.matchingProduct[index].unit = ''
                })  
               return 
            } else {
              Object.keys(list[0]).forEach(key => {
                if(list[0][key]){
                  this.formData.matchingProduct[index][key] = list[0][key]
                }
              })
            }
          }
          this.formData.matchingProduct[index].number = 1
          
          this.getLimitPrice(index, 'matchingProduct')
          
        }
      },
      //点击收货地址
      chooseAddress(val){
        for (let i in this.formData.contractorReceivingAddrGroup) {
          if (val.value == this.formData.contractorReceivingAddrGroup[i].id) {
            this.formData.contact_name = this.formData.contractorReceivingAddrGroup[i].contact || ''; // 联系人姓名
            this.formData.contact_phone = this.formData.contractorReceivingAddrGroup[i].contact_information || '';// 联系人电话
          }
        }
      },
      // 点击合作商政策
      getPartnerPolicy(e) {
        if (!!e) {
          // TODO 调取获取合同这政策API
          const { value, label } = e
          this.partnerPolicyList.forEach(item => {
            if (item.id === value) {
              this.formData.payment_method = item.payment_method;
            }
          })
          // this.partnerPolicyList.some(item => item.id === value && !(this.formData.payment_method = item.payment_method))
          this.getContractPolicyList({partnerPolicyId: value})
        }
      },
      // 获取合同政策列表
      getContractPolicyList(params) {
        this.remoteContractPolicyLoading = true
        this.$api.queryOrderContractPolicy(params)
          .then(res => {
            if (res.code === 0) {
              this.contractPolicyList = res.data
            }
          })
          .finally(() => {
            this.remoteContractPolicyLoading = false
          })
      },

      // 获取合同政策（包含政策）
      getContractPolicy(e) {
        if (!!e) { // 改变商家名称时，e为undefined，控制台报错
          this.formData.contract_policy_name = e.label;
          this.formData.contract_policy_id = e.value;
          //this.getAgreeDetail();
          // 触发产品列表价格和折扣变动
          if (this.formData.orderProduct) {
            let orderProduct = this.formData.orderProduct;
            for (let i in orderProduct) {
              orderProduct[i].contract_policy_id = e.value;
              this.queryProductDiscount(i);
            }
            this.$set(this.formData, 'orderProduct', orderProduct);
          }
        }
      },
      // 获取发货方式
      getDeliveryMode(json) {
        this.formData.delivery_mode = json.value;
      },
      // 查询产品
      queryProduct(json) {
        this.isClear = false;
        if (this.isFirst) {
          this.productLoading = true;
          let params = {name: json};
          this.$api.orderReviewQueryProduct(params)
            .then(res => {
              this.productLoading = false;
              if (res.data.length > 0) {
                this.queryProductList = res.data;
              }
            });
        }
      },
      
      // 配赠-查询产品
      mathingQueryProduct(value) {
          let params = {
            // name: value ||,
            // categoryId: ,
          }
          this.$api.getDeatilProduct(params).then((res) => {
            this.categoryLoading = false
            if (res.data.length !== 0) {
              this.queryCategoryList[index] = res.data
            }
          })
      },
      // 检验当前数组是否有相同的产品id
      validProId(proid, other) {
        let listData = this.formData[other];
        let count = 0;
        listData.map((item) => {
          if (proid === item.pro_id) {
            count++;
            if (count === 2) {
              this.$Message.error({
                content: '已经有相同产品（具体产品名），请重新选择！',
                duration: 5
              });
              this.isSameProid = true;
            }
          }
        });
      },
      // 获取产品的名称和id
      getProduct(json, currentIndex, other) {
        this.isSameProid = false;
        if (typeof json === 'undefined') {
          return false;
        }
        this.validProId(json.value, other);
        if (this.isSameProid) {
          switch (other) {
            case 'backPoint':
              this.formData.backPoint[currentIndex] = {};
              break;
            default:
              this.formData.orderProduct[currentIndex] = {};
              break;
          }
          return false;
        }
        // 获取当前选择的产品数据，1.如果是产品添加的模块，改变相应的数据并请求单品折扣  2. 返点和赠点的话，只改变相应的数据
        if (this.formData.merchant_name && this.formData.merchant_id && this.formData.contract_policy_id) {
          let fuckChanPin = this.queryProductList;
          for (let i in fuckChanPin) {
            // 获取到当前选择 的产品的名称和id
            if (json.label == fuckChanPin[i].pro_name && json.value == fuckChanPin[i].pro_id) {
              switch (other) {
                case 'backPoint':
                  let backPoint = this.formData.backPoint[currentIndex];
                  backPoint.pro_name = this.queryProductList[i].pro_name;
                  backPoint.pro_id = this.queryProductList[i].pro_id;
                  backPoint.price = parseFloat(this.queryProductList[i].price); // 零售价不转为整数
                  backPoint.standard = this.queryProductList[i].standard;
                  backPoint.unit = this.queryProductList[i].unit;
                  backPoint.category_id = this.queryProductList[i].category_id;
                  backPoint.box_standard = this.queryProductList[i].box_standard;
                  backPoint.barcode = this.queryProductList[i].barcode;
                  backPoint.item_no = this.queryProductList[i].item_no;
                  backPoint.number = 1;
                  this.$set(this.formData.backPoint, currentIndex, backPoint);
                  break;
                default:
                  let orderProduct = this.formData.orderProduct[currentIndex];
                  orderProduct.pro_name = this.queryProductList[i].pro_name; // 产品名称
                  orderProduct.pro_id = this.queryProductList[i].pro_id; // 产品id
                  orderProduct.price = parseFloat(this.queryProductList[i].price); // 产品折扣前的零售价
                  orderProduct.standard = this.queryProductList[i].standard; // 产品规格
                  orderProduct.unit = this.queryProductList[i].unit;
                  orderProduct.category_id = this.queryProductList[i].category_id; // 类目id
                  orderProduct.box_standard = this.queryProductList[i].box_standard;
                  orderProduct.barcode = this.queryProductList[i].barcode;
                  orderProduct.item_no = this.queryProductList[i].item_no;
                  orderProduct.number = 1; // 产品数量
                  orderProduct.contract_policy_id = this.formData.contract_policy_id; // 合同政策id
                  this.$set(this.formData.orderProduct, currentIndex, orderProduct);
              }
            }
          }
          ;
          if (other == 'backPoint') {
            this.getLimitPrice(currentIndex, 'backPoint');
          } else {
            this.queryProductDiscount(currentIndex);
          }
        } else if (this.formData.merchant_name && this.formData.merchant_id) {
          this.$Message.warning('请先选择合同政策！');
          return false;
        } else {
          this.$Message.warning('请先选择商家名称！');
          return false;
        }
      },
      // 获取赠送、换购产品
      getActivityProduct(val, type, index) {
        if (type == 'repurchaseProduct') {
          let count = 0
          this.formData.repurchaseProduct.map(data => {
            if (val == data.pro_id) {
              count++
            }
          })
          if (count < 2) {
            this.repurchaseList.map(item => {
              if (val == item.pro_id) {
                item.number = 1
                this.$set(this.formData.repurchaseProduct, index, item)
              }
            })
            this.getLimitPrice(index, 'repurchaseProduct')
          } else {
            this.$Message.error('已有相同的换购产品')
            this.$set(this.formData.repurchaseProduct, index, {number: 0})
          }
        } else if (type == 'matchingProduct') {
          this.queryCategoryListMatching[index].map(item => {
            if (val == item.pro_id) {
              item.pro_id = item.pro_id
              item.pro_name = item.pro_name
              let matching = this.formData.matchingProduct[index];
              //0107优化
              Object.keys(item).forEach(key => {
                  matching[key] = item[key]
              })
              matching.number = 1;
              this.$set(this.formData.matchingProduct, index, matching);
            }
          })
          this.getLimitPrice(index, 'matchingProduct')
        }
      },
      // 校验产品数量，并请求产品单品的折扣
      validProductNumber(value, currentIndex) {
        if (value === null) {
          return false;
        }
        if (!this.formData.orderProduct[currentIndex].pro_name) {
          this.$Message.warning('请先填写产品名称');
          return false;
        }
        if (this.formData.orderProduct[currentIndex].number > -1) {
          // 计算折扣前的一个单品的总的订货价
          // this.formData.orderProduct[currentIndex].pro_amount = Number(this.formData.orderProduct[currentIndex].price === undefined ? 0 : this.formData.orderProduct[currentIndex].price) * Number(this.formData.orderProduct[currentIndex].number);
          this.isDisabled = false;
          this.queryProductDiscount(currentIndex);
        } else {
          this.$Message.error('请输入大于0的整数');
          this.isDisabled = true;
        }
      },
      //
      /**
       *  查询单品折扣
       *09版本更改规则
       前版本直接赋值满赠产品-覆盖数据
       -本次-记录旧数据展示-当重新发起请求才覆盖旧数据
       对于判断是否存在可优化---
       *  */ 
      queryProductDiscount(currentIndex) {
        clearTimeout(this.queryTimer)
        this.queryTimer = setTimeout(()=> {
          if(!this.openGift) return this.openGift = true
          if (this.isClear === true) {
            this.$Message.error('请填写完整');
            return false;
          }
          if (this.formData.orderProduct[currentIndex].pro_id) {
            let obj = this.formData.orderProduct.filter(items => {
              return items.pro_id
            })
            let params = {
              pro: obj,
              contract_policy_id: +this.formData.contract_policy_id
            }
            this.$api.orderReviewQueryProductDiscount(params)
              .then(res => {
                if(!res.data.limit)return
                this.giftBox = []
                // 当如果不满足条件时，后端返回null
                if(res.data.limit){
                  Object.keys(res.data).forEach(key => {
                    //将null，不存在的值设置为空数组
                    if(!res.data[key] && typeof(res.data[key]!=='undefined' && res.data[key] !== 0)){
                      res.data[key] = []
                    }
                  })
                }
                // 订单应收
                this.formData.totalOrderAmount = res.data.limit.totalOrderAmount;
                // 返点额度
                this.formData.backPointLimit = Number(res.data.limit.backPointLimit);
                // 配赠额度
                this.formData.matchingLimit = Number(res.data.limit.matchingLimit);
                // 换购活动满赠应收金额
                this.formData.repurchaseStartingAmount = Number(res.data.limit.repurchaseStartingAmount);
                // 返点活动满赠应收金额
                this.formData.backPointStartingAmount = Number(res.data.limit.backPointStartingAmount);
                // 满减优惠金额
                this.formData.reductionAmount = Number(res.data.limit.reductionAmount);
                // 满减活动起始金额
                this.formData.reductionStartingAmount = Number(res.data.limit.reductionStartingAmount);
                // 整单折扣
                this.formData.reductionProportion = Number(res.data.limit.reductionProportion);
                // 满赠应收金额
                this.formData.giftStartingAmount = Number(res.data.limit.giftStartAmount);
                // 换购产品
                this.repurchaseList = res.data.repurchaseProduct?res.data.repurchaseProduct:[]
                // 配赠产品;
                this.matchingList =res.data.matchingProduct? res.data.matchingProduct:[]
                /**
                 * 当第一次进入时。仅保留类目数据-09
                 */
                res.data.giftProduct?res.data.giftProduct = res.data.giftProduct.map(item => {
                  item.object_name = 'product'
                  item.gift_number = item.gift_number ? item.gift_number : Number(1)
                  return item
                }):res.data.giftProduct =[]
                res.data.giftCategory?res.data.giftCategory = res.data.giftCategory.map((item,index) => {
                  item.object_name = 'category'
                  item.category_id = String(item.id)
                  item.gift_number = item.gift_number ? item.gift_number : Number(0)
                  delete item['id']
                  return item
                }):res.data.giftCategory =[]
                  // 满赠产品
                  //TODO----在此处对满赠商品进行拼接—类目+商品-09
                  // +模拟加上类目
                  this.formData.giftCategory = res.data.giftCategory?JSON.parse(JSON.stringify(res.data.giftCategory)):[]
                  this.formData.giftProduct = res.data.giftProduct?JSON.parse(JSON.stringify(res.data.giftProduct)):[]
                  let isGift= this.giftBox.map(item => item.object_name)
                  if(!isGift.includes('category')) this.giftBox.push(...res.data.giftCategory)
                  if(!isGift.includes('product')) this.giftBox.push(...res.data.giftProduct)
                  
                  // 重新计算配赠清单的返点额度
                  if(res.data.matchingProduct.length > 0) {
                    this.queryCategoryListMatching =[[]]
                    let categoryListMatching = JSON.parse(JSON.stringify(res.data.matchingProduct.filter(item => item.object_name === 'category')))
                    categoryListMatching.forEach(item => {
                      item.category_id = item.id
                      item.category_name = item.name
                      delete item['id']
                      delete item['name']
                    })
                    res.data.matchingProduct.forEach((item,index) => {
                      item.pro_id ?  item.pro_id = item.pro_id : item.pro_id  = ''
                      item.pro_name ?  item.pro_name = item.pro_name : item.pro_name  = ''
                      item.number ?  item.number = item.number : item.number  = 1
                      item.rebateLimit = +this.formData.matchingLimit
                      item.rebateValue = item.price ? +item.price : 0
                        //配赠-商品-下拉框
                      this.categoryListMatching = categoryListMatching
                      
                      //配赠-商品-下拉框
                      this.queryCategoryListMatching[index] = []
                      this.queryCategoryListMatching[index].push(item)

                    })

                    // 当有折扣返回时，替代配赠活动清单数据
                    if(this.formData.matchingProduct.length === 0 || res.data.matchingProduct) this.formData.matchingProduct = res.data.matchingProduct
                    this.formData.matchingProduct.forEach((item, index) => {
                      this.queryCategoryListMatching[index] = []
                      // this.matchingList.map(data => {
                      //   if (index > currentIndex) {
                      //     // 只计算后面(下一列开始)的额度
                      //     let lastItem = this.formData.matchingProduct[index - 1];
                      //     // rebateLimit 当行的返点额度; rebateValue 返点货值
                      //     let result = (parseInt(lastItem.rebateLimit * 100 - lastItem.rebateValue * 100) / 100);  // 防止精度丢失
                      //     this.$set(this.formData.matchingProduct[index], 'rebateLimit', result);
                      //   } else if (index === 0) {
                      //     this.$set(this.formData.matchingProduct[index], 'rebateLimit', this.formData.matchingLimit); // 首行原始返点额度
                      //   }
                      // })
                    });
                  }
                //循环giftBox-赋值类目来源
                this.categoryList = []
                this.giftBox.forEach((item,index) => {
                  if(index == 0){
                    this.categoryList[0] = res.data.giftCategory
                  }else{
                    this.categoryList.push(res.data.giftCategory)
                  }
                  this.queryCategory(item.pro_name,index)
                })
                //-TODO -end-09
                // 重新计算返点清单的返点额度
                this.formData.backPoint.forEach((item, index) => {
                  if (index > currentIndex) {
                    // 只计算后面(下一列开始)的额度
                    let lastItem = this.formData.backPoint[index - 1];
                    // rebateLimit 当行的返点额度; rebateValue 返点货值
                    let result = (parseInt(lastItem.rebateLimit * 100 - lastItem.rebateValue * 100) / 100);  // 防止精度丢失
                    this.$set(this.formData.backPoint[index], 'rebateLimit', result);
                  } else if (index === 0) {
                    this.$set(this.formData.backPoint[index], 'rebateLimit', this.formData.backPointLimit); // 首行原始返点额度
                  }
                });
                let resData = res.data.orderProduct; // 产品信息(折扣、数量、价格、id)
                for (let i in this.formData.orderProduct) {
                  let orderProduct = this.formData.orderProduct[i];
                  resData.map(item => {
                    if (item.pro_id == orderProduct.pro_id) {
                      //字段为-部分-覆盖式操作-对象keys循环试了一次有问题
                      orderProduct.discount = item.discount ? item.discount : '';
                      orderProduct.purchasing_price = item.purchasing_price ? item.purchasing_price : '';
                      orderProduct.total_price = item.total_price ? Number(item.total_price) : 0;
                      orderProduct.originalPrice = item.product_number ? item.product_number:'';
                     orderProduct.price =  item.price ? item.price : orderProduct.price;
                    }
                  })
                  this.$set(this.formData.orderProduct, i, orderProduct);
                }
              });
          }
        },900)
      },
      // 计算单个返点商品/赠品的总金额
      getLimitPrice(currentIndex, other) {
        if (other === 'backPoint' && this.formData.backPoint[currentIndex].number > -1) {
          if (!this.formData.backPoint[currentIndex].pro_name) {
            this.$Message.warning('请先填写返点产品名称');
            return false;
          }
          let backPoint = this.formData.backPoint[currentIndex];
          // 计算单个返点货值
          backPoint.rebateValue = ((backPoint.price * 100) * backPoint.number) / 100;
          // 计算额度
          this.calculationLimit(currentIndex, 'backPoint', 'backPointLimit');
          backPoint.total_price = (Number(backPoint.price === undefined ? 0 : (backPoint.price * 100)) * Number(backPoint.number)) / 100;
          this.$set(this.formData.backPoint, currentIndex, backPoint);
          this.isDisabled = false;
          this.getAllLimitPrice('backPoint');
        } else if (other === 'repurchaseProduct' && this.formData.repurchaseProduct[currentIndex].number > -1) {
          if (!this.formData.repurchaseProduct[currentIndex].pro_name) {
            this.$Message.warning('请先填写换购产品名称');
            return false;
          }
          let repurchase = this.formData.repurchaseProduct[currentIndex];
          repurchase.total_value = (Number(repurchase.price === undefined ? 0 : (repurchase.price * 100)) * Number(repurchase.number)) / 100;
          repurchase.receivable = (repurchase.total_value * (repurchase.discount * 100)) / 100;
          this.$set(this.formData.repurchaseProduct, currentIndex, repurchase);
          this.isDisabled = false;
        } else if (other === 'matchingProduct' && this.formData.matchingProduct[currentIndex].number > -1) {
          if (!this.formData.matchingProduct[currentIndex].pro_name) {
            this.$Message.warning('请先填写配赠产品名称');
            return false;
          }
          let matching = this.formData.matchingProduct[currentIndex];
          // 计算单个配赠货值
          matching.rebateValue = ((matching.price * 100) * matching.number) / 100;
          // 计算额度
          // this.calculationLimit(currentIndex, 'matching', 'matchingLimit');
          this.$set(this.formData.matchingProduct, currentIndex, matching);
          this.isDisabled = false;
        } else {
          this.$Message.warning('请输入大于0的整数');
          this.isDisabled = true;
          return false;
        }
      },
      // 删除产品名称
      clearProItem(currentIndex, other) {
        this.isClear = true;
        let listdata = this.formData[other];
        listdata[currentIndex] = {};
        if (this.isClear == true) {
          this.$Message.error('请填写完整！');
        }
      },
      // 计算所有返点/赠品商品的总金额
      getAllLimitPrice(other) {
        if (other == 'backPoint') {
          this.formData.rebate_amount = 0;
          for (let i in this.formData.backPoint) {
            let changeNum = Number(this.formData.backPoint[i].total_price === undefined ? 0 : this.formData.backPoint[i].total_price)
            this.formData.rebate_amount = (this.formData.rebate_amount * 100 + changeNum * 100) / 100;
          }
        }
      },
      // 提交
      submitForm(name) {
        this.$refs[name].validate((valid) => {
          if (!valid) {
            this.$Message.error('必填项不能为空!');
            return false;
          }
          this.buttonLoading = true;
          let formData = this.formData;
          if (formData.status) {
            formData.status = formData.status.replace(/OrderWorkflow\//, '');
          }
          formData.remark = this.formDataRemark;
          // 判断收货地址
          for (let i in this.formData.contractorReceivingAddrGroup) {
            if (this.formData.receiving_address == this.formData.contractorReceivingAddrGroup[i].receiving_address) {
              this.formData.province = this.formData.contractorReceivingAddrGroup[i].province;
              this.formData.province_id = this.formData.contractorReceivingAddrGroup[i].province_id;
              this.formData.city = this.formData.contractorReceivingAddrGroup[i].city;
              this.formData.city_id = this.formData.contractorReceivingAddrGroup[i].city_id;
              this.formData.county = this.formData.contractorReceivingAddrGroup[i].county;
              this.formData.county_id = this.formData.contractorReceivingAddrGroup[i].county_id;
            }
          }
          let params;
          if (this.formData.backPointLimit && this.formData.backPointLimit > 0) {
            params = {...formData, rebate_product_amount: this.rebateValue || 0};
          } else {
            params = {
              ...formData,
              rebate_product_amount: this.rebateValue || 0,
              backPoint: [],
              rebate_amount: undefined
            };
          }
          // 过滤不填的返点、换购、配赠
          params.backPointProduct = []
          // params.repurchaseProduct = []
          params.matchingProduct = []
          this.formData.backPoint.map(item => {
            if (item.pro_id) {
              params.backPointProduct.push(item)
            }
          })
          params.repurchaseProduct = this.formData.repurchaseProduct.filter(item => {
            return item.pro_id
          })
          params.matchingProduct = this.formData.matchingProduct.filter(item => {
            return item.pro_id
          })
          this.draftTurn = true
          delete params['partnerPolicyGroup']
          delete params['contractorReceivingAddrGroup']
          delete params['categoryList']
          
          let giftProduct = JSON.parse(JSON.stringify(this.giftBox))
          params.giftProduct = JSON.parse(JSON.stringify(giftProduct))
          //为满赠的商品替换字段-low做法
          if(params.giftProduct.length > 0){
            params.giftProduct = params.giftProduct.map(item => {
                let number = item.gift_number
                let gift_number = item.number
                item.number = number
                item.gift_number = gift_number
                return item
            })
            params.giftProduct.forEach((item,index) => {
              if(!item.pro_id&&!item.pro_name){
                params.giftProduct.splice(index,1)
              }
            })
          }
          if (this.editType == 'draft') { //草稿提交 --- 订单审核--增加3类活动优化：草稿提交接口删除，走订单修改接口
            if (!params.id) {
              params.id = this.draftId
            }
            params.rebate_amount = params.rebate_amount || "0.00"
            if (!params.id) {
              params.id = this.draftId
            }
            
            this.$api.orderReviewEdit(params).then((res) => {
              if (res.code === 0) {
                this.$Message.success(res.message);
                this.$store.commit('removeTag', this.$route.name);
                this.$router.push({path: '/order-management/review'});
              } else {
                this.$Message.error(res.message);
              }
            }).finally(() => {
              this.buttonLoading = false;
            })
            return
          }
          if (this.queryId) {
            // 修改
            this.$api.orderReviewEdit(params)
              .then(res => {
                this.buttonLoading = false;
                if (res.code == 0) {
                  this.$Message.success(res.message);
                  this.$router.push({path: '/order-management/review'});
                } else {
                  if (res.data.length > 0) {
                    for (let i in res.data) {
                      this.$Message.warning(res.data[i]);
                    }
                  } else {
                    this.$Message.error(res.message);
                  }
                }
              }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            // 新增
            this.$api.orderReviewCreate(params)
              .then(res => {
                this.buttonLoading = false;
                if (res.code == '0') {
                  this.$Message.success(res.message);
                  this.$router.push({path: '/order-management/review'});
                } else {
                  if (res.data.length > 0) {
                    for (let i in res.data) {
                      this.$Message.error(res.data[i]);
                    }
                  } else {
                    this.$Message.error(res.message);
                  }
                }
              }).finally(() => {
              this.buttonLoading = false;
            });
          }
        });
      },
      addItem(index, other) {
        if (other == 'backPoint') {
          this.backPointIndex++;
          let rebateLimit = 0;
          if (this.formData.backPoint.length < 1) {
            rebateLimit = this.formData.backPointLimit;
          } else {
            let lastItem = this.formData.backPoint[this.formData.backPoint.length - 1];
            rebateLimit = (parseInt(lastItem.rebateLimit * 100 - lastItem.rebateValue * 100) / 100) || lastItem.rebateLimit;
          }
          this.formData.backPoint.push({
            index: this.backPointIndex,
            rebateLimit,
            number: 0
          });
        } else if (other == 'repurchaseProduct') {
          this.repurchaseIndex++
          this.formData.repurchaseProduct.push({
            index: this.repurchaseIndex,
            number: 0
          });
        } else if (other == 'matchingProduct') {
          //仅过滤是类目类型的数据
          let categoryArr = this.formData.matchingProduct.filter(item => item.object_name !== 'product')
          if(categoryArr.length > 0){
                let pop = true
                categoryArr.forEach(item => {
                  if(!item.pro_id && !item.pro_name) {
                    pop = false
                  }
                })
                if(!pop) return this.$Notice.error({title:'警告',desc:'请先填写完数据'})
                /**]
                 * 此处有坑-第一：如果有多种类目-
                 * 坑-已解决，后期迭代需注意层级问题
                 */
                let obj = {
                  // rebateLimit:this.formData.matchingLimit,
                  number: 0,
                  pro_id: '',
                  pro_name: '',
                }
                let queryCategoryListMatching = this.queryCategoryListMatching[index]
                this.formData.matchingProduct.push(obj);
                this.queryCategoryListMatching.push(queryCategoryListMatching);

          }else{
            this.$Notice.warning({title:'提示',desc:'没有别的可增加~'})
            return
          }
        } else if (other == 'giftBox') {
          if(this.giftBox.filter(item => item.object_name === 'category').length < 1) return this.$Notice.warning({title:'提示',desc:'商品不可添加~'})
          let pop = true
          this.giftBox.forEach(item => {
            if(!item.pro_id && !item.pro_name) {
              pop = false
            }
          })
          if(!pop) return this.$Notice.error({title:'警告',desc:'请先填写完数据'})
          
          let obj = {}
          //来源
          let categoryarr = []
          let categoryarrBox = JSON.parse(JSON.stringify(this.categoryList))
          let categoryObj = {}
          this.giftBox.forEach((item,index)=>{
            if(item.object_name === 'category'){
              categoryarr = this.categoryList[0]

            }
          })
          if(JSON.stringify(categoryObj) !== "{}")categoryarr.push(categoryObj)
          categoryarrBox.push(categoryarr)
          this.categoryList = categoryarrBox
          this.giftBox.push(obj);
          this.queryCategoryList.push([])
        }  else {
          this.productIndex++;
          this.formData.orderProduct.push({
            index: this.productIndex,
            number: 0
          });
        }
      },
      removeItem(index, other) {
        if (other == 'backPoint') {
          let backPoint = this.formData.backPoint;
          backPoint.splice(index, 1);
          this.$set(this.formData, 'backPoint', backPoint);
        } else if (other == 'repurchaseProduct') {
          let repurchase = this.formData.repurchaseProduct;
          repurchase.splice(index, 1);
          this.$set(this.formData, 'repurchaseProduct', repurchase);
        } else if (other == 'matchingProduct') {

          let matching = this.formData.matchingProduct;
          matching.splice(index, 1);
          this.queryCategoryListMatching.splice(index, 1);
          this.$set(this.formData, 'matchingProduct', matching);

        }  else if (other == 'giftBox') {

          let giftBox = this.giftBox;
          giftBox.splice(index, 1);
          this.queryCategoryList.splice(index, 1);
          this.categoryList.splice(index, 1);
          this.$set(this.giftBox, giftBox);

        } else {
          let orderProduct = this.formData.orderProduct;
          orderProduct.splice(index, 1);
          this.queryProductDiscount(parseInt(index) - 1);
          this.$set(this.formData, 'orderProduct', orderProduct);
        }
      },
      // 转换时间格式
      formatDate(time) {
        return this.$format(time, 'yyyy-MM-dd hh:mm');
      },
      /**
       * 获取当前时间
       * 格式YYYY-MM-DD
       */
      zero(n) {
        return n < 10 ? '0' + n : n;
      },
      getNowFormatDate() {
        let date = new Date();
        let seperator1 = '-';
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let strDate = date.getDate();
        let hour = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        let currentDate = year + seperator1 + this.zero(month) + seperator1 + this.zero(strDate) + ' ' + this.zero(hour) + ':' + this.zero(minutes) + ':' + this.zero(seconds);
        return currentDate;
      },
      // 获取订单详情
      fetchData(id) {
        this.$api.orderReviewDetails(id)
          .then(res => {
            if (res.code == 0) {
              this.openGift = false
              this.spinLoading = true;
              this.formData = {...res.data, ...res.data.discount.limit};
              this.formData.follow_id = res.data.salesman_id; // 业务员id;
              this.followUserInfoList = res.data.contractorFollowInfo; // 业务员选项
              this.formData.contractorReceivingAddrGroup = this.formData.contractorReceivingAddrGroup.map(v => {
              return {
                ...v,
                newAddress:v.province + v.city + v.county +' '+ v.receiving_address
              }
            }); // 所有收货地址（数组）
            !this.formData.contractorReceivingAddrGroup ?  this.formatDate.new_receiving_address =this.formData.contractorReceivingAddrGroup[0].newAddress :  this.formatDate.new_receiving_address = ''
              // partnerPolicyGroup
              if (this.formData.order_form === 'MiniProgram') {
                this.isMiniProgram = true;
              }

              this.createdAt = this.formatDate(this.formData.created_at);
              this.username = this.formData.created_by;
              this.formDataRemark = this.formData.remark;
              this.formData.order_time = this.$format(res.data.order_time, 'yyyy-MM-dd hh:mm');
              // 表格数据加载
              this.queryContranctorList = this.formData.contractPolicies
              if (this.formData.giftProduct.length > 0) {
                this.formData.giftStartingAmount = +this.formData.giftProduct[0].starting_amount; // 赠品的满赠应收金额
                if(this.formData.discount.limit){
                  this.formData.giftStartingAmount = this.formData.giftStartingAmount ? this.formData.giftStartingAmount : +this.formData.discount.limit.giftStartAmount; // 赠品的满赠应收金额
                }
              }
              this.queryContranctorList.map((item, i) => {
                if (this.formData.merchant_id == item.id) {
                  this.formData.partnerPolicyGroup = this.queryContranctorList[i].filterPartnerPolicyGroup; // 包含政策（合同政策）
                  this.systemInfoList = item.systemInfo // 系统门店选项数组
                  this.partnerPolicyList = item.partnerInfoByContracts // 合作商政策选项数组
                }
              })
              this.formData.systemInfoId = res.data.system_info_id
              this.formData.partner_policy_id = res.data.partner_policy_id;
              this.formData.partner_policy_name = res.data.partner_policy_name;
              this.getPartnerPolicy({
                value: res.data.partner_policy_id,
                label: res.data.partner_policy_name
              })
              // 收货地址ID
              this.formData.contractor_address_id = this.formData.contractor_receiving_addr_group_id
              // 返点额度
              this.formData.backPointLimit = +this.formData.rebate_limit
              // 换购
              this.formData.matchingLimit = +this.formData.matching_limit
              if (this.formData.repurchaseProduct.length < 1) {
                this.$set(this.formData.repurchaseProduct, 0, {
                  index: '',
                  number: 0
                });
              } else {
                this.formData.repurchaseProduct.forEach((item, index) => {
                  item.number = parseInt(item.number);
                  this.getLimitPrice(index, 'repurchaseProduct')
                });
              }
              // 配赠额度
              if (this.formData.matchingProduct.length < 1) {
                // this.$set(this.formData.matchingProduct, 0, {
                //   number: 0
                // });
              } else {
                this.categoryListMatching = res.data.discount.matchingProduct.filter(item => item.object_name === 'category').map(item => ({category_id: item.id, category_name: item.name, object_name: item.object_name}))
                this.formData.matchingProduct.map((item, index) => {
                  item.number = +item.number
                  let obj = {
                    ...item,
                    pro_id: item.pro_id,
                    pro_name: item.pro_name
                  }
                  //设置下拉框
                  this.queryCategoryListMatching[index] = [obj]
                  // 计算
                  this.getLimitPrice(index, 'matchingProduct')
                  // 将获取的值配赠-类目存储
                  // this.categoryListMatching[index] = []
                  // // if(item.object_name !== 'product'){
                  // this.categoryListMatching[index].push({
                  //   category_id:item.category_id,
                  //   category_name:item.category_name,
                  // })
                  // }
                })
              }
              this.formData.orderProduct.forEach(item => {
                item.number = parseInt(item.number);
                this.queryProductList.push(item);
              });
              if (this.formData.orderProduct.length < 1) {
                this.$set(this.formData.orderProduct, 0, {
                  index: '',
                  number: 0
                });
              }
              if (this.formData.backPoint.length < 1) {
                this.$set(this.formData.backPoint, 0, {
                  index: '',
                  number: 0
                });
              } else {
                this.formData.backPoint.forEach(item => {
                  item.number = parseInt(item.number);
                  this.queryProductList.push(item);
                });
              }
              //TODO -start
              let { giftProduct } = res.data
              let categoryList = giftProduct.map((item,index) => {
                let name = {
                  category_id: item.category_id?item.category_id:item.id,
                  name: item.category_name,
                  number: item.number,
                  object_name:item.object_name
                }
                return name
              })
              categoryList = categoryList.filter(item => item.object_name === "category")
              /**
               * 逻辑
               * 循环已获得赠品
               * 将其赋值到产品的下拉框匹配
               * */
              giftProduct.forEach((item,index) => {
                item.gift_number = item.gift_number ? Number(item.gift_number) : Number(1)
                let name = {
                  box_standard: item.box_standard,
                  id: item.pro_id,
                  name: item.pro_name,
                  price: item.price,
                  standard:item.standard,
                  unit: item.unit,
                  number: item.number,
                  gift_number: item.gift_number ? item.gift_number : Number(1)
                }
                if(index == 0){
                  this.queryCategoryList[0] = [name]
                }else{
                  this.queryCategoryList.push([name])
                }
              })
            // 翻转数组
              if(giftProduct.length > 0){
                  this.giftBox = giftProduct.map(item => {
                    let number = item.gift_number
                    let gift_number = item.number
                    item.number = number
                    item.gift_number = +gift_number
                    return item
                })
              }
              
              //循环giftBox-赋值来源数组
              this.giftBox.forEach((item,index) => {
                if(index == 0){
                  this.categoryList[0] = categoryList
                }else{
                  this.categoryList.push(categoryList)
                }
              })
              //TODO -end
              this.repurchaseList = this.formData.repurchaseProduct
              this.matchingList = this.formData.matchingProduct
              // 计算单个返点货值
              this.formData.backPoint.forEach((item, index) => {
                if (item.pro_id) {
                  item.rebateValue = ((item.price * 100) * item.number) / 100;
                }
              });
              // 计算额度
              this.calculationLimit(0, 'matchingProduct', 'matchingLimit');
              this.calculationLimit(0, 'backPoint', 'backPointLimit');
              // 计算各个产品货值
              for (let i in this.formData.orderProduct) {
                this.formData.orderProduct[i].originalPrice = parseFloat(this.formData.orderProduct[i].product_amount);
              }
              if (this.formData.orderProduct.length > 1) { //过滤为空的产品
                this.formData.orderProduct = this.formData.orderProduct.filter(function (item) {
                  return item.pro_id != 0 && item.pro_name != ''
                })
              }
              
              this.formData.contract_policy_name = res.data.contract_policy_name;
              this.formData.contract_policy_id = res.data.contract_policy_id;
              this.getContractPolicy(
                {label:this.formData.contract_policy_name,
                value:this.formData.contract_policy_id 
                })
            }
          });
      },
      // 计算额度
      calculationLimit(currentIndex, type, limit) {
        this.formData[type].forEach((item, index) => {
          if (index > currentIndex) {
            // 只计算后面(下一列开始)的额度
            let lastItem = this.formData[type][index - 1];
            this.$set(this.formData[type][index], 'rebateLimit', (parseInt(lastItem.rebateLimit * 100 - lastItem.rebateValue * 100) / 100) || lastItem.rebateLimit);
          } else if (index === 0) {
            this.$set(this.formData[type][index], 'rebateLimit', this.formData[limit]);
          }
        });
      },
      // 充值货值清单项/返点清单项
      clearItem(i, key) {
        if(key === 'giftBox'){
          let type = this[key][i].object_name
          let number = this[key][i].number
          this.$set(this[key], i, {
            object_name:type,
            number
          });
        }else if(key === 'matchingProduct'){
          let type = this.formData[key][i].object_name
          let number = this.formData[key][i].number
          let category_name = this.formData[key][i].category_name
          let category_id = this.formData[key][i].category_id
          this.$set(this.formData[key], i, {
            object_name:type,
            number,
            category_id,
            category_name,
          });
        }
        else{
          this.$set(this.formData[key], i, {
            object_name:'product'
          });
        }
      },
      openPolicyDetail() {
        this.$refs.policyDetail.getAgreeDetail(this.formData.contract_policy_id)
      },
      // 计算配赠活动额度
      computedMatchLimit(item = 0) {
        let all = this.formData.matchingLimit
        let use = 0
        this.formData.matchingProduct.forEach(item => {
          use += item.rebateValue || 0
        })
        return all - use + item
      },
      // 返回
      goBack() {
        this.$router.push('/order-management/review')
      },
    },
    mounted() {
      let id = this.$route.query.id;
      let type = this.$route.query.type;
      // 编辑
      if (id) {
        if (!!type) { //草稿箱
          this.editType = 'draft'
        } else {
          this.draftTurn = true // 编辑不触发被动保存
        }
        this.queryId = id;
        // 获取订单详情
        this.fetchData(id);
      } else {
        this.username = Cookies('real_name');
        this.createdAt = this.getNowFormatDate(new Date());
      }
      ;
      // 获取当前时间
      this.getNowFormatDate();
    },
    computed: {
      backPointSelectValue() { // 选购返点货值
        let total = 0
        if (this.formData.backPoint.length > 0) {
          this.formData.backPoint.map(item => {
            if (item.rebateValue) {
              total += item.rebateValue
            }
          })
        }
        return total
      },
      matchingSelectSelectValue() { // 选购配赠货值
        let total = 0
        if (this.formData.matchingProduct.length > 0) {
          this.formData.matchingProduct.map(item => {
            if (item.rebateValue) {
              total += item.rebateValue
            }
          })
        }
        return total
      },
      totalDiscount() { // 总优惠金额
        this.formData.totalOrderAmount = typeof this.formData.totalOrderAmount === 'undefined' ? this.formData.origin_order_amount : this.formData.totalOrderAmount
        this.formData.reductionAmount = typeof this.formData.reductionAmount === 'undefined' ? 0 : this.formData.reductionAmount
        this.formData.reductionProportion = typeof this.formData.reductionProportion === 'undefined' ? 0 : this.formData.reductionProportion
        let discount = ((this.formData.totalOrderAmount * 100) * (this.formData.reductionProportion * 100000)) / 10000000
        return +this.formData.reductionAmount + discount
      },
      orderReceivable() { // 订单应收金额
        this.formData.totalOrderAmount = typeof this.formData.totalOrderAmount === 'undefined' ? this.formData.origin_order_amount : this.formData.totalOrderAmount
        let total = 0
        let totalOrderAmount = this.formData.totalOrderAmount * 100
        let repurchaseAmount = 0
        let totalDiscount = this.totalDiscount * 100
        this.formData.repurchaseProduct.map(item => {
          if (item.receivable) {
            repurchaseAmount += (item.receivable * 100)
          }
        })
        total = (totalOrderAmount + repurchaseAmount - totalDiscount) / 100
        return total
      }
    },
    beforeDestroy() {
      if (!this.draftTurn) { //跳转、提交、没填写政策名称不用被动保存
        if (!!this.formData.merchant_name) {
          this.keepDraft()// 被动保存
        }
      }
    }
  };
</script>
<style lang="less" scoped>
  /deep/ .ivu-row {
    margin-bottom: 14px !important;
  }

  .border-row {
    margin-bottom: 20px;
    border: 1px solid rgb(233, 233, 233);

    .add-table-list {
      padding: 30px 10px 40px;

      .header {
        margin-bottom: 10px;
      }

      .content {
        margin-bottom: 10px;
      }
    }
  }

  .border-span {
    border: 1px dashed rgb(221, 222, 225);
    border-radius: 5px;
    padding: 10px 15px 20px;
  }

  .border-row .basic {
    padding: 20px;
  }

  .address {
    margin-bottom: 20px;
  }

</style>
<style lang="less" scoped>
  .border-row .title {
    height: 50px;
    line-height: 50px;
    padding-left: 10px;
    width: 100%;
    font-size: 18px;
    color: #000;
    background-color: rgb(250, 250, 250);
    border-bottom: 1px solid rgb(233, 233, 233);
    // text-align: center;
  }

  .item-title {
    font-weight: bold;
    // text-align: center;
    padding: 10px;
  }

  .rebateInput.error {
    /deep/ .ivu-input {
      border-color: #ed4014;
    }

    /deep/ .ivu-input:hover {
      border-color: #ed4014;
    }
  }
</style>

