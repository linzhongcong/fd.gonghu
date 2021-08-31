<template>
  <div>
    <Card>
      <Tabs v-model="currentTab" @on-click="handlerTabsClick">
        <TabPane label="订单统计列表" name="statistics-list">
          <div>
            <Row type="flex" justify="space-between">
              <Col @keydown.native.enter.prevent="getOrderList('search')">
                <Input v-model.trim="searchData.business" placeholder="业务员" style="width:150px" clearable/>
                <Input v-model.trim="searchData.merchant" placeholder="商家名称" style="width:150px" clearable/>
                <Select v-model="searchData.channel" style="width: 130px" placeholder="渠道" clearable>
                  <Option v-for="item in channelList" :key="item.value" :value="item.value">{{ item.label }}</Option>
                </Select>
                <Button type="primary" icon="ios-search" @click="getOrderList('search')">搜 索</Button>
              </Col>
              <Col>

              </Col>
            </Row>
            <Row class="row-style margin-bottom-10">
              <Col>
                <Button type="primary" @click="exportList">导出数据</Button>
              </Col>
            </Row>
          </div>
          <div>
            <Row>
              <Table border
                     :columns="listData.columns"
                     :data="listData.data"
                     :loading="tableLoading"
                     :style="currentTab !== 'statistics-list' ? 'height: 0;': ''"
                     @on-selection-change="onSelectionChange"></Table>
            </Row>
            <Row>
              <div style="padding: 20px 0">
                <div style="float: left">共 {{pageProps.total}} 条</div>
                <div style="float: right">
                  <Page :total="pageProps.total"
                        :current="pageProps.page"
                        size="small"
                        show-elevator
                        show-sizer
                        transfer
                        @on-change="page => {changePage(page, 'statistics-list')}"
                        @on-page-size-change="perPage => {changePageSize(perPage, 'statistics-list')}"/>
                </div>
              </div>
            </Row>
          </div>
        </TabPane>
        <TabPane label="订单统计分析" name="statistics-analysis" >
          <div class="tabs-wrap">
            <div :class="['tabs-item', secondTab === 'orderTrends'? 'actived' : '']"
                 @click="secondTabChange('orderTrends')">订单趋势
            </div>
            <div :class="['tabs-item', secondTab === 'channelAnalysis'? 'actived' : '']"
                 @click="() => secondTabChange('channelAnalysis')">渠道分析
            </div>
            <div :class="['tabs-item', secondTab === 'storeAnalysis'? 'actived' : '']"
                 @click="() => secondTabChange('storeAnalysis')">门店分析
            </div>
            <div :class="['tabs-item', secondTab === 'productAnalysis'? 'actived' : '']"
                 @click="() => secondTabChange('productAnalysis')">产品分析
            </div>
          </div>

          <Form class="margin-top-20" inline>
            <FormItem label="日期:" :label-width="50">
              <datePicker v-model="searchDate"
                          type="daterange"
                          placeholder="开始日期 - 结束日期"
                          transfer @on-change="dateChange"/>
            </FormItem>
            <FormItem>
              <Button type="text"
                      :class="fastTime === 'day'? 'text-btn-actived' : ''"
                      @click="getFastTime(0, 'day')">今天</Button>
              <Button type="text"
                      :class="fastTime === 'yesterday'? 'text-btn-actived' : ''"
                      @click="getFastTime(-1, 'yesterday')">昨天</Button>
              <Button type="text"
                      :class="fastTime === 'week'? 'text-btn-actived' : ''"
                      @click="getFastTime(-7, 'week')">近7天</Button>
              <Button type="text"
                      :class="fastTime === 'month'? 'text-btn-actived' : ''"
                      @click="getFastTime(-30, 'month')">近30天</Button>
            </FormItem>
            <FormItem>
              <Button icon="ios-search" type="primary" @click="search">查 询</Button>
            </FormItem>
            <FormItem>
              <Button @click="reset">重 置</Button>
            </FormItem>
          </Form>
        </TabPane>
      </Tabs>
    </Card>
    <!--        数据展示-->
    <Row class="margin-top-20 order-analysis" v-show="currentTab !== 'statistics-list'">
      <Card>
        <!--        数据-->
        <Row class="data-wrap">
          <Col span="8" style="height: 64px;" class="data-item">
            <div class="data-text">订单总量</div>
            <div class="data-num">{{order_from_list.order_quantity.replace(/\B(?=(?:\d{3})+\b)/g, ',')}}</div>
          </Col>
          <Col span="8" class="data-item">
            <div class="data-text">订单总金额（元）</div>
            <div class="data-num">{{order_from_list.order_amount.replace(/\B(?=(?:\d{3})+\b)/g, ',')}}</div>
          </Col>
          <Col span="8" class="data-item">
            <div class="data-text">合作商总数</div>
            <div class="data-num">{{order_from_list.official_partner.replace(/\B(?=(?:\d{3})+\b)/g, ',')}}</div>
          </Col>
        </Row>

        <!-- 订单趋势 -->
        <div v-show="secondTab === 'orderTrends'">
          <Row :gutter="16" class="margin-top-20">
            <Col span="12">
              <div id="order-trends" style="height: 400px"></div>
            </Col>
            <Col span="12">
              <div id="money-trends" style="height: 400px"></div>
            </Col>
          </Row>
          <div class="margin-bottom-10" style="text-align: right">
            <span style="font-size: 12px">订单来源：</span>
            <RadioGroup v-model="orderTrends.sortBy" @on-change="getOrderTrend('search')">
              <Radio label="backstage">后台</Radio>
              <Radio label="MiniProgram">小程序</Radio>
            </RadioGroup>
          </div>
          <Table :row-class-name="rowClassName" :columns="orderTrends.columns" :data="orderTrends.data" :loading="tableLoading" size="small">
            <div slot="footer" class="table-footer">
              <div>
                <div style="float: left">共 {{orderTrends.pageProps.total}} 条</div>
                <div style="float: right">
                  <Page :total="orderTrends.pageProps.total"
                        :current="orderTrends.pageProps.page"
                        size="small"
                        show-elevator
                        transfer
                        @on-change="page => {changePage(page, 'orderTrends-list')}"/>
                </div>
              </div>
            </div>
          </Table>
        </div>

        <!--        渠道分析-->
        <div v-show="secondTab === 'channelAnalysis'">
          <Row :gutter="16" class="margin-top-20">
            <Row>
              <Col span="12">
                <div id="offline-channel" style="height: 400px"></div>
              </Col>
              <Col span="12">
                <div class="margin-bottom-10" style="text-align: right">
                  <span style="font-size: 12px">排序方式：</span>
                  <RadioGroup v-model="channelAnalysis.channel.sortBy" @on-change="getChannelAnanlysis('search')">
                    <Radio label="math_count">订单数量</Radio>
                    <Radio label="import_amount">订单金额</Radio>
                    <Radio label="mer_count">合作商数量</Radio>
                  </RadioGroup>
                </div>
                <Table max-height="400" :row-class-name="rowClassName" :columns="channelAnalysis.channel.columns" size="small" :loading="tableLoading"
                       :data="channelAnalysis.channel.data">
                </Table>
              </Col>
            </Row>
