<template>
  <div>
    <Card>
      <Row slot="title">
        <Col :sm="24" @keydown.native.enter.prevent="getList('search')">
          <Form ref="search" :model="search" class="search">
            <FormItem>
              <Select v-model="search.ownership" clearable placeholder="所有权" @on-change="getList('search')">
                <Option v-for="item in ownershipList" :value="item.ownership" :key="item.ownership"
                        :label="item.label"></Option>
              </Select>
            </FormItem>
            <FormItem>
              <Input v-model="search.category" placeholder="类目" clearable/>
            </FormItem>
            <FormItem><Input v-model="search.item_no" placeholder="货号" clearable/>
            </FormItem>
            <FormItem><Input v-model="search.name" placeholder="产品名称" clearable/>
            </FormItem>
            <FormItem><Input v-model="search.barcode" placeholder="条码" clearable/>
            </FormItem>
            <FormItem>
              <Button type="primary" icon="ios-search" @click="getList('search')" style="padding: 4px 15px">查询</Button>
            </FormItem>
            <FormItem>
              <Button type="primary" icon="md-repeat" @click="getList(false)" style="padding: 4px 15px">重置</Button>
            </FormItem>
          </Form>
        </Col>
        <Col :sm="24">
          <router-link to="/products/product-edit">
            <Button type="primary">新增商品</Button>
          </router-link>
          <Button type="primary" @click="displayHiding">显示/隐藏</Button>
          <Button type="primary" @click="NormalShortage">缺货/正常</Button>
          <Button type="primary" @click="importModel = true">导入商品</Button>
          <Button type="primary" @click="productDownload">
            导出商品
          </Button>
          <Progress v-show="isShowProgress" :percent="percentProgress"></Progress>
        </Col>
      </Row>
      <Row class="margin-top-10" style="clear: both;">
        <Table :columns="columns" :data="data" border highlight-row :loading="loading" @on-select="checkTable"
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
            <Page size="small" :total="pageProps.totalCount" :current="pageProps.currentPage" show-sizer show-elevator
                  @on-change="changePage" @on-page-size-change="changePageSize"></Page>
          </div>
        </div>
      </Row>
    </Card>
    <Modal title="商品详情" v-model="productDetails.modal" width="900" :footer-hide="true">
      <div class="rel" style="padding:20px;">
        <!-- 商品详情 start -->
        <div class="ivu-table-wrapper" style="margin-bottom: 160px;">
          <div class="ivu-table ivu-table-small ivu-table-border">
            <div class="ivu-table-body">
              <table cellspacing="0" cellpadding="0" border="0" width="100%">
                <tbody class="ivu-table-tbody">
                <tr class="ivu-table-row">
                  <td class="head-bg">
                    <div class="ivu-table-cell">创建人</div>
                  </td>
                  <td colspan="3">
                    <div class="ivu-table-cell"><span>{{ productDetails.data.created_by }}</span></div>
                  </td>
                  <td class="head-bg">
                    <div class="ivu-table-cell">创建时间</div>
                  </td>
                  <td colspan="3">
                    <div class="ivu-table-cell"><span v-text="productDetails.data.created_at"></span></div>
                  </td>
                </tr>
                <tr class="ivu-table-row">
                  <td class="head-bg">
                    <div class="ivu-table-cell">产品名称</div>
                  </td>
                  <td colspan="3">
                    <div class="ivu-table-cell"><span>{{ productDetails.data.name }}</span></div>
                  </td>
                  <td class="head-bg">
                    <div class="ivu-table-cell">类目</div>
                  </td>
                  <td colspan="3">
                    <div class="ivu-table-cell"><span v-text="productDetails.data.category"></span></div>
                  </td>
                </tr>
                <tr class="ivu-table-row">
                  <td class="head-bg">
                    <div class="ivu-table-cell">货号</div>
                  </td>
                  <td colspan="3">
                    <div class="ivu-table-cell"><span>{{ productDetails.data.item_no }}</span></div>
                  </td>
                  <td class="head-bg">
                    <div class="ivu-table-cell">规格</div>
                  </td>
                  <td colspan="3">
                    <div class="ivu-table-cell"><span v-text="productDetails.data.standard"></span></div>
                  </td>
                </tr>
                <tr class="ivu-table-row">
                  <td class="head-bg">
                    <div class="ivu-table-cell">单位</div>
                  </td>
                  <td colspan="3">
                    <div class="ivu-table-cell"><span>{{ productDetails.data.unit }}</span></div>
                  </td>
                  <td class="head-bg">
                    <div class="ivu-table-cell">零售价</div>
                  </td>
                  <td colspan="3">
                    <div class="ivu-table-cell"><span v-text="productDetails.data.price"></span></div>
                  </td>
                </tr>
                <tr class="ivu-table-row">
                  <td class="head-bg">
                    <div class="ivu-table-cell">条码</div>
                  </td>
                  <td colspan="3">
                    <div class="ivu-table-cell"><span>{{ productDetails.data.barcode }}</span></div>
                  </td>
                  <td class="head-bg">
                    <div class="ivu-table-cell">箱规</div>
                  </td>
                  <td colspan="3">
                    <div class="ivu-table-cell"><span v-text="productDetails.data.box_standard"></span></div>
                  </td>
                </tr>
                <tr class="ivu-table-row">
                  <td class="head-bg">
                    <div class="ivu-table-cell">备注</div>
                  </td>
                  <td colspan="7">
                    <div class="ivu-table-cell"><span>{{ productDetails.data.remark }}</span></div>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <Spin v-show="productDetails.loading" :fix="true" size="large"></Spin>
      </div>
      <div slot="footer"></div>
    </Modal>

    <!-- 导入数据 start  -->
    <Modal
    v-model="importModel"
    title="导入商品"
    width="800"
    >
      <Upload
      name="UploadForm[excel]"
      :action="fileUploadURL"
      :format="['xlsx']"
      :headers="fileUploadHeaders"
      :show-upload-list="false"
      :on-success="handleUploadSuccess"
      :on-error="handleUploadError"
      style="display: inline-block">
        <p style="padding-left:255px">
          <Button type="primary">选择导入的文件</Button>
        </p>
      </Upload>
      <p slot="header" style="text-align:left">
        导入商品档案
      </p>
      <p slot="header" style="color:#f60;padding-right: 37px;text-align:right">
        <a href="javascript:void(0);" @click="downloadImport()">下载导入模版.xls</a>
      </p>
    </Modal>
    <!-- 导入数据 end  -->
  </div>
