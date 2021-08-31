<template>
  <div>
    <Card>
      <Row slot="title">
        <Col :sm="24">
          <Form ref="search" :model="search" class="search">
            <FormItem>
              <Select v-model="search.img_type" clearable placeholder="类型" @on-change="getList('search')">
                <Option v-for="item in pictureList" :value="item.value" :key="item.value" :label="item.label"></Option>
              </Select>
            </FormItem>
            <FormItem>
              <Input v-model="search.created_by" placeholder="创建人" @keydown.native.enter.prevent="getList('search')" clearable/>
            </FormItem>
            <FormItem>
              <Button type="primary" icon="ios-search" @click="getList" style="padding: 4px 15px">查询</Button>
            </FormItem>
          </Form>
        </Col>
        <Col :sm="24">
          <Form ref="search" :model="search" class="search">
            <FormItem>
              <router-link to="/products/home-set-add">
                <Button type="primary">新增海报</Button>
              </router-link>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="preview">预览</Button>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="ButtonStop">停用</Button>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="ButtonEnable">启用</Button>
            </FormItem>
          </Form>
        </Col>
      </Row>
      <Row class="margin-top-10" style="clear: both;">
        <Table :columns="columns" :data="formData" border highlight-row :loading="loading"
               @on-current-change="checkTable" @on-selection-change="checkTable" size="small">
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
    name: 'home-set',
    data() {
      return {
        baseUrl: `${SERVER_BASE_URL}/`,
        loadingVisible: false,
        search: {
          img_type: '',
          created_by: ''
        },
        pictureList: [
          {value: '轮播图', label: '轮播图'},
          {value: '弹窗', label: '弹窗'},
        ],//图片类型
        checkList: [],
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {key: 'img_type', title: '图片类型', minWidth: 100, sortable: true, align: 'center'},
          {key: 'sort_priority', title: '排序', minWidth: 110, sortable: true, align: 'center'},
          {key: 'status', title: '启用状态', minWidth: 100, sortable: true, align: 'center'},
          {
            key: 'img',
            title: '图片',
            minWidth: 100,
            sortable: true,
            align: 'center',
            render: (h, params) => {
              return h('a', {
                props: {
                  target: "_blank"
                },
                on: {
                  click: () => {
                    this.$api.appletHomeSettingPreview({id: params.row.id})
                      .then(res => {
                        if (res.data.url != '') {
                          window.open(this.baseUrl + res.data.url)
                        }
                      })
                  }
                }
              }, '查看');
            }
          },
          {
            key: 'link', title: '连接地址', width: 150, align: 'center',
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    window.open('https:/' + params.row.link)
                  }
                }
              }, params.row.link);
            }
          },
          {key: 'created_by', title: '创建人', width: 150, align: 'center'},
          {key: 'created_at', title: '创建时间', width: 150, align: 'center'},
          {key: 'action', title: '操作', width: 150, align: 'center', slot: 'action'}
        ],
        formData: [],
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
      init(name) {
        this.pageProps.page = 1;
        this.pageProps.perPage = 10;
        this.getList(name);
        // 加载所有权
        this.$api.getOwnership().then(res => {
          this.ownershipList = res;
        });
      },
      // 搜索  重置  获取列表
      getList(data) {
        this.loading = true;
        let params = {};
        params = this.search;
        if (data) {
          params.img_type = this.search.img_type || '';
          params.created_by = this.search.created_by || '';
        } else {
          params.img_type = '';
          params.created_by = '';
        }
        params.page = this.pageProps.page;
        params.perPage = this.pageProps.perPage;
        this.$api.appletHomeSettingIndex(params)
          .then(res => {
            this.loading = false;
            if (res.items) {
              this.formData = res.items;
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
          path: '/products/home-set-add',
          query: {id: id}
        });
      },
      preview() {

        if (this.checkList.length == 0) {
          this.$Message.success('请选择！！！')
          return
        } else {
          let id = this.checkList[0].id
          this.$router.push({
            path: '/products/home-set-add',
            query: {id: id, preview: 'preview'},
          });
        }
      },

      //删除
      handleDelete(id) {
        this.$api.appletHomeSettingSetting(id)
          .then(res => {
            this.$Message.success(res.message);
            this.getList();
          })
      },

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
      },

      //启用
      ButtonEnable() {
        let params = [];
        if (this.checkList.length == 0) {
          this.$Message.success('请选择！！！！')
          return
        }
        this.checkList.forEach(element => {
          params.push(element.id)
        });
        this.$api.appletHomeSettingUse({idArr: params})
          .then(res => {
            this.$Message.success('启用操作成功');
            this.checkList = []
            this.getList();
          })
      },

      // 停用
      ButtonStop() {
        let params = [];
        if (this.checkList.length == 0) {
          this.$Message.success('请选择！！！！')
          return
        }
        this.checkList.forEach(element => {
          params.push(element.id)
        });
        this.$api.appletHomeSettingNotUse({idArr: params})
          .then(res => {
            this.$Message.success('停用操作成功')
            this.getList();
            this.checkList = []
          })
      }
    },
    activated() {
      this.init('activated');
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