<!--            TODO:暂时没有这个模块-->
<!--            <Row>-->
<!--              <Col span="12">-->
<!--                <div id="range-order" style="height: 400px"></div>-->
<!--              </Col>-->
<!--              <Col span="12">-->
<!--                <div class="sort-condition">-->
<!--                  <div>-->
<!--                    <span style="font-size: 12px">渠道：</span>-->
<!--                    <Select style="width:100px" size="small">-->
<!--                      <Option value="cs" >cs</Option>-->
<!--                      <Option value="item.value2" >2</Option>-->
<!--                    </Select>-->
<!--                  </div>-->
<!--                  <div>-->
<!--                    <span style="font-size: 12px;  text-align: right"> 排序方式：</span>-->
<!--                    <RadioGroup v-model="channelAnalysis.order.sortBy">-->
<!--                      <Radio label="订单数量"></Radio>-->
<!--                      <Radio label="订单金额"></Radio>-->
<!--                      <Radio label="合作商数量"></Radio>-->
<!--                    </RadioGroup>-->
<!--                  </div>-->
<!--                </div>-->
<!--                <Table max-height="400" :row-class-name="rowClassName" :columns="channelAnalysis.order.columns"-->
<!--                       :data="channelAnalysis.order.data">-->
<!--                  <div slot="footer" class="table-footer">-->
<!--                    <div>-->
<!--                      <div style="float: left">共 {{channelAnalysis.order.pageProps.total}} 条</div>-->
<!--                      <div style="float: right">-->
<!--                        <Page :total="channelAnalysis.order.pageProps.total"-->
<!--                              :current="channelAnalysis.order.pageProps.page"-->
<!--                              size="small"-->
<!--                              show-elevator-->
<!--                              show-sizer-->
<!--                              transfer-->
<!--                              @on-change="page => {changePage(page, 'rangeOrder-list')}"-->
<!--                              @on-page-size-change="perPage => {changePageSize(perPage, 'rangeOrder-list')}"/>-->
<!--                      </div>-->
<!--                    </div>-->
<!--                  </div>-->
<!--                </Table>-->
<!--              </Col>-->
<!--            </Row>-->
          </Row>


        </div>

        <!--        门店分析-->
        <div div v-show="secondTab === 'storeAnalysis'">
          <Row :gutter="16" class="margin-top-20">
            <Col span="12">
              <div id="china-map" style=" height: 400px"></div>
            </Col>
            <Col span="12">
              <div class="margin-bottom-10" style="text-align: right">
                <span style="font-size: 12px;">排序方式：</span>
                <RadioGroup v-model="storeAnalysis.sortBy" @on-change="getStoreAnalysis('search')">
                  <Radio label="math_count">订单数量</Radio>
                  <Radio label="import_amount">订单金额</Radio>
                  <Radio label="mer_count">合作商数量</Radio>
                </RadioGroup>
              </div>
              <Table max-height="400" :row-class-name="rowClassName" :columns="storeAnalysis.columns" :loading="tableLoading" size="small"
                     :data="storeAnalysis.data">
                <div slot="footer" class="table-footer">
                  <div>
                    <div style="float: left">共 {{storeAnalysis.pageProps.total}} 条</div>
                    <div style="float: right">
                      <Page :total="storeAnalysis.pageProps.total"
                            :current="storeAnalysis.pageProps.page"
                            size="small"
                            show-elevator
                            transfer
                            @on-change="page => {changePage(page, 'province-list')}"/>
                    </div>
                  </div>
                </div>
              </Table>
            </Col>
          </Row>
        </div>

        <!--        产品分析-->
        <div div v-show="secondTab === 'productAnalysis'">
          <Row :gutter="16" class="margin-top-20">
              <Col span="12">
                <div id="product-ranking" style="height: 400px"></div>
              </Col>
              <Col span="12">
                <div class="margin-bottom-10" style="text-align: right">
                  <span style="font-size: 12px">排序方式：</span>
                  <RadioGroup v-model="productAnalysis.sortBy"  @on-change="getProductAnalysis('search')">
                    <Radio label="math_count">订单数量</Radio>
                    <Radio label="import_amount">订单金额</Radio>
                    <Radio label="mer_count">合作商数量</Radio>
                  </RadioGroup>
                </div>
                <Table max-height="400" :row-class-name="rowClassName" :columns="productAnalysis.columns" :loading="tableLoading" size="small"
                       :data="productAnalysis.data">
                  <div slot="footer" class="table-footer">
                    <div>
                      <div style="float: left">共 {{productAnalysis.pageProps.total}} 条</div>
                      <div style="float: right">
                        <Page :total="productAnalysis.pageProps.total"
                              :current="productAnalysis.pageProps.page"
                              size="small"
                              show-elevator
                              transfer
                              @on-change="page => {changePage(page, 'production-list')}"/>
                      </div>
                    </div>
                  </div>
                </Table>
              </Col>
            </Row>
        </div>

      </Card>
    </Row>
  </div>

