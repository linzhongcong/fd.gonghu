<template>
  <div>
    <Card>
      <Row slot="title" type="flex" justify="end">
        <Button type="primary" @click="goBack">返回</Button>
      </Row>
      <Row>
        <Card>
          <div slot="title"><p>基本信息</p></div>
          <div>
            <Form label-position="right" :label-width="120">
              <Row type="flex" justify="start">
                <Col :md="8">
                  <FormItem label="公司名称：">
                    <Input v-model="detailData.companyInfo.name" readonly></Input>
                  </FormItem>
                  <div class="business-icon">
                    <img v-if="detailData.companyInfo.name" src="~/assets/images/company_success.png" alt="" />
                  </div>
                </Col>
                <Col :md="8">
                  <FormItem label="客户类型：">
                    <Input :value="formatMerchantType(detailData.merchantType)" readonly></Input>
                  </FormItem>
                </Col>
                <Col :md="8">
                  <FormItem label="省份：">
                    <Input v-model="detailData.companyInfo.base" readonly></Input>
                  </FormItem>
                </Col>
              </Row>
              <Row type="flex" justify="start">
                <Col :md="8">
                  <FormItem label="公司类型：">
                    <Input :value="changeCompanyType(detailData.companyInfo.companyType)" readonly></Input>
                  </FormItem>
                </Col>
                <Col :md="8">
                  <FormItem label="注册资本：">
                    <Input v-model="detailData.companyInfo.regCapital" readonly></Input>
                  </FormItem>
                </Col>
                <Col :md="8">
                  <FormItem label="成立日期：">
                    <Input v-model="detailData.companyInfo.establishTime" readonly></Input>
                  </FormItem>
                </Col>
              </Row>
              <Row type="flex" justify="start">
                <Col :md="8">
                  <FormItem label="经营状态：">
                    <Input v-model="detailData.companyInfo.regStatus" readonly></Input>
                  </FormItem>
                </Col>
                <Col :md="8">
                  <FormItem label="组织机构代码：">
                    <Input v-model="detailData.companyInfo.orgNumber" readonly></Input>
                  </FormItem>
                </Col>
                <Col :md="8">
                  <FormItem label="统一社会信用代码：">
                    <Input v-model="detailData.companyInfo.creditCode" readonly></Input>
                  </FormItem>
                </Col>
              </Row>
              <Row type="flex" justify="start">
                <Col :md="8">
                  <FormItem label="法人：">
                    <Input v-model="detailData.companyInfo.legalPersonName" readonly></Input>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col :md="8">
                  <FormItem label="创建人姓名：">
                    <Input v-model="detailData.createdBy" readonly></Input>
                  </FormItem>
                </Col>
                <Col :md="8">
                  <FormItem label="创建时间：">
                    <Input :value="formatDate(detailData.createdAt)" readonly></Input>
                  </FormItem>
                </Col>
              </Row>
              <Row type="flex" justify="start">
                <Col :md="8">
                  <FormItem label="系统/门店名称：">
                    <Input v-model="detailData.leadsFacade.name" readonly></Input>
                  </FormItem>
                </Col>
                <Col :md="16">
                  <FormItem label="门店地址：">
                    <Input v-model="detailData.leadsFacade.address" readonly></Input>
                  </FormItem>
                </Col>
              </Row>
              <Row type="flex" justify="start">
                <Col :md="24">
                  <FormItem label="备注：">
                    <Input type="textarea" v-model="detailData.remark" readonly></Input>
                  </FormItem>
                </Col>
              </Row>
              <Row type="flex" justify="start">
                <Col>
                  <FormItem label="招牌/门头照：">
                    <div v-for="(item, index) in detailData.facadeSignFileItems" class="voucher" @click="showImg(item.objectUrl)">
                      <img :src="item.objectUrl" />
                    </div>
                  </FormItem>
                </Col>
              </Row>
              <Row type="flex" justify="start">
                <Col>
                  <FormItem label="门店整体照：">
                    <div v-for="(item, index) in detailData.overFacadeFileItems" class="voucher" @click="showImg(item.objectUrl)">
                      <img :src="item.objectUrl" />
                    </div>
                  </FormItem>
                </Col>
              </Row>
              <Row type="flex" justify="start">
                <Col>
                  <FormItem label="面膜区/水乳区照：">
                    <div v-for="(item, index) in detailData.maskAreaFileItems" class="voucher" @click="showImg(item.objectUrl)">
                      <img :src="item.objectUrl" />
                    </div>
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </div>
        </Card>
      </Row>
      <!-- 联系人信息 start -->
      <Row>
        <Card>
          <div slot="title"><p>联系人信息</p></div>
          <Row type="flex" justify="end" style="margin-bottom: 10px;">
            <Button type="primary" @click="$router.push('/contract/contact-list')">添加</Button>
          </Row>
          <div>
            <Table class="review-list" :loading="contactsData.tabLoading" border highlight-row :columns="contactsData.columns" :data="contactsData.data" size="small"></Table>
          </div>
          <div style="margin: 10px;overflow: hidden">
            <div class="pages-L">共 {{ contactsData.pageProps.totalCount }} 条</div>
            <div style="float: right;">
              <Page
                :total="contactsData.pageProps.totalCount"
                size="small"
                :current="contactsData.pageProps.currentPage"
                show-sizer
                show-elevator
                @on-change="(e) => changePage('contactsData', e)"
                @on-page-size-change="(e) => changePageSize('contactsData', e)"
              ></Page>
            </div>
          </div>
        </Card>
      </Row>
      <!-- 联系人信息 end -->
      <Row>
        <Card>
          <div slot="title"><p>拜访日志</p></div>
          <div>
            <Table class="review-list" :loading="logData.tabLoading" border highlight-row :columns="logData.columns" :data="logData.data" size="small"></Table>
          </div>
          <div style="margin: 10px;overflow: hidden">
            <div class="pages-L">共 {{ logData.pageProps.totalCount }} 条</div>
            <div style="float: right;">
              <Page
                :total="logData.pageProps.totalCount"
                size="small"
                :current="logData.pageProps.currentPage"
                show-sizer
                show-elevator
                @on-change="(e) => changePage('logData', e)"
                @on-page-size-change="(e) => changePageSize('logData', e)"
              ></Page>
            </div>
          </div>
        </Card>
      </Row>
    </Card>

    <!-- 点击图片放大 -->
    <Modal 
      v-model="imgModal.show"
      footer-hide
      width="550"
    >
      <!-- 占位 -->
      <div style="height:28px"></div>
      <img style="width: 100%" :src="imgModal.url" alt="">
    </Modal>
  </div>
