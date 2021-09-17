<template>
  <div>
    <Card>
      <Row slot="title" type="flex" justify="end">
        <Button type="default" @click="goBack" style="margin-right: 15px">返回</Button>
        <Button type="primary" :loading="submitLoading" @click="submit('formData', 'systemInfo', 'contractsInfo')">{{origin === 'customer' ? '确认合作' : '提交'}}</Button>
      </Row>
      <div style="position: relative;">
        <!-- 基本信息 start -->
        <Row>
          <Card>
            <div slot="title"><p>基本信息</p></div>
            <div>
              <Form ref="formData" :model="formData" :rules="baseInfoFormRules" label-position="right" :label-width="120">
                <Row type="flex" justify="start">
                  <Col :md="8">
                    <FormItem label="公司名称：" prop="companyInfoId">
                      <Select
                        v-model="formData.companyInfoId"
                        filterable
                        remote
                        :loading="queryLoading"
                        :remote-method="(value) => {queryCompanyDebonce(value, 'company')}"
                        clearable
                        @on-change="(value) => {selectOption(value, 'company')}"
                        @on-query-change="(val) => !!val && (companyNameBak = val)"
                        :placeholder="companyNameBak && companyNameBak.trim() ? companyNameBak : '请输入公司名称'"
                      >
                        <Option
                          v-for="(item, index) in queryCompanyList"
                          :key="index"
                          :value="item.id"
                          :label="item.name"
                        ></Option>
                      </Select>
                      <div class="business-icon" @click="queryRemote(companyNameBak, 'company', true)">
                        <img v-if="!hasCompanyName" src="~/assets/images/company_fail.png" alt="" />
                        <img v-else src="~/assets/images/company_success.png" alt="" />
                      </div>
                    </FormItem>
                    <div v-if="hasContractor" class="tipis">该客户已存在</div>
                  </Col>
                  <Col :md="8">
                    <FormItem label="省份：">
                      <Input :value="formData.companyInfo.base" disabled></Input>
                    </FormItem>
                  </Col>
                  <Col :md="8">
                    <FormItem label="法人：">
                      <Input :value="formData.companyInfo.legalPersonName" disabled></Input>
                    </FormItem>
                  </Col>
                </Row>
                <Row type="flex" justify="start">
                  <Col :md="8">
                    <FormItem label="公司类型：">
                      <Input :value="changeCompanyType(formData.companyInfo.companyType)" disabled></Input>
                    </FormItem>
                  </Col>
                  <Col :md="8">
                    <FormItem label="成立日期：" prop="">
                      <Input :value="formData.companyInfo.establishTime" disabled></Input>
                    </FormItem>
                  </Col>
                  <Col :md="8">
                    <FormItem label="注册资本：">
                      <Input :value="formData.companyInfo.regCapital" disabled></Input>
                    </FormItem>
                  </Col>
                </Row>
                <Row type="flex" justify="start">
                  <Col :md="8">
                    <FormItem label="经营状态：">
                      <Input :value="formData.companyInfo.regStatus" disabled></Input>
                    </FormItem>
                  </Col>
                  <Col :md="8">
                    <FormItem label="统一社会信用代码：">
                      <Input :value="formData.companyInfo.creditCode" disabled></Input>
                    </FormItem>
                  </Col>
                  <Col :md="8">
                    <FormItem label="组织机构代码：">
                      <Input :value="formData.companyInfo.orgNumber" disabled></Input>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col :md="8">
                    <FormItem label="客户类型：" prop="merchantType">
                      <Select v-model="formData.merchantType" placeholder="请选择">
                        <Option v-for="item in merchantTypeList" :value="item.value" :key="item.value" :label="item.label"></Option>
                      </Select>
                    </FormItem>
                  </Col>
                  <Col :md="8">
                    <FormItem label="合作品牌：" prop="coBrand">
                      <Select v-model="formData.coBrand"  placeholder="请选择合作品牌" multiple>
                        <Option v-for="item in brandList" :value="item.value" :key="item.value" :label="item.label"></Option>
                      </Select>
                    </FormItem>
                  </Col>
                  <Col :md="8">
                    <FormItem label="上级客户：">
                      <Select
                        v-model="formData.parentContractorId"
                        filterable
                        label-in-value
                        remote
                        clearable
                        :loading="queryLoading"
                        :remote-method="
                          (value) => {
                            queryParentDebonce(value, 'parent')
                          }
                        "
                        @on-change="
                          (value) => {
                            selectOption(value, 'parent')
                          }
                        "
                        :placeholder="formData.parentContractorName ? formData.parentContractorName :'请输入上级客户'"
                      >
                        <Option
                          v-for="(item, index) in queryParentList"
                          :key="index"
                          :value="item.id"
                          :label="item.merchantName"
                        ></Option>
                      </Select>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col :md="8">
                    <FormItem label="开拓人：">
                      <Select
                        remote
                        clearable
                        filterable
                        label-in-value
                        :loading="queryLoading"
                        v-model="formData.salesmanId"
                        :disabled="origin === 'customer'"
                        :placeholder="origin === 'customer' ? '' : '请选择'"
                        :remote-method="(val) => queryEmployeeDebonce(val, 'employee')"
                        @on-change="(val) => selectOption(val, 'employee')">
                        <Option v-for="(item, index) in queryEmployeeList" :value="item.id" :label="item.full_name" :key="'emp' + index"></Option>
                      </Select>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <FormItem label="营业执照：" prop="uploadForm">
                    <div class="upload-list" v-for="item in formData.businessLicense">
                      <template v-if="item.url != ''">
                        <img :src="item.urlShow ? item.urlShow : item.url_show" />
                        <div class="upload-list-cover">
                          <Icon type="ios-eye-outline" @click.native="showBigImg(item.url)"></Icon>
                          <Icon type="ios-trash-outline" @click.native="handleRemoveFile('business', item)"></Icon>
                        </div>
                      </template>
                      <template v-else>
                        <Progress :stroke-width="7" :percent="99" status="active" hide-info></Progress>
                      </template>
                    </div>
                    <Upload
                      name="UploadForm[file]"
                      :on-success="
                        (res, file, files) => {
                          fileUploadSuccess('business', res, file, files)
                        }
                      "
                      :on-error="
                        (res, file, files) => {
                          fileUploadError('business', res, file, files)
                        }
                      "
                      :format="['jpg', 'jpeg', 'png']"
                      :action="fileUploadURL"
                      :headers="fileUploadHeaders"
                      class="upload-box"
                      :on-format-error="(file, files) => fileFormatError('business', file, files)"
                      :before-upload="(file) => fileBeforeUpload('business', file)"
                      :show-upload-list="false"
                      :disabled="formData.businessLicense.length > 0 && formData.businessLicense[formData.businessLicense.length - 1].url === ''"
                    >
                      <div style="width: 58px;height:58px;line-height: 58px; text-align: center">
                        <Icon type="md-add" size="20"></Icon>
                      </div>
                    </Upload>
                  </FormItem>
                </Row>
              </Form>
            </div>
          </Card>
        </Row>
        <!-- 基本信息 end -->
        <!-- 系统信息 start -->
        <Row>
          <Card>
            <div slot="title"><p>系统信息</p></div>
            <Form ref="systemInfo" :model="formData">
              <Row style="width: 80%; margin-bottom:10px;">
                <Col span="10"><span class="rule-required">系统/门店名称</span></Col>
                <Col span="6"><span class="rule-required">门店数量</span></Col>
                <Col span="6"><span>客户等级</span></Col>
              </Row>
              <div style="width: 80%;">
                <Row v-for="(item, index) in formData.systemInfo" :key="'system' + index">
                  <Col span="10">
                    <FormItem :prop="`systemInfo[${index}].name`" :rules="{ required: true, message: '该选项不能为空', trigger: 'blur', max: 50 }">
                      <Input v-model="item.name" />
                    </FormItem>
                  </Col>
                  <Col span="6">
                    <FormItem :prop="`systemInfo[${index}].facadeNumber`" :rules="{ required: true, validator: storeNumber, trigger: 'blur' }">
                      <Input v-model="item.facadeNumber" @on-change="getSystemContractLevel(item.facadeNumber, index)" />
                    </FormItem>
                  </Col>
                  <Col span="5">
                    <FormItem>
                      <Input :value="getSystemContractLevel(item.facadeNumber)" disabled />
                    </FormItem>
                  </Col>
                  <Col span="3">
                    <FormItem>
                      <div v-if="index === 0" >
                        <Button icon="md-add" @click="() => formData.systemInfo.push({})"></Button>
                        <Button v-show="formData.systemInfo.length > 1" icon="md-remove" @click="() => handleRemoveSystemInfo(index)"></Button>
                      </div>
                      <Button v-else icon="md-remove" @click="() => handleRemoveSystemInfo(index)"></Button>
                    </FormItem>
                  </Col>
                </Row>
              </div>
            </Form>
          </Card>
        </Row>
        <!-- 系统信息 end -->
        <!-- 收货信息 start -->
        <Row>
          <Card>
            <div slot="title"><p>收货信息</p></div>
            <Form  :model="receivingAddr.formData" label-position="left" :label-width="75">
              <Row>
                <Col :md="16">
                  <Row>
                    <Col :md="20">
                      <FormItem label="收货地址：">
                        <Input v-model="receivingAddr.formData.receiving_address" @keydown.native.enter.prevent="getReceivingAddrInfo('new')" clearable/>
                      </FormItem>
                    </Col>
                    <Col :md="1" style="margin-bottom: 10px">
                      <Button @click="getReceivingAddrInfo('new')" type="primary">搜索</Button>
                    </Col>
                  </Row>
                </Col>
                <Col :md="8">
                  <Row type="flex" justify="end">
                    <Button type="primary" @click="showImportModal('address')" class="margin-btn">导入</Button>
                    <Button type="primary" @click="showInfoModal('receivingAddrModal', 'add')" class="margin-btn">添加</Button>
                    <Button type="primary" @click="showInfoModal('receivingAddrModal', 'edit')" class="margin-btn">修改</Button>
                    <Button type="primary" @click="showDelModal('address')" class="margin-btn">删除</Button>
                  </Row>
                </Col>
              </Row>
            </Form>
            <div>
              <Table
                class="review-list"
                border
                highlight-row
                :columns="receivingAddr.columns"
                :data="receivingAddr.data"
                :loading="receivingAddr.loading"
                @on-selection-change="
                  (selection) => {
                    selectionChange(selection, 'address')
                  }
                "
                size="small"
              ></Table>
            </div>
            <div style="margin: 10px;overflow: hidden">
              <div class="pages-L">共 {{ receivingAddr.pageProps.totalCount }} 条</div>
              <div style="float: right;">
                <Page
                  :total="receivingAddr.pageProps.totalCount"
                  size="small"
                  :current="receivingAddr.pageProps.currentPage"
                  show-sizer
                  show-elevator
                  @on-change="(val) => changePage(val, 'receivingAddress')"
                  @on-page-size-change="(val) => changePageSize(val, 'receivingAddress')"
                ></Page>
              </div>
            </div>
          </Card>
        </Row>
        <!-- 收货信息 end -->
        <!-- 合同政策 start -->
        <Row>
          <Card>
            <div slot="title"><p>合同信息</p></div>
            <Form ref="contractsInfo" :model="formData" :label-width="120">
              <Row v-for="(item, index) in formData.contractsInfo" :key="index">
                <Col span="22">
                  <div class="contract-box">
                    <Row>
                      <Col :md="7">
                        <FormItem
                          label="合同模板："
                          :prop="`contractsInfo[${index}].contractTemplate`"
                          :rules="{ required: true, message: '该选项不能为空', trigger: 'change' }"
                        >
                          <Select v-model="item.contractTemplate" placeholder="请选择合同模板">
                            <Option value="customer">客户合同</Option>
                            <Option value="official">我司合同</Option>
                          </Select>
                        </FormItem>
                      </Col>
                      <Col :md="7">
                        <FormItem
                          label="品牌："
                          :prop="`contractsInfo[${index}].coBrand`"
                          :rules="{ required: true, message: '该选项不能为空', trigger: 'change' }"
                        >
                          <Select v-model="item.coBrand" placeholder="请选择品牌">
                            <Option
                              v-for="(brand, bIndex) in brandList"
                              :key="bIndex"
                              :value="brand.value"
                              :label="brand.label"
                            ></Option>
                          </Select>
                        </FormItem>
                      </Col>
                      <Col :md="7">
                        <FormItem
                          label="省份："
                          :prop="`contractsInfo[${index}].province`"
                          :rules="{ required: true, message: '该选项不能为空', trigger: 'change' }"
                        >
                          <Select filterable v-model="item.province" placeholder="请选择省份">
                            <Option
                              v-for="(pro, pIndex) in provinceList"
                              :key="pIndex"
                              :value="pro.value"
                              :label="pro.label"
                            ></Option>
                          </Select>
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <Col :md="7">
                        <FormItem
                          label="合同签约日期："
                          :prop="`contractsInfo[${index}].contractAtBak`"
                          :rules="{ required: true, message: '该选项不能为空', trigger: 'change', type: 'date' }"
                        >
                          <DatePicker v-model="item.contractAtBak" @on-change="(value) => {item.contractAt = value}" type="date" placeholder="请选择日期"></DatePicker>
                        </FormItem>
                      </Col>
                      <Col :md="7">
                        <FormItem
                          label="合同到期日期："
                          :prop="`contractsInfo[${index}].expireAtBak`"
                          :rules="{ required: true, message: '该选项不能为空', trigger: 'change', type: 'date' }"
                        >
                          <DatePicker v-model="item.expireAtBak" @on-change="(value) => {item.expireAt = value}" type="date" placeholder="请选择日期"></DatePicker>
                        </FormItem>
                      </Col>
                      <Col :md="7">
                        <FormItem label="合同编号：">
                          <Input :value="item.number ? item.number : ''" disabled />
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <Col :md="14">
                        <FormItem
                          label="合同地址："
                          :prop="`contractsInfo[${index}].address`"
                          :rules="{ required: true, message: '请输入1-300字符', trigger: 'blur', max: 300 }"
                        >
                          <Input v-model="item.address" />
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <!-- <Col :md="7">
                        <FormItem
                          label="合作商政策："
                          :prop="`contractsInfo[${index}].partnerPolicyId`"
                          :rules="{ required: true, message: '该选项不能为空', trigger: 'change' }"
                        >
                          <Select
                            v-model="item.partnerPolicyId"
                            label-in-value
                            filterable
                            remote
                            :loading="queryLoading"
                            :remote-method="
                              (value) => {
                                queryContractDebonce(value, 'contract')
                              }
                            "
                            @on-change="
                              (value) => {
                                selectOption(value, 'contract', index)
                              }
                            "
                          >
                            <Option
                              v-for="(c, cIndex) in queryContractsList"
                              :label="c.partner_policy_name"
                              :value="c.partner_policy_id"
                              :key="cIndex"
                            ></Option>
                          </Select>
                        </FormItem>
                      </Col> -->
                      <Col :md="7">
                        <FormItem
                          label="结款方式："
                          :prop="`contractsInfo[${index}].paymentMethod`"
                          :rules="{ required: true, message: '该选项不能为空', trigger: 'change' }"
                        >
                          <Select v-model="item.paymentMethod" placeholder="请选择结款方式" @on-change="(val) => selectOption(val, 'contractPaymentMethod', index)">
                            <Option
                              v-for="(p, pIndex) in paymentMethodList"
                              :key="pIndex"
                              :value="p.value"
                              :label="p.label"
                            ></Option>
                          </Select>
                        </FormItem>
                      </Col>
                      <Col :md="7">
                        <FormItem
                          label="结款周期："
                          :prop="`contractsInfo[${index}].paymentDays`"
                          :rules="item.paymentMethod === 'spotCash' ? {required: false} : { required: true, message: '请输入1-50字符', trigger: 'blur', max: 50 }"
                        >
                          <Input v-model="item.paymentDays" :disabled="item.paymentMethod === 'spotCash'" />
                        </FormItem>
                      </Col>
                      <Col :md="7">
                        <FormItem
                          label="对账日："
                          :prop="`contractsInfo[${index}].paymentAt`"
                          :rules="item.paymentMethod === 'spotCash' ? {required: false} : { required: true, message: '请输入1-50字符', trigger: 'blur', max: 50 }"
                        >
                          <Input v-model="item.paymentAt" :disabled="item.paymentMethod === 'spotCash'" />
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <Col :md="21">
                        <FormItem
                          label="备注："
                          :prop="`contractsInfo[${index}].remark`"
                          :rules="{ required: false, message: '备注不能超过300字符', trigger: 'blur', max: 300 }"
                        >
                          <Input v-model="item.remark" type="textarea" placeholder="政策外利益性条款" />
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <Col :md="21">
                        <FormItem label="上传附件：">
                          <Upload
                            name="UploadForm[file]"
                            :headers="fileUploadHeaders"
                            :action="fileUploadURL"
                            :default-file-list="formData.contractsInfo[index].fileItems"
                            :on-success="(res, file, files) => fileUploadSuccess('contracts', res, file, files, index)"
                            :on-error="(res, file, files) => fileUploadError('contracts', res, file, files)"
                            :on-remove="(file, files) => handleRemoveFile('contracts', file, index)">
                            <Button icon="md-add" size="large"></Button>
                          </Upload>
                        </FormItem>
                      </Col>
                    </Row>
                  </div>
                </Col>
                <Col span="2">
                  <Button v-if="index === 0" icon="md-add" size="large" @click="addContract"></Button>
                  <Button v-else icon="md-remove" size="large" @click="delContract(index)"></Button>
                </Col>
              </Row>
            </Form>
          </Card>
        </Row>
        <!-- 合同政策 end -->
        <!-- 附件 start -->
        <Row class="border-row">
          <Card>
            <div slot="title"><p>附件</p></div>
            <Upload
              name="UploadForm[file]"
              :on-success="
                (res, file, files) => {
                  fileUploadSuccess('file', res, file, files)
                }
              "
              :on-error="
                (res, file, files) => {
                  fileUploadError('file', res, file, files)
                }
              "
              :default-file-list="formData.fileItems"
              :action="fileUploadURL"
              :on-remove="(file) => {handleRemoveFile('file', file)}"
              :headers="fileUploadHeaders"
            >
              <Button icon="md-add" size="large"></Button>
            </Upload>
          </Card>
        </Row>
        <!-- 附件 end -->
        <Spin fix v-if="spinShow"></Spin>
      </div>
    </Card>
    <!-- 点击图片放大 start -->
    <Modal v-model="showImgModal" footer-hide width="550">
      <!-- 占位 -->
      <div style="height:28px"></div>
      <img style="width: 100%" :src="showImgUrl" alt="" />
    </Modal>
    <!-- 点击图片放大 end -->
    <!-- 收货信息-编辑 start -->
    <Modal class="info-modal" v-model="receivingAddrModal.modal" width="1200" title="编辑收货地址" :closable="false">
      <Form :model="receivingAddrModal" ref="receivingAddrModal">
        <Row style="margin-bottom: 15px;">
          <Col span="22">
            <Col :span="5" class="rule-required">收货地址地区</Col>
            <Col :span="11" class="rule-required">收货详细地址</Col>
            <Col :span="4" class="rule-required">联系人</Col>
            <Col :span="4" class="rule-required">联系方式</Col>
          </Col>
        </Row>
        <Row v-for="(item, index) in receivingAddrModal.data" :key="index + 'Add'">
          <Col span="22">
            <Row>
              <Col :span="5">
                <FormItem
                  label=""
                  :label-width="0"
                  :prop="`data[${index}].area`"
                  :rules="{ required: true, message: '收货地址地区不能为空', pattern: /\S/, trigger: 'change' }"
                >
                  <Cascader
                    :data="area"
                    :clearable="false"
                    :load-data="areaLoading"
                    v-model.trim="item.area"
                    placeholder="所在地区"
                    @on-change="
                      (v, arr) => {
                        getProvince(v, arr, index, 'receivingAddrModal')
                      }
                    "
                    style="width:100%"
                  ></Cascader>
                </FormItem>
              </Col>
              <Col :span="11">
                <FormItem
                  label=""
                  :prop="`data[${index}].receiving_address`"
                  :rules="{ required: true, message: '收货地址不能为空', trigger: 'blur' }"
                  :label-width="0"
                >
                  <Input v-model.trim="item.receiving_address" placeholder="详细地址：如道路、门牌号、小区、楼栋号、单元室等"></Input>
                </FormItem>
              </Col>
              <Col :span="4">
                <FormItem
                  label=""
                  :prop="`data[${index}].contact`"
                  :rules="{ required: true, message: '联系人不能为空', trigger: 'blur' }"
                  :label-width="0"
                >
                  <Input v-model.trim="item.contact" placeholder="请输入联系人"></Input>
                </FormItem>
              </Col>
              <Col :span="4">
                <FormItem
                  label=""
                  :prop="`data[${index}].contact_information`"
                  :rules="{
                    required: true,
                    message: '联系方式不正确',
                    trigger: 'blur',
                    pattern: /^(((\d{3,4}-)?[0-9]{7,8})|(1(3|4|5|6|7|8|9)\d{9}))$/,
                  }"
                  :label-width="0"
                >
                  <Input v-model.trim="item.contact_information" placeholder="请输入联系方式" type="text"></Input>
                </FormItem>
              </Col>
            </Row>
          </Col>
          <Col :span="2" v-if="receivingAddrModal.type === 'add'">
            <Button v-if="index === 0" icon="md-add" @click="addItem('receivingAddrModal')"></Button>
            <Button icon="md-remove" @click="removeItem(index, 'receivingAddrModal')"></Button>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button
          type="text"
          @click="
            () => {
              receivingAddrModal.modal = false
              receivingAddrModal.btnLoading = false
              receivingAddrModal.data = [{}]
            }
          "
          >取消</Button
        >
        <Button type="primary" :loading="receivingAddrModal.btnLoading" @click="receivingAddrSubmit('receivingAddrModal')">确定</Button>
      </div>
    </Modal>
    <!-- 收货信息-编辑 end -->
    <!-- 删除信息 start -->
    <Modal class="info-modal" v-model="delModal" width="500" title="确认删除">
      <p v-if="delType === 'contact'" style="font-size: 18px; font-weight: bolder;">确认删除所选择的联系人信息吗？</p>
      <p v-if="delType === 'store'" style="font-size: 18px; font-weight: bolder;">确认删除所选择的门店信息吗？</p>
      <p v-if="delType === 'address'" style="font-size: 18px; font-weight: bolder;">确认删除所选择的收货信息吗？</p>
      <div slot="footer">
        <Button 
          type="text"
          @click="() => {
            delModal = false
            delLoading = false
          }">取消</Button>
        <Button type="primary" @click="delInfo" :loading="delLoading">确定</Button>
      </div>
    </Modal>
    <!-- 删除信息 end -->
    <!-- 导入 start -->
    <Modal class="info-modal" v-model="importModal" width="500" :title="importType === 'store' ? '导入门店信息' : '导入收货信息'">
      <div style="text-align: center;">
        <div class="modalTest" style="color:#f60;">
          <a href="javascript:void(0);" @click="downloadImport()">下载导入模版</a>
        </div>
        <Upload
          name="UploadForm[excel]"
          :format="['xlsx']"
          :show-upload-list="false"
          :action="importType === 'store' ? storeImportUrl : addressImportURL"
          :headers="fileUploadHeaders"
          :data="importParams"
          :before-upload="(file) => fileBeforeUpload('import', file)"
          :on-success="(res, file, files) => fileUploadSuccess('importReceivingInfo', res, file, files)"
          :on-error="() => fileUploadError('import')"
          :on-format-error="(file, files) => fileFormatError('import', file, files)"
        >
          <Button :loading="importLoading" type="primary">选择导入的文件</Button>
        </Upload>
      </div>
      <div slot="footer">
        <div style="height: 20px;"></div>
      </div>
    </Modal>
    <!-- 导入 end -->
  </div>
