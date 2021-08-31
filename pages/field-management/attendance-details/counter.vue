<template>
  <Card>
    <!-- 头部 -->
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
    <!-- 主体内容 -->
    <div>
      <Row
        type="flex"
        justify="space-between"
        align="bottom"
        style="padding-bottom:30px"
      >
        <Col>
          <p style="font-weight:bold;">基础信息</p>
        </Col>
      </Row>
      <Form ref="formValidate" label-position="left" :label-width="75">
        <Row style="padding-bottom:30px">
          <Col span="6">
            <FormItem label="员工工号：">
              <Input
                style="max-width: 200px"
                readonly
                v-model="editList.checkinInfo.job_number"
              />
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="员工姓名：">
              <Input
                style="max-width: 200px"
                readonly
                v-model="editList.checkinInfo.created_by"
              />
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="系统部门：" :label-width="90">
              <Input
                style="max-width: 200px"
                readonly
                v-model="editList.checkinInfo.offlineDeptName"
              />
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="直属上级：">
              <Input
                style="max-width: 200px"
                readonly
                v-model="editList.checkinInfo.leader"
              />
            </FormItem>
          </Col>
        </Row>
        <Row style="padding-bottom:30px">
          <Col span="6">
            <FormItem label="签到时间：">
              <Input
                style="max-width: 200px"
                readonly
                v-model="editList.checkinInfo.signin_at"
              />
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="签退时间：">
              <Input
                style="max-width: 200px"
                readonly
                v-model="editList.checkinInfo.signout_at"
              />
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="签退状态：">
              <Input
                style="max-width: 200px"
                readonly
                v-model="editList.checkinInfo.is_exception"
              />
            </FormItem>
          </Col>
        </Row>
        <Row style="padding-bottom:30px">
          <Col span="6">
            <FormItem label="合作商名称：" :label-width="90">
              <Input
                style="max-width: 200px"
                readonly
                v-model="editList.checkinInfo.merchant_name"
              />
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="拜访类型：">
              <Input
                style="max-width: 200px"
                readonly
                v-model="editList.checkinInfo.checkin_way"
              />
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="拜访时长：">
              <Input
                style="max-width: 200px"
                readonly
                v-model="editList.checkinInfo.checkin_length"
              />
            </FormItem>
          </Col>
        </Row>
        <Row style="padding-bottom:30px">
          <Col span="6">
            <FormItem label="门店名称：">
              <Input
                style="max-width: 200px"
                readonly
                v-model="editList.checkinInfo.facadeName"
              />
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="经度：" :label-width="50">
              <Input
                style="max-width: 200px"
                readonly
                v-model="editList.checkinInfo.lat"
              />
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="纬度：" :label-width="50">
              <Input
                style="max-width: 200px"
                readonly
                v-model="editList.checkinInfo.lng"
              />
            </FormItem>
          </Col>
        </Row>
      </Form>
      <Row style="padding-bottom:30px">
        <Form ref="formValidate" label-position="left" :label-width="80">
          <FormItem label="门店地址：">
            <Input
              readonly
              v-model="editList.checkinInfo.facadeAddress"
            ></Input>
          </FormItem>
        </Form>
      </Row>
      <Row style="padding-bottom:30px">
        <Form ref="formValidate" label-position="left" :label-width="80">
          <FormItem label="签到地址:">
            <Input
              readonly
              v-model="editList.checkinInfo.checkinAddress"
            ></Input>
          </FormItem>
        </Form>
      </Row>
      <Row style="padding-bottom:30px">
        <Form ref="formValidate" label-position="left" :label-width="50">
          <FormItem label="备注:">
            <Input readonly v-model="editList.checkinInfo.out_remark"></Input>
          </FormItem>
        </Form>
      </Row>
      <!-- 签到图片 -->
      <Row style="padding-bottom:30px">
        <Form label-position="top">
          <Col span="12">
            <FormItem label="签到图片：">
              <Row>
                <Col span="12" v-for="(item, index) in checkinImg" :key="index">
                  <div class="img-wrap">
                    <img :src="loadingImg" v-show="loading" />
                    <img
                      :src="item.url"
                      @click="bigImg(item.url)"
                      v-show="!loading"
                      @load="imgLoading"
                    />
                  </div>
                </Col>
              </Row>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="签退图片：">
              <Row>
                <Col
                  span="12"
                  v-for="(item, index) in checkoutImg"
                  :key="index"
                >
                  <div class="img-wrap">
                    <img :src="loadingImg" v-show="loading" />
                    <img
                      :src="item.url"
                      @click="bigImg(item.url)"
                      v-show="!loading"
                      @load="imgLoading"
                    />
                  </div>
                </Col>
              </Row>
            </FormItem>
          </Col>
        </Form>
      </Row>

      <Row
        type="flex"
        justify="space-between"
        align="bottom"
        style="padding-bottom:30px"
      >
        <Col>
          <p style="font-weight:bold;">销售详情</p>
        </Col>
      </Row>
      <Form ref="formValidate" label-position="left" :label-width="80">
        <Row style="padding-bottom:30px">
          <Col span="6">
            <FormItem label="品牌：" :label-width="50">
              <Input
                style="max-width: 200px"
                readonly
                v-model="editList.saleInfo.brand"
              />
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="贴柜人数：">
              <Input
                style="max-width: 200px"
                readonly
                v-model="editList.saleInfo.people_number"
              />
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="同行人员：">
              <Input
                readonly
                v-model="editList.saleInfo.colleagues"
                type="textarea"
              />
            </FormItem>
          </Col>
        </Row>
      </Form>
      <Row style="padding-bottom:30px">
        <Form ref="formValidate" label-position="left" :label-width="100">
          <FormItem label="贴柜销售目标：">
            <Input readonly v-model="editList.checkinInfo.sales_target"></Input>
          </FormItem>
        </Form>
      </Row>
      <Form ref="formValidate" label-position="left" :label-width="100">
        <Row style="padding-bottom:30px">
          <Col span="8">
            <FormItem label="贴柜当天销售达成（总业绩）:" :label-width="180">
              <Input
                readonly
                style="max-width: 200px"
                v-model="editList.saleInfo.total_performance_decimal"
              ></Input>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="成交总单数：" :label-width="90">
              <Input
                readonly
                style="max-width: 200px"
                v-model="editList.saleInfo.total_orders"
              ></Input>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="平均客单价：" :label-width="90">
              <Input
                readonly
                style="max-width: 200px"
                v-model="editList.saleInfo.average_price"
              ></Input>
            </FormItem>
          </Col>
        </Row>
        <Row style="padding-bottom:30px">
          <Col span="8">
            <FormItem label="个人当天销售达成（业绩）:" :label-width="180">
              <Input
                readonly
                style="max-width: 200px"
                v-model="editList.saleInfo.self_performance"
              ></Input>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="个人最高客单价：" :label-width="120">
              <Input
                readonly
                style="max-width: 200px"
                v-model="editList.saleInfo.personal_max_price"
              ></Input>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="团队最高客单价：" :label-width="120">
              <Input
                readonly
                style="max-width: 200px"
                v-model="editList.saleInfo.team_max_price"
              ></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>

      <Row style="padding-bottom:30px">
        <Form label-position="top">
          <Col span="12">
            <FormItem label="贴柜现场陈列照片：">
              <Row>
                <Col
                  span="12"
                  v-for="(item, index) in checkinproImg"
                  :key="index"
                >
                  <div class="img-wrap">
                    <img :src="loadingImg" v-show="loading" />
                    <img
                      :src="item.url"
                      @click="bigImg(item.url)"
                      v-show="!loading"
                      @load="imgLoading"
                    />
                  </div>
                </Col>
              </Row>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="当天销售达成照片：">
              <Row>
                <Col
                  span="12"
                  v-for="(item, index) in checkinrawImg"
                  :key="index"
                >
                  <div class="img-wrap">
                    <img :src="loadingImg" v-show="loading" />
                    <img
                      :src="item.url"
                      @click="bigImg(item.url)"
                      v-show="!loading"
                      @load="imgLoading"
                    />
                  </div>
                </Col>
              </Row>
            </FormItem>
          </Col>
        </Form>
      </Row>
    </div>
    <Spin size="large" fix v-if="spinShow"></Spin>
    <Modal v-model="showModal" width="800">
      <img :src="bigImgUrl" style="width: 100%; height: auto;" />
    </Modal>
  </Card>