</template>

<script>
  import echarts from 'echarts'
  // import china from '~/plugins/china'
  import china from 'echarts/map/js/china'
  export default {
    name: 'order-statistics',
    data() {
      return {
        currentTab: 'statistics-list',
        secondTab: 'orderTrends',
        searchDate: [
             this.$format(new Date().getTime()/1000,'yyyy/MM/dd'),
             this.$format(new Date().getTime()/1000,'yyyy/MM/dd')
        ],
        fastTime: 'day',
        tableLoading: false,
        selection: [],
        order_from_list: {
          order_quantity: '0',
          order_amount: '0',
          official_partner: '0',
        },
        pageProps: {
          total: 10,
          page: 1,
          perPage: 10
        },
        searchData: {
          business: '',
          merchant: '',
          channel: '',
        },
        analysisSearchData: {
          begin_time: '',
          end_time: '',
          time_checkbox: '',
        },
        channelList: [
          { value: 'cs', label: 'CS' },
          { value: 'ka', label: 'KA' },
          { value: 'otc', label: 'OTC' },
          { value: 'store', label: '便利店' },
          { value: 'other', label: '其他' }
        ],
        listData: {
          columns: [
            {type: 'selection', align: 'center', width: 60},
            {title: '序号', type: 'index', align: 'center', width: 70},
            {title: '渠道', key: 'merchant_type', align: 'center', width: 80,
              render: (h, {row}) => h('span', {}, this.switchMerchantType(row.merchant_type))
            },
            {title: '商家名称', key: 'merchant_name', align: 'center', width: 100},
            {title: '收货地址', key: 'receiving_address', align: 'center', minWidth: 200},
            {title: '订单号', key: 'order_sn', align: 'center', width: 140},
            {title: '产品名称', key: 'pro_name', align: 'center', width: 140,
              render: (h, {row}) => {
                let domArr = row.productAll.map(product => h('div', {
                  style: {
                    'padding': '2px 0'
                  }
                }, product.pro_name ? product.pro_name : '-'))
                return h('div', {}, domArr)
              }
            },
            {title: '货值', key: 'product_amount', align: 'center', width: 90,
              render: (h, {row}) => {
                let domArr = row.productAll.map(product => h('div', {
                  style: {
                    'padding': '2px 0'
                  }
                }, product.product_amount  ? product.product_amount : '-'))
                return h('div', {}, domArr)
              }
            },
            {title: '单价', key: 'price', align: 'center', width: 90,
              render: (h, {row}) => {
                let domArr = row.productAll.map(product => h('div', {
                  style: {
                    'padding': '2px 0'
                  }
                }, product.price  ? product.price : '-'))
                return h('div', {}, domArr)
              }
            },
            {title: '成本价', key: 'cost_price', align: 'center', width: 90,
              render: (h, {row}) => {
                let domArr = row.productAll.map(product => h('div', {
                  style: {
                    'padding': '2px 0'
                  }
                }, product.cost_price  ? product.cost_price : '-'))
                return h('div', {}, domArr)
              }
            },
            {title: '数量', key: 'number', align: 'center', width: 90,
              render: (h, {row}) => {
                let domArr = row.productAll.map(product => h('div', {
                  style: {
                    'padding': '2px 0'
                  }
                }, product.number ? product.number : '-'))
                return h('div', {}, domArr)
              }
            },
            {title: '打款金额', key: 'import_amount', align: 'center', width: 90},
            {title: '创建人', key: 'created_by', align: 'center', width: 100},
            {title: '业务员', key: 'salesman', align: 'center', width: 100}
          ],
          data: []
        },
        orderTrends: {
          totalOrder: {
            title: '| 订单总量趋势',
            subtext: '单位： 张',
            xAxisData: [],
            yAxisData: {
              data:[],
              type: 'line',
              symbol: 'circle', // 拐点虚实
              itemStyle: {
                normal: {
                  color: '#00A4E9', //折点颜色
                  lineStyle: {
                    color: '#00A4E9' //折线颜色
                  }
                }
              }
            }
          },
          totalMoney: {
            title: '| 订单总金额趋势',
            subtext: '单位： 元',
            xAxisData: ['Mon2', 'Tue2', 'Wed2', 'Thu2', 'Fri2', 'Sat2', 'Sun2'],
            yAxisData: {
              data:[820, 932, 901, 934, 1290, 1330, 1320],
              type: 'line',
              symbol: 'circle', // 拐点虚实
              itemStyle: {
                normal: {
                  color: '#00A4E9', //折点颜色
                  lineStyle: {
                    color: '#00A4E9' //折线颜色
                  }
                }
              }
            }
          },
          columns: [
            {title: '排序', type: 'index', align: 'center', className: 'test-name'},
            {title: '商家名称', key: 'merchant_name', align: 'center', className: 'test-name',
              render: (h, {row}) => {
                return h('span', { class: {'new-merchant': row.tag === 'NEW'} }, row.merchant_name)
              }
            },
            {title: '订单来源', key: 'order_form', align: 'center', className: 'test-name'},
            {title: '订单数量', key: 'count', align: 'center', className: 'test-name'},
            {title: '订单金额', key: 'import_amount', align: 'center', className: 'test-name'},
          ],
          data: [],
          pageProps: {
            total: 10,
            page: 1,
            perPage: 10
          },
          sortBy: 'backstage',
        },
        channelAnalysis: {
          offlineChannel: {
            color: ['#00A4E9'],
            title: '| 线下渠道订单排行',
            xAxisData: [],
            yAxisData: [
              {
                name: '订单数量',
                data:[],
                type: 'bar',
                barWidth : 30,
                label: {
                  show: true,
                  position: 'right',
                  formatter: '{c}%'
                },
              }
            ]
          },
          rangeOrder: { // TODO:暂时没有该模块
            color: ['#FF4D4F', '#FF7A45', '#FFA940', '#FFC53D', '#FFEC3D', '#BAE637', '#73D13D', '#36CFC9', '#40A9FF', '#597EF7', '#9254DE', '#F759AB'],
            title: '| 区域订单排行',
            legend: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月' ],
            xAxisData: ['华中亮剑队', '华中冠军队', '没有这个队', '你就是不队', '到底对不队', '华南超越队' ],
            yAxisData: [
              {
                data:[820, 932, 901, 934, 1290, 1330,],
                type: 'bar',
                name: '1月',
                stack: '总量',
                label: {
                  show: true,
                  position: 'insideTop'
                },
              },
              {
                data:[82, 493, 4101, 494, 410, 430, ],
                type: 'bar',
                name: '2月',
                stack: '总量',
                label: {
                  show: true,
                  position: 'insideTop'
                },
              },
            ]
          },
          order: { // TODO:暂时没有该模块
            columns: [
              {title: '排序', type: 'index', align: 'center', className: 'test-name'},
              {title: '渠道', key: 'order_form', align: 'center', className: 'test-name',
                render: (h, {row}) => h('span', {}, this.switchMerchantType(row.merchant_type))
              },
              {title: '订单量', key: 'count', align: 'center', className: 'test-name'},
              {title: '订单金额', key: 'import_amount', align: 'center', className: 'test-name'},
              {title: '合作商数量', key: 'import_amount', align: 'center', className: 'test-name'}
            ],
            data: [],
            pageProps: {
              total: 10,
              page: 1,
              perPage: 10
            },
            sortBy: '',
          },
          channel: {
            columns: [
              {title: '排序', type: 'index', align: 'center', className: 'test-name'},
              {title: '渠道', key: 'merchant_type', align: 'center', className: 'test-name',
                render: (h, {row}) => h('span', {}, this.switchMerchantType(row.merchant_type))
              },
              {title: '订单量', key: 'math_count', align: 'center', className: 'test-name'},
              {title: '订单金额', key: 'import_amount', align: 'center', className: 'test-name'},
              {title: '合作商数量', key: 'mer_count', align: 'center', className: 'test-name'}
            ],
            data: [],
            pageProps: {
              total: 10,
              page: 1,
              perPage: 10
            },
            sortBy: 'math_count',
          },
        },
        productAnalysis: {
          productRanking: {
            color: ['#FF4D4F', '#FF7A45', '#FFA940', '#FFEC3D', '#73D13D', '#36CFC9', '#40A9FF', '#096DD9', '#722ED1', '#EB2F96'],
            title: '| 产品品类排行',
            xAxisData: [],
            yAxisData: [{
              name: '品类',
              type: 'pie',
              radius: ['30%', '50%'],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                }
              },
              itemStyle: {
                normal:{
                  label:{
                    show: true,
                    formatter: '{b} : {c}'
                  },
                  labelLine: {show:true}
                }
              },
              data: []
            }]
          },
          columns: [
            {title: '排名', type: 'index', align: 'center', className: 'test-name'},
            {title: '品类', key: 'category_name', align: 'center', className: 'test-name'},
            {title: '订单量(含该品类)', key: 'math_count', align: 'center', width: 110, className: 'test-name'},
            {title: '订单金额', key: 'import_amount', align: 'center', className: 'test-name'},
            {title: '合作商数量', key: 'mer_count', align: 'center', className: 'test-name'}
          ],
          data: [],
          pageProps: {
            total: 10,
            page: 1,
            perPage: 10
          },
          sortBy: 'math_count',
        },
        storeAnalysis: {
          chinaMap: [
            {
              name: '信息量',
              type: 'map',
              geoIndex: 0,
              label: {
                normal: {
                  show: false
                },
                emphasis: {
                  show: false
                },
              },
              data: [],
            }
          ],
          columns: [
            {title: '排名', type: 'index', align: 'center', className: 'test-name'},
            {title: '省份', key: 'province', align: 'center', className: 'test-name'},
            {title: '订单量', key: 'math_count', align: 'center', className: 'test-name'},
            {title: '订单金额', key: 'import_amount', align: 'center', className: 'test-name'},
            {title: '合作商数量', key: 'mer_count', align: 'center', className: 'test-name'}
          ],
          data: [],
          pageProps: {
            total: 10,
            page: 1,
            perPage: 10
          },
          sortBy: 'math_count',
        }
      }
    },
    activated() {
      this.search()
    },
    watch: {
    },
    methods: {
      handlerTabsClick(e) {
        this.search()
      },
      getDataBySecondTab (cur) {
        // 切换TabPane 时触发
          var last =  this.$format(new Date().getTime()/1000,'yyyy/MM/dd')
          var now = this.$format(new Date().getTime()/1000,'yyyy/MM/dd')
          // this.searchDate = [new Date(), new Date()]
          this.searchDate = [last,now]
          this.fastTime = 'day'
          this.analysisSearchData = {
            begin_time: '',
            end_time: '',
            time_checkbox: '',
          }
          switch (cur) {
            case 'orderTrends':
              this.getOrderTrend('search')
              break;
            case 'channelAnalysis':
              this.getChannelAnanlysis('search')
              break;
            case 'storeAnalysis':
              this.getStoreAnalysis('search')
              break;
            case 'productAnalysis':
              this.getProductAnalysis('search')
              break;
          }
      },

      setLineChartOptions(options) {
        // orderTrends
        let comOptions = this.lineChartOption()
        comOptions.title.text = options.title
        comOptions.title.subtext = options.subtext ? options.subtext : ''
        comOptions.xAxis.data = options.xAxisData
        // 7 -- 15 -- 30
        if(comOptions.xAxis.data.length > 7 && comOptions.xAxis.data.length < 15) {
          comOptions.xAxis.axisLabel.interval = 2
        }else if(comOptions.xAxis.data.length > 15) {
          comOptions.xAxis.axisLabel.interval = 3
        }
        comOptions.series = options.yAxisData
        // comOptions.xAxis.axisLabel = {
        //   interval:0,//代表显示所有x轴标签显示
        //   rotate:45, //代表逆时针旋转45度
        // }

        return comOptions
      },

      setBarChartOptions(options, direction) {
        // orderTrends
        let comOptions = this.barChartOption()
        if(direction === 'horizontal') {
          comOptions.title.text = options.title
          comOptions.yAxis.data = options.xAxisData
          comOptions.series = options.yAxisData
        }else {
          comOptions.yAxis = {
            ype: 'value',
            axisTick: {
              show: false
            }
          } 
          comOptions.xAxis =  {
            type: 'category',
            data: options.xAxisData,
            axisTick: {
              show: false
            },
            axisLabel: {
              interval: 0 
            }
          }
          comOptions.series = options.yAxisData
          comOptions.legend.data = options.legend
          comOptions.color = options.color
        }
        return comOptions
      },

      setPieChartOptions(options) {
        let comOptions = this.pieChartOption()
        comOptions.title.text = options.title
        comOptions.color = options.color
        comOptions.legend.data = options.xAxisData
        comOptions.series = options.yAxisData
        return comOptions
      },

      // 订单趋势折线图
      showOrderTrendsChart() {
        this.$nextTick(() => {
          let orderChart = echarts.init(document.getElementById('order-trends'))
          let moneyChart = echarts.init(document.getElementById('money-trends'))
          let {totalOrder, totalMoney} = this.orderTrends

          orderChart.setOption(this.setLineChartOptions(totalOrder))
          moneyChart.setOption(this.setLineChartOptions(totalMoney))

          window.addEventListener("resize", function() {
            orderChart.resize();
            moneyChart.resize();
          });
        })
      },
      // 渠道分析柱状图
      showChannelAnalysisChart() {
        this.$nextTick(() => {
          let offlineChart = echarts.init(document.getElementById('offline-channel'))
          // let orderChart = echarts.init(document.getElementById('range-order'))
          let {offlineChannel, rangeOrder} = this.channelAnalysis

          offlineChart.setOption(this.setBarChartOptions(offlineChannel, 'horizontal'))
          // orderChart.setOption(this.setBarChartOptions(rangeOrder, 'upright'))

          window.addEventListener("resize", function() {
            offlineChart.resize()
            // orderChart.resize()
          })
        })
      },
      // 门店分析地图
      showStoreAnalysisChart() {
        this.$nextTick(() => {
          let map = echarts.init(document.getElementById('china-map'))
          let { chinaMap } = this.storeAnalysis
          let option = this.mapOption()
          option.series = chinaMap
          map.setOption(option)

          window.addEventListener("resize", function() {
            map.resize()
          })
        })
      },
      // 产品分析
      showProductAnalysisChart() {
        this.$nextTick(() => {
          let productChart = echarts.init(document.getElementById('product-ranking'))
          let {productRanking} = this.productAnalysis

          productChart.setOption(this.setPieChartOptions(productRanking))

          window.addEventListener("resize", function() {
            productChart.resize()
          })
        })
      },

      reset() {
        var last =  this.$format(new Date().getTime()/1000,'yyyy/MM/dd')
        var now = this.$format(new Date().getTime()/1000,'yyyy/MM/dd')
        // this.searchDate = [new Date(), new Date()]
        this.searchDate = [last,now]
        this.fastTime = 'day'
        this.analysisSearchData = {
          begin_time: '',
          end_time: '',
          time_checkbox: '',
        }
        this.search()
      },

      // 查询
      search() {
        if(this.currentTab === 'statistics-analysis') {
          switch (this.secondTab) {
            case 'orderTrends':
              this.getOrderTrend('search')
              break;
            case 'channelAnalysis':
              this.getChannelAnanlysis('search')
              break;
            case 'storeAnalysis':
              this.getStoreAnalysis('search')
              break;
            case 'productAnalysis':
              this.getProductAnalysis('search')
              break;
          }
        }else {
          this.getOrderList('search')
        }
      },

      secondTabChange(val) {
        this.secondTab = val
        this.getDataBySecondTab(val)
      },

      dateChange(date){
        this.analysisSearchData.begin_time = date[0]
        this.analysisSearchData.end_time = date[1]
        this.fastTime = ''
        this.analysisSearchData.time_checkbox = ''
      },

      getFastTime(day, fastTime) {
        let now = ''
        let today = new Date()
        let year = today.getFullYear()
        let mon = today.getMonth()
        let date = today.getDate()
        let lastDay = new Date(year, mon, date + day)
        let last = lastDay.toLocaleDateString().replace(/\//g, '-')
        now = today.toLocaleDateString().replace(/\//g, '-')
        this.searchDate = [last, now]
        this.analysisSearchData.time_checkbox = fastTime
        this.fastTime = fastTime
        this.analysisSearchData.begin_time = ''
        this.analysisSearchData.end_time = ''
        // console.log(this.searchDate);
        this.search()
      },

      onSelectionChange(selection) {
        // this.selection = selection
        this.selection[this.pageProps.page - 1] = selection
      },

      // 导出
      exportList() {
        let params = JSON.parse(JSON.stringify(this.searchData))
        let idsArr = []
        if(this.selection.length > 0) {
          this.selection.forEach(items => {
            let ids = items.map(item => item.id)
            idsArr = idsArr.concat(ids)
          })
          params.id = idsArr.join(',')
        }else {
          this.listData.data.map(items => items.id).join(',')
        }

        // params.id = this.selection.length > 0 ? this.selection.map(items => items.id).join(',') : this.listData.data.map(items => items.id).join(',')
        this.$Message.info('正在导出')
        this.$api.exportOrderStatisticsList(params).then(res => {
          if(res.code !== 0) return
          let link = document.createElement('a')
          link.href = res.data[0]
          link.download = res.data[0].substr(-res.data[0].lastIndexOf('/'))
          link.click()
          link.remove()

          this.selection = []
          this.listData.data = this.listData.data.map(items => {
            items._checked = false
            return items
          })

        })
      },

      // 改变页码
      changePage(e, name) {
        switch (name) {
          case 'statistics-list':
            this.pageProps.page = e;
            this.getOrderList()
            break;
          case 'orderTrends-list':
            this.orderTrends.pageProps.page = e;
            this.getOrderTrend()
            break;
          case 'offlineChannel-list':
            this.channelAnalysis.channel.pageProps.page = e;
            break;
          case 'rangeOrder-list':
            this.channelAnalysis.order.pageProps.page = e;
            break;
          case 'province-list':
            this.storeAnalysis.pageProps.page = e;
            this.getStoreAnalysis()
            break;
          case 'production-list':
            this.productAnalysis.pageProps.page = e;
            this.getProductAnalysis()
            break;
        }
      },

      // 改变每页显示数
      changePageSize(e, name) {
        this.pageProps.perPage = e
        switch (name) {
          case 'statistics-list':
            this.pageProps.perPage = e;
            this.getOrderList()
            break;
          case 'orderTrends-list':
            this.orderTrends.pageProps.perPage = e;
            this.getOrderTrend()
            break;
          case 'offlineChannel-list':
            this.channelAnalysis.channel.pageProps.perPage = e;
            break;
          case 'rangeOrder-list':
            this.channelAnalysis.order.pageProps.perPage = e;
            break;
          case 'province-list':
            this.storeAnalysis.pageProps.perPage = e;
            this.getStoreAnalysis()
            break;
          case 'production-list':
            this.productAnalysis.pageProps.perPage = e;
            this.getProductAnalysis()
            break;
        }
      },

      // 订单统计
      getOrderList(type) {
        this.tableLoading = true
        let params = this.searchData
        if(type === 'search') {
          this.pageProps.page = 1
          this.selection = []
        }
        params.page = this.pageProps.page
        params.perPage = this.pageProps.perPage
        this.$api.getOrderStatisticsList(params).then(res =>{ 
          let {items, _meta} = res

          if (this.selection && this.selection[params.page - 1] && this.selection[params.page - 1].length) {
            items.forEach(item => {
              let isHas = this.selection[params.page - 1].find(selectItem => selectItem.id === item.id)
              if (isHas) {
                item._checked = true
              }
            })
          }
          this.listData.data = items
          this.pageProps.total = _meta.totalCount
          this.tableLoading =false
        })
      },

      // 订单分析 - 订单趋势
      getOrderTrend(type) {
        this.tableLoading = true
        let params = this.analysisSearchData
        if(type === 'search') {
          this.orderTrends.pageProps.page = 1
        }
        params.source = this.orderTrends.sortBy
        params.page = this.orderTrends.pageProps.page
        params.perPage = this.orderTrends.pageProps.perPage
        // console.log('trend',params)
        this.$api.getOrderTrend(params).then(res =>{

          if(res.code !== 0) return

          let {order_from_list, total_order, total_money, list} = res.data
          this.order_from_list = order_from_list
          this.orderTrends.data = list.data
          this.orderTrends.pageProps.total = list._meta.totalCount

          this.orderTrends.totalOrder.xAxisData = total_order.x
          this.orderTrends.totalOrder.yAxisData.data = total_order.content.data
          this.orderTrends.totalMoney.xAxisData = total_money.x
          this.orderTrends.totalMoney.yAxisData.data = total_money.content.data

          this.showOrderTrendsChart()

          this.tableLoading =false
        })
      },

      // 订单分析 - 渠道分析
      getChannelAnanlysis(type) {
        this.tableLoading = true
        let params = this.analysisSearchData
        if(type === 'search') {
          this.channelAnalysis.channel.pageProps.page = 1
        }
        this.channelAnalysis.offlineChannel.xAxisData = []
        this.channelAnalysis.offlineChannel.yAxisData[0].data = []

        params.group_by_order_form = this.channelAnalysis.channel.sortBy
        params.page = this.channelAnalysis.channel.pageProps.page
        params.perPage = this.channelAnalysis.channel.pageProps.perPage
        this.$api.getChannelAnalyze(params).then(res =>{
          if(res.code !== 0) return
          let {order_from_list, cSList, cSListAnalyze} = res.data
          this.order_from_list = order_from_list
          this.channelAnalysis.channel.data = cSList.data

          cSListAnalyze.data.forEach(items => {
            items.name = this.switchMerchantType(items.name)
            this.channelAnalysis.offlineChannel.xAxisData.push(items.name)
            this.channelAnalysis.offlineChannel.yAxisData[0].data.push(items.data)
            this.channelAnalysis.offlineChannel.yAxisData[0].name = this.switchSortType(this.channelAnalysis.channel.sortBy)
          })

          this.showChannelAnalysisChart()
          this.tableLoading =false
        })
      },

      // 订单分析 - 门店分析
      getStoreAnalysis(type) {
        this.tableLoading = true
        let params = this.analysisSearchData
        if(type === 'search') {
          this.storeAnalysis.pageProps.page = 1
        }

        params.group_by_order_form = this.storeAnalysis.sortBy
        params.page = this.storeAnalysis.pageProps.page
        params.perPage = this.storeAnalysis.pageProps.perPage
        this.$api.getsStoreAnalyze(params).then(res =>{
          if(res.code !== 0) return
          let {order_from_list, storeList, storeListAnalyze} = res.data
          this.order_from_list = order_from_list
          this.storeAnalysis.data = storeList.data
          this.storeAnalysis.pageProps.total = storeList._meta.totalCount

          this.storeAnalysis.chinaMap[0].data = storeListAnalyze.data
          this.storeAnalysis.chinaMap[0].name = this.switchSortType(this.storeAnalysis.sortBy)

          this.showStoreAnalysisChart()

          this.tableLoading =false
        })
      },

      // 订单分析 - 产品分析
      getProductAnalysis(type) {
        this.tableLoading = true
        let params = this.analysisSearchData
        if(type === 'search') {
          this.productAnalysis.pageProps.page = 1
        }
        // console.log(this.productAnalysis.pageProps.page)
        params.group_by_order_form = this.productAnalysis.sortBy
        params.page = this.productAnalysis.pageProps.page
        params.perPage = this.productAnalysis.pageProps.perPage

        this.$api.getProductAnalyze(params).then(res =>{
          if(res.code !== 0) return
          let {order_from_list, productList, productListAnalyze} = res.data
          this.order_from_list = order_from_list
          this.productAnalysis.data = productList.data
          this.productAnalysis.pageProps.total = productList._meta.totalCount
          this.productAnalysis.productRanking.xAxisData = productListAnalyze.data.map(items => items.name)
          this.productAnalysis.productRanking.yAxisData[0].data = productListAnalyze.data

          this.showProductAnalysisChart()
          this.tableLoading =false
        })
      },


      rowClassName(row, index) {
        return index % 2 === 0 ? 'table-error-row' : 'table-info-row'
      },

      switchMerchantType(type) {
        let MerchantTypeList = {
          cs: 'CS',
          ka: 'KA',
          otc: 'OTC',
          store: '便利店',
          other: '其他',
        }
        return MerchantTypeList[type]
      },

      switchSortType(type) {
        let sortList = {
          math_count: '订单量',
          import_amount: '金额',
          mer_count: '合作商数量',
        }
        return sortList[type]
      },

      lineChartOption() {
        let option = {
          title: {
            text: '',
            textStyle: {
              fontSize: 12,
              color: '#00A4E9',
            },
            subtext: ''
          },
          tooltip: {
            trigger: 'axis',
          },
          xAxis: {
            type: 'category',
            axisTick: {
              show: false
            },
            axisLabel: {
              interval: 0,//代表显示所有x轴标签显示
              //rotate: 10, //代表逆时针旋转45度
              formatter: function (value, index) {
                // 格式化成月/日，只在第一个刻度显示年份
                // var date = new Date(value)
                // var texts = [(date.getMonth() + 1), date.getDate()]
                if (index !== 0) {
                  // texts.unshift(date.getYear())
                  value = value.substr(5)
                }
                // return texts.join('/')
                return value
              }
            },
            data: []
          },
          yAxis: {
            type: 'value',
            //是否显示坐标轴刻度。
            axisTick: {
              show: false
            },
            axisLine: {
              show: false,
            },
            axisLabel: {
              formatter: function (value, index) {
                if (value >= 10000 && value < 10000000) {
                  value = value / 10000 + "万";
                } else if (value >= 10000000) {
                  value = value / 10000000 + "千万";
                }
                return value;
              }
            },
          },
          series: []
        }
        return option
      },
      
      barChartOption() {
        let option = {
          color: ['#00A4E9'],
          title: {
            text: '',
            textStyle: {
              fontSize: 12,
              color: '#00A4E9',
            },
            subtext: ''
          },
          legend: {
            data: [],
            width: '90%',
            icon: "circle",
            itemWidth: 6,  
            itemHeight: 6, 
            textStyle: {
                fontSize: '12px',
            },
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: function(data){
              return data[0].name + '<br/>' + data[0].seriesName + '：' + (data[0].value ) + '%'
            }
          },
          xAxis: {
            type: 'value',
            axisTick: {
              show: false
            },
            axisLabel: {
              formatter: '{value} %'
            }
          },
          yAxis: {
            type: 'category',
            axisTick: {
              show: false
            },
            data: []
          },
          series: []
        }
        return option
      },

      pieChartOption() {
        let option = {
          color: [],
          title: {
            text: '',
            left: 'left',
            textStyle: {
              fontSize: 12,
              color: '#00A4E9',
            },
          },
          tooltip: {
            trigger: 'item',
            formatter: '{b}: ({d}%)'
          },
          legend: {
            orient: 'horizontal',
            bottom: 0,
            itemGap: 15,
            width: '80%',
            data: [],
          },
          series: []
        }
        return option
      },
      
      mapOption() {
        let option = {
          tooltip: {
            formatter: function(params,ticket, callback){
              return params.seriesName + '<br />' + params.name+ '：' + (params.value ? params.value : 0)
            }
          },
          visualMap: {
            inRange: {
              color: ['#e0ffff', '#006edd']
            },
            show: false
          },
          geo: {
            map: 'china',
            roam: false,
            zoom:1.23,
            label: {
              normal: {
                show: true,
                  fontSize: '10',
                  color: 'rgba(0,0,0,0.7)'
              },
            },
            itemStyle: {
              normal:{
                borderColor: 'rgba(0, 0, 0, 0.2)',
                // borderColor: '#009fe8', //区域边框颜色
                // areaColor: "#ffefd5", //区域颜色
              },
              emphasis: {
                areaColor: '#F3B329', // 鼠标悬浮下颜色
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowBlur: 20,
                borderWidth: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              },
            }
          },
          series: []
        }
        return option
      }
    },
    watch:{
      $route:{
        deep: true,
        handler:function(newVal,oldVal){
          if(oldVal.name == newVal.name && Object.keys(newVal.query)){
              this.searchData = {} 
              this.getOrderList()
          }
        }
      },
      currentTab: function(cur) {
        if (cur === 'statistics-list') return
        this.selection = []
        this.search()
      }
    },
    created() {
      this.getDataBySecondTab(this.secondTab)
    }
  }
</script>

<style lang="less" scoped>
  .row-style {
    margin-top: 10px;
  }

  .tabs-wrap {
    display: flex;
    padding-bottom: 16px;
    border-bottom: 1px dashed #D9D9D9;

    .tabs-item {
      box-sizing: border-box;
      padding: 6px 24px;
      height: 32px;
      border: 1px solid #D9D9D9;
      text-align: center;
      font-size: 14px;

      &:hover {
        cursor: pointer;
      }

      &.actived {
        background-color: rgba(0, 164, 233, 0.25);
        color: #00A4E9;
        border: none
      }

      + .tabs-item {
        border-right: none;
      }

      &:first-child {
        border-radius: 2px 0 0 2px;
        border-right: none;
      }

      &:last-child {
        border-radius: 0 2px 2px 0;
        border-right: 1px solid #D9D9D9;
      }
    }
  }

  /deep/ .ivu-form-item-content {
    /deep/ .ivu-btn-text:focus {
      box-shadow: unset;
    }
  }

  .text-btn-actived {
    color: #00A4E9;
  }

  .data-wrap {
    background-color: rgba(0, 164, 233, 0.1);
    padding: 36px 0;
    text-align: center;
    border: 1px solid rgba(0, 164, 233, 1);
    border-radius: 4px;

    .data-item {
      .data-text {
        font-size: 16px;
      }

      .data-num {
        font-size: 30px;
        font-weight: bold;
        color: rgba(0, 164, 233, 1);
      }

      + .data-item {
        border-left: 1px solid #00A4E9
      }
    }
  }

  .sort-condition {
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  /deep/ .ivu-table .table-info-row td {
    background-color: #eff9fe;
  }

  /deep/ .ivu-table .table-error-row td {
    background-color: #f8f8f8;
  }

  /deep/ .ivu-table th.test-name {
    background: #00A4E9;
    color: #fff;
  }

  /deep/ .ivu-table-wrapper {
    border: none;
  }

  .order-analysis /deep/ .ivu-table:after,
  .order-analysis /deep/ .ivu-table:before {
    background-color: unset;
  }

  /deep/ .ivu-table-row-hover td {
    background-color: #fff !important;
  }

  .sort-label {
    font-size: 12px;
  }
  .order-analysis /deep/ .ivu-table::before, .order-analysis /deep/ .ivu-card, /deep/ .ivu-modal-body {
    background-image: unset
  }

  /deep/ .new-merchant {
    position: relative;
    &:before {
      content: 'NEW';
      color: #ff0000;
      position: absolute;
      right: -30px;
      top: -13px;
      font-weight: 700;
      font-style: italic;
      display: block;
      width: 30px;
    }
  }

  /deep/ .ivu-table-cell,.new-merchant {
    overflow: unset;
  }

</style>