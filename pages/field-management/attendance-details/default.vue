<template>
  <div>
    <Card>
      <div slot="title">
        <Row type="flex" justify="space-between" align="bottom">
          <Col>
            <p>考勤详情</p>
          </Col>
          <Col>
            <Button type="primary" @click="goBack">返 回</Button>
          </Col>
        </Row>
      </div>
      <div>
        <Form label-position="right" :label-width="85">
          <Row type="flex" justify="start">
            <Col :md="8">
              <FormItem label="员工工号：">
                <Input v-model="detailData.job_number" readonly />
              </FormItem>
            </Col>
            <Col :md="8">
              <FormItem label="员工姓名：">
                <Input v-model="detailData.created_by" readonly />
              </FormItem>
            </Col>
            <Col :md="8">
              <FormItem label="系统部门：">
                <Input v-model="detailData.offline_dept_name" readonly />
              </FormItem>
            </Col>
          </Row>
          <Row type="flex" justify="start">
            <Col :md="8">
              <FormItem label="签到时间：">
                <Input :value="formatDate(detailData.signin_at)" readonly />
              </FormItem>
            </Col>

            <Col :md="8">
              <FormItem label="签退时间：">
                <Input :value="formatDate(detailData.signout_at)" readonly />
              </FormItem>
            </Col>

            <Col :md="8">
              <FormItem label="签退状态：">
                <Input v-model="detailData.is_exception" readonly />
              </FormItem>
            </Col>
          </Row>
          <Row type="flex" justify="start">
            <Col :md="8">
              <FormItem label="合作商名称：">
                <Input v-model="detailData.merchant_name" readonly />
              </FormItem>
            </Col>
            <Col :md="8">
              <FormItem label="拜访时长：">
                <Input v-model="detailData.checkin_length" readonly />
              </FormItem>
            </Col>
            <Col :md="8">
              <FormItem label="拜访类型：">
                <Input v-model="detailData.checkin_way" readonly />
              </FormItem>
            </Col>
          </Row>
          <Row type="flex" justify="start">
            <Col :md="8">
              <FormItem label="门店名称：">
                <Input v-model="detailData.facadeName" readonly />
              </FormItem>
            </Col>
            <Col :md="8">
              <FormItem label="经度：">
                <Input v-model="detailData.lng" readonly />
              </FormItem>
            </Col>
            <Col :md="8">
              <FormItem label="纬度：">
                <Input v-model="detailData.lat" readonly />
              </FormItem>
            </Col>
          </Row>
          <Row type="flex" justify="start">
            <Col :md="24">
              <FormItem label="门店地址：">
                <Input v-model="detailData.facadeAddress" readonly />
              </FormItem>
            </Col>
          </Row>
          <Row type="flex" justify="start">
            <Col :md="24">
              <FormItem label="签到地址：">
                <Input v-model="detailData.checkinAddress" readonly />
              </FormItem>
            </Col>
          </Row>
          <Row type="flex" justify="start">
            <Col :md="24">
              <FormItem label="备注：">
                <Input v-model="detailData.remark" readonly type="textarea" :autosize="{ maxRows: 5, minRows: 5 }" />
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Form label-position="top">
          <Row type="flex" justify="start">
            <Col :md="24">
              <FormItem label="签到图片：">
                <!-- <a class="img-wrap" v-for="(items, index) in detailData['cwa-app-checkin']" :key="'checkin' + index" :href="items.url" target="_blank" title="点击可查看">
                                <img :src="items.url">
                            </a> -->
                <Row>
                  <Col span="12" v-for="(item, index) in detailData['cwa-app-checkin']" :key="index">
                    <div class="img-wrap">
                      <img :src="loadingImg" v-show="loading" />
                      <img :src="item.url" @click="bigImg(item.url)" v-show="!loading" @load="imgLoading" />
                    </div>
                  </Col>
                </Row>
              </FormItem>
            </Col>
          </Row>
          <Row type="flex" justify="start">
            <Col :md="24">
              <FormItem label="签退图片：">
                <!-- <a class="img-wrap" v-for="(items, index) in detailData['cwa-app-checkout']" :key="'checkin' + index" :href="items.url" target="_blank" title="点击可查看">
                                <img :src="items.url">
                            </a> -->
                <Row>
                  <Col span="12" v-for="(item, index) in detailData['cwa-app-checkout']" :key="index">
                    <div class="img-wrap">
                      <img :src="loadingImg" v-show="loading" />
                      <img :src="item.url" @click="bigImg(item.url)" v-show="!loading" @load="imgLoading" />
                    </div>
                  </Col>
                </Row>
              </FormItem>
            </Col>
          </Row>
          <Row type="flex" justify="start">
            <Col :md="24">
              <FormItem label="产品陈列：">
                <!-- <a class="img-wrap" v-for="(items, index) in detailData['cwa-app-checkin-pro']" :key="'checkin' + index" :href="items.url" target="_blank" title="点击可查看">
                                <img :src="items.url">
                            </a> -->
                <Row>
                  <Col span="12" v-for="(item, index) in detailData['cwa-app-checkin-pro']" :key="index">
                    <div class="img-wrap">
                      <img :src="loadingImg" v-show="loading" />
                      <img :src="item.url" @click="bigImg(item.url)" v-show="!loading" @load="imgLoading" />
                    </div>
                  </Col>
                </Row>
              </FormItem>
            </Col>
          </Row>
          <Row type="flex" justify="start">
            <Col :md="24">
              <FormItem label="陈列情况：">
                <Input v-model="detailData.situation" readonly />
              </FormItem>
            </Col>
          </Row>
          <Row type="flex" justify="start">
            <Col :md="6">
              <FormItem label="陈列级别：">
                <Input v-model="detailData.level" readonly style="text-align:center;width:150px" />
              </FormItem>
            </Col>
          </Row>
          <Row type="flex" justify="start">
            <Col :md="24">
              <FormItem label="陈列级别描述：">
                <Input v-model="detailData.displayRemark" readonly />
              </FormItem>
            </Col>
          </Row>
          <Row type="flex" justify="start">
            <Col :md="24">
              <FormItem label="物料图：">
                <!-- <a class="img-wrap" v-for="(items, index) in detailData['cwa-app-checkin-raw']" :key="'checkin' + index" :href="items.url" target="_blank" title="点击可查看">
                                <img :src="items.url">
                            </a> -->
                <Row>
                  <Col span="12" v-for="(item, index) in detailData['cwa-app-checkin-raw']" :key="index">
                    <div class="img-wrap">
                      <img :src="loadingImg" v-show="loading" />
                      <img :src="item.url" @click="bigImg(item.url)" v-show="!loading" @load="imgLoading" />
                    </div>
                  </Col>
                </Row>
              </FormItem>
            </Col>
          </Row>
          <Row type="flex" justify="start">
            <Col :md="24">
              <FormItem label="物料情况：">
                <Input v-model="detailData.material_remark" readonly />
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    </Card>
    <Modal v-model="showModal" width="800">
      <img :src="bigImgUrl" style="width: 100%; height: auto;" />
    </Modal>
  </div>