</template>

<script>
import loadingImg from '../../../assets/loading.gif'
export default {
  data() {
    return {
      id: '',
      editList: {
        fileItems: {
          'cwa-app-checkin': [],
          'cwa-app-checkout': [],
          'cwa-app-checkin-pro': [],
          'cwa-app-checkin-raw': [],
        },
        checkinInfo: {},
        saleInfo: {},
      },
      //签到图片
      checkinImg: [
        {
          url: 'http://',
        },
      ],
      //签退图片
      checkoutImg: [],
      //贴柜（活动）现场成列图片
      checkinproImg: [],
      // 当天销售达成照片
      checkinrawImg: [],
      //控制loading
      spinShow: true,
      // 签到大图容器
      showModal: false,
      bigImgUrl: '',
      loading: true,
      loadingImg: loadingImg,
    }
  },
  computed: {
    // editList(){
    //   return this.getList(this.id)
    // }
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
      this.$router.push({
        path: '/field-management/checkin-prettify-management',
      })
    },
    getList(id) {
      this.spinShow = true
      let params = { checkinId: id }
      this.$api
        .guideDeit(params)
        .then((res) => {
          // console.log('data',res)
          this.spinShow = false
          if (res.code == 0) {
            let checkin = 'cwa-app-checkin'
            let checkout = 'cwa-app-checkout'
            let checkinpro = 'cwa-stick-cabinet'
            let checkinraw = 'cwa-sales-achieved'
            // console.log('checkinImg',res.data.fileItems[d])
            this.editList = res.data
            this.checkinImg = res.data.fileItems[checkin]
            this.checkoutImg = res.data.fileItems[checkout]
            this.checkinproImg = res.data.fileItems[checkinpro]
            this.checkinrawImg = res.data.fileItems[checkinraw]
          }
          // console.log('this.checkinImg',this.checkinImg)
        })
        .catch((ero) => {
          // this.$Spin.hide();
          this.spinShow = false
        })
    },
  },
  created() {
    this.id = this.$route.query.id
    this.getList(this.id)
  },
}
</script>

<style>
.fl {
  float: left;
}
.fr {
  float: right;
}
.titText {
  width: 100px;
  display: inline-block;
}

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