</template>

<script>
  import Cookies from 'js-cookie'
  import {SERVER_BASE_URL} from '~/api/config';
  import log from '../my-components/log.vue';

  export default {
    name: 'product',
    components: {
      log
    },
    data() {
      return {
        baseUrl: `${SERVER_BASE_URL}/`,
        fileUploadURL: `${SERVER_BASE_URL}/v1/product/product-import`,
        fileUploadHeaders: {
          Authorization: Cookies.get('authorization')
        },
        fileDefaultList: [],
        importModel: false,
        logData: { // 日志
          data: [],
          loading: false
        },
        logPage: { // 日志分页属性
          page: 1,
          perPage: 10,
          currentPage: 1,
          totalCount: 0
        },
        logTabs: 'details',
        // detailId: '', // 详情弹窗id
        loadingVisible: false,
        search: {},
        ownershipList: [],
        upLoadModal: false,
        checkList: [],
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            key: 'name',
            title: '产品名称',
            minWidth: 200,
            sortable: true,
            align: 'center',
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    let id = params.row.id
                    this.$router.push({
                      path: '/products/commodity-details-exhibition',
                      query: {id: id}
                    })
                  }
                }
              }, params.row.name);
            }
          },
          {key: 'item_no', title: '货号', minWidth: 120, sortable: true, align: 'center'},
          {key: 'category', title: '所属类目', minWidth: 180, sortable: true, align: 'center'},
          {
            key: 'category',
            title: '产品图片',
            minWidth: 180,
            sortable: true,
            align: 'center',
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    let id = params.row.id
                    this.$api.productPreview({id: id})
                      .then(res => {
                        window.open(this.baseUrl + res.data.url)
                      })
                  }
                }
              }, '查看');
            }
          },
          {key: 'shortage_status', title: '缺货设置', minWidth: 180, sortable: true, align: 'center'},
          {key: 'show_status', title: '是否显示 ', minWidth: 180, sortable: true, align: 'center'},
          {key: 'standard', title: '规格', minWidth: 120, sortable: true, align: 'center'},
          {key: 'unit', title: '单位', minWidth: 100, sortable: true, align: 'center'},
          {key: 'price', title: '零售价', minWidth: 100, sortable: true, align: 'center'},
          {key: 'supply_price', title: '供货价', minWidth: 100, sortable: true, align: 'center'},
          {key: 'cost_price', title: '成本价', minWidth: 100, sortable: true, align: 'center'},
          {key: 'shelf_life', title: '保质期', minWidth: 100, sortable: true, align: 'center'},
          {key: 'barcode', title: '条码', minWidth: 120, sortable: true, align: 'center'},
          {key: 'box_standard', title: '箱规', minWidth: 100, sortable: true, align: 'center'},
          {key: 'describe', title: '商品描述', minWidth: 200, sortable: true, align: 'center'},
          {key: 'property', title: '商品属性', minWidth: 100, sortable: true, align: 'center'},
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
        },
        percentProgress: 0,
        isShowProgress: false,
        productDetails: {
          modal: false,
          data: [],
          loading: true,
          showAuditDetail: false
        },
        modalType: ''
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
        if (data) {
          params = this.search;
        } else {
          params = this.search = {};
        }
        params.perPage = this.pageProps.perPage;
        params.page = this.pageProps.page;
        params.product_type = '1';
        this.$api.productManagementList(params)
          .then(res => {
            this.loading = false;
            if (res.items) {
              this.data = res.items;
              this.pageProps = res._meta;
            }
          });
      },

      // 商品详情
      viewDetails(id) {
        this.productDetails.loading = true;
        this.productDetails.modal = true;
        this.$api.productManagementDetails(id)
          .then(res => {
            this.productDetails.loading = false;
            if (res.code == 0) {
              this.productDetails.data = res.data;
            } else {
              this.$Message.error(res.message);
            }
          });
      },
      closeModal(e) {
        this[e].modal = false;
      },
      // 日志
      getLog() {
        this.logData.loading = true;
        let params = {
          module: 'product',
          page: this.logPage.page,
          perPage: this.logPage.perPage,
          id: this.detailId
        };
        this.$api.getLog(params)
          .then(res => {
            this.logData.loading = false;
            this.logData.data = res.items;
            this.logPage.totalCount = res._meta.totalCount;
          });
      },
      // 日志---页码
      changeLogPage(e) {
        this.logPage.page = e;
        this.getLog();
      },
      // 日志---每页条数
      changeLogPageSize(e) {
        this.logPage.perPage = e;
        this.getLog();
      },

      // 操作栏的编辑
      handleEdit(id) {
        this.$router.push({
          path: '/products/product-edit',
          query: {id: id}
        });
      },

      // 操作栏的删除
      handleDelete(id) {
        this.$api.productManagementDelete(id)
          .then(res => {
            if (res.code == 0) {
              this.$Message.success(res.message);
              this.getList();
            } else {
              if (res.data.length > 0) {
                for (let i in res.data) {
                  this.$Message.warning(res.data[i]);
                }
              } else {
                this.$Message.warning(res.message);
              }
            }
          });
      },

      checkTable(currentRow) {
        this.checkList = currentRow;
      },
      //下载导入模版
      downloadImport() {
        this.$api.productTemplate()
          .then(res => {
            if (res.code == 0) {
              window.location.href = res.data;
            }
          });

      },
      // 上传成功
      handleUploadSuccess(res) {
        if (res.code == 0) {
          this.$Message.success(res.message);
          this.getList();
        } else {
          this.$Message.error(res.message);
          return false;
        }
      },
      // 上传失败
      handleUploadError() {
        this.$Message.error('上传失败');
        return false;
      },
      // 模板上传成功的进度条
      importProgress(event, file) {
        if (!event) return;
        this.isShowProgress = true;
        // 延迟一下，接收有bug
        setTimeout(() => {
          if (file.status === 'fail') {
            this.$Notice.error({
              title: '文件异常!'
            });
          }
        }, 1000);
        if (file.percentage === 100) {
          this.isShowProgress = false;
        }
        this.percentProgress = event.percent;
      },

      // 上传的文件格式
      fileFormatError(file) {
        this.$Notice.error({
          title: '文件格式错误',
          desc: JSON.stringify(file)
        });
      },
      // 文件上传限制
      fileMaxSize(file) {
        this.$Notice.warning({
          title: '超出文件大小限制',
          desc: '文件 ' + file.name + ' 太大，不能超过 50M。'
        });
      },

      //导出商品
      productDownload() {
        this.$api.productManagementDownload()
          .then(res => {
            window.location.href = res.data
          })
      },
      changePage(e) {
        this.pageProps.page = e;
        this.getList('search');
      },
      changePageSize(e) {
        this.pageProps.perPage = e;
        this.getList('search');
      },
      formatDate(time) {
        return this.$format(time, 'yyyy-MM-dd hh:mm');
      },
      formatDays(time) {
        return this.$format(time, 'yyyy-MM-dd');
      },
      formatStatus(status) {
        for (let i in this.listStatus) {
          if (status == this.listStatus[i].key) {
            return this.listStatus[i].value;
          }
        }
      },
      // 规格转化
      formatSpecifications(weight, unit) {
        return weight + unit;
      },

      //显示隐藏
      displayHiding() {
        if (this.checkList.length == 0) {
          this.$Message.warning('请选择')
        } else {
          // 请求数据
          this.checkList.forEach(element => {
            if (element.show_status == '隐藏') {
              let params = [];
              this.checkList.forEach(value => {
                params.push(value.id)
              })
              this.$api.productShow({idArr: params})
                .then(res => {
                  this.$Message.success(res.message)
                  this.getList()
                })
            } else if (element.show_status == '显示') {
              let params = [];
              this.checkList.forEach(value => {
                params.push(value.id)
              })
              this.$api.productNotShow({idArr: params})
                .then(res => {
                  this.$Message.success(res.message)
                  this.getList();
                })
            }
          });
        }
      },

      //缺货正常
      NormalShortage() {
        if (this.checkList.length == 0) {
          this.$Message.warning('请选择')
        } else {
          // 请求数据
          this.checkList.forEach(element => {
            if (element.shortage_status == '否') {
              let params = [];
              this.checkList.forEach(value => {
                params.push(value.id)
              })
              this.$api.productShortage({idArr: params})
                .then(res => {
                  this.$Message.success(res.message)
                  this.getList()
                })
            } else if (element.shortage_status == '是') {
              let params = [];
              this.checkList.forEach(value => {
                params.push(value.id)
              })
              this.$api.productNotShortage({idArr: params})
                .then(res => {
                  this.$Message.success(res.message)
                  this.getList();
                })
            }
          });
        }
      }
    },
    activated() {
      this.init('activated');
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

