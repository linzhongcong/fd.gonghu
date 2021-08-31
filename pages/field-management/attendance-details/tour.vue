<template>
  <div class="tour">
    <Card>
      <div slot="title">
        <Row type="flex" justify="end">
          <Button @click="goBack">返回</Button>
        </Row>
      </div>
      <Card>
        <div slot="title"><h3>签到详情</h3></div>
        <Form label-position="right" :label-width="80">
          <Row>
            <Col :md="8">
              <FormItem label="工号:">
                <Input :value="detailData.checkinInfo.job_number" readonly />
              </FormItem>
            </Col>
            <Col :md="8">
              <FormItem label="员工姓名:">
                <Input :value="detailData.checkinInfo.created_by" readonly />
              </FormItem>
            </Col>
            <Col :md="8">
              <FormItem label="系统部门:">
                <Input :value="detailData.checkinInfo.offlineDeptName" readonly />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :md="8">
              <FormItem label="签到时间:">
                <Input :value="formatDate(detailData.checkinInfo.signin_at)" readonly />
              </FormItem>
            </Col>
            <Col :md="8">
              <FormItem label="签退时间:">
                <Input :value="formatDate(detailData.checkinInfo.signout_at)" readonly />
              </FormItem>
            </Col>
            <Col :md="8">
              <FormItem label="签退状态:">
                <Input :value="detailData.checkinInfo.is_exception && (detailData.checkinInfo.is_exception === 'no' ? '正常' : '异常')" readonly />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :md="8">
              <FormItem label="动销类型:">
                <Input :value="formatCheckinWay(detailData.checkinInfo.checkin_way)" readonly />
              </FormItem>
            </Col>
            <Col :md="8">
              <FormItem label="动销时长:">
                <Input :value="detailData.checkinInfo.checkin_length" readonly />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :md="16">
              <FormItem label="签到地址:">
                <Input :value="detailData.checkinInfo.checkinAddress" readonly />
              </FormItem>
            </Col>
            <Col :md="8">
              <FormItem label="经纬度:">
                <Input :value="(detailData.checkinInfo.lat || detailData.checkinInfo.lng) && `${detailData.checkinInfo.lat}, ${detailData.checkinInfo.lng}`" readonly />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :md="16">
              <FormItem label="签退地址:">
                <Input :value="detailData.checkinInfo.checkoutAddress" readonly />
              </FormItem>
            </Col>
            <Col :md="8">
              <FormItem label="经纬度:">
                <Input :value="(detailData.checkinInfo.checkoutLat || detailData.checkinInfo.checkutLng) && `${detailData.checkinInfo.checkoutLat}, ${detailData.checkinInfo.checkutLng}`" readonly />
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card>
        <div slot="title"><h3>巡店详情</h3></div>
        <!-- 基本情况 start -->
        <div class="detail-content">
          <div class="title">基本情况</div>
          <Form label-position="right" :label-width="100">
            <Row>
              <Col :md="8">
                <FormItem label="巡店客户:">
                  <div class="active-box">
                    <Tooltip :content="detailData.checkinInfo.merchant_name" placement="top">
                      <span @click="goToPartner">{{detailData.checkinInfo.merchant_name}}</span>
                    </Tooltip>
                  </div>
                </FormItem>
              </Col>
              <Col :md="8">
                <FormItem label="巡店门店:">
                  <div class="active-box">
                    <Tooltip :content="detailData.checkinInfo.facadeName" placement="top">
                      <span @click="goToFacade">{{detailData.checkinInfo.facadeName}}</span>
                    </Tooltip>
                  </div>
                </FormItem>
              </Col>
              <Col :md="8">
                <FormItem label="门店地址:">
                  <Input :value="detailData.checkinInfo.facadeAddress" readonly />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col :md="16">
                <FormItem label="销售增长建议:">
                  <Input type="textarea" :value="detailData.checkinInfo.salesGrowthSuggestion" readonly />
                </FormItem>
              </Col>
              <Col :md="8">
                <FormItem label="货架视野人数:">
                  <Input :value="detailData.checkinInfo.shelfPeople" readonly />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <FormItem label="门店/公司:">
                <div class="photo" @click="showBigImg($event, detailData.fileItems['cwa-app-checkout'])">
                  <div class="photo-content" v-for="(item, index) in detailData.fileItems['cwa-app-checkout']" :key="index">
                    <img :src="item.objectUrl" alt="" :data-index="index">
                  </div>
                </div>
              </FormItem>
            </Row>
          </Form>
        </div>
        <!-- 基本情况 start -->
        <!-- 门店陈列 start -->
        <div class="detail-content">
          <div class="title">门店陈列</div>
          <Form label-position="right" :label-width="100">
            <Row v-for="(facade, index) in detailData.facadeDisplay" :key="index">
              <Col :md="8">
                <FormItem label="陈列等级1:">
                  <Input :value="facade.facadeLevel" readonly />
                </FormItem>
              </Col>
              <Col :md="24">
                <FormItem label="我司产品陈列:">
                  <div class="photo" @click="showBigImg($event, facade.ourGoodsDisplay)">
                    <div class="photo-content" v-for="(item, i) in facade.ourGoodsDisplay" :key="i">
                      <img :src="item.objectUrl" alt="" :data-index="i">
                    </div>
                  </div>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col :md="24">
                <FormItem label="门店优秀陈列:">
                  <div class="photo" @click="showBigImg($event, detailData.fileItems.excellentFacadeDisplay)">
                    <div class="photo-content" v-for="(item, index) in detailData.fileItems.excellentFacadeDisplay" :key="index">
                      <img :src="item.objectUrl" alt="" :data-index="index">
                    </div>
                  </div>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
        <!-- 门店陈列 start -->
        <!-- 门店销售 start -->
        <div class="detail-content">
          <div class="title">门店销售</div>
          <Form label-position="right" :label-width="100">
            <Row>
              <Col :md="8">
                <FormItem label="门店SKU数:">
                  <Input :value="detailData.checkinInfo.skuCount" readonly />
                </FormItem>
              </Col>
            </Row>
            <Table :data="detailData.checkinInfo.facadeSaleDetail" :columns="facadeSaleTabCol" border></Table>
          </Form>
        </div>
        <!-- 门店销售 start -->
        <!-- POS记录 start -->
        <div class="detail-content">
          <div class="title">POS记录</div>
          <Form label-position="right" :label-width="100">
            <Row v-for="(pos, index) in detailData.checkinInfo.facadePosRecord" :key="index">
              <Col :md="8">
                <FormItem label="POS品牌:">
                  <Input :value="pos.brands" readonly />
                </FormItem>
              </Col>
              <Col :md="16">
                <FormItem label="POS图片:">
                  <div class="photo" @click="showBigImg($event, pos.posRecordImg)">
                    <div class="photo-content" v-for="(item, i) in pos.posRecordImg" :key="i">
                      <img :src="item.objectUrl" alt="" :data-index="i">
                    </div>
                  </div>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
        <!-- POS记录 end -->
        <!-- 竞对记录 start -->
        <div class="detail-content">
          <div class="title">竞对记录</div>
          <Form label-position="right" :label-width="100" v-for="(compete, index) in detailData.competitorRecord" :key="index">
            <Row v-for="(item, i) in compete" :key="i">
              <Col :md="13">
                <FormItem :label="`${item.title}:`">
                  <div class="photo" v-if="item.question_id === '32'" @click="showBigImg($event, item.competitorRecord)">
                    <div class="photo-content" v-for="(img, j) in item.competitorRecord" :key="j">
                      <img :src="img.objectUrl" alt="" :data-index="j">
                    </div>
                  </div>
                  <Input v-else :type="item.question_id === '34' ? 'textarea' : 'text'" :value="item.value" readonly />
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
        <!-- 竞对记录 end -->
      </Card>
    </Card>
    <ImgModal :show="bigImgShow" :imgArr="bigImgArr" :imgIndex="bigImgIndex" @closeImgModal="closeImgModal"></ImgModal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      detailData: {
        checkinInfo: {},
        fileItems: {}
      },
      facadeSaleTabCol: [
        {
          title: "序号",
          type: 'index',
          minWidth: 100,
          align: 'center'
        },
        {
          title: "产品名称",
          key: 'name',
          minWidth: 150,
          align: 'center'
        },
        {
          title: "零售价",
          key: 'price',
          minWidth: 120,
          align: 'center'
        },
        {
          title: "门店销售价",
          key: 'sale_price',
          minWidth: 120,
          align: 'center'
        },
        {
          title: "门店库存",
          key: 'inventory',
          minWidth: 120,
          align: 'center'
        },
      ],
      bigImgShow: false,
      bigImgArr: [],
      bigImgIndex: 0,
    }
  },
  mounted() {
    let id = this.$route.query.id
    this.getDetail(id)
  },
  methods: {
    handleFocus() {
      console.log('focus')
    },
    /**
     * 获取详情
     */
    async getDetail(checkinId) {
      let res
      try {
        res = await this.$api.guideDeit({ checkinId })
        if (res.code === 0) {
          let data = res.data
          data.competitorRecord.forEach((competitor) => {
            competitor.forEach((item, index) => item.question_id === '32' && competitor.push(competitor.splice(index, 1)[0]))
          })
          this.detailData = data
        }
      } catch (err) {
        this.$Notice.error({
          title: err.code,
          desc: err.message
        })
      }
    },

    /**
     * 点击图片查看大图 - 冒泡触发
     * @param {Object} e: 当前操作的dom对象
     * @param {Array} arr: 需要进行链接格式化的图片集合 
     */
    showBigImg(e, arr) {
      if(e.target.tagName === 'IMG') {
        this.bigImgShow = true
        this.bigImgArr = arr.map(item => item.objectUrl)
        this.bigImgIndex = +e.target.dataset.index
      }
    },

    /**
     * 关闭查看大图
     * @param {Object} obj: 组件触发返回的对象, 可直接解构 show, index, arr 进行对应数据的重置
     */
    closeImgModal({ show, index, arr }) {
      this.bigImgShow = show
      this.bigImgIndex = index
      this.bigImgArr = arr
    },

    /**
     * 跳转合作客户
     */
    goToPartner() {
      let id = this.detailData.checkinInfo.contractorId
      this.$router.push(`/contract/cooperative-customer/cooperative-detail?id=${id}`)
    },

    /**
     * 跳转门店详情
     */
    goToFacade() {
      let id = this.detailData.checkinInfo.facadeId
      this.$router.push(`/contract/facade/detail?id=${id}`)
    },

    /**
     * 返回
     */
    goBack() {
      this.$router.push({
        path: '/field-management/checkin-prettify-management',
      })
    },

    /**
     * 格式化日期
     */
    formatDate(time, type = 'yyyy-MM-dd hh:mm:ss') {
      return this.$format(time, type)
    },

    /**
     * 格式化动销类型
     */
    formatCheckinWay(type) {
      let res = ''
      switch (type) {
        case 'patrol':
          res = '巡店'
          break
        case 'stick_cabinet':
          res = '贴柜'
          break
        case 'activity':
          res = '活动'
          break
        default:
          break
      }
      return res
    }
  }
}
</script>

<style lang="less" scpoed>
.tour {
  .ivu-card {
    margin-bottom: 16px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .detail-content {
    border-bottom: 1px dashed #ccc;
    padding: 0 10px 20px;
    &:last-child {
      border-bottom: 0;
    }
    .title {
      font-size: 16px;
      padding: 10px 0 15px;
    }
    .active-box {
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
      transition: border .2s ease-in-out,background .2s ease-in-out,box-shadow .2s ease-in-out;
      overflow: hidden;
      white-space: nowrap;
      &:hover {
        border-color: #57a3f3;
      }
      .ivu-tooltip {
        width: 100%;
        overflow: hidden;
        .ivu-tooltip-rel {
          color: #2d8cf0;
          cursor: pointer;
        }
      }
    }
    .photo {
      .photo-content {
        display: inline-block;
        width: 100px;
        height: 100px;
        border: 1px solid #dcdee2;
        position: relative;
        overflow: hidden;
        margin-right: 10px;
        transition: border 0.2s ease-in-out, background 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        &:hover {
          border-color: #57a3f3;
          cursor: pointer;
        }
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>