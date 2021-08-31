<template>
  <div>
    <Card>
      <div slot="title">
        <Row  @keydown.native.enter.prevent="getList('search')">
          <Col :md="21">
            <Input v-model="searchData.merchant_name" placeholder="商家" clearable/>
            <Input v-model="searchData.created_by" placeholder="创建人" clearable/>
            <Select v-model="searchData.audit_status" @on-change="getList('search')" placeholder="审核状态" clearable>
              <Option v-for="(item, index) in statusList" :key="index" :value="item.value" :label="item.label"></Option>
            </Select>
          </Col>
          <Col :md="3" style="text-align: right">
            <Button icon="md-search" type="primary" @click="getList('search')">查找</Button>
          </Col>
        </Row>
        <Row style="padding: 10px 0">
          <Col>
            <Button type="primary" @click="goEdit">添加</Button>
            <Button type="primary" @click="openModal('review')">审核</Button>
            <Button type="primary" disabled>作废</Button>
          </Col>
        </Row>
      </div>
      <div>
        <Table border ref="selection" :columns="listData.columns" :data="listData.data" :loading="loadingTable"
               @on-selection-change="select">
          <!-- 操作 -->
          <template slot-scope="{ row }" slot="action">
            <Tooltip placement="top" content="编辑" transfer>
              <Button type="primary" size="small" @click="handleEdit(row)" :disabled="row.audit_status == '审核通过'">
                <Icon type="md-create"/>
              </Button>
            </Tooltip>
            <Poptip confirm title="您确认删除这条内容吗？" @on-ok="handleDelete(row)" transfer>
              <Button size="small" :disabled="row.audit_status == '审核通过'">
                <Icon type="md-trash"/>
              </Button>
            </Poptip>
          </template>
        </Table>
      </div>
      <div style="padding:30px 0">
        <div style="float: left;">共 {{pageProps.totalCount}} 条</div>
        <div style="float: right;">
          <Page size="small" :total="pageProps.totalCount" :current="pageProps.page" show-sizer show-elevator
                @on-change="changePage" @on-page-size-change="changePageSize"></Page>
        </div>
      </div>
    </Card>
    <!-- 审核弹窗 -->
    <Modal v-model="modalAudit" width="970px" @on-cancel="colseModal()">
      <div slot="header">
        <p>销售清单</p>
      </div>
      <div style="height:350px;overflow-y: scroll">
        <table class="review-table">
          <tbody>
          <tr class="table-title">
            <td>产品名称</td>
            <td>规格</td>
            <td>单位</td>
            <td>零售价</td>
            <td>折扣</td>
            <td>订货数量</td>
            <td>返点货值</td>
            <td>条码</td>
            <td>箱规</td>
          </tr>
          <tr v-for="(item, index) in detailData.items" :key="index">
            <td>{{ item.product_name }}</td>
            <td>{{ item.product_standard }}</td>
            <td>{{ item.product_unit }}</td>
            <td>{{ item.retail_price }}</td>
            <td>{{ '-' }}</td>
            <td>{{ item.number }}</td>
            <td>{{ item.value }}</td>
            <td>{{ item.product_barcode }}</td>
            <td>{{ item.product_box_standard }}</td>
          </tr>
          <tr>
            <td colspan="9">订单总货值：{{ detailData.total_val }}</td>
          </tr>
          <tr>
            <td colspan="9" style="text-align:left">
                                <span>
                                    销售凭证: 
                                </span>
              <div class="img-style">
                <a v-for="(item, index) in detailData.fileItems" :key="'file' + index" :href="item.url" target="_blank">{{
                  item.title + '.' + item.extension }}</a>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="2">审核意见</td>
            <td colspan="3">
              <RadioGroup v-model="auditData.is_pass">
                <Radio label="1">
                  <span>通过</span>
                </Radio>
                <Radio label="0">
                  <span>不通过</span>
                </Radio>
              </RadioGroup>
            </td>
            <td colspan="1">意见</td>
            <td colspan="3">
              <Input v-model="auditData.audit_remark"/>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div slot="footer">
        <Button type="primary" :loading="loadingAudit" @click="submitAudit">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  export default {
    name: 'sale-review',
    data() {
      return {
        loadingTable: false,
        loadingAudit: false,
        statusList: [
          {value: 'auditPending', label: '待审核'},
          {value: 'auditPass', label: '审核通过'},
          {value: 'auditFail', label: '审核失败'}
        ],
        listData: {
          columns: [
            {type: 'selection', width: 60, align: 'center'},
            {type: 'index', title: '序号', width: 70, align: 'center'},
            {title: '商家名称', key: 'merchant_name', width: 135, align: 'center', tooltip: true},
            {title: '门店名称', key: 'facade_name', width: 100, align: 'center'},
            {title: '门店地址', key: 'facade_address', width: 180, align: 'center', tooltip: true},
            {title: '销售单号', key: 'version', width: 180, align: 'center'},
            {title: '创建人', key: 'created_by', width: 100, align: 'center'},
            {
              title: '货号',
              minWidth: 230,
              align: 'center',
              render: (h, params) => {
                let productName = params.row.product_name.split(',')
                return h('div', {
                  attrs: {
                    class: 'list-item'
                  }
                }, [
                  h('ul', productName.map((item) => {
                    return h('li', item)
                  }))
                ])
              }
            },
            {
              title: '销售数量',
              width: 100,
              align: 'center',
              render: (h, params) => {
                let productNumber = params.row.product_num.split(',')
                return h('div', {
                  attrs: {
                    class: 'list-item'
                  }
                }, [
                  h('ul', productNumber.map((item) => {
                    return h('li', item)
                  }))
                ])
              }
            },
            {title: '订单总货值', key: 'total_value', width: 130, align: 'center'},
            {title: '备注', key: 'remark', width: 150, align: 'center', tooltip: true},
            {title: '状态', key: 'audit_status', width: 100, align: 'center'},
            {title: '销售时间', key: 'created_at', width: 150, align: 'center'},
            {title: '操作', width: 110, align: 'center', slot: 'action'},
          ],
          data: []
        },
        pageProps: {
          page: 1,
          perPage: 10,
          totalCount: 0
        },
        searchData: {
          audit_status: '',
          created_by: '',
          merchant_name: ''
        },
        detailData: {},
        auditData: {
          audit_remark: '',
          is_pass: ''
        },
        checkList: [],
        modalAudit: false
      }
    },
    methods: {
      // 切换页码
      changePage(e) {
        this.pageProps.page = e;
        this.getList();
      },
      // 设置每页显示的条数
      changePageSize(e) {
        this.pageProps.perPage = e;
        this.getList();
      },
      goEdit() {
        this.$router.push({path: '/sale-order-management/sale-order-review/order-edit'})
      },
      select(selection) {
        if (selection.length === 1) {
          this.checkList = selection
        } else {
          this.checkList.length = 0
        }
      },
      openModal(type) {
        if (this.checkList.length == 0) {
          this.$Message.error("请选择")
        } else {
          if (type == 'review') {
            if (this.checkList[0].audit_status != '待审核') {
              this.$Message.warning('已审核')
            } else {
              this.modalAudit = true
              this.getDetail()
            }
          }
        }
      },
      colseModal() {
        this.modalAudit = false
        this.auditData = {
          audit_remark: '',
          is_pass: ''
        }
      },
      getList(type) {
        if (type == 'search') {
          this.pageProps.page = 1
        }
        let params = JSON.parse(JSON.stringify(this.searchData))
        params.page = this.pageProps.page
        params.perPage = this.pageProps.perPage
        params.audit_status = params.audit_status || ''
        this.loadingTable = true
        this.$api.salesReviewList(params).then((res) => {
          this.listData.data = res.items
          this.pageProps.totalCount = res._meta.totalCount
        }).finally(() => {
          this.loadingTable = false
        })
      },
      getDetail() {
        this.$api.salesReviewDetail({id: this.checkList[0].id}).then((res) => {
          if (res.code === 0) {
            this.detailData = res.data
          }
        })
      },
      submitAudit() {
        if (this.auditData.is_pass == '') {
          this.$Message.error('请填写审核意见')
        } else {
          let params = this.auditData
          params.id = this.checkList[0].id
          params.audit_pass = this.auditData.is_pass
          this.loadingAudit = true
          this.$api.salesReviewAudit(params).then((res) => {
            if (res.code === 0) {
              this.$Message.success('审核成功')
              this.getList()
              this.colseModal()
            }
          }).catch((err) => {
            this.$Message.info(err.Message)
          })
          .finally(() => {
            this.loadingAudit = false
          })
        }
      },
      handleDelete(row) {
        if (row.audit_status == '审核通过') {
          this.$Message.error('审核已通过，不可删除')
        } else {
          this.$api.salesReviewDelete({id: row.id}).then((res) => {
            if (res.code === 0) {
              this.$Message.success('删除成功')
              this.getList()
            }
          })
        }
      },
      handleEdit(row) {
        if (row.audit_status == '审核通过') {
          this.$Message.error('审核已通过，不可编辑')
        } else {
          this.$router.push({
            path: '/sale-order-management/sale-order-review/order-edit',
            query: {
              id: row.id
            }
          })
        }
      }
    },
    activated() {
      this.getList()
    }
  }
</script>
<style lang="less">
  .list-item {
    ul {
      list-style: none;

      li {
        line-height: 40px;
        border-bottom: 1px #dcdee2 solid;
        margin: 0 -18px;
      }

      li:last-child {
        border-bottom: none;
      }
    }
  }

  .review-table {
    text-align: center;
    border-collapse: collapse;

    tr {
      td {
        border: 1px #dcdee2 solid;
        height: 45px;
        width: 100px;
        padding: 0 10px;
      }
    }
  }

  .table-title {
    background: #f8f8f9;
  }

  .img-style {
    display: inline-flex;
    flex-direction: column;
    margin: 10px 0 10px 5px;

    a {
      line-height: 30px;
    }
  }
</style>