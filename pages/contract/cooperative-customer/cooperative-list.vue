<template>
  <div>
    <Card>
      <!-- 筛选搜索区域 -->
      <Row slot="title" justify="space-between" @keydown.native.enter.prevent="getList('new')">
        <Col style="margin-bottom: 10px;" span="22">
          <Select class="mb-5" v-model="formData.ownership" placeholder="数据权限范围" @on-change="getList('new')">
            <Option
              v-for="(item, index) in dataPermissionRange"
              :value="item.value"
              :label="item.label"
              :key="'dataPer' + index">
            </Option>
          </Select>
          <Input v-model="formData.merchantName" clearable placeholder="公司名称" class="mb-5"/>
          <Select v-model="formData.merchantType" clearable placeholder="客户类型" class="mb-5">
            <Option
              v-for="(item, index) in merchantTypeList"
              :key="'status' + index"
              :value="item.value"
              :label="item.label"
            ></Option>
          </Select>
          <Input v-model="formData.systemName" clearable placeholder="系统/门店名称" class="mb-5"/>
          <Input v-model="formData.followBy" clearable placeholder="商务负责人" class="mb-5"/>
          <Select v-model="formData.status" clearable placeholder="审核状态" class="mb-5">
            <Option
              v-for="(item, index) in auditStatusList"
              :key="'status' + index"
              :value="item.value"
              :label="item.label"
            ></Option>
          </Select>
          <!-- <DatePicker v-model="createDate" type="daterange" @on-change="selectDate" placeholder="选择创建日期"></DatePicker> -->
          <Select v-model="formData.isAllocated" clearable placeholder="是否分配" class="mb-5">
            <Option v-for="(item, index) in isAllocated" :key="'status' + index" :value="item.value" :label="item.label"></Option>
          </Select>
        </Col>
        <Col span="2">
          <Button type="primary" icon="ios-search" @click="getList('new')">搜索</Button>
        </Col>
        <Col span="24">
          <Button type="primary" @click="handleEdit('add')" v-permission="'/v2/partner/create'">添加</Button>
          <Button type="primary" @click="handleAudit" v-permission="'/v2/partner/audit'">审核</Button>
          <Button type="primary" @click="handleDistribution" v-permission="'/v2/partner/assign'">商务分配</Button>
          <Button type="primary" @click="handleTakeBack" v-permission="'/v2/partner/revoke'">收回</Button>
          <Button type="primary" @click="handleSetCooperating" v-permission="'/v2/partner/setting-cooperate'">合作设置</Button>
        </Col>
      </Row>
      <Row class="margin-top-10">
        <Table
          border
          highlight-row
          :columns="listData.columns"
          :data="listData.data"
          :loading="loadingTable"
          size="small"
          @on-selection-change="selectCheck"
        >
          <!-- 操作 -->
          <template slot-scope="{ row }" slot="action">
            <Tooltip placement="top" content="编辑" transfer>
              <Button type="primary" @click="handleEdit(row.id)" icon="md-create" size="small" v-permission="'/v2/partner/update'"></Button>
            </Tooltip>
            <Poptip @on-ok="handleDelete(row.id)" confirm title="您确认删除这条内容吗？" transfer>
              <Button size="small" icon="md-trash" :disabled="row.status == 'auditPass'" v-permission="'/v2/partner/delete'"></Button>
            </Poptip>
          </template>
        </Table>
        <div style="margin: 10px;overflow: hidden">
          <div class="pages-L">共 {{ pageProps.totalCount }} 条</div>
          <div style="float: right;">
            <Page
              :total="pageProps.totalCount"
              size="small"
              :current="pageProps.currentPage"
              show-sizer
              show-elevator
              @on-change="changePage"
              @on-page-size-change="changePageSize"
            ></Page>
          </div>
        </div>
      </Row>
    </Card>
    <!-- 确认回收模态框 start -->
    <Modal v-model="takeBack.show" width="430">
      <p slot="header">
        <span>确认回收</span>
      </p>
      <div style="text-align:center">
        <p class="take-back-title">收回后合作客户将无商务负责人</p>
        <Form ref="takeBack" :model="takeBack.formData" :rules="takeBack.rule" label-position="left" :label-width="75">
          <FormItem label="收回理由:" prop="reason">
            <Input v-model="takeBack.formData.reason" type="textarea" />
          </FormItem>
        </Form>
      </div>
      <div slot="footer" style="display:flex; justify-content: flex-end;">
        <Button type="default" style="width:80px" @click="closeModal('takeBack')" long>取消</Button>
        <Button type="primary" style="width:80px" :loading="loading" @click="confirmTakeBack('takeBack')" long>确认</Button>
      </div>
    </Modal>
    <!-- 确认回收模态框 end -->
    <!-- 设置客户状态模态框 start -->
    <Modal v-model="cooperationSet.show" width="430">
      <p slot="header">
        <span>设置客户状态</span>
      </p>
      <div style="text-align:center">
        <Form ref="cooperationSet" :model="cooperationSet.formData" :rules="cooperationSet.rule" :label-width="95">
          <FormItem label="客户状态：" prop="cooperateType">
            <RadioGroup v-model="cooperationSet.formData.cooperateType">
              <Radio label="normal"><span>正常合作</span></Radio>
              <Radio label="stop"><span>停止合作</span></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="理由：" prop="reason">
            <Input v-model="cooperationSet.formData.reason" type="textarea" />
          </FormItem>
        </Form>
      </div>
      <div slot="footer" style="display:flex; justify-content: flex-end;">
        <Button type="default" style="width:80px" @click="closeModal('cooperationSet')" long>取消</Button>
        <Button type="primary" style="width:80px" :loading="loading" @click="confirmCooperationSet('cooperationSet')" long>确认</Button>
      </div>
    </Modal>
    <!-- 设置客户状态模态框 end -->
    <!-- 商务分配模态框 start -->
    <Modal v-model="distribution.show" title="分配商务负责人" width="800">
      <div class="rel">
        <!-- 订单详情 start -->
        <div class="ivu-table-wrapper">
          <div class="ivu-table ivu-table-small ivu-table-border">
            <div class="ivu-table-body">
              <table cellspacing="0" cellpadding="0" border="0" width="100%">
                <tbody class="ivu-table-tbody">
                  <tr class="ivu-table-row">
                    <td class="head-bg w-300">
                      <div class="ivu-table-cell">公司名称</div>
                    </td>
                    <td>
                      <div class="ivu-table-cell">
                        <span v-text="distribution.formData.merchantName" class="policy-detail"></span>
                      </div>
                    </td>
                  </tr>
                  <tr class="ivu-table-row">
                    <td class="head-bg w-300">
                      <div class="ivu-table-cell">负责员工</div>
                    </td>
                    <td>
                      <div class="ivu-table-cell">
                        <Select
                          v-model="distribution.formData.followIds"
                          filterable
                          remote
                          multiple
                          :loading="distribution.loading"
                          :remote-method="searchEmployeDeb"
                          @on-change="selectEmploye"
                          placeholder="请输入员工姓名/工号"
                        >
                          <Option
                            v-for="(item, index) in employeList"
                            :value="item.id"
                            :label="item.fullName || item.full_name"
                            :key="index"
                          ></Option>
                        </Select>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <Spin v-show="" :fix="true" size="large"></Spin>
      </div>
      <div slot="footer">
        <Button type="default" @click="closeModal('distribution')">返回</Button>
        <Button type="primary" @click="confirmDistribution" :loading="loading">提交</Button>
      </div>
    </Modal>
    <!-- 商务分配模态框 end -->
    <!-- 审核模态框 start -->
    <Modal v-model="audit.show" width="900">
      <p slot="header">
        <span>审核</span>
      </p>
      <div class="rel">
        <div class="ivu-table-wrapper border-none">
          <div class="ivu-table ivu-table-samll ivu-table-border">
            <div class="ivu-table-body">
              <table cellspacing="0" cellpadding="0" border="0" width="100%">
                <thead>
                  <tr class="ivu-table-row">
                    <td class="head-bg" rowspan="4">
                      <div class="ivu-table-cell">
                        <span>基本信息</span>
                      </div>
                    </td>
                    <td class="head-bg">
                      <div class="ivu-table-cell">
                        <span>公司名称</span>
                      </div>
                    </td>
                    <td>
                      <div class="ivu-table-cell">
                        <span v-text="auditData.merchantName"></span>
                      </div>
                    </td>
                    <td class="head-bg">
                      <div class="ivu-table-cell">
                        <span>客户类型</span>
                      </div>
                    </td>
                    <td>
                      <div class="ivu-table-cell">
                        <span>{{formatMerchantType(auditData.merchantType)}}</span>
                      </div>
                    </td>
                    <td class="head-bg">
                      <div class="ivu-table-cell">
                        <span>负责人</span>
                      </div>
                    </td>
                    <td>
                      <div class="ivu-table-cell">
                        <span v-text="auditData.followBy"></span>
                      </div>
                    </td>
                  </tr>
                  <tr class="ivu-table-row">
                    <td class="head-bg">
                      <div class="ivu-table-cell">
                        <span>注册资本</span>
                      </div>
                    </td>
                    <td>
                      <div class="ivu-table-cell">
                        <span v-text="auditData.companyInfo.regCapital"></span>
                      </div>
                    </td>
                    <td class="head-bg">
                      <div class="ivu-table-cell">
                        <span>成立日期</span>
                      </div>
                    </td>
                    <td>
                      <div class="ivu-table-cell">
                        <span v-text="auditData.companyInfo.establishTime"></span>
                      </div>
                    </td>
                    <td class="head-bg">
                      <div class="ivu-table-cell">
                        <span>经营状态</span>
                      </div>
                    </td>
                    <td>
                      <div class="ivu-table-cell">
                        <span v-text="auditData.companyInfo.regStatus"></span>
                      </div>
                    </td>
                  </tr>
                  <tr class="ivu-table-row">
                    <td class="head-bg">
                      <div class="ivu-table-cell">
                        <span>联系人信息</span>
                      </div>
                    </td>
                    <td colspan="5">
                      <div class="ivu-table-cell">
                        <a href="javascript:;" @click="showCSAModal('contacts', auditData.id, auditData.contactCount)" v-if="auditData.id">查看更多</a>
                      </div>
                    </td>
                  </tr>
                  <tr class="ivu-table-row">
                    <td class="head-bg">
                      <div class="ivu-table-cell">
                        <span>客户等级</span>
                      </div>
                    </td>
                    <td>
                      <div class="ivu-table-cell text-align-left">
                        <span v-text="auditData.level"></span>
                      </div>
                    </td>
                    <td class="head-bg">
                      <div class="ivu-table-cell">
                        <span>营业执照</span>
                      </div>
                    </td>
                    <td colspan="3">
                      <div class="ivu-table-cell">
                        <div v-for="(item, index) in auditData.businessLicense" :key="index" class="break-up">
                          <a  href="javascript:;" @click="showLicense(item.urlShow)">{{item.title + '.' + item.extension}} </a>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr class="ivu-table-row">
                    <td class="head-bg" rowspan="2">
                      <div class="ivu-table-cell">
                        <span>门店信息</span>
                      </div>
                    </td>
                    <td class="head-bg">
                      <div class="ivu-table-cell">
                        <span>门店数量</span>
                      </div>
                    </td>
                    <td colspan="5">
                      <div class="ivu-table-cell">
                        <span v-text="auditData.facadeCount"></span>
                      </div>
                    </td>
                  </tr>
                  <tr class="ivu-table-row">
                    <td class="head-bg">
                      <div class="ivu-table-cell">
                        <span>门店详情</span>
                      </div>
                    </td>
                    <td colspan="5">
                      <div class="ivu-table-cell">
                        <a href="javascript:;" @click="showCSAModal('store', auditData.id, auditData.facadeCount)" v-if="auditData.id">查看更多</a>
                      </div>
                    </td>
                  </tr>
                  <tr class="ivu-table-row">
                    <td class="head-bg" rowspan="2">
                      <div class="ivu-table-cell">
                        <span>收货信息</span>
                      </div>
                    </td>
                    <td class="head-bg">
                      <div class="ivu-table-cell">
                        <span>地址数量</span>
                      </div>
                    </td>
                    <td colspan="5">
                      <div class="ivu-table-cell">
                        <span v-text="auditData.addrCount"></span>
                      </div>
                    </td>
                  </tr>
                  <tr class="ivu-table-row">
                    <td class="head-bg">
                      <div class="ivu-table-cell">
                        <span>地址详情</span>
                      </div>
                    </td>
                    <td colspan="5">
                      <div class="ivu-table-cell">
                        <a href="javascript:;" @click="showCSAModal('address', auditData.id, auditData.addrCount)" v-if="auditData.id">查看更多</a>
                      </div>
                    </td>
                  </tr>
                </thead>
                <tbody v-for="(item, index) in auditData.contractsInfo">
                  <tr class="ivu-table-row">
                    <td class="head-bg" rowspan="4">
                      <div class="ivu-table-cell">
                        <span>合同信息</span>
                      </div>
                    </td>
                    <td class="head-bg">
                      <div class="ivu-table-cell">
                        <span>合同签约日期</span>
                      </div>
                    </td>
                    <td colspan="2">
                      <div class="ivu-table-cell">
                        <span>{{formatDate(item.contractAt)}}</span>
                      </div>
                    </td>
                    <td class="head-bg">
                      <div class="ivu-table-cell">
                        <span>合同到期日期</span>
                      </div>
                    </td>
                    <td colspan="2">
                      <div class="ivu-table-cell">
                        <span>{{formatDate(item.expireAt)}}</span>
                      </div>
                    </td>
                  </tr>
                  <tr class="ivu-table-row">
                    <td class="head-bg">
                      <div class="ivu-table-cell">
                        <span>结款方式</span>
                      </div>
                    </td>
                    <td colspan="2">
                      <div class="ivu-table-cell">
                        <span>{{formatPaymentMethod(item.paymentMethod)}}</span>
                      </div>
                    </td>
                    <td class="head-bg">
                      <div class="ivu-table-cell">
                        <span>结款周期</span>
                      </div>
                    </td>
                    <td colspan="2">
                      <div class="ivu-table-cell">
                        <span v-text="item.paymentDays"></span>
                      </div>
                    </td>
                  </tr>
                  <tr class="ivu-table-row">
                    <td class="head-bg">
                      <div class="ivu-table-cell">
                        <span>对账日</span>
                      </div>
                    </td>
                    <td colspan="2">
                      <div class="ivu-table-cell">
                        <span v-text="item.paymentAt"></span>
                      </div>
                    </td>
                    <td class="head-bg">
                      <div class="ivu-table-cell">
                        <span>备注</span>
                      </div>
                    </td>
                    <td colspan="2">
                      <div class="ivu-table-cell">
                        <span v-text="item.remark"></span>
                      </div>
                    </td>
                  </tr>
                </tbody>
                <tbody v-if="!auditData.contractsInfo.length">
                  <tr class="ivu-table-row">
                    <td class="head-bg">
                      <div class="ivu-table-cell">
                        <span>合同信息</span>
                      </div>
                    </td>
                    <td class="head-bg">
                      <div class="ivu-table-cell">
                        <span>合同</span>
                      </div>
                    </td>
                    <td colspan="5">
                      <div class="ivu-table-cell">
                        <span>请添加合同信息</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr class="ivu-table-row">
                    <td class="head-bg">
                      <div class="ivu-table-cell">
                        <span>附件信息</span>
                      </div>
                    </td>
                    <td class="head-bg">
                      <div class="ivu-table-cell">
                        <span>附件</span>
                      </div>
                    </td>
                    <td colspan="5">
                      <div class="ivu-table-cell">
                        <!-- 使用点击跳转的方式 :href="`${SERVER_BASE_URL}/${item2.url}`" -->
                        <div class="break-up" v-for="(item, index) in auditData.fileItems" :key="index">
                          <a :href="`${SERVER_BASE_URL}/${item.url}`" target="_blank">{{item.title + '.' + item.extension}} </a>
                        </div>
                      </div>
                    </td>
                  </tr>

                  <tr class="ivu-table-row">
                    <td class="head-bg" rowspan="2">
                      <div class="ivu-table-cell">
                        <span>审核信息</span>
                      </div>
                    </td>
                    <td class="head-bg">
                      <div class="ivu-table-cell">
                        <span>审核结果</span>
                      </div>
                    </td>
                    <td colspan="2">
                      <div class="ivu-table-cell">
                        <RadioGroup v-model="audit.is_pass">
                          <Radio label="1">通过</Radio>
                          <Radio label="0">不通过</Radio>
                        </RadioGroup>
                      </div>
                    </td>
                    <td class="head-bg">
                      <div class="ivu-table-cell">
                        <span>审核意见</span>
                      </div>
                    </td>
                    <td colspan="2">
                      <div class="ivu-table-cell">
                        <Input v-model="audit.opinion" />
                      </div>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
        <Spin fix v-if="audit.showSpin"></Spin>
      </div>
      <div slot="footer">
        <template>
          <Button type="default" @click="closeModal('audit')">取消</Button>
          <Button type="primary" @click="auditSubmit('audit', auditData.id)" :loading="loading">提交</Button>
        </template>
      </div>
    </Modal>
    <!-- 审核模态框 end -->
    <!-- 门店/地址/联系人详情模态框 start -->
    <Modal v-model="csaModal.show" width="1000" :title="csaModal.title" :closable="false">
      <div class="rel">
        <div class="ivu-table-wrapper border-none" style="margin-top: 20px;">
          <div class="ivu-table ivu-table-samll ivu-table-border">
            <div class="ivu-table-body">
              <table cellspacing="0" cellpadding="0" border="0" width="100%">
                <tbody v-if="csaModal.label === 'store'">
                  <tr class="ivu-table-row">
                    <td class="head-bg" style="width: 80px; font-weight: bolder">
                      <div class="ivu-table-cell">
                        <span>序号</span>
                      </div>
                    </td>
                    <td class="head-bg" style="width: 170px; font-weight: bolder">
                      <div class="ivu-table-cell">
                        <span>门店名称</span>
                      </div>
                    </td>
                    <td class="head-bg" style="width: 90px; font-weight: bolder">
                      <div class="ivu-table-cell">
                        <span>省</span>
                      </div>
                    </td>
                    <td class="head-bg" style="width: 90px; font-weight: bolder">
                      <div class="ivu-table-cell">
                        <span>市</span>
                      </div>
                    </td>
                    <td class="head-bg" style="width: 90px; font-weight: bolder">
                      <div class="ivu-table-cell">
                        <span>区</span>
                      </div>
                    </td>
                    <td class="head-bg">
                      <div class="ivu-table-cell" style="font-weight: bolder">
                        <span>门店地址</span>
                      </div>
                    </td>
                    <td class="head-bg" style="width: 100px; font-weight: bolder">
                      <div class="ivu-table-cell">
                        <span>经营状态</span>
                      </div>
                    </td>
                  </tr>

                   <tr v-if="csaModal.tipis">
                     <td colspan="7">
                       <div class="ivu-table-cell">
                         <span>数据加载中...</span>
                       </div>
                     </td>
                  </tr>
                  <tr v-for="(item, index) in csaModal.storeList" :key="index" class="ivu-table-row">
                    <td>
                      <div class="ivu-table-cell">
                        <span>{{index + 1}}</span>
                      </div>
                    </td>
                    <td>
                      <div class="ivu-table-cell">
                        <span>{{item.name}}</span>
                      </div>
                    </td>
                    <td>
                      <div class="ivu-table-cell">
                        <span>{{item.province}}</span>
                      </div>
                    </td>
                    <td>
                      <div class="ivu-table-cell">
                        <span>{{item.city}}</span>
                      </div>
                    </td>
                    <td>
                      <div class="ivu-table-cell">
                        <span>{{item.county}}</span>
                      </div>
                    </td>
                    <td>
                      <div class="ivu-table-cell">
                        <span>{{item.address}}</span>
                      </div>
                    </td>
                    <td>
                      <div class="ivu-table-cell">
                        <span>{{item.manage_status === 'open' ? '在业' : '停业'}}</span>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="!csaModal.storeList.length && !csaModal.tipis">
                     <td colspan="7">
                       <div class="ivu-table-cell">
                         <span>暂无数据</span>
                       </div>
                     </td>
                  </tr>
                </tbody>
                <tbody v-else-if="csaModal.label === 'address'">
                  <tr class="ivu-table-row">
                    <td class="head-bg" style="width: 50px; font-weight: bolder">
                      <div class="ivu-table-cell">
                        <span>序号</span>
                      </div>
                    </td>
                    <td class="head-bg" style="width: 190px; font-weight: bolder">
                      <div class="ivu-table-cell">
                        <span>收货地区</span>
                      </div>
                    </td>
                    <td class="head-bg" style="width: 230px; font-weight: bolder">
                      <div class="ivu-table-cell">
                        <span>收货地址</span>
                      </div>
                    </td>
                    <td class="head-bg" style="width: 100px; font-weight: bolder">
                      <div class="ivu-table-cell">
                        <span>联系人</span>
                      </div>
                    </td>
                    <td class="head-bg" style="width: 200px; font-weight: bolder">
                      <div class="ivu-table-cell">
                        <span>联系方式</span>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="csaModal.tipis">
                     <td colspan="5">
                       <div class="ivu-table-cell">
                         <span>数据加载中...</span>
                       </div>
                     </td>
                  </tr>
                  <tr v-for="(item, index) in csaModal.addressList" :key="index" class="ivu-table-row">
                    <td>
                      <div class="ivu-table-cell">
                        <span>{{index + 1}}</span>
                      </div>
                    </td>
                    <td>
                      <div class="ivu-table-cell">
                        <span>{{item.province+item.city+item.county}}</span>
                      </div>
                    </td>
                    <td>
                      <div class="ivu-table-cell">
                        <span>{{item.receiving_address}}</span>
                      </div>
                    </td>
                    <td>
                      <div class="ivu-table-cell">
                        <span>{{item.contact}}</span>
                      </div>
                    </td>
                    <td>
                      <div class="ivu-table-cell">
                        <span>{{item.contact_information}}</span>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="!csaModal.addressList.length && !csaModal.tipis">
                     <td colspan="5">
                       <div class="ivu-table-cell">
                         <span>暂无数据</span>
                       </div>
                     </td>
                  </tr>
                </tbody>
                <tbody v-else-if="csaModal.label === 'contacts'">
                  <tr class="ivu-table-row">
                    <td class="head-bg" style="width: 60px; font-weight: bolder">
                      <div class="ivu-table-cell">
                        <span>序号</span>
                      </div>
                    </td>
                    <td class="head-bg" style="width: 150px; font-weight: bolder">
                      <div class="ivu-table-cell">
                        <span>联系人姓名</span>
                      </div>
                    </td>
                    <td class="head-bg" style="width: 180px; font-weight: bolder">
                      <div class="ivu-table-cell">
                        <span>联系人电话</span>
                      </div>
                    </td>
                    <td class="head-bg" style="width: 150px; font-weight: bolder">
                      <div class="ivu-table-cell">
                        <span>联系人职务</span>
                      </div>
                    </td>
                    <td class="head-bg" style="font-weight: bolder">
                      <div class="ivu-table-cell">
                        <span>备注</span>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="csaModal.tipis">
                     <td colspan="5">
                       <div class="ivu-table-cell">
                         <span>数据加载中...</span>
                       </div>
                     </td>
                  </tr>
                  <tr v-for="(item, index) in csaModal.contactsList" :key="index" class="ivu-table-row">
                    <td>
                      <div class="ivu-table-cell">
                        <span>{{index + 1}}</span>
                      </div>
                    </td>
                    <td>
                      <div class="ivu-table-cell">
                        <span>{{item.contactName}}</span>
                      </div>
                    </td>
                    <td>
                      <div class="ivu-table-cell">
                        <span>{{item.contactPhone}}</span>
                      </div>
                    </td>
                    <td>
                      <div class="ivu-table-cell">
                        <span>{{item.contactJob}}</span>
                      </div>
                    </td>
                    <td>
                      <div class="ivu-table-cell">
                        <span>{{item.remark}}</span>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="!csaModal.contactsList.length && !csaModal.tipis">
                     <td colspan="5">
                       <div class="ivu-table-cell">
                         <span>暂无数据</span>
                       </div>
                     </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <template>
          <Button type="primary" @click="closeCSAModal">确认</Button>
        </template>
      </div>
    </Modal>
    <!-- 门店/地址/联系人详情模态框 end -->
    <!-- 营业执照查看大图 start-->
    <Modal v-model="license.show" width="550" footer-hide>
      <!-- 占位 -->
      <div style="height:28px"></div>
      <img style="width: 100%" :src="license.url" alt="">
    </Modal>
    <!-- 营业执照查看大图 end-->
  </div>
