<template>
  <div>
    <Card>
      <Row slot="title" type="flex" justify="end">
        <Button @click="goBack">返回</Button>
      </Row>
      <Card>
        <div slot="title"><p>门店信息</p></div>
        <div>
          <Form :label-width="110">
            <Row>
              <Col :md="16">
                <FormItem label="公司名称：">
                  <div class="company-box">
                    <a href="javascript:;" @click="goToCooperativeDetail(detailData.contractorId)">{{detailData.merchantName}}</a>
                  </div>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col :md="8">
                <FormItem label="门店编号：">
                  <Input :value="detailData.number" readonly/>
                </FormItem>
              </Col>
              <Col :md="8">
                <FormItem label="系统/门店名称：">
                  <Input :value="detailData.systemInfo.name" readonly/>
                </FormItem>
              </Col>
              <Col :md="8">
                <FormItem label="客户类型：">
                  <Input :value="formatMerchantType(detailData.merchantType)" readonly/>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col :md="8">
                <FormItem label="门店名称：">
                  <Input :value="detailData.name" readonly/>
                </FormItem>
              </Col>
              <Col :md="8">
                <FormItem label="进驻品牌：">
                  <Input :value="detailData.inBrands" readonly/>
                </FormItem>
              </Col>
              <Col :md="8">
                <FormItem label="零售负责人：">
                  <Input :value="detailData.followBy" readonly/>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col :md="8">
                <FormItem label="门店地区：">
                  <Input :value="detailData.area" readonly/>
                </FormItem>
              </Col>
              <Col :md="16">
                <FormItem label="门店地址：">
                  <Input :value="detailData.address" readonly/>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col :md="8">
                <FormItem label="城市等级：">
                  <Input :value="formatCityLevel(detailData.cityLevel)" readonly/>
                </FormItem>
              </Col>
              <Col :md="8">
                <FormItem label="门店商圈：">
                  <Input :value="formatTradeArea(detailData.tradeArea)" readonly/>
                </FormItem>
              </Col>
              <Col :md="8">
                <FormItem label="商圈级别：">
                  <Input :value="formatTradeAreaLevel(detailData.tradeAreaLevel)" readonly/>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col :md="8">
                <FormItem label="门店类型：">
                  <Input :value="formatType(detailData.type)" readonly/>
                </FormItem>
              </Col>
              <Col :md="8">
                <FormItem label="门店规模：">
                  <Input :value="formatSize(detailData.size)" readonly/>
                </FormItem>
              </Col>
              <Col :md="8">
                <FormItem label="门店商品类型：">
                  <Input :value="formatGoodsType(detailData.goodsType)" readonly/>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col :md="8">
                <FormItem label="经营状态：">
                  <Input :value="detailData.hasBa" readonly/>
                </FormItem>
              </Col>
              <Col :md="8">
                <FormItem label="BA情况：">
                  <Input :value="detailData.hasBa" readonly/>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
      </Card>
      <Card>
        <div slot="title"><p>拜访日志</p></div>
        <Table 
          border
          :data="visitLog.data"
          :columns="visitLog.columns"
          :loading="visitLog.loading"
          size="small"
        ></Table>
        <div style="margin: 10px;overflow: hidden">
          <div class="pages-L">共 {{ visitLog.pageProps.totalCount }} 条</div>
          <div style="float: right;">
            <Page
              :total="visitLog.pageProps.totalCount"
              size="small"
              :current="visitLog.pageProps.currentPage"
              show-sizer
              show-elevator
              @on-change="(e) => changePage(e, 'operationLog')"
              @on-page-size-change="(e) => changePageSize(e, 'operationLog')"
            ></Page>
          </div>
        </div>
      </Card>
      <Card>
        <div slot="title"><p>操作日志</p></div>
        <Table 
          border
          :data="operationLog.data"
          :columns="operationLog.columns"
          :loading="operationLog.loading"
          size="small"
        ></Table>
        <div style="margin: 10px;overflow: hidden">
          <div class="pages-L">共 {{ operationLog.pageProps.totalCount }} 条</div>
          <div style="float: right;">
            <Page
              :total="operationLog.pageProps.totalCount"
              size="small"
              :current="operationLog.pageProps.currentPage"
              show-sizer
              show-elevator
              @on-change="(e) => changePage(e, 'operationLog')"
              @on-page-size-change="(e) => changePageSize(e, 'operationLog')"
            ></Page>
          </div>
        </div>
      </Card>
      <Spin fix v-if="spinShow"></Spin>
    </Card>
    <Modal v-model="showImgModal" footer-hide width="600">
      <!-- 占位 -->
      <div style="height:28px"></div>
      <img style="width: 100%" :src="showImgUrl" alt="" />
    </Modal>
  </div>
</template>

