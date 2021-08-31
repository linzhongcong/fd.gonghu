<template>
  <div>
    <Card>
      <Row slot="title" @keydown.native.enter.prevent="getSearch">
        <Col :sm="24">
          <Form ref="search" :model="search" class="search" :rules="rulesForm">
            <Col>
              <FormItem prop="ownership">
                <!-- <Select v-model="search.ownership" clearable placeholder="所有权" @on-change="getSearch">
                  <Option v-for="item in ownershipList" :value="item.value" :key="'ownershipList:'+item.value"
                          :label="item.label"></Option>
                </Select> -->
                <Select v-if="isTabValus === 'partners'" v-model="search.ownership" placeholder="数据权限范围" @on-change="getSearch">
                  <Option v-for="(item, index) in dataPermissionRange" :value="item.value" :label="item.label" :key="'dataPer' + index"></Option>
                </Select>
              </FormItem>
              <FormItem prop="salesman">
                <Input v-model="search.salesman" placeholder="业务员" clearable></Input>
              </FormItem>
              <FormItem prop="merchant_name">
                <Input v-model="search.merchant_name" placeholder="商家" clearable></Input>
              </FormItem>
              <FormItem prop="merchant_type">
                <Select v-model="search.merchant_type" placeholder="商家类型" clearable @on-change="getSearch">
                  <Option v-for="item in businessType" :key="'businessType'+item.value" :value="item.value"
                          :label="item.label"></Option>
                </Select>
              </FormItem>
              <FormItem prop="status">
                <Select v-model="search.status" placeholder="审核状态" clearable @on-change="getSearch">
                  <Option v-for="item in statusList" :key="'statusList'+item.value" :value="item.value"
                          :label="item.label"></Option>
                </Select>
              </FormItem>
              <FormItem v-if="makeType === false" >
                <DatePicker type="daterange" placement="bottom-end" placeholder="请选择创建日期" v-model="createDate" @on-change="dateSelect" class="partner-date" ></DatePicker>
              </FormItem>
              <FormItem style="float:right">
                <Col span="12">
                  <Button type="primary" icon="ios-search" @click="getSearch" style="padding: 4px 15px">查询
                  </Button>
                </Col>
                <Col span="12">
                  <Button type="default" icon="md-repeat" @click="handleReset('search')" style="padding: 4px 15px">重置
                  </Button>
                </Col>
              </FormItem>
            </Col>
          </Form>
        </Col>
        <Col :sm="24">
          <router-link to="/contract/partner-management-edit" v-if="makeType === false" >
            <Button type="primary" v-permission="'/v2/contractor/create'">添加</Button>
          </router-link>
          <Button 
            type="primary" 
            @click="postAudit"
            :style="{'display': handleUserHasPermission(isTabValus === 'partners' ? '/v1/contractor-management/audit' : '/v1/contractor-management/facade-audit') ? '' : 'none'}">
            审核
          </Button>
          <Button type="primary" @click="packingExport" v-if="makeType === false" v-permission="'/v1/contractor-management/contractor-export'">导出当前excel</Button>
          <Upload name="UploadForm[excel]" :action="fileUploadURL" :format="['xlsx']" :headers="fileUploadHeaders"
                  :show-upload-list="false"
                  :max-size="51200"
                  :on-success="importSuccess"
                  :on-progress="importProgress"
                  :on-exceeded-size="fileMaxSize"
                  :on-format-error="fileFormatError"
                  style="margin-left:1px;display:inline-block">
            <Button type="primary" v-if="makeType === false" v-permission="'/v1/contractor-management/contractor-import'">导入当前excel</Button>
          </Upload>
          <Progress v-show="isShowProgress" :percent="percentProgress"></Progress>
        </Col>
      </Row>
      <Tabs v-model="isTabValus" @on-click="makeClick">
        <TabPane label="合作商列表" name="partners">
          <Table border highlight-row :columns="partnerColumns" :data="partnerData" @on-selection-change="selectCheck"
               :loading="loading" size="small" ref="partnerSelect">
          <!-- 操作 -->
            <template slot-scope="{ row }" slot="action">
              <Tooltip placement="top" content="编辑" transfer>
                <Button type="primary" size="small" @click="handleEdit(row.id)" v-permission="'/v2/contractor/update'">
                  <Icon type="md-create"/>
                </Button>
              </Tooltip>
              <Poptip confirm title="您确认删除这条内容吗？" @on-ok="handleDelete(row.id)" transfer>
                <Button size="small"
                        :disabled="row.status === 'ContractorWorkflow/auditPass' || row.status === 'ContractorWorkflow/auditFailure'"
                        v-permission="'/v1/contractor-management/delete'">
                  <Icon type="md-trash"/>
                </Button>
              </Poptip>
            </template>
          </Table>
         <div style="margin: 10px;overflow: hidden">
            <div class="pages-L">共 {{pageProps.totalCount}} 条</div>
            <div style="float: right;">
              <Page :total="pageProps.totalCount" size="small" :current="pageProps.page" show-sizer show-elevator
                    @on-change="changePage" @on-page-size-change="changePageSize"></Page>
            </div>
          </div> 
        </TabPane>
        <TabPane label="门店补录" name="store" >
          <Table
            border ref="storeSelect" @on-selection-change="selectStore"
            :loading="loading"
            :columns="storeData.columns"
            :data="storeData.list">
            <!-- 审核状态 -->
            <!-- <template slot-scope="{ row }" slot="audit">
              <text v-if="row.status === 'auditPending'">待审核</text>
              <text v-else-if="row.status === 'auditPass'">审核通过</text>
              <text v-else>审核失败</text>
            </template> -->
            <!-- 操作 -->
            <template slot-scope="{ row }" slot="action">
              <Poptip confirm title="您确认删除这条内容吗？" @on-ok="isDelStore(row.id)" transfer>
                <Button size="small"
                        :disabled="row.status === 'ContractorWorkflow/auditPass' || row.status === 'ContractorWorkflow/auditFailure'"
                        v-permission="'/v1/contractor-management/facade-delete'">
                  <Icon type="md-trash"/>
                </Button>
              </Poptip>
            </template>
          </Table>
          <div style="margin: 10px;overflow: hidden">
            <div class="pages-L">共 {{ storeData.count }} 条</div>
            <div style="float: right;">
              <Page :total="storeData.count" size="small" :current="storeData.page" show-sizer show-elevator
                    @on-change="changeStorePage" @on-page-size-change="changeStorePageSize"></Page>
            </div>
          </div>
        </TabPane>
      </Tabs>
    </Card>

    <!-- 详情 start -->
    <Modal :title="modal.title" v-model="partnerDetail.modal" width="900">
      <div class="rel">
        <div class="ivu-table-wrapper" style="margin-top: 20px;">
          <div class="ivu-table ivu-table-samll ivu-table-border">
            <div class="ivu-table-body">
              <table cellspacing="0" cellpadding="0" border="0" width="100%">
                <tbody>
                <tr class="ivu-table-row">
                  <td class="head-bg" rowspan="5">
                    <div class="ivu-table-cell">
                      <span>基本信息</span>
                    </div>
                  </td>
                  <td class="head-bg">
                    <div class="ivu-table-cell">
                      <span>创建人</span>
                    </div>
                  </td>
                  <td>
                    <div class="ivu-table-cell">
                      <span v-text="partnerDetail.data.created_by"></span>
                    </div>
                  </td>
                  <td class="head-bg">
                    <div class="ivu-table-cell">
                      <span>创建时间</span>
                    </div>
                  </td>
                  <td>
                    <div class="ivu-table-cell">
                      <span v-text="this.formatDate(partnerDetail.data.created_at)"></span>
                    </div>
                  </td>
                  <td class="head-bg">
                    <div class="ivu-table-cell">
                      <span>业务员</span>
                    </div>
                  </td>
                  <td>
                    <div class="ivu-table-cell">
                      <span v-text="partnerDetail.data.salesman"></span>
                    </div>
                  </td>
                </tr>
                <tr class="ivu-table-row">
                  <td class="head-bg">
                    <div class="ivu-table-cell">
                      <span>联系人姓名</span>
                    </div>
                  </td>
                  <td>
                    <div class="ivu-table-cell">
                      <span v-text="partnerDetail.data.contact_name"></span>
                    </div>
                  </td>
                  <td class="head-bg">
                    <div class="ivu-table-cell">
                      <span>联系电话</span>
                    </div>
                  </td>
                  <td>
                    <div class="ivu-table-cell">
                      <span v-text="partnerDetail.data.contact_phone"></span>
                    </div>
                  </td>
                  <td class="head-bg">
                    <div class="ivu-table-cell">
                      <span>商家类型</span>
                    </div>
                  </td>
                  <td>
                    <div class="ivu-table-cell">
                      <span v-text="this.businessList(partnerDetail.data.merchant_type)"></span>
                    </div>
                  </td>
                </tr>
                <tr class="ivu-table-row">
                  <td class="head-bg">
                    <div class="ivu-table-cell">
                      <span>合同签约日期</span>
                    </div>
                  </td>
                  <td>
                    <div class="ivu-table-cell">
                      <span v-text="this.formatDate(partnerDetail.data.begin_at)"></span>
                    </div>
                  </td>
                  <td class="head-bg">
                    <div class="ivu-table-cell">
                      <span>合同到期日期</span>
                    </div>
                  </td>
                  <td>
                    <div class="ivu-table-cell">
                      <span v-text="this.formatDate(partnerDetail.data.end_at)"></span>
                    </div>
                  </td>
                  <td class="head-bg">
                    <div class="ivu-table-cell">
                      <span>开始合作日期</span>
                    </div>
                  </td>
                  <td>
                    <div class="ivu-table-cell">
                      <span v-text="this.formatDate(partnerDetail.data.cooperate_start_at)"></span>
                    </div>
                  </td>
                </tr>
                <tr class="ivu-table-row">
                  <td class="head-bg">
                    <div class="ivu-table-cell">
                      <span>合同地址</span>
                    </div>
                  </td>
                  <td colspan="5">
                    <div class="ivu-table-cell text-align-left">
                      <span v-text="partnerDetail.data.contract_addr"></span>
                    </div>
                  </td>
                </tr>
                   <tr class="ivu-table-row">
                  <td class="head-bg">
                    <div class="ivu-table-cell">
                      <span>营业执照</span>
                    </div>
                  </td>
                  <td colspan="5">
                    <div class="ivu-table-cell">
                      <div class="upload-list"  v-for="(item,index) in partnerDetail.data.businessLicense" :key="index">
                			<template >
                          <img :src="item.url_show" style="width:60px;height:60px;object-fit:cover">
                          <div class="upload-list-cover">
                              <Icon type="ios-eye-outline" @click.native="handleView(item,index)"></Icon>
                          </div>
                      </template>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr class="ivu-table-row" v-if="partnerDetail.data.shopAddr">
                  <td class="head-bg"
                      :rowspan="Number(partnerDetail.data.shopAddr.length) + Number(partnerDetail.data.contractorReceivingAddrGroup.length) + 1">
                    <div class="ivu-table-cell">
                      <span>门店信息</span>
                    </div>
                  </td>
                <tr class="ivu-table-row" v-for="(item, index3) in partnerDetail.data.shopAddr"
                    :key="'shopAddr'+index3">
                  <td class="head-bg">
                    <div class="ivu-table-cell">
                      <span>门店名称</span>
                    </div>
                  </td>
                  <td>
                    <div class="ivu-table-cell">
                      <span v-text="item.name"></span>
                    </div>
                  </td>
                  <td v-if="partnerDetail.data.shopAddr && item.address" colspan="4"
                      style="text-align:left;padding:0px">
                    <div class="ivu-table-row partnerDetailAddress" v-for="(address, addIndex) in item.address"
                         :key="addIndex" style="display:flex;">
                         <div class="head-bg" style="display: flex;">
                          <div class="ivu-table-cell " style="display: flex;align-items: center;width:120px;justify-content: center;">
                            <span>门店地址</span>
                          </div>
                      </div>
                      <div class="head-bgs">
                        <div class="ivu-table-cell text-align-left" >
                          <span v-text="address.addr"  style="word-wrap: break-word;word-break: normal;"></span>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                <template v-if="partnerDetail.data.contractorReceivingAddrGroup">
                  <tr class="ivu-table-row" v-for="(item1, index) in partnerDetail.data.contractorReceivingAddrGroup"
                      :key="'contractorReceivingAddrGroup'+index">
                    <td class="head-bg">
                      <div class="ivu-table-cell">
                        <span>收货地址</span>
                      </div>
                    </td>
                    <td colspan="5">
                      <div class="ivu-table-cell  text-align-left">
                        <!-- <span v-text="item1.receiving_address"></span> -->
                        <span v-text="item1.new_receiving_address"></span>
                      </div>
                    </td>
                  </tr>
                </template>
                <tr class="ivu-table-row">
                  <td class="head-bg" rowspan="2">
                    <div class="ivu-table-cell">
                      <span>政策信息</span>
                    </div>
                  </td>
                  <td class="head-bg">
                    <div class="ivu-table-cell">
                      <span>合同政策</span>
                    </div>
                  </td>
                  <td colspan="2">
                    <div class="ivu-table-cell">
                      <span v-text="partnerDetail.data.partner_policy_name"></span>
                    </div>
                  </td>
                  <td class="head-bg">
                    <div class="ivu-table-cell">
                      <span>合作方式</span>
                    </div>
                  </td>
                  <td colspan="2">
                    <div class="ivu-table-cell">
                      <span v-text="this.paymentType(partnerDetail.data.payment_method)"></span>
                    </div>
                  </td>
                </tr>
                <tr class="ivu-table-row">
                  <td class="head-bg">
                    <div class="ivu-table-cell">
                      <span>账期</span>
                    </div>
                  </td>
                  <td colspan="2">
                    <div class="ivu-table-cell">
                      <span v-text="partnerDetail.data.payment_days"></span>
                    </div>
                  </td>
                  <td class="head-bg">
                    <div class="ivu-table-cell">
                      <span>结账日</span>
                    </div>
                  </td>
                  <td colspan="2">
                    <div class="ivu-table-cell">
                      <span v-text="partnerDetail.data.payment_at"></span>
                    </div>
                  </td>
                </tr>
                <tr class="ivu-table-row">
                  <td class="head-bg" rowspan="3">
                    <div class="ivu-table-cell">
                      <span>审核信息</span>
                    </div>
                  </td>
                  <tr class="ivu-table-row">
                  <td class="head-bg">
                    <div class="ivu-table-cell">
                      <span>审核结果</span>
                    </div>
                  </td>
                  <td colspan="2">
                    <div class="ivu-table-cell" v-if="openStatus">
                      <span
                      v-text="!partnerDetail.data.audit_pass ? '' : (partnerDetail.data.audit_pass === '1'? '审核通过' : '审核不通过')"></span>
                    </div>
                    <div class="ivu-table-cell" v-else>
                      <RadioGroup v-model="partnerDetail.data.is_pass">
                        <Radio label="1">是</Radio>
                        <Radio label="0">否</Radio>
                      </RadioGroup>
                    </div>
                  </td>
                   <td class="head-bg">
                    <div class="ivu-table-cell">
                      <span>审核意见</span>
                    </div>
                  </td>
                  <td colspan="2">
                    <div class="ivu-table-cell" v-if="openStatus">
                      <span v-text="partnerDetail.data.opinion"></span>
                    </div>
                    <div class="ivu-table-cell" v-else>
                      <Input v-model="partnerDetail.data.opinion"  @keydown.native.enter.prevent="auditItem"></Input>
                    </div>
                  </td>
                </tr>
                <tr class="ivu-table-row">
                  <td class="head-bg" >
                    <div class="ivu-table-cell">
                      <span>备注</span>
                    </div>
                  </td>
                  <td colspan="5">
                    <div class="ivu-table-cell">
                      <span v-text="partnerDetail.data.remark"></span>
                    </div>
                  </td>
                </tr>
                <tr class="ivu-table-row">
                  <td class="head-bg" rowspan="1">
                    <div class="ivu-table-cell">
                      <span>附件</span>
                    </div>
                  </td>
                  <td colspan="6">
                    <div class="ivu-table-cell">
                      <a v-for="(item2, index2) in partnerDetail.data.fileItems" :key="'fileItems'+index2"
                         target="_blank" :href="item2.downLoadHref">
                        {{item2.title+'.'+ item2.extension}} ;
                      </a>
                    </div>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <Spin v-if="partnerDetail.loading" fix></Spin>
      </div>
      <div slot="footer">
        <template v-if="modalType === 'audit'">
          <Button type="default" @click="closeModal('partnerDetail')">取消</Button>
          <Button type="primary" @click="auditItem" :loading="partnerDetail.btnloading">提交</Button>
        </template>
        <template v-else>
          <Button type="default" @click="closeModal('partnerDetail')">关闭</Button>
        </template>
      </div>
    </Modal>

    <!-- 门店补录审核弹窗 -->
    <Modal title="审核" v-model="storeData.modalType" width="900" @on-ok="subStoreAudit">
      <div class="rel">
        <div class="ivu-table-wrapper">
          <div class="ivu-table ivu-table-samll ivu-table-border">
            <div class="ivu-table-body">
              <table cellspacing="0" cellpadding="0" border="0" width="100%">
                <tbody>
                  <tr class="ivu-table-row" >
                    <td class="head-bg">商家名称</td>
                    <td><span v-text="storeData.checkData.merchant_name" ></span></td>
                    <td class="head-bg">商家联系人</td>
                    <td><span v-text="storeData.checkData.contact_name" ></span></td>
                    <td class="head-bg">联系电话</td>
                    <td><span v-text="storeData.checkData.contact_phone" ></span></td>
                  </tr>
                  <tr class="ivu-table-row">
                    <td class="head-bg">门店名称</td>
                    <td><span v-text="storeData.checkData.name" ></span></td>
                    <td class="head-bg">门店地址</td>
                    <td colspan="3"><span v-text="storeData.checkData.address"></span></td>
                  </tr>
                  <tr class="ivu-table-row">
                    <td class="head-bg">业务员</td>
                    <td><span v-text="storeData.checkData.created_by" ></span></td>
                    <td class="head-bg">创建时间</td>
                    <td colspan="3"><span v-text="this.formatDate(this.storeData.checkData.created_at)" ></span></td>
                  </tr>
                  <tr class="ivu-table-row">
                    <td class="head-bg">审核结果</td>
                    <td colspan="5">
                      <RadioGroup v-model="storeData.is_pass" >
                        <Radio label="1">
                            <span>通过</span>
                        </Radio>
                        <Radio label="0">
                            <span>不通过</span>
                        </Radio>
                      </RadioGroup>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Modal>
    <!-- 图片预览 -->
    <Modal v-model="imgModel.showBusinessLicenseImg">
          <img :src="imgModel.showBusinessLicenseImgUrl " v-if="imgModel.showBusinessLicenseImg" style="width: 100%">
    </Modal>
  </div>
