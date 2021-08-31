<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-15 10:45:21
 * @LastEditTime: 2020-12-14 14:11:21
 * @LastEditors: Please set LastEditors
 -->
<template>
    <div>
        <Card>
            <Row slot="title">
                <Col :sm="24">
                <Form ref="search" :model="search" class="search">
                    <FormItem>
                        <Select class="mb-5" v-model="search.ownership" placeholder="数据权限范围" @on-change="getList('search')">
                          <Option v-for="(item, index) in dataPermissionRange" :value="item.value" :label="item.label" :key="'dataPer' + index"></Option>
                        </Select>
                    </FormItem>
                    <FormItem>
                        <Input v-model="search.policy_name" placeholder="政策名称" clearable @keydown.native.enter.prevent="getList('search')"></Input>
                    </FormItem>
                    <FormItem>
                        <Select v-model="search.policyStatus" placeholder="政策状态" @on-change="getList('search')">
                            <Option v-for="(item, index) in policyStatusOptions" :value="item.value" :label="item.label" :key="`policyStatus${index}`"></Option>
                        </Select>
                    </FormItem>
                    <FormItem>
                        <Select v-model="search.status" placeholder="审核状态" @on-change="getList('search')">
                            <Option v-for="item in statusList" :value="item.key" :key="item.key" :label="item.value"></Option>
                        </Select>
                    </FormItem>
                    <FormItem style="float: right;">
                        <Button type="primary" icon="md-search" style="padding: 4px 15px" @click="getList('search')">查询</Button>
                        <Button icon="md-repeat" style="padding: 4px 15px" @click="handleReset('search')">重置</Button>
                    </FormItem>
                </Form>
                </Col>
                <Col :sm="24">
                    <router-link to="/policy/policy-edit">
                        <Button type="primary" v-permission="'/v2/contract-policy/create'">编辑</Button>
                    </router-link>
                    <router-link to="/policy/policy-add">
                        <Button type="primary" v-permission="'/v2/contract-policy/create'">添加</Button>
                    </router-link>
                    <!-- <Button type="primary" @click="viewDetails('', 'audit');" v-permission="'/v2/contract-policy/audit'">审核</Button> -->
                    <Button type="primary" @click="handleClickButton('audit')" v-permission="'/v2/contract-policy/audit'">审核</Button>
                    <!-- <Button type="primary" @click="viewEnables();" v-permission="'/v2/contract-policy/start-using'">启用</Button> -->
                    <Button type="primary" @click="handleClickButton('disOrEnable')" v-permission="'/v2/contract-policy/start-using'">启用/禁用</Button>
                    <Progress v-show="isShowProgress" :percent="percentProgress"></Progress>
                </Col>
            </Row>
            <Row class="margin-top-10"  style="clear: both;">
                <Table :columns="columns" :data="data" border  :loading="loading" @on-selection-change="selectCheck" size="small">
                    <!-- 操作 -->
                    <template slot-scope="{ row }" slot="action">
                        <Tooltip placement="top" content="编辑" transfer>
                            <Button type="primary" size="small" @click="handleEdit(row.id, row)" v-permission="'/v2/contract-policy/update'">
                                <Icon type="md-create" />
                            </Button>
                        </Tooltip>
                        <Poptip confirm title="您确认删除这条内容吗？" @on-ok="handleDelete(row.id, row)" transfer>
                            <Button size="small" v-permission="'/v2/contract-policy/delete'">
                                <Icon type="md-trash" />
                            </Button>
                        </Poptip>
                    </template>
                </Table>
                <div style="margin: 10px;overflow: hidden">
                    <div class="pages-L">共 {{pageProps.totalCount}} 条</div>
                    <div style="float: right;">
                        <Page size="small" :total="pageProps.totalCount" :current="pageProps.currentPage" show-sizer show-elevator @on-change="changePage" @on-page-size-change="changePageSize"></Page>
                    </div>
                </div>
            </Row>
        </Card>
        <Modal v-model="detailsList.modal" title="审核详情" width="900">
            <div class="rel">
                <!-- 订单详情 start -->
                <div class="ivu-table-wrapper">
                    <div class="ivu-table ivu-table-small ivu-table-border">
                        <div class="ivu-table-body">
                            <table cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tbody class="ivu-table-tbody">
                                <tr class="ivu-table-row">
                                    <td class="head-bg">
                                        <div class="ivu-table-cell">政策名称</div>
                                    </td>
                                    <td>
                                        <div class="ivu-table-cell">
                                            <span v-text="detailsList.data.policy_name" class="policy-detail" @click="viewDetails(checkList.id, 'detail')"></span>
                                        </div>
                                    </td>
                                    <td class="head-bg">
                                        <div class="ivu-table-cell">政策类型</div>
                                    </td>
                                    <td>
                                        <div class="ivu-table-cell">
                                            <!-- <span v-text="detailsList.data.policy_type"></span> -->
                                            <span v-text="detailsList.data.policy_type == 'yes' ? '活动' : '非活动'"></span>
                                        </div>
                                    </td>
                                </tr>
                                <tr class="ivu-table-row">
                                    <td class="head-bg">
                                        <div class="ivu-table-cell">启用</div>
                                    </td>
                                    <td>
                                        <div class="ivu-table-cell">
                                            <span v-text="formatIsOpen(detailsList.data.is_open)"></span>
                                        </div>
                                    </td>
                                    <td class="head-bg">
                                        <div class="ivu-table-cell">有效期</div>
                                    </td>
                                    <td>
                                        <div class="ivu-table-cell">
                                            <span v-text="formatDate(detailsList.data.deadline_at)"></span>
                                        </div>
                                    </td>
                                </tr>
                                <tr class="ivu-table-row">
                                    <td class="head-bg">
                                        <div class="ivu-table-cell">创建人</div>
                                    </td>
                                    <td>
                                        <div class="ivu-table-cell">
                                            <span v-text="detailsList.data.created_by"></span>
                                        </div>
                                    </td>
                                    <td class="head-bg">
                                        <div class="ivu-table-cell">创建时间</div>
                                    </td>
                                    <td>
                                        <div class="ivu-table-cell">
                                            <span v-text="formatDate(detailsList.data.created_at)"></span>
                                        </div>
                                    </td>
                                </tr>
                                <tr class="ivu-table-row">
                                    <td class="head-bg">
                                        <div class="ivu-table-cell">审核人</div>
                                    </td>
                                    <td>
                                        <div class="ivu-table-cell">
                                            <span v-text="detailsList.data.reviewer"></span>
                                        </div>
                                    </td>
                                    <td class="head-bg">
                                        <div class="ivu-table-cell">是否通过</div>
                                    </td>
                                    <td>
                                        <div class="ivu-table-cell">
                                            <RadioGroup v-model="detailsList.is_pass">
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
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <Spin v-show="detailsList.loading" :fix="true" size="large"></Spin>
            </div>
            <div slot="footer">
                <Button type="default" @click="closeModal('detailsList')">取消</Button>
                <Button type="primary" @click="auditItem">提交</Button>
            </div>
        </Modal>
        <Modal v-model="disabledOrEnableObj.modal" title="启用/停用">
            <h3 style="text-align: center;">{{`确认${disabledOrEnableObj.is_open ? '启用' : '停用'}政策`}}</h3>
            <div slot="footer">
              <Button @click="closeModal('disabledOrEnableObj')">取消</Button>
              <Button type="primary" :loading="disabledOrEnableObj.onLoading" @click="disabledOrEnablePolicy(disabledOrEnableObj.is_open)">确定</Button>
            </div>
        </Modal>
        <Modal v-model="policyDetailList.modal" title="合同政策详情" width="1050">
            <div class="policyDetailList-wrap">
                <div class="ivu-table-wrapper">
                    <div class="ivu-table ivu-table-small ivu-table-border">
                        <div class="ivu-table-body">
                            <table cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tbody class="ivu-table-tbody">
                                <tr class="ivu-table-row">
                                    <td class="head-bg">
                                        <div class="ivu-table-cell">政策名称</div>
                                    </td>
                                    <td colspan="3">
                                        <div class="ivu-table-cell">
                                            <span v-text="policyDetailList.data.policy_name"></span>
                                        </div>
                                    </td>
                                </tr>
                                <tr class="ivu-table-row">
                                    <td class="head-bg">
                                        <div class="ivu-table-cell">启用</div>
                                    </td>
                                    <td colspan="3">
                                        <div class="ivu-table-cell">
                                            <span v-text="formatIsOpen(policyDetailList.data.is_open)"></span>
                                        </div>
                                    </td>
                                </tr>
                                <tr class="ivu-table-row">
                                    <td class="head-bg">
                                        <div class="ivu-table-cell">创建人</div>
                                    </td>
                                    <td>
                                        <div class="ivu-table-cell">
                                            <span v-text="policyDetailList.data.created_by"></span>
                                        </div>
                                    </td>
                                    <td class="head-bg">
                                        <div class="ivu-table-cell">创建时间</div>
                                    </td>
                                    <td>
                                        <div class="ivu-table-cell">
                                            <span v-text="formatDate(policyDetailList.data.created_at)"></span>
                                        </div>
                                    </td>
                                </tr>
                                <tr class="ivu-table-row">
                                    <td class="head-bg">
                                        <div class="ivu-table-cell">审核人</div>
                                    </td>
                                    <td>
                                        <div class="ivu-table-cell">
                                            <span v-text="policyDetailList.data.reviewer"></span>
                                        </div>
                                    </td>
                                    <td class="head-bg">
                                        <div class="ivu-table-cell">审核时间</div>
                                    </td>
                                    <td>
                                        <div class="ivu-table-cell">
                                            <span v-text="formatDate(policyDetailList.data.audit_at)"></span>
                                        </div>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="detailsList-title" v-if="policyDetailList.data.regularProductInfo.length>0">适用商品</div>
                <div class="ivu-table-wrapper" v-if="policyDetailList.data.regularProductInfo.length>0">
                    <div class="ivu-table ivu-table-small ivu-table-border">
                        <div class="ivu-table-body">
                            <table cellspacing="0" cellpadding="0" border="0" width="100%">
                              <tbody class="ivu-table-tbody">
                                <tr class="ivu-table-row">
                                    <td class="head-bg">
                                        <div class="ivu-table-cell">商品类目</div>
                                    </td>
                                    <td class="head-bg">
                                        <div class="ivu-table-cell">数量</div>
                                    </td>
                                    <td class="head-bg">
                                        <div class="ivu-table-cell">操作</div>
                                    </td>
                                </tr>
                                <tr class="ivu-table-row" v-for="(item,index) in policyDetailList.data.regularProductInfo" :key="index+'regularProductInfo'">
                                 
                                    <td>
                                        <div class="ivu-table-cell">
                                            <span v-text="item.category_name"></span>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="ivu-table-cell">
                                            <span v-text="item.count"></span>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="ivu-table-cell">
                                            <span @click="seeRegularProductInfo(item.policy_id,item.category_id)" style="color:#169bd5;cursor:pointer">查看详情</span>
                                        </div>
                                    </td>
                                </tr>
                              </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="detailsList-title" v-if="policyDetailList.data.baseDiscount.length>0">基础折扣设置</div>
                <div class="ivu-table-wrapper" v-if="policyDetailList.data.baseDiscount.length>0">
                    <div class="ivu-table ivu-table-small ivu-table-border">
                        <div class="ivu-table-body">
                            <table cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tbody class="ivu-table-tbody">
                                <tr class="ivu-table-row" v-for="(item, index) in policyDetailList.data.baseDiscount" :key="'base' + index">
                                    <td class="head-bg">
                                        <div class="ivu-table-cell">梯度折扣</div>
                                    </td>
                                    <td>
                                        <div class="ivu-table-cell">
                                            <span v-text="formatProportion(item.proportion)"></span>
                                        </div>
                                    </td>
                                    <td class="head-bg">
                                        <div class="ivu-table-cell">应收金额</div>
                                    </td>
                                    <td>
                                        <div class="ivu-table-cell">
                                            <span v-text="item.starting_amount"></span>
                                        </div>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="detailsList-title" v-if="policyDetailList.data.categoryDiscount.length>0">品类折扣设置</div>
                <div class="ivu-table-wrapper" v-if="policyDetailList.data.categoryDiscount.length>0">
                    <div class="ivu-table ivu-table-small ivu-table-border">
                        <div class="ivu-table-body">
                            <table cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tbody class="ivu-table-tbody">
                                <template v-for="(item,index) in policyDetailList.data.categoryDiscount">
                                    <div :key="index">
                                    <tr class="ivu-table-row">
                                        <td class="head-bg">
                                            <div class="ivu-table-cell">折扣</div>
                                        </td>
                                        <td>
                                            <div class="ivu-table-cell">
                                                <span v-text="formatProportion(item.proportion)"></span>
                                            </div>
                                        </td>
                                        <td class="head-bg">
                                            <div class="ivu-table-cell">选择品类</div>
                                        </td>
                                        <td>
                                            <div class="ivu-table-cell">
                                                <span v-text="item.name"></span>
                                            </div>
                                        </td>
                                    </tr>
                                    </div>
                                </template>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="detailsList-title" v-if="policyDetailList.data.productDiscount.length>0">单品折扣设置</div>
                <div class="ivu-table-wrapper" v-if="policyDetailList.data.productDiscount.length>0">
                    <div class="ivu-table ivu-table-small ivu-table-border">
                        <div class="ivu-table-body">
                            <table cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tbody class="ivu-table-tbody">
                                <template v-for="(item) in policyDetailList.data.productDiscount">
                                    <div :key="item.id">
                                    <tr class="ivu-table-row">
                                        <td class="head-bg">
                                            <div class="ivu-table-cell">{{ item.object_name === "discount" ?"折扣":'单价'}}</div>
                                        </td>
                                        <td>
                                            <div class="ivu-table-cell">
                                                <span v-if="item.object_name === 'discount'" v-text="formatProportion(item.proportion)"></span>
                                                <span v-else v-text="(item.direct_price)"></span>
                                            </div>
                                        </td>
                                        <td class="head-bg">
                                            <div class="ivu-table-cell">选择产品</div>
                                        </td>
                                        <td>
                                            <div class="ivu-table-cell">
                                                <span v-text="item.name"></span>
                                            </div>
                                        </td>
                                    </tr>
                                    </div>
                                </template>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="detailsList-title" v-if="policyDetailList.data.backPointDiscount.length>0">返点设置</div>
                <div class="ivu-table-wrapper" v-if="policyDetailList.data.backPointDiscount.length>0">
                    <div class="ivu-table ivu-table-small ivu-table-border">
                        <div class="ivu-table-body">
                            <table cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tbody class="ivu-table-tbody">
                                <tr class="ivu-table-row" v-for="(item,index) in policyDetailList.data.backPointDiscount" :key="index">
                                    <td class="head-bg">
                                        <div class="ivu-table-cell">返点比例</div>
                                    </td>
                                    <td>
                                        <div class="ivu-table-cell">
                                            <span v-text="formatProportion(item.proportion)"></span>
                                        </div>
                                    </td>
                                    <td class="head-bg">
                                        <div class="ivu-table-cell">返点应收金额</div>
                                    </td>
                                    <td>
                                        <div class="ivu-table-cell">
                                            <span v-text="item.starting_amount"></span>
                                        </div>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="detailsList-title" v-if="policyDetailList.data.repurchaseArr && policyDetailList.data.repurchaseArr.length>0">换购设置</div>
                <div class="ivu-table-wrapper" v-if="policyDetailList.data.repurchaseArr && policyDetailList.data.repurchaseArr.length>0">
                    <div class="ivu-table ivu-table-small ivu-table-border">
                        <div class="ivu-table-body">
                            <table cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tbody v-for="(items, index) in policyDetailList.data.repurchaseArr" :key="index">
                                    <tr class="ivu-table-row">
                                        <td class="head-bg">
                                            <div class="ivu-table-cell">
                                                <span>满足应收金额</span>
                                            </div>
                                        </td>
                                        <td colspan="8">
                                            <div class="ivu-table-cell">
                                                <span>{{items.starting_amount}}</span>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr class="ivu-table-row" v-for="(item, i) in items.list" :key='i'>
                                        <td class="head-bg">
                                            <div class="ivu-table-cell">
                                                <span>类型</span>
                                            </div>
                                        </td>
                                        <td colspan="2">
                                            <div class="ivu-table-cell">
                                                <span>{{item.object_name==='product'?'商品':item.object_name==='category'?'类目':item.object_name}}</span>
                                            </div>
                                        </td>
                                        <td class="head-bg">
                                            <div class="ivu-table-cell">
                                                <span>换购产品</span>
                                            </div>
                                        </td>
                                        <td colspan="2">
                                            <div class="ivu-table-cell">
                                                <span>{{item.name}}</span>
                                            </div>
                                        </td>
                                        <td class="head-bg">
                                            <div class="ivu-table-cell">
                                                <span>换购折扣</span>
                                            </div>
                                        </td>
                                        <td colspan="2">
                                            <div class="ivu-table-cell">
                                                <span>{{formatProportion(item.proportion)}}</span>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="detailsList-title" v-if="policyDetailList.data.matchingArr && policyDetailList.data.matchingArr.length>0">配赠设置</div>
                <div class="ivu-table-wrapper" v-if="policyDetailList.data.matchingArr && policyDetailList.data.matchingArr.length>0">
                    <div class="ivu-table ivu-table-small ivu-table-border">
                        <div class="ivu-table-body">
                          <table cellspacing="0" cellpadding="0" border="0" width="100%">
                              <tbody v-for="(items, index) in policyDetailList.data.matchingArr" :key="index">
                                  <tr class="ivu-table-row">
                                      <td class="head-bg">
                                          <div class="ivu-table-cell width-108">
                                              <span>配赠应收金额</span>
                                          </div>
                                      </td>
                                      <!-- <td colspan="5"> -->
                                      <td colspan="8">
                                          <div class="ivu-table-cell">
                                              <span>{{items.starting_amount}}</span>
                                          </div>
                                      </td>
                                  </tr>
                                  <tr class="ivu-table-row" v-for="(item, i) in items.present" :key='i'>
                                    
                                      <td class="head-bg">
                                          <div class="ivu-table-cell">
                                              <span>配赠比例</span>
                                          </div>
                                      </td>
                                      <td colspan="2">
                                          <div class="ivu-table-cell">
                                              <span>{{item.matching_molecule + ':' + item.matching_denominator + '赠'}}</span>
                                          </div>
                                      </td>
                                      <td colspan="6" style="padding:0">
                                        <div  v-for="(itemk, i) in item.content" :key="itemk + i +'content'">
                                          <div class="mathch-product">
                                            <div class=" width-110 head-bg" style="">购买产品</div>
                                            <div class="product-items">{{itemk.condition_type === 'category' ? '类目':'商品'}} {{itemk.condition_name}}</div>
                                            <div class="width-110 head-bg">配赠产品</div>
                                            <div class="product-items">
                                              <span>{{itemk.object_name==='product'?'商品':itemk.object_name==='category'?'类目':itemk.object_name}}</span>
                                              <span>{{itemk.name}}</span>
                                            </div>
                                          </div>
                                        </div>
                                      </td>
                                  </tr>
                              </tbody>
                          </table>
                        </div>
                    </div>
                </div>
                <div class="detailsList-title" v-if="policyDetailList.data.reductionArr && policyDetailList.data.reductionArr.length>0">满减设置</div>
                <div class="ivu-table-wrapper" v-if="policyDetailList.data.reductionArr && policyDetailList.data.reductionArr.length>0">
                    <div class="ivu-table ivu-table-small ivu-table-border">
                        <div class="ivu-table-body">
                            <table cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tbody v-for="(items, index) in policyDetailList.data.reductionArr" :key="index">
                                    <tr class="ivu-table-row">
                                        <td class="head-bg">
                                            <div class="ivu-table-cell">
                                                <span>满足应收金额</span>
                                            </div>
                                        </td>
                                        <td colspan="5">
                                            <div class="ivu-table-cell">
                                                <span>{{items.starting_amount}}</span>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr class="ivu-table-row" v-for="(item, i) in items.list" :key='i'>
                                        <td class="head-bg">
                                            <div class="ivu-table-cell">
                                                <span>直接优惠金额</span>
                                            </div>
                                        </td>
                                        <td colspan="2">
                                            <div class="ivu-table-cell">
                                                <span>{{item.discount_amount}}</span>
                                            </div>
                                        </td>
                                        <td class="head-bg">
                                            <div class="ivu-table-cell">
                                                <span>整单折扣</span>
                                            </div>
                                        </td>
                                        <td colspan="2">
                                            <div class="ivu-table-cell">
                                                <span>{{formatProportion(item.proportion)}}</span>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="detailsList-title" v-if="policyDetailList.data.giftArr && policyDetailList.data.giftArr.length>0">满赠设置</div>
                <div class="ivu-table-wrapper" v-if="policyDetailList.data.giftArr && policyDetailList.data.giftArr.length>0">
                    <div class="ivu-table ivu-table-small ivu-table-border">
                        <div class="ivu-table-body">
                            <table cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tbody v-for="(items, index) in policyDetailList.data.giftArr" :key="index">
                                    <tr class="ivu-table-row">
                                        <td class="head-bg">
                                            <div class="ivu-table-cell">
                                                <span>满足应收金额</span>
                                            </div>
                                        </td>
                                        <td colspan="8">
                                            <div class="ivu-table-cell">
                                                <span>{{items.starting_amount}}</span>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr class="ivu-table-row" v-for="(item, i) in items.list" :key='i'>
                                        <td class="head-bg">
                                            <div class="ivu-table-cell">
                                                <span>类型</span>
                                            </div>
                                        </td>
                                        <td colspan="2">
                                            <div class="ivu-table-cell">
                                                <span>{{item.object_name==='product'?'商品':item.object_name==='category'?'类目':item.object_name}}</span>
                                            </div>
                                        </td>
                                        <td class="head-bg">
                                            <div class="ivu-table-cell">
                                                <span>赠品</span>
                                            </div>
                                        </td>
                                        <td colspan="2">
                                            <div class="ivu-table-cell">
                                                <span>{{item.name}}</span>
                                            </div>
                                        </td>
                                        <td class="head-bg">
                                            <div class="ivu-table-cell">
                                                <span>赠送数量</span>
                                            </div>
                                        </td>
                                        <td colspan="2">
                                            <div class="ivu-table-cell">
                                                <span>{{item.number}}</span>
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
                <Button type="primary" @click="policyDetailList.modal=false">知道了</Button>
            </div>
        </Modal>
        
        <!-- 适用商品的详情 -->
        <Modal v-model="regularProductInfo" title="适用商品明细" width='800' :closable="false">
          
        <Table :columns="apply.column" :data="apply.data" border ></Table>
        </Modal>

        <!-- 审核 -->
        <policyAuditModal
          :data="policyModalObj.data"
          :show="policyModalObj.show"
          :title="policyModalObj.title"
          :hide-auditer="policyModalObj.hideAuditer"
          :spin-loading="policyModalObj.spinLoading"
          @on-ok="handleOnOkAuditPolicy"
          @on-cancel="handleOnCancelAuditPolicy"
          @on-show-detail="handleOnShowSuitGoodsDetail">
        </policyAuditModal>
    </div>
