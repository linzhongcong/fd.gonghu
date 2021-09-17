<template>
  <div>
    <Card>
      <Row slot="title"  style="position: relative;">
        <Col :sm="24" @keydown.native.enter.prevent="getList('search')">
          <Form ref="search" :model="search" class="search">
            <Row>
              <Col :sm="21" style="">
                <FormItem>
                  <Select v-model="search.ownership" placeholder="数据权限范围" @on-change="getList('search')">
                    <Option v-for="(item, index) in dataPermissionRange" :value="item.value" :label="item.label" :key="'dataPer' + index"></Option>
                  </Select>
                </FormItem>
                <FormItem>
                  <Input v-model="search.order_sn" placeholder="订单编号" clearable></Input>
                </FormItem>
                <FormItem>
                  <Input v-model="search.created_by" placeholder="创建人" clearable></Input>
                </FormItem>
                <!-- <FormItem>
                  <Input v-model="search.salesman" placeholder="业务员" clearable></Input>
                </FormItem> -->
                <FormItem>
                  <Input v-model="search.merchant_name" placeholder="商家名称" clearable></Input>
                </FormItem>
                <FormItem>
                  <Select v-model="search.order_form" placeholder="订单来源" clearable @on-change="getList('search')">
                    <Option v-for="item in orderType" :key="item.value" :value="item.value"
                            :label="item.label"></Option>
                  </Select>
                </FormItem> 
                <!-- <FormItem prop="merchant_type">
                  <Select v-model="search.merchant_type" placeholder="商家类型" clearable @on-change="getList('search')">
                    <Option v-for="item in businessType" :key="'businessType'+item.value" :value="item.value"
                            :label="item.label"></Option>
                  </Select>
                </FormItem> -->
                <FormItem>
                  <Select v-model="search.status" placeholder="状态" clearable @on-change="getList('search')">
                    <Option v-for="item in statusList" :key="item.value" :value="item.value"
                            :label="item.label"></Option>
                  </Select>
                </FormItem>
              </Col>
              <Col :sm="3" style="text-align:right;">
                <FormItem>
                  <Col span="12">
                    <Button type="primary" icon="ios-search" @click="getList('search')">查询</Button>
                  </Col>
                  <!-- <Col span="12">
                    <Button type="default" icon="md-repeat" @click="getList(false)">重置</Button>
                  </Col> -->
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col :sm="20">
          <router-link to="/order-management/review-edit">
            <Button type="primary" v-permission="'/v1/order/create'">添加</Button>
          </router-link>
          <Button type="primary" @click="handleShowDealModal">处理</Button>
          <Button type="primary" @click="tapAudit('dept')" v-permission="'/v1/order/manager-audit'">初审</Button>
          <Button type="primary" @click="tapAudit('manager')" v-permission="'/v1/order/director-audit'">复审</Button>
          <Button type="primary" @click="canCellation(checkList)" v-permission="'/v1/order/invalid'">作废</Button>
          <Button type="primary" @click="goReplacement" v-permission="'/v1/order-reissue/create'">添加补发订单</Button>
          <Button type="primary" @click="exportData.modal = true" v-permission="'/v1/order-delivery/order-export'">导出数据</Button>
          <Button type="primary" @click="applyFor('refund')" v-permission="'/v1/order-refund/create'">退款申请</Button>
          <Button type="primary" @click="applyFor('service')" v-permission="'/v1/order-service/create'">售后申请</Button>
        </Col>
          <!-- <div style="color:red;position: absolute;bottom:-0;right:0;font-size: 0.875rem">网店管家每30分钟获取一次已处理订单</div> -->
        
      </Row>
      <Row class="margin-top-10">
        <Table class="review-list" border max-height='640' :columns="reviewColumns" :data="reviewData" highlight-row
               @on-selection-change="selectCheck" :loading="loading" size="small">
          <!-- 操作 -->
          <template slot-scope="{ row }" slot="action">
            <Tooltip placement="top" content="查看" transfer v-if="row.order_form === 'MiniProgram'">
              <Button @click="handleEdit(row.id)" size="small" :disabled="row.status === 'OrderWorkflow/cancel'" v-permission="'/v1/order/update'">
                <Icon type="md-eye"/>
              </Button>
            </Tooltip>
            <Tooltip placement="top" content="编辑" transfer v-else>
              <Button type="primary" @click="handleEdit(row.id)" size="small" :disabled="row.status === 'OrderWorkflow/cancel'" v-permission="'/v1/order/update'">
                <Icon type="md-create"/>
              </Button>
            </Tooltip>
            <Poptip confirm title="您确认删除这条内容吗？" @on-ok="handleDelete(row.id)" transfer>
              <Button size="small" :disabled="row.order_form === 'MiniProgram' || row.status === 'OrderWorkflow/cancel'" v-permission="'/v1/order/delete'">
                <Icon type="md-trash"/>
              </Button>
            </Poptip>
          </template>
        </Table>
        <div style="margin: 10px;overflow: hidden">
          <div class="pages-L">共 {{pageProps.totalCount}} 条</div>
          <div style="float: right;">
            <Page :total="pageProps.totalCount" size="small" :current="pageProps.currentPage" show-sizer show-elevator
                  @on-change="changePage" @on-page-size-change="changePageSize"></Page>
          </div>
        </div>
      </Row>
    </Card>
    <!-- 部门经理审核 start -->
    <Modal title="审核" v-model="detailsList.modal" width="850" :loading="detailsList.loading">
      <div class="rel">
        <div class="ivu-table-wrapper" style="margin-top: 20px;">
          <div class="ivu-table ivu-table-small ivu-table-border">
            <div class="ivu-table-body">
              <table cellspacing="0" cellpadding="0" border="0" width="100%">
                <tbody>
                <tr class="ivu-table-row">
                  <td class="head-bg">
                    <div class="ivu-table-cell">
                      <span>创建人</span>
                    </div>
                  </td>
                  <td>
                    <div class="ivu-table-cell">
                      <span v-text="detailsList.data.created_by"></span>
                    </div>
                  </td>
                  <td class="head-bg">
                    <div class="ivu-table-cell">
                      <span>创建时间</span>
                    </div>
                  </td>
                  <td>
                    <div class="ivu-table-cell">
                      <span v-text="formatDate(detailsList.data.created_at, 'ymd')"></span>
                    </div>
                  </td>
                  <td class="head-bg">
                    <div class="ivu-table-cell">
                      <span>业务员</span>
                    </div>
                  </td>
                  <td>
                    <div class="ivu-table-cell">
                      <span v-text="detailsList.data.salesman"></span>
                    </div>
                  </td>
                </tr>

                <tr class="ivu-table-row">


                  <td class="head-bg">
                    <div class="ivu-table-cell">
                      <span>订单来源</span>
                    </div>
                  </td>
                  <td>
                    <div class="ivu-table-cell">
                      <span v-text="orderForm[detailsList.data.order_form]"></span>
                    </div>
                  </td>
                  <td class="head-bg">
                    <div class="ivu-table-cell">
                      <span>结款方式</span>
                    </div>
                  </td>
                  <td>
                    <div class="ivu-table-cell">
                      <span v-text="paymentMethod[detailsList.data.payment_method]"></span>
                    </div>
                  </td>
                  <td class="head-bg">
                    <div class="ivu-table-cell">
                      <!--                                            <span>订单号</span>-->
                      <span>送货方式</span>

                    </div>
                  </td>
                  <td>
                    <div class="ivu-table-cell">
                      <!--                                            <span v-text="detailsList.data.order_sn"></span>-->
                      <span v-text="deliveryModeList[detailsList.data.delivery_mode]"></span>
                    </div>
                  </td>
                </tr>
                <tr class="ivu-table-row">
                  <td class="head-bg">
                    <div class="ivu-table-cell">
                      <span>商家名称</span>
                    </div>
                  </td>
                  <td>
                    <div class="ivu-table-cell">
                      <span v-text="detailsList.data.merchant_name"></span>
                    </div>
                  </td>
                  <td class="head-bg">
                    <div class="ivu-table-cell">
                      <span>系统/门店</span>
                    </div>
                  </td>
                  <td>
                    <div class="ivu-table-cell">
                      <span v-text="detailsList.data.system_name"></span>
                    </div>
                  </td>
                  <td class="head-bg">
                    <div class="ivu-table-cell">
                      <span>供货政策</span>
                    </div>
                  </td>
                  <td>
                    <div class="ivu-table-cell">
                      <span v-text="detailsList.data.contract_policy_name"></span>
                    </div>
                  </td>
                </tr>
                <!-- <tr>
                  <td class="head-bg">
                    <div class="ivu-table-cell">
                      <span>订单所选政策</span>
                    </div>
                  </td>
                  <td colspan="3">
                    <div class="ivu-table-cell">
                      <a v-text="detailsList.data.contract_policy_name" @click="openPolicyDetail"></a>
                    </div>
                  </td>
                  <td class="head-bg">
                    <div class="ivu-table-cell">
                      <span>政策类型</span>
                    </div>
                  </td>
                  <td>
                    <div class="ivu-table-cell">
                      <span>{{agreementDetail.policy_type === 'yes'? '活动' : '非活动'}}</span>
                    </div>
                  </td>
                </tr> -->
                <tr class="ivu-table-row">
                  <td class="head-bg">
                    <div class="ivu-table-cell">
                      <span>订单编号</span>
                    </div>
                  </td>
                  <td>
                    <div class="ivu-table-cell">
                      <span v-text="detailsList.data.order_sn"></span>
                    </div>
                  </td>
                  <td class="head-bg">
                    <div class="ivu-table-cell">
                      <span>下单时间</span>
                    </div>
                  </td>
                  <td>
                    <div class="ivu-table-cell">
                      <span v-text="formatDate(detailsList.data.order_time)"></span>
                    </div>
                  </td>
                  <td class="head-bg">
                    <div class="ivu-table-cell">
                      <span>订单应收金额</span>
                    </div>
                  </td>
                  <td>
                    <div class="ivu-table-cell">
                      <span>{{detailsList.data.total_order_amount}}</span>
                    </div>
                  </td>
                </tr>
                <tr class="ivu-table-row">
                  <td class="head-bg">
                    <div class="ivu-table-cell">
                      <span>附件凭证</span>
                    </div>
                  </td>
                  <td colspan="5">
                    <div class="ivu-table-cell">
                      <a href="javascript:;" @click="showOrderFile(item)" v-for="(item, index) in detailsList.data.orderFile" :key="index">{{item.title + '.' + item.extension}}<br/></a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="head-bg">
                    <div class="ivu-table-cell">
                      <span>备注</span>
                    </div>
                  </td>
                  <td colspan="5">
                    <div >
                      <span>{{detailsList.data.remark}}</span>
                    </div>
                  </td>
                </tr>
                </tbody>
              </table>
              <table cellspacing="0" cellpadding="0" border="0" width="100%">
                <tbody>
                <tr class="ivu-table-row">
                  <td colspan="10">
                  </td>
                </tr>
                <tr class="ivu-table-row">
                  <td colspan="10">
                    <div class="ivu-table-cell" style="text-align:left; font-weight: bold;">商品清单</div>
                  </td>
                </tr>
                </tbody>
              </table>
              <Table class="review-list" border highlight-row :columns="productColumns.order"
                     :data="detailsList.data.orderProduct" @on-selection-change="selectCheck" :loading="loading"
                     size="small">
              </Table>

              <!-- 返点比例 start -->
              <template v-if="Number(detailsList.data.rebate_limit) !== 0">
                <table cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tbody>
                  <tr class="ivu-table-row">
                    <td colspan="10">
                      <div class="ivu-table-cell" style="text-align:left; font-weight: bold;">
                        返点清单
                      </div>
                    </td>
                  </tr>
                  </tbody>
                </table>
                <Table class="review-list" border highlight-row :columns="productColumns.backPoint"
                       :data="detailsList.data.backPoint" @on-selection-change="selectCheck" :loading="loading"
                       size="small">
                </Table>
              </template>
              <!-- 返点比例 end -->

              <!-- 换购比例 start -->
              <template
                      v-if="detailsList.data.repurchaseProduct !== undefined &&detailsList.data.repurchaseProduct.length!== 0">
                <table cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tbody>
                  <tr class="ivu-table-row">
                    <td colspan="10">
                      <div class="ivu-table-cell" style="text-align:left; font-weight: bold;">
                        换购清单
                      </div>
                    </td>
                  </tr>
                  </tbody>
                </table>
                <Table class="review-list" border highlight-row :columns="productColumns.repurchase"
                       :data="detailsList.data.repurchaseProduct" @on-selection-change="selectCheck" :loading="loading"
                       size="small">
                </Table>
              </template>
              <!-- 换购比例 end -->

              <!-- 配赠比例 start -->
              <template
                      v-if="detailsList.data.matchingProduct !== undefined &&detailsList.data.matchingProduct.length!== 0">
                <table cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tbody>
                  <tr class="ivu-table-row">
                    <td colspan="10">
                      <div class="ivu-table-cell" style="text-align:left; font-weight: bold;">
                        配赠清单
                      </div>
                    </td>
                  </tr>
                  </tbody>
                </table>
                <Table class="review-list" border highlight-row :columns="productColumns.matching"
                       :data="detailsList.data.matchingProduct" @on-selection-change="selectCheck" :loading="loading"
                       size="small">
                </Table>
              </template>
              <!-- 配赠比例 end -->

              <!-- 赠点比例 start -->
              <template v-if="detailsList.data.giftProduct && detailsList.data.giftProduct.length">
                <table cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tbody>
                  <tr class="ivu-table-row">
                    <td colspan="10">
                      <div class="ivu-table-cell" style="text-align:left; font-weight: bold;">
                        赠品清单
                      </div>
                    </td>
                  </tr>
                  </tbody>
                </table>
                <Table class="review-list" border highlight-row :columns="productColumns.gift"
                       :data="detailsList.data.giftProduct" @on-selection-change="selectCheck" :loading="loading"
                       size="small">
                </Table>
                <table cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tbody>
                  <tr>
                    <td colspan="2">
                      <div class="ivu-table-cell">
                      </div>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </template>
              <!-- 赠点比例 end -->

              <table cellspacing="0" cellpadding="0" border="0" width="100%">
                <tbody>
                <!-- 初审显示 start -->
                <tr class="ivu-table-row" v-if="reviewType === 'dept'">
                  <td class="head-bg" colspan="2">
                    <div class="ivu-table-cell">
                      <span>初审</span>
                    </div>
                  </td>
                  <td colspan="3 ">
                    <div class="ivu-table-cell">
                      <span v-text="auditLogItems[0].created_by"></span>
                    </div>
                  </td>

                  <td class="head-bg" colspan="2">
                    <div class="ivu-table-cell">
                      <span>审核时间</span>
                    </div>
                  </td>
                  <td colspan="3">
                    <div class="ivu-table-cell">
                      <span v-text="formatDate(auditLogItems[0].created_at)"></span>
                    </div>
                  </td>
                </tr>
                <!-- 初审显示 end -->

                <!-- 复审显示 start -->
                <tr class="ivu-table-row" v-if="reviewType != 'dept'">
                  <td class="head-bg" colspan="2">
                    <div class="ivu-table-cell">
                      <span>初审</span>
                    </div>
                  </td>

                  <td>
                    <div class="ivu-table-cell">
                      <span v-text="auditLogItems[auditLogItems.length-2].created_by"></span>
                    </div>
                  </td>

                  <td class="head-bg" colspan="2">
                    <div class="ivu-table-cell">
                      <span>审核时间</span>
                    </div>
                  </td>

                  <td colspan="2">
                    <div class="ivu-table-cell">
                      <span v-text="formatDate(auditLogItems[auditLogItems.length-2].created_at)"></span>
                    </div>
                  </td>
                  <td class="head-bg" colspan="2">
                    <div class="ivu-table-cell">
                      <span>审核结果</span>
                    </div>
                  </td>
                  <td>
                    <div class="ivu-table-cell">
                      <span v-text="auditLogItems[auditLogItems.length-2].audit_pass === '1' ? '通过' : '不通过'"></span>
                    </div>
                  </td>
                </tr>
                <!-- 复审显示 end -->

                <!-- 初审显示 start -->
                <tr class="ivu-table-row" v-if="reviewType === 'dept'">
                  <td class="head-bg" colspan="2">
                    <div class="ivu-table-cell">
                      <span>审核结果</span>
                    </div>
                  </td>

                  <td colspan="3">
                    <div class="ivu-table-cell">
                      <RadioGroup v-model="detailsList.data.is_pass" @on-change='changePass'>
                        <Radio label="1">
                          <span>通过</span>
                        </Radio>
                        <Radio label="0">
                          <span>不通过</span>
                        </Radio>
                      </RadioGroup>
                    </div>
                  </td>
                  <td class="head-bg" colspan="2">
                    <div class="ivu-table-cell">
                      <span>是否需要复审</span>
                    </div>
                  </td>
                  <td colspan="3">
                    <div class="ivu-table-cell">
                      <!-- <Button :type="detailsList.auditAgainBtn?'primary':'default'" v-text="detailsList.auditAgainBtn ? '是' : '否'" @click="changeAuditAgain"></Button> -->
                      <RadioGroup v-model="detailsList.auditAgainBtn">
                        <Radio label='1' :disabled='isPass'>
                          <span>是</span>
                        </Radio>
                        <Radio label='0' :disabled='isPass'>
                          <span>否</span>
                        </Radio>
                      </RadioGroup>
                    </div>
                  </td>
                </tr>
                <!-- 初审显示 end -->
                <tr class="ivu-table-row">
                  <td class="head-bg" rowspan="1" colspan="2">
                    <div class="ivu-table-cell">
                      <span>备注</span>
                    </div>
                  </td>
                  <td colspan="8">
                    <div class="ivu-table-cell" v-if="reviewType === 'dept'">
                      <Input class="remark-input" v-model="detailsList.data.opinion" placeholder="请输入"/>
                    </div>
                    <div class="ivu-table-cell" v-else>
                      <span v-text="auditLogItems[auditLogItems.length-2].opinion"></span>
                    </div>
                  </td>
                </tr>
                <tr class="ivu-table-row" v-if="reviewType !== 'dept'">
                  <td class="head-bg">
                    <div class="ivu-table-cell">
                      <span>复审</span>
                    </div>
                  </td>
                  <td>
                    <div class="ivu-table-cell">
                      <span v-text="auditLogItems[1].created_by"></span>
                    </div>
                  </td>
                  <td colspan="2" class="head-bg">
                    <div class="ivu-table-cell">
                      <span>审核时间</span>
                    </div>
                  </td>
                  <td colspan="2">
                    <div class="ivu-table-cell">
                      <span v-text="formatDate(auditLogItems[1].created_at)"></span>
                    </div>
                  </td>
                  <td class="head-bg" colspan="2">
                    <div class="ivu-table-cell">
                      <span>审核结果</span>
                    </div>
                  </td>
                  <td colspan="2">
                    <div class="ivu-table-cell">
                      <RadioGroup v-model="detailsList.data.is_pass">
                        <Radio label="1">
                          <span>是</span>
                        </Radio>
                        <Radio label="0">
                          <span>否</span>
                        </Radio>
                      </RadioGroup>
                    </div>
                  </td>
                </tr>
                <tr class="ivu-table-row" v-if="reviewType !== 'dept'">
                  <td class="head-bg" rowspan="1">
                    <div class="ivu-table-cell">
                      <span>备注</span>
                    </div>
                  </td>
                  <td colspan="9">
                    <div class="ivu-table-cell">
                      <Input class="remark-input" v-model="detailsList.data.opinion" placeholder="请输入"/>
                    </div>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button type="default" @click="closeModal('detailsList')">关闭</Button>
        <Button type="primary" @click="submitAudit">提交</Button>
      </div>
      <Spin size="large" v-show="detailsList.loading" fix></Spin>
    </Modal>
    <!-- 部门经理审核 end -->

    <Modal v-model="cancellation.modal" title="作废" width="900">
      <div style="width:720px;margin:auto">
        <div style="display:flex">
          <span style="width:60px">作废说明:</span>
          <Input v-model="cancellation.value8" type="textarea" :autosize="{minRows: 5,maxRows: 5}"
                 placeholder="请输入作废说明"/>
        </div>
        <div class="msg">
          <span>作废确认:</span>
          <div>
            <div style="font-size: 13px; font-family: Tahoma;">
              <input type="checkbox" class="inputClass" v-model="items.state" v-on:click="CheckItem(items)">已确认作废信息
            </div>
            <div class="remark">
              <span>(备注：确认作废提交后，订单流程将中止，且状态将无法改变）</span>
            </div>
          </div>
        </div>
        <div style="padding:10px 0;text-align:right">
          <Button style="background: rgba(255, 51, 102, 1);color: #fff;" type="error" @click="addModal()">确认</Button>
          <Button @click="cancellation.modal=false">取消</Button>
        </div>
      </div>
      <div slot="footer"></div>
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
    <PolicyDetail ref="policyDetail"/>
    <!-- 收款详情弹窗 -->
    <Modal v-model="collectDetails.modal" title="收款详情" width="900" class="collection-modal">
      <div class="rel">
        <!-- 订单详情 start -->
        <div class="ivu-table-wrapper">
          <div class="ivu-table ivu-table-small ivu-table-border">
            <div class="ivu-table-body">
              <table cellspacing="0" cellpadding="0" border="0" width="100%">
                <tbody class="ivu-table-tbody">
                <tr class="ivu-table-row">
                  <td class="head-bg">
                    <div class="ivu-table-cell">订单号</div>
                  </td>
                  <td>
                    <div class="ivu-table-cell"><span>{{ collectDetails.data.order_sn }}</span></div>
                  </td>
                  <td class="head-bg">
                    <div class="ivu-table-cell">合作商</div>
                  </td>
                  <td>
                    <div class="ivu-table-cell"><span>{{ collectDetails.data.merchant_name }}</span></div>
                  </td>
                  <td class="head-bg">
                    <div class="ivu-table-cell">合作金额</div>
                  </td>
                  <td>
                    <div class="ivu-table-cell"><span>{{ collectDetails.data.total_order_amount }}</span></div>
                  </td>
                </tr>
                <tr class="ivu-table-row">
                  <td class="head-bg">
                    <div class="ivu-table-cell">收款状态</div>
                  </td>
                  <td>
                    <div class="ivu-table-cell">
                      <span v-text="receivablesStatusList[collectDetails.data.receivables_status]"></span>
                    </div>
                  </td>
                  <td class="head-bg">
                    <div class="ivu-table-cell">收款提交时间</div>
                  </td>
                  <td>
                    <div class="ivu-table-cell">
                      <span v-text="!collectDetails.data.receipt_submission_at || collectDetails.data.receipt_submission_at==0 ? '暂无' : formatDate(collectDetails.data.receipt_submission_at)"></span>
                    </div>
                  </td>
                  <td class="head-bg">
                    <div class="ivu-table-cell">收款完成时间</div>
                  </td>
                  <td>
                    <div class="ivu-table-cell">
                      <span v-text="!collectDetails.data.collection_completion_at || collectDetails.data.collection_completion_at==0 ? '暂无' : formatDate(collectDetails.data.collection_completion_at)"></span>
                    </div>
                  </td>
                </tr>
                <tr class="ivu-table-row">
                  <td class="head-bg">
                    <div class="ivu-table-cell">订单来源</div>
                  </td>
                  <td>
                    <div class="ivu-table-cell">
                      <span v-text="orderTypeTranslate[collectDetails.data.order_form]"></span>
                    </div>
                  </td>
                  <td class="head-bg">
                    <div class="ivu-table-cell">申请</div>
                  </td>
                  <td>
                    <div class="ivu-table-cell">
                      <span v-text="!collectDetails.data.created_by ? '暂无' : collectDetails.data.created_by"></span>
                    </div>
                  </td>
                </tr>
                <tr class="ivu-table-row">
                  <td colspan="6">
                  </td>
                </tr>
                <template v-for="(item,index1) in collectDetails.data.orderReceivable">
                  <!-- <div :key="index1"> -->
                  <tr class="ivu-table-row">
                    <td class="head-bg">
                      <div class="ivu-table-cell">支付编号</div>
                    </td>
                    <td colspan="5">
                      <div class="ivu-table-cell"><span
                              v-text="!collectDetails.data.pay_sn || collectDetails.data.pay_sn == '' ? '暂无' : collectDetails.data.pay_sn"></span>
                      </div>
                    </td>
                  </tr>
                  <tr class="ivu-table-row">
                    <td class="head-bg">
                      <div class="ivu-table-cell">汇款户名</div>
                    </td>
                    <td colspan="2">
                      <div class="ivu-table-cell"><span>{{ item.remittanceName }}</span></div>
                    </td>
                    <td class="head-bg">
                      <div class="ivu-table-cell">汇款账号</div>
                    </td>
                    <td colspan="2">
                      <div class="ivu-table-cell"><span>{{ item.remittanceAccount }}</span></div>
                    </td>
                  </tr>
                  <tr class="ivu-table-row">
                    <td class="head-bg">
                      <div class="ivu-table-cell">汇款项目</div>
                    </td>
                    <td colspan="5">
                      <div class="ivu-table-cell"><span>{{ item.project }}</span></div>
                    </td>
                  </tr>
                  <tr class="ivu-table-row">
                    <td class="head-bg">
                      <div class="ivu-table-cell">汇入方式</div>
                    </td>
                    <td colspan="2">
                      <div class="ivu-table-cell"><span>{{ item.importMode }}</span></div>
                    </td>
                    <td class="head-bg">
                      <div class="ivu-table-cell">汇入户名</div>
                    </td>
                    <td colspan="2">
                      <div class="ivu-table-cell"><span>{{ item.importName }}</span></div>
                    </td>
                  </tr>
                  <tr class="ivu-table-row">
                    <td class="head-bg">
                      <div class="ivu-table-cell">汇入账号</div>
                    </td>
                    <td colspan="2">
                      <div class="ivu-table-cell"><span>{{ item.importAccount }}</span></div>
                    </td>
                    <td class="head-bg">
                      <div class="ivu-table-cell">汇入金额</div>
                    </td>
                    <td colspan="2">
                      <div class="ivu-table-cell"><span>{{ item.importAmount }}</span></div>
                    </td>
                  </tr>
                  <tr class="ivu-table-row">
                    <td class="head-bg">
                      <div class="ivu-table-cell">汇入时间</div>
                    </td>
                    <td colspan="2">
                      <div class="ivu-table-cell"><span>{{ formatDate(item.importAt) }}</span></div>
                    </td>
                    <td class="head-bg">
                      <div class="ivu-table-cell">上传凭证</div>
                    </td>
                    <td colspan="2">
                      <div class="ivu-table-cell" v-if="item.fileItems.length">
                        <a v-for="(link, linkIndex) in item.fileItems" :key="linkIndex" :href="link.url"
                           target="_blank">
                          {{ item.fileItems[linkIndex].title +'.'+ item.fileItems[linkIndex].extension}}
                        </a>
                      </div>
                    </td>
                  </tr>
                  <tr class="ivu-table-row">
                    <td class="head-bg">
                      <div class="ivu-table-cell">备注</div>
                    </td>
                    <td colspan="5">
                      <div class="ivu-table-cell"><span>{{ item.remark }}</span></div>
                    </td>
                  </tr>
                  <tr class="ivu-table-row">
                    <td colspan="6">
                    </td>
                  </tr>
                  <!-- </div> -->
                </template>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <Spin v-show="collectDetails.loading" :fix="true" size="large"></Spin>
      </div>
      <div slot="footer">
        <Button type="default" @click="collectDetails.modal = false">关闭</Button>
      </div>
    </Modal>

    <!-- 处理弹窗 start -->
    <OrderDealModal
      :show="dealModal.modal"
      :data="dealModal.data"
      :remote-method="queryShippingDeb"
      :remote-loading="dealModal.remoteLoading"
      :remote-data-list="dealModal.remoteDataList"
      @on-ok="dealOnOk"
      @on-cancel="dealModal.modal = false">
    </OrderDealModal>
    <!-- 处理弹窗 end -->
  </div>
</template>

<script>
  import Cookies from 'js-cookie'
  import QRCode from 'qrcode'
  import {SERVER_BASE_URL} from '~/api/config';
  import PolicyDetail from '../my-components/policy-detail-modal';
  import OrderDealModal from '@/components/order-management/order-deal-modal';
  import globalMixin from '~/plugins/mixin';

  export default {
    name: 'review',
    mixins: [globalMixin],
    components: {
      PolicyDetail,
      OrderDealModal
    },
    data() {
      return {
        firstEntry: true,
        showImgUrl: '',
        //审核-初审的复审是否禁用
        isPass:false,
        // 作废信息确认
        items: [{
          state: false
        }, {
          state: true
        }],
        // 发货信息-发货方式
        deliveryModeList: {
          express: '快递',
          logistics: '物流',
          null: '未知'
        },
        // 合同政策弹窗
        policyDetailsList: {
          modal: false,
          data: [],
          loading: true,
          showAuditDetail: false,
          is_pass: ''
        },
        modalType: '',
        baseList: [],
        categoryList: [],
        policyProductList: [],
        backPointList: [],
        giftList: [],
        policyNameLists: [],
        policyNameLoading: false,
        // 收款状态
        receivablesStatusList: {
          unpaid: '未付款',
          paid: '已付款',
          wait_receipt: '待付款',
          receipt: '已收款'
        },
        originTable:{
          // 满赠清单来源:
          categoryList:[{label:'类目',value:'category'},{label:'商品',value:'product'}], 
        },
        // 导单状态
        dispose_status: {
          undisposed: '未处理',
          disposed: '已处理 ',
          exception_handling: '异常处理'
        },
        // 商家类型
        businessType: [
          {value: 'cs', label: 'CS'},
          {value: 'ka', label: 'KA'},
          {value: 'otc', label: 'OTC'},
          {value: 'store', label: '便利店'},
          {value: 'other', label: '其他'}
        ],
        // 审核状态
        logTabs: 'details',
        detailId: '', // 详情弹窗id
        userList: [],
        checkList: [],
        fileUploadURL: `${SERVER_BASE_URL}/v1/common/upload`,
        fileUploadHeaders: {
          Authorization: Cookies.get('authorization')
        },
        statusList: [
          {value: 'OrderWorkflow/wait', label: '待处理'},
          {value: 'OrderWorkflow/reject', label: '驳回'},
          {value: 'OrderWorkflow/auditPending', label: '待初审'},
          {value: 'OrderWorkflow/auditFailure', label: '初审未通过'},
          {value: 'OrderWorkflow/auditRecheckPending', label: '待复审'},
          {value: 'OrderWorkflow/auditRecheckFailure', label: '复审未通过'},
          {value: 'OrderWorkflow/auditRecheckPass', label: '复审通过'},
          {value: 'OrderWorkflow/cancel', label: '作废'},
          {value: 'OrderWorkflow/draft', label: '草稿'},
        ],
        search: {
          ownership: 'company'
        },
        ownershipList: [],
        trial: {
          is_pass: '',
          opinion: ''
        },
        review: {
          is_pass: '',
          opinion: ''
        },
        isShowLoading: true,
        loading: false,
        // 详情、审核、复审弹窗
        modal: {
          title: '',
          status: ''
        },
        // 付款方式
        paymentMethodList: {
          monthly: '月结',
          spot_cash: '现款现货',
          spotCash: '现款现货',
          real_sale: '实销实结',
          realSale: '实销实结',
        },
        productList: [
          {title: '产品名称', label: 'pro_name'},
          {title: '規格', label: 'standard'},
          {title: '单位', label: 'unit'},
          {title: '零售价', label: 'price'},
          {title: '折扣', label: 'discount'},
          {title: '进货价', label: 'purchasing_price'},
          {title: '订单数量', label: 'number'},
          {title: '订货总价', label: 'total_price'},
          {title: '条码', label: 'barcode'},
          {title: '箱规', label: 'box_standard'}
        ],
        productColumns: {
          order: [
            {title: '产品名称', key: 'pro_name', align: 'center', minWidth: 210},
            {title: '规格', key: 'standard', align: 'center', minWidth: 120},
            {title: '单位', key: 'unit', align: 'center', minWidth: 80},
            {title: '零售价', key: 'price', align: 'center', minWidth: 150},
            {title: '折扣', key: 'discount', align: 'center', minWidth: 80},
            {title: '订货数量', key: 'number', align: 'center', minWidth: 100},
            {title: '订货应收', key: 'total_price', align: 'center', minWidth: 150},
            {title: '条码', key: 'barcode', align: 'center', minWidth: 200},
            {title: '箱规', key: 'box_standard', align: 'center', minWidth: 80}
          ],
          backPoint: [
            {title: '产品名称', key: 'pro_name', align: 'center', minWidth: 210},
            {title: '规格', key: 'standard', align: 'center', minWidth: 120},
            {title: '单位', key: 'unit', align: 'center', minWidth: 80},
            {title: '零售价', key: 'price', align: 'center', minWidth: 150},
            {
              title: '折扣',
              align: 'center',
              minWidth: 80,
              render: (h, params) => {
                return h('div', '-');
              }
            },
            {
              title: '订货数量', key: 'number', align: 'center', minWidth: 100
            },
            {
              title: '返点货值',
              align: 'center',
              minWidth: 150,
              render: (h, params) => {
                return h('div', params.row.number * params.row.price)
              }
            },
            {title: '条码', key: 'barcode', align: 'center', minWidth: 200},
            {title: '箱规', key: 'box_standard', align: 'center', minWidth: 80}
          ],
          gift: [
            {
                title: '来源',
                key: 'object_name',
                align: 'center',
                width: 80,
                render: (h, params) => {
                  let text = ""
                  this.originTable.categoryList.forEach(item => {
                    if(params.row.object_name === item.value){
                      text = item.label
                    }
                  })
                  return h('div', text);
                }
            },
            {
              title: '产品名称',
              key: 'pro_name',
              align: 'center',
              minWidth: 210
            },
            {
              title: '规格',
              key: 'standard',
              align: 'center',
              minWidth: 120
            },
            {
              title: '单位',
              key: 'unit',
              align: 'center',
              minWidth: 80
            },
            {
              title: '零售价',
              key: 'price',
              align: 'center',
              minWidth: 150
            },
            {
              title: '折扣',
              align: 'center',
              minWidth: 80,
              render: (h, params) => {
                return h('div', '-');
              }
            },
            {
              title: '满赠数量',
              key: 'number',
              align: 'center',
              minWidth: 100
            },
            {
              title: '返点货值',
              align: 'center',
              minWidth: 150,
              render: (h, params) => {
                return h('div', params.row.number * params.row.price)
              }
            },
            {
              title: '条码',
              key: 'barcode',
              align: 'center',
              minWidth: 200
            },
            {
              title: '箱规',
              key: 'box_standard',
              align: 'center',
              minWidth: 80
            }
          ],
          repurchase: [
            {
              title: '产品名称',
              key: 'pro_name',
              align: 'center',
              minWidth: 210
            },
            {
              title: '规格',
              key: 'standard',
              align: 'center',
              minWidth: 120
            },
            {
              title: '单位',
              key: 'unit',
              align: 'center',
              minWidth: 80
            },
            {
              title: '零售价',
              key: 'price',
              align: 'center',
              minWidth: 150
            },
            {
              key: 'discount',
              title: '换购折扣',
              align: 'center',
              minWidth: 80
            },
            {
              title: '订货数量',
              key: 'number',
              align: 'center',
              minWidth: 100
            },
            {
              title: '换购应收',
              align: 'center',
              minWidth: 150,
              render: (h, params) => {
                return h('div', +params.row.total_price)
              }
            },
            {
              title: '条码',
              key: 'barcode',
              align: 'center',
              minWidth: 200
            },
            {
              title: '箱规',
              key: 'box_standard',
              align: 'center',
              minWidth: 80
            }
          ],
          matching: [
            {
              title: '产品名称',
              key: 'pro_name',
              align: 'center',
              minWidth: 210
            },
            {
              title: '规格',
              key: 'standard',
              align: 'center',
              minWidth: 120
            },
            {
              title: '单位',
              key: 'unit',
              align: 'center',
              minWidth: 80
            },
            {
              title: '零售价',
              key: 'price',
              align: 'center',
              minWidth: 150
            },
            {
              title: '折扣',
              align: 'center',
              minWidth: 80,
              render: (h, params) => {
                return h('div', '-');
              }
            },
            {
              title: '订货数量',
              key: 'number',
              align: 'center',
              minWidth: 100
            },
            {
              title: '配赠货值',
              align: 'center',
              minWidth: 150,
              render: (h, params) => {
                return h('div', +params.row.total_price)
              }
            },
            {
              title: '条码',
              key: 'barcode',
              align: 'center',
              minWidth: 200
            },
            {
              title: '箱规',
              key: 'box_standard',
              align: 'center',
              minWidth: 80
            }
          ]
        },
        auditLogItems: [
          {created_by: '', created_at: ''},
          {created_by: '', created_at: ''}
        ],
        // 作废弹窗
        cancellation: {
          modal: false,
          value8: ''
        },
        // 收款详情
        collectDetails: {
          modal: false,
          data: {
            orderReceivable: [
              {
                remittanceName: '',
                remittanceAccount: '',
                project: '',
                importMode: '',
                fileItems: [],
                importAccount: '',
                importAmount: '',
                importAt: '',
                remark: ''
              }
            ]
          },
          loading: false
        },
        // 详情弹窗
        detailsList: {
          modal: false,
          data: {
            delivery: {
              delivery_mode: ''
            },
            auditLogItems: [],
            orderProduct: [],
            orderFile: [],
            backPoint: [],
            gift: []
          },
          auditAgainBtn: "1",
          loading: true,
          remark: '',
          cancelOrder: [
            {type: 'index', title: '序号', align: 'center'},
            {key: 'created_by', title: '撤单人', align: 'center'},
            {
              key: 'created_at',
              title: '撤单日期',
              align: 'center',
              render: (h, params) => {
                return h('div', this.formatDate(params.row.created_at));
              }
            },
            {key: 'opinion', title: '撤单原因', align: 'center'}
          ],
          deliveryItems: [
            {type: 'index', title: '序号', align: 'center'},
            {key: 'arrival_depot', title: '到货仓库', align: 'center'},
            {key: 'arrival', title: '到货数量', align: 'center'},
            {
              key: 'arrival_at',
              title: '回复交期',
              align: 'center',
              render: (h, params) => {
                return h('div', this.formatDate(params.row.arrival_at));
              }
            },
            {key: 'remark', title: '回复交期备注', align: 'center'}
          ]
        },
        // 审核
        auditList: {},
        orderType: [
          {value: 'backstage', label: '后台'},
          {value: 'MiniProgram', label: '钉钉'}
        ],
        orderTypeTranslate: {
          backstage: '后台添加',
          MiniProgram: '小程序订单',
        },
        // 支付方式
        paymentMethod: {
          monthly: '月结',
          spot_cash: '现款现货',
          real_sale: '实销实结'
        },
        // 订单来源
        orderForm: {
          MiniProgram: '小程序',
          backstage: '后台'
        },
        // 列表分页属性
        pageProps: {
          page: 1,
          perPage: 10,
          currentPage: 1,
          totalCount: 0
        },
        reviewData: [],
        // 弹窗表格
        reviewColumns: [
          {
            type: 'selection',
            width: 60,
            align: 'center',
            fixed: 'left',
            filterMultiple: false
          },
          {
            title: '序号',
            type: 'index',
            width: 70,
            align: 'center',
            fixed: 'left',
          },
          {
            key: 'id',
            title: '订单编号',
            width: 180,
            sortable: true,
            fixed: 'left',
            align: 'center',
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    this.$router.push({
                      path: '/order-management/review-details',
                      query: {id: params.row.id}
                    });
                  }
                }
              }, params.row.order_sn);
            }
          },
          {title: '创建人', key: 'created_by', width: 100, align: 'center'},
          {title: '商家名称', key: 'merchant_name', width: 200, align: 'center'},
          {title: '系统/门店', key: 'system_name', width: 200, align: 'center'},
          {
            title: '订单二维码',
            minWidth: 100,
            align: 'center',
            render: (h, params) => {
              return h('img', {
                domProps: {
                  src: params.row.qr_code
                },
                style: {
                  width: '80%',
                  padding: '8px',
                  '-webkit-user-select': 'none'
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
          {
            title: '订单来源',
            key: 'order_form',
            minWidth: 90,
            align: 'center',
            render: (h, params) => {
              return h('span', this.orderForm[params.row.order_form]);
            }
          },

          {
            title: '下单时间',
            key: 'order_time',
            minWidth: 100,
            align: 'center',
            render: (h, params) => {
              return h('span', this.formatDate(params.row.order_time, 'ymd'));
            }
          },
          {
            title: '货号',
            width: 300,
            align: 'center',
            ellipsis: true,
            render: (h, params) => {
              return h('div', {
                attrs: {
                  class: 'sub-col'
                }
              }, [
                h('ul', params.row.product.map((item, value, index) => {
                  return h('li', {}, item.item_no);
                }))
              ]);
            }
          },
          {
            title: '数量',
            minWidth: 80,
            align: 'center',
            ellipsis: true,
            render: (h, params) => {
              return h('div', {
                style: {
                  listStyle: 'none'
                },
                attrs: {
                  class: 'sub-col'
                }
              }, [
                h('ul', params.row.product.map((item, value, index) => {
                  return h('li', {}, parseInt(item.number));
                }))
              ]);
            }
          },
          {
            // title: '付款方式',
            title: '结款方式',
            key: 'payment_method',
            minWidth: 90,
            align: 'center',
            render: (h, params) => h('span', this.paymentMethodList[params.row.payment_method])
          },
          {title: '订单金额', key: 'total_order_amount', minWidth: 90, align: 'center'},
          {
            title: '状态',
            key: 'delivery_mode',
            minWidth: 90,
            align: 'center',
            render: (h, params) => {
              return h('span', params.row.status_desc);
            }
          },
          // {
          //   title: '小程序订单状态',
          //   key: 'miniprogram_status_desc',
          //   minWidth: 90,
          //   align: 'center',
          //   // render: (h, params) => {
          //   //     return h('span', this.findAuditStatus(params.row.status));
          //   // }
          // },
          {
            title: '收款状态',
            key: 'receivables_status',
            minWidth: 90,
            align: 'center',
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    this.openCollectDetails(params.row)
                  }
                }
              }, params.row.receivables_status_desc);
            }
          },
          {
            title: '导单状态',
            key: 'dispose_status',
            minWidth: 90,
            align: 'center',
            render: (h, params) => {
              return h('span', this.dispose_status[params.row.dispose_status]);
            }
          },
          {
            title: '导单处理时间',
            key: 'dispose_time',
            minWidth: 180,
            align: 'center',
            render:(h,params) => {
              let new_dispose_time = new Date(params.row.dispose_time).getTime()
              return h('span',new_dispose_time === 0 ? '——' :params.row.dispose_time)
            }
          },
          {
            key: 'action',
            title: '操作',
            fixed: 'right',
            minWidth: 120,
            align: 'center',
            slot: 'action'
          }
        ],
        loadingVisible: false,
        // 详情
        isDisabled: false, // 若文件没有上传完，设置提交按钮为禁止状态
        formData: {},
        result: null,
        reviewType: '',
        // 合同政策
        isShowAgreementDetail: false,
        agreementDetailLoading: false,
        agreementDetail: {
          policy_name: '',
          isOpen: null,
          created_by: '',
          created_at: 0,
          reviewer: '',
          audit_at: 0,
          baseDiscount: [],
          categoryDiscount: [],
          productDiscount: [],
          giftDiscount: []
        },
        exportData: { //导出数据
          modal: false,
          loading: false,
          data: {
            dispose_status: '',
            kind: 'common',
            start_time: '',
            end_time: ''
          }
        },

        disposeList: [
          {value: 'undisposed', label: '未处理'},
          {value: 'disposed', label: '已处理'},
          {value: 'exception_handling', label: '异常处理'}
        ],
        // 处理弹窗 - 对象集合
        dealModal: {
          modal: false,
          data: {},
          remoteLoading: false,
          remoteDataList: []
        },
        queryShippingDeb: this.$debonce(this.queryShipping, 500),
      };
    },
    methods: {
      /**
       * 远程查询收货地址
       * @param {String} value: 地址名称
       */
      async queryShipping(value) {
        this.dealModal.remoteLoading = true;
        // to-do: 查询收货地址API
      },

      /**
       * 确认处理
       */
      async dealOnOk() {
        // to-do: 处理API
      },

      showOrderFile(file) {
        let url = SERVER_BASE_URL + '/' + file.url
        let a = document.createElement('a')
        a.setAttribute('id', 'openFile')
        a.setAttribute('href', url)
        a.setAttribute('target', '_blank')
        if (document.getElementById('openFile')) {
          document.body.removeChild(document.getElementById('openFile'))
        }
        document.body.appendChild(a)
        a.click()
      },
      //changePass-选择初审的审核结果，选择不通过时  复审默认为是
      changePass(val){
        switch(val){
          case '1':
            this.isPass = false
            break;
          case '0':
            this.isPass = true
            this.detailsList.auditAgainBtn = '1'
            break;
        }
      },
      // 打开收款详情弹窗
      openCollectDetails(json) {
        let data = JSON.parse(JSON.stringify(json));

        this.collectDetails.modal = true;
        this.collectDetails.loading = true;
        // 月结
        if (data.payment_method === 'monthly') {
          this.$api.receiptMonthlyReceipt({id: data.id})
            .then(res => {
              this.collectDetails.loading = false;
              if (res.code == 0) {
                this.collectDetails.data = res.data;
                this.collectDetails.data.order_sn = data.order_sn;
                this.collectDetails.data.receipt_submission_at = res.data.receipt_submission_at;
                this.judgeEmptyData();
              }
            })
        }

        // 现货现结
        if (data.payment_method === 'spot_cash') {
          this.$api.receiptCashReceiptView({id: data.id})
            .then(res => {
              this.collectDetails.loading = false;
              if (res.code == 0) {
                this.collectDetails.data = res.data;
                this.collectDetails.data.order_sn = data.order_sn;
                this.collectDetails.data.receivables_status = data.receivables_status;
                this.judgeEmptyData();
              }
            })
        }

        // 实销实结
        if (data.payment_method == 'real_sale') {
          this.$api.realSalesReceipt({id: data.id})
            .then(res => {
              this.collectDetails.loading = false;
              if (res.code == 0) {
                this.collectDetails.data = res.data;
                this.collectDetails.data.order_sn = data.order_sn;
                this.collectDetails.data.receivables_status = data.receivables_status;
                this.judgeEmptyData();
              }
            })
        }
      },
      judgeEmptyData() {
        if (this.collectDetails.data.orderReceivable !== undefined && this.collectDetails.data.orderReceivable.length == 0) {

          let item = {
            remittanceName: '',
            remittanceAccount: '',
            project: '',
            importMode: '',
            fileItems: [],
            importAccount: '',
            importAmount: '',
            importAt: '',
            remark: ''
          };
          this.collectDetails.data.orderReceivable.push(item)
        }
      },
      // 作废确认
      addModal() {
        if (!this.items.state) {
          return void this.$Message.warning('请选择确认作废！');
        }
        if (this.cancellation.value8 == '') {
          return void this.$Message.warning('请输入作废说明！');
        } else {
          let params = {};
          params.id = this.checkList[0].id;
          params.invalid_reason = this.cancellation.value8;
          this.$api.orderCancellation(params)
            .then(res => {
              if (res.code == 0) {
                this.$Message.success('作废成功');
                this.cancellation.modal = false;
                this.getList();
              }
            })
        }
      },
      CheckItem(item) {
        item.state = !item.state;
      },
      // 作废
      canCellation() {
        let checkList = this.checkList;
        if (checkList.length === 0) {
          return void this.$Message.warning('请选择！');
        } else if (checkList.length >= 2) {
          return void this.$Message.warning('只能选中一条！');
        }
        if (this.checkList[0].length === 0) {
          this.$Message.warning('请选择待作废的数据！');
          return false;
        }
        if (this.checkList[0].order_form_desc === '小程序') return this.$Message.error('小程序的补发订单无法作废');
        const receivables_status = this.checkList[0].receivables_status;
        const dispose_status = this.checkList[0].dispose_status;
        const order_form = this.checkList[0].order_form;
        if (receivables_status === 'paid' || order_form == 'MiniProgram' || receivables_status === 'receipt') {
          return void this.$Message.warning('该状态不可作废(已付款/已收款/小程序来源)，请重新选择');
        }
        this.cancellation.modal = true;
        return true;
      },
      // 检索审核状态
      findAuditStatus(json) {
        for (let i in this.statusList) {
          if (json == this.statusList[i].value) {
            return this.statusList[i].label;
          }
        }
      },

      // ------------------------------------------------
      // 补充0
      completeZero(n) {
        return n < 10 ? '0' + n : n;
      },

      // 时间戳转换为日期格式
      timestampToTime(timestamp) {
        if (timestamp) {
          let date = new Date(timestamp * 1000);// 时间戳为10位需*1000，时间戳为13位的话不需乘1000
          let Y = date.getFullYear() + '-';
          let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
          let D = this.completeZero(date.getDate()) + ' ';
          let h = this.completeZero(date.getHours()) + ':';
          let m = this.completeZero(date.getMinutes()) + ':';
          let s = this.completeZero(date.getSeconds());
          return Y + M + D + h + m + s;
        }
      },
      // ------------------------------------------------

      // 发货信息-发货方式 转化
      deliveryModeChange(status) {
        for (let i in this.deliveryModeList) {
          if (status == this.deliveryModeList[i].key) {
            return this.deliveryModeList[i].value;
          }
        }
      },
      // 判断发货方式
      judgeDeliveryMode(json) {
        if (!json || json === '') {
          return '暂无';
        } else {
          return this.deliveryModeList[json];
        }
      },
      init() {
        // 加载所有权
        this.$api.getOwnership().then(res => {
          this.ownershipList = res;
        });
        this.getList();
      },
      // 查询
      getList(name) {
        let params;
        this.loading = true;
        params = JSON.parse(JSON.stringify(this.search));
        if (name == 'search') {
          this.pageProps.page = 1
        }
        params.page = this.pageProps.page;
        params.perPage = this.pageProps.perPage;
        this.firstEntry ? this.firstEntry = !this.firstEntry : delete params.id_collect // fix:从首页进来之后再筛选数据查询不准确
        this.$api.orderReviewList(params)
          .then(res => {
            if (res.code === 0) {
              let data = res.data;
              this.reviewData = data.list;
              this.pageProps.totalCount = data.totalCount;
              this.pageProps.currentPage = data.currentPage;
              this.search.ownership = data.ownership;
              this.handleValidateDataPermissionRange(this, 'isGetDataPermissionRange', 'dataPermissionRange', data.ownership);
            }
          })
          .finally(() => {
            this.loading = false;
          });
      },
      // 获取被选中的列表
      selectCheck(selection) {
        this.checkList = selection;
      },
      // 通用打开弹窗
      openCommonModal(name) {
        let checkList = this.checkList;
        if (checkList.length === 0) {
          return void this.$Message.warning('请选择！');
        } else if (checkList.length >= 2) {
          return void this.$Message.warning('只能选中一条！');
        }
        this[name].modal = true;
        this.logTabs = 'details';
        return true;
      },
      // 申请退款 、 售后
      applyFor(remark) {
        let checkList = this.checkList;
        if (remark === 'refund') {
          if (checkList.length === 0) {
            return void this.$Message.warning('请选择！');
          } else if (checkList.length >= 2) {
            return void this.$Message.warning('只能选中一条！');
          }
          if (checkList[0].receivables_status !== 'paid' && checkList[0].receivables_status !== 'receipt') {
            return void this.$Message.warning('请选择已付款或已收款状态！');
          }
          this.$router.push({
            path: '/order-management/order-refund-apply',
            query: {id: checkList[0].id, type: 'review'}
          });
        } else if (remark === 'service') {
          if (checkList.length === 0) {
            return void this.$Message.warning('请选择！');
          } else if (checkList.length >= 2) {
            return void this.$Message.warning('只能选中一条！');
          }
          if (checkList[0].delivery_status !== 'delivery_finish') {
            return void this.$Message.warning('请选择已发货状态！');
          }
          this.$router.push({
            path: '/order-management/order-service-apply',
            query: {id: checkList[0].id, type: 'review'}
          });
        }
      },
      // 合同政策详情
      viewDetails(id) {
        // 初始化
        this.baseList = [];
        this.categoryList = [];
        this.productList = [];
        this.backPointList = [];
        this.giftList = [];
        this.policyDetailsList.modal = true;
        this.policyDetailsList.loading = true;
        this.$api.getContractPoliceDetail(id).then(res => {
          if (res.code === 0) {
            this.policyDetailsList.loading = false;
            this.policyDetailsList.data = res.data;
            // 循环所有折扣数组
            for (let i in this.policyDetailsList.data.contractPolicyDiscount) {
              let obj = this.policyDetailsList.data.contractPolicyDiscount[i];
              if (obj.discount_type === 'base') {
                // 基础折扣
                this.baseList.push(obj);
              } else if (obj.discount_type === 'category') {
                // 品类折扣
                this.categoryList.push(obj);
              } else if (obj.discount_type === 'product') {
                // 产品折扣
                this.productList.push(obj);
              } else if (obj.discount_type === 'back_point') {
                // 返点
                this.backPointList.push(obj);
              } else if (obj.discount_type === 'gift') {
                // 赠品
                this.giftList.push(obj);
              }
            }
            // 清除加载遮罩+显示弹窗
            this.policyDetailsList.loading = false;
            this.policyDetailsList.modal = true;
          }
        });
        this.detailId = id;
        // this.getLog();
      },
      // 启用状态转化
      formatIsOpen(isOpen) {
        return isOpen === '0' ? '否' : '是';
      },
      // 折扣比例转化
      formatProportion(num) {
        return num * 100 + '%';
      },
      cancel(name) {
        this[name].modal = false;
      },
      // 是否需要复审切换
      // changeAuditAgain(){
      //     this.detailsList.auditAgainBtn = this.detailsList.auditAgainBtn==='1'?"0":"1";
      // },
      // 初审
      tapAudit(reviewType) {
        this.detailsList.auditAgainBtn = '1';
        if (this.checkList.length === 0) {
          this.$Message.warning('请选择！');
          return false;
        }
        // 初审
        if (reviewType === 'dept' && this.checkList[0].status !== 'OrderWorkflow/auditPending') {
          this.$Message.warning('请选择待初审的数据！');
          return false;
        }
        // 复审
        if (reviewType === 'manager' && this.checkList[0].status !== 'OrderWorkflow/auditRecheckPending') {
          this.$Message.warning('请选择待复审的数据！');
          return false;
        }
        this.auditLogItems = [
          {created_by: '', created_at: ''},
          {created_by: '', created_at: ''}
        ];
        this.reviewType = reviewType;
        this.detailsList.data = [];
        this.auditList = {};
        let checkList = this.checkList;
        let isAction = this.openCommonModal('detailsList');
        this.modal = {
          title: '审核',
          status: 'audit'
        };
        if (!isAction) return;
        this.detailsList.loading = true;
        this.$api.orderReviewDetails(checkList[0].id)
          .then(res => {
            if (res.data) {
              this.detailsList.loading = false;
              this.detailsList.data = res.data;
              if (res.data.delivery === null || res.data.delivery === {}) {
              } else {
                this.detailsList.data.delivery_mode = res.data.delivery.delivery_mode;
              }
              for (let i in this.detailsList.data.auditLogItems) {
                this.auditLogItems[i] = this.detailsList.data.auditLogItems[i];
              }
              this.getAgreeDetail(this.detailsList.data.contract_policy_id);
            }
          });
      },
      // 关闭弹窗
      closeModal(name) {
        this[name].modal = false;
      },
      // 审核提交
      submitAudit() {
        let params = {};
        params.id = this.detailsList.data.id;
        params.is_pass = this.detailsList.data.is_pass;
        params.opinion = this.detailsList.data.opinion;
        if (params.is_pass === undefined || params.is_pass === '') {
          this.$Message.error('请选择审核状态！');
        } else {
          if (this.reviewType === 'dept') { // 初审
            if (this.detailsList.auditAgainBtn === '1') {
              params.is_review = 1;
              params.is_pass = Number(params.is_pass);
            } else {
              params.is_review = 0;
              params.is_pass = Number(params.is_pass);
            }
            this.$api.orderReviewManagerAudit(params).then(res => {
              if (res.code === 0) {
                this.$Message.success(res.message);
              } else {
                this.$Message.error(res.message);
              }
              this.detailsList.data = {};
              this.getList();
              this.detailsList.modal = false;
            });
          } else { // 复审
            this.$api.orderReviewDirectorAudit(params).then(res => {
              if (res.code === 0) {
                this.$Message.success(res.message);
              } else {
                this.$Message.error(res.message);
              }
              this.detailsList.data = {};
              this.getList();
              this.detailsList.modal = false;
            });
          }
        }
      },
      // 搜索用户列表
      queryUser(value) {
        this.loadingVisible = true;
        this.$api.user({username: value})
          .then(res => {
            this.loadingVisible = false;
            if (res.data !== 0) {
              this.userList = res.data;
            }
          });
      },
      // 转换时间格式
      formatDate(time, json) {
        if (json === 'ymd') {
          return this.$format(time, 'yyyy-MM-dd ');
        } else {
          return this.$format(time, 'yyyy-MM-dd hh:mm');
        }
      },
      changePage(e) {
        this.pageProps.page = e;
        this.getList();
      },
      changePageSize(e) {
        this.pageProps.perPage = e;
        this.getList();
      },
      // 操作栏的编辑
      handleEdit(id) {
        this.$router.push({
          path: '/order-management/review-edit',
          query: {id: id}
        });
      },
      // 删除信息
      handleDelete(id) {
        this.$api.orderReviewDelete(id)
          .then(res => {
            if (res.code == 0) {
              this.$Message.success(res.message);
              this.getList();
            }
          });
      },
      // 获取合同政策
      getAgreeDetail(id) {
        this.agreementDetailLoading = true;
        this.$api.getContractPoliceDetail(id)
          .then(res => {
            this.agreementDetailLoading = false;
            if (res.code === 0) {
              let giftArr = res.data.giftDiscount.sort(function (a, b) {
                return a.starting_amount - b.starting_amount;
              });
              let result = [];
              giftArr.forEach((item) => {
                let findResult = result.find(resultItem => resultItem.starting_amount === item.starting_amount);
                if (findResult) {
                  findResult.list.push(item);
                } else {
                  result.push({starting_amount: item.starting_amount, list: [item]});
                }
              });
              res.data.giftArr = result;
              this.agreementDetail = res.data;
            }
          });
      },
      goReplacement() { // 跳转添加补发订单
        let checkList = this.checkList;
        if (checkList.length === 0) {
          return void this.$Message.warning('请选择！');
        } else if (checkList.length >= 2) {
          return void this.$Message.warning('只能选中一条！');
        } else if (checkList[0].status != 'OrderWorkflow/auditRecheckPass') {
          this.$Message.error("复审未通过")
        } else {
          this.$router.push({
            path: '/order-management/review-replacement-edit',
            query: {
              origin_id: checkList[0].id
            }
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
        let params = this.exportData.data;
        this.exportData.loading = true;
        this.$api.orderExport(params).then((res) => {
          if (res.code === 0) {
            window.location.href = res.data.url;
            this.exportData.modal = false
          }
        }).finally(() => {
          this.exportData.loading = false
        })
      },
      openPolicyDetail() {
        this.$refs.policyDetail.getAgreeDetail(this.detailsList.data.contract_policy_id)
      },

      /**
       * 订单 - 处理
       */
      handleShowDealModal() {
        this.dealModal.modal = true;
      },
    },
    activated () {
        const companyName = this.$route.query.companyName
        !!companyName && (this.search.merchant_name = companyName)
        let status = this.$route.query.status||'';
        if (status) {
          this.search.status = status;
        }else{
          this.search.status = '';
        }
        let idCollect=this.$route.query.id_collect||'';
        if(idCollect){
          this.search.id_collect = idCollect;
        }else{
          this.search.id_collect = '';
        }
        this.init();
        // 加载所有权
        this.$api.getOwnership().then(res => {
          this.ownershipList = res;
      });

    },
    watch:{
      $route:{
        deep: true,
        handler:function(newVal,oldVal){
          if(oldVal.name == newVal.name && Object.keys(newVal.query)){
              this.search = {} 
              this.getList()
          }
        }
      }
    }
  };
</script>

<style lang="less" scoped>
  .collection-modal /deep/ .ivu-modal-body {
    height: 600px;
    overflow: hidden;
    overflow-y: auto;
  }

  .ivu-input::-webkit-input-placeholder, .ivu-select-single .ivu-select-selection .ivu-select-placeholder {
    color: rgb(130, 130, 130);
  }

  .ivu-input, .ivu-select-selection {
    border: 1px solid rgb(184, 184, 184);
    color: #000;

  }

  .ivu-date-picker {
    width: 100%;
    
  }

  .breadth {
    width: 58px;
    height: 58px;
    line-height: 58px;
    float: left;
  }

  .ivu-upload-list {
    display: inline-block;
  }

  .ivu-upload-drag {
    width: 58px;
    display: inline-block;
    margin-top: 5px
  }

  .ivu-upload-list-file {
    float: left;
  }

  #printModal p {
    line-height: 1.8;
  }

  #printModal .ivu-table-wrapper {
    border-color: #495060;

    .ivu-table-border:before, .ivu-table-border:after {
      background-color: #495060;
    }

    td {
      border-right: 1px solid #495060;
      border-bottom: 1px solid #495060;
    }
  }

  .ivu-table-border {
    overflow: visible
  }

  .verification {
    overflow: hidden;
    margin-bottom: 0;
    height: 100%;
  }

  .verification .ivu-form-item-content, .verification .ivu-date-picker-rel {
    height: 100%;
  }

  .receiveDetailList a {
    width: 60px;
    height: 60px;
    display: block;
  }

  #collect-goods .ivu-modal-content {
    left: 5%
  }

  #collect-goods .ivu-table-cell:last-child {
    padding-left: 7px
  }

  .ivu-table-cell
  .new {
    background: url(../../assets/images/new.png) no-repeat center center;
    background-size: 100%;
  }

  @media screen and (max-width: 640px ) {
    #opts button {
      margin-bottom: 5px;
    }

    .ivu-col-span-3 {
      width: 200px;
      margin-bottom: 5px;
    }
  }

  .review-list .ivu-table-cell {
    padding-left: 0px;
    padding-right: 0px;
  }

  // 作废
  .msg {
    display: flex;
    padding-top: 10px;

    .remark {
      padding-top: 10px;
      color: red;
    }

    .inputClass {
      vertical-align: middle;
      margin-top: -2;
      margin-bottom: 2px;
      margin-left: 10px;
      
    }
  }

</style>
<style lang="less">
  .sub-col ul li {
    list-style: none;
    padding-top: 4px;
    padding-bottom: 4px;
  }

  .remark-input > input {
    text-align: center;
    border: 0;
    outline: none;
    width: 500px;
  }
   
</style>