</template>
<script>
import { SERVER_BASE_URL } from '~/api/config'
import globalMixin from '~/plugins/mixin'
import mixin from '../mixins'
export default {
  name: 'cooperative-customer',
  mixins: [globalMixin, mixin],
  data() {
    return {
      SERVER_BASE_URL,
      license: {
        show: false,
        url: ''
      },
      csaModal: {
        show: false,
        tipis: true,
        title: '',
        label: '',
        contactsList: [],
        storeList: [],
        addressList: [],
      },
      loading: false,
      canSend: true,
      // 审核
      audit: {
        show: false,
        showSpin: false, // loading加载
        is_pass: '',
        opinion: '',
      },
      auditData: {
        companyInfo: {},
        contractsInfo: []
      },
      // 商务分配
      distribution: {
        formData: {
          id: '',
          followIds: [],
          name: '',
          merchantName: '',
        },
        loading: false,
        show: false,
      },
      employeList: [],
      // 收回
      takeBack: {
        rule: {
          reason: [{ required: true, message: '收回理由不能为空', trigger: 'blur' }],
        },
        formData: {
          reason: '',
        },
        show: false,
      },
      cooperationSet: {
        rule: {
          cooperateType: [{required: true, message: '客户状态不能为空', trigger: 'change'}],
          reason: [{required: true, message: '理由不能为空', trigger: 'blur'}]
        },
        show: false,
        formData: {
          cooperateType: '',
          reason: '',
        }
      },
      checkList: [],
      createDate: [],
      formData: {
        ownership: 'company'
      },
      loadingTable: false,
      listData: {
        columns: [
          { type: 'selection', width: 60, align: 'center' },
          {
            key: 'merchantName',
            title: '公司名称',
            minWidth: 200,
            align: 'center',
            render: (h, params) => {
              let merchant = params.row
              if(merchant.parentContractorId == 0) {
                return h(
                  'a',
                  {
                    on: {
                      click: () => {
                        this.$router.push({
                          path: '/contract/cooperative-customer/cooperative-detail',
                          query: { id: merchant.id },
                        })
                      },
                    },
                  },
                  merchant.merchantName)
              }
              return h(
                'div',
                [h('a',{
                  on: {
                    click: () => {
                      this.$router.push({
                        path: '/contract/cooperative-customer/cooperative-detail',
                        query: { id: merchant.id },
                      })
                    },
                  }
                }, merchant.merchantName),
                h('p', {
                  style: {
                    color: 'green',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: 0,
                    height: 0,
                    borderTop: '10px solid red',
                    borderRight: '10px solid transparent'
                  }
                },'')
                ]
              )
            },
          },
          {
            key: 'systemName',
            title: '系统/门店名称',
            minWidth: 200,
            align: 'center',
            className: 'p-0',
            render: (h, params) => {
              const systemInfo = params.row.systemInfo
              const nameArr = systemInfo.reduce((acc, item, index, arr) => acc.concat(h('p', item.name)), [])
              return h('div', nameArr)
            }
          },
          {
            key: 'merchantType',
            title: '客户类型',
            minWidth: 100,
            align: 'center',
            render: (h, params) => h('span', this.formatMerchantType(params.row.merchantType))
          },
          {
            title: '合作品牌',
            minWidth: 100,
            align: 'center',
            render: (h,params) => {
              let brand = params.row.coBrand,
                  arr = []
              if(brand === '') return h('span', '');
              arr = brand.split(',')
              if(arr.length > 1) {
                return h('span', 'WIS、KONO');
              } else if(arr[0] === 'wis') {
                return h('span', 'WIS')
              } else if(arr[0] === 'kono') {
                return h('span', 'KONO')
              }
            }
          },
          { key: 'followBy', title: '商务负责人', minWidth: 150, align: 'center' },
          {
            title: '审核状态',
            minWidth: 100,
            align: 'center',
            render: (h, params) => {
              let { status } = params.row
              return status ?
                      h('span', this.auditStatusList[status].label) :
                      h('span', '')
            },
          },
          {
            title: '客户状态',
            minWidth: 100,
            align: 'center',
            render: (h,params) => {
              let type = params.row.cooperateType
              if(type === 'normal') {
                return h('span', '正常合作');
              } else if (type === 'stop') {
                return h('span', '停止合作');
              } else if (type === 'silent') {
                return h('span', '静默');
              }
            }
          },
          { key: 'action', title: '操作', align: 'center', minWidth: 100, slot: 'action' },
        ],
        data: [],
      },
      // 列表分页属性
      pageProps: {
        page: 1,
        perPage: 10,
        currentPage: 1,
        totalCount: 0,
      },
      // 审核状态
      auditStatusList: {
        auditPending: { value: 'auditPending', label: '待审核' },
        auditPass: { value: 'auditPass', label: '审核通过' },
        auditFailure: { value: 'auditFailure', label: '审核不通过' },
      },
      // 是否分配
      isAllocated: [
        { value: 'yes', label: '已分配' },
        { value: 'no', label: '待分配' },
      ],
      searchEmployeDeb: this.$debonce(this.searchEmploye, 500)
    }
  },
  methods: {
    // 选择日期
    selectDate(date) {
      if (date[0] === '' && date[1] === '') {
        this.createDate = []
        return
      }
      date[0] = date[0].trim() + ' 00:00:00'
      date[1] = date[1].trim() + ' 23:59:59'
      this.createDate = date
    },

    // 关闭模态框
    closeModal(modal) {
      if (typeof this[modal] === 'boolean') {
        this[modal] = false
        return
      }
      this[modal].show = false
    },

    // 远程搜索
    searchEmploye(username) {
      this.distribution.loading = true
      this.$api.user({ username }).then((res) => {
        const employeList = this.employeList,
          selectedIds = [ ...new Set(employeList.map((item) => item.selected ? item.id : null)) ] // 已选中的选项的id
        this.employeList = [ ...employeList.filter(item => selectedIds.includes(item.id)), ...res.items.filter(item => !selectedIds.includes(item.id)) ]
        this.distribution.loading = false
      })
    },

    // 选中搜索的员工
    selectEmploye(value) {
      this.employeList.forEach(item => item.selected = value.includes(item.id)) // 给选中项打上标记
      this.distribution.formData.followIds = value
    },

    // 收回
    handleTakeBack() {
      // 只在有负责人的情况下可以收回
      if (!this.hasChecked()) return
      if (this.checkList[0].followBy === '') return this.$Message.warning('该数据无负责人，无法收回')
      this.$refs.takeBack.resetFields()
      this.takeBack.show = true
    },

    // 商务分配
    handleDistribution() {
      if (this.hasChecked()) {
        let [ { id, merchantName, followInfo = {} } ] = this.checkList
        this.employeList = followInfo.userInfo
        this.distribution.formData.id = id
        this.distribution.formData.merchantName = merchantName
        this.distribution.formData.followIds = followInfo.ids
        this.distribution.show = true
      }
    },

    // 审核
    handleAudit() {
      if (this.hasChecked()) {
        let id = this.checkList[0].id
        this.auditData = {
          companyInfo: {},
          contractsInfo: []
        }
        this.audit.is_pass = ''
        this.audit.opinion = ''
        this.audit.showSpin = true
        this.audit.show = true
        this.$api.cooperativeCustomerDeatil({id}).then((res) => {
          if(res.code === 0) {
            res.data.contractsInfo = res.data.contractsInfo || []
            this.auditData = res.data
          }
        })
        .finally(() => {
          this.audit.showSpin = false
        })
      }
    },

    // 合作设置
    handleSetCooperating() {
      if (this.hasChecked()) {
        this.cooperationSet.formData.cooperateType = this.checkList[0].cooperateType
        this.cooperationSet.formData.reason = ''
        this.cooperationSet.show = true
      }
    },

    // 确认 - 合作设置
    confirmCooperationSet(name) {
      this.$refs[name].validate((valid) => {
        if(valid) {
          this.loading = true
          let id = this.checkList[0].id
          let { cooperateType, reason } = this[name].formData
          this.$api.cooperativeCustomerSetting({id, cooperateType, reason}).then((res) => {
            if (res.code === 0) {
              this.$Message.success('操作成功')
              this.loading = false
              this.cooperationSet.show = false
              this.getList()
            }
          })
          .catch((err) => {
            this.$Message.error(err.message)
            this.loading = false
          })
        }
      })
    },

    // 确认 - 商务分配
    confirmDistribution() {
      const { id, followIds } = this.distribution.formData
      if (!followIds.length) return this.$Message.warning('请选择需要分配的员工')
      this.loading = true
      this.$api.cooperativeCustomerAssign({ id, followIds })
        .then((res) => {
          if (res.code === 0) {
            this.$Message.success('分配成功')
            this.closeModal('distribution')
            this.getList()
          }
        })
        .finally(() => {
          this.loading = false
        })
    },

    // 确认 - 收回
    confirmTakeBack(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.loading = true
          let id = this.checkList[0].id
          let { reason } = this.takeBack.formData
          this.$api.cooperativeCustomerRevoke({id, reason}).then((res) => {
            if (res.code === 0) {
              this.$Message.success('收回成功')
              this.loading = false
              this.closeModal('takeBack')
              this.getList()
            }
          })
          .catch((err) => {
            this.$Message.error(err.message)
            this.loading = false
          })
        }
      })
    },

    // 确认 - 审核
    auditSubmit(name, id) {
      this.loading = true
      let {is_pass, opinion} = this.audit
      if(is_pass && opinion) {
        if(opinion.length > 200) {
          this.$Message.warning('审核意见不能超过200字符')
          this.loading = false
          return
        }
        this.$api.cooperativeCustomerAudit({id, is_pass, opinion}).then((res) => {
          if(res.code === 0) {
            this.$Message.success('操作成功')
            this.loading = false
            this.audit.show = false
            this.getList()
          }
        })
        .catch(err => {
          this.$Notice.error({
            title: err.code,
            desc: err.message
          })
          this.loading = false
        })
      } else {
        this.$Message.warning('审核结果和审核意见为必填项')
        this.loading = false
        return
      }
    },

    // 是否选中
    hasChecked() {
      if (this.checkList.length === 0) {
        this.$Message.warning('请选择！')
        return false
      }
      if (this.checkList.length !== 1) {
        this.$Message.warning('只能选择一条！')
        return false
      } else {
        return true
      }
    },

    // 更多 - 显示门店/地址/联系人详情
    showCSAModal(label, id, perPage) {
      this.csaModal.tipis = true
      this.csaModal.label = label
      this.csaModal.title =
        label === 'contacts' ? '联系人信息' : label === 'store' ? '门店信息' : label === 'address' ? '收货信息' : ''
      this.csaModal.show = true
      if(label === 'contacts') {
        this.$api.cooperativeContactsList({contractorId: id, perPage, page: 1}).then((res) => {
          if (res.code === 0) {
            this.csaModal.contactsList = res.data.list
          }
          this.csaModal.tipis = false
        })
      } else if(label === 'address') {
        this.$api.contractorTabAddress({contractor_id: id, perPage, page: 1}).then((res) => {
          this.csaModal.addressList = res.items
          this.csaModal.tipis = false
        })
      } else if(label === 'store') {
        this.$api.contractorTabShopInfo({contractor_id: id, perPage, page: 1}).then((res) => {
          if (res.code === 0) {
            this.csaModal.storeList = res.data.list
          }
          this.csaModal.tipis = false
        })
      }
    },

    // 关闭更多 - 显示门店/地址/联系人详情
    closeCSAModal() {
      this.csaModal.show = false
      this.csaModal.storeList = []
      this.csaModal.addressList = []
      this.csaModal.contactsList = []
    },

    // 查看营业执照
    showLicense(url) {
      this.license.show = true,
      this.license.url = url
    },

    // 跳转添加/编辑页面
    handleEdit(id) {
      if (id === 'add') {
        this.$router.push('/contract/cooperative-customer/cooperative-edit')
        return
      }
      this.$router.push({
        path: '/contract/cooperative-customer/cooperative-edit',
        query: {
          id,
        },
      })
    },

    // 改变页码
    changePage(e) {
      this.pageProps.page = e
      this.getList()
    },

    // 改变页数
    changePageSize(e) {
      this.pageProps.perPage = e
      this.getList()
    },

    getList(type = '') {
      let params = JSON.parse(JSON.stringify(this.formData))
      params.page = type ? 1 : this.pageProps.page
      params.perPage = this.pageProps.perPage
      this.loadingTable = true
      this.$api.cooperativeCustomerList(params).then((res) => {
        if (res.code === 0) {
          let data = res.data
          this.listData.data = data.list
          this.pageProps.totalCount = data.totalCount
          this.pageProps.currentPage = data.currentPage
          this.formData.ownership = data.ownership
          this.handleValidateDataPermissionRange(this, 'isGetDataPermissionRange', 'dataPermissionRange', data.ownership)
        }
      })
      .finally(() => {
        this.checkList = []
        this.loadingTable = false
      })
    },

    formatDate(time, type) {
      let format = type || 'yyyy-MM-dd'
      return this.$format(time, format)
    },

    /**
     * 列表点击信息
     * @param {Object} selection：用户信息
     */
    selectCheck(selection) {
      this.checkList = selection
    },

    handleDelete(id) {
      this.$Modal.confirm({
        title: '确认删除',
        content: '删除合作客户将同时删除关联的门店和联系人',
        loading: true,
        onOk: () => {
          this.$api.cooperativeCustomerDelete({ id }).then((res) => {
            if (res.code === 0) {
              this.$Message.success('删除成功')
              this.getList()
            }
          })
          .catch((err) => {
            this.$Notice.error({
              title: err.code,
              desc: err.message
            })
          })
          .finally(() => {
            this.$Modal.remove()
          })
        }
      })
    },

    formatPaymentMethod(method) {
      if(method === 'monthly') {
        return '月结'
      } else if(method === 'spotCash') {
        return '现款现货'
      } else if(method === 'realSale') {
        return '实销实结'
      }
    },

    formatDate(time, type) {
      type = type || 'yyyy-MM-dd'
      // 格式化时间
      return this.$format(time, type)
    },
  },
  activated() {
    this.getList()
  },

  // watch: {
  //   $route: {
  //     deep: true,
  //     handler: function(newVal, oldVal) {
  //       if (oldVal.name == newVal.name && Object.keys(newVal.query)) {
  //         this.formData = {}
  //         this.getList()
  //       }
  //     },
  //   },
  // },
}
</script>
<style lang="less" scoped>
/deep/ .ivu-form {
  .ivu-form-item-label {
    padding-right: 1px;
  }
}