</template>
<script>
import loadingImg from '~/assets/loading.gif'
export default {
  data() {
    return {
      detailData: {},
      // 签到大图容器
      showModal: false,
      bigImgUrl: '',
      loading: true,
      loadingImg: loadingImg,
    }
  },
  mounted() {
    this.getDetail(this.$route.query.id)
  },
  methods: {
    imgLoading() {
      this.loading = false
    },
    
    bigImg(url) {
      this.showModal = true
      this.bigImgUrl = url
    },

    goBack() {
      this.$store.commit('removeTag', this.$route.name)
      this.$router.push({ path: '/field-management/attendance-management' })
    },

    // 详情
    getDetail(id) {
      this.$api.attendanceDetail({ checkinId: id }).then((res) => {
        if (res.code == 0) {
          this.detailData = res.data
          this.detailData.is_exception =
            this.detailData.is_exception === 'yes'
              ? '签退异常'
              : this.detailData.is_exception === 'no'
              ? '签退正常'
              : this.detailData.is_exception
          // console.log(this.detailData)
        }
      })
    },

    formatDate(time, type) {
      type = type || 'yyyy-MM-dd hh:mm:ss'
      return this.$format(time, type)
    },
  },
}
</script>
<style lang="less" scoped>
.img-wrap {
  width: 200px;
  height: 200px;
  display: inline-block;
  border: 3px solid rgba(191, 189, 193, 0.5);
  margin: 0 17px;
}
.img-wrap img {
  width: 100%;
  height: 100%;
}
.img-wrap:hover {
  box-shadow: 0 0 2px 3px rgba(209, 207, 211, 0.5);
}
</style>