</template>

<script>
import { SERVER_BASE_URL } from '~/api/config'
import area from '~/plugins/area.js'
import Cookies from 'js-cookie'
import mixin from '../mixins'
export default {
  mixins: [mixin],
  data() {
    const uploadRule = (rule, value, callback) => {
      if (this.formData.businessLicense.length === 0) {
        callback(new Error('该项目不能为空'))
      } else {
        callback()
      }
    }

    const coBrandRule = (rule, value, callback) => {
      if (this.formData.coBrand.length === 0) {
        callback(new Error('该项目不能为空'))
      } else {
        callback()
      }
    }

    const storeNumber = (rule, value, callback) => {
      if(value && /^[1-9]\d{0,4}$/.test(value)) {
        callback()
      } else {
        callback(new Error('请输入1-5位数字'))
      }
    }

    return {
      storeNumber, // 门店数量校验器
      spinShow: false,
      origin: this.$route.query.origin, // 标记来源位置 潜客-customer 合客-undefined
      id: this.$route.query.id,
      companyNameBak: '',
      // 文件上传
      fileUploadURL: `${SERVER_BASE_URL}/v1/upload/create`,
      addressImportURL: `${SERVER_BASE_URL}/v2/contractor-addr-group/import`,
      storeImportUrl: `${SERVER_BASE_URL}/v2/facade/import`,
      fileUploadHeaders: {
        Authorization: Cookies.get('authorization'),
      },
      importModal: false,
      importType: '',
      importParams: {},
      importLoading: false,
      delModal: false,
      delType: '',
      delLoading: false,
      area: [],
      // 合同政策省市
      provinceList: [
        { value: 'AH', label: '安徽省' },
        { value: 'BJ', label: '北京市' },
        { value: 'CQ', label: '重庆市' },
        { value: 'FJ', label: '福建省' },
        { value: 'GS', label: '甘肃省' },
        { value: 'GD', label: '广东省' },
        { value: 'GX', label: '广西壮族自治区' },
        { value: 'GZ', label: '贵州省' },
        { value: 'HAN', label: '海南省' },
        { value: 'HEB', label: '河北省' },
        { value: 'HEN', label: '河南省' },
        { value: 'HLJ', label: '黑龙江省' },
        { value: 'HUB', label: '湖北省' },
        { value: 'HUN', label: '湖南省' },
        { value: 'JX', label: '江西省' },
        { value: 'JL', label: '吉林省' },
        { value: 'JS', label: '江苏省' },
        { value: 'LN', label: '辽宁省' },
        { value: 'NMG', label: '内蒙古自治区' },
        { value: 'NX', label: '宁夏回族自治区' },
        { value: 'QH', label: '青海省' },
        { value: 'JIN', label: '山西省' },
        { value: 'SD', label: '山东省' },
        { value: 'SX', label: '陕西省' },
        { value: 'SH', label: '上海市' },
        { value: 'SC', label: '四川省' },
        { value: 'TJ', label: '天津市' },
        { value: 'XZ', label: '西藏自治区' },
        { value: 'XJ', label: '新疆维吾尔自治区' },
        { value: 'YN', label: '云南省' },
        { value: 'ZJ', label: '浙江省' },
        { value: 'HK', label: '香港' },
        { value: 'AM', label: '澳门' },
        { value: 'TW', label: '台湾省' },
      ],
      // 收货信息 - 模态框
      receivingAddrModal: {
        batchNumber: null,
        modal: false,
        btnLoading: false,
        type: '',
        data: [
          {
            contractor_id: null,
            area: [],
            receiving_address: '',
            contact: '',
            contact_information: '',
          },
        ],
      },
      // 收货信息
      receivingAddr: {
        columns: [
          { type: 'selection', width: 60, align: 'center' },
          { 
            title: '序号',
            minWidth: 70,
            align: 'center',
            render: (h, params) => {
              return h('span', params.index + 1)
            }
          },
          { 
            title: '收货地区',
            minWidth: 150,
            align: 'center',
            render: (h, params) => {
              let pro = params.row
              return h('span', pro.province + pro.city + pro.county)
            }
          },
          { title: '收货地址', key: 'receiving_address', minWidth: 200, align: 'center' },
          { title: '联系人', key: 'contact', minWidth: 120, align: 'center' },
          { title: '联系方式', key: 'contact_information', minWidth: 320, align: 'center' },
        ],
        formData: {
          address: '',
        },
        data: [],
        loading: false,
        pageProps: {
          page: 1,
          perPage: 10,
          currentPage: 1,
          totalCount: 0,
        },
      },
      hasContractor: false,
      hasCompanyName: false,
      queryCompanyList: [],
      queryContractsList: [],
      queryParentList: [],
      queryEmployeeList: [],
      selectReceivingAddrList: [],
      brandList: [
        { value: 'wis', label: 'WIS' },
        { value: 'kono', label: 'KONO' },
      ],
      merchantLevel: [
        { value: 'A1', label: 'A1' },
        { value: 'A2', label: 'A2' },
        { value: 'B1', label: 'B1' },
        { value: 'B2', label: 'B2' },
        { value: 'C', label: 'C' },
        { value: 'D', label: 'D' },
      ],
      paymentMethodList: [
        { value: 'spotCash', label: '现款现货' },
        { value: 'realSale', label: '实销实结' },
        { value: 'monthly', label: '月结' },
      ],
      formData: {
        companyInfoId: 0,
        companyInfo: {},
        fileItems: [], // 附件
        businessLicense: [], // 营业执照
        contractsInfo: [ // 合同信息
          {
            contractAtBak: '',
            expireAtBak: '',
            fileItems: [],
          }
        ], 
        systemInfo: [ // 系统信息
          {
            name: '',
            facadeNumber: ''
          }
        ],
        coBrand: [],
      },
      baseInfoFormRules: {
        companyInfoId: [{ required: true, message: '该选项不能为空', trigger: 'change' }],
        merchantType: [{ required: true, message: '该选项不能为空', trigger: 'change' }],
        coBrand: [{ required: true, validator: coBrandRule, trigger: 'change' }],
        systemName: [{ required: true, message: '请输入1-50字符', trigger: 'blur', max: 50 }],
        level: [{ required: true, message: '该选项不能为空', trigger: 'change' }],
        uploadForm: [{ required: true, validator: uploadRule, trigger: 'change' }],
      },
      recoveSystemInfo: [], // 存储移除已有的系统信息
      queryLoading: false,
      submitLoading: false,
      // 预览
      showImgModal: false,
      showImgUrl: '',
      queryCompanyDebonce: this.$debonce(this.queryRemote, 1000),
      queryContractDebonce: this.$debonce(this.queryRemote, 1000),
      queryParentDebonce: this.$debonce(this.queryRemote, 1000),
      queryEmployeeDebonce: this.$debonce(this.queryRemote, 1000),
    }
  },

  mounted() {
    setTimeout(() => this.area = area, 0)
    this.merchantTypeList.push({ value: 'service', label: '服务商' })
    this.id && this.getDetail(this.id)
    this.getTableData('all')
  },

  methods: {
    // ------------------------------------ 接口请求API ------------------------------------
    /**
     * 添加/编辑/确认合作
     * @param {Object} params: 请求时携带的body
     */
    submitInfo(params) {
      if (this.origin === 'customer') { // 由潜客跳转过来
        this.$api.potentialCustomerCooperate(params)
          .then((res) => {
            if (res.code === 0) {
              this.$Message.success('操作成功')
              this.submitLoading = false
              this.$router.push('/contract/potential-customer/customer') // 操作完成后回到潜客列表
            }
          })
          .catch((err) => {
            this.$Notice.error({
              title: err.code,
              desc: err.message
            })
            this.submitLoading = false
          })
        return
      }
      if(this.id) {
        // 编辑
        delete params.auditLog
        delete params.merchantName
        delete params.createdAt
        this.$api.cooperativeCustomerUpdate(params).then((res) => {
          if(res.code === 0){
            this.$Message.success('操作成功')
            this.submitLoading = false
            this.$router.push('/contract/cooperative-customer/cooperative-list')
          }
        })
        .catch((err) => {
          this.$Notice.error({
            title: err.code,
            desc: err.message
          })
          this.submitLoading = false
        })
      } else {
        // 添加
        this.receivingAddrModal.batchNumber ? params.addrGroupBatchNumber = this.receivingAddrModal.batchNumber : ''
        this.$api.cooperativeCustomerAdd(params).then((res) => {
          if(res.code === 0){
            this.$Message.success('操作成功')
            this.submitLoading = false
            this.$router.push('/contract/cooperative-customer/cooperative-list')
          }
        })
        .catch((err) => {
          this.$Notice.error({
            title: err.code,
            desc: err.message
          })
          this.submitLoading = false
        })
      }
    },

    /**
     * 添加收获地址
     */
    receivingAddrSubmit(name) {
      this.$refs[name].validate((valid) => {
        if(valid) {
          this[name].btnLoading = true
          let params = {}
          params.addrGroup = JSON.parse(JSON.stringify(this[name].data))
          this[name].batchNumber && (params.batchNumber = this[name].batchNumber)
          for(let a of params.addrGroup) {
            delete a.area
            if(this.id) {
              a.contractor_id = this.id
            } else {
              delete a.contractor_id
            }
          }
          if(this[name].type === 'add') {
            this.$api.contractorAddAddress(params).then((res) => {
              if(res.code === 0) {
                this[name].batchNumber = res.data.batchNumber
                this.$Message.success('收货信息信息添加成功')
                this[name].btnLoading = false
                this[name].modal = false
                this[name].data = [{}]
                this.getTableData('receivingAddr')
              }
            })
          } else if(this[name].type === 'edit') {
            params.batchNumber && delete params.batchNumber
            this.$api.contractorEditAddress(params).then((res) => {
              if(res.code === 0) {
                this.$Message.success('收货信息信息添加成功')
                this[name].modal = false
                this.selectReceivingAddrList = []
                this[name].data = [{}]
                this.getTableData('receivingAddr')
              }
            })
            .finally(() => {
              this[name].btnLoading = false
            })
          }
        }
      })
    },

    /**
     * 删除收货信息
     */
    delInfo() {
      this.delLoading = true
      let ids = []
      if (this.delType === 'address') {
        let arr = this.selectReceivingAddrList
        for(let i=0; i<arr.length; i++) {
          ids.push(arr[i].id)
        }
        this.$api.contractorDelAddress({ids}).then((res) => {
          if(res.code === 0) {
            this.delLoading = false
            this.delModal = false
            this.$Message.success('收货信息删除成功')
            this.selectContactsList = []
            this.getTableData('receivingAddr')
          }
        })
      }
    },

    // 获取详情
    getDetail(id) {
      this.spinShow = true
      this.$api.cooperativeCustomerDeatil({id}).then((res) => {
        if(res.code === 0) {
          let data = res.data
          data.companyInfo = data.companyInfo || {}
          data.coBrand = data.coBrand.length > 0 ? data.coBrand.split(',') : []
          data.contractsInfo = data.contractsInfo.length > 0 ? data.contractsInfo : [{fileItems: []}]
          data.systemInfo = data.systemInfo.length > 0 ? data.systemInfo : [{}]
          data.fileItems.forEach((item) => item.name = `${item.title}.${item.extension}`)
          data.contractsInfo.forEach((item) => {
            item.contractAtBak = this.formatDate(item.contractAt)
            item.expireAtBak = this.formatDate(item.expireAt)
            item.partnerPolicyId && this.queryRemote(item.partnerPolicyName, 'contract')
          })
          data.parentContractorId > 0 ? this.queryRemote(data.parentContractorName, 'parent') : data.parentContractorId = ''
          data.companyInfoId > 0 && this.queryRemote(data.companyInfo.name, 'company')
          data.salesmanName && this.queryRemote(data.salesmanName, 'employee')
          this.formData = data
          this.spinShow = false
          this.$nextTick(() => this.companyNameBak = data.companyInfo.name)
        }
      })
    },

    // 获取收货地址信息
    getReceivingAddrInfo(type = '') {
      this.receivingAddr.loading = true
      let params = JSON.parse(JSON.stringify(this.receivingAddr.formData)),
          contractor_id = this.id
      params.page = this.receivingAddr.pageProps.page
      params.perPage = this.receivingAddr.pageProps.perPage
      if (type === 'new') {
        params.page = this.receivingAddr.pageProps.page = 1
      }
      if(!this.receivingAddrModal.batchNumber && !contractor_id) {
        this.receivingAddr.loading = false
        return
      }
      contractor_id != undefined ? params.contractor_id = contractor_id : params.batch_number = this.receivingAddrModal.batchNumber
      // 调用接口
      this.$api.contractorTabAddress(params).then((res) => {
        this.receivingAddr.data = res.items
        this.receivingAddr.pageProps.totalCount = res._meta.totalCount
        this.receivingAddr.pageProps.currentPage = res._meta.currentPage
      })
      .finally(() => {
        this.receivingAddr.loading = false
      })
    },

    /**
     * 远程查询API
     * @param {String} name: 远程查询关键字
     * @param {String} type: 调取远程查询类型
     * @param {Boolean} repeat: 是否重复查询（适用于工商信息）
     */
    queryRemote(name, type, repeat = false) {
      this.queryLoading = true
      switch (type) {
        case 'contract': // 合作政策查询API
          this.$api.getPartnerPolicy({name})
            .then(res => {
              if(res.code === 0) {
                this.queryContractsList = res.data
              }
            })
            .finally(() => {
              this.queryLoading = false
            })
          break
        case 'company': // 工商查询API
          if(!name.trim()) break
          let params = {name}
          repeat && (params.apiCall = 'yes')
          this.$api.cuePoolGetCompanyInfo(params)
            .then(res => {
              let arr = res.items
              if (arr.length == 0) {
                this.hasCompanyName = false
              } else {
                this.hasCompanyName = true
              }
              for (let i = 0, cur; i < arr.length; i++) {
                cur = arr[i].id
                for (let j = i + 1; j < arr.length; ) {
                  cur === arr[j].id ? arr.splice(j, 1) : j++
                }
              }
              this.queryCompanyList = arr
            })
            .finally(() => {
              this.queryLoading = false
            })
          break
        case 'parent': // 上级客户查询API
          if(!name.trim()) break
          this.$api.cooperativeCustomerSearchPartner({name})
            .then(res => {
              if(res.code === 0) {
                this.queryParentList = res.data
              }
            })
            .finally(() => {
              this.queryLoading = false
            })
          break
        case 'employee': // 员工查询API
          const username = name.split('/')[1] || name // 防止使用 FD-0001/超级管理员 这种形式查询
          this.$api.user({username})
            .then(res => {
              this.queryEmployeeList = res.items
            })
            .finally(() => {
              this.queryLoading = false
            })
          break
        default:
          break
      }
    },

    // ------------------------------------ 交互事件 ------------------------------------
    /**
     * 提交操作
     */
    submit(name1, name2, name3) {
      this.$refs[name1].validate((v1) => {
        if(v1) {
          this.$refs[name2].validate((v2) => {
            if (v2) {
              this.submitLoading = true
              let contract = this.formData.contractsInfo[0],
                  hasContractFlag = false
              for(let key in contract) {
                if (Array.isArray(contract[key])) {
                  contract[key].length > 0 && (hasContractFlag = true)
                } else {
                  contract[key] && (hasContractFlag = true)
                }
              }
              let params = JSON.parse(JSON.stringify(this.formData))
              delete params.companyInfo
              params.coBrand = params.coBrand.toString()
              params.parentContractorId = params.parentContractorId || 0
              params.systemInfo = [...params.systemInfo, ...this.recoveSystemInfo] // 已存在的系统信息被移除时也需要传给后端
              if(hasContractFlag) {
                this.$refs[name3].validate((v3) => {
                  if(v3) {
                    params.contractsInfo.forEach((item) => {
                      delete item.contractAtBak
                      delete item.expireAtBak
                      if(Number(item.contractAt)) {
                        item.contractAt = this.formatDate(item.contractAt)
                      }
                      if(Number(item.expireAt)) {
                        item.expireAt = this.formatDate(item.expireAt)
                      }
                    })
                    this.submitInfo(params)
                  } else {
                    this.$Message.warning('请检查合同信息')
                    this.submitLoading = false
                  }
                })
              } else {
                params.contractsInfo = []
                this.submitInfo(params)
              }
            }
          })
        }
      })
    },


    /**
     * 展开收货信息导入弹窗
     */
    showImportModal(type) {
      this.importModal = true
      this.importType = type
    },

    /**
     * 下载导入模板
     */
    downloadImport() {
      let type = this.importType
      if(type === 'store') { // 已经废弃
        this.$api.contractorTemplateShop().then((res) => {
          if(res.code === 0) {
            window.location.href = res.data.data;
          }
        })
      } else if(type === 'address') {
        this.$api.contractorTemplateAddress().then((res) => {
          if(res.code === 0) {
            window.location.href = res.data.data;
          }
        })
      }
    },

    // 显示信息模态框
    showInfoModal(name, type) {
      this.$refs[name].resetFields()
      if (type === 'add') {
        this[name].modal = true
        this[name].type = type
        this[name].data = [{}]
      } else if(type === 'edit') {
        if(name === 'receivingAddrModal' && this.hasSelect('address')) {
          this[name].modal = true
          this[name].type = type
          let arr = this.selectReceivingAddrList
          for(let i=0; i<arr.length; i++) {
            arr[i].area = [arr[i].province_id, arr[i].city_id, arr[i].county_id]
          }
          this[name].data = arr
        }
      }
    },

    /**
     * 显示删除模态框
     */
    showDelModal(name) {
      if (this.hasSelect(name)) {
        this.delType = name
        this.delModal = true
      }
    },

    /**
     * 新增一条收货信息
     */
    addItem(name) {
      let obj = {}
      if (name === 'receivingAddrModal') {
        obj = {
          area: [],
          receiving_address: '',
          contact: '',
          contact_information: '',
        }
      }
      this[name].data.push(obj)
    },

    /**
     * 移除一条收货信息
     */
    removeItem(index, name) {
      this[name].data.length > 1 && this[name].data.splice(index, 1)
    },

    // 改变页码
    changePage(e, type) {
      this[type].pageProps.page = e
      // 更新列表数据
      this.getTableData(type)
    },

    // 改变每页显示数
    changePageSize(e, type) {
      this[type].pageProps.perPage = e
      // 更新列表数据
      this.getTableData(type)
    },

    // 新增一条合同政策
    addContract() {
      this.formData.contractsInfo.push({fileItems: []})
    },

    // 删除合同政策
    delContract(index) {
      this.formData.contractsInfo.splice(index, 1)
    },

    // 查看大图
    showBigImg(url) {
      this.showImgModal = true
      this.showImgUrl = SERVER_BASE_URL + '/' + url
    },

    // 下拉框选中数据
    selectOption(val, type, index) {
      switch (type) {
        case 'contract':
          this.formData.contractsInfo[index].partnerPolicyName = val.label
          break
        case 'contractPaymentMethod':
          if (val === 'spotCash') {
            this.$nextTick(() => {
              this.$refs.contractsInfo.validate()
              this.formData.contractsInfo[index].paymentAt = this.formData.contractsInfo[index].paymentDays = ''
            })
          }
          break
        case 'company':
          if (typeof val === 'undefined') {
            this.formData.companyInfoId = 0
            this.formData.companyInfo = {}
            this.hasContractor = false
            break
          }
          let queryCompanyList = this.queryCompanyList
          queryCompanyList.some((item) => {
            if (val === item.id) {
              this.formData.companyInfo = this.companyInfo = item
              this.hasContractor = item.contractorId > 0 && item.contractorId !== this.id ? true : false
              return true
            }
          })
          break
        case 'parent':
          if(typeof val === 'undefined') {
            this.formData.parentContractorId = 0
            this.formData.parentContractorName = ''
            break
          }
          this.formData.parentContractorName = val.label
          break
        case 'employee':
          this.formData.salesmanName = val && val.label.split('/')[1] || ''
          break
        default:
          break
      }
    },

    /**
     * 移除系统信息
     * @param {Number} index: 被删除元素的下标
     */
    handleRemoveSystemInfo(index) {
      const res = this.formData.systemInfo.splice(index, 1)
      if (!!res[0].id) {
        res[0].del = true
        this.recoveSystemInfo.push(res[0])
      }
    },

    /**
     * 选中项发生改变
     */
    selectionChange(selection, type) {
      if (type === 'address') {
        this.selectReceivingAddrList = selection
      }
    },

    // 返回
    goBack() {
      if (this.origin === 'customer') {
        this.$router.push('/contract/potential-customer/customer')
      } else {
        this.$router.push('/contract/cooperative-customer/cooperative-list')
      }
    },

    // ------------------------------------ 方法 ------------------------------------
    /**
     * 文件导入处理结果
     * @param {Object} res: 响应结果
     * @param {String} type: 对应导入模块
     */
    handleFileImportRes(res, type = 'receivingInfo') {
      if (res.code === 301) {
        this.$Notice.error({title: '导入失败', desc: res.message, duration: 0})
        this.importLoading = false
        return false
      }
      if (res.code === 0) {
        type === 'receivingInfo' && !!res.data.batchNumber && (this.receivingAddrModal.batchNumber = res.data.batchNumber)
        this.importModal = false
        this.importLoading = false
        this.$Message.success('文件导入成功')
        this.getReceivingAddrInfo('new')
      }
    },
    
    // 级联选择器采用异步加载
    areaLoading(item, callback) {
      item.loading = true
    },

    /**
     * 是否选中数据
     */
    hasSelect(name) {
      if (name === 'address' && this.selectReceivingAddrList.length != 0) {
        return true
      }
      this.$Message.warning('请选择')
      return false
    },

    // 获取选中的地区
    getProvince(val, arr, index, prop) {
      for(let i=0; i<arr.length; i++) {
        if(i === 0) {
          this[prop].data[index].province_id = arr[i].value
          this[prop].data[index].province = arr[i].label
        }
        if(i === 1) {
          this[prop].data[index].city_id = arr[i].value
          this[prop].data[index].city = arr[i].label
        }
        if(i === 2) {
          this[prop].data[index].county_id = arr[i].value
          this[prop].data[index].county = arr[i].label
        }
      }
    },

    // 获取表格数据
    getTableData(target, type = '') {
      switch (target) {
        case 'receivingAddr':
          this.getReceivingAddrInfo(type)
          break
        case 'all':
          this.getReceivingAddrInfo(type)
          break
        default:
          break
      }
    },
    
    // 转换公司类型
    changeCompanyType(type) {
      if (type == 1) {
        return '公司'
      } else if (type == 2) {
        return '⾹港公司'
      } else if (type == 3) {
        return '社会组织'
      } else if (type == 4) {
        return '律所'
      } else if (type == 5) {
        return '事业单位'
      } else if (type == 6) {
        return '基金会'
      }
    },

    /**
     * 获取系统信息-客户等级
     * @param {String} value: 输入的值
     */
    getSystemContractLevel(value) {
      let level = ''
      if (value && /^[1-9]\d{0,4}$/.test(value)) {
        if (value <= 5) {
          level = 'D'
        } else if (value <= 20) {
          level = 'C'
        } else if (value <= 80) {
          level = 'B2'
        } else if (value <= 100) {
          level = 'B1'
        } else if (value <= 500) {
          level = 'A2'
        } else {
          level = 'A1'
        }
      }
      return level
    },

    /**
     * 文件上传之前回调
     * @param {String} target: 操作目标
     * @param {Object} file: 当前上传文件
     */
    fileBeforeUpload(target, file) {
      switch (target) {
        case 'business':
          let businessLicense = this.formData.businessLicense
          if (businessLicense.length > 4) {
            this.$Notice.warning({title: '提示', desc: '上传文件不能超过5个!'})
            return false
          }
          businessLicense.push({ url: '' })
          break
        case 'import':
          this.importLoading = true
          if(this.id) return this.importParams.contractor_id = this.id
          this.importParams.batchNumber = this.receivingAddrModal.batchNumber || ''
          break
        default:
          break
      }
    },

    /**
     * 文件上传成功回调
     * @param {String} target: 操作目标
     * @param {Object} response: 上传成功返回对象
     * @param {Array} file: 上传成功返回的文件
     * @param {Array} fileList: 返回上传成功的所有文件
     * @param {Number} index: 适用于判别为哪个合同政策
     */
    fileUploadSuccess(target, response, file, fileList, index) {
      const code = response.code
      switch (target) {
        case 'business':
          if (code === 0) {
            let businessLicense = this.formData.businessLicense
            businessLicense.pop()
            businessLicense.push(response.data)
          }
          break
        case 'file':
          code === 0 && this.formData.fileItems.push(response.data)
          break
        case 'contracts':
          code === 0 && this.formData.contractsInfo[index].fileItems.push(response.data)
          break
        case 'importReceivingInfo':
          this.handleFileImportRes(response)
          break
        default:
          break
      }
    },

    /**
     * 文件上传失败回调
     * @param {String} target: 操作目标
     * @param {String} error: 返回上传失败信息
     * @param {Array} file: 返回上传失败的文件
     * @param {Array} fileList: 返回上传失败的所有文件
     */
    fileUploadError(target, error, file, fileList) {
      if (target === 'import') {
        this.importLoading = false
        this.$Message.error('导入失败')
        return false
      }
      target === 'business' && this.formData.businessLicense.pop()
      this.$Notice.error({ title: '文件上传失败', desc: error })
    },

    /**
     * 上传文件格式不通过
     * @param {String} target: 操作目标
     */
    fileFormatError(target, file, fileList) {
      if (target === 'business') {
        this.formData.businessLicense.pop()
        this.$Notice.warning({title: '文件格式不正确', desc: '请上传的图片格式必须是：jpg、jpeg、png'})
      } else if (target === 'import') {
        this.importLoading = false
        this.$Message.error('文件格式错误，请先下载导入模板进行填写后再导入')
      }
    },

    /**
     * 移除上传的文件
     * @param {String} target: 操作目标
     * @param {Object} file: 需要移除的文件
     * @param {Number} index: 被移除文件的下标
     */
    handleRemoveFile(target, file, index) {
      const uid = file.uid
      switch (target) {
        case 'business': // 营业执照
          let businessLicense = this.formData.businessLicense
          businessLicense.splice(businessLicense.indexOf(file), 1)
          break
        case 'file': // 附件
          let fileItems = this.formData.fileItems
          fileItems.some((item, index) => {
            if (item.uid === uid) {
              fileItems.splice(index, 1)
              return true
            }
          })
          break
        case 'contracts': // 合同政策 -> 附件
          let currentImgs = this.formData.contractsInfo[index].fileItems
          currentImgs.some((item, index) => {
            if (item.uid === uid) {
              currentImgs.splice(index, 1)
              return true
            }
          })
          break
        default:
          break
      }
    },

    /**
     * 格式化时间
     * @param {String} time: 时间戳
     * @param {String} type: 格式化类型 默认：yyyy-MM-dd
     */
    formatDate(time, type) {
      type = type || 'yyyy-MM-dd'
      return this.$format(time, type)
    },
  },
}
</script>

