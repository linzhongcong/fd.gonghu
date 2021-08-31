<template>
  <div>
    <Card>
      <div slot="title">
        <Form inline>
          <Row @keydown.native.enter.prevent="getList('search')">
            <FormItem>
              <Select v-model="searchData.kind_detail" clearable placeholder="订单类型" @on-change="getList('search')">
                <Option v-for="(item, index) in typeList" :key="'type'+index" :value="item.value"
                        :label="item.label"></Option>
              </Select>
            </FormItem>
            <FormItem>
              <Input v-model="searchData.salesman" clearable placeholder="业务员" ></Input>
            </FormItem>
            <FormItem>
              <Input v-model="searchData.merchant_name" clearable placeholder="商家"></Input>
            </FormItem>
            <FormItem>
              <Input v-model="searchData.order_sn" clearable placeholder="订单编号"></Input>
            </FormItem>
            <FormItem>
              <Input v-model="searchData.invalid_person" clearable placeholder="作废人"></Input>
            </FormItem>
            <FormItem>
              <Button type="primary" icon="ios-search" @click="getList('search')">查 询</Button>
            </FormItem>
          </Row>
        </Form>
      </div>
      <div>
        <div>
          <Table border highlight-row :columns="listData.columns" :data="listData.data" :loading="loadingTable"
                 size="small"></Table>
        </div>
        <div style="margin: 10px;overflow: hidden">
          <div class="pages-L">共 {{pageProps.totalCount}} 条</div>
          <div style="float: right;">
            <Page :total="pageProps.totalCount" size="small" :current="pageProps.currentPage" show-sizer show-elevator
                  @on-change="changePage" @on-page-size-change="changePageSize"></Page>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>
<script>
  export default {
    name: 'replacement-sample-invalid',
    data() {
      return {
        loadingTable: false,
        firstEntry: true,
        searchData: {},
        // 列表分页属性
        pageProps: {
          page: 1,
          perPage: 10,
          totalCount: 0
        },
        typeList: [
          {value: 'reissue', label: '补发订单'},
          {value: 'sample', label: '样品订单'}
        ],
        listData: {
          columns: [
            {type: 'index', title: '序号', width: 70, align: 'center'},
            {
              title: '订单编号',
              width: 200,
              align: 'center',
              render: (h, params) => {
                return h('a', {
                  on: {
                    'click': () => {
                      if (params.row.kind == 'sample') {
                        this.$router.push({
                          path: '/replacement-management/sample-order-review/sample-detail',
                          query: {
                            id: params.row.id
                          }
                        })
                      } else if (params.row.kind == 'reissue') {
                        this.$router.push({
                          path: '/replacement-management/replacement-order-review/replacement-detail',
                          query: {
                            id: params.row.id
                          }
                        })
                      }
                    }
                  }
                }, params.row.order_sn)
              }
            },
            {
              title: '订单类型',
              width: 120,
              align: 'center',
              render: (h, params) => {
                return h('div', params.row.kind == 'reissue' ? '补发' : '样品')
              }
            },
            {key: 'reason', title: '发货原因', width: 200, align: 'center'},
            {
              title: '货号',
              minWidth: 230,
              align: 'center',
              render: (h, params) => {
                params.row.value = 0
                return h('div', {
                  attrs: {
                    class: 'item-style'
                  }
                }, [h('ul', params.row.product.map((item) => {
                  params.row.value += item.price * item.number
                  return h('li', item.item_no)
                }))])
              }
            },
            {
              title: '数量',
              minWidth: 120,
              align: 'center',
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
            {
              title: '货值',
              width: 120,
              align: 'center',
              render: (h, params) => {
                return h('div', Math.round(params.row.value * 10000) / 10000)
              }
            },
            {key: 'total_order_amount', title: '订单金额', width: 120, align: 'center'},
            {key: 'invalid_person', title: '作废人', width: 130, align: 'center'},
            {
              key: 'invalid_at',
              title: '作废时间',
              width: 180,
              align: 'center',
              render: (h, params) => {
                return h('div', this.formatDate(params.row.invalid_at))
              }
            },
            {key: 'invalid_reason', title: '作废说明', width: 180, align: 'center', tooltip: true}
          ],
          data: []
        }
      }
    },
    methods: {
      // 改变页码
      changePage(e) {
        this.pageProps.page = e;
        this.getList();
      },
      // 改变页数
      changePageSize(e) {
        this.pageProps.perPage = e;
        this.getList();
      },
      getList(type) {
        if (type == 'search') {
          this.pageProps.page = 1
        }
        let params = JSON.parse(JSON.stringify(this.searchData))
        params.page = this.pageProps.page
        params.perPage = this.pageProps.perPage
        this.firstEntry ? this.firstEntry = !this.firstEntry : delete params.id_collect // fix:从首页进来之后再筛选数据查询不准确
        this.loadingTable = true
        this.$api.reissueInvalidList(params).then((res) => {
          this.listData.data = res.items
          this.pageProps.page = res._meta.currentPage
          this.pageProps.perPage = res._meta.perPage
          this.pageProps.totalCount = res._meta.totalCount
          this.pageProps.currentPage = res._meta.currentPage
        }).finally(() => {
          this.loadingTable = false
        })
      },
      formatDate(time) {  // 时间格式转换
        return this.$format(time, 'yyyy-MM-dd hh:mm:ss')
      },
    },
    activated() {
      let status = this.$route.query.status||'';
      if (status.trim()) {
        this.searchData.status = status;
      }else{
        this.searchData.status = '';

      }
      let idCollect=this.$route.query.id_collect||'';
      if(idCollect.trim()){
        this.searchData.id_collect = idCollect;
      }else{
        this.searchData.id_collect = '';

      }
      this.getList();
    },
    watch:{
      $route:{
        deep: true,
        handler:function(newVal,oldVal){
          if(oldVal.name == newVal.name && Object.keys(newVal.query)){
              this.searchData = {} 
              this.getList()
          }
        }
      }
    }
  }
</script>
<style lang="less">
  .item-style {
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