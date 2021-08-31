<template>
  <div>
    <Card>
      <div slot="title">
        <Row type="flex" justify="end">
          <Button type="primary" @click="goBack">返回</Button>
        </Row>
      </div>
      <Card>
        <div slot="title">
          <p>考勤详情</p>
        </div>
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
                <Input :value="detailData.checkin_lng && detailData.checkin_lat ? detailData.checkin_lng + '，' + detailData.checkin_lat : ''" readonly />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormItem label="备注">
                <Input :value="detailData.remark" readonly/>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormItem label="签到图片">
                <div v-for="(item, index) in detailData['cwa-app-checkin']" class="voucher" @click="showBigImg(item.objectUrl)">
                  <img :src="item.objectUrl" />
                </div>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card>
        <div slot="title"><p>陌拜数据</p></div>
        <Form label-position="right" :label-width="120" label-colon>
          <Row>
            <Col :md="9">
              <FormItem label="拜访客户">
                <div class="company-box">
                  <a href="javascript:;" @click="goMerchantDetail(detailData.merchant_kind, detailData.contractorId)">{{detailData.merchant_name}}</a>
                </div>
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
      type: this.$route.query.type,
      showImgModal: false,
      showImgUrl: '',
      detailData: {
        'cwa-app-checkin' : []
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
          res.data['cwa-app-checkin'] = res.data['cwa-app-checkin'] || []
          this.detailData = res.data
        }
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
