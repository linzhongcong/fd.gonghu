<template>
  <div>
    <Form ref="formData" :model="formData" :rules="formRules" label-position="left" :label-width="120">
      <Card>
        <Row slot="title" style="text-align:right;">
          <Button type="warning" @click="openDraft()">存为草稿</Button>
          <Button type="success" :loading="buttonLoading" @click="submitForm('formData')" :disabled="isDisabled">提交
          </Button>
        </Row>
        <Row class="border-row">
          <div class="title">基础信息</div>
          <div class="basic">
            <Row>
              <Col :sm="8" :xs="24">
                <FormItem label="业务员：" prop="username" :label-width="120">
                  <Select :label="formData.real_name" :loading="isLoading" v-model="formData.username" filterable remote
                          :remote-method="queryUserDebonce" @on-change="selectUser" label-in-value
                          placeholder="请输入工号或者姓名">
                    <Option v-for="option in userList" :key="'user'+option.id" :value="option.username"
                            :label="`${option.real_name} / ${option.username}`"></Option>
                  </Select>
                </FormItem>
              </Col>
              <Col :sm="8" :xs="24">
                <FormItem label="商家名称：" prop="merchant_name" :label-width="120">
                  <Input v-model.trim="formData.merchant_name" placeholder="请输入商家名称"></Input>
                </FormItem>
              </Col>
              <Col :sm="8" :xs="24">
                <FormItem label="联系人姓名：" prop="contact_name" :label-width="120">
                  <Input v-model.trim="formData.contact_name" placeholder="请输入联系人姓名"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col :sm="8" :xs="24">
                <FormItem label="联系电话：" prop='contact_phone' :label-width="120">
                  <Input v-model.trim="formData.contact_phone" placeholder="请输入联系电话"></Input>
                </FormItem>
              </Col>
              <Col :sm="8" :xs="24">
                <FormItem label="商家类型：" prop="merchant_type" :label-width="120">
                  <Select v-model.trim="formData.merchant_type" style="width:200px">
                    <Option v-for="item in businessType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col :sm="8" :xs="24">
                <FormItem label="合同签约日期：" prop="begin_ats">
                  <DatePicker v-model.trim="formData.begin_ats" type="date" @on-change="changeBeginAt" formate="yyyy-MM-dd"
                              style="width: 200px" placeholder="请选择日期"></DatePicker>
                </FormItem>
              </Col>
              <Col :sm="8" :xs="24">
                <FormItem label="合同到期日期：" prop="end_ats">
                  <DatePicker v-model.trim="formData.end_ats" type="date" @on-change="changeEndAt" formate="yyyy-MM-dd"
                              style="width: 200px" placeholder="请选择日期"></DatePicker>
                </FormItem>
              </Col>
              <Col :sm="8" :xs="24">
                <FormItem label="开始合作日期：" prop="cooperate_start_ats">
                  <DatePicker v-model.trim="formData.cooperate_start_ats" type="date" @on-change="changeStartAt"
                              formate="yyyy-MM-dd" style="width: 200px" placeholder="请选择日期"></DatePicker>
                </FormItem>
              </Col>
            </Row>
            <Row>
              
              <FormItem label="营业执照："  :label-width="120">
              <Col :sm="15" :xs="24">
              <Row type='flex' justify="start">
                <Col v-if="formData.businessLicense.length > 0">
                <div class="upload-list"  v-for="(item,index) in formData.businessLicense" :key="index">
                <template >
                    <img :src="item.url_show" style="width:100px;height:100px;object-fit:cover">
                    <div class="upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleView(item,index,'1','businessLicense')"></Icon>
                        <Icon type="ios-trash-outline" @click.native="handleRemove(item,index,'1','businessLicense')"></Icon>
                    </div>
                </template>
                </div>
               </Col>
               <Col v-if="formData.businessLicense.length < 3">
                  <Upload ref="businessLicenseUpload"
                        name="UploadForm[file]"
                        :on-progress="coaProgressFile"
                        :default-file-list="formData.businessLicense"
                        :show-upload-list="false" 
                        :on-success="(res,file) => coaSuccess(res,file,'1','businessLicense')"
                        :on-remove="filePrepareRemove"
                        :on-format-error="fileFormatError"
                        :on-preview="previewUpload"
                        :max-size="51200"
                        :on-error="(error,file) => oaError(error,file,'businessLicense')"
                        :on-exceeded-size="fileMaxSize"
                        type="drag"
                        :action="fileUploadURL"
                        :headers="fileUploadHeaders"
                        style="display: inline-block">
                    <div class="breadth">
                      <Icon type="md-add" size="20"></Icon>
                    </div>
                </Upload>
              </Col>
              </Row>
              </Col>
              </FormItem>
            
            </Row>
          </div>
        </Row>

        <Row class="border-row">
          <div class="title">地址</div>
          <div class="basic">
            <Row ref="contract_addr" class="contract_addr">
              <Col><div style="height:40px;line-height:40px;font-size:16px">合同地址</div></Col>
              <Col :xs="24">
                <FormItem label="合同地址：" prop="contract_addr" :label-width="90">
                  <Input v-model.trim="formData.contract_addr" placeholder="请输入合同地址"></Input>
                </FormItem>
              </Col>
            </Row>
            <hr class="hr"/>
            <!-- 收货地址添加编辑改为表格-导入增删改查 -->
            <Row ref="contractorReceivingAddrGroup" class="contractorReceivingAddrGroup">
              <Col><div style="height:40px;line-height:40px;font-size:16px">收货信息</div></Col>
              <Col>
                  <Row type="flex" @keydown.native.enter.prevent="searchFromTable('address')" >
                    <Col :span="12">
                      <FormItem label="收货详细地址：" :label-width='100'>
                        <Input v-model="fromTable.contractorReceivingAddrSearch.receiving_address" 
                        style="width: 100%" v-if="fromTable.contractorReceivingAddrSearch" 
                        placeholder="收货地址"
                        clearable />
                      </FormItem>
                    </Col>
                    <Col :span="6">
                      <FormItem :label-width='0'>
                        <Button type="primary" @click="searchFromTable('address')">搜索</Button>
                      </FormItem>
                    </Col>
                    <Col :span="6" align="right">
                      <Button type="primary" @click="tabAction('address','push')" :loading='addressOrShopLoading.addressUpLoading'>导入</Button>
                      <Button type="primary" @click="tabAction('address','add')" :loading='addressOrShopLoading.addressAddLoading'>添加</Button>
                      <Button type="primary" @click="tabAction('address','edit')" :loading='addressOrShopLoading.addressEditLoading'>修改</Button>
                      <Button type="primary" @click="tabAction('address','del')" :loading='addressOrShopLoading.addressDelLoading'>删除</Button>
                    </Col>
                  </Row>
                <!-- </Form> -->
              </Col>
              <Col>
                <Row v-if="fromTable.contractorReceivingAddrSearch">
                  <Table :columns="fromTable.contractorReceivingAddrSearch.columns" 
                        :loading='fromTable.contractorReceivingAddrSearch.addressLoading'
                        :data="fromTable.contractorReceivingAddrGroupList" border 
                        @on-selection-change="(val)=>selectOne(val,'address')"
                        @on-select-all="(val)=>selectAll(val,'address')"
                        @on-select-all-cancel="(val)=>cancelAll(val,'address')">
                  </Table>
                </Row>
                <Row type="flex" style="margin: 10px;overflow: hidden">
                  <Col :span="3" >共 {{ fromTable.contractorReceivingAddrSearch.totalCount }} 条</Col>
                  <Col :span="21" align='right'>
                    <Page :total="fromTable.contractorReceivingAddrSearch.totalCount" size="small" :current="fromTable.contractorReceivingAddrSearch.page" show-sizer show-elevator
                          :page-size='fromTable.contractorReceivingAddrSearch.perPage'
                           :page-size-opts='[5,10,20,40]'
                          @on-change="(val)=>changeStorePage(val,'address')" @on-page-size-change="(val)=>changeStorePageSize(val,'address')"></Page>
                  </Col>
                </Row>
              </Col>
            </Row>
            <hr class="hr"/>
            <Row ref="shopAddressTable" class="shopaddress">
              <Col><div style="height:40px;line-height:40px;font-size:16px">门店信息</div></Col>
              <Col>
                  <Row type="flex" justify="space-between"  @keydown.native.enter.prevent="searchFromTable('shopAddress')">
                    <Col :span="6">
                      <FormItem label="门店名称：" :label-width='80'>
                        <Input v-model="fromTable.shopAddrSearch.name" style="width: 100%" v-if="fromTable.shopAddrSearch" placeholder="门店名称" clearable />
                      </FormItem>
                    </Col>
                    <Col :span="6">
                      <FormItem label="门店地址：" :label-width='80'>
                        <Input v-model="fromTable.shopAddrSearch.address" style="width: 100%" v-if="fromTable.shopAddrSearch" placeholder="门店地址" clearable/>
                      </FormItem>
                    </Col>
                    <Col :span="6">
                      <FormItem  :label-width='0'>
                        <Button type="primary" @click="searchFromTable('shopAddress')">搜索</Button>
                      </FormItem>
                    </Col>
                    <Col :span="6" align="right">
                      <Button type="primary" @click="tabAction('shopAddress','push')" :loading='addressOrShopLoading.shopUpLoading'>导入</Button>
                      <Button type="primary" @click="tabAction('shopAddress','add')" :loading='addressOrShopLoading.shopAddLoading'>添加</Button>
                      <Button type="primary" @click="tabAction('shopAddress','edit')" :loading='addressOrShopLoading.shopEditLoading'>修改</Button>
                      <Button type="primary" @click="tabAction('shopAddress','del')" :loading='addressOrShopLoading.shopDelLoading'>删除</Button>
                    </Col>
                  </Row>
                <!-- </Form> -->
              </Col>
              <Col>
                <Row v-if="fromTable.shopAddrSearch">
                  <Table :columns="fromTable.shopAddrSearch.columns" 
                        :loading='fromTable.shopAddrSearch.shopLoading'
                        :data="fromTable.shopAddrList" border 
                        @on-selection-change="(val)=>selectOne(val,'shop')"
                        @on-select-all="(val)=>selectAll(val,'shop')"
                        @on-select-all-cancel="(val)=>cancelAll(val,'shop')">
                    <div slot-scope="{row, index}" slot="facadeFileItem" :key="index + 'facadeFileItem'">
                     <div class="upload-list" v-for="(item2,index2) in row.fileItems" :key="index2">
                       <template >
                        <img :src="item2.url_show" style="width:100px;height:100px;object-fit:cover">
                        <div class="upload-list-cover">
                            <Icon type="ios-eye-outline" @click.native="handleView(item2,index2,'1','facadeFileItem')"></Icon>
                        </div>
                      </template>
                     </div>
                    </div>
                  </Table>
                </Row>
                <Row type="flex" style="margin: 10px;overflow: hidden">
                  <Col :span="3" >共 {{ fromTable.shopAddrSearch.totalCount }} 条</Col>
                  <Col :span="21" align='right'>
                    <Page :total="fromTable.shopAddrSearch.totalCount" size="small" :current="fromTable.shopAddrSearch.page" show-sizer show-elevator
                          :page-size='fromTable.shopAddrSearch.perPage'
                          :page-size-opts='[5,10,20,40]'
                          @on-change="(val)=>changeStorePage(val,'shop')" @on-page-size-change="(val)=>changeStorePageSize(val,'shop')"></Page>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </Row>
        <Row class="border-row">
          <div class="title">政策</div>
          <div class="basic">
            <Row>
              <Col :sm="8" :xs="24">
                <FormItem label="合作商政策：" prop="policy_name" :label-width="100">
                  <Select :label="formData.partner_policy_name"
                          v-model.trim="formData.partner_policy_id"
                          filterable
                          remote
                          @keypress.native="isFirst = true"
                          @on-open-change="isFirst = true"
                          :label-in-value="true"
                          :loading="queryContractLoading"
                          :remote-method="queryContractDebonce"
                          @on-change="getContract"
                  >
                    <Option v-for="(item) in ContractType"
                            :key="'policy_name'+item.partner_policy_id"
                            :value="item.partner_policy_id"
                            :label="item.partner_policy_name"></Option>
                  </Select>
                </FormItem>
              </Col>
              <Col :sm="8" :xs="24">
                <FormItem label="合作方式：" prop="payment_method" :label-width="100">
                  <Select v-model.trim="formData.payment_method" style="width:200px" @on-change="selectMethod">
                    <Option v-for="item in cooperationType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col :sm="8" :xs="24">
                <FormItem label="账期设置：" prop="payment_days" :label-width="100">
                  <Select v-model.trim="formData.payment_days" style="width:200px"
                          :disabled="formData.payment_method === 'spot_cash'">
                    <Option v-for="item in paymentType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col :sm="8" :xs="24">
                <FormItem label="结款日：" prop="payment_at" :label-width="100">
                  <Input v-model.trim="formData.payment_at" placeholder="请输入结款日" style="width:200px"
                         :disabled="formData.payment_method === 'spot_cash'"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col :xs="24">
                <FormItem label="备注：" prop="remark" :label-width="100">
                  <Input v-model.trim="formData.remark" placeholder="请输入备注"></Input>
                </FormItem>
              </Col>
            </Row>
          </div>
        </Row>

        <Row class="border-row">
          <div class="title">附件</div>
          <div class="basic">
            <Upload ref="prepareFileUpload"
                    name="UploadForm[file]"
                    :on-progress="coaProgressFile"
                    :default-file-list="formData.fileItems"
                    :on-success="(res,file) => coaSuccess(res,file,'3','fileItems')"
                    :on-format-error="fileFormatError"
                    :max-size="51200"
                    :on-exceeded-size="fileMaxSize"
                    type="drag"
                    :action="fileUploadURL"
                    :headers="fileUploadHeaders"
                    style="display: inline-block">
              <div class="breadth">
                <Icon type="md-add" size="20"></Icon>
              </div>
            </Upload>
          </div>
        </Row>
      </Card>
      <Spin size="large" fix v-show="isGetData"></Spin>
    </Form>
    <!-- 草稿 -->
    <Modal v-model="draftModal" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>是否存为草稿</span>
      </p>
      <div style="text-align:center">
        <p>存为草稿将合同草稿列表生成一条数据</p>
      </div>
      <div slot="footer">
        <Button :loading="draftBtnModal" @click="saveDraft('continue')">保存并继续</Button>
        <Button :loading="draftBtnModal" @click="saveDraft('exit')">保存并退出</Button>
      </div>
    </Modal>
        <!-- 图片预览 -->
    <Modal v-model="showBusinessLicenseImg">
          <img :src="showBusinessLicenseImgUrl" v-if="showBusinessLicenseImg" style="width: 100%">
    </Modal>
    <!-- 收货地址&门店信息 弹窗 -->
    <Modal
    class="fromTableModal"
    v-model="fromTable.modal"
    :title="fromTable.title"
    :closable="false"
    :mask-closable="false"
    :width='fromTable.width'>
    <Form :label-width="130" ref="fromTable" :model="fromTable">
      <div v-if="fromTable.addressPushModal || fromTable.shopPushModal" style="text-align:center">
        <div class="modalTest" style="color:#f60;">
          <a href="javascript:void(0);" @click="downloadImport()">下载导入模版</a>
        </div>
        <Upload
        name="UploadForm[excel]"
        :action="fromTable.type == 'address'?addressFileUploadURL:shopFileUrl"
        :format="['xlsx']"
        :data="fromTable.type == 'address'?{batchNumber:formData.addrGroupBatchNumber?formData.addrGroupBatchNumber:'',contractor_id:queryId?queryId:''}:
          {batchNumber:formData.shopBatchNumber?formData.shopBatchNumber:'',contractor_id:queryId?queryId:''}"
        :headers="fileUploadHeaders"
        :show-upload-list="false"
        :on-success="handleUploadSuccess"
        :on-error="handleUploadError"
        style="display: inline-block">
          <p style="">
            <Button type="primary">选择导入的文件</Button>
          </p>
        </Upload>
      </div>
      <div v-if="fromTable.addressAddModal || fromTable.addressEditModal">
        <Row class="address">
          <Col span="22">
            <Col :span='6' class="startRules">收货地址地区</Col>
            <Col :span='12' class="startRules">收货详细地址</Col>
            <Col :span='3' class="startRules">联系人</Col>
            <Col :span='3' class="startRules">联系方式</Col>
          </Col>
        </Row>
        <Row v-for="(item, index) in fromTable.addEditContractorReceivingAddrGroup" :key="index+'AddrGroup'">
          <Col span="22" >
            <Row class="shopAddress">
              <Col :span="6">
                <FormItem
                label=""
                :label-width="0"
                :prop="'addEditContractorReceivingAddrGroup.'+ index +'.addressArr'"
                :rules="{required: true, message: '收货地址地区不能为空', pattern: /\S/, trigger: 'change'}">
                  <Cascader :data="province" :load-data="cityLoading" :clearable="false" v-model.trim="item.addressArr"
                            placeholder="所在地区"
                            @on-change="(v, arr) => {getProvince(v, arr,index, 'address')}" style="width:100%"></Cascader>
                </FormItem>
              </Col>
              <Col :span="12">
                <FormItem label=""
                          :prop="'addEditContractorReceivingAddrGroup.'+ index +'.receiving_address'"
                          :rules="{required: true, message: '收货地址不能为空', trigger: 'blur', type: 'string'}"
                          :label-width="0">
                  <Input v-model.trim="item.receiving_address" placeholder= "详细地址：如道路、门牌号、小区、楼栋号、单元室等"></Input>
                </FormItem>
              </Col>
              <Col :span="3">
                <FormItem label=""   
                          :prop="'addEditContractorReceivingAddrGroup.'+ index +'.contact'"
                          :rules="{required: true, message: '联系人不能为空', trigger: 'blur', type: 'string'}"
                          :label-width="0">
                  <Input v-model.trim="item.contact" placeholder="请输入联系人"></Input>
                </FormItem>
              </Col>
              <Col :span="3">
                <FormItem label="" 
                        :prop="'addEditContractorReceivingAddrGroup.'+ index +'.contact_information'"
                        :rules="{required: true, message: '联系方式不正确', trigger: 'blur', type: 'string',pattern: /^(((\d{3,4}-)?[0-9]{7,8})|(1(3|4|5|6|7|8|9)\d{9}))$/}"
                        :label-width="0">
                  <Input v-model.trim="item.contact_information" placeholder="请输入联系方式" type="text"></Input>
                </FormItem>
              </Col>
            </Row>
          </Col>
          <Col span="2" v-if="fromTable.addressAddModal">
            <Button v-if="index > 0" icon="md-remove" @click="removeItem(index, 'fms')"></Button>
            <Button v-else icon="md-add" @click="addItem(index, 'fms')"></Button>
          </Col>
        </Row>
      </div>
      <div v-if="fromTable.addressDelModal" style="display: flex;align-items: center;"><Icon type="ios-information-circle-outline" style="color:#0000ff" size='28'/>是否删除选择的收货地址数据</div>
      <div v-if="fromTable.shopAddModal || fromTable.shopEditModal">
        <Row class="address">
          <!-- <Col span="1" > &nbsp;</Col>
          <Col span="23" > 
              <Col span="5"  class="startRules"> 门店名称</Col>
              <Col span="6"  class="startRules" > 门店地址：</Col>
              <Col span="12" > 门店照片：</Col>
          </Col> -->
          <Col span="22">
            <Col :span="4" class="startRules">门店名称</Col>
            <Col :span="5" class="startRules">门店地区</Col>
            <Col :span="11" class="startRules">门店地址</Col>
            <Col :span="4" class="startRules">经营状态</Col>
          </Col>
        </Row>
        <Row v-for="(item, index) in fromTable.addEditShopAddr" :key="index">
          <Col span="22">
            <Row>
              <Col :span="4">
                <FormItem
                  label=""
                  :prop="`addEditShopAddr[${index}].name`"
                  :rules="{ required: true, message: '该项目不能为空', trigger: 'blur' }"
                  :label-width="0"
                >
                  <Input v-model.trim="item.name" placeholder="门店名称"></Input>
                </FormItem>
              </Col>
              <Col :span="5">
                <FormItem
                  label=""
                  :label-width="0"
                  :prop="`addEditShopAddr[${index}].area`"
                  :rules="{ required: true, message: '该项目不能为空', pattern: /\S/, trigger: 'change' }"
                >
                  <Cascader
                    :data="province"
                    :clearable="false"
                    :load-data="cityLoading"
                    v-model.trim="item.area"
                    placeholder="省/市/区"
                    @on-change="
                      (v, arr) => {
                        getProvince(v, arr, index, 'store')
                      }
                    "
                    style="width:100%"
                  ></Cascader>
                </FormItem>
              </Col>
              <Col :span="11">
                <FormItem
                  label=""
                  :prop="`addEditShopAddr[${index}].address`"
                  :rules="{ required: true, message: '该项目不能为空', trigger: 'blur' }"
                  :label-width="0"
                >
                  <Input v-model.trim="item.address" placeholder="详细地址"></Input>
                </FormItem>
              </Col>
              <Col :span="4">
                <FormItem
                  label=""
                  :prop="`addEditShopAddr[${index}].manageStatus`"
                  :rules="{
                    required: true,
                    message: '该项目不能为空',
                    trigger: 'change',
                  }"
                  :label-width="0"
                >
                  <Select v-model.trim="item.manageStatus" placeholder="经营状态">
                    <Option value="open">在业</Option>
                    <Option value="close">停业</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
          </Col>
          <Col :span="2" v-if="fromTable.shopAddModal">
            <Button v-if="index === 0" icon="md-add" @click="addItem('storeModal')"></Button>
            <Button icon="md-remove" @click="removeItem(index, 'storeModal')"></Button>
          </Col>
          <!-- <Col span="1"  v-if="fromTable.shopAddModal">
            <Button v-if="index" icon="md-remove" @click="removeItem(index)"></Button>
            <Button v-else icon="md-add" @click="addItem(index)"></Button>
          </Col>
          <Col span="23">
              <Col span="5" >
                <FormItem label="" :label-width="0" 
                          :prop="'addEditShopAddr.'+ index +'.name'"
                          :rules="{required: true, message: '门店名称不能为空', trigger: 'blur', type: 'string'}">
                  <Input v-model.trim="item.name" placeholder="请输入门店名称" @on-change="changeValue(index, 'name')" ></Input>
                </FormItem>
              </Col>
              <Col span="4">
                <div class="good" v-if="item.nameType === true" >该名称可使用</div>
                <div class="err" v-else-if="item.nameType === false">该名称已存在</div>
              </Col>
              <Col span="6">
                <FormItem label="" :label-width="0" 
                          :prop="'addEditShopAddr.'+ index +'.address'"
                          :rules="{required: true, message: '门店地址不能为空', trigger: 'blur', type: 'string'}">
                  <Input v-model.trim="item.address" placeholder="请输入门店地址" @on-change="changeValue(index, 'address')" ></Input>
                </FormItem>
              </Col>
              <Col span="4">
                <div class="good" v-if="item.addressType === true">该地址可使用</div>
                <div class="err" v-else-if="item.addressType === false">该地址不存在</div>
              </Col>
              <Col span="2">
              </Col>
              <Col :span="8">
                <span style="font-size:12px"></span>
                <div class="upload-list"  v-for="(item2,index2) in item.fileItems" :key="index2">
                  <template >
                      <img :src="item2.url_show" :key="item.contractor_id+index2" style="width:100px;height:100px;object-fit:cover">
                      <div class="upload-list-cover">
                          <Icon type="ios-eye-outline" @click.native="handleView(item2,index,index2,'shopAddr')"></Icon>
                          <Icon type="ios-trash-outline" @click.native="handleRemove(item2,index,index2,'shopAddr')"></Icon>
                      </div>
                  </template>
                </div>
            </Col>
            <Col span="1">
              <Upload ref="shopAddr"
                  :id="`shopAddimg${index}`"
                  name="UploadForm[file]"
                  :loadding='loadImg'
                  :on-progress="coaProgressFile"
                  :default-file-list="fromTable.addEditShopAddr[index].fileItems"
                  :show-upload-list="false" 
                  :on-success="(res,file)=>coaSuccess(res,file,index,'shopAddr')"
                  :on-error="(error,file)=>coaError(error,file,'shopAddr')"
                  :on-format-error="fileFormatError" 
                  :max-size="51200"
                  :on-exceeded-size="fileMaxSize"
                  type="drag"
                  :action="fileUploadURL"
                  :headers="fileUploadHeaders"
                  style="display: inline-block">
                <div class="breadth">
                  <Icon type="md-add" size="20"></Icon>
                </div>
              </Upload>
            </Col> -->
          </Col>
        </Row>
      </div>
      <div v-show="fromTable.shopDelModal" style="display: flex;align-items: center;"><Icon type="ios-information-circle-outline" style="color:#0000ff" size='28'/>是否删除选择的门店信息数据</div>
    </Form>
      <div slot="footer" v-if="!fromTable.addressPushModal || !fromTable.shopPushModal">
          <Button type="text" @click="cancelFromTable">取消</Button>
          <Button type="primary" @click="submitFromTable">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import PROVINCE from '~/plugins/area';
  import Cookies from 'js-cookie'
  import {SERVER_BASE_URL} from '~/api/config';

  const telNumber = (rule, value, callback) => {
    if (value === '') {
      callback(new Error('该项目不能为空!'));
    } else if (!(/^(((\d{3,4}-)?[0-9]{7,8})|(1(3|4|5|6|7|8|9)\d{9}))$/.test(value))) {
      callback(new Error('请输入正确的手机号码/座机号!'));
    } else {
      callback();
    }
  };
  const paymentAt = (rule, value, callback) => {
    if (value === '') {
      callback(new Error('该项目不能为空!'));
    } else if (!(/^([1-9]|[1-2][0-9]|3[0-1])$/.test(value))) {
      callback(new Error('请输入天数范围为1到31!'));
    } else {
      callback();
    }
  };
  const validateAddressArr = (rule, value, callback) => {
    if (value !== undefined && value.length > 0) {
      callback();
    } else {
      callback(new Error('该项目不能为空!'));
    }
  };
  export default {
    data() {
      const validateContractPolicyName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('该选项不能为空'));
        } else {
          callback();
        }
      };
      const validateAddressArr = (rule, value, callback) => {
        if (value !== undefined && value.length > 0) {
          callback();
        } else {
          callback(new Error('该项目不能为空!'));
        }
      };
      return {
        // 编辑门店
        storeModal: {
          modal: false,
          data: [{}],
          type: 'add'
        },
        // 导入文件
        fileUploadURL: `${SERVER_BASE_URL}/v1/product/product-import`,
        addressFileUploadURL: `${SERVER_BASE_URL}/v2/contractor-addr-group/import`,
        shopFileUrl: `${SERVER_BASE_URL}/v2/facade/import`,
        fileUploadHeaders: {
          Authorization: Cookies.get('authorization')
        },
        isLoading: false,
        // 进入页面的加载状态
        isGetData: false,
        shopAddImp:0,
        // 提交表单信息
        isFirst: false,
        isOpenSelect: false,
        showBusinessLicenseImg:false,
        showBusinessLicenseImgUrl:'',
        
        tableData:{
          addressCheckRow:[],
          addressArrayMsg: [], // 收货地址选中的数据
          shopCheckRow:[],
          shopArrayMsg: [], // 门店选中的数据
        },
        // 对收货地址与门店信息的loading大全
        addressOrShopLoading:{
          addressUpLoading:false,
          addressAddLoading:false,
          addressEditLoading:false,
          addressDelLoading:false,
          shopUpLoading:false,
          shopAddLoading:false,
          shopEditLoading:false,
          shopDelLoading:false,
        },
        //收货地址与门店信息表格大全
        fromTable:{
          shopAddrSearch:{
            address:'',
            name:'',
            page:1,
            perPage:5,
            totalCount:0,
            shopLoading:false,
            columns:[
              { type: 'selection', width: 60, align: 'center' },
              // { title: '门店编号', key: 'id', minWidth: 85, align: 'center' },
              { title: '门店名称', key: 'name', minWidth: 150, align: 'center' },
              { title: '省', key: 'province', minWidth: 85, align: 'center' },
              { title: '市', key: 'city', minWidth: 85, align: 'center' },
              { title: '区', key: 'county', minWidth: 85, align: 'center' },
              { title: '门店地址', key: 'address', minWidth: 250, align: 'center' },
              { 
                title: '经营状态',
                key: 'manageStatus',
                minWidth: 100,
                align: 'center',
                render: (h, params) => {
                  let status = params.row.manageStatus
                  if(status === 'open') {
                    return h('span', '在业')
                  } else if(status === 'close') {
                    return h('span', '停业')
                  }
                }
              },
            ]
          },
          shopAddr: [],
          addEditShopAddr: [
            {
              address:'',
              fileItems: [],
              name: "",
            }],
          contractorReceivingAddrSearch:{
            addressArr: '',
            receiving_address: '',
            page:1,
            perPage:5,
            totalCount:0,
            addressLoading:false,
            columns:[
              {
                type: 'selection', 
                width: 65, 
                align: 'center', 
              },
              {
                title: '序号',
                type: 'index',
                align: 'center',
                width: 100
              },
              {
                title: '收货地址地区',
                key: 'province',
                align: 'center',
                render: (h, params) => {
                  return h('div', {
                  }, [params.row.province+params.row.city+params.row.county]);
                }
              },
              {
                title: '收货地址',
                key: 'receiving_address',
                align: 'center',
              },
              {
                title: '联系人',
                key: 'contact',
                align: 'center',
                width: 200
              },
              {
                title: '联系方式',
                key: 'contact_information',
                align: 'center',
                width: 300
              },
            ]
          },
          contractorReceivingAddrGroup:[],
          addEditContractorReceivingAddrGroup: [{
            addressArr:[],
            receiving_address: '',
            contact:'',
            contact_information:'',
            province_id:'',
            province:'',
            city_id:'',
            city:'',
            county_id:'',
            county:'',
          }],

          /***
           * modal:弹窗控制
           * title:标题
           * address^：收货地址各种
           * shop^:门店各种
           */
          modal:false,
          title:'',
          addressPushModal:false,
          addressAddModal:false,
          addressEditModal:false,
          addressDelModal:false,
          shopPushModal:false,
          shopAddModal:false,
          shopEditModal:false,
          shopDelModal:false,
        },
        formData: {
          id:this.queryId||'',//合作商id
          end_ats:'',//合同到期时间
          cooperate_start_ats:'',//合同开始时间
          // addrGroupBatchNumber:'',//收货地址的批次
          // addressAddrIds:[],//收货同批次的id
          // shopBatchNumber:'',//门店的批次
          // shopAddrIds:[],//门店同批次的id
          businessLicense:[],//营业执照
          businessLicenseName:'',
          province: '',
          city: '',
          city_id: '',
          county: '',
          remark: '',
          addrGroupBatchNumber:'',//收货地址批号
          facadeBatchNumber: '',//门店批号
          partner_policy_name:'',//合作商政策
          partner_policy_id:'',//合作商政策id
          auditLog:'',//
        },
        //图片加载
        loadImg:false,
        // 省市区
        province: [],
        addressArr: [],
        addressIndex: 0,
        // 省市区的长度计算
        // 控制门店地址位置
        indexAdd: 0,
        // 控制店铺地址位置
        indexAddress: 0,
        queryContractLoading: false,
        // 表单规则
        formRules: {
          username: [{required: true, message: '该选项不能为空', trigger: 'change'}],
          merchant_name: [{required: true, message: '该选项不能为空', trigger: 'blur'}],
          contact_name: [{required: true, message: '该选项不能为空', trigger: 'blur'}],
          contact_phone: [{required: true, validator: telNumber, trigger: 'blur'}],
          merchant_type: [{required: true, message: '该选项不能为空', trigger: 'blur'}],
          begin_ats: [{required: true, message: '该选项不能为空', trigger: 'change', type: 'date'}],
          end_ats: [{required: true, message: '该选项不能为空', trigger: 'change', type: 'date'}],
          cooperate_start_ats: [{required: true, message: '该选项不能为空', trigger: 'change', type: 'date'}],
          receiving_addr: [{required: true, type: 'string', message: '该选项不能为空', trigger: 'blur'}],
          addressArr: [{required: true, message: '该选项不能为空', validator: validateAddressArr, trigger: 'change'}],
          contract_addr: [{required: true, message: '该选项不能为空', trigger: 'blur'}],
          policy_name: [{
            required: true,
            message: '该选项不能为空',
            validator: validateContractPolicyName,
            trigger: 'change',
            type: 'string'
          }],
          payment_method: [{required: true, message: '该选项不能为空', trigger: 'blur'}],
          payment_days: [{required: true, message: '该选项不能为空', trigger: 'change'}],
          payment_at: [{required: true, validator: paymentAt, trigger: 'blur'}]
        },
        // 提交按钮
        buttonLoading: false,
        // 提交按钮禁止
        isDisabled: false,
        // 商家类型
        businessType: [
          {value: 'cs', label: 'CS'},
          {value: 'ka', label: 'KA'},
          {value: 'otc', label: 'OTC'},
          {value: 'store', label: '便利店'},
          {value: 'other', label: '其他'}
        ],
        // 合作方式
        cooperationType: [
          {value: 'spot_cash', label: '现款现货'},
          {value: 'monthly', label: '月结'},
          {value: 'real_sale', label: '实销实结'}
        ],
        // 账期设置
        paymentType: [
          {value: '60', label: '60'},
          {value: '30', label: '30'}
        ],
        // 用户
        userList: [],
        // 合同政策
        ContractType: [],
        // 政策id
        queryId: '',
        isCountyDisabled: false,
        // 文件上传
        fileUploadURL: `${SERVER_BASE_URL}/v1/upload`,
        fileUploadHeaders: {
          Authorization: Cookies.get('authorization')
        },
        isShowProgress: false,
        isUploadDisabled: false,
        prepare: {
          fileItems: []
        },
        draftModal: false, //草稿弹窗
        draftBtnModal: false,
        draftTurn: false, //保存草稿是否跳转
        draftId: '', //是否继续编辑草稿
        editType: '', //编辑类型  添加或草稿
        queryUserDebonce: this.$debonce(this.queryUser, 500),
        queryContractDebonce: this.$debonce(this.queryContract, 500)
      };
    },
    methods: {

      storeSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this[name].btnLoading = true
          let params = {}
          params.facadeInfo = JSON.parse(JSON.stringify(this[name].data))
          this[name].batchNumber ? params.batchNumber = this[name].batchNumber : ''
          for(let f of params.facadeInfo) {
            delete f.area
            if(this.id) {
              f.contractor_id = this.id
            } else {
              delete f.contractor_id
            }
          }
          if(this[name].type === 'add') {
            this.$api.contractorAddShopInfo(params).then((res)=>{
              if(res.code === 0) {
                this[name].batchNumber = res.data.batchNumber
                this.$Message.success('门店信息添加成功')
                this[name].modal = false
                this[name].data = [{}]
                this.getTableData('storeInfo')
              }
            })
            .finally(()=>{
              this[name].btnLoading = false
            })
          } else if(this[name].type === 'edit') {
            this.$api.contractorEditShopInfo(params).then((res) => {
              if(res.code === 0) {
                this.$Message.success('门店信息修改成功')
                this[name].modal = false
                this.selectStoreList = []
                this[name].data = [{}]
                this.getTableData('storeInfo')
              }
            })
            .finally(()=>{
              this[name].btnLoading = false
            })
          }
        }
      })
    },

      previewUpload(file) {
        window.open(file.url);
      },
      cityLoading(item, call) {
        item.loading = true;
      },

      //预览
      handleView (file,index,index2,type) {
          this.showBusinessLicenseImg = true; 
          this.showBusinessLicenseImgUrl = file.url_show;
      },
      handleRemove (file,index,index2,type) {
        if(type=='businessLicense'){
          if(this.formData.businessLicense.length==0){
            this.formData.businessLicense=[]
          }
          if(this.formData.businessLicense.length>0){
          this.formData.businessLicense.splice(index,1)

          }
        }
        if(type=='shopAddr'){
             this.fromTable.addEditShopAddr[index].fileItems.splice(index2,1)
          if( this.fromTable.addEditShopAddr[index].fileItems.length==0){
             this.fromTable.addEditShopAddr[index].fileItems=[];
          }
          if(this.fromTable.addEditShopAddr[index].fileItems.length<3){
              this.shopAddImp=this.fromTable.addEditShopAddr[index].fileItems.length
              let name='shopAddimg'+index
              document.getElementById(name).style.display='block'
          }

        }
            },

      /***
       * 获取信息
       */
      fetchData() {
        this.isGetData = true;
        this.$api.editContractorDetail({id:this.queryId})
          .then(res => {
            this.isGetData = false;
            if (res.code === 0) {
              this.formData = res.data;
              let json = {
                value: '',
                label: ''
              };
              // 附件
              this.formData.fileItems.map(item => {
                item.name = item.title + '.' + item.extension;
              });
              this.prepare.fileItems = this.formData.fileItems;
              this.formData.addressArr = this.addressArr;
              this.formData.begin_ats = this.formatDate(res.data.begin_at);
              this.formData.end_ats = this.formatDate(res.data.end_at);
              this.formData.cooperate_start_ats = this.formatDate(res.data.cooperate_start_at);
              if (this.formData.payment_method === 'spot_cash') {
                this.formRules.payment_days = [{required: false, message: '该选项不能为空', trigger: 'change'}];
                this.formRules.payment_at = [{required: false, message: '该选项不能为空', trigger: 'blur'}];
              }
              this.ContractType.push({
                partner_policy_name: this.formData.partner_policy_name,
                partner_policy_id: this.formData.partner_policy_id
              })
              //限制营业执照数量、门店图片数量
            if(this.formData.businessLicense.length==3){
              this.formData.businessLicense.length=3
            }
            }
          });
      },
      //收货地址分页
      changeStorePage(e,type){
        let params ={}
        switch(type){
          case 'shop':
            this.fromTable.shopAddrSearch.page = e;
            params ={
              batch_number : this.formData.facadeBatchNumber?this.formData.facadeBatchNumber:this.fromTable.shopAddr[0].batch_number,
              contractor_id:this.queryId?this.queryId:'',
              page: this.fromTable.shopAddrSearch.page ? this.fromTable.shopAddrSearch.page : e,
              perPage:5
            }
            this.getShopInfo(params);
            break;
          case 'address':
            this.fromTable.contractorReceivingAddrSearch.page = e;
            params ={
              batch_number : this.formData.addrGroupBatchNumber?this.formData.addrGroupBatchNumber:this.fromTable.contractorReceivingAddrGroup[0].batch_number,
              contractor_id:this.queryId?this.queryId:'',
              page: this.fromTable.contractorReceivingAddrSearch.page ? this.fromTable.contractorReceivingAddrSearch.page : e,
              perPage:5
            }
            this.getAddress(params);
            break
        }
      },
      changeStorePageSize(e,type){
        let params = {}
        switch(type){
          case 'shop':
            this.fromTable.shopAddrSearch.perPage = e;
            params ={
              batch_number: this.formData.facadeBatchNumber?this.formData.facadeBatchNumber:this.fromTable.shopAddr[0].batch_number,
              contractor_id:this.queryId?this.queryId:'',
              page: 1,
              perPage: this.fromTable.shopAddrSearch.perPage ? this.fromTable.shopAddrSearch.perPage : e,
            }
            this.getShopInfo(params);

            break;
          case 'address':
            this.fromTable.contractorReceivingAddrSearch.perPage = e;
            params ={
              batch_number : this.formData.addrGroupBatchNumber?this.formData.addrGroupBatchNumber:this.fromTable.contractorReceivingAddrGroup[0].batch_number,
              contractor_id:this.queryId?this.queryId:'',
              page: 1,
              perPage:this.fromTable.contractorReceivingAddrSearch.perPage ? this.fromTable.contractorReceivingAddrSearch.perPage : e,
            }
            this.getAddress(params);
            break
        }
      },
      // 收货地址列表
      getAddress(index,type){
        if(!index.page){
            index.page=this.fromTable.contractorReceivingAddrSearch.page 
            index.perPage=this.fromTable.contractorReceivingAddrSearch.perPage 
        }
        this.fromTable.contractorReceivingAddrSearch.addressLoading = true
        this.$api.contractorTabAddress(index).then(res => {
          this.$nextTick(() => {
            if(type){
              this.fromTable.contractorReceivingAddrGroupList = res.items ? res.items : res.data.data
            }else{
              this.fromTable.contractorReceivingAddrGroupList = res.items ? res.items : res.data.data
              this.fromTable.contractorReceivingAddrGroup = res.items ? res.items : res.data.data
            }
              this.fromTable.contractorReceivingAddrSearch.addressLoading = false
            this.fromTable.contractorReceivingAddrSearch.totalCount = res._meta.totalCount
          })
        
        })
      },
      // 门店信息列表
      getShopInfo(index,type){
        if(!index.page){
            index.page=this.fromTable.shopAddrSearch.page 
            index.perPage=this.fromTable.shopAddrSearch.perPage 
        }
        this.fromTable.shopAddrSearch.shopLoading = true
        this.$api.contractorTabShopInfo(index).then(res => {
          this.$nextTick(() => {
            if(type){
              this.fromTable.shopAddrList =res.items ? res.items : res.data.list
            }else{
              this.fromTable.shopAddr =res.items ? res.items : res.data.list
              this.fromTable.shopAddrList =res.items ? res.items : res.data.list
            }
              this.fromTable.shopAddrSearch.shopLoading = this.fileMaxSize
              this.fromTable.shopAddrSearch.totalCount = res._meta ? res._meta.totalCount : res.data.totalCount
          })
        })
        .finally(() => {
          this.fromTable.shopAddrSearch.shopLoading = false
        })
      },
      /**
       * 添加编辑的收货地址与门店信息增删改查
       * type：类型-收货地址&门店信息
       * action：操作类型-增删改查
      */
      tabAction(type,action){
        this.cancelFromTable()
        this.fromTable.title=''
        this.fromTable.modal = false
        this.fromTable.type = type
        this.fromTable.action = action
        switch(type){
          case 'address':
            switch(action){
              case 'push':
                this.addressOrShopLoading.addressUpLoading = true
                this.fromTable.addressPushModal = true
                this.fromTable.title = '导入收货信息'
                this.fromTable.width= '500px'
                this.fromTable.modal = true
                break;
              case 'add':
                this.addressOrShopLoading.addressAddLoading = true
                this.fromTable.addressAddModal = true
                this.fromTable.title = '添加收货地址'
                this.fromTable.width= '1200px'
                this.fromTable.addEditContractorReceivingAddrGroup = [
                  {
                    addressArr:[],
                    receiving_address: '',
                    contact:'',
                    contact_information:'',
                    province_id:'',
                    province:'',
                    city_id:'',
                    city:'',
                    county_id:'',
                    county:'',
                  }]
                this.fromTable.modal = true
                break;
              case 'edit':
                this.addressOrShopLoading.addressEditLoading = true
                this.fromTable.width= '1200px'
                if( this.tableData.addressCheckRow.length ==0) {
                this.addressOrShopLoading.addressEditLoading = false

                  this.$Message.error('请选择数据')
                  return
                }else{
                  this.fromTable.addEditContractorReceivingAddrGroup = JSON.parse(JSON.stringify(this.tableData.addressCheckRow))
                  this.fromTable.addEditContractorReceivingAddrGroup.map((item,index,arr) => {
                      arr[index].addressArr = [
                        item.province_id,
                        item.city_id,
                        item.county_id,
                      ]
                    })
                  this.fromTable.addressEditModal = true
                  this.fromTable.title = '编辑收货地址'
                  this.fromTable.modal = true
                }
                break;
              case 'del':
                if(this.tableData.addressArrayMsg.length===0){
                  this.$Message.error('请选择数据')
                  return
                }else{
                  this.addressOrShopLoading.addressDelLoading = true
                  this.fromTable.addEditContractorReceivingAddrGroup = JSON.parse(JSON.stringify(this.tableData.addressArrayMsg))
                  this.fromTable.addressDelModal = true
                  this.fromTable.title = '删除收货地址'
                  this.fromTable.width= '500px'
                  this.fromTable.modal = true
                }
                break;
            }
            break;
          case 'shopAddress':
            switch(action){
              case 'push':
                this.fromTable.modal = true
                this.addressOrShopLoading.shopUpLoading = true
                this.fromTable.shopPushModal = true
                this.fromTable.title = '导入门店信息'
                this.fromTable.width= '500px'
                break;
              case 'add':
                this.fromTable.modal = true
                this.addressOrShopLoading.shopAddLoading = true
                this.fromTable.width= '1200px'
                this.fromTable.shopAddModal = true
                this.fromTable.title = '添加门店地址'
                this.fromTable.addEditShopAddr=[
                  {
                    address:'',
                    fileItems: [],
                    name: "",
                    area: [],
                    manage_status: '',
                  }]
                break;
              case 'edit':
                this.addressOrShopLoading.shopEditLoading = true
                this.fromTable.width= '1200px'
                if( this.tableData.shopCheckRow.length ==0) {
                this.addressOrShopLoading.shopEditLoading = false

                  this.$Message.error('请选择数据')
                  return
                } else{
                  this.fromTable.modal = true
                  this.tableData.shopCheckRow.forEach((item) => {
                    // item.area = [item.province_id, item.city_id, item.county_id]
                    item.area = [item.provinceId, item.cityId, item.countyId]
                  })
                  this.fromTable.addEditShopAddr = JSON.parse(JSON.stringify(this.tableData.shopCheckRow))
                  this.fromTable.title = '编辑门店地址'
                  this.fromTable.shopEditModal = true
                }
                break;
              case 'del':
                if( this.tableData.shopCheckRow.length ==0) {
                  this.$Message.error('请选择数据')
                  return
                } else{
                  this.fromTable.modal = true
                  this.addressOrShopLoading.shopDelLoading = true
                  this.fromTable.shopDelModal = true
                  this.fromTable.title = '删除门店地址'
                  this.fromTable.width= '500px'
                }
                break;
            }
            break;
        }
        

      },
      //弹窗确认
      submitFromTable(){
        // this.fromTable.modal = true
        // 正常路线
        if(this.fromTable.addressAddModal || this.fromTable.addressEditModal || this.fromTable.shopAddModal || this.fromTable.shopEditModal){
          
          //校验路线
          this.$refs.fromTable.validate((option) => {
            if(option){
              switch(this.fromTable.type){
                case 'address':
                  switch(this.fromTable.action){
                    case 'push':
                      break;
                    case 'add':
                      this.fromTable.addEditContractorReceivingAddrGroup.map((item,index,arr) => {
                          delete arr[index]['addressArr']
                      })
                      let params = {
                        batchNumber : this.formData.addrGroupBatchNumber ? this.formData.addrGroupBatchNumber : '',
                        contractor_id : this.queryId ? this.queryId : '',
                        addrGroup : this.fromTable.addEditContractorReceivingAddrGroup
                      }
                      Object.getOwnPropertyNames(params).forEach(function(key){
                        if(params[key] === '' || params[key] === 0 || !params[key]){
                          delete params[key]
                        }
                      })
                      this.$api.contractorAddAddress(params).then(res => {
                        if(res.status){
                          this.fromTable.modal = false
                          this.addressOrShopLoading.addressAddLoading = false
                          this.formData.addrGroupBatchNumber ? '' : this.formData.addrGroupBatchNumber = res.data.batchNumber
                          let query ={
                            batch_number : this.formData.addrGroupBatchNumber,
                            contractor_id:this.queryId?this.queryId:''
                          }
                          this.getAddress(query)
                          this.cancelFromTable()
                          
                        }
                      })
                      break;
                    case 'edit':
                      this.fromTable.addEditContractorReceivingAddrGroup.map((item,index,arr) => {
                          delete arr[index]['addressArr']
                      })
                      let params2 = {
                        contractor_id : this.queryId ? this.queryId : '',
                        addrGroup:this.fromTable.addEditContractorReceivingAddrGroup
                      }
                      Object.getOwnPropertyNames(params2).forEach(function(key){
                        if(params2[key] === '' || params2[key] === 0 || !params2[key]){
                          delete params2[key]
                        }
                      })
                      this.$api.contractorEditAddress(params2).then(res => {
                        if(res.status){
                          this.fromTable.modal = false
                          this.addressOrShopLoading.addressEditLoading = false
                          this.formData.addrGroupBatchNumber ?'': this.formData.addrGroupBatchNumber = res.data.batchNumber
                          let query ={
                            batch_number :this.formData.addrGroupBatchNumber,
                            contractor_id:this.queryId?this.queryId:''
                          }
                          Object.getOwnPropertyNames(query).forEach(function(key){
                            if(query[key] === '' || query[key] === 0 || !query[key]){
                              delete query[key]
                            }
                          })
                          this.getAddress(query)
                          this.cancelFromTable()
                          
                        }
                      })

                      break;
                  }
                  break;
                case 'shopAddress':
                  switch(this.fromTable.action){
                    case 'push':
                      break;
                    case 'add':
                      let params6 = {
                        batchNumber:this.formData.shopBatchNumber?this.formData.shopBatchNumber:'',
                        contractor_id : this.queryId ? this.queryId : '',
                        facadeInfo:this.fromTable.addEditShopAddr
                      }
                      params6.facadeInfo.forEach((item) => item.manage_status = item.manageStatus)
                      this.$api.contractorAddShopInfo(params6).then(res => {
                        if(res.status){
                          this.fromTable.modal = false
                          this.addressOrShopLoading.shopAddLoading = false
                          this.formData.shopBatchNumber? '' :this.formData.shopBatchNumber = res.data.batchNumber
                          this.formData.shopAddrIds = res.data.addrIds
                          let query ={
                            batch_number :this.formData.shopBatchNumber,
                            contractor_id:this.queryId?this.queryId:''
                          }
                          Object.getOwnPropertyNames(query).forEach(function(key) {
                            if(query[key] === '' || query[key] === 0 || !query[key]) {
                              delete query[key]
                            }
                          })
                          this.getShopInfo(query)
                          this.cancelFromTable()
                        }
                      })
                      break;
                    case 'edit':
                     this.fromTable.addEditShopAddr.forEach((item,index,arr) => {
                          delete arr[index]['contractor_id']
                          arr[index].contractor_id = this.queryId?this.queryId : ''
                          arr[index].batch_number = arr[index].batchNumber // 暂时处理接口接收不到batch_number报错
                      })

                      let params7 = {
                        facadeInfo:this.fromTable.addEditShopAddr
                      }
                      params7.facadeInfo.forEach((item) => {
                        item.manage_status = item.manageStatus
                        item.province_id = item.provinceId
                        item.city_id = item.cityId
                        item.county_id = item.countyId
                      })
                      this.$api.contractorEditShopInfo(params7).then(res => {
                        if(res.status){
                          this.fromTable.modal = false
                          this.addressOrShopLoading.shopEditLoading = false
                          this.formData.shopBatchNumber?'':this.formData.shopBatchNumber = res.data.batchNumber
                          this.formData.shopAddrIds = res.data.addrIds
                        }
                          let query ={
                            batch_number : res.data.batchNumber ? res.data.batchNumber : this.formData.shopBatchNumber,
                            contractor_id : this.queryId ? this.queryId:''
                          }
                          Object.getOwnPropertyNames(query).forEach(function(key) {
                            if(query[key] === '' || query[key] === 0 || !query[key]) {
                              delete query[key]
                            }
                          })
                           this.getShopInfo(query)
                          this.cancelFromTable()
                      })

                      break;
                  }
                  break;
              }

            }else{
              this.$Message.error('请填写完整信息');
              this.fromTable.modal = true
              return 
            }
          })
          return
        }else{
          switch(this.fromTable.type){
            case 'address':
              switch(this.fromTable.action){
                case 'del':
                  let params3 ={
                    ids:this.fromTable.addEditContractorReceivingAddrGroup
                  } 
                  this.$api.contractorDelAddress(params3).then(res => {
                    this.fromTable.modal = false
                    this.addressOrShopLoading.addressDelLoading = false
                    let query ={
                      batch_number :this.tableData.addressCheckRow[0].batch_number||'',
                      contractor_id:this.queryId?this.queryId:''
                    }
                    this.getAddress(query)
                    this.cancelFromTable()
                  })
                  break;
              }
              break;
            case 'shopAddress':
              switch(this.fromTable.action){
                case 'del':
                  let params4 ={
                    ids:this.tableData.shopArrayMsg
                  } 
                  this.$api.contractorDelShopInfo(params4).then(res => {
                    this.addressOrShopLoading.shopDelLoading = false
                    let query ={
                      batch_number :this.tableData.shopCheckRow[0].batch_number||'',
                      contractor_id:this.queryId?this.queryId:''
                    }
                    this.getShopInfo(query)
                    this.cancelFromTable()
                  })
                  break;
              }
              break;
          }
          this.fromTable.modal = false
        }
        
      },
      // 弹窗取消
      cancelFromTable(){
        this.fromTable.modal = false
        this.fromTable.addEditShopAddr = []
        this.fromTable.addEditContractorReceivingAddrGroup = []
        this.fromTable.addressPushModal=false
        this.fromTable.addressAddModal=false
        this.fromTable.addressEditModal=false 
        this.fromTable.addressDelModal=false
        this.fromTable.shopPushModal=false
        this.fromTable.shopAddModal=false
        this.fromTable.shopEditModal=false
        this.fromTable.shopDelModal=false
        this.addressOrShopLoading={
          addressUpLoading:false,
          addressAddLoading:false,
          addressEditLoading:false,
          addressDelLoading:false,
          shopUpLoading:false,
          shopAddLoading:false,
          shopEditLoading:false,
          shopDelLoading:false,
        }
      },
      /**
       * 提交表单
       * @param {String} name：表单名称
       */
      submitForm(name) {
        //判断收货地址与门店信息是否为空
        if(this.fromTable.contractorReceivingAddrGroup.length===0){
          this.$Message.error('收货地址不能为空')
          return
        }
        if(this.fromTable.shopAddr.length===0){
          this.$Message.error('门店信息不能为空')
          return
        }
        this.$refs[name].validate((valid) => {
          if (!valid) {
            this.$Message.warning('必选项不能为空!');
          } else {
            this.formData.fileItems = this.prepare.fileItems;
            let params = {};
            params = JSON.parse(JSON.stringify(this.formData));
            if (params.payment_method === 'spot_cash') {
              params.payment_days = '';
              params.payment_at = '';
            }
            delete params.begin_ats;
            delete params.end_ats;
            delete params.cooperate_start_ats;
            !isNaN(params.begin_at) ? params.begin_at = this.formatDate(params.begin_at) : params.begin_at;
            !isNaN(params.end_at) ? params.end_at = this.formatDate(params.end_at) : params.end_at;
            !isNaN(params.cooperate_start_at) ? params.cooperate_start_at = this.formatDate(params.cooperate_start_at) : params.cooperate_start_at;
            params.addrGroupBatchNumber ? params.addrGroupBatchNumber : 
              (this.formData.addrGroupBatchNumber ? params.addrGroupBatchNumber = this.formData.addrGroupBatchNumber:
              (this.fromTable.contractorReceivingAddrGroupList[0]? params.addrGroupBatchNumber =this.fromTable.contractorReceivingAddrGroupList[0].batch_number:''))

            params.facadeBatchNumber ? params.facadeBatchNumber : 
              (this.formData.shopBatchNumber ? params.facadeBatchNumber = this.formData.shopBatchNumber:
              (this.fromTable.shopAddr[0]? params.facadeBatchNumber =this.fromTable.shopAddr[0].batch_number:''))
            // params.addressArr = this.fromTable.contractorReceivingAddrGroupList
            // params.businessLicense = this.fromTable.shopAddrList
            this.buttonLoading = true;
            this.draftTurn = true
            if (this.editType == 'draft') { //草稿提交
              if (!params.id) {
                params.id = this.draftId
              }
              this.$api.contractorDraftSubmit(params).then((res) => {
                if (res.code === 0) {
                  this.$Message.success(res.message);
                  this.$store.commit('removeTag', this.$route.name);
                  this.$router.push({path: '/contract/partner-management'});
                } else {
                  this.$Message.error(res.message);
                }
              }).finally(() => {
                this.buttonLoading = false;
              }).catch(err => {
                this.buttonLoading = false;
                this.draftTurn = false
              })
              return
            }
            // 编辑
            if (this.queryId) {
              this.$api.contractorUpdate(params)
                .then(res => {
                  this.buttonLoading = false;
                  if (res.code === 0) {
                    this.$router.push('/contract/partner-management');
                  }
                }).finally(() => {
                this.buttonLoading = false;
              });
            } else {
              // 新增
              this.$api.contractorCreate(params)
                .then(res => {
                  this.buttonLoading = false;
                  if (res.code === 0) {
                    this.$router.push('/contract/partner-management');
                  }
                }).finally(() => {
                this.buttonLoading = false;
              });
            }
          }
        });
        
      },
      //收货地址+门店信息搜索
      searchFromTable(type){
            let query = {
              receiving_address:this.fromTable.contractorReceivingAddrSearch.receiving_address,
              batch_number:'',
              contractor_id:this.queryId?this.queryId:'',
              page:1,
            }
          switch(type){
            case 'address':
              query.receiving_address = this.fromTable.contractorReceivingAddrSearch.receiving_address
              query.batch_number = this.formData.addrGroupBatchNumber?this.formData.addrGroupBatchNumber:this.fromTable.contractorReceivingAddrGroup[0].batch_number
              query.perPage =this.fromTable.contractorReceivingAddrSearch.perPage
              Object.getOwnPropertyNames(query).forEach(function(key){
                if(query[key] === '' || query[key] === 0 || !query[key]){
                  delete query[key]
                }
              })
              this.getAddress(query,'search')
              break;
            case 'shopAddress':
              query.batch_number = this.formData.shopBatchNumber?this.formData.shopBatchNumber:this.fromTable.shopAddr[0].batch_number
              query.name=this.fromTable.shopAddrSearch.name
              query.address=this.fromTable.shopAddrSearch.address
              query.perPage =this.fromTable.shopAddrSearch.perPage
              Object.getOwnPropertyNames(query).forEach(function(key){
                if(query[key] === '' || query[key] === 0 || !query[key]){
                  delete query[key]
                }
              })
              this.getShopInfo(query,'search')
              
              break;
          }

      },


      /**
       * 搜索用户列表
       * @param {String} value：用户名、工号
       */
      queryUser(value) {
        this.isLoading = true;
        this.$api.salesmanData({username: value})
          .then(res => {
            this.isLoading = false;
            if (res.code === 0) {
              if (!!res.data.length) {
                this.userList = res.data;
              }
            }
          });
      },

      /**
       * 选中用户
       * @param {Array} obj：用户数据
       */
      selectUser(obj) {
        let labelName = obj.label.split('/')[0]
        let list = this.userList.filter(n => {
          return labelName.trim() === n.real_name && obj.value === n.username;
        });
        this.formData.salesman_id = list[0].id;
      },
      // 初始化省级
      MountProvince() {
        this.isLoading = true;
        this.$api.urbanCascade()
          .then(res => {
            if (res.code === 0) {
              this.isLoading = false;
              this.province = res.data;
            }
          });
      },
      // 获取省市区
      getProvince(value, arr, index, type) {
        let contractorAddrGroup = this.fromTable.addEditContractorReceivingAddrGroup;
        if(type === 'address'){
            for (let i in arr) {
            if (i == 0) {
              this.fromTable.addEditContractorReceivingAddrGroup[index].province_id = arr[i].value;
              this.fromTable.addEditContractorReceivingAddrGroup[index].province = arr[i].label;
            }
            if (i == 1) {
              this.fromTable.addEditContractorReceivingAddrGroup[index].city_id = arr[i].value;
              this.fromTable.addEditContractorReceivingAddrGroup[index].city = arr[i].label;
            }

            if (i == 2) {
              this.fromTable.addEditContractorReceivingAddrGroup[index].county_id = arr[i].value;
              this.fromTable.addEditContractorReceivingAddrGroup[index].county = arr[i].label;
            }
          }
        } else if(type === 'store') {
            for (let i in arr) {
            if (i == 0) {
              this.fromTable.addEditShopAddr[index].province_id = arr[i].value;
              this.fromTable.addEditShopAddr[index].province = arr[i].label;
            }
            if (i == 1) {
              this.fromTable.addEditShopAddr[index].city_id = arr[i].value;
              this.fromTable.addEditShopAddr[index].city = arr[i].label;
            }

            if (i == 2) {
              this.fromTable.addEditShopAddr[index].county_id = arr[i].value;
              this.fromTable.addEditShopAddr[index].county = arr[i].label;
            }
          }
        }
        
      },

      // 添加地址
      addItem(index, remark) {
        if (remark === 'fms') {
          this.fromTable.addEditContractorReceivingAddrGroup.push({
            addressArr:[],
            receiving_address: '',
            contact:'',
            contact_information:'',
            province_id:'',
            province:'',
            city_id:'',
            city:'',
            county_id:'',
            county:'',
          });
        } else {
          this.indexAdd++;
          this.fromTable.addEditShopAddr.push({index: this.indexAdd, name: '', address: '',fileItems:[]});
        }
      },

      // 删除地址
      removeItem(index, remark) {
        if (remark === 'fms') {
          this.fromTable.addEditContractorReceivingAddrGroup.splice(index, 1);
        } else {
          this.fromTable.addEditShopAddr.splice(index, 1);
        }
      },
      /**
       * 添加店铺地址
       * @param {Number} indexItem：门店地址位置
       * @param {Number} index：店铺地址位置
       * @return:
       */
      addressItem(indexItem, index) {
        this.indexAddress++;
        this.formData.shopAddr[indexItem].address.push({index: this.indexAddress, addr: ''});
      },

      /**
       * 删除店铺地址
       * @param {Number} indexItem：门店地址位置
       * @param {Number} index：店铺地址位置
       * @return:
       */
      removeAddressItem(indexItem, index) {
        this.formData.shopAddr[indexItem].address.splice(index, 1);
      },

      /***
       * 合同签约日期 y-m-d
       * @param {date} value：日期
       *
       */
      changeBeginAt(value) {
        this.formData.begin_at = value;
      },

      /***
       * 合同到期日期 y-m-d
       * @param {date} value：日期
       */
      changeEndAt(value) {
        this.formData.end_at = value;
      },

      /***
       * 开始合作日期 y-m-d
       * @param {date} value：日期
       */
      changeStartAt(value) {
        this.formData.cooperate_start_at = value;
      },

      /**
       * 搜索合作商政策
       * @param {Object} value：合同政策名
       * @return:
       */
      queryContract(value) {
        if (this.isFirst) {
          this.queryContractLoading = true;
          let params = {};
          params.name = value;
          this.$api.getPartnerPolicyArray(params)
            .then(res => {
              this.queryContractLoading = false;
              if (res.code === 0) {
                this.ContractType = res.data;
              }
            });
        }
      },

      /***
       * 选择合作商政策
       * @param {Object} obj：选择合作商政策
       */
      selectContract(obj) {
        let list = this.ContractType.filter((item) => {
          return item.partner_policy_name === obj.label;
        });
        this.formData.partner_policy_id = list[0].partner_policy_id;
        this.formData.partner_policy_name = list[0].partner_policy_name;
      },
      // 获取商家的名称和id
      getContract(json) {
        this.formData.partner_policy_name = json.label;
        this.formData.partner_policy_id = json.value;
      },

      /**
       * 时间转化
       * @param {time} time: 时间戳
       */
      formatDate(time) {
        return this.$format(time, 'yyyy-MM-dd');
      },

      /***
       * 改变合作方式
       * @param {String} value: 合作类型
       *
       */
      selectMethod(value) {
        if (value === 'spot_cash') {
          this.formRules.payment_days = [{required: false, message: '该选项不能为空', trigger: 'change'}];
          this.formRules.payment_at = [{required: false, message: '该选项不能为空', trigger: 'blur'}];
        }
      },

      // 文件上传限制
      fileMaxSize(file) {
        this.$Notice.warning({
          title: '超出文件大小限制',
          desc: '文件 ' + file.name + ' 太大，不能超过 50M。'
        });
      },
      // 文件格式验证失败
      fileFormatError(file) {
        this.$Notice.error({
          title: '文件格式错误',
          desc: '请上传正确的文件格式!'
        });
      },
      // 附件上传进度条
      coaProgressFile(event, file) {
        this.loadImg=true
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
      coaSuccess(res, file,index,type) {
        // 上传成功
        this.loadImg=false
        this.isShowProgress = false;
        if (res.status) {
          let data = res.data;
          if(type =='businessLicense'){
            this.formData.businessLicense.push(data) 
            if(this.formData.businessLicense.length == 3){
              this.formData.businessLicense.length = 3
            }
          }
          if(type == 'fileItems'){
            this.prepare.fileItems.push(data);
          }
          if(type == 'shopAddr'){
            this.shopAddImp++,
            this.fromTable.addEditShopAddr[index].fileItems.push(data)
            if(this.fromTable.addEditShopAddr[index].fileItems.length == 3){
              this.fromTable.addEditShopAddr[index].fileItems.length = 3
              this.shopAddImp=0
              let name = 'shopAddimg'+index
              document.getElementById(name).style.display = 'none'
            }
          }
        }
      },
      //上传失败
      coaError(error,file,type){
      },
      // 移除附件文件
      filePrepareRemove(file) {
        const fileList = this.prepare.fileItems;
        let obj = this.prepare.fileItems.splice(fileList.indexOf(file), 1);
      },
      // 是否存为草稿
      openDraft() {
        if (!!this.formData.merchant_name) {
          this.draftModal = true
        } else {
          this.$Message.error('请填写商家名称')
        }
      },
      // 存为草稿
      saveDraft(remark) {
        this.formData.fileItems = this.prepare.fileItems;
        let params = {};
        params = JSON.parse(JSON.stringify(this.formData));
        if (params.payment_method === 'spot_cash') {
          params.payment_days = '';
          params.payment_at = '';
        }
        delete params.begin_ats;
        delete params.end_ats;
        delete params.cooperate_start_ats;
        !isNaN(params.begin_at) ? params.begin_at = this.formatDate(params.begin_at) : params.begin_at;
        !isNaN(params.end_at) ? params.end_at = this.formatDate(params.end_at) : params.end_at;
        !isNaN(params.cooperate_start_at) ? params.cooperate_start_at = this.formatDate(params.cooperate_start_at) : params.cooperate_start_at;
        if (!!this.draftId) { //选择继续编辑
          this.editType = 'draft'
          params.id = this.draftId
        }
        this.draftBtnModal = true
        if (this.editType == 'draft') { //修改
          this.$api.contractorDraftUpdate(params).then((res) => {
            if (res.code === 0) {
              if (!!remark) { // 是否为被动保存
                this.$Message.success('保存成功')
              }
              if (remark == 'exit') {
                this.$store.commit('removeTag', this.$route.name);
                this.$router.push({path: '/contract/partner-draft'})
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
          this.$api.contractorDraftAdd(params).then((res) => { // 添加
            if (res.code === 0) {
              if (!!remark) {
                this.$Message.success('保存成功')
              }
              if (remark == 'exit') {
                this.$router.push({path: '/contract/partner-draft'})
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
      // 输入值改变时触发
      changeValue(indexs, type){

        // let list = this.formData.shopAddr;
        // list.forEach((item, index) => {
        //   if(indexs == index) {
        //     if(type == 'name'){
        //       item.nameType = ''
        //     } else {
        //       item.addressType = ''
        //     }
        //     this.formData = {
        //       ...this.formData,
        //       shopAddr: list
        //     }
        //     return
        //   }
        // })
      },
      //下载导入模版
      downloadImport() {
        switch(this.fromTable.title){
          case '导入收货信息':
            this.$api.contractorTemplateAddress()
              .then(res => {
                if (res.code == 0) {
                  window.location.href = res.data.data;
                }
              });
            break;
          case '导入门店信息':
            this.$api.contractorTemplateShop()
              .then(res => {
                if (res.code == 0) {
                  window.location.href = res.data.data;
                }
              });
            break;
        }

      },
      // 上传成功
      handleUploadSuccess(res) {
        if (res.code == 0) {
          let query ={
            batch_number :res.data.batchNumber,
            contractor_id:this.queryId?this.queryId:''
            }
          if(this.fromTable.type =='address'){
            this.addressOrShopLoading.addressUpLoading = false
            this.formData.addrGroupBatchNumber ? '':this.formData.addrGroupBatchNumber = res.data.batchNumber
            this.getAddress(query)
            this.cancelFromTable()
          }else{
            this.addressOrShopLoading.shopUpLoading = false
            this.formData.shopBatchNumber ? '':this.formData.shopBatchNumber = res.data.batchNumber
            this.getShopInfo(query)
            this.cancelFromTable()
          }
            this.$Message.success(res.message);
        } else {
          this.addressOrShopLoading.addressUpLoading = false
          this.addressOrShopLoading.shopUpLoading = false
          this.$Message.error(res.message);
          return false;
        }
      },
      // 上传失败
      handleUploadError() {
        this.$Message.error('上传失败');
        return false;
      },
      // 模板上传成功的进度条
      importProgress(event, file) {
        if (!event) return;
        this.isShowProgress = true;
        // 延迟一下，接收有bug
        setTimeout(() => {
          if (file.status === 'fail') {
            this.$Notice.error({
              title: '文件异常!'
            });
          }
        }, 1000);
        if (file.percentage === 100) {
          this.isShowProgress = false;
        }
        this.percentProgress = event.percent;
      },

      // 上传的文件格式
      fileFormatError(file) {
        this.$Notice.error({
          title: '文件格式错误',
          desc: JSON.stringify(file)
        });
      },
      // 文件上传限制
      fileMaxSize(file) {
        this.$Notice.warning({
          title: '超出文件大小限制',
          desc: '文件 ' + file.name + ' 太大，不能超过 50M。'
        });
      },
      //全选
      selectAll(selection,type){
      switch(type){
        case 'address':
          this.tableData.addressCheckRow = selection
          this.tableData.addressArrayMsg = selection.map(v=> {
            return v.id
          })
          break;
        case 'shop':
          this.tableData.shopCheckRow = selection
          this.tableData.shopArrayMsg = selection.map(v=> {
            return v.id
          })
          break;
      }
        // this.tableData.rowSelect = selection.length
      },
      // 选中一个
      selectOne(selection,type){
        switch(type){
          case 'address':
            if(selection.length == 0){
              this.tableData.addressArrayMsg  =[]
            }else{
              this.tableData.addressCheckRow = selection
              this.tableData.addressArrayMsg = selection.map(v=> {
                return v.id
              })
            }
            break;
          case 'shop':
            if(selection.length == 0){
              this.tableData.shopArrayMsg  =[]
            }else{
              this.tableData.shopCheckRow = selection
              this.tableData.shopArrayMsg = selection.map(v=> {
                return v.id
              })
            }
            break;
        }
        // this.tableData.rowSelect = selection.length
      },
      // 、、取消全选
      cancelAll(selection,type){
        switch(type){
          case 'address':
            this.tableData.addressArrayMsg = []
            this.tableData.addressCheckRow = []
            break;
          case 'shop':
            this.tableData.shopArrayMsg = []
            this.tableData.shopCheckRow = []
            break;
        }
        // if(this.tableData.addressArrayMsg.length === 0){
        //   this.tableData.operation = false
        // }
        // this.tableData.rowSelect = 0
      },
    },
    mounted() {
      // this.MountProvince();
      let id = this.$route.query.id;
      let type = this.$route.query.type;
      if (!!type) {
        this.editType = 'draft'//草稿箱
      }
      if (id) {
        this.queryId = id;
        this.fetchData(id);
        let query = {
          contractor_id : this.queryId,
          page:1,
          perPage:5,
        }
        this.getAddress(query)
        this.getShopInfo(query)
      }
      this.province = PROVINCE;
    },
    beforeDestroy() {
      if (!this.draftTurn) { // 跳转、提交、没有写商家名称不用被动保存
        if (!!this.formData.merchant_name) {
          this.saveDraft()// 被动保存
        }
      }
    }

  };
</script>
<style>
  .ivu-upload-drag {
    width: 40px !important;
    height: 40px;
    display: inline-block;
  }

  .upload-col {
    margin-top: 7px;
  }

  .breadth {
    width: 40px;
    height: 40px;
    line-height: 40px;
  }

</style>
<style lang='less' scoped>
  .hr {
    color: #dcdee2;
    background-color: #dcdee2;
    margin-bottom: 20px ;
    height: 1px;
    border-top: none;
  }
  .shopaddress, .contractorReceivingAddrGroup{
    margin-bottom: 25px;
  }
   .fromTableModal{
    background-color: #f2f2f2;
    position: relative;
   }
  .fromTableModal /deep/.ivu-modal-content{
    background-color: #f2f2f2;
  }  
   .fromTableModal /deep/.ivu-modal-header{
    height: 70px;
   }
  .fromTableModal /deep/.ivu-modal-header,.fromTableModal /deep/.ivu-modal-footer{
    border: none;  
  } 
  // .fromTableModal /deep/.ivu-modal{
  //   width: 75rem !important;
  // } 
  
  .fromTableModal /deep/.ivu-btn-text{
   background-color:#fff
  } 
  /deep/.ivu-modal-width{
    width: 520px;
  }
  .fromTableModal /deep/.ivu-modal-body{
    background-color: #fff;
    margin: 0 16px;
    border-radius: 6px;
  }
  .modalTest{
    position: absolute;
    font-size: 16px;
    top: 40px;
    right: 16px;
  }
  .ivu-upload-list {
    display: inline-block;
  }

  .ivu-upload-list-file {
    float: left;
  }

  .border-row {
    margin-bottom: 20px;
    border: 1px solid rgb(233, 233, 233);
  }

  .border-row .title {
    height: 40px;
    line-height: 40px;
    padding-left: 10px;
    font-size: 16px;
    color: #000;
    background-color: rgb(250, 250, 250);
    border-bottom: 1px solid rgb(233, 233, 233);
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

  .good {
    color: #16982B;
  }

  .err {
    color: 	#FF2400;
  }

  .good,
  .err {
    font-size: .8rem;
    margin-top: 7%;
  }
  /*  */
  .upload-list{
    position: relative;
    display: inline-block;
    margin: 0 5px;
  }
  .upload-list-cover{
    position: absolute;
    display: none;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
    overflow: hidden;
  }
  .upload-list:hover .upload-list-cover{
        display: block;
    }
 .upload-list-cover i{
        width: 50%;
        float: left;
        color: #fff;
        font-size: 30px;
        line-height: 100px;
        cursor: pointer;
        margin: 0 auto;
    }
/deep/ .ivu-form-item-label{
  text-align: right;
}

.startRules:before{
  content: '*';
  display: inline-block;
  margin-right: 4px;
  line-height: 1;
  font-size: 14px;
  color: #ed4014;

}
</style>
