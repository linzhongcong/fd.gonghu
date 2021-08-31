<template>
  <div>
    <Card id="cancel">
      <Row>
        <Col :sm="24" @keydown.native.enter.prevent="getSearch()">
          <Form class="search" label-position="left">
            <Row style="padding:20px 0;">
              <Col :md="24">
                <FormItem label="商家：">
                  <Input v-model="Search.merchant_name" placeholder="商家" clearable />
                </FormItem>
                <FormItem label="订单号：">
                  <Input v-model="Search.order_sn" placeholder="订单号" clearable/>
                </FormItem>
                <FormItem label="作废人：">
                  <Input v-model="Search.invalid_person" placeholder="作废人" clearable/>
                </FormItem>
                <FormItem label="订单来源：">
                  <Select v-model="Search.order_form" placeholder="订单来源" clearable @on-change="getSearch()"
                          style="width:130px">
                    <Option v-for="item in orderType" :key="item.value" :value="item.value"
                            :label="item.label"></Option>
                  </Select>
                </FormItem>
                <FormItem style="text-align: right">
                  <Col span="12">
                    <Button type="primary" @click="getSearch()" icon="ios-search">查询</Button>
                  </Col>
                  <Col span="12">
                    <Button type="default" @click="addReset()" icon="md-repeat">重置</Button>
                  </Col>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col style="padding:10px 0;">
          <Table border :columns="columns1" :data="data1" :loading="loading"></Table>
        </Col>
        <Col style="float:left">
          <span>共 {{pageProps.totalCount}} 条</span>
        </Col>
        <Col style="float:right">
          <Page :total="pageProps.totalCount" size="small" :current="pageProps.currentPage" show-elevator show-sizer
                @on-change="changePage" @on-page-size-change="changePageSize"/>
        </Col>
      </Row>
    </Card>
  </div>
</template>