<style lang="less" scoped>
/deep/ .shopaddress {
  input {
    text-align: left;
  }
}

// .ivu-card {
//   margin-bottom: 16px;
// }

.annex {
  display: flex;
  height: 32px;
  margin-bottom: 20px;
  .label {
    width: 120px;
    padding: 10px 12px 10px 0;
    line-height: 1;
    text-align: right;
    font-size: 12px;
  }
  .content {
    flex: 1;
    padding: 4px 7px;
    border-radius: 4px;
    border: 1px solid #dcdee2;
    line-height: 1.5;
    font-size: 12px;
    text-align: center;
    color: #0000ff;
    cursor: pointer;
  }
}

.contract-box {
  border: 1px dashed #b8babc;
  margin-bottom: 30px;
  padding-top: 24px;
}

.upload-list {
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
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
  img {
    width: 100%;
    height: 100%;
  }
  &:hover {
    .upload-list-cover {
      display: block;
    }
  }
}

.upload-box {
  display: inline-block;
  width: 58px;
  border: 1px solid #dcdee2;
  vertical-align: top;
  transition: border 0.2s ease-in-out, background 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  &:hover {
    cursor: pointer;
    border-color: #57a3f3;
  }
}

.upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
}

.business-icon {
  position: absolute;
  width: 20px;
  height: 20px;
  top: 6px;
  right: -25px;
  z-index: 99;
  cursor: pointer;
  img {
    width: 100%;
  }
}

.tipis {
  position: absolute;
  bottom: 3px;
  left: 125px;
  color: red;
  font-size: 12px;
}

.margin-btn {
  margin: 0 0 10px 10px;
}

.rule-required:before {
  content: '*';
  display: inline-block;
  margin-right: 4px;
  line-height: 1;
  font-size: 14px;
  color: #ed4014;
}

.info-modal {
  .ivu-modal-content {
    background-color: #f2f2f2;
    .ivu-modal-header {
      border-bottom: 0;
    }
    .ivu-modal-body {
      background-color: #fff;
      margin: 0 16px;
      border-radius: 6px;
    }
    .ivu-modal-footer {
      border-top: 0;
    }
  }
}

.modalTest{
  position: absolute;
  font-size: 14px;
  top: 30px;
  right: 40px;
}

.tipis-success {
  position: absolute;
  top: 100%;
  left: 0;
  line-height: 1;
  padding-top: 6px;
  color: #19be6b;
}

.tipis-fail {
  position: absolute;
  top: 100%;
  left: 0;
  line-height: 1;
  padding-top: 6px;
  color: #ed4014;
}

.ivu-spin-fix {
  z-index: 99;
  /deep/ .ivu-spin-main {
    top: 30%;
  }
}

</style>
