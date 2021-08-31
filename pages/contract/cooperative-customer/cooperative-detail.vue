<template>
  <div class="cooperative-detail">
    <Card>
      <div slot="title">
        <Row type="flex" justify="end">
          <Button type="primary" @click="goBack">返 回</Button>
        </Row>
      </div>
      <div class="cooperative-detail-content">
        <!-- 基本信息 start -->
        <Card>
          <Row type="flex" style="margin-bottom: 16px;">
            <h3>{{detailData.merchantName}}</h3>
            <div class="business">
              <div class="business-icon">
                <img src="~/assets/images/company_success.png" alt="" />
              </div>
              <a class="business-info" @click="() => businessInfoModal.show = true">工商信息</a>
            </div>
          </Row>
          <Row class="base-info">
            <Col :md="8">
              <span class="base-info-label">客户类型：</span>
              <span>{{formatMerchantType(detailData.merchantType)}}</span>
            </Col>
            <Col :md="8">
              <span class="base-info-label">商务负责人：</span>
              <span>{{detailData.followBy}}</span>
            </Col>
            <Col :md="8">
              <span class="base-info-label">上级客户：</span>
              <a @click="goToHigherCustomer(detailData.parentContractorId)">{{detailData.parentContractorName || '-'}}</a>
            </Col>
          </Row>
          <Row class="base-info">
            <Col :md="8">
              <span class="base-info-label">开拓人：</span>
              <span>{{detailData.salesmanName}}</span>
            </Col>
            <Col :md="8">
              <span class="base-info-label">创建人：</span>
              <span>{{detailData.createdBy}}</span>
            </Col>
            <Col :md="8">
              <span class="base-info-label">创建时间：</span>
              <span>{{formatDate(detailData.createdAt, 'yyyy-MM-dd')}}</span>
            </Col>
          </Row>
          <Row class="base-info">
            <Col :md="8">
              <span class="base-info-label">联系人：</span>
              <a @click="goToNavigation('contact')">点击查看</a>
            </Col>
            <Col :md="8">
              <span class="base-info-label">合作门店：</span>
              <a @click="goToNavigation('facade')">点击查看</a>
            </Col>
            <Col :md="8">
              <span class="base-info-label">订单信息：</span>
              <a @click="goToNavigation('order')">点击查看</a>
            </Col>
          </Row>
          <Row class="base-info">
            <Col>
              <div @click="showBigImg($event, detailData.businessLicense)">
                <span class="base-info-label">营业执照：</span>
                <div class="voucher" v-for="(item, index) in detailData.businessLicense" :key="'businessImg' + index">
                  <img :src="item.urlShow" :data-index="index" />
                </div>
              </div>
            </Col>
          </Row>
        </Card>
        <!-- 基本信息 end -->
        <!-- 选项卡 start -->
        <Tabs v-model="currentTabName" @on-click="handleClickTab">
          <TabPane label="客户档案" name="customerProfile">
            <div class="profile-info" v-show="currentTabName === 'customerProfile'">
              <!-- 系统信息 start -->
              <Card>
                <div slot="title"><h3>系统信息</h3></div>
                <div>
                  <Table
                    class="review-list"
                    border
                    :columns="systemInfoColumns"
                    :data="detailData.systemInfo"
                    size="small"
                  ></Table>
                </div>
              </Card>
              <!-- 系统信息 end -->
              <!-- 收货地址 start -->
              <Card>
                <div slot="title"><h3>收货地址</h3></div>
                <Form ref="storeInfo" :model="receivingAddr.formData" label-position="left" :label-width="75">
                  <Row @keydown.native.enter.prevent="getReceivingAddrInfo('new')">
                    <Col :md="10">
                      <FormItem label="收货地址：">
                        <Input v-model="receivingAddr.formData.receiving_address" clearable placeholder="请输入收货地址" />
                      </FormItem>
                    </Col>
                    <Col :md="1" style="margin-bottom: 10px">
                      <Button @click="getReceivingAddrInfo('new')" type="primary">搜索</Button>
                    </Col>
                  </Row>
                </Form>
                <div>
                  <Table
                    class="review-list"
                    border
                    :columns="receivingAddr.columns"
                    :data="receivingAddr.data"
                    :loading="receivingAddr.loading"
                    size="small"
                  ></Table>
                </div>
                <div style="margin: 10px 0; overflow: hidden;">
                  <div class="pages-L">共 {{ receivingAddr.pageProps.totalCount }} 条</div>
                  <div style="float: right;">
                    <Page
                      :total="receivingAddr.pageProps.totalCount"
                      size="small"
                      :current="receivingAddr.pageProps.currentPage"
                      show-sizer
                      show-elevator
                      @on-change="(val) => changePage(val,'receivingAddr')"
                      @on-page-size-change="(val) => changePageSize(val,'receivingAddr')"
                    ></Page>
                  </div>
                </div>
              </Card>
              <!-- 收货地址 end -->
              <!-- 下级客户 start -->
              <Card>
                <div slot="title"><h3>下级客户</h3></div>
                <Form ref="storeInfo" :model="childCustomer.formData" label-position="left" :label-width="100">
                  <Row @keydown.native.enter.prevent="getChildCustomerInfo('new')">
                    <Col :md="10">
                      <FormItem label="系统/门店名称：">
                        <Input v-model="childCustomer.formData.systemName" clearable placeholder="请输入系统/门店名称" />
                      </FormItem>
                    </Col>
                    <Col :md="1" style="margin-bottom: 10px">
                      <Button @click="getChildCustomerInfo('new')" type="primary">搜索</Button>
                    </Col>
                  </Row>
                </Form>
                <div>
                  <Table
                    class="review-list"
                    border
                    :columns="childCustomer.columns"
                    :data="childCustomer.data"
                    :loading="childCustomer.loading"
                    size="small"
                  ></Table>
                </div>
                <div style="margin: 10px 0; overflow: hidden;">
                  <div class="pages-L">共 {{ childCustomer.pageProps.totalCount }} 条</div>
                  <div style="float: right;">
                    <Page
                      :total="childCustomer.pageProps.totalCount"
                      size="small"
                      :current="childCustomer.pageProps.currentPage"
                      show-sizer
                      show-elevator
                      @on-change="(val) => changePage(val,'childCustomer')"
                      @on-page-size-change="(val) => changePageSize(val,'childCustomer')"
                    ></Page>
                  </div>
                </div>
              </Card>
              <!-- 下级客户 end -->
            </div>
          </TabPane>
          <TabPane label="合同信息" name="contractInfo">
            <div class="contract-info" v-show="currentTabName === 'contractInfo'">
              <Row v-for="(item, index) in detailData.contractsInfo" :key="index">
                <Col span="22">
                  <div class="contract-info-box">
                    <Form :label-width="120">
                      <Row>
                        <Col :md="7">
                          <FormItem label="合同模板：">
                            <Input :value="formatContractTemplate(item.contractTemplate)" readonly />
                          </FormItem>
                        </Col>
                        <Col :md="7">
                          <FormItem label="品牌：">
                            <Input :value="item.coBrand.toUpperCase()" readonly />
                          </FormItem>
                        </Col>
                        <Col :md="7">
                          <FormItem label="省份：">
                            <Input :value="formatProvince(item.province)" readonly />
                          </FormItem>
                        </Col>
                      </Row>
                      <Row>
                        <Col :md="7">
                          <FormItem label="合同签约日期：">
                            <Input :value="formatDate(item.contractAt, 'yyyy-MM-dd')" readonly />
                          </FormItem>
                        </Col>
                        <Col :md="7">
                          <FormItem label="合同到期日期：">
                            <Input :value="formatDate(item.expireAt, 'yyyy-MM-dd')" readonly />
                          </FormItem>
                        </Col>
                        <Col :md="7">
                          <FormItem label="合同编号：">
                            <Input :value="item.number" readonly />
                          </FormItem>
                        </Col>
                      </Row>
                      <Row>
                        <Col :md="14">
                          <FormItem label="合同地址：">
                            <Input :value="item.address" readonly />
                          </FormItem>
                        </Col>
                      </Row>
                      <Row>
                        <Col :md="7">
                          <FormItem label="结款方式：">
                            <Input :value="formatPaymentMethod(item.paymentMethod)" readonly />
                          </FormItem>
                        </Col>
                        <Col :md="7">
                          <FormItem label="结款周期：">
                            <Input :value="item.paymentDays" readonly />
                          </FormItem>
                        </Col>
                        <Col :md="7">
                          <FormItem label="对账日：">
                            <Input :value="item.paymentAt" readonly />
                          </FormItem>
                        </Col>
                      </Row>
                      <Row>
                        <Col :md="21">
                          <FormItem label="备注：">
                            <Input :value="item.remark" type="textarea" readonly />
                          </FormItem>
                        </Col>
                      </Row>
                      <Row>
                        <Col :md="21">
                          <FormItem label="合同附件：">
                            <!-- to-do v-for -->
                            <div v-for="(file, fIndex) in item.fileItems" :key="'file' + fIndex">
                              <a @click="handleShowContractFile(file.urlShow)">{{file.name}}</a>
                            </div>
                          </FormItem>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </Col>
              </Row>
              <div v-if="detailData.contractsInfo.length === 0" style="text-align: center;">暂无数据</div>
            </div>
          </TabPane>
          <TabPane label="拜访记录" name="visitRecords">
            <div v-show="currentTabName === 'visitRecords'">
              <Card>
                <div slot="title"><h3>拜访记录</h3></div>
                <div>
                  <Table
                    class="review-list"
                    border
                    :columns="visitRecords.columns"
                    :data="visitRecords.data"
                    :loading="visitRecords.loading"
                    size="small"
                  ></Table>
                </div>
                <div style="margin: 10px 0; overflow: hidden;">
                  <div class="pages-L">共 {{ visitRecords.pageProps.totalCount }} 条</div>
                  <div style="float: right;">
                    <Page
                      :total="visitRecords.pageProps.totalCount"
                      size="small"
                      :current="visitRecords.pageProps.currentPage"
                      show-sizer
                      show-elevator
                      @on-change="(val) => changePage(val,'visitRecords')"
                      @on-page-size-change="(val) => changePageSize(val,'visitRecords')"
                    ></Page>
                  </div>
                </div>
              </Card>
            </div>
          </TabPane>
          <TabPane label="日志" name="log">
            <div v-show="currentTabName === 'log'">
              <Card>
                <div slot="title"><h3>操作日志</h3></div>
                <div>
                  <Table
                    class="review-list"
                    border
                    :columns="logOperationData.columns"
                    :data="logOperationData.data"
                    :loading="logOperationData.loading"
                    size="small"
                  ></Table>
                </div>
                <div style="margin: 10px;overflow: hidden">
                  <div class="pages-L">共 {{ logOperationData.pageProps.totalCount }} 条</div>
                  <div style="float: right;">
                    <Page
                      :total="logOperationData.pageProps.totalCount"
                      size="small"
                      :current="logOperationData.pageProps.page"
                      show-sizer
                      show-elevator
                      @on-change="(val) => changePage(val,'logOperationData')"
                      @on-page-size-change="(val) => changePageSize(val,'logOperationData')"
                    ></Page>
                  </div>
                </div>
              </Card>
            </div>
          </TabPane>
        </Tabs>
        <Spin fix v-if="spinShow"></Spin>
      </div>
      <!-- 选项卡 end -->
    </Card>
    <!-- 点击图片放大 -->
    <ImgModal :show="bigImgShow" :imgArr="bigImgArr" :imgIndex="bigImgIndex" @closeImgModal="closeImgModal"></ImgModal>

    <!-- 查看工商信息模态窗 start-->
    <Modal v-model="businessInfoModal.show" title="工商信息" width="1000">
      <Form :label-width="130" label-position="right">
        <Row>
          <Col span="8">
            <FormItem label="公司名称:">
              <Input :value="detailData.companyInfo.name" readonly />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="成立日期:">
              <Input :value="detailData.companyInfo.establishTime" readonly />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="省份:">
              <Input :value="detailData.companyInfo.base" readonly />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem label="公司类型:">
              <Input :value="formatCompanyType(detailData.companyInfo.companyType)" readonly />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="注册资本:">
              <Input :value="detailData.companyInfo.regCapital" readonly />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="法人:">
              <Input :value="detailData.companyInfo.legalPersonName" readonly />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem label="经营状态:">
              <Input :value="detailData.companyInfo.regStatus" readonly />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="统一社会信用代码:">
              <Input :value="detailData.companyInfo.creditCode" readonly />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="组织机构代码:">
              <Input :value="detailData.companyInfo.regNumber" readonly />
            </FormItem>
          </Col>
        </Row>
      </Form>
      <template slot="footer">
        <Button type="primary" @click="() => businessInfoModal.show = false">确认</Button>
      </template>
    </Modal>
    <!-- 查看工商信息模态窗 end-->
  </div>