<script>
  export default {
    name: 'cancellation',
    data() {
      return {
        firstEntry: true,
        columns1: [
          {
            title: '序号',
            key: 'index',
            width: 65,
            align: 'center',
            render: (h, params) => {
              return h('div', {
                attrs: {
                  class: params.row.product_type === '1' ? 'new' : ''
                }
              }, params.index + 1);
            }
          },
          {
            title: '商家名称',
            key: 'merchant_name',
            align: 'center',
            width: 150
          },
          {
            title: '订单号',
            align: 'center',
            width: 200,
            render: (h, params) => {
              return h('a', {
                on: {
                  click: (zf) => {
                    this.$router.push({
                      path: '/order-management/review-details',
                      query: {id: params.row.id}
                    });
                  }
                }
              }, params.row.order_sn)
            }
          },
          {
            title: '订单来源',
            align: 'center',
            width: 150,
            render: (h, params) => {
              return h('span', this.orderForm[params.row.order_form])
            }
          },
          {
            title: '下单时间',
            align: 'center',
            width: 200,
            render: (h, params) => {
              return h('span', this.formatDate(params.row.order_time))
            }
          },
          {
            title: '货号',
            align: 'center',
            minWidth: 200,
            render: (h, params) => {
              return h('div', {
                attrs: {
                  class: 'item-style'
                }
              }, [h('ul', params.row.product.map((item) => {
                return h('li', item.item_no)
              }))])
            }
          },
          {
            title: '数量',
            align: 'center',
            minWidth: 120,
            render: (h, params) => {
              return h('div', {
                attrs: {
                  class: 'item-style'
                }
              }, [h('ul', params.row.product.map((item) => {
                return h('li', item.number)
              }))])
            }
          },
          {title: '订单金额', key: 'total_order_amount', align: 'center', width: 150},
          {title: '类型', key: 'cancel_from_desc', align: 'center', width: 100},
          {title: '审核状态', key: 'status_desc', align: 'center', width: 120},
          {title: '小程序订单状态', key: 'miniprogram_status_desc', align: 'center', width: 130},
          {title: '收款状态', key: 'receivables_status_desc', align: 'center', width: 100},
          {
            title: '作废/取消人',
            key: 'invalid_person',
            align: 'center',
            width: 120,
            render: (h, params) => {
              return h('span', params.row.cancel_from == 'order_cancel' || params.row.cancel_from == 'order_refund' ? params.row.cancel_person : params.row.invalid_person)
            }
          },
          {
            title: '作废/取消时间',
            align: 'center',
            width: 200,
            sortType:'desc',
            key:'invalid_at',
            render: (h, params) => {
              return h('span', params.row.cancel_from == 'order_cancel' || params.row.cancel_from == 'order_refund' ? this.formatDate(params.row.cancel_at) :
                this.formatDate(params.row.invalid_at))
            }
          },
          {
            title: '作废/取消理由',
            align: 'center',
            width: 300,
            tooltip: true,
            render: (h, params) => {
              return h('span', params.row.cancel_from == 'order_cancel' || params.row.cancel_from == 'order_refund' ? params.row.cancel_reason : params.row.invalid_reason)
            }

          }
        ],
        // 订单来源
        orderForm: {
          MiniProgram: '小程序',
          backstage: '后台'
        },
        data1: [],
        // 列表分页属性
        loading: true,
        pageProps: {
          page: 1,
          perPage: 10,
          currentPage: 1,
          totalCount: 0
        },
        Search: {
          merchant_name: "",
          salesman: "",
          order_sn: "",
          invalid_person: "",
        },
        orderType: [
          {value: 'backstage', label: '后台添加'},
          {value: 'MiniProgram', label: '小程序订单'}
        ],
      }
    },
    methods: {
      // 转换时间格式
      formatDate(time, json) {
        if (json === 'ymd') {
          return this.$format(time, 'yyyy-MM-dd ');
        } else {
          return this.$format(time, 'yyyy-MM-dd hh:mm');
        }
      },
      // 重置
      addReset() {
        this.getData()
        this.Search.merchant_name = "",
          this.Search.salesman = "",
          this.Search.order_sn = "",
          this.Search.invalid_person = ""
      },
      // 分页获取数据
      getData() {
        let params = {}
        this.loading = true;
        params.page = this.pageProps.page;
        params.perPage = this.pageProps.perPage;
        params.currentPage = this.pageProps.currentPage;
        params.totalCount = this.pageProps.totalCount;
        this.$api.orderCancellationList(params)
          .then(res => {
            this.loading = false;
            this.data1 = res.items
            if (res._meta) {
              this.pageProps.totalCount = res._meta.totalCount;
            }
          })
      },
      changePage(e) {
        this.pageProps.page = e;
      },
      changePageSize(e) {
        this.pageProps.perPage = e;
      },
      getSearch() {
        let params = {};
        this.loading = true;
        params = this.Search;
        this.firstEntry ? this.firstEntry = !this.firstEntry : delete params.id_collect // fix:从首页进来之后再筛选数据查询不准确
        this.$api.orderCancellationList(params)
          .then(res => {
            this.loading = false;
            this.data1 = res.items;
          })
      }
    },
    activated() {
      let status = this.$route.query.status||'';
      if (status) {
        this.Search.status = status;
      }else{
        this.Search.status = '';

      }
      let idCollect=this.$route.query.id_collect||'';
      if(idCollect){
        this.Search.id_collect = idCollect;
      }else{
        this.Search.id_collect = '';

      }
      this.getSearch(); 
    },
    watch:{
      $route:{
        deep: true,
        handler:function(newVal,oldVal){
          if(oldVal.name == newVal.name && Object.keys(newVal.query)){
              this.Search = {} 
              this.getSearch()
          }
        }
      }
    }
  };
</script>

<style lang="less" scoped>
  #cancel /deep/ .ivu-form-item-content {
    display: flex;
    padding-right: 10px;
  }

  .title {
    width: 30%;
  }

  #cancel /deep/ .item-style {
    li {
      list-style: none;
      line-height: 35px;
      border-bottom: 1px #dcdee2 solid;
      margin: 0 -18px;
    }

    li:last-child {
      border-bottom: none;
    }
  }
</style>
