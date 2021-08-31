<template>
  <div>
    <Card>
      <div slot="title" style="position: relative;">
        <Form inline>
          <Row @keydown.native.enter.prevent="getList('search')">
            <FormItem>
              <Select v-model="searchData.ownership" placeholder="数据权限范围" @on-change="getList('search')">
                <Option v-for="(item, index) in dataPermissionRange" :value="item.value" :label="item.label" :key="'dataPer' + index"></Option>
              </Select>
            </FormItem>
            <FormItem>
              <Input v-model="searchData.created_by" placeholder="创建人" clearable></Input>
            </FormItem>
            <FormItem>
              <Input v-model="searchData.delivery_object" clearable placeholder="发货对象"></Input>
            </FormItem>
            <FormItem>
              <Input v-model="searchData.contact_phone" clearable placeholder="联系方式"></Input>
            </FormItem>
            <FormItem>
              <!-- <Input v-model="searchData.channel" clearable placeholder="选择渠道"></Input> -->
             <Select class="width-200px" placeholder="选择渠道" v-model="searchData.channel_type" clearable>
               <Option v-for="item in channelList" :key="item.value" :value="item.value">{{ item.label }}</Option>
             </Select>
            </FormItem>
            <FormItem>
              <Input v-model="searchData.order_sn" clearable placeholder="样品订单编号"></Input>
            </FormItem>
            <FormItem>
              <Select v-model="searchData.status" clearable placeholder="审核状态" @on-change="getList('search')">
                <Option v-for="(item, index) in statusList" :key="'status'+index" :value="item.value"
                        :label="item.label"></Option>
              </Select>
            </FormItem>
            <FormItem>
              <Select v-model="searchData.reason" clearable placeholder="样品发货原因" @on-change="getList('search')">
                <Option v-for="(item, index) in reasonList" :key="'reason'+index" :value="item.value"
                        :label="item.value"></Option>
              </Select>
            </FormItem>
            <FormItem>
              <Button type="primary" icon="ios-search" @click="getList('search')">查 询</Button>
            </FormItem>
          </Row>
          <Row>
            <Col :sm='20'>
              <Button type="primary" @click="goEdit()" v-permission="'/v1/order-sample/create'">添 加</Button>
              <Button type="primary" @click="openModal('dept')" v-permission="'/v1/order/manager-audit'">初 审</Button>
              <Button type="primary" @click="openModal('manager')" v-permission="'/v1/order/director-audit'">复 审</Button>
              <Button type="primary" @click="openModal('invalid')" v-permission="'/v1/order/invalid'">作 废</Button>
              <Button type="primary" @click="exportData.modal = true" v-permission="'/v1/order-delivery/order-export'">导出数据</Button>
            </Col>
              <div style="color:red;position:  absolute;bottom:0;right:0;font-size: 0.875rem">网店管家每30分钟获取一次已处理订单</div>
           
          </Row>
        </Form>
      </div>
      <div>
        <div>
          <Table border max-height='640' ref="selection" :columns="listData.columns" :data="listData.data"
                highlight-row :loading="loadingTable" @on-selection-change="select" size="small">
            <!-- 操作 -->
            <template slot-scope="{ row }" slot="action">
              <Tooltip placement="top" content="编辑" transfer>
                <Button type="primary" icon="md-create" size="small"
                        :disabled="row.status === 'OrderWorkflow/auditRecheckPass'||row.status === 'OrderWorkflow/auditRecheckPending'" @click="handleEdit(row)"
                        v-permission="'/v1/order-sample/update'">
                </Button>
              </Tooltip>
              <Poptip confirm title="您确认删除这条内容吗？" @on-ok="handleDelete(row)" transfer>
                <Button size="small" icon="md-trash" :disabled="row.status === 'OrderWorkflow/auditRecheckPass'" v-permission="'/v1/order/delete'">
                </Button>
              </Poptip>
            </template>
          </Table>
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
    <!-- 审核 -->
    <Modal
    v-model="modalReview"
    title="样品订单审核"
    width="1200px"
    >
      <div class="modal-div">
        <Row>
          <table class="review-table">
            <tbody>
            <tr>
              <td class="td-style">创建人</td>
              <td class="td-style1">{{ detailData.created_by }}</td>
              <td class="td-style">创建时间</td>
              <td class="td-style1">{{ formatDate(detailData.created_at) }}</td>
              <td class="td-style">样品订单编号</td>
              <td class="td-style1">{{ detailData.order_sn }}</td>
            </tr>
            <tr>
              <td class="td-style">发货方式</td>
              <td class="td-style1">{{ detailData.delivery_mode == 'express' ? '快递' : '物流' }}</td>
              <td class="td-style">样品补发原因</td>
              <td class="td-style1">{{ detailData.reason }}</td>
              <td class="td-style">发货对象</td>
              <td class="td-style1">{{ detailData.delivery_object }}</td>
            </tr>
            <tr>
            </tr>
            <tr>
              <td class="td-style">样品发货凭证</td>
              <td  class="td-style1">
                <a style="display: block;margin: 5px 0;" v-for="(item, index) in detailData.files" :key="'file'+index" :href="`${SERVER_BASE_URL}/${item.url}` "
                   target="_blank">{{ item.title + '.' + item.extension }}</a>
              </td>
              <td class="td-style">发货地址</td>
              <td class="td-style1" style="width:370px" colspan="6">{{ detailData.province + detailData.city + detailData.county +
                detailData.receiving_address }}
              </td>
            </tr>
            <!-- <tr>
              <td class="td-style">联系方式</td>
              <td class="td-style1">{{ detailData.contact_phone }}</td>
            </tr> -->
            <tr>
              <td class="td-style">渠道</td>
              <td class="td-style1">{{ detailData.channel_type }}</td>
              <td class="td-style">备注</td>
              <td class="td-style1" colspan="13">{{ detailData.remark }}</td>
            </tr>
            </tbody>
          </table>
        </Row>
        <Row class="row-style">
          <h3>商品清单</h3>
        </Row>
        <Row>
          <Table border highlight-row ref="selection" :columns="orderData.columns" :data="orderData.data"
                 size="small"></Table>
        </Row>
        <Row class="row-style">
          <table class="review-table">
            <tbody>
            <tr>
              <td class="td-style">初审</td>
              <td style="text-align: left" class="td-style1">
                <span v-text="`${detailData.auditLogItems[0] ? detailData.auditLogItems[0].created_by : ''}`"  v-if="reviewType == 'manager' && detailData.auditLogItems"></span>
                <span v-else></span>
              </td>
              <td class="td-style">初审时间</td>
              <td style="text-align: left" class="td-style1">
                <span v-text="`${detailData.auditLogItems[0] ? formatDate(detailData.auditLogItems[0].created_at): ''}`" v-if="reviewType == 'manager' && detailData.auditLogItems"></span>
                <span v-else></span>
              </td>
              <td class="td-style">初审结果</td>
              <td class="td-style1" style="text-align: left">
                <span  v-if="reviewType == 'manager' && detailData.auditLogItems" v-text="`${detailData.auditLogItems[0] ? detailData.auditLogItems[0].audit_pass === '1' ? '通过' : '不通过': ''}`"></span>
                <RadioGroup v-else v-model="reviewData.is_pass">
                  <Radio label="1">通过</Radio>
                  <Radio label="0">不通过</Radio>
                </RadioGroup>
              </td>
            </tr>
            <tr>
              <td class="td-style">备注</td>
              <td colspan="24" class="td-style1">
                <span  v-if="reviewType == 'manager'">{{detailData.auditLogItems[0] ? detailData.auditLogItems[0].opinion : ''}}</span>
                <Input v-else type="textarea" :rows="2" v-model="reviewData.opinion"/>
              </td>
            </tr>
            </tbody>
          </table>
        </Row>
        <Row class="row-style" v-if="reviewType == 'manager'">
          <table class="review-table">
            <tbody>
            <tr>
              <td class="td-style">复审</td>
              <td class="td-style1" style="text-align: left">
                <span></span>
              </td>
              <td class="td-style">复审时间</td>
              <td class="td-style1" style="text-align: left">
                <span></span>
              </td>
              <td class="td-style">复审结果</td>
              <td class="td-style1" style="text-align: left">
                <RadioGroup v-model="reviewData.is_pass">
                  <Radio label="1">通过</Radio>
                  <Radio label="0">不通过</Radio>
                </RadioGroup>
              </td>
            </tr>
            <tr>
              <td class="td-style">备注</td>
              <td colspan="24" class="td-style1">
                <Input type="textarea" :rows="2" v-model="reviewData.opinion"/>
              </td>
            </tr>
            </tbody>
          </table>
        </Row>
      </div>
      <div slot="footer">
        <Button @click="closeModal('review')">取消</Button>
        <Button type="primary" @click="reviewOrder" :loading="loadingButton">确认</Button>
      </div>
    </Modal>
    <!-- 作废 -->
    <Modal
    v-model="modalInvalid"
    title="作废"
    width="1000px"
    >
      <div style="padding: 10px 35px 0 10px">
        <Form label-position="right" :label-width="100">
          <FormItem label="作废说明：">
            <Input v-model="invalidData.invalid_reason" type="textarea" :rows="5"/>
          </FormItem>
          <FormItem label="作废确认：">
            <Checkbox v-model="invalidData.confirm">已确认作废</Checkbox>
          </FormItem>
          <FormItem label=" ">
            <div style="color: red">备注：确认作废提交后，订单流程将终止，且状态无法改变！</div>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="closeModal('invalid')">取消</Button>
        <Button type="error" @click="confirmInvalid" :loading="loadingButton">确认</Button>
      </div>
    </Modal>
    <!-- 导出数据 -->
    <Modal v-model="exportData.modal" title="导出数据" width="800">
      <div>
        <Row>
          <Col :md="24">选择导出条件：</Col>
        </Row>
        <Row>
          <Form label-position="right" :label-width="100">
            <Col span="12" offset="6">
              <FormItem label="下单时间：">
                <DatePicker type="daterange" placement="bottom-end" placeholder="开始时间和结束时间" style="min-width: 80px"
                            @on-change="getExportDate"></DatePicker>
              </FormItem>
            </Col>
            <Col span="12" offset="6">
              <FormItem label="处理状态：">
                <Select v-model="exportData.data.disposeStatus" clearable style="width:120px">
                  <Option v-for="(item, index) in disposeList" :value="item.value" :key="'export'+index"
                          :label="item.label"></Option>
                </Select>
              </FormItem>
            </Col>
          </Form>
        </Row>
      </div>
      <div slot="footer">
        <Button type="default" @click="closeModal('exportData')">关闭</Button>
        <Button type="primary" :loading="exportData.loading" @click="submitExport">提交</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import {SERVER_BASE_URL} from '~/api/config';
 import globalMixin from '~/plugins/mixin';
  export default {
    name: 'replacement-sample-invalid',
    mixins: [globalMixin],
    data() {
      return {
        SERVER_BASE_URL,
        loadingTable: false,
        modalReview: false,
        modalInvalid: false,
        loadingButton: false,
        firstEntry: true,
        searchData: {
          ownership: 'company'
        },
        invalidData: {},
        // 列表分页属性
        pageProps: {
          page: 1,
          perPage: 10,
          totalCount: 0
        },
        channelList: [
          {value: 'CS', label: 'CS'},
          {value: 'KA', label: 'KA'},
          {value: 'OTC', label: 'OTC'},
          {value: '便利店', label: '便利店'},
          {value: '其他', label: '其他'}
        ],
        reviewType: '',
        statusList: [
          {value: 'OrderWorkflow/auditPending', label: '待初审'},
          {value: 'OrderWorkflow/auditFailure', label: '初审未通过'},
          {value: 'OrderWorkflow/auditRecheckPending', label: '待复审'},
          {value: 'OrderWorkflow/auditRecheckFailure', label: '复审未通过'},
          {value: 'OrderWorkflow/auditRecheckPass', label: '复审通过'}
        ],
        reasonList: [
          {value: '商家使用'},
          {value: '业务员样品'},
          {value: '商务合作'},
          {value: '第三方试用'},
          {value: '官方活动赞助'},
          {value: '其他'}
        ],
        listData: {
          columns: [
            {type: 'selection', minWidth: 60, align: 'center',fixed:'left',},
            {title: '创建人', key: 'created_by', width: 100, align: 'center'},
            {key: 'delivery_object', title: '发货对象', minWidth: 200, align: 'center',fixed:'left',},
            {
              key: 'channel_type', 
              title: '渠道', 
              minWidth: 200,
              align: 'center',
              render: (h, params) => {
                return h('div', {
                }, params.row.channel_type ? params.row.channel_type :'——')
              }
              },
            {key: 'contact_phone', title: '联系方式', minWidth: 200, align: 'center'},
            {
              title: '样品订单编号',
              minWidth: 200,
              align: 'center',
              render: (h, params) => {
                return h('a', {
                  on: {
                    'click': () => {
                      this.$router.push({
                        path: '/replacement-management/sample-order-review/sample-detail',
                        query: {
                          id: params.row.id
                        }
                      })
                    }
                  }
                }, params.row.order_sn)
              }
            },
            {
              title: '订单二维码',
              minWidth: 90,
              align: 'center',
              render: (h, params) => {
                return h('img', {
                  domProps: {
                    src: params.row.qr_code
                  },
                  style: {
                    width: '80%',
                    padding: '8px'
                  },
                  on: {
                    click: () => {
                      this.$Modal.info({
                        content: `<img src="${params.row.qr_code}" style="padding-right: 40px;margin-top: 40px;width: 100%" />`,
                        closable: true
                      })
                    }
                  }
                });
              }
            },
            {key: 'reason', title: '样品发货原因', minWidth: 200, align: 'center'},
            {
              title: '样品货号',
              minWidth: 230,
              align: 'center',
              render: (h, params) => {
                return h('div', {
                  attrs: {
                    class: 'item-style'
                  }
                }, [h('ul', params.row.orderProducts.map((item) => {
                  return h('li', item.item_no)
                }))])
              }
            },
            {
              title: '样品数量',
              minWidth: 120,
              align: 'center',
              render: (h, params) => {
                return h('div', {
                  attrs: {
                    class: 'item-style'
                  }
                }, [h('ul', params.row.orderProducts.map((item) => {
                  return h('li', item.number)
                }))])
              }
            },
            {key: 'productAmount', title: '样品货值', minWidth: 120, align: 'center'},
            {key: 'status_desc', title: '审核状态', minWidth: 120, align: 'center'},
            {key: 'dispose_status_desc', title: '导单状态', minWidth: 120, align: 'center'},
            {
              title: '导单处理时间',
              key: 'dispose_time',
              minWidth: 180,
              align: 'center',
              render:(h,params) => {
                let new_dispose_time = new Date(params.row.dispose_time).getTime()
                return h('span',new_dispose_time === 0 ? '——' :params.row.dispose_time)
              }},
            {title: '操作', minWidth: 120, align: 'center', slot: 'action',fixed:'right'}
          ],
          data: []
        },
        orderData: {
          columns: [
            {key: 'pro_name', title: '产品名称', width: 180, align: 'center'},
            {key: 'standard', title: '规格', width: 120, align: 'center'},
            {key: 'unit', title: '单位', width: 120, align: 'center'},
            {key: 'price', title: '零售价', width: 120, align: 'center'},
            {key: 'number', title: '订单数量', width: 120, align: 'center'},
            {key: 'product_value', title: '样品货值', width: 120, align: 'center'},
            {key: 'barcode', title: '条码', width: 180, align: 'center'},
            {key: 'box_standard', title: '箱规', width: 120, align: 'center'}
          ],
          data: []
        },
        selectList: [],
        exportData: { //导出数据
          modal: false,
          loading: false,
          data: {
            disposeStatus: '',
            kind: 'sample',
            startTime: '',
            endTime: ''
          }
        },
        disposeList: [
          {value: 'undisposed', label: '未处理'},
          {value: 'disposed', label: '已处理'},
          {value: 'exception_handling', label: '异常处理'}
        ],
        detailData: {
          auditLogItems: [
            {created_by: '', created_at: ''},
            {created_by: '', created_at: ''}
          ],
        },

        reviewData: {},
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
        this.$api.sampleList(params).then((res) => {
          if (res.code === 0) {
            let data = res.data,
                pageProps = this.pageProps
            this.listData.data = data.list
            pageProps.page = data.currentPage
            pageProps.perPage = data.perPage
            pageProps.totalCount = data.totalCount
            pageProps.currentPage = data.currentPage
            this.searchData.ownership = data.ownership
            this.handleValidateDataPermissionRange(this, 'isGetDataPermissionRange', 'dataPermissionRange', data.ownership)
          }
        }).finally(() => {
          this.loadingTable = false
        })
      },
      formatDate(time) {  // 时间格式转换
        return this.$format(time, 'yyyy-MM-dd hh:mm:ss')
      },
      handleEdit(row) {
        this.$router.push({
          path: '/replacement-management/sample-order-review/sample-edit',
          query: {
            id: row.id
          }
        })
      },
      handleDelete(row) {
        this.$api.orderReviewDelete(row.id).then((res) => {
          if (res.code === 0) {
            this.getList()
            this.$Message.success('删除成功')
          }
        })
      },
      select(selection) {
        if (selection.length == 1) {
          this.selectList = selection
        } else {
          this.selectList.length = 0
        }
      },
      goEdit() {
        this.$router.push({path: '/replacement-management/sample-order-review/sample-edit'})
      },
      openModal(type) {
        this.reviewType = type
        if (this.selectList.length == 0) {
          this.$Message.warning('请选择')
        } else {
          if (type == 'dept') {
            if (this.selectList[0].status !== 'OrderWorkflow/auditPending') {
              this.$Message.warning('请选择待审核数据！')
            } else {
              this.modalReview = true
              this.reviewData = {}
              this.getDetail()
            }
          } else if (type == 'invalid') {
            if (this.selectList[0].receivables_status === 'paid') {
              this.$Message.error(this.selectList[0].receivables_status_desc + '不可作废')
            } else {
              this.modalInvalid = true
              this.invalidData = {}
            }
          } else if(type == 'manager'){
            if (this.selectList[0].status !== 'OrderWorkflow/auditRecheckPending') {
              this.$Message.warning('请选择待复审数据')
            } else {
              this.modalReview = true
              this.reviewData = {}
              this.getDetail()
            }
          }
        }
      },
      closeModal(type) {
        if (type == 'review') {
          this.modalReview = false
        } else if (type == 'invalid') {
          this.modalInvalid = false
        } else if (type == 'exportData') {
          this.exportData.modal = false
        }
      },
      getDetail() {
        this.$api.sampleDetail(this.selectList[0].id).then((res) => {
          if (res.code === 0) {
            this.detailData = res.data
            this.orderData.data = res.data.sampleOrderProducts
          }
        })
      },
      confirmInvalid() {
        if (!this.invalidData.invalid_reason) {
          this.$Message.error("请填写确认说明")
        } else if (!this.invalidData.confirm) {
          this.$Message.error("请确认作废")
        } else {
          let params = {
            invalid_reason: this.invalidData.invalid_reason,
            id: this.selectList[0].id
          }
          this.loadingButton = true
          this.$api.orderCancellation(params).then((res) => {
            if (res.code === 0) {
              this.modalInvalid = false
              this.$Message.success('作废成功')
              this.selectList.length = 0
              this.getList()
            }
          }).finally(() => {
            this.loadingButton = false
          })
        }
      },
      // 导出数据选择日期
      getExportDate(e) {
        this.exportData.data.startTime = e[0];
        this.exportData.data.endTime = e[1];
      },
      // 数据导出
      submitExport() {
        let params = this.exportData.data
        this.exportData.loading = true
        this.$api.orderExport(params).then((res) => {
          if (res.code === 0) {
            window.location.href = res.data.url
            this.exportData.modal = false
          }
        }).finally(() => {
          this.exportData.loading = false
        })
      },
       // 审核通过自动导出订单
      subAutoExl(id,pass){
          let params = {
              disposeStatus:'disposed'
            }
            params.ids = []
            params.ids.push(id)
           if(pass === '1'){
                  this.$api.orderDeliverHandle(params).then(res => {
                  if (res.code === 0) {
                    this.$Message.success('该订单已同步网店管家')
                    this.getList()
                  }
              })
          }
  
      },
      reviewOrder() {
        let params = JSON.parse(JSON.stringify(this.reviewData))
          if(params.is_pass === '' || params.is_pass === undefined || params.is_pass === null ){
            this.$Message.error('请选择结果')
            return
          }else{
            if(this.reviewType == 'dept'){
                params.is_review =  params.is_pass == 0 ? 1 : 0;
                if(params.is_pass == 1){
                  params.is_review = 1
                }
            }
            params.id = this.selectList[0].id
            this.loadingButton = true
            if(this.reviewType == 'dept'){
              this.$api.sampleOrderReviewManagerAudit(params).then((res) => {
                // this.subAutoExl(params.id,params.is_pass)
                this.modalReview = false
                this.$Message.success('审核成功')
                this.selectList.length = 0;
                this.getList();
              }).finally(() => {
                this.loadingButton = false;
              })
            }
            if(this.reviewType == 'manager'){
              this.$api.sampleOrderReviewDirectorAudit(params).then((res) => {
                // this.subAutoExl(params.id,params.is_pass)
                this.modalReview = false
                this.$Message.success('审核成功')
                this.selectList.length = 0;
                this.getList();
              }).finally(() => {
                this.loadingButton = false;
              })

            }
          }

      },
    },
    activated() {
      let status = this.$route.query.status||'';
      if (status) {
        this.searchData.status = status;
      }else{
        this.searchData.status = ''
      }
      let idCollect=this.$route.query.id_collect||'';
      if(idCollect){
        this.searchData.id_collect = idCollect;
      }else{
        this.searchData.id_collect = '';
      }
      this.getList()
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
<style lang="less" scoped>
  /deep/ .item-style {
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

  .review-table {
    border-collapse: collapse;
    width: 100%;

    tr {
      td {
        border: 1px #dcdee2 solid;
        text-align: center;
        height: 50px;
        padding: 10px 20px;
      }
    }
  }

  .modal-div {
    height: 380px;
    overflow-y: scroll;
    padding: 0 10px;
  }

  .td-style {
    background: #e8eaec7a;
    width: 170px;
  }
  .td-style1 {
    width: 200px;
  }
  .row-style {
    margin: 25px 0 10px 0;
  }

  .img-list {
    display: block;
  }
</style>