<script>
import mixin from '../mixins'
export default {
  mixins: [mixin],
  data () {
    return {
      id: this.$route.query.id,
      spinShow: false,
      showImgModal: false,
      showImgUrl: '',
      visitLog: {
        loading: false,
        columns: [
          { title: '拜访人', key: 'createdBy', minWidth: 90, align: 'center' },
          {
            title: '签到时间',
            minWidth: 150,
            align: 'center',
            render: (h, params) => {
              return h('div', this.formatDate(params.row.signInAt))
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
          { title: '备注', key: 'remark', minWidth: 300, align: 'center' },
        ],
        data: [],
        pageProps: {
          page: 1,
          perPage: 1,
          currentPage: 1,
          totalCount: 0
        }
      },
      operationLog: {
        loading: false,
        columns: [
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
        pageProps: {
          page: 1,
          perPage: 1,
          currentPage: 1,
          totalCount: 0
        }
      },
      detailData: {
        systemInfo: {}
      },
    }
  },
  methods: {
    async getDeatil(id) {
      let res
      this.spinShow = true
      try {
        res = await this.$api.contractorFacadeDetail({id, version: 'v2'})
        if(res.code === 0) {
          let data = res.data
          data.systemInfo = data.systemInfo || {}
          data.inBrands = data.inBrands && data.inBrands.toUpperCase()
          data.hasBa = data.hasBa && data.hasBa === '1' ? '有BA' : '无BA'
          data.area = data.province && data.city && data.county ? data.province + data.city + data.county : ''
          this.detailData = data
          this.spinShow = false
        }
      } catch (err) {
        this.$Notice.error({
          title: err.code,
          desc: err.message
        })
      }
    },

    async getVisitLog() {
      this.visitLog.loading = true
      let res, params = {
        facadeId: this.id,
        page: this.visitLog.pageProps.page,
        perPage: this.visitLog.pageProps.perPage
      }
      try {
        res = await this.$api.cuePoolLog(params)
        if(res.code === 0) {
          this.visitLog.loading = false
          this.visitLog.data = res.data.items
          this.visitLog.pageProps.totalCount = res.data._meta.totalCount
          this.visitLog.pageProps.currentPage = res.data._meta.currentPage
        }
      } catch (err) {
        this.visitLog.loading = false
        this.$Notice.error({
          title: err.code,
          desc: err.message
        })
      }
    },

    async getOperationLog() {
      this.operationLog.loading = true
      let res, params = {
        objectId: this.id,
        moduleName: 'facade',
        page: this.operationLog.pageProps.page,
        perPage: this.operationLog.pageProps.perPage
      }
      try {
        res = await this.$api.contractorOperationLog(params)
        this.operationLog.data = res.items
        this.operationLog.pageProps.totalCount = res._meta.totalCount
        this.operationLog.pageProps.currentPage = res._meta.currentPage
        this.operationLog.loading = false
      } catch (err) {
        this.operationLog.loading = false
        this.$Notice.error({
          title: err.code,
          desc: err.message
        })
      }
    },

    changePage(e, prop) {
      this[prop].pageProps.page = e
      prop === 'visitLog' ? this.getVisitLog() : this.getOperationLog()
    },

    changePageSize(e, prop) {
      this[prop].pageProps.perPage = e
      prop === 'visitLog' ? this.getVisitLog() : this.getOperationLog()
    },

    showImg(url) {
      this.showImgModal = true
      this.showImgUrl = url
    },

    goToCooperativeDetail(id) {
      this.$router.push({
        path: '/contract/cooperative-customer/cooperative-detail',
        query: { id }
      })
    },

    goBack() {
      this.$router.push('/contract/facade/list')
    },

    formatDate(time, type) {
      type = type || 'yyyy-MM-dd hh:mm:ss'
      return this.$format(time, type)
    },

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

    formatType(type) {
      let temp = ''
      switch (type) {
        case 'singleStore':
          temp = '单体店'
          break;
        case 'regionalChain':
          temp = '区域性连锁'
          break;
        case 'topChain':
          temp = '百强连锁'
          break;
        default:
          break;
      }
      return temp
    },

    formatSize(type) {
      let temp = ''
      switch (type) {
        case 's':
          temp = '小店'
          break;
        case 'm':
          temp = '中店'
          break;
        case 'l':
          temp = '大店'
          break;
        case 'xl':
          temp = '特大店'
          break;
        default:
          break;
      }
      return temp
    },

    formatGoodsType(type) {
      let temp = ''
      switch (type) {
        case 'importBase':
          temp = '进口品为主'
          break;
        case 'homeBase':
          temp = '国产为主'
          break;
        case 'ownBase':
          temp = '只有为主'
          break;
        case 'hotBase':
          temp = '网红品为主'
          break;
        case 'mixSale':
          temp = '混合销售'
          break;
        default:
          break;
      }
      return temp
    },

    formatTradeArea(type) {
      let temp = ''
      switch (type) {
        case 'shoppingCenter':
          temp = '购物中心'
          break;
        case 'businessStreet':
          temp = '商业街'
          break;
        case 'pedestrianStreet':
          temp = '步行街'
          break;
        case 'communityStore':
          temp = '社区店'
          break;
        case 'countryStore':
          temp = '乡镇店'
          break;
        default:
          break;
      }
      return temp
    },

    formatTradeAreaLevel(type) {
      let temp = ''
      switch (type) {
        case '1':
          temp = '一级商圈'
          break;
        case '2':
          temp = '二级商圈'
          break;
        case '3':
          temp = '三级商圈'
          break;
        default:
          break;
      }
      return temp
    },

    formatCityLevel(type) {
      let temp = ''
      switch (type) {
        case 'first':
          temp = '一线城市'
          break;
        case 'newFirst':
          temp = '新一线城市'
          break;
        case 'second':
          temp = '二线城市'
          break;
        case 'third':
          temp = '三线城市'
          break;
        case 'fourth':
          temp = '四线城市'
          break;
        case 'fifth':
          temp = '五线城市'
          break;
        default:
          break;
      }
      return temp
    },
  },
  mounted() {
    this.getDeatil(this.id)
    this.getVisitLog()
    this.getOperationLog()
  }
}

</script>
<style lang='less' scoped>
.ivu-card {
  margin-bottom: 10px;
  p {
    font-weight: bolder;
  }
  .company-box {
    width: 100%;
    height: 32px;
    line-height: 1.5;
    padding: 4px 7px;
    font-size: 14px;
    border: 1px solid #dcdee2;
    border-radius: 4px;
    background-color: #fff;
    background-image: none;
    position: relative;
    cursor: text;
    transition: border .2s ease-in-out,background .2s ease-in-out,box-shadow .2s ease-in-out;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    &:hover {
      border-color: #57a3f3;
    }
  }

}
</style>