</template>

<script>
import { SERVER_BASE_URL } from '~/api/config'
import mixin from '../mixins'
export default {
  mixins: [mixin],
  data() {
    return {
      id: this.$route.query.id,
      currentTabName: 'customerProfile',
      receivingAddr: { // 收获地址对象结构
        columns: [
          { 
            title: '序号',
            width: 70,
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
          receiving_address: '',
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
      childCustomer: {  // 下级客户对象结构
        columns: [
          { 
            title: '序号',
            width: 70,
            align: 'center',
            render: (h, params) => h('span', params.index + 1)
          },
          { title: '公司名称', key: 'merchantName', minWidth: 200, align: 'center' },
          { 
            title: '客户类型',
            minWidth: 100,
            align: 'center',
            render: (h, params) => h('span', this.formatMerchantType(params.row.merchantType))
          },
          {
            title: '系统/门店名称',
            key: 'systemName',
            className: 'p-0',
            minWidth: 200,
            align: 'center',
            render: (h, params) => {
              const systemInfo = params.row.systemInfo || []
              const nameArr = systemInfo.reduce((acc, item, index, arr) => acc.concat(h('p', item.name)), [])
              return h('div', nameArr)
            }
          },
          { title: '客户等级', key: 'level', minWidth: 90, align: 'center' },
          { 
            title: '合作品牌',
            minWidth: 100,
            align: 'center',
            render: (h,params) => h('span', params.row.coBrand.toUpperCase())
          },
          { title: '商务负责人', key: 'followBy', minWidth: 120, align: 'center' },
          {
            title: '合作方式',
            key: 'paymentMethod',
            minWidth: 100, 
            align: 'center',
            render: (h, params) => {
              const effectContract = params.row.effectContract
              if (effectContract) return h('span', this.formatPaymentMethod(effectContract.paymentMethod))
            }
          },
          { 
            title: '合同到期日期',
            minWidth: 150,
            align: 'center',
            render: (h, params) => {
              const effectContract = params.row.effectContract
              if(effectContract) return h('span', this.formatDate(effectContract.expireAt, 'yyyy-MM-dd'))
            }
          },
          { 
            title: '客户状态',
            key: 'cooperateType',
            minWidth: 100,
            align: 'center',
            render: (h, params) => {
              if(params.row.cooperateType === 'normal') {
                return h('span', '在业')
              } else if(params.row.cooperateType === 'stop') {
                return h('span', '停业')
              }
            }
          },
          {
            title: '操作',
            minWidth: 90,
            align: 'center',
            render: (h, params) => {
              return h(
                'a',
                {
                  on: {
                    click: () => this.$router.push(`/contract/cooperative-customer/cooperative-detail?id=${params.row.id}`),
                  },
                },
                '查看详情'
              )
            },
          },
        ],
        formData: {
          name: '',
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
      logOperationData: { // 操作日志对象结构
        columns: [
          { title: '序号', type: 'index', width: 70, align: 'center' },
          { title: '操作人', key: 'created_by', minWidth: 100, align: 'center' },
          {
            title: '操作类型',
            minWidth: 90,
            align: 'center',
            render: (h, params) => {
              return h('span', this.formatOperationType(params.row.operation_type))
            },
          },
          { title: '修改内容', key: 'content', minWidth: 350, align: 'center' },
          {
            title: '操作时间',
            minWidth: 135,
            align: 'center',
            render: (h, params) => {
              return h('span', this.formatDate(params.row.created_at, 'yyyy-MM-dd hh:mm'))
            },
          },
        ],
        data: [],
        loading: false,
        pageProps: {
          page: 1,
          perPage: 10,
          currentPage: 1,
          totalCount: 0,
        },
      },
      systemInfoColumns: [ // 系统信息列信息
        { title: '序号', type: 'index', width: 70, align: 'center' },
        {
          title: '系统/门店名称',
          key: 'name',
          minWidth: 200,
          align: 'center',
        },
        { title: '门店数量', key: 'facadeNumber', minWidth: 200, align: 'center' },
        {
          title: '客户等级',
          minWidth: 200,
          align: 'center',
          render: (h, params) => {
            const number = params.row.facadeNumber
            if (!number) return h('span', '')
            if (number <= 5) return h('span', 'D')
            else if (number <= 20) return h('span', 'C')
            else if (number <= 80) return h('span', 'B2')
            else if (number <= 100) return h('span', 'B1')
            else if (number <= 500) return h('span', 'A2')
            else return h('span', 'A1')
          }
        },
      ],
      visitRecords: { // 拜访记录对象结构
        columns: [
          { title: '序号', type: 'index', width: 70, align: 'center' },
          { title: '工号', key: 'jobNumber', minWidth: 150, align: 'center' },
          { 
            title: '姓名',
            key: 'createdBy',
            minWidth: 150,
            align: 'center',
            render: (h, params) => {
              const { createdBy, checkinWay, checkinId } = params.row
              return h('a', {
                on: {
                  click: () => {
                    this.goToCheckinDeatil(checkinWay, checkinId)
                  }
                }
              }, createdBy)
            }
          },
          { title: '职务', key: 'jobStation', minWidth: 150, align: 'center' },
          { title: '系统部门', key: 'offlineDeptName', minWidth: 200, align: 'center' },
          {
            title: '拜访类型',
            key: 'checkinWay',
            minWidth: 150,
            align: 'center',
            render: (h, params) => h('span', this.formatCheckinType(params.row.checkinWay))
          },
          {
            title: '签到时间',
            key: 'signinAt',
            minWidth: 210,
            align: 'center',
            render: (h, params) => {
              const time = params.row.signinAt
              return +time ? h('span', this.formatDate(time, 'yyyy-MM-dd hh:mm:ss', true)) : ('span', '')
            }
          },
          {
            title: '签退时间',
            key: 'signoutAt',
            minWidth: 210,
            align: 'center',
            render: (h, params) => {
              const time = params.row.signoutAt
              return +time ? h('span', this.formatDate(time, 'yyyy-MM-dd hh:mm:ss', true)) : ('span', '')
            }
          },
          { title: '拜访时长', key: 'checkinLength', minWidth: 150, align: 'center' },
          { title: '门店名称', key: 'facadeName', minWidth: 200, align: 'center' },
          { title: '门店地址', key: 'facadeAddress', minWidth: 200, align: 'center' },
          { title: '签到地址', key: 'checkinAddress', minWidth: 200, align: 'center' },
          { title: '签退地址', key: 'checkoutAddress', minWidth: 200, align: 'center' },
        ],
        data: [],
        loading: false,
        pageProps: {
          page: 1,
          perPage: 10,
          currentPage: 1,
          totalCount: 0,
        },
      },

      imgModal: {
        show: false,
        url: '',
      },
      businessInfoModal: {
        show: false,
      },
      detailData: {
        companyInfo: {},
        auditLog: {},
        fileItems: [],
        businessLicense: [],
        contractsInfo: [],
        systemInfo: [],
      },
      // 查看大图预览
      bigImgShow: false,
      bigImgArr: [],
      bigImgIndex: 0,
      // 加载
      spinShow: false,
    }
  },

  methods: {
    // ------------------------------------ 接口请求API ------------------------------------
    // 获取详情
    getDetail(id) {
      this.spinShow = true
      this.$api.cooperativeCustomerDeatil({id}).then((res) => {
        if(res.code === 0) {
          res.data.auditLog = res.data.auditLog || {}
          res.data.companyInfo = res.data.companyInfo || {}
          this.detailData = res.data
          this.spinShow = false
        }
      })
    },

    // 获取收货地址信息
    getReceivingAddrInfo(type = '') {
      this.receivingAddr.loading = true
      let params = JSON.parse(JSON.stringify(this.receivingAddr.formData))
      params.page = this.receivingAddr.pageProps.page
      params.perPage = this.receivingAddr.pageProps.perPage
      params.contractor_id = this.id
      if(type === 'new') {
        params.page = this.receivingAddr.pageProps.page = 1
      }
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

    // 获取下级信息
    getChildCustomerInfo(type = '') {
      this.childCustomer.loading = true
      let params = JSON.parse(JSON.stringify(this.childCustomer.formData))
      params.page = this.childCustomer.pageProps.page
      params.perPage = this.childCustomer.pageProps.perPage
      if(type === 'new') {
        params.page = this.childCustomer.pageProps.page = 1
      }
      params.contractorId = this.id
      // 调用接口
      this.$api.cooperativeCustomerChildCustomer(params).then((res) => {
        if(res.code === 0) {
          this.childCustomer.data = res.data.items
          this.childCustomer.pageProps.totalCount = res.data._meta.totalCount
          this.childCustomer.pageProps.currentPage = res.data._meta.currentPage
        }
      })
      .finally(() => {
        this.childCustomer.loading = false
      })
    },

    // 获取操作日志信息
    getLogOperationDataInfo() {
      this.logOperationData.loading = true
      let {page, perPage} = this.logOperationData.pageProps
      let params = {
        objectId: this.id,
        moduleName: 'cooperation',
        page,
        perPage
      }
      // 调用接口
      this.$api.contractorOperationLog(params).then((res) => {
          this.logOperationData.data = res.items
          this.logOperationData.pageProps.totalCount = res._meta.totalCount
          this.logOperationData.pageProps.currentPage = res._meta.currentPage
      })
      .finally(() => {
        this.logOperationData.loading = false
      })
    },

    // 获取拜访记录
    getVisitRecordsInfo(type = '') {
      const id = this.id
      this.visitRecords.loading = true
      this.$api.cooperativeCustomerDeatilCheckinLog({id}).then(res => {
        if (res.code === 0) {
          let data = res.data
          this.visitRecords.data = data.list
          this.visitRecords.pageProps.totalCount = data.totalCount
          this.visitRecords.pageProps.currentPage = data.currentPage
        }
      })
      .finally(() => {
        this.visitRecords.loading = false
      })
    },
    
    // ------------------------------------ 交互事件 ------------------------------------
    /**
     * 获取当前标签页下的表格列表
     * @param {String} currentTab: 当前标签
     */
    getTableData(currentTab) {
      switch (currentTab) {
        case 'customerProfile':
          this.getReceivingAddrInfo()
          this.getChildCustomerInfo()
          break
        case 'visitRecords':
          this.getVisitRecordsInfo()
          break
        case 'log': // 获取日志
          this.getLogOperationDataInfo()
          break
        default:
          break
      }
    },

    /**
     * 切换标签页
     * @param {String} name: 点击的标签的name属性
     */
    handleClickTab(name) {
      this.getTableData(name)
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

    // 文件下载
    download(url) {
      let data = SERVER_BASE_URL + '/' + url
      let a = document.createElement('a')
      a.setAttribute('href', data)
      a.setAttribute('download', data.split('/').pop()) //分割路径，取出最后一个元素
      a.setAttribute('target', '_blank')
      a.setAttribute('id', 'DownloadFile')
      // 防止反复添加
      if (document.getElementById('DownloadFile')) {
        document.body.removeChild(document.getElementById('DownloadFile'))
      }
      document.body.appendChild(a)
      a.click()
    },

    /**
     * 查看合同政策附件
     * @param {String} url: 文件url地址
     */
    handleShowContractFile(url) {
      window.open(url)
    },

     /**
     * @param {Object} e: 当前操作的dom对象
     * @param {Array} arr: 需要进行链接格式化的图片集合 
     */
    showBigImg(e, arr) {
      const target = e.target
      if(target.tagName === 'IMG') {
        this.bigImgShow = true
        this.bigImgArr = arr.map(item => item.urlShow)
        this.bigImgIndex = +target.dataset.index
      }
    },

    /**
     * 关闭大图
     */
    closeImgModal({ show, index, arr }) {
      this.bigImgShow = show
      this.bigImgIndex = index
      this.bigImgArr = arr
    },

    /**
     * 跳转对应导航
     */
    goToNavigation(target) {
      let path = target === 'contact' ? '/contract/contact-list' :
                 target === 'facade' ? '/contract/facade/list': 
                 target === 'order' ? '/order-management/review' : ''
      path && this.$router.push(`${path}?companyName=${this.detailData.merchantName}`)
    },

    /**
     * 跳转上级客户
     */
    goToHigherCustomer(id) {
      id > 0 && this.$router.push(`/contract/cooperative-customer/cooperative-detail?id=${id}`)
    },

    /**
     * 跳转不同签到详情
     * @param {String} type: 签到类型
     * @param {String|Number} id: 签到记录id
     */
    goToCheckinDeatil(type, id) {
      if (!type) return
      type = type === 'patrol' ? 'tour' :
             type === 'activity' ? 'activity' :
             type === 'stick_cabinet' ? 'counter' :
             type === 'street_worship' ? 'moobei':
             type === 'return_visit' ? 'visit':
             type === 'maintain' ? 'maintain': 'default'
      this.$router.push(`/field-management/attendance-details/${type}?id=${id}`)
    },

    // 返回
    goBack() {
      this.$router.push({
        path: '/contract/cooperative-customer/cooperative-list',
      })
    },

    // ------------------------------------ 方法 ------------------------------------
    
    formatCompanyType(type) {
      if(type == 1) {
        return '公司'
      } else if(type == 2) {
        return '⾹港公司'
      } else if(type == 3) {
        return '社会组织'
      } else if(type == 4) {
        return '律所'
      } else if(type == 5) {
        return '事业单位'
      } else if(type == 6) {
        return '基金会'
      }
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

    formatDate(time, type, hasDay = false) {
      const week = ['日', '一', '二', '三', '四', '五', '六'],
            day = new Date(time * 1000).getDay()
      type = type || 'yyyy-MM-dd hh:mm:ss'
      if (hasDay) return `${this.$format(time, type)} (星期${week[day]})`
      // 格式化时间
      return this.$format(time, type)
    },

    formatContractTemplate(t) {
      if(t === 'official') {
        return '我司合同'
      } else if(t === 'customer') {
        return '客户合同'
      }
    },

    /**
     * 格式化省份
     * @param {String} province: 省份编码
     */
    formatProvince(province) {
      let p = ''
      switch (province) {
        case 'HAN':
          p = '海南省'
          break;
        case 'GD':
          p = '广东省'
          break;
        case 'GX':
          p = '广西壮族自治区'
          break;
        case 'FJ':
          p = '福建省'
          break;
        case 'JX':
          p = '江西省'
          break;
        case 'HUN':
          p = '湖南省'
          break;
        case 'GZ':
          p = '贵州省'
          break;
        case 'YN':
          p = '云南省'
          break;
        case 'SH':
          p = '上海市'
          break;
        case 'ZJ':
          p = '浙江省'
          break;
        case 'AH':
          p = '安徽省'
          break;
        case 'HUB':
          p = '湖北省'
          break;
        case 'CQ':
          p = '重庆市'
          break;
        case 'SC':
          p = '四川省'
          break;
        case 'XZ':
          p = '西藏自治区'
          break;
        case 'JS':
          p = '江苏省'
          break;
        case 'HEN':
          p = '河南省'
          break;
        case 'SX':
          p = '陕西省'
          break;
        case 'GS':
          p = '甘肃省'
          break;
        case 'QH':
          p = '青海省'
          break;
        case 'SD':
          p = '山东省'
          break;
        case 'JIN':
          p = '山西省'
          break;
        case 'HEB':
          p = '河北省'
          break;
        case 'NX':
          p = '宁夏回族自治区'
          break;
        case 'BJ':
          p = '北京市'
          break;
        case 'TJ':
          p = '天津市'
          break;
        case 'LN':
          p = '辽宁省'
          break;
        case 'JL':
          p = '吉林省'
          break;
        case 'HLJ':
          p = '黑龙江省'
          break;
        case 'NMG':
          p = '内蒙古自治区'
          break;
        case 'XJ':
          p = '新疆维吾尔族自治区'
          break;
        case 'TW':
          p = '台湾省'
          break;
        case 'HK':
          p = '香港'
          break;
        case 'AM':
          p = '澳门'
          break;
        default:
          break;
      }
      return p
    },

    formatAuditPass(status) {
      if(status === '1') {
        return '通过'
      }else if(status === '0') {
        return '不通过'
      }
    },

    /**
     * 格式化省份
     * @param {String} province: 省份编码
     */
    formatOperationType(type) {
      let temp = ''
      switch (type) {
        case 'create':
          temp = '添加'
          break;
        case 'update':
          temp = '编辑'
          break;
        case 'allocate':
          temp = '零售分配'
          break;
        case 'withdraw':
          temp = '收回'
          break;
        case 'import':
          temp = '导入'
          break;
        case 'audit':
          temp = '审核'
          break;
        case 'return':
          temp = '退回'
          break;
        default:
          break;
      }
      return temp
    },

    /**
     * 格式化拜访类型
     * @param {String} type: 需格式化类型
     */
    formatCheckinType(type) {
      if (type === 'street_worship') return '陌拜'
      else if (type === 'return_visit') return '回访'
      else if (type === 'no_shop') return '无门店'
      else if (type === 'maintain') return '维护'
      else if (type === 'patrol') return '巡店'
      else if (type === 'activity') return '活动'
      else if (type === 'stick_cabinet') return '贴柜'
      else return ''
    },
  },
 
  mounted() {
    this.getDetail(this.id)
    this.getTableData('customerProfile')
  },

  watch: {
    $route(){
      // 重置数据
      this.receivingAddr.pageProps.page = this.childCustomer.pageProps.page = this.visitRecords.pageProps.page = this.logOperationData.pageProps.page = 1
      this.currentTabName = 'customerProfile'
      this.id = this.$route.query.id
      this.detailData = {
        companyInfo: {},
        auditLog: {},
        fileItems: [],
        businessLicense: [],
        contractsInfo: [],
        systemInfo: [],
      }
      document.getElementsByClassName('single-page-con')[0].scrollTop = 0  // 滚动条回到顶部
      this.getDetail(this.$route.query.id)
      this.getTableData('customerProfile')
    }
  }
}
</script>

<style lang="less" scoped>
.cooperative-detail {
  position: relative;
  .cooperative-detail-content {
    position: relative;
    .business {
      margin-left: 16px;
      .business-icon {
        display: inline-block;
        width: 25px;
        height: 25px;
        img {
          width: 100%;
          vertical-align: middle;
        }
      }
      .business-info {
        vertical-align: middle;
      }
    }
    .base-info {
      margin-bottom: 16px;
      .base-info-label {
        vertical-align: top;
      }
      .ivu-col {
        padding-left: 0;
        padding-right: 10px;
      }
      .voucher {
        display: inline-block;
        width: 100px;
        height: 100px;
        border: 1px solid #dcdee2;
        margin: 0 10px;
        overflow: hidden;
        transition: border 0.2s ease-in-out, background 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        img {
          width: 100%;
          height: 100%;
        }
        &:hover {
          border-color: #57a3f3;
          cursor: pointer;
        }
        &:first-child {
          margin-left: 0;
        }
      }
    }
    .profile-info {
      .ivu-col {
        padding-left: 0;
        padding-right: 10px;
      }
    }
    .contract-info {
      padding-left: 11px;
      .contract-info-box {
        border: 1px dashed #b8babc;
        margin-bottom: 16px;
        padding-top: 24px;
      }
    }
  }
}

/deep/ .shopaddress {
  input {
    text-align: left;
  }
}
.ivu-card {
  margin-bottom: 16px;
}
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
</style>
