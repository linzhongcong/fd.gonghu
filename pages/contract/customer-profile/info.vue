<template>
  <div>
    <Card class="client-mian">
      <Row>
        <Col><h3>基本信息</h3></Col>
        <Col>
          <Form :label-width="100" class="client-info" inline >
            <Row>
              <Col>
                <FormItem label="商家名称：">
                  <Input type="text" readonly class="inp-max-width" v-model="clientInfo.info.merchant_name" ></Input>
                </FormItem>

                <FormItem label="商家类型：">
                  <Input type="text" readonly v-model="clientInfo.info.merchant_type" ></Input>
                </FormItem>
              </Col>

              <Col>
                <FormItem label="业务员：">
                  <Input type="text" readonly v-model="clientInfo.info.salesman_name" ></Input>
                </FormItem>

                <FormItem label="联系人姓名：">
                  <Input type="text" readonly v-model="clientInfo.info.contact_name" ></Input>
                </FormItem>

                <FormItem label="联系人电话：">
                  <Input type="text" readonly v-model="clientInfo.info.contact_phone" ></Input>
                </FormItem>
              </Col>

              <Col>
                <FormItem label="创建人：">
                  <Input type="text" readonly v-model="clientInfo.info.created_by" ></Input>
                </FormItem>

                <FormItem label="创建时间：">
                  <Input type="text" readonly v-model="clientInfo.info.created_at" ></Input>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>

      <hr>

      <Row class="shop-info" >
        <Col><h3>门店信息</h3></Col>
        <Col>
          <Form :label-width="100" class="client-info" inline >
            <FormItem label="门店名称：">
              <Input placeholder="门店名称" v-model="clientShop.search.name" @on-enter="changeInp" ></Input>
            </FormItem>

            <FormItem label="门店地址：">
              <Input placeholder="门店地址" v-model="clientShop.search.address" class="inp-max-width" @on-enter="changeInp" ></Input>
            </FormItem>

            <Button type="primary" @click="changeInp" >搜索</Button>
          </Form>
        </Col>
        <Col>
          <Table
            border
            :loading="clientShop.loading"
            :columns="clientShop.columns"
            :data="clientShop.list"
          >
          </Table>
        </Col>
        <Col>
          <div class="page-box">
            <div class="pages-L">共 {{ clientShop.total }} 条</div>
            <div class="pages-r">
              <Page
                show-sizer
                show-elevator
                :total="clientShop.total"
                :current="clientShop.search.page"
                :page-size-opts="[10, 20, 30, 40]"
                @on-change="changePage"
                @on-page-size-change="changePageSize"
              >
              </Page>
            </div>
          </div>
        </Col>
      </Row>

    </Card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      clientInfo: {
        id: '',
        info: {
          merchant_name: '',
          merchant_type: '',
          salesman_name: '',
          contact_name: '',
          contact_phone: '',
          created_by: '',
          created_at: ''
        }
      },
      clientShop: {
        loading: false,
        search: {
          contractor_id: '',
          page: 1,
          perPage: 10,
          status: 'shopAddress',
          name: '',
          address: ''
        },
        columns: [
          { title: '序号', type: 'index', align: 'center', width: 80, },
          { title: '门店名称', key: 'name', align: 'center' },
          { title: '门店地址', key: 'address', align: 'center' },
        ],
        list: [],
        total: 0,
      },
    }
  },
  created () {
    this.init();
  },
  methods: {
    init() {
      this.getBasicInfo()
    },
    // 获取基本信息
    getBasicInfo() {
      // 获取商家id
			this.clientInfo.id = this.$route.query.id;
      this.$api.basicInfo(this.clientInfo.id)
        .then(res => {
          if(res.code === 0) {
            this.clientInfo.info = res.data;
            this.clientShop.search.contractor_id = res.data.contractor_id
            this.changeInp();
          }
        })
        .catch(err => {
          this.$Message.error(res.message);
        })
    },
    // 重置列表
    changeInp() {
      this.clientShop.search.page = 1;
      this.clientShop.search.perPage = 10;
      this.getList();
    },
    // 获取门店列表
    getList() {
      this.clientShop.loading = true;
      let params = this.clientShop.search;
      for(let i in params) {
        if(!!params[i] === false) {
          delete params[i];
        }
      }
      this.$api.getContractoreTable(params)
        .then(res => {
          this.clientShop.list = res.items;
          this.clientShop.total = res._meta.totalCount;
          this.clientShop.loading = false;
        })
        .catch(err => {
          this.clientShop.list = [];
          this.clientShop.loading = false;
        })
    },
    // 切换分页
    changePage(e) {
      this.clientShop.search.page = e;
      this.getList();
    },
    // 切换条数
    changePageSize(e) {
      this.clientShop.search.perPage = e;
      this.getList();
    },
  }
}
</script>

<style lang="less" scoped>
  .client-mian {
    .inp-max-width {
      width: 488px;
    }
  }

  .client-info {
    margin-top: 1rem;

    /deep/ .ivu-form-item-label {
      font-size: 14px;
    }
  }

  .shop-info {
    margin-top: 1rem;

    .client-info {
      position: relative;

      button {
        position: absolute;
        right: 0;
      }
    }
  }
</style>