</template>

<script>
import globalMixin from '~/plugins/mixin'
import policyAuditModal from './components/policy-audit-modal.vue'
export default {
    name: 'policy',
    components: {
      policyAuditModal
    },
    mixins: [globalMixin],
    data () {
        return {
            showAuditModal: false,
            policyModalObj: { // 审核 / 供货政策详情模态窗 集合
              show: false,
              title: '审核',
              hideAuditer: false,
              spinLoading: false,
              data: {},
            },
            apply: {
              column: [
                { type: 'index', title: '序号', width: 65, align: 'center' },
                { key: 'product_name', title: '商品名称', minWidth: 200, align: 'center' },
                { key: 'policy_price', title: '政策价格', minWidth: 200, align: 'center' },
                { key: 'min_quantity', title: '起订量', minWidth: 100, align: 'center' },
                { key: 'is_required', title: '必选', minWidth: 100, align: 'center' , 
                    render: (h, params) => {
                      return h('div',params.row.is_required === '1' ? [h('Icon',{
                        props:{
                          type:'md-checkmark'
                        },
                        style:{
                          padding:'4px',
                          color:'#45cf2c',
                          fontSize:'18px',
                          fontWeight:700
                        }
                        })] : [h('Icon',{
                          props:{
                            type:'md-close'
                          },
                          style:{
                            padding:'4px',
                            color:'#ff5566',
                            fontSize:'18px',
                            fontWeight:700
                          }
                      })])
                    } 
                },
              ],
            },
            //s适用商品详情
            regularProductInfo: false,
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
            detailId: '', // 详情弹窗id
            loadingVisible: false,
            detail: false,
            search: {
              ownership: 'company'
            },
            ownershipList: [],
            statusList: [
                {key: 'ContractPolicyWorkFlow/auditPending', value: '待审核'},
                {key: 'ContractPolicyWorkFlow/auditPass', value: '审核通过'},
                {key: 'ContractPolicyWorkFlow/auditFailure', value: '审核不通过'}
            ],
            policyStatusOptions: [ // 政策状态
              { value: '草稿', label: '草稿' },
              { value: '在用', label: '在用' },
              { value: '停用', label: '停用' },
              { value: '到期', label: '到期' },
            ],
            checkList: [],
            columns: [
                { type: 'selection', width: 60, align: 'center' },
                { type: 'index', title: '序号', width: 65, align: 'center' },
                {
                    key: 'policyName',
                    title: '政策名称',
                    minWidth: 200,
                    sortable: true,
                    align: 'center',
                    render: (h, params) => {
                        return h('a', {
                            on: {
                                click: () => {
                                    // this.viewDetails(params.row.id, 'detail');
                                    this.handleShowPolicyModal('detail', params.row.id)
                                }
                            }
                        }, params.row.policyName);
                    }
                },
                {
                    key: 'isOpen',
                    title: '启用状态',
                    width: 120,
                    sortable: true,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', this.formatIsOpen(params.row.isOpen));
                    }
                },
                { key: 'createdBy', title: '创建人', minWidth: 100, sortable: true, align: 'center' },
                {
                    key: 'createdAt',
                    title: '创建时间',
                    minWidth: 120,
                    sortable: true,
                    align: 'center',
                    // render: (h, params) => {
                    //     return h('div', this.formatDate(params.row.created_at));
                    // }
                },
                {
                    key: 'policyStatus',
                    title: '政策状态',
                    minWidth: 120,
                    align: 'center',
                },
                {   
                    key: 'status',
                    title: '审核状态',
                    width: 150,
                    align: 'center',
                },
                // {
                //     key: 'policyType',
                //     title: '政策类型',
                //     width: 100,
                //     align: 'center',
                // },
                {
                    key: 'policyValidity',
                    title: '有效截止日期',
                    // title: '政策有效期',
                    width: 110,
                    align: 'center'
                },
                { key: 'action', title: '操作', width: 150, align: 'center', slot: 'action' }
            ],
            data: [],
            loading: false,
            // 列表分页属性
            pageProps: {
                page: 1,
                perPage: 10,
                currentPage: 1,
                totalCount: 0
            },
            percentProgress: 0,
            isShowProgress: false,
            detailsList: {
                modal: false,
                data: [],
                loading: true,
                showAuditDetail: false,
                is_pass: ''
            },
            policyDetailList: {
                modal: false,
                data: {
                    baseDiscount: [],
                    categoryDiscount: [],
                    productDiscount: [],
                    backPointDiscount: [],
                    giftDiscount: [],
                    regularProductInfo:[]
                }
            },
            disabledOrEnableObj: {
                modal: false,
                is_open: 0,
                onLoading: false,
            },
            modalType: '',
            policyNameLists: [],
            policyNameLoading: false
        };
    },
    methods: {
        init () {
            this.pageProps.page = 1;
            this.pageProps.perPage = 10;
            this.getList();
            // 加载所有权
            this.$api.getOwnership().then(res => {
                this.ownershipList = res;
            });
        },

        /**
         * 启用/禁用 请求API
         * @param {String} is_open: 启用/禁用标识： 1 -> 启用  0 -> 停用
         */
        async disabledOrEnablePolicy(is_open) {
          let [ { id } ] = this.checkList
          this.disabledOrEnableObj.onLoading = true
          // to-do: 启用API
          try {
            let res = await this.$api.contractPoliceEnable({id, is_open})
            if (res.code === 0) {
              this.getList()
              this.$Message.success(`${is_open ? '启用' : '停用'}成功!`)
              this.disabledOrEnableObj.onLoading = false
              this.disabledOrEnableObj.modal = false
            }
          } catch (error) {
            this.disabledOrEnableObj.onLoading = false
          }
        },

        // 搜索
        getList () {
            this.loading = true;
            let params = this.search;
            params.page = this.pageProps.page;
            params.perPage = this.pageProps.perPage;
            params.product_type = '1';
            for (let i in params) {
                if (!params[i]) delete params[i];
            }
            params.id = '';
            this.$api.contractPoliceListv2(params)
                .then(res => {
                    if (res.code === 0) {
                        let data = res.data;
                        this.data = data.list;
                        this.pageProps.totalCount = data.totalCount;
                        this.pageProps.currentPage = data.currentPage;
                        this.search.ownership = data.ownership;
                        this.handleValidateDataPermissionRange(this, 'isGetDataPermissionRange', 'dataPermissionRange', data.ownership);
                    }
                })
                .finally(() => {
                    this.loading = false;
                })
        },
        // 重置
        handleReset (name) {
            this.search = {};
            this.getList();
        },
        
        //适用商品查看详情
        seeRegularProductInfo(id,cateId){
          this.$api.getCategoryList({id: id,categoryId:cateId}).then(res => {
              if(res){
                this.regularProductInfo = true
                let { data } = res
                this.apply.data = data
              }
            })
        },
        // 单品详情
        viewDetails (id, type) {
            this.modalType = type || '';
            if (this.modalType === 'audit') { // 审核
                this.detailsList.is_pass = '';
                this.detailsList.opinion = '';
                if (!this.checkList.length) {
                    this.$Message.warning('请选择！');
                    return false;
                }
                id = this.checkList[0].id;
                let status = this.checkList[0].status;
                if (status !== '待审核') {
                    this.$Message.warning('非待审核状态不能进行审核');
                    return false;
                }
                this.detailsList.loading = true;
                this.detailsList.modal = true;
            } else if (this.modalType === 'detail') {
                this.policyDetailList.modal = true;
            }
            this.$api.getContractPoliceDetailv2(id).then(res => {
                if (res.code === 0) {
                    res.data.giftArr = this.formatActivity(res.data.giftDiscount, 'gift')
                    res.data.repurchaseArr = this.formatActivity(res.data.repurchaseDiscount, 'repurchase')
                    // res.data.matchingArr = this.formatActivity(res.data.matchingDiscount, 'matching')
                    res.data.matchingArr = res.data.matchingDiscount
                    res.data.reductionArr = this.formatActivity(res.data.reductionDiscount, 'reduction')
                    this.detailsList.data = res.data;
                    this.policyDetailList.data = res.data;
                    // 清除加载遮罩
                    this.detailsList.loading = false;
                }
            });
            this.detailId = id;
            this.getLog();
        },
        formatActivity(prevArr, type) {
                let result = [];
                if(type == 'matching') {
                    let arr = prevArr.sort(function (a, b) { return a.matching_molecule - b.matching_molecule; });
                    arr.forEach((item) => {
                        let findResult = result.find(resultItem => (resultItem.matching_molecule + ',' + resultItem.matching_denominator) === (item.matching_molecule + ',' + item.matching_denominator));
                        if (findResult) {
                            findResult.list.push(item);
                        } else {
                            result.push({ matching_molecule: +item.matching_molecule, matching_denominator: +item.matching_denominator, list: [item] });
                        }
                    });
                } else {
                    let arr = prevArr.sort(function (a, b) { return a.starting_amount - b.starting_amount; });
                    arr.forEach((item) => {
                        let findResult = result.find(resultItem => resultItem.starting_amount === item.starting_amount);
                        if (findResult) {
                            findResult.list.push(item);
                        } else {
                            result.push({ starting_amount: item.starting_amount, list: [item] });
                        }
                    });
                }
                return result
        },

        /**
         * 单击按钮
         * @param {String} type: 单击的按钮类型
         */
        handleClickButton(type) {
          const checkList = this.checkList
          if (checkList.length !== 1) return this.$Message.warning('请选择一条数据!')
          if (['到期', '草稿'].includes(checkList[0].policyStatus)) return this.$Message.warning('当前供货政策状态不可操作!')
          switch (type) {
            case 'audit':
              this.handleShowPolicyModal(type, checkList[0].id)
              break;
            case 'disOrEnable':
              this.handleShowDisabledOrEnableModal(+checkList[0].isOpen ? 0 : 1)
              break;
            default:
              break;
          }
        },

        /**
         * 显示 启用/禁用 模态窗
         * @param {Number} isOpen: 启用/禁用   1:启用  0:禁用
         */
        handleShowDisabledOrEnableModal(isOpen) {
          this.disabledOrEnableObj.is_open = isOpen
          this.disabledOrEnableObj.modal = true
        },

        // sumbitEnable () {
        //     let params = {};
        //     params.is_open = this.disabledOrEnableObj.is_open;
        //     params.id = this.checkList[0].id;
        //     this.$api.contractPoliceEnable(params).then(res => {
        //         if (res.code === 0) {
        //             this.$Message.success(res.message);
        //             this.getList();
        //         } else {
        //             this.$Message.error(res.message);
        //         }
        //     });
        // },
         
        /**
         * 展示 审核/政策详情 模态窗
         * @param {String} type: 展示类型： audit:审核  detail:详情
         * @param {String} id: 数据id
         */
        handleShowPolicyModal(type, id) {
          // to-do: 获取详情API
          this.policyModalObj.hideAuditer = type === 'audit' ? false : true
          this.policyModalObj.title = type === 'audit' ? '审核' : '供货政策详情'
          this.policyModalObj.spinLoading = true
          this.policyModalObj.show = true
        },

        /**
         * 审核/政策详情 模态窗 - 确认事件
         * @param {object} params: 审核模式下返回审核结果auditResult: 1 -> 通过  0 -> 不通过
         */
        handleOnOkAuditPolicy({ auditResult }) {
          if (!!auditResult) {
            // to-do: 审核API
          }
          this.policyModalObj.show = false
        },

        /**
         * 审核/政策详情 模态窗 - 关闭/取消事件
         */
        handleOnCancelAuditPolicy() {
          this.policyModalObj.show = false
        },

        /**
         * 审核/政策详情 模态窗 - 查看适用商品详情事件
         * @param {Object} data: 当前点击的目标数据
         */
        handleOnShowSuitGoodsDetail(currentData) {
          console.log(currentData, 'currentData')
          // this.regularProductInfo = true
        },

        closeModal (e) {
            this[e].modal = false;
        },
        // 日志
        getLog () {
            this.logData.loading = true;
        },
        // 日志---页码
        changeLogPage (e) {
            this.logPage.page = e;
            this.getLog();
        },
        // 日志---每页条数
        changeLogPageSize (e) {
            this.logPage.perPage = e;
            this.getLog();
        },
        // 操作栏的编辑
        handleEdit (id, row) {
            this.$router.push({
                path: '/policy/policy-edit',
                query: { id: id }
            });
        },
        // 操作栏的删除
        handleDelete (id, row) {
            //let status = this.formatStatus(row.status);
            if(row.status === '审核通过'){
              this.$Notice.error({
                title:'失败',
                desc:'审核通过，无法删除'
              })
              return
            }else{
              this.$api.contractPoliceDeletev2(id)
                    .then(res => {
                      if (res.code === 0) {
                        this.$Message.success(res.message);
                            this.getList();
                        } else {
                          this.$Message.error(res.data[0]);
                        }
                    });
            } 
        },
        
        /**
       * 列表点击信息
       * @param {Object} selection：用户信息
       */
      selectCheck(selection) {
        this.checkList = selection
        // selection.length !=0 ?  this.checkList = selection[0] : this.checkList = {}

      },
        // 列表选择
        // checkTable (currentRow) {
        //     this.checkList = currentRow;
        // },
        // 审核
        auditItem () {
            let params = {};
            params.id = this.checkList[0].id;
            params.is_pass = this.detailsList.is_pass;
            if (params.is_pass === '') {
                this.$Message.warning('审核结果不能为空！');
                return false;
            }
            this.$api.auditContractPolicev2(params)
                .then(res => {
                    if (res.code === 0) {
                        this.$Message.success(res.message);
                        this.closeModal('detailsList');
                        this.getList();
                    } else {
                        this.$Message.error(res.message);
                    }
                });
        },
        // 切换页码
        changePage (e) {
            this.pageProps.page = e;
            this.getList();
        },
        // 设置每页显示的条数
        changePageSize (e) {
            this.pageProps.perPage = e;
            this.getList();
        },
        // 时间转化
        formatDate (time) {
            return this.$format(time, 'yyyy-MM-dd hh:mm');
        },
        // 日期转化
        formatDays (time) {
            return this.$format(time, 'yyyy-MM-dd');
        },
        // 启用状态转化
        formatIsOpen (isOpen) {
            return isOpen === '0' ? '否' : '是';
        },
        // 审核状态转化
        formatStatus (examineStatus) {
            //let status = examineStatus.split('/')[1];
            for (let i in this.statusList) {
                if (examineStatus === this.statusList[i].key) {
                    return this.statusList[i].value;
                }
            }
        },
        // 折扣比例转化
        formatProportion (num) {
            if(num!=''){
                return (num * 100).toFixed(2) + '%';
            } else {
                return num
            }
        }
    },
    activated () {
      let status = this.$route.query.status||'';
      if (status) {
        this.search.status = 'ContractPolicyWorkFlow/'+status;
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
    .ivu-input::-webkit-input-placeholder, .ivu-select-single .ivu-select-selection .ivu-select-placeholder {
        color: rgb(130, 130, 130);
    }
    .ivu-input, .ivu-select-selection {
        border: 1px solid rgb(184, 184, 184);
        color: #000;

    }
    .detailsList-title {
        margin: 20px auto 10px;
    }
    .policyDetailList-wrap {
        height: 550px;
        overflow-y: scroll;
    }
    .policy-detail{
        cursor: pointer;
        color: #5cadff;
    }
    
.mathch-product{
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.product-items{
  flex: 1;
  height: 40px;
  line-height: 40px;
  border-right: 1px solid #e8eaec;
  border-top: 1px solid #e8eaec;
}

.width-110{
  width: 110px;
  height: 40px;
  line-height: 40px;
  border-right: 1px solid #e8eaec;
  border-top: 1px solid #e8eaec;
}
.width-108{
  width: 108px;
}
</style>