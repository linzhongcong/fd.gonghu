<template>
  <div>
    <Card>
      <div slot="title">
        <Row type="flex" justify="end">
          <Button type="primary" @click="goBack">返回</Button>
        </Row>
      </div>
      <Card>
        <div slot="title"><p>签到详情</p></div>
        <Form label-position="right" :label-width="80" label-colon>
          <Row>
            <Col :md="8">
              <FormItem label="工号">
                <Input :value="detailData.job_number" readonly/>
              </FormItem>
            </Col>
            <Col :md="8">
              <FormItem label="员工姓名">
                <Input :value="detailData.created_by" readonly/>
              </FormItem>
            </Col>
            <Col :md="8">
              <FormItem label="系统部门">
                <Input :value="detailData.offline_dept_name" readonly/>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :md="8">
              <FormItem label="拜访类型">
                <Input :value="detailData.checkin_way" readonly/>
              </FormItem>
            </Col>
            <Col :md="8">
              <FormItem label="签到时间">
                <Input :value="formatDate(detailData.signin_at)" readonly/>
              </FormItem>
            </Col>
            <Col :md="8">
              <FormItem label="签退时间">
                <Input :value="formatDate(detailData.signout_at)" readonly/>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :md="8">
              <FormItem label="拜访时长">
                <Input :value="detailData.checkin_length" readonly/>
              </FormItem>
            </Col>
            <Col :md="8">
              <FormItem label="状态">
                <Input :value="detailData.is_exception_desc" readonly/>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :md="16">
              <FormItem label="签到地址">
                <Input :value="detailData.checkinAddress" readonly/>
              </FormItem>
            </Col>
            <Col :md="8">
              <FormItem label="经纬度">
                <Input :value="detailData.checkin_lng && detailData.checkin_lat ? detailData.checkin_lng + '，' + detailData.checkin_lat : ''" readonly/>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :md="16">
              <FormItem label="签退地址">
                <Input :value="detailData.checkout_address" readonly/>
              </FormItem>
            </Col>
            <Col :md="8">
              <FormItem label="经纬度">
                <Input :value="detailData.checkout_lng && detailData.checkout_lat ? detailData.checkout_lng + '，' + detailData.checkout_lat : ''" readonly/>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :md="8">
              <FormItem label="陪同人">
                <Input :value="detailData.visit_with" readonly/>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormItem label="门店/公司">
                <div v-for="(item, index) in detailData['cwa-app-checkout']" class="voucher" @click="showBigImg(item.objectUrl)">
                  <img :src="item.objectUrl" />
                </div>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card>
        <div slot="title"><p>回访笔记</p></div>
        <Form label-position="right" :label-width="160" label-colon>
          <Row>
            <Col :md="12">
              <FormItem label="回访客户">
                <div class="company-box">
                  <a href="javascript:;" @click="goMerchantDetail(detailData.merchant_kind, detailData.contractorId)">{{detailData.merchant_name}}</a>
                </div>
              </FormItem>
            </Col>
          </Row>
          <Row v-for="(item, index) in detailData.surveyInfo" :key="index">
            <Col :md="12">
              <FormItem :label="item.title">
                <Input :type="item.question_id === '6' || item.question_id === '7' ? 'textarea' : 'text'" :value="item.value" readonly />
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
    </Card>
    <Modal v-model="showImgModal" footer-hide width="550">
      <div style="height:28px"></div>
      <img style="width: 100%" :src="showImgUrl" alt="" />
    </Modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      showImgModal: false,
      showImgUrl: '',
      detailData: {
        surveyInfo: [],
        'cwa-app-checkout' : []
      }
    }
  },
  mounted() {
    let id = this.$route.query.id
    this.getDetail(id)
  },
  methods: {
    getDetail(checkinId) {
      this.$api.attendanceDetail({checkinId}).then(res => {
        if(res.code === 0) {
          res.data['cwa-app-checkout'] = res.data['cwa-app-checkout'] || []
          res.data.surveyInfo.length === 0 && this.getSurvey()
          this.detailData = res.data
        }
      })
    },

    getSurvey() {
      this.$api.attendanceSurveyList({checkWay: 'return_visit'}).then((res) => {
        if(res.code === 0) {
          this.detailData.surveyInfo = res.data
        }
      })
      .catch((err) => {
        this.detailData.surveyInfo = [{
            "id": "9",
            "title": "今日维护客户原因"
          },
          {
            "id": "10",
            "title": "面谈人数"
          },
          {
            "id": "11",
            "title": "客户职务"
          },
          {
            "id": "12",
            "title": "这次面谈，客户强调的观点"
          },
          {
            "id": "13",
            "title": "这次面谈，我跟客户传递的观点"
          },
          {
            "id": "14",
            "title": "客户对面谈结果是否满意"
          },
          {
            "id": "15",
            "title": "我对面谈结果是否满意"
          }
        ]
      })
    },

    // 单击查看大图
    showBigImg(url) {
      this.showImgModal = true
      this.showImgUrl = url
    },

    goBack() {
      this.$router.push('/field-management/attendance-management')
    },

    goMerchantDetail(type, id) {
      if(type === 'leads') {
        this.$router.push({
          path: '/contract/development-partner-management/development-details',
          query: {
            id
          }
        })
      } else if(type === 'potential') {
        this.$router.push({
          path: '/contract/potential-customer/customer-detail',
          query: {
            id
          }
        })
      } else if(type === 'cooperation') {
        this.$router.push({
          path: '/contract/cooperative-customer/cooperative-detail',
          query: {
            id
          }
        })
      }
    },

    formatDate(time, type) {
      type = type || 'yyyy-MM-dd hh:mm:ss'
      return this.$format(time, type)
    },
  },
}
</script>
<style lang="less" scoped>
.ivu-card {
  margin-bottom: 15px;
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

.company-box {
  width: 100%;
  height: 32px;
  line-height: 1.5;
  padding: 4px 7px;
  font-size: 14px;
  border: 1px solid #dcdee2;
  border-radius: 4px;
  color: #515a6e;
  background-color: #fff;
  background-image: none;
  position: relative;
  cursor: text;
  transition: border .2s ease-in-out,background .2s ease-in-out,box-shadow .2s ease-in-out;
  &:hover {
    border-color: #57a3f3;
  }
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
</style>