</template>

<script>
  import Cookies from 'js-cookie'
  import {SERVER_BASE_URL} from '~/api/config';
  import globalMixin from '~/plugins/mixin'

  export default {
    name: 'partner',
    mixins: [globalMixin],
    data() {
      return {
        userPermissionsList: '', // 用户操作权限
        imgModel:{
          showBusinessLicenseImgUrl:'',
          showBusinessLicenseImg:false
        },
        isTabValus: 'partners',
        modalType: '', // 详情弹窗类型
        logTabs: 'details',
        // 详情弹窗id
        detailId: '',
        // 查询用户列表
        userList: [],
        // 列表点击的信息
        checkList: [],
        fileUploadURL: `${SERVER_BASE_URL}/v1/contractor-management/contractor-import`,
        fileUploadHeaders: {
          Authorization: Cookies.get('authorization')
        },
        // 审核状态转化
        statusList: [
          {value: 'auditPending', label: '待审核'},
          {value: 'auditPass', label: '审核通过'},
          {value: 'auditFailure', label: '审核不通过'}
        ],
        // 表单搜索
        search: {
          ownership: 'company'
        },
        // 所有权数据 - 无用可删
        // ownershipList: [
        //   {value: 'company', label: '公司所有权'},
        //   {value: 'department', label: '部门所有权'},
        //   {value: 'self', label: '个人所有权'}
        // ],
        loading: false,
        // 详情、审核、复审弹窗
        modal: {
          title: '',
          status: ''
        },
        // 详情弹窗
        detailsList: {
          modal: false,
          data: [],
          loading: true,
          remark: '',
          cancelOrder: [
            {type: 'index', title: '序号', align: 'center'},
            {key: 'created_by', title: '撤单人', align: 'center'},
            {
              key: 'created_at',
              title: '撤单日期',
              align: 'center',
              render: (h, params) => {
                return h('div', this.formatDate(params.row.created_at));
              }
            },
            {key: 'opinion', title: '撤单原因', align: 'center'}
          ],
          deliveryItems: [
            {type: 'index', title: '序号', align: 'center'},
            {key: 'arrival_depot', title: '到货仓库', align: 'center'},
            {key: 'arrival', title: '到货数量', align: 'center'},
            {
              key: 'arrival_at',
              title: '回复交期',
              align: 'center',
              render: (h, params) => {
                return h('div', this.formatDate(params.row.arrival_at));
              }
            },
            {key: 'remark', title: '回复交期备注', align: 'center'}
          ],
          cancelData: []
        },
        // 审核
        auditList: {},
        // 商家类型
        businessType: [
          {value: 'cs', label: 'CS'},
          {value: 'ka', label: 'KA'},
          {value: 'otc', label: 'OTC'},
          {value: 'store', label: '便利店'},
          {value: 'other', label: '其他'}
        ],
        // 列表分页属性
        pageProps: {
          page: 1,
          perPage: 10,
          currentPage: 1,
          totalCount: 0
        },
        // 列表数据
        partnerData: [],
        // 列表字段
        partnerColumns: [
          {type: 'selection', width: 65, align: 'center', 'fixed': 'left'},
          {
            title: '序号',
            key: 'index',
            width: 65,
            align: 'center',
            render: (h, params) => {
              return h('div', {
                attrs: {
                  class: params.row.product_type === '1' ? 'new' : ''
                }
              }, params.index + 1);
            }
          },
          {
            title: '商家名称',
            key: 'merchantName',
            minWidth: 200,
            align: 'center',
            sortable: true,
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    // this.viewDetails(params.row.id);
                    this.$router.push({
                      path: '/contract/partner-management-detail',
                      query: {id: params.row.id}
                    })
                  }
                }
              }, params.row.merchantName);
            }
          },
          {title: '联系人', key: 'contactName', minWidth: 100, align: 'center', sortable: true},
          {title: '联系电话', key: 'contactPhone', minWidth: 120, align: 'center', sortable: true},
          {title: '政策名称', key: 'partnerPolicyName', minWidth: 110, align: 'center', sortable: true},
          {
            title: '合同签约日期',
            key: 'beginAt',
            minWidth: 130,
            align: 'center',
            sortable: true,
            ellipsis: true,
            render: (h, params) => {
              return h('div', this.formatDate(params.row.beginAt));
            }
          },
          {
            title: '合同到期日期',
            key: 'endAt',
            minWidth: 130,
            align: 'center',
            sortable: true,
            render: (h, params) => {
              return h('div', this.formatDate(params.row.endAt));
            }
          },
          {
            title: '合作方式',
            key: 'paymentMethod',
            minWidth: 110,
            align: 'center',
            sortable: true,
            render: (h, params) => {
              return h('div', this.paymentType(params.row.paymentMethod));
            }
          },
          {
            title: '门店数量',
            key: 'shopNum',
            minWidth: 110,
            align: 'center',
            sortable: true
          },
          {
            title: '业务员',
            key: 'salesman',
            minWidth: 110,
            align: 'center',
            sortable: true
          },
          {title: '创建人', key: 'createdBy', minWidth: 110, align: 'center', sortable: true},
          {
            title: '创建时间',
            key: 'createdAt',
            minWidth: 120,
            align: 'center',
            sortable: true,
            render: (h, params) => {
              return h('div', this.formatDate(params.row.createdAt));
            }
          },
          {
            title: '审核状态',
            key: 'status',
            minWidth: 110,
            align: 'center',
            sortable: true,
            fixed: 'right',
            render: (h, params) => {
              return h('div', this.statusType(params.row.status));
            }
          },
          {key: 'action', title: '操作', width: 110, align: 'center', fixed: 'right', slot: 'action'}
        ],
        // 搜索按钮loading
        loadingVisible: false,
        // 详情
        partnerDetail: {
          columns: [
            {title: '序号', type: 'index', width: 65, align: 'center'},
            {title: '创建人', key: 'created_by', width: 100, align: 'center'},
            {
              title: '时间',
              key: 'created_at',
              align: 'center',
              render: (h, params) => {
                return h('div', this.formatDate(params.row.created_at));
              }
            },
            {title: '包材图稿', key: 'artwork', align: 'center'},
            {title: '包材AI', key: 'artworkAi', align: 'center'},
            {title: '状态备注', key: 'remark', align: 'center'},
            {
              title: '状态',
              key: 'status',
              align: 'center',
              render: (h, params) => {
                return h('div', this.artworksStatus(params.row.status));
              }
            },
            {title: '选择', align: 'center'}
          ],
          data: {
            opinion: '',
            is_pass: '',
            fileItems: [
              {
                downLoadHref: ''
              }
            ]
          },
          modal: false,
          loading: false,
          status: [],
          btnLoading: false
        },
        // 若文件没有上传完，设置提交按钮为禁止状态
        isDisabled: false,
        // 合作方式
        paymentList: [
          {value: 'monthly', label: '月结'},
          {value: 'spot_cash', label: '现款现货'},
          {value: 'real_sale', label: '实销实结'}
        ],
        // 表单规则
        rulesForm: {},
        // 上传进度
        percentProgress: 0,
        // 上传显示
        isShowProgress: false,
        // 详情显示
        openStatus: true,
        // 门店补录
        storeData: {
          columns: [
            { type: 'selection', width: 60, align: 'center' },
            { title: '序号', type: 'index', align: 'center', width: 80 },
            { title: '商家名称', key: 'merchant_name', align: 'center',
              render: (h, params) => {
                return h('a', {
                  on: {
                    click: () => {
                      this.$router.push({
                        path: '/contract/partner-management-detail',
                        query: {id: params.row.contractor_id}
                      })
                    }
                  }
                }, params.row.merchant_name);
              }
            },
            { title: '商家类型', key: 'merchant_type', align: 'center' },
            { title: '联系人', key: 'contact_name', align: 'center' },
            { title: '联系电话', key: 'contact_phone', align: 'center' },
            { title: '门店名称', key: 'name', align: 'center' },
            { title: '门店地址', key: 'address', align: 'center' },
            { title: '业务员', key: 'created_by', align: 'center' },
            { title: '创建时间', key: 'created_at', align: 'center',
              render: (h, params) => {
                return h('div', this.formatDate(params.row.created_at));
              }
            },
            { title: '审核状态', key: 'status', align: 'center',
              render: (h, params) => {
                return h('div', this.statusType(params.row.status));
              }
            },
            { title: '操作', width: 110, align: 'center', slot: 'action' }
          ],
          list: [],
          page: 1,
          pageSize: 10,
          count: 0,
          modalType: false,
          checkList: [],
          checkData: {
            address: '',
            contact_name: '',
            contact_phone: '',
            contractor_id: '',
            created_at: '',
            created_at_desc: '',
            created_by: '',
            id: '',
            merchant_name: '',
            merchant_type: '',
            name: '',
            status: '',
            status_desc: ''
          },
          is_pass: '',
        },
        createDate: [],
        makeType: false
      };
    },
    methods: {
      /**
       * 初始化数据
       */
      init() {
        this.getList();
        this.getStroeList();
      },

      /**
       * 导出
       */
      packingExport() {
        let params = {};
        let selectList = [];
        let idList = [];
        params = this.search;
        selectList = this.$refs.partnerSelect.getSelection();
        delete params.page;
        delete params.perPage;
        if(this.createDate.length !== 0){
          if (this.createDate.length === 2){
            params.start_time = Date.parse(this.createDate[0]) / 1000;
            params.end_time = Date.parse(this.createDate[1]) / 1000;
          } else {
            this.$Message.warning('请选择创建时间！');
            return false;
          }
        } else {
          delete params.start_time;
          delete params.end_time;
        }
        if(selectList.length !== 0){
          selectList.forEach(item => {
            idList.push(item.id)
          })
          params.id = idList;
        } else {
          delete params.id;
        }
        for (let i in params) {
          if (!params[i]) {
            delete params[i];
          }
        }
        if(JSON.stringify(params) === '{}'){
          this.$Message.warning('请选择筛选条件！');
          return false;
        }
        this.$api.contractorExport(params)
          .then(res => {
            if (res.code === 0) {
              location.href = res.data[0];
              this.$Message.success(res.message);
            }
          });
      },

      /**
       * 查询合作商列表
       * @param {String} name：表单名称
       */
      getList(name) {
        let params = {};
        params = this.search;
        this.loading = true;
        params.page = this.pageProps.page;
        params.perPage = this.pageProps.perPage;
        if(this.createDate.length !== 0){
          if (this.createDate.length === 2){
            params.start_time = Date.parse(this.createDate[0]) / 1000;
            params.end_time = Date.parse(this.createDate[1]) / 1000;
          } else {
            this.$Message.warning('请选择创建时间！');
            return false;
          }
        } else {
          delete params.start_time;
          delete params.end_time;
        }
        for (let i in params) {
          if (!params[i]) delete params[i];
        }
        this.$api.contractorList(params)
          .then(res => {
            if (res.code === 0) {
              let data = res.data
              this.partnerData = data.list
              this.pageProps.page = data.currentPage
              this.pageProps.totalCount = data.totalCount
              this.search.ownership = data.ownership
              this.handleValidateDataPermissionRange(this, 'isGetDataPermissionRange', 'dataPermissionRange', data.ownership)
            }
          })
          .finally(() => {
            this.loading = false;
          });
      },

      /**
       * 详情
       * @param {Number} id：订单编号
       */
      viewDetails(id) {
        this.modalType = 'detail';
        this.partnerDetail.data = {};
        this.modal = {
          title: '详情',
          status: 'detail'
        };
        this.partnerDetail.modal = true;
        this.openStatus = true;
        this.$api.contractorDetail(id)
          .then(res => {
            this.detailsList.loading = false;
            if (res.code === 0) {
              res.data.is_pass = res.data.is_pass ? res.data.is_pass : res.data.audit_pass;
              this.partnerDetail.data = res.data;
              // 拼接附件的下载地址
              this.partnerDetail.data.fileItems.map(item => {
                item.downLoadHref = `${SERVER_BASE_URL}` + '/' + item.url;
              });
            }
          });
        this.detailId = id;
      },

      /**
       * 列表点击信息
       * @param {Object} selection：用户信息
       */
      selectCheck(selection) {
        this.checkList = selection;
      },

      /**
       * 通用打开弹窗
       * @param {String} name：窗口名称
       */
      openCommonModal(name) {
        let checkList = this.checkList;
        if (checkList.length === 0) {
          return void this.$Message.warning('请选择！');
        } else if (checkList.length >= 2) {
          return void this.$Message.warning('只能选中一条！');
        }
        if (checkList[0].status !== 'ContractorWorkflow/auditPending') {
          this.$Message.warning('只有待审核状态下才可以审核！');
          return;
        }
        this[name].modal = true;
        this.logTabs = 'details';
        this.detailId = checkList[0].id;
        return true;
      },

      /**
       * 审核
       */
      postAudit(){
        this.isTabValus === 'partners' ? this.tapAudit() : this.storeModelShow()
      },
      // 合作商列表审核
      tapAudit() {
        this.modalType = 'audit';
        this.partnerDetail.data = {};
        this.auditList = {};
        let checkList = this.checkList;
        let isAction = this.openCommonModal('partnerDetail');
        this.modal = {
          title: '审核',
          status: 'audit'
        };
        if (!isAction) return;
        this.openStatus = false;
        this.$api.contractorDetail(checkList[0].id)
          .then(res => {
            if (res.code === 0) {
              this.partnerDetail.data = res.data;
              // 审核收货地址优化
              this.partnerDetail.data.contractorReceivingAddrGroup = res.data.contractorReceivingAddrGroup.map(v => {
                return {
                ...v,
                new_receiving_address: v.province + v.city + v.county + ' ' + v.receiving_address
              }})
              // 拼接附件的下载地址
              this.partnerDetail.data.fileItems.map(item => {
                item.downLoadHref = `${SERVER_BASE_URL}` + '/' + item.url;
              });
            }
          });
      },
      // 门店审核弹窗
      storeModelShow(){
        this.storeData.checkData = {}
        if(this.storeData.checkList.length === 0){
          this.$Message.warning('请选择！');
        } else if(this.storeData.checkList.length > 1){
          this.$Message.warning('只可审核一条数据');
        } else {
          if(this.storeData.checkList[0].status !== 'auditPending'){
            this.$Message.warning('当前状态不可审核');
            return false
          } else {
            this.storeData.is_pass = '';
            // this.storeData.checkData = ;
            this.storeData.checkData = this.storeData.checkList[0]
            // this.storeData.checkData.created_timer = this.formatDate(this.storeData.checkData.created_at);
            this.storeData.modalType = true;
          }
        }
      },

      /**
       * 关闭详情弹窗
       */
      closeModal(name) {
        this[name].modal = false;
      },
      /**
       * 审核
       */
      auditItem() {
        let params = {};
        params.id = this.checkList[0].id;
        params.developer_contractor_id = this.checkList[0].developer_contractor_id
        params.opinion = this.partnerDetail.data.opinion;
        params.is_pass = this.partnerDetail.data.is_pass;
        if (params.is_pass === undefined || params.is_pass === '') {
          this.$Message.warning('请选择审核结果！');
          return;
        }
        if (params.opinion === undefined || params.opinion === null || params.opinion === '') {
          this.$Message.warning('请输入审核意见！');
          return;
        }
        this.partnerDetail.btnloading = true;
        this.$api.contractorAudit(params).then(res => {
          this.partnerDetail.btnloading = false;
          if (res.code === 0) {
            this.partnerDetail.modal = false;
            this.$Message.success(res.message);
            this.getList();
          } else {
            this.$Message.warning(res.message);
          }
        });
      },

      /**
       * 时间转化
       * @param {time} time: 时间戳
       */
      formatDate(time) {
        return this.$format(time, 'yyyy-MM-dd');
      },

      /**
       * 改变页数事件
       * @param {Number} e：返回的页数
       */
      changePage(e) {
        this.pageProps.page = e;
        this.getList();
      },

      /**
       * 改变页数事件
       * @param {Number} e：返回的页数
       */
      changePageSize(e) {
        this.pageProps.perPage = e;
        this.getList();
      },

      /**
       * 操作栏的编辑
       * @param {Number} 表单id
       */
      handleEdit(id) {
        this.$router.push({
          path: '/contract/partner-management-edit',
          query: {id: id}
        });
      },

      /**
       * 删除信息
       * @param {Number} 表单id
       */
      handleDelete(id) {
        this.$api.contractorDelete(id)
          .then(res => {
            if (res.code === 0) {
              this.$Message.success(res.message);
              this.getList();
            }
          });
      },
      //预览
      handleView (file,index) {
          this.imgModel.showBusinessLicenseImg = true; 
          this.imgModel.showBusinessLicenseImgUrl = file.url_show;
      },
      /**
       * 重置
       * @param {String} name：表单名称
       */
      handleReset(name) {
        this.createDate = [];
        this.$refs[name].resetFields();
        this.isTabValus === 'partners' ? this.getList() : this.getStroeList()
      },

      /***
       * 合作方式
       * @param {String} pay：类型
       */
      paymentType(pay) {
        let list = this.paymentList.filter((item) => {
          return item.value === pay;
        });
        return list[0] ? list[0].label : '';
      },

      /***
       * 商家类型
       * * @param {String} pay：类型
       */
      businessList(pay) {
        let list = this.businessType.filter((item) => {
          return item.value === pay;
        });
        return list[0] ? list[0].label : '';
      },

      /***
       * 审核状态类型
       * * @param {String} status：类型
       */
      statusType(status) {
        let list = this.statusList.filter((item) => {
          return status.indexOf(item.value) > -1;
        });
        return list[0] ? list[0].label : '';
      },

      /***
       * 上传文件成功
       */
      importSuccess(res, file) {
        this.isShowProgress = false;
        // 上传成功
        if (res.code === 0) {
          this.$Message.success(res.message);
          this.init();
        } else {
          let desc = '';
          if (res.data !== '') {
            let arr = [];
            for (let i in res.data) {
              arr.push((res.data[i]));
            }
            desc = JSON.stringify(arr.join());
          } else {
            desc = res.message;
          }
          this.$Notice.error({
            title: '导入失败！',
            desc: res.message
          });
        }
      },

      /***
       * 文件的格式验证
       */
      fileFormatError(file) {
        this.$Notice.error({
          title: '文件格式错误',
          desc: JSON.stringify(file)
        });
      },

      /***
       * 文件上传限制
       */
      fileMaxSize(file) {
        this.$Notice.warning({
          title: '超出文件大小限制',
          desc: '文件 ' + file.name + ' 太大，不能超过 50M。'
        });
      },

      /***
       * 文件上传成功的进度条
       */
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
      // 获取门店补录列表
      getStroeList(){
        let params = {}
        let than = this;
        params = this.search;
        params.page = this.storeData.page;
        params.perPage = this.storeData.pageSize;
        params.created_by = params.salesman;
        delete params.salesman;
        this.loading = true;
        for (let i in params) {
          if (!params[i]) {
            delete params[i]
          }
        }
        this.$api.storeList(params)
          .then(res => {
            if(res.code === 0){
              than.loading = false;
              than.storeData.list = res.data.data;
              than.storeData.count = res.data.count;
              than.storeData.page = res.data.page;
              than.storeData.pageSize = res.data.pageSize;
              than.search.salesman = params.created_by;
            }
          })
      },
      // 门店补录分页设置
      changeStorePage(e){
        this.storeData.page = e;
        this.getStroeList();
      },
      changeStorePageSize(e){
        this.storeData.perPage = e;
        this.getStroeList();
      },
      // 门店补录 - 删除
      isDelStore(id){
        this.$api.delStore(id)
          .then(res => {
            if (res.code === 0) {
              this.$Message.success(res.message);
              this.getStroeList();
            }
          })
          .catch(err => {
            this.$Message.error(err.message);
          })
      },
      subStoreAudit(){
        let data = {};
        data.id = Number(this.storeData.checkData.id);
        data.is_pass = Number(this.storeData.is_pass);
        this.$api.auditStore(data)
          .then(res => {
            if(res.code === 0){
              this.$Message.success(res.message);
              this.getStroeList();
            }
          })
          .catch(err => {
            this.$Message.error(err.message);
          })
      },
      // 搜索
      getSearch(){
        if (this.isTabValus === 'partners') {
          this.page = 1;
          this.getList('search')
        } else {
          this.storeData.page = 1;
          this.getStroeList('search');
        }
      },
      selectStore(){
        this.storeData.checkList = this.$refs.storeSelect.getSelection();
      },

      dateSelect(date){
        date[0] = date[0] + ' 00:00:00'
        date[1] = date[1] + ' 23:59:59'
        this.createDate = date;
        this.getList();
      },
      // 门店补录切换隐藏部分按钮
      makeClick(name){
        const ownership = this.search.ownership
        this.search = { ownership }
        this.makeType = name === 'store' ? true : false
      },

      /**
       * 判断是否具有操作权限
       * @param {String} permission: 权限路由链接
       */
      handleUserHasPermission(permission) {
        const limits = this.userPermissionsList.replace(/(\[)|(\])|(\")/g, '').split(',')
        return limits.some(limit => permission === limit)
      }
    },
    activated() {
      this.userPermissionsList = window.localStorage.getItem('permissionList') // 获取用户操作权限
      this.$store.commit('app/setSearchList', this.$route.query)
      // this.$store.state.app.searchList.query = this.$route.query;
      this.pageProps.page = 1;
      this.pageProps.perPage = 10;
      let tab = this.$route.query.tab||'';
      let status = this.$route.query.status||'';
      let idCollect=this.$route.query.id_collect||''
      if (status) {
        this.search.status = status;
      }else{
        this.search.status = '';
      }
      if(idCollect){
        this.search.id_collect = idCollect
      }else{
        this.search.id_collect = '';
      }
      if (tab) {
        this.isTabValus = tab
      }else{
        this.isTabValus = 'partners'
      }
      this.init();
    },
    
   watch:{
      $route:{
        deep: true,
        handler:function(newVal,oldVal){
          if(oldVal.name == newVal.name && Object.keys(newVal.query)){
              this.pageProps.page = 1;
              this.pageProps.perPage = 10;
              this.search = {} 
              this.getList()
          }
        }
      }
    }
  }
</script>

<style lang="less" scoped>
//
.text-align-left{
  text-align: left;
}
  .partner-date /deep/ .ivu-date-picker-editor {
    width: 210px !important;
  }

  .ivu-input::-webkit-input-placeholder, .ivu-select-single .ivu-select-selection .ivu-select-placeholder {
    color: rgb(130, 130, 130);
  }

  .ivu-input, .ivu-select-selection {
    border: 1px solid rgb(184, 184, 184);
    color: #000;

  }

  .ivu-date-picker {
    width: 100%;
  }

  .breadth {
    width: 58px;
    height: 58px;
    line-height: 58px;
    float: left;
  }

  .ivu-upload-list {
    display: inline-block;
  }

  .ivu-upload-drag {
    width: 58px;
    display: inline-block;
    margin-top: 5px
  }

  .ivu-upload-list-file {
    float: left;
  }

  #printModal p {
    line-height: 1.8;
   
  }

  #printModal .ivu-table-wrapper {
    border-color: #495060;

    .ivu-table-border:before, .ivu-table-border:after {
      background-color: #495060;
    }

    td {
      border-right: 1px solid #495060;
      border-bottom: 1px solid #495060;
    }
  }

  .ivu-table-border {
    overflow: visible
  }

  .verification {
    overflow: hidden;
    margin-bottom: 0;
    height: 100%;
  }

  .verification .ivu-form-item-content, .verification .ivu-date-picker-rel {
    height: 100%;
  }

  .receiveDetailList a {
    width: 60px;
    height: 60px;
    display: block;
  }

  #collect-goods .ivu-modal-content {
    left: 5%
  }

  #collect-goods .ivu-table-cell:last-child {
    padding-left: 7px
  }

  .new {
    background: url(../../assets/images/new.png) no-repeat center center;
    background-size: 100%;
  }

  .partnerDetailAddress {
    min-height: 40px;
    border-bottom: 1px solid #e8eaec;

    &:last-child {
      border-bottom: none;
    }

    .head-bg {
      display: inline-block;
      line-height: 40px;
      border-right: 1px solid #e8eaec;
    }

    .head-bgs {
      display: inline-block;
      line-height: 1.5;    
      word-wrap: break-word;
      word-break: normal;

    }
  }

  @media screen and (max-width: 640px ) {
    #opts button {
      margin-bottom: 5px;
    }

    .ivu-col-span-3 {
      width: 200px;
      margin-bottom: 5px;
    }
  }

  .is-hide {
    display: none;
  }
  //营业执照
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
  }
  .upload-list:hover .upload-list-cover{
        display: block;
    }
 .upload-list-cover i{
	 			width: 100%;
        color: #fff;
        font-size: 30px;
        line-height: 60px;
        cursor: pointer;
        margin: 0 auto;
    }
</style>