.ivu-card-head .date-picker,
.ivu-card-head .ivu-date-picker-editor {
  width: 200px;
}

.take-back-title {
  padding: 20px 0;
  font-size: 24px;
  font-weight: bold;
  color: black;
}

.detail-table {
  text-align: center;
  border-collapse: collapse;
  tr {
    td {
      border: 1px #dcdee2 solid;
      height: 45px;
      width: 127px;
      padding: 0 10px;
    }
  }
}

.td-title {
  background: #f8f8f9;
}
.modal-div {
  overflow-y: scroll;
  height: 420px;
}
.td-div {
  display: -webkit-box; /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
  display: -moz-box; /* 老版本语法: Firefox (buggy) */
  display: -ms-flexbox; /* 混合版本语法: IE 10 */
  display: -webkit-flex; /* 新版本语法: Chrome 21+ */
  display: flex; /* 新版本语法: Opera 12.1, Firefox 22+ */
  width: 100%;
  div {
    padding: 5px 0;
    line-height: 33px;
  }
}
.td-div-title {
  background: #f8f8f9;
  width: 127px;
  border-right: 1px #dcdee2 solid;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.td-div-content {
  width: 100%;
}
.td-div-border {
  border-bottom: 1px #dcdee2 solid;
}
.td-div-border:last-child {
  border-bottom: none;
}
.file-list {
  display: inline;
  margin: 10px 0;
  padding: 0 15px;
  box-sizing: border-box;
}

/deep/ .ivu-table-wrapper {
  .ivu-table {
    .w-300 {
      width: 300px;
    }
  }
}

/deep/ .ivu-table-cell {
  padding-left: 8px;
  padding-right: 8px;
}

/deep/ .ivu-table-wrapper .ivu-table td {
  position: relative;
}

.border-none {
  border-bottom: 0;
  border-right: 0;
}

.break-up {
  display: inline-block;
}

.break-up::after {
  content: '，';
}

.break-up:last-child::after,
.break-up:only-child::after {
  content: '';
}

.mb-5 {
  margin-bottom: 5px;
}

/deep/ .p-0 .ivu-table-cell {
  padding: 0;
  p {
    padding: 8px;
    border-bottom: 1px solid #e8eaec;
    &:last-of-type {
      border-bottom: 0;
    }
  }
}

.ivu-select-multiple {
  text-align: left;
}
</style>
