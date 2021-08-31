<template>
  <div>
    <Card>
      <Row slot="title">
        <Col :sm="24" @keydown.native.enter.prevent="getList('search')">
          <Form ref="search" :model="search" class="search">
            <FormItem>
              <Input v-model="search.created_by" placeholder="新建人" clearable/>
            </FormItem>
            <FormItem><Input v-model="search.name" placeholder="活动名称" clearable/></FormItem>
            <FormItem style="float:right">
              <Button type="primary" icon="search" @click="getList('search')" style="padding: 4px 15px">查询</Button>
            </FormItem>
          </Form>
        </Col>
        <Col :sm="24">
          <router-link to="/products/active-list-add">
            <Button type="primary">新增活动</Button>
          </router-link>
          <Button type="primary" @click="display">显示隐藏</Button>
        </Col>
      </Row>
      <Row class="margin-top-10" style="clear: both;">
        <Table :columns="columns" :data="data" border highlight-row :loading="loading" @on-selection-change="checkTable"
               size="small">
          <!-- 操作 -->
          <template slot-scope="{ row }" slot="action">
            <Tooltip placement="top" content="编辑" transfer>
              <Button type="primary" size="small" @click="handleEdit(row.id)">
                <Icon type="md-create"/>
              </Button>
            </Tooltip>
            <Poptip confirm title="您确认删除这条内容吗？" @on-ok="handleDelete(row.id)" transfer>
              <Button size="small">
                <Icon type="md-trash"/>
              </Button>
            </Poptip>
          </template>
        </Table>
        <div style="margin: 10px;overflow: hidden">
          <div class="pages-L">共 {{pageProps.totalCount}} 条</div>
          <div style="float: right;">
            <Page size="small"
                  :total="pageProps.totalCount"
                  :current="pageProps.currentPage"
                  show-sizer show-elevator
                  @on-change="changePage"
                  @on-page-size-change="changePageSize"></Page>
          </div>
        </div>
      </Row>
    </Card>
  </div>
</template>
<script>
  import {SERVER_BASE_URL} from '~/api/config';

  export default {
    name: 'category',
    data() {
      return {
        loadingVisible: false,
        baseUrl: `${SERVER_BASE_URL}/`,
        search: {},
        ownershipList: [],
        checkList: [],
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {type: 'index', title: '序号', width: 65, align: 'center'},
          {key: 'name', title: '活动名称', minWidth: 100, sortable: true, align: 'center'},
          {
            key: 'name', title: '活动封面', minWidth: 110, sortable: true, align: 'center',
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    let id = params.row.id
                    this.$api.merchantActivityListPreview({id: id})
                      .then(res => {
                        window.open(this.baseUrl + res.data.url)
                      })
                  }
                }
              }, '查看');
            }
          },
          {key: 'sort_priority', title: '排序', minWidth: 100, sortable: true, align: 'center'},
          {key: 'status', title: '是否显示', minWidth: 100, sortable: true, align: 'center'},
          {key: 'link', title: '活动链接', width: 150, align: 'center', align: 'center'},
          {key: 'describe', title: '活动描述', width: 150, align: 'center', align: 'center'},
          {key: 'created_by', title: '创建人', width: 150, align: 'center', align: 'center'},
          {key: 'created_at', title: '创建日期', width: 150, align: 'center', align: 'center'},
          {key: 'action', title: '操作', width: 150, align: 'center', slot: 'action'}
        ],
        data: [],
        loading: true,
        // 列表分页属性
        pageProps: {
          page: 1,
          perPage: 10,
          currentPage: 1,
          totalCount: 0
        }
      };
    },
    methods: {
      init() {
        this.pageProps.page = 1;
        this.pageProps.perPage = 10;
        this.getList();
        // 加载所有权
        this.$api.getOwnership().then(res => {
          this.ownershipList = res;
        });
      },
      // 搜索  重置  获取列表
      getList(data) {
        this.loading = true;
        let params = this.search;
        params.page = this.pageProps.page;
        params.perPage = this.pageProps.perPage;
        if (!params.created_by) {
          params.created_by = ''
        }
        if (!params.name) {
          params.name = ''
        }
        this.$api.merchantActivityListLndex(params)
          .then(res => {
            this.loading = false;
            if (res.items) {
              this.data = res.items;
              this.pageProps = res._meta;
            }
          });
      },
      closeModal(e) {
        this[e].modal = false;
      },
      // 操作栏的编辑
      handleEdit(id) {
        this.$router.push({
          path: '/products/active-list-add',
          query: {id: id}
        });
      },

      // 删除
      handleDelete(id) {
        this.$api.merchantActivityListDel(id)
          .then(res => {
            this.getList()
          })
      },

      //显示隐藏
      display() {
        if (this.checkList.length == 0) {
          this.$Message.warning('请选择')
        } else {
          // 请求数据
          this.checkList.forEach(element => {
            if (element.status == '隐藏') {
              let params = [];
              this.checkList.forEach(value => {
                params.push(value.id)
              })
              this.$api.merchantActivityListShow({idArr: params})
                .then(res => {
                  this.$Message.success(res.message)
                  this.getList()
                })
            } else if (element.status == '显示') {
              let params = [];
              this.checkList.forEach(value => {
                params.push(value.id)
              })
              this.$api.merchantActivityListNotShow({idArr: params})
                .then(res => {
                  this.$Message.success(res.message)
                  this.getList();
                })
            }
          });
        }
      },

      //获取当行数据
      checkTable(currentRow) {
        this.checkList = currentRow;
      },
      changePage(e) {
        this.pageProps.page = e;
        this.getList();
      },
      changePageSize(e) {
        this.pageProps.perPage = e;
        this.getList();
      }
    },
    activated() {
      this.init();
    },
    watch: {
      // $route (newVal) {
      //     this.getList('search');
      // }
    }
  };
</script>

<style lang="less">
  .ivu-input::-webkit-input-placeholder, .ivu-select-single .ivu-select-selection .ivu-select-placeholder {
    color: rgb(130, 130, 130);
  }

  .ivu-input, .ivu-select-selection {
    border: 1px solid rgb(184, 184, 184);
    color: #000;
  }
</style>

