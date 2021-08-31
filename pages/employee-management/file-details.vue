<template>
  <div class="file-details">
    <Card>
      <Card style="margin-bottom: 16px;">
        <template slot="title">
          <Row type="flex" justify="end">
            <Button type="primary" @click="goBack">返回</Button>
          </Row>
        </template>
        <div style="width: 80%;">
          <h3 style="font-size: 14px;">基础信息</h3>
          <Form label-position="right" :label-width="80" class="detail-form">
            <Row type="flex" class="margin-bottom-10">
              <div class="avatar">
                <div>
                  <img :src="detailData.avatarUrl" alt="头像" v-if="detailData.avatarUrl">
                  <img src="~assets/images/avatar.png" alt="头像" v-else>
                </div>
              </div>
              <div class="info">
                <p>{{detailData.username}}</p>
                <p>{{detailData.realName}}</p>
              </div>
            </Row>
            <Row>
              <Col :md="24" class="detail-profile">
                <FormItem label="个人简历:">
                  <Input 
                    type="textarea" 
                    :autosize="{ minRows: 2 }" 
                    :value="detailData.profile" 
                    readonly />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col :md="24" class="detail-profile">
                <FormItem label="目标:">
                    <Input 
                    type="textarea" 
                    :autosize="{ minRows: 2 }" 
                    :value="detailData.target" 
                    readonly />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col :md="8">
                <FormItem label="部门-中心:">
                  <Input :value="detailData.deptName" readonly/>
                </FormItem>
              </Col>
              <Col :md="8">
                <FormItem label="系统部门:">
                  <Input :value="detailData.offlineDeptName" readonly/>
                </FormItem>
              </Col>
              <Col :md="8">
                <FormItem label="职位:">
                  <Input :value="detailData.jobStation" readonly/>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col :md="8">
                <FormItem label="联系方式:">
                  <Input :value="detailData.telephone" readonly/>
                </FormItem>
              </Col>
              <Col :md="8">
                <FormItem label="微信号:">
                  <Input :value="detailData.weChatNum" readonly/>
                </FormItem>
              </Col>
              <Col :md="8">
                <FormItem label="员工状态:">
                  <Input :value="detailData.resignAt > 0 ? '离职' : '在职'" readonly/>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col :md="8">
                <FormItem label="入职时间:">
                  <Input :value="detailData.workingAt" readonly/>
                </FormItem>
              </Col>
              <Col :md="8">
                <FormItem label="在职时长:">
                  <Input :value="detailData.workingTime" readonly/>
                </FormItem>
              </Col>
              <Col :md="8">
                <FormItem label="系统状态:">
                  <Input :value="detailData.canCheckin > 0 ? '启用' : '禁用'" readonly/>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
      </Card>
      <Card>
        <Tabs v-model="currentTab">
          <TabPane label="签到记录" name="checkIn">
            <Form label-position="right" :label-width="90">
              <Row type="flex" justify="start">
                <Col :md='5'>
                  <FormItem label="签到总次数：" :label-width="90">
                    <Input :value="checkIn.form.count" readonly/>
                  </FormItem>
                </Col>
                <Col :md='5'>
                  <FormItem label="最后一次签到时间：" :label-width="130">
                    <Input :value="$format(checkIn.form.signin_at, 'yyyy-MM-dd')" readonly/>
                  </FormItem>
                </Col>
                <Col :md='5'>
                  <FormItem label="签到类型：">
                    <Input :value="switchCheckInType(checkIn.form.checkin_way)" readonly/>
                  </FormItem>
                </Col>
                <Col :md='5'>
                  <FormItem label="签到门店：">
                    <Input :value="checkIn.form.merchant_name" readonly/>
                  </FormItem>
                </Col>
              </Row>
            </Form>
            <Table border :columns="checkIn.columns" :data="checkIn.data" :loading="checkIn.loading"/>
            <div style="position: relative">

              <Row>
                <div style="float: right; padding-top: 20px">
                  <Page
                  :total="checkIn.pageProps.total"
                  :page-size="checkIn.pageProps.perPage"
                  :current="checkIn.pageProps.page"
                  :page-size-opts="pagesizeOpts"
                  show-total
                  show-elevator
                  show-sizer
                  transfer
                  size="small"
                  @on-change="page => {pageChange(page, 'checkIn')}"
                  @on-page-size-change="pageSize => {pageSizeChange(pageSize, 'checkIn')}"/>
                </div>
              </Row>
            </div>
          </TabPane>
          <TabPane label="开拓门店" name="store">
            <Form label-position="right" :label-width="20">

              <Row type="flex" justify="start">
                <Col :md='6'>
                  <FormItem label="总开拓门店：" :label-width="100">
                    <Input :value="store.form.count" readonly/>
                  </FormItem>
                </Col>
                <Col :md='6'>
                  <FormItem label="最近开拓门店：" :label-width="100">
                    <Input :value="store.form.name" readonly/>
                  </FormItem>
                </Col>
                <Col :md='6'>
                  <FormItem label="客户分类：" :label-width="100">
                    <Input :value="store.form.level" readonly/>
                  </FormItem>
                </Col>
                <Col :md='6'>
                  <FormItem label="最近拜访时间：" :label-width="100">
                    <Input :value="store.form.created_at" readonly/>
                  </FormItem>
                </Col>
              </Row>
              <Row type="flex" justify="space-around">
                <Col>
                  <FormItem label="S：">
                    <Input :value="store.form.S" readonly/>
                  </FormItem>
                </Col>
                <Col>
                  <FormItem label="A：">
                    <Input :value="store.form.A" readonly/>
                  </FormItem>
                </Col>
                <Col>
                  <FormItem label="B：">
                    <Input :value="store.form.B" readonly/>
                  </FormItem>
                </Col>
                <Col>
                  <FormItem label="C：">
                    <Input :value="store.form.C" readonly/>
                  </FormItem>
                </Col>
                <Col>
                  <FormItem label="D：">
                    <Input :value="store.form.D" readonly/>
                  </FormItem>
                </Col>
              </Row>
            </Form>
            <Table border :columns="store.columns" :data="store.data" :loading="store.loading"/>
            <Row>
              <div style="float: right; padding-top: 20px">
                <Page
                :total="store.pageProps.total"
                :page-size="store.pageProps.perPage"
                :current="store.pageProps.page"
                :page-size-opts="pagesizeOpts"
                show-total
                show-elevator
                show-sizer
                transfer
                size="small"
                @on-change="page => {pageChange(page, 'store')}"
                @on-page-size-change="pageSize => {pageSizeChange(pageSize, 'store')}"/>
              </div>
            </Row>
          </TabPane>
          <TabPane label="票务信息" name="ticket">
            <Card class="margin-bottom-10">
              <Row type="flex" justify="space-between"
                   style="border-bottom: 1px solid #f3f3f3; padding-bottom: 10px; margin-bottom: 10px;">
                <Col>线下渠道酒店预订</Col>
                <Col>
                  <Button type="primary" @click="exportData('exportHotelList')">导出</Button>
                </Col>
              </Row>
              <Row>
                <Table border :columns="ticket.hotelColumns" :data="ticket.hotelData" :loading="ticket.hotelLoading"/>
              </Row>

              <div style="position: relative">
                <Row>
                  <div style="float: right; padding-top: 20px">
                    <Page
                    :total="ticket.hotelPageProps.total"
                    :page-size="ticket.hotelPageProps.perPage"
                    :current="ticket.hotelPageProps.page"
                    :page-size-opts="pagesizeOpts"
                    show-total
                    show-elevator
                    show-sizer
                    transfer
                    size="small"
                    @on-change="page => {pageChange(page, 'hotel')}"
                    @on-page-size-change="pageSize => {pageSizeChange(pageSize, 'hotel')}"/>
                  </div>
                </Row>

              </div>
            </Card>

            <Card>
              <Row type="flex" justify="space-between"
                   style="border-bottom: 1px solid #f3f3f3; padding-bottom: 10px; margin-bottom: 10px;">
                <Col>线下渠道车票预订</Col>
                <Col>
                  <Button type="primary" @click="exportData('exportTrafficList')">导出</Button>
                </Col>
              </Row>
              <Row>
                <Table border :columns="ticket.trafficColumns" :data="ticket.trafficData" :loading="ticket.trafficLoading"/>
              </Row>

              <div style="position: relative">
                <Row>
                  <div style="float: right; padding-top: 20px">
                    <Page
                    :total="ticket.trafficPageProps.total"
                    :page-size="ticket.trafficPageProps.perPage"
                    :current="ticket.trafficPageProps.page"
                    :page-size-opts="pagesizeOpts"
                    show-total
                    show-elevator
                    show-sizer
                    transfer
                    size="small"
                    @on-change="page => {pageChange(page, 'traffic')}"
                    @on-page-size-change="pageSize => {pageSizeChange(pageSize, 'traffic')}"/>
                  </div>
                </Row>
              </div>
            </Card>
          </TabPane>
        </Tabs>
      </Card>
    </Card>

    <!-- 审核详情 -->
    <Modal v-model="reivewDetail.show" width="970px" footer-hide title="审核详情">
      <div style="height:430px; overflow-y: scroll">
        <table class="review-table">
          <tbody v-if="reivewDetail.isHotel">
            <tr>
              <td class="table-title">申请人</td>
              <td colspan="2">{{reivewDetail.data.createdName}}</td>
              <td class="table-title">申请部门</td>
              <td colspan="4">{{reivewDetail.data.createdDept}}</td>
            </tr>
            <tr>
              <td class="table-title">联系电话</td>
              <td colspan="2">{{reivewDetail.data.createdPhone}}</td>
              <td class="table-title">城市</td>
              <td colspan="4">{{reivewDetail.data.city}}</td>
            </tr>
            <tr>
              <td class="table-title">酒店名称</td>
              <td colspan="8">{{reivewDetail.data.hotelName}}</td>
            </tr>
            <tr>
              <td class="table-title">飞猪网链接</td>
              <td colspan="8">{{reivewDetail.data.link}}</td>
            </tr>
            <tr>
              <td class="table-title">酒店地址</td>
              <td colspan="8">{{reivewDetail.data.address}}</td>
            </tr>
            <tr>
              <td class="table-title">住宿日期</td>
              <td colspan="2">{{reivewDetail.data.startAt}}</td>
              <td class="table-title">离宿日期</td>
              <td colspan="2">{{reivewDetail.data.endAt}}</td>
            </tr>
            <tr>
              <td class="table-title">预订酒店事由</td>
              <td colspan="8">{{reivewDetail.data.cause}}</td>
            </tr>
            <tr>
              <td class="table-title">备注</td>
              <td colspan="8">{{reivewDetail.data.remark}}</td>
            </tr>
            <tr>
              <td class="table-title">入住人数</td>
              <td colspan="2">{{reivewDetail.data.peopleNumber}}</td>
              <td class="table-title">入住人员</td>
              <td colspan="4">{{reivewDetail.data.all.length ? reivewDetail.data.all.join(' ') : ''}}</td>
            </tr>
            <tr v-for="(items, index) in reivewDetail.data.tenant" :key="index">
              <td class="table-title">{{items.max > 1 ? '合住人员' : '单住人员'}}</td>
              <td colspan="2">{{items.name.join(' ')}}</td>
              <td class="table-title">房价</td>
              <td colspan="4">{{Number(items.price).toFixed(2)}}</td>
            </tr>
            <tr>
              <td class="table-title">直属上级审核人</td>
              <td colspan="2">{{reivewDetail.data.firstAudit.firstCreatedBy}}</td>
              <td class="table-title">审核结果</td>
              <td colspan="4">{{switchAuditStatus(reivewDetail.data.firstAudit.firstIsPass)}}</td>
            </tr>
            <tr>
              <td class="table-title">审核意见</td>
              <td colspan="8">{{reivewDetail.data.firstAudit.firstOpinion}}</td>
            </tr>
            <tr>
              <td class="table-title">行政审核人</td>
              <td colspan="2">{{reivewDetail.data.secondAudit.secondCreatedBy}}</td>
              <td class="table-title">审核结果</td>
              <td colspan="4">{{switchAuditStatus(reivewDetail.data.secondAudit.secondIsPass)}}</td>
            </tr>
            <tr>
              <td class="table-title">审核意见</td>
              <td colspan="8">{{reivewDetail.data.secondAudit.secondOpinion}}</td>
            </tr>
            <tr>
              <td class="table-title">反馈信息</td>
              <td colspan="8">{{reivewDetail.data.feedback}}</td>
            </tr>
          </tbody>

          <tbody v-else>
            <tr>
              <td class="table-title">申请人</td>
              <td colspan="2">{{reivewDetail.data.trafficCreatedBy}}</td>
              <td class="table-title">申请部门</td>
              <td colspan="4">{{reivewDetail.data.trafficDept}}</td>
            </tr>
            <tr>
              <td class="table-title">票类型</td>
              <td colspan="2">{{reivewDetail.data.trafficType}}</td>
              <td class="table-title">出发地点</td>
              <td colspan="2">{{reivewDetail.data.trafficStartFrom}}</td>
              <td class="table-title">出发地点</td>
              <td colspan="2">{{reivewDetail.data.trafficTargetTo}}</td>
            </tr>
            <tr>
              <td class="table-title">出差事由</td>
              <td colspan="8">{{reivewDetail.data.trafficCause}}</td>
            </tr>
            <tr>
              <td class="table-title">出发日期</td>
              <td colspan="8">{{reivewDetail.data.trafficStartAt}}</td>
            </tr>
            <tr v-for="(items, index) in reivewDetail.data.classes" :key="index">
              <td class="table-title">班次</td>
              <td colspan="2">{{items.label}}</td>
              <td class="table-title">票价</td>
              <td colspan="2">{{Number(items.price).toFixed(2)}}</td>
              <td class="table-title">发车时间</td>
              <td colspan="2">{{items.departAt}}</td>
            </tr>
            <tr v-for="(items, index) in reivewDetail.data.member" :key="index">
              <td class="table-title">人员姓名</td>
              <td colspan="2">{{items.name}}</td>
              <td class="table-title">手机话</td>
              <td colspan="2">{{items.phone}}</td>
              <td class="table-title">身份证号</td>
              <td colspan="2">{{items.number}}</td>
            </tr>
            <tr>
              <td class="table-title">直属上级审核人</td>
              <td colspan="2">{{reivewDetail.data.firstAudit.firstCreatedBy}}</td>
              <td class="table-title">审核结果</td>
              <td colspan="4">{{switchAuditStatus(reivewDetail.data.firstAudit.firstIsPass)}}</td>
            </tr>
            <tr>
              <td class="table-title">审核意见</td>
              <td colspan="8">{{reivewDetail.data.firstAudit.firstOpinion}}</td>
            </tr>
            <tr>
              <td class="table-title">行政审核人</td>
              <td colspan="2">{{reivewDetail.data.secondAudit.secondCreatedBy}}</td>
              <td class="table-title">审核结果</td>
              <td colspan="4">{{switchAuditStatus(reivewDetail.data.secondAudit.secondIsPass)}}</td>
            </tr>
            <tr>
              <td class="table-title">审核意见</td>
              <td colspan="8">{{reivewDetail.data.secondAudit.secondOpinion}}</td>
            </tr>
            <tr>
              <td class="table-title">反馈信息</td>
              <td colspan="8">{{reivewDetail.data.feedback}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <Spin v-if="!reivewDetail.show" fix/>
    </Modal>
    <Spin v-if="loading" fix/>
  </div>
</template>
<script>
  import {SERVER_BASE_URL} from '~/api/config';

  export default {
    data() {
      return {
        currentTab: 'checkIn',
        loading: false,
        id: '',
        pagesizeOpts: [10, 20, 30, 40],
        detailData: {},
        employee_team: {
          element_name: [],
          superior_name: []
        },
        checkIn: {
          form: {},
          columns: [
            {title: '签到时间', key: 'signin_at', align: 'center', width: 200},
            {title: '签退时间', key: 'signout_at', align: 'center', width: 200},
            {
              title: '拜访类型', key: 'checkin_way', align: 'center', width: 100,
              render: (h, {row}) => {
                return h('span', {}, this.switchCheckInType(row.checkin_way))
              }
            },
            {title: '合作商名称', key: 'merchant_name', align: 'center', width: 130},
            {title: '门店名称', key: 'facadeName', align: 'center', minWidth: 200},
            {title: '客户分类', key: 'contractorLever', align: 'center', width: 120},
            {title: '门店地址', key: 'facadeAddress', align: 'center', width: 180},
            {title: '签到地址', key: 'address', align: 'center', width: 110},
            {title: '陈列级别', key: 'level', align: 'center', width: 200},
            {title: '陈列备注', key: 'remark', align: 'center', width: 100},
            {title: '备注', key: 'in_remark', align: 'center', width: 200}
          ],
          data: [],
          pageProps: {
            total: 0,
            page: 1,
            perPage: 10
          },
          loading: false,
        },
        store: {
          form: {},
          columns: [
            {title: '签到时间', key: 'created_at', align: 'center', width: 200},
            {title: '合作商名称', key: 'merchant_name', align: 'center', width: 130},
            {title: '门店名称', key: 'name', align: 'center', width: 130},
            {title: '门店地址', key: 'address', align: 'center', minWidth: 200},
            {title: '签到地址', key: 'signAddress', align: 'center', width: 110},
            {title: '客户分类', key: 'level', align: 'center', width: 120},
            {title: '商家分类', key: 'merchant_type', align: 'center', width: 130},
            {title: '备注', key: 'remark', align: 'center', width: 120}
          ],
          data: [],
          pageProps: {
            total: 0,
            page: 1,
            perPage: 10
          },
          loading: false,
        },
        ticket: {
          hotelData: [],
          hotelColumns: [
            {title: '序号', type: 'index', align: 'center', width: 70},
            {title: '申请人', key: 'createdName', align: 'center'},
            {title: '申请时间', key: 'createdTime', align: 'center', width: 110},
            {title: '城市', key: 'city', align: 'center'},
            {title: '酒店名称', key: 'hotelName', align: 'center'},
            {title: '住宿日期', key: 'startAt', align: 'center'},
            {title: '离店日期', key: 'endAt', align: 'center'},
            {title: '人员数量', key: 'peopleNumber', align: 'center'},
            {
              title: '审核状态', key: 'auditStatus', align: 'center', render: (h, {row}) => {
                return h('a', {
                  attrs: {
                    href: 'javascript:void(0)'
                  },
                  on: {
                    click: () => {
                      this.reivewDetail.isHotel = true
                      this.$api.getHotelDetail({id: row.id}).then(res => {
                        if(res.code !== 0) return
                        this.reivewDetail.data = res.data
                        this.reivewDetail.show = true
                      })
                    }
                  }
                }, row.status)
              }
            },
          ],
          hotelPageProps: {
            total: 0,
            page: 1,
            perPage: 10
          },
          hotelLoading: false,
          trafficLoading: false,

          trafficData: [],
          trafficColumns: [
            {title: '序号', type: 'index', align: 'center', width: 70},
            {title: '申请人', key: 'createdBy', align: 'center'},
            {title: '申请时间', key: 'createdAt', align: 'center', width: 110},
            {title: '票类型', key: 'type', align: 'center'},
            {title: '出发地点', key: 'startFrom', align: 'center'},
            {title: '目的地', key: 'targetTo', align: 'center'},
            {title: '出发日期', key: 'startAt', align: 'center'},
            {
              title: '审核状态', key: 'status', align: 'center', render: (h, {row}) => {
                return h('a', {
                  attrs: {
                    href: 'javascript:void(0)'
                  },
                  on: {
                    click: () => {
                      this.reivewDetail.isHotel = false
                      this.$api.getTrafficDetail({id: row.id}).then(res => {
                        if(res.code !== 0) return
                        this.reivewDetail.data =res.data
                        this.reivewDetail.show = true
                      })
                    }
                  }
                }, row.status)
              }
            },
          ],
          trafficPageProps: {
            total: 0,
            page: 1,
            perPage: 10
          },
        },
        reivewDetail: {
          show: false,
          isHotel: true,
          data: {
            all: [],
            single: [],
            chummage: [],
            firstAudit: {},
            secondAudit: {}
          }
        }
      }
    },
    watch: {
      currentTab(cur) {
        this.calcTabHeight()
        this.init()
      },
      ['reivewDetail.show'](cur) {
        if(!cur) {
          this.reivewDetail.data =  {
            all: [],
            single: [],
            chummage: [],
            firstAudit: {},
            secondAudit: {}
          }
        }
      }
    },
    mounted() {
      this.id = this.$route.query.id
      this.username = this.$route.query.username
      this.getDetail(this.id)
      this.calcTabHeight()
      this.init()
    },
    methods: {
      // 计算tab 高度
      calcTabHeight() {
        this.$nextTick(() => {
          let tabs = document.querySelectorAll('.file-details .ivu-tabs-tabpane')
          tabs.forEach(tab => {
            tab.style.height = 0
          })
          switch (this.currentTab) {
            case "checkIn":
              tabs[0].style.height = ''
              break;
            case "store":
              tabs[1].style.height = ''
              break;
            case "ticket":
              tabs[2].style.height = ''
              break;
          }
        })
      },
      goBack() {
        this.$router.push({path: '/employee-management/employee-file'})
      },
      exportData(api) {
        this.$api[api]({username: this.username}).then(res => {
          if(res.code !== 0) return this.$Message.error('导出失败')
          let url = res.data[0]
          let a = document.createElement('a')
          let name = url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'))
          a.href = url
          a.download = name
          a.click()
          a.remove()
        })
      },
      getDetail(id) {
        this.loading = true
        let params = {
          id: id
        }
        this.$api.getEmployeeFilesDetail(params).then((res) => {
          if (res.code === 0) {
            this.detailData = res.data
            this.detailData.avatarUrl = res.data.photo && res.data.photo.url &&  SERVER_BASE_URL + '/' + res.data.photo.url
            this.detailData.workingAt = this.$format(this.detailData.workingAt, 'yyyy-MM-dd').replaceAll('-', '.')
            this.loading = false
          }
        })
      },

      /**
       * 切换标签，调用对应的接口
       */
      init() {
        this.currentTab === 'checkIn' && (this.getCheckInInfo(), this.getCheckInTable());
        this.currentTab === 'store' && (this.getStoreInfo(), this.getStoreTable());
        this.currentTab === 'ticket' && (this.getHotelTable(), this.getTrafficTable());
      },

      // 签到记录
      getCheckInInfo() {
        this.$api.getCheckInInfo({username: this.username}).then(res => {
          if (res.code !== 0) return
          this.checkIn.form = res.data
        })

      },
      getCheckInTable() {
        let {page, perPage} = this.checkIn.pageProps
        this.checkIn.loading = true
        this.$api.getCheckInList({page, perPage, username: this.username}).then(res => {
          let {items, _meta} = res
          this.checkIn.data = items
          this.checkIn.pageProps.page = _meta.currentPage
          this.checkIn.pageProps.total = _meta.totalCount
          this.checkIn.loading = false
        })
      },
      // 门店
      getStoreInfo() {
        this.$api.getStoreInfo({username: this.username}).then(res => {
          if (res.code !== 0) return
          this.store.form = res.data
        })

      },
      getStoreTable() {
        this.store.loading = true
        let {page, perPage} = this.store.pageProps
        this.$api.getStoreList({page, perPage, username: this.username}).then(res => {
          let {items, _meta} = res
          this.store.data = items
          this.store.pageProps.page = _meta.currentPage
          this.store.pageProps.total = _meta.totalCount
          this.store.loading = false
        })
      },
      // 票务
      getHotelTable() {
        this.ticket.hotelLoading = true
        let {page, perPage} = this.ticket.hotelPageProps
        this.$api.getHotelList({page, perPage, username: this.username}).then(res => {
          let {items, _meta} = res
          this.ticket.hotelData = items
          this.ticket.hotelPageProps.page = _meta.currentPage
          this.ticket.hotelPageProps.total = _meta.totalCount
          this.ticket.hotelLoading = false
        })

      },
      getTrafficTable() {
        this.ticket.trafficLoading = true
        let {page, perPage} = this.ticket.trafficPageProps
        this.$api.getTrafficList({page, perPage, username: this.username}).then(res => {
          let {items, _meta} = res
          this.ticket.trafficData = items 
          this.ticket.trafficPageProps.page = _meta.currentPage
          this.ticket.trafficPageProps.total = _meta.totalCount
          this.ticket.trafficLoading = false
        })
      },


      // 切换页码
      pageChange(e, key) {
        key === 'checkIn' && (this.checkIn.pageProps.page = e) && this.getCheckInTable()
        key === 'store' && (this.store.pageProps.page = e) && this.getStoreTable()
        key === 'hotel' && (this.ticket.hotelPageProps.page = e) && this.getHotelTable()
        key === 'traffic' && (this.ticket.trafficPageProps.page = e) && this.getTrafficTable()
      },
      // 切换每页条数
      pageSizeChange(e, key) {
        key === 'checkIn' && (this.checkIn.pageProps.perPage = e) && this.getCheckInTable()
        key === 'store' && (this.store.pageProps.perPage = e) && this.getStoreTable()
        key === 'hotel' && (this.ticket.hotelPageProps.perPage = e) && this.getHotelTable()
        key === 'traffic' && (this.ticket.trafficPageProps.perPage = e) && this.getTrafficTable()
      },

      // 签到类型
      switchCheckInType(type) {
        let list = {
          street_worship: '陌拜',
          return_visit: '回访',
          no_shop: '无门店',
          maintain: '维护',
          stick_cabinet: '贴柜',
          activity: '活动'
        }
        return list[type]
      },

      switchAuditStatus(type) {
        if(typeof type === 'undefined') return ''
        let status = ['不通过', '通过']
        return status[type]
      }
    }
  }
</script>
<style lang="less" scoped>
  .col-right {
    text-align: right;
  }

  .avatar {
    width: 80px;
    height: 80px;
    padding: 10px 12px 10px 0;
    div {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      overflow: hidden;
      margin-left: 8px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    p {
      margin: 3px 0;
      text-align: center;
    }
  }

  .detail-form /deep/ .ivu-input {
    text-align: center;
  }

  .detail-profile  /deep/ .ivu-input {
    text-align: left;
  }

  .review-table{
    font-size: 12px;
    text-align: center;
    border-collapse:collapse;
    width: 100%;
    tr{
      td{
        border: 1px #dcdee2 solid;
        height: 45px;
        padding: 0 10px;
      }
    }
  }
  .table-title{
    width: 120px;
    background: #f8f8f9;
  }
</style>