</template>
<script>
import mixin from '../mixins'
export default {
  mixins: [mixin],
  data() {
    return {
      id: this.$route.query.id,
      logData: {
        columns: [
          { title: '拜访人', key: 'createdBy', minWidth: 90, align: 'center' },
          {
            title: '签到时间',
            minWidth: 100,
            align: 'center',
            render: (h, params) => {
              if(params.row.signInAt === '') {
                return h('span', ' ')
              }
              let date = this.formatDate(new Date(+params.row.signInAt)),
                  arr = date.trim().split(' ')
              return h('div', [h('p', arr[0]), h('p', arr[1])])
            },
          },
          {
            title: '签到图片',
            minWidth: 120,
            align: 'center',
            render: (h, params) => {
              let items = params.row.checkinFileItems,
                  arr = []
              if(items.length === 0) {
                return h('span', ' ')
              }
              for(let i=0; i<items.length; i++) {
                arr.push(
                  h('a', {
                    style: {
                      marginRight: '5px',
                    },
                    on: {
                      click: () => {
                        this.showImg(items[i].objectUrl)
                      }
                    }
                  }, `图${i+1}`)
                )
              }
              return h('div', arr)
            },
          },
          {
            title: '签退图片',
            minWidth: 100,
            align: 'center',
            render: (h, params) => {
            let items = params.row.checkoutFileItems,
                  arr = []
              if(items.length === 0) {
                return h('span', ' ')
              }
              for(let i=0; i<items.length; i++) {
                arr.push(
                  h('a', {
                    style: {
                      marginRight: '5px',
                    },
                    on: {
                      click: () => {
                        this.showImg(items[i].objectUrl)
                      }
                    }
                  }, `图${i+1}`)
                )
              }
              return h('div', arr)
            },
          },
          { title: '备注', key: 'remark', minWidth: 300, align: 'center' },
        ],
        data: [],
        pageProps: {
          page: 1,
          perPage: 10,
          currentPage: 1,
          totalCount: 0,
        },
        tabLoading: false
      },
      detailData: {
        leadsFacade: {},
        companyInfo: {},
        facadeSignFileItems: [], // 门头照
        maskAreaFileItems: [], // 面膜呈列区
        overFacadeFileItems: [], // 门店整体照
      },
      contactsData: {
        columns: [
          { title: '序号',
            minWidth: 80,
            align: 'center',
            render: (h, params) => h('span', params.index + 1)
          },
          { title: '联系人姓名', key: 'contactName', minWidth: 110, align: 'center' },
          { title: '联系人电话', key: 'contactPhone', minWidth: 130, align: 'center' },
          { title: '联系人职务', key: 'contactJob', minWidth: 120, align: 'center' },
          { 
            title: '创建时间',
            minWidth: 160,
            align: 'center',
            render: (h, params) => h('span', this.formatDate(params.row.createdAt))
          }
        ],
        data: [],
        pageProps: {
          page: 1,
          perPage: 10,
          currentPage: 1,
          totalCount: 0
        },
        tabLoading: false
      },
      // 列表分页属性
      pageProps: {
        page: 1,
        perPage: 10,
        currentPage: 1,
        totalCount: 0,
      },
      imgModal: {
        show: false,
        url: ''
      },
    }
  },
  methods: {
    /**
     * 改变页数事件
     * @param {Number} e：返回的页数
     */
    changePage(type, e) {
      this[type].pageProps.page = e
      if(type === 'logData') this.getLog(this.id)
      if(type === 'contactsData') this.getContactsInfo(this.id)
    },

    /**
     * 改变页码事件
     * @param {Number} e：返回的页数
     */
    changePageSize(type, e) {
      this[type].pageProps.perPage = e
      if(type === 'logData') this.getLog(this.id)
      if(type === 'contactsData') this.getContactsInfo(this.id)
    },

    goBack() {
      this.$store.commit('removeTag', this.$route.name)
      this.$router.push({ path: '/contract/development-partner-management/development-partner' })
    },

    getDetail(id) {
      this.$api.cuePoolDeatil({ id }).then((res) => {
        if (res.code === 0) {
          this.detailData = res.data
          this.detailData.companyInfo = res.data.companyInfo || {}
          this.detailData.leadsFacade = res.data.leadsFacade || {}
          this.detailData.facadeSignFileItems = res.data.facadeSignFileItems || []
          this.detailData.maskAreaFileItems = res.data.maskAreaFileItems || []
          this.detailData.overFacadeFileItems = res.data.overFacadeFileItems || []
        }
      })
    },

    // 获取拜访日志
    getLog(contractorId) {
      this.logData.tabLoading = true
      let page = this.logData.pageProps.page,
          perPage = this.logData.pageProps.perPage
      this.$api.cuePoolLog({contractorId, page, perPage}).then((res) => {
        if(res.code === 0) {
          this.logData.data = res.data.items
          this.logData.pageProps.totalCount = res.data._meta.totalCount
          this.logData.pageProps.currentPage = res.data._meta.currentPage
          this.logData.tabLoading = false
        }
      })
      .catch((err) => {
        this.logData.tabLoading = false
      })
    },

    // 获取联系人信息
    getContactsInfo(contractorId) {
      this.contactsData.tabLoading = true
      let page = this.contactsData.pageProps.page,
          perPage = this.contactsData.pageProps.perPage
      this.$api.cooperativeContactsList({contractorId, page, perPage}).then((res) => {
        this.contactsData.data = res.items
        this.contactsData.pageProps.totalCount = res._meta.totalCount
        this.contactsData.pageProps.currentPage = res._meta.currentPage
        this.contactsData.tabLoading = false
      })
      .catch((err) => {
        this.contactsData.tabLoading = false
      })
    },

    goToContactsInfo() {
      this.$router.push('/contract/contact-list')
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

    formatDate(time) {
      // 格式化时间
      return this.$format(time, 'yyyy-MM-dd hh:mm:ss')
    },
    showImg(url) {
      this.imgModal.show = true
      this.imgModal.url = url
    }
  },
  mounted() {
    this.getDetail(this.id)
    this.getLog(this.id)
    this.getContactsInfo(this.id)
  },
}
</script>

<style lang="less" scpoed>
// .ivu-form-item {
//   margin-bottom: 10px;
// }
.voucher {
  display: inline-block;
  width: 120px;
  height: 120px;
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

.business-icon {
  position: absolute;
  width: 20px;
  height: 20px;
  top: 6px;
  right: -25px;
  img {
    width: 100%;
  }
}

</style>
