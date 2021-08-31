<template>
	<div>
		<Card>
			<Row slot="title">
				<Col :sm="24" @keydown.native.enter.prevent="getList('search')">
					<Form ref="search" :model="search" class="search">
						<FormItem>
							<Select v-model="search.ownership" clearable placeholder="所有权" @on-change="getList('search')">
								<Option
									v-for="item in ownershipList"
									:value="item.ownership"
									:key="item.ownership"
									:label="item.label"
								></Option>
							</Select>
						</FormItem>
						<FormItem>
							<Input v-model="search.salesman" placeholder="业务员" clearable />
						</FormItem>
						<FormItem>
							<Input v-model="search.merchantName" placeholder="商家" clearable />
						</FormItem>
						<FormItem>
							<Input v-model="search.orderSn" placeholder="订单号" clearable />
						</FormItem>
						<FormItem>
							<Select v-model="search.orderForm" placeholder="订单来源" clearable @on-change="getList('search')">
								<Option
									v-for="option in originList"
									:key="'user' + option.key"
									:value="option.key"
									:label="option.value"
								></Option>
							</Select>
						</FormItem>
						<FormItem>
							<Select v-model="search.deliveryStatus" placeholder="发货状态" clearable @on-change="getList('search')">
								<Option
									v-for="option in statusList"
									:key="'user' + option.key"
									:value="option.key"
									:label="option.value"
								></Option>
							</Select>
						</FormItem>
						<FormItem>
							<Select v-model="search.deliveryMode" placeholder="发货方式" clearable @on-change="getList('search')">
								<Option
									v-for="option in wayList"
									:key="'user' + option.key"
									:value="option.key"
									:label="option.value"
								></Option>
							</Select>
						</FormItem>
						<FormItem>
							<Select v-model="search.disposeStatus" placeholder="处理状态" clearable @on-change="getList('search')">
								<Option
									v-for="(option, index) in disposeStatusList"
									:key="index"
									:value="option.value"
									:label="option.label"
								></Option>
							</Select>
						</FormItem>
						<FormItem style="float: right;">
							<Button type="primary" icon="md-search" style="padding: 4px 15px" @click="getList('search')">查询</Button>
							<Button icon="md-repeat" style="padding: 4px 15px" @click="handleReset('search')">重置</Button>
						</FormItem>
					</Form>
				</Col>
				<Col :sm="24">
					<Button type="success" icon="ios-list-box-outline" @click="viewNotice">通知发货</Button>
					<Button type="success" icon="ios-create-outline" @click="viewSet">发货设置</Button>
					<Button type="success" icon="ios-create-outline" @click="viewHandle">导单处理</Button>
					<Button type="success" icon="ios-download-outline" @click="orderExport">订单导出</Button>
					<Button type="success" icon="ios-build-outline" @click="orderSplit">拆分订单</Button>
					<Button type="success" icon="ios-person-outline" @click="openOrderSplitModal">拆单审核</Button>
					<Progress v-show="isShowProgress" :percent="percentProgress"></Progress>
				</Col>
			</Row>
			<Row class="margin-top-10" style="clear: both;">
				<Table
					:columns="listData.columns"
					:data="listData.data"
					border
					highlight-row
					:loading="loading"
					@on-selection-change="checkTable"
					size="small"
				></Table>
				<div style="margin: 10px;overflow: hidden">
					<div class="pages-L">共 {{ pageProps.totalCount }} 条</div>
					<div style="float: right;">
						<Page
							size="small"
							:total="pageProps.totalCount"
							:current="pageProps.currentPage"
							show-sizer
							show-elevator
							@on-change="changePage"
							@on-page-size-change="changePageSize"
						></Page>
					</div>
				</div>
			</Row>
		</Card>
		<Modal v-model="noticeList.modal" title="发货通知" @on-ok="sumbitDeliveryNotice">
			<Form>
				<FormItem label="通知仓配中心发货处理:">
					<Select
						:label="formData.reviewer"
						v-model="formData.username"
						filterable
						remote
						:remote-method="queryUser"
						@on-change="selectUser"
						:loading="loadingVisible"
						label-in-value
						style="width: 300px"
						placeholder="请输入工号/用户名"
					>
						<Option
							v-for="option in userList"
							:key="'user' + option.id"
							:value="option.username"
							:label="option.real_name"
						></Option>
					</Select>
				</FormItem>
			</Form>
		</Modal>
		<Modal v-model="detailsList.modal" title="详情" width="1200">
			<Spin size="large" fix v-if="detailsList.loading"></Spin>
			<div class="rel">
				<!-- 订单详情 start -->
				<div class="ivu-table-wrapper">
					<div class="ivu-table ivu-table-small ivu-table-border">
						<div class="ivu-table-body">
							<table cellspacing="0" cellpadding="0" border="0" width="100%">
								<tbody class="ivu-table-tbody">
									<tr class="ivu-table-row">
										<td class="head-bg">
											<div class="ivu-table-cell">创建人</div>
										</td>
										<td>
											<div class="ivu-table-cell">
												<span
													v-text="
														detailsList.data.parentOrder
															? detailsList.data.parentOrder.created_by
															: detailsList.data.created_by
													"
												></span>
											</div>
										</td>
										<td class="head-bg">
											<div class="ivu-table-cell">创建时间</div>
										</td>
										<td>
											<div class="ivu-table-cell">
												<span
													v-text="
														formatDate(
															detailsList.data.parentOrder
																? detailsList.data.parentOrder.created_at
																: detailsList.data.created_at
														)
													"
												></span>
											</div>
										</td>
										<td class="head-bg">
											<div class="ivu-table-cell">业务员</div>
										</td>
										<td>
											<div class="ivu-table-cell">
												<span
													v-text="
														detailsList.data.parentOrder
															? detailsList.data.parentOrder.salesman
															: detailsList.data.salesman
													"
												></span>
											</div>
										</td>
									</tr>
									<tr class="ivu-table-row">
										<td class="head-bg">
											<div class="ivu-table-cell">商家名称</div>
										</td>
										<td>
											<div class="ivu-table-cell">
												<span v-text="detailsList.data.delivery_object"></span>
											</div>
										</td>
										<td class="head-bg">
											<div class="ivu-table-cell">合作商政策</div>
										</td>
										<td>
											<div class="ivu-table-cell">
												<span
													v-text="
														detailsList.data.parentOrder
															? detailsList.data.parentOrder.partner_policy_name
															: detailsList.data.partner_policy_name
													"
												></span>
											</div>
										</td>
										<td class="head-bg">
											<div class="ivu-table-cell">付款方式</div>
										</td>
										<td>
											<div class="ivu-table-cell">
												<span
													v-text="
														formatPayment(
															detailsList.data.parentOrder
																? detailsList.data.parentOrder.payment_method
																: detailsList.data.payment_method
														)
													"
												></span>
											</div>
										</td>
									</tr>
									<tr class="ivu-table-row">
										<td class="head-bg">
											<div class="ivu-table-cell">父订单号</div>
										</td>
										<td>
											<div class="ivu-table-cell">
												<span
													v-text="
														detailsList.data.parentOrder
															? detailsList.data.parentOrder.order_sn
															: detailsList.data.order_sn
													"
												></span>
											</div>
										</td>
										<td class="head-bg">
											<div class="ivu-table-cell">下单时间</div>
										</td>
										<td>
											<div class="ivu-table-cell">
												<span
													v-text="
														formatDate(
															detailsList.data.parentOrder
																? detailsList.data.parentOrder.order_time
																: detailsList.data.order_time
														)
													"
												></span>
											</div>
										</td>
										<td class="head-bg">
											<div class="ivu-table-cell">订单来源</div>
										</td>
										<td>
											<div class="ivu-table-cell">
												<span
													v-text="
														formatOrigin(
															detailsList.data.parentOrder
																? detailsList.data.parentOrder.order_form
																: detailsList.data.order_form
														)
													"
												></span>
											</div>
										</td>
									</tr>
									<tr class="ivu-table-row">
										<td class="head-bg">
											<div class="ivu-table-cell">收货地址</div>
										</td>
										<td colspan="2">
											<div class="ivu-table-cell">
												<span
													v-text="
														detailsList.data.parentOrder
															? detailsList.data.parentOrder.receiving_address
															: detailsList.data.receiving_address
													"
												></span>
											</div>
										</td>
										<td class="head-bg">
											<div class="ivu-table-cell">送货方式</div>
										</td>
										<td colspan="2">
											<div class="ivu-table-cell">
												<span
													v-text="
														formatDeliveryMode(
															detailsList.data.parentOrder
																? detailsList.data.parentOrder.delivery_mode
																: detailsList.data.delivery_mode
														)
													"
												></span>
											</div>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>

				<Modal title="查看其他子订单" v-model="detailsList.othersChildOrderModal" width="1000">
					<template v-if="detailsList.data.parent_order_id !== '0'">
					<div
						style="margin-bottom: 30px"
						v-for="item in detailsList.data.otherChildrenOrderInfo"
						:key="item.id">
						<p class="child-order-title">子订单 {{ item.order_sn }}</p>
						<!--子订单详情-->
						<Table border :columns="productCloumns" :data="item.allProduct"></Table>
					</div>
					</template>
					<div slot="footer">
						<Button type="primary" @click="detailsList.othersChildOrderModal = false">确认</Button>
						<Button type="default" @click="detailsList.othersChildOrderModal = false">关闭</Button>
					</div>
				</Modal>

				<div class="item">
					<Table
						border
						:columns="orderData.columns"
						:data="orderData.data"
						v-if="detailsList.data.parent_order_id === '0'"
					></Table>
					<div v-else style="position: relative">
						<p class="child-order-title">子订单 {{ detailsList.data.order_sn }}</p>
						<a
							style="position: absolute;right: 0;top: 0;"
							href="javascript:void(0)"
							@click="detailsList.othersChildOrderModal = true"
							v-if="detailsList.data.otherChildrenOrderInfo.length"
							>查看其他子订单</a
						>
						<Table border :columns="orderData.columns" :data="orderData.data"></Table>
					</div>
				</div>

				<div class="ivu-table-wrapper item">
					<div class="ivu-table ivu-table-small ivu-table-border">
						<div class="ivu-table-body">
							<table cellspacing="0" cellpadding="0" border="0" width="100%">
								<tr class="ivu-table-row">
									<td colspan="10"><p>发货信息</p></td>
								</tr>
								<tr class="ivu-table-row">
									<td colspan="2" class="head-bg">
										<div class="ivu-table-cell">发货方式</div>
									</td>
									<td colspan="3">
										<span
											v-text="
												!detailsList.data.delivery
													? '暂无'
													: formatDeliveryMode(detailsList.data.delivery.delivery_mode)
											"
										></span>
									</td>
									<td colspan="2" class="head-bg">
										<div class="ivu-table-cell">确认发货</div>
									</td>
									<td colspan="3">
										<span
											v-text="
												!detailsList.data.delivery
													? '暂无'
													: formatDeliveryStatus(detailsList.data.delivery.delivery_status)
											"
										></span>
									</td>
								</tr>
								<tr class="ivu-table-row">
									<td colspan="2" class="head-bg">
										<div class="ivu-table-cell">确认时间</div>
									</td>
									<td colspan="3">
										<span v-text="detailsList.data.delivery.confirm_delivery_time"></span>
									</td>
									<td colspan="2" class="head-bg">
										<div class="ivu-table-cell">缺货信息</div>
									</td>
									<td colspan="3">
										<span v-text="!detailsList.data.delivery ? '暂无' : detailsList.data.delivery.shortage_info"></span>
									</td>
								</tr>
								<tr class="ivu-table-row">
									<td colspan="2" class="head-bg">
										<div class="ivu-table-cell">其他异常</div>
									</td>
									<td colspan="3">
										<span v-text="!detailsList.data.delivery ? '暂无' : detailsList.data.delivery.remark"></span>
									</td>
									<td colspan="2" class="head-bg">
										<div class="ivu-table-cell">物流单号</div>
									</td>
									<td colspan="3">
										<span v-text="!detailsList.data.delivery ? '暂无' : detailsList.data.delivery.logistics_id"></span>
									</td>
								</tr>
								<tr class="ivu-table-row">
									<td colspan="2" class="head-bg">
										<div class="ivu-table-cell">下载出货单</div>
									</td>
									<td colspan="3">
										<a @click="downlodaSales(detailsList.data.id)">出货单</a>
									</td>
									<td colspan="2" class="head-bg">
										<div class="ivu-table-cell">下载物流单</div>
									</td>
									<td colspan="3">
										<span v-if="!!detailsList.data.delivery && detailsList.data.delivery.fileItems.length > 0">
											<a
												style="display: block"
												v-for="(item, index) in detailsList.data.delivery.fileItems"
												:key="'file' + index"
												:href="baseUrl + item.url"
												target="_blank"
												>{{ item.title + '.' + item.extension }}</a
											>
										</span>
										<span v-if="!detailsList.data.delivery || detailsList.data.delivery.fileItems.length == 0"
											>暂无</span
										>
									</td>
								</tr>
							</table>
						</div>
					</div>
				</div>

				<div class="ivu-table-wrapper item" v-if="detailsList.data.separateAuditLogItems">
					<div class="ivu-table ivu-table-border">
						<div class="ivu-table-body">
							<table cellspacing="0" cellpadding="0" border="0" width="100%">
								<tbody class="ivu-table-body">
									<tr class="ivu-table-row">
										<td class="head-bg">
											<div class="ivu-table-cell">
												<div class="ivu-table-cell">审核结果</div>
											</div>
										</td>
										<td colspan="2">
											<div class="ivu-table-cell">
												<div
													class="ivu-table-cell"
													v-text="detailsList.data.separateAuditLogItems.audit_pass === '1' ? '通过' : '不通过'"
												></div>
											</div>
										</td>
										<td class="head-bg">
											<div class="ivu-table-cell">
												<div class="ivu-table-cell">审核人</div>
											</div>
										</td>
										<td colspan="2">
											<div class="ivu-table-cell">
												<div class="ivu-table-cell" v-text="detailsList.data.separateAuditLogItems.created_by"></div>
											</div>
										</td>
									</tr>
									<tr class="ivu-table-row">
										<td class="head-bg">
											<div class="ivu-table-cell">
												<div class="ivu-table-cell">审核意见</div>
											</div>
										</td>
										<td colspan="5">
											<div class="ivu-table-cell">
												<div class="ivu-table-cell" v-text="detailsList.data.separateAuditLogItems.opinion"></div>
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
				<Button
					type="primary"
					v-if="
						detailsList.data.parent_order_id !== '0' &&
							(!detailsList.data.separateAuditLogItems || detailsList.data.separateAuditLogItems.audit_pass === '0')
					"
					@click="editOrderSplit(detailsList.data.parent_order_id)"
				>
					修改
				</Button>
				<Button type="primary" v-else @click="closeModal('detailsList')">确认</Button>
				<Button type="default" @click="closeModal('detailsList')">关闭</Button>
			</div>
		</Modal>
		<Modal v-model="orderSplitAudit.modal" title="拆单审核" width="1200">
			<Spin size="large" fix v-if="orderSplitAudit.modal_loading"></Spin>
			<div class="rel">
				<!-- 拆单审核详情 start -->
				<div class="ivu-table-wrapper">
					<div class="ivu-table ivu-table-border">
						<div class="ivu-table-body">
							<table cellspacing="0" cellpadding="0" border="0" width="100%">
								<tbody class="ivu-table-tbody">
									<tr class="ivu-table-row">
										<td class="head-bg">
											<div class="ivu-table-cell">创建人</div>
										</td>
										<td>
											<div class="ivu-table-cell">
												<span v-text="orderSplitAudit.data.parentOrder.created_by"></span>
											</div>
										</td>
										<td class="head-bg">
											<div class="ivu-table-cell">创建时间</div>
										</td>
										<td>
											<div class="ivu-table-cell">
												<span v-text="formatDate(orderSplitAudit.data.parentOrder.created_at)"></span>
											</div>
										</td>
										<td class="head-bg">
											<div class="ivu-table-cell">业务员</div>
										</td>
										<td>
											<div class="ivu-table-cell">
												<span v-text="orderSplitAudit.data.parentOrder.salesman"></span>
											</div>
										</td>
									</tr>
									<tr class="ivu-table-row">
										<td class="head-bg">
											<div class="ivu-table-cell">商家名称</div>
										</td>
										<td>
											<div class="ivu-table-cell">
												<span v-text="orderSplitAudit.data.parentOrder.merchant_name"></span>
											</div>
										</td>
										<td class="head-bg">
											<div class="ivu-table-cell">合作商政策</div>
										</td>
										<td>
											<div class="ivu-table-cell">
												<span v-text="orderSplitAudit.data.parentOrder.partner_policy_name"></span>
											</div>
										</td>
										<td class="head-bg">
											<div class="ivu-table-cell">付款方式</div>
										</td>
										<td>
											<div class="ivu-table-cell">
												<span v-text="formatPayment(orderSplitAudit.data.parentOrder.payment_method)"></span>
											</div>
										</td>
									</tr>
									<tr class="ivu-table-row">
										<td class="head-bg">
											<div class="ivu-table-cell">父订单号</div>
										</td>
										<td>
											<div class="ivu-table-cell">
												<span v-text="orderSplitAudit.data.parentOrder.order_sn"></span>
											</div>
										</td>
										<td class="head-bg">
											<div class="ivu-table-cell">下单时间</div>
										</td>
										<td>
											<div class="ivu-table-cell">
												<span v-text="formatDate(orderSplitAudit.data.parentOrder.order_time)"></span>
											</div>
										</td>
										<td class="head-bg">
											<div class="ivu-table-cell">订单来源</div>
										</td>
										<td>
											<div class="ivu-table-cell">
												<span v-text="formatOrigin(orderSplitAudit.data.parentOrder.order_form)"></span>
											</div>
										</td>
									</tr>
									<tr class="ivu-table-row">
										<td class="head-bg">
											<div class="ivu-table-cell">收货地址</div>
										</td>
										<td colspan="2">
											<div class="ivu-table-cell">
												<span v-text="orderSplitAudit.data.parentOrder.receiving_address"></span>
											</div>
										</td>
										<td class="head-bg">
											<div class="ivu-table-cell">送货方式</div>
										</td>
										<td colspan="2">
											<div class="ivu-table-cell">
												<span v-text="formatDeliveryMode(orderSplitAudit.data.parentOrder.delivery_mode)"></span>
											</div>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
				<!--详情中点击的子订单-->
				<div style="margin-top: 30px">
					<p class="child-order-title">子订单 {{ orderSplitAudit.data.order_sn }}</p>
					<Table border :columns="productCloumns" :data="orderSplitAudit.data.allProduct"></Table>
				</div>
				<!--详情中点击的子订单的兄弟订单-->
				<div style="margin-top: 30px" v-for="item in orderSplitAudit.data.otherChildrenOrderInfo" :key="item.id">
					<p class="child-order-title">子订单 {{ item.order_sn }}</p>
					<Table border :columns="productCloumns" :data="item.allProduct"></Table>
				</div>

				<div class="ivu-table-wrapper" style="margin-top: 30px">
					<div class="ivu-table ivu-table-border">
						<div class="ivu-table-body">
							<table cellspacing="0" cellpadding="0" border="0" width="100%">
								<tbody class="ivu-table-body">
									<tr class="ivu-table-row">
										<td class="head-bg">
											<div class="ivu-table-cell">
												<div class="ivu-table-cell item-required">审核结果</div>
											</div>
										</td>
										<td colspan="2">
											<RadioGroup v-model="orderSplitAudit.auditData.audit_pass">
												<Radio :label="1">
													<span>通过</span>
												</Radio>
												<Radio :label="0">
													<span>不通过</span>
												</Radio>
											</RadioGroup>
										</td>
										<td class="head-bg">
											<div class="ivu-table-cell">
												<div class="ivu-table-cell item-required">审核人</div>
											</div>
										</td>
										<td colspan="2">
											<div class="ivu-table-cell">
												<Select
													v-model="orderSplitAudit.auditData.auditor_id"
													filterable
													remote
													:remote-method="searchAuditList"
													:loading="orderSplitAudit.audit_search_loading"
												>
													<Option
														v-for="(option, index) in orderSplitAudit.auditList"
														:label="option.real_name"
														:value="option.id"
														:key="index"
													></Option>
												</Select>
											</div>
										</td>
									</tr>
									<tr class="ivu-table-row">
										<td class="head-bg">
											<div class="ivu-table-cell">
												<div class="ivu-table-cell">审核意见</div>
											</div>
										</td>
										<td colspan="5">
											<div class="ivu-table-cell">
												<Input v-model="orderSplitAudit.auditData.remark" :maxlength="100" />
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
				<Button type="default" size="large" @click="orderSplitAudit.modal = false">取消</Button>
				<Button type="primary" size="large" :loading="orderSplitAudit.btn_loading" @click="orderSplitAuditSubmit"
					>提交
				</Button>
			</div>
		</Modal>
		<Modal v-model="setList.modal" :loading="setList.loading" title="发货设置" width="1200">
			<div class="rel">
				<!-- 订单详情 start -->
				<div class="ivu-table-wrapper">
					<div class="ivu-table ivu-table-small ivu-table-border">
						<div class="ivu-table-body">
							<table cellspacing="0" cellpadding="0" border="0" width="100%">
								<tr class="ivu-table-row">
									<td colspan="2" class="head-bg">
										<div class="ivu-table-cell">订单号</div>
									</td>
									<td colspan="8">
										<span v-text="setList.data.order_sn"></span>
									</td>
								</tr>
								<tr class="ivu-table-row">
									<td colspan="2" class="head-bg">
										<div class="ivu-table-cell">下载出货单</div>
									</td>
									<td colspan="8">
										<a @click="downlodaSales(setList.data.order_id)">出货单</a>
									</td>
								</tr>
								<tr class="ivu-table-row">
									<td colspan="2" class="head-bg">
										<div class="ivu-table-cell">上传物流单</div>
									</td>
									<td colspan="3">
										<Upload
											name="UploadForm[file]"
											:action="fileUploadMaterial"
											:format="['xlsx']"
											:headers="fileUploadHeaders"
											:show-upload-list="false"
											:max-size="51200"
											:on-progress="importProgress"
											:on-success="importSuccess"
											:on-exceeded-size="fileMaxSize"
											:on-format-error="fileFormatError"
											style="margin-left:1px;display:inline-block"
										>
											<Button icon="ios-cloud-upload-outline">上传</Button>
										</Upload>
										<a v-if="setList.data.fileItems.length !== 0" :href="setList.data.fileItems[0].url_show"
											>{{ setList.data.fileItems[0].title }}.{{ setList.data.fileItems[0].extension }}</a
										>
									</td>
									<td colspan="2" class="head-bg">
										<div class="ivu-table-cell">发货方式</div>
									</td>
									<td colspan="3">
										<RadioGroup v-model="setList.data.delivery_mode">
											<Radio label="快递">
												<span>快递</span>
											</Radio>
											<Radio label="物流">
												<span>物流</span>
											</Radio>
										</RadioGroup>
									</td>
								</tr>
								<tr class="ivu-table-row">
									<td colspan="2" class="head-bg">
										<div class="ivu-table-cell">确认发货</div>
									</td>
									<td colspan="3">
										<RadioGroup v-model="setList.data.isSend" @on-change="isSendChange(setList.data.isSend)">
											<Radio label="1">
												<span>是</span>
											</Radio>
											<Radio label="0">
												<span>否</span>
											</Radio>
										</RadioGroup>
									</td>
									<td colspan="2" class="head-bg">
										<div class="ivu-table-cell">确认时间</div>
									</td>
									<td colspan="3">
										<span v-text="setList.data.confirm_delivery_time"></span>
									</td>
								</tr>
								<tr class="ivu-table-row">
									<td colspan="2" class="head-bg">
										<div class="ivu-table-cell">缺货信息</div>
									</td>
									<td colspan="8">
										<Input
											v-model="setList.data.shortage_info"
											:maxlength="100"
											placeholder="请输入"
											style="width: 400px;"
										/>
									</td>
								</tr>
								<tr class="ivu-table-row">
									<td colspan="2" class="head-bg">
										<div class="ivu-table-cell">其他异常</div>
									</td>
									<td colspan="8">
										<Input v-model="setList.data.remark" :maxlength="100" placeholder="请输入" style="width: 400px;" />
									</td>
								</tr>
							</table>
						</div>
					</div>
				</div>
				<Divider>
					物流设置
				</Divider>

				<Table ref="myTable" border :columns="deliveryColumns" :data="setList.orderLogistics" class="delivery-wrapper">
					<template slot="orderLogisticsId" slot-scope="props">
						<Input v-model="props.row.orderLogisticsId" :maxlength="50"></Input>
					</template>
					<template slot="company" slot-scope="props">
						<Select
							v-model="props.row.courierCompanyId"
							:label="props.row.courierCompany"
							label-in-value
							@on-change="arr => changeCourierCompany(arr, props.index)"
						>
							<Option
								v-for="item in fmsService"
								:value="item.courier_company_id"
								:key="item.courier_company_id"
								:label="item.courier_company"
								>{{ item.courier_company }}
							</Option>
						</Select>
					</template>
					<template slot="content" slot-scope="props">
						<Input v-model="props.row.content" :maxlength="100"></Input>
					</template>
					<template slot-scope="{ row }" slot="action">
						<Tooltip placement="top" content="编辑" transfer>
							<Button icon="md-add" @click="addRow()" v-if="row._index == 0"></Button>
							<Button icon="md-remove" @click="removeRow(row)" v-else></Button>
						</Tooltip>
					</template>
				</Table>
			</div>
			<div slot="footer">
				<Button type="primary" @click="submitSet" :loading="setList.buttonLoading">提交</Button>
			</div>
		</Modal>
		<Modal v-model="handleList.modal" :loading="handleList.loading" title="导单处理" width="1200">
			<div class="rel">
				<!-- 订单详情 start -->
				<div class="ivu-table-wrapper">
					<div class="ivu-table ivu-table-small ivu-table-border">
						<div class="ivu-table-body">
							<table cellspacing="0" cellpadding="0" border="0" width="100%">
								<tbody>
									<tr class="ivu-table-row">
										<td colspan="1" class="head-bg">
											<div class="ivu-tabel-cell">
												<span>处理人</span>
											</div>
										</td>
										<td colspan="3">
											<div class="ivu-tabel-cell">
												<span>{{ handleList.data.real_name }}</span>
											</div>
										</td>
									</tr>
									<tr>
										<td colspan="1" class="head-bg">
											<div class="ivu-tabel-cell">
												<span>处理状态</span>
											</div>
										</td>
										<td colspan="3">
											<div class="ivu-tabel-cell">
												<RadioGroup v-model="handleList.params.disposeStatus">
													<Radio label="已处理">已处理</Radio>
													<Radio label="未处理">未处理</Radio>
													<Radio label="异常处理">异常处理</Radio>
												</RadioGroup>
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
				<Button type="default" @click="closeModal('handleList')">关闭</Button>
				<Button type="primary" @click="submitHandle">提交</Button>
			</div>
		</Modal>
		<Modal v-model="handlerOrderExport.modal" :loading="handleList.loading" title="已审核订单导出" width="800">
			<div class="rel">
				<Row>
					<Col span="24" offset="0">选择导出条件：</Col>
				</Row>
				<Row>
					<Col span="12" offset="6">
						下单时间：
						<DatePicker
							type="daterange"
							placement="bottom-end"
							placeholder="开始时间和结束时间"
							style="min-width: 80px"
							@on-change="getDate"
						></DatePicker>
						<span>（非必选条件）</span>
					</Col>
				</Row>
				<br />
				<Row>
					<Col span="12" offset="6">
						处理状态：
						<Select v-model="exportArr.disposeStatus" @on-change="changeStatus" style="width:120px">
							<Option v-for="item in handlerStatusList" :value="item.key" :key="item.key" :label="item.value"></Option>
						</Select>
						<span>（必选条件）</span>
					</Col>
				</Row>
			</div>
			<div slot="footer">
				<Button type="default" @click="closeModal('handlerOrderExport')">关闭</Button>
				<Button type="primary" @click="submitOrderExport">提交</Button>
			</div>
		</Modal>
		<!-- 物流弹窗 -->
		<Modal v-model="sendDetails.modal" :loading="handleList.loading" title="发货详情" width="800" class="modal-height">
			<div class="rel">
				<Form label-position="top">
					<Row>
						<Col :md="6">
							<FormItem label="订单号">
								<Input :value="sendDetails.data.order_sn" disabled clearable />
							</FormItem>
						</Col>
						<Col :md="6">
							<FormItem label="合作商">
								<Input v-model="sendDetails.data.partner_policy_name" disabled clearable />
							</FormItem>
						</Col>
						<Col :md="6">
							<FormItem label="订单金额">
								<Input v-model="sendDetails.data.total_order_amount" disabled clearable />
							</FormItem>
						</Col>
						<Col :md="6">
							<FormItem label="订单来源">
								<Input :value="formatOrigin(sendDetails.data.order_form)" disabled />
							</FormItem>
						</Col>
						<Col :md="6">
							<FormItem label="发货状态">
								<template v-if="sendDetails.data.delivery.delivery_status">
									<Input
										:value="
											sendDetails.data.delivery.delivery_status === 'delivery_pending_notice'
												? '待通知发货'
												: sendDetails.data.delivery.delivery_status === 'delivery_pending'
												? '待发货'
												: '已发货'
										"
										disabled
									/>
								</template>
								<Input v-else value="暂无" disabled />
							</FormItem>
						</Col>
						<Col :md="6">
							<FormItem label="确认发货时间">
								<template v-if="sendDetails.data.delivery.confirm_delivery_time">
									<Input v-model="sendDetails.data.delivery.confirm_delivery_time" disabled />
								</template>
								<Input v-else value="暂无" disabled />
							</FormItem>
						</Col>
						<Col :md="6">
							<FormItem label="发货人">
								<template v-if="sendDetails.data.delivery.created_by">
									<Input v-model="sendDetails.data.delivery.created_by" disabled />
								</template>
								<Input v-else value="暂无" disabled />
							</FormItem>
						</Col>
						<Col :md="6">
							<FormItem label="发货方式">
								<template v-if="sendDetails.data.delivery.delivery_mode">
									<Input v-model="deliveryNode" disabled />
								</template>
								<Input v-else value="暂无" disabled />
							</FormItem>
						</Col>
						<Col :md="6">
							<FormItem label="缺货信息">
								<template v-if="sendDetails.data.delivery.shortage_info">
									<Input v-model="sendDetails.data.delivery.shortage_info" disabled />
								</template>
								<Input v-else value="暂无" disabled />
							</FormItem>
						</Col>
						<Col :md="6">
							<FormItem label="其他异常">
								<template v-if="sendDetails.data.delivery.remark">
									<Input v-model="sendDetails.data.delivery.remark" disabled />
								</template>
								<Input v-else value="暂无" disabled />
							</FormItem>
						</Col>
						<Col :md="8">
							<FormItem label="物流单附件">
								<template v-if="sendDetails.data.delivery.fileItems">
									<a
										:href="file + '/' + item.url"
										v-for="(item, index) in sendDetails.data.delivery.fileItems"
										v-text="item.title + '.' + item.extension"
										target="_blank"
										:key="index"
									></a>
								</template>
								<Input v-else value="暂无" disabled />
							</FormItem>
						</Col>
					</Row>
					<Row v-for="(logItem, logIndex) in logistics" :key="logIndex">
						<Col :md="6">
							<FormItem label="物流单号">
								<Input v-model="logItem.order_logistics_id" disabled clearable />
							</FormItem>
						</Col>
						<Col :md="6">
							<FormItem label="快递公司">
								<Input v-model="logItem.courier_company" disabled clearable />
							</FormItem>
						</Col>
						<Col :md="12">
							<FormItem label="内容">
								<Input v-model="logItem.content" disabled clearable style="width: 70%;" />
								<Button
									type="primary"
									@click="viewLogistics(logItem.order_logistics_id, logIndex)"
									style="width:26%;margin-left: 3px;"
									:loading="logItem.btnLoading"
									>查看物流
								</Button>
							</FormItem>
						</Col>
						<Col :md="24" v-show="logItem.isOpen" :class="'delivery-time-wrapper'">
							<Timeline class="delivery-timeline">
								<!--                            <TimelineItem color="green" v-for="(item1,index1) in sendDetails.logisticsData" :key="index1">-->
								<TimelineItem color="#fff" v-for="(item1, index1) in logItem.viewData" :key="index1">
									<div class="timeline-timeshow">
										<p>{{ item1.mon }}</p>
										<p>{{ item1.hour }}</p>
									</div>
									<Icon type="md-time" color="#808695" slot="dot" v-if="item1.isEmpty"></Icon>
									<Icon type="md-close-circle" color="red" slot="dot" v-if="item1.isError"></Icon>
									<Icon
										type="md-checkmark-circle"
										color="#2d8cf0"
										slot="dot"
										v-if="index1 == 0 && !item1.isEmpty && !item1.isError"
									></Icon>
									<Icon
										type="md-checkmark-circle"
										color="#dcdee2"
										slot="dot"
										v-if="index1 !== 0 && !item1.isEmpty && !item1.isError"
									></Icon>

									<span>{{ item1.content }}</span>
									<br />
								</TimelineItem>
							</Timeline>
							<Button type="primary" @click="closeLogistics(logIndex)" class="close-button">关闭</Button>
						</Col>
					</Row>
				</Form>
				<Spin size="large" fix v-show="sendDetails.showLoading"></Spin>
			</div>
			<div slot="footer">
				<Button type="primary" @click="sendDetails.modal = false">确认</Button>
				<Button type="default" @click="sendDetails.modal = false">关闭</Button>
			</div>
		</Modal>
	</div>
</template>

<script>
import Cookies from 'js-cookie'
import { SERVER_BASE_URL } from '~/api/config'
import { FMS } from '~/plugins/fms'

export default {
	name: 'sample-deliver',
	data() {
		return {
			act: false, // 用于触发渲染
			baseUrl: `${SERVER_BASE_URL}/`,
			fileUploadMaterial: `${SERVER_BASE_URL}/v1/upload`,
			fileUploadHeaders: {
				Authorization: Cookies.get('authorization'),
			},
			ownershipList: [],
			isShowProgress: false,
			percentProgress: 0,
			search: {},
			handlerStatusList: [
				{ key: 'undisposed', value: '未处理' },
				{ key: 'disposed', value: '已处理' },
				{ key: 'exception_handling', value: '异常处理' },
			],
			exportArr: {
				disposeStatus: '',
				startTime: '',
				endTime: '',
				kind: 'sample',
			}, // 订单导出
			originList: [
				{ key: 'MiniProgram', value: '小程序' },
				{ key: 'backstage', value: '后台添加' },
			],
			statusList: [
				{ key: 'delivery_pending_notice', value: '待通知发货' },
				{ key: 'delivery_pending', value: '待发货' },
				{ key: 'delivery_finish', value: '已发货' },
				{ key: 'wait_separate_audit', value: '拆单待审核' },
				{ key: 'separate_audit_failure', value: '拆单审核不通过' },
			],
			wayList: [
				{ key: 'logistics', value: '物流' },
				{ key: 'express', value: '快递' },
			],
			paymentList: [
				{ key: 'monthly', value: '月结' },
				{ key: 'spot_cash', value: '现款现货' },
				{ key: 'real_sale', value: '实销实结' },
			],
			orderData: {
				columns: [
					{ key: 'pro_name', title: '产品名称', minWidth: 120, align: 'center' },
					{ key: 'standard', title: '规格', align: 'center' },
					{ key: 'unit', title: '单位', align: 'center' },
					{ key: 'number', title: '数量', align: 'center' },
					{ key: 'barcode', title: '条码', minWidth: 120, align: 'center' },
					{ key: 'box_standard', title: '箱规', align: 'center' },
				],
				data: [],
			},
			listData: {
				columns: [
					{ type: 'selection', width: 60, align: 'center' },
					{ type: 'index', title: '序号', width: 65, align: 'center' },
					{ key: 'delivery_object', title: '发货对象', minWidth: 180, align: 'center' },
					{
						key: 'order_sn',
						title: '样品订单编号',
						minWidth: 180,
						align: 'center',
						render: (h, params) => {
							return h(
								'a',
								{
									on: {
										click: () => {
											this.viewDetails(params.row.id, '详情')
										},
									},
								},
								params.row.order_sn
							)
						},
					},
					{
						key: 'order_time',
						title: '下单时间',
						minWidth: 145,
						align: 'center',
						render: (h, params) => {
							return h('span', params.row.order_time)
						},
					},
					{
						title: '货号',
						minWidth: 230,
						align: 'center',
						render: (h, params) => {
							return h(
								'div',
								{
									attrs: {
										class: 'item-style',
									},
								},
								[
									h(
										'ul',
										params.row.product.map(item => {
											return h('li', item.item_no)
										})
									),
								]
							)
						},
					},
					{
						title: '数量',
						width: 150,
						align: 'center',
						render: (h, params) => {
							return h(
								'div',
								{
									attrs: {
										class: 'item-style',
									},
								},
								[
									h(
										'ul',
										params.row.product.map(item => {
											return h('li', item.number)
										})
									),
								]
							)
						},
					},
					{
						title: '发货方式',
						minWidth: 120,
						align: 'center',
						render: (h, params) => {
							return h('span', params.row.delivery_mode)
						},
					},
					{
						title: '发货状态',
						minWidth: 120,
						align: 'center',
						render: (h, params) => {
							return h(
								'a',
								{
									on: {
										click: () => {
											this.sendDetails.modal = true
											this.sendDetails.showLoading = true
											this.logistics = []
											this.$api
												.orderSampleDeliveryDetail({ id: params.row.id })
												.then(res => {
													this.sendDetails.data = JSON.parse(JSON.stringify(res.data))
													let data = JSON.parse(JSON.stringify(res.data))
													if (!data.delivery.delivery_status) {
														data.delivery.delivery_status = ''
													}
													if (!data.delivery.confirm_delivery_time) {
														data.delivery.confirm_delivery_time = ''
													}
													if (!data.delivery.created_by) {
														data.delivery.created_by = ''
													}
													if (!data.delivery.delivery_mode) {
														data.delivery.delivery_mode = ''
													}
													if (!data.delivery.shortage_info) {
														data.delivery.shortage_info = ''
													}
													if (!data.delivery.remark) {
														data.delivery.remark = ''
													}
													data.logistics.map(item => {
														item.btnLoading = false
													})
													data.delivery.confirm_delivery_time = this.formatDate(data.delivery.confirm_delivery_time)
													data.delivery.delivery_mode = this.formatDeliveryMode(data.delivery.delivery_mode)
													data.delivery.delivery_status = this.formatDeliveryStatus(data.delivery.delivery_status)
													this.sendDetails.data = data
													this.sendDetails.logistics = this.sendDetails.data.logistics
													this.logistics = this.sendDetails.data.logistics
												})
												.finally(() => {
													this.sendDetails.showLoading = false
												})
										},
									},
								},
								params.row.delivery_status
							)
						},
					},
					{
						title: '处理状态',
						minWidth: 120,
						align: 'center',
						render: (h, params) => {
							return h('span', params.row.dispose_status)
						},
					},
					{ key: 'dispose_people_name', title: '处理人', minWidth: 120, align: 'center' },
					{
						title: '处理时间',
						minWidth: 145,
						align: 'center',
						render: (h, params) => {
							return h('span', params.row.dispose_time)
						},
					},
				],
				data: [],
			},
			loading: false,
			checkList: [],
			// 列表分页属性
			pageProps: {
				page: 1,
				perPage: 10,
				currentPage: 1,
				totalCount: 0,
			},
			formData: {},
			userList: [],
			loadingVisible: false,
			noticeList: {
				modal: false,
				value: '',
			},
			detailsList: {
				modal: false,
				loading: false,
				othersChildOrderModal: false,
				data: {
					delivery: {
						fileItems: [],
					},
					otherChildrenOrderInfo: [],
					orderProduct: [],
					backPoint: [],
					gift: [],
				},
			},
			// 物流公司
			fmsService: [],
			// 订单导出
			handlerOrderExport: {
				modal: false,
			},
			deliveryColumns: [
				{
					title: '物流单号',
					slot: 'orderLogisticsId',
					align: 'center',
					// render: (h, params) => {
					//   this.setList.orderLogistics[params.index] = params.row;
					//   this.setList.orderLogistics[params.index].orderLogisticsId = params.row.orderLogisticsId;
					//   return h(
					//     'div',
					//     this.$refs.myTable.$scopedSlots.orderLogisticsId({
					//       row: params.row,
					//       idx: params.row._index
					//     })
					//   )
					// }
				},
				{
					title: '快递公司',
					slot: 'company',
					align: 'center',
				},
				{
					title: '内容',
					key: 'content',
					align: 'center',
					width: 400,
					render: (h, params) => {
						this.setList.orderLogistics[params.index] = params.row
						this.setList.orderLogistics[params.index].content = params.row.content
						return h(
							'div',
							this.$refs.myTable.$scopedSlots.content({
								row: params.row,
								idx: params.row._index,
							})
						)
					},
				},
				{
					key: 'action',
					title: '操作',
					width: 100,
					align: 'center',
					slot: 'action',
				},
			],
			setList: {
				modal: false,
				loading: false,
				buttonLoading: false,
				orderLogistics: [
					// {
					//     order_logistics_id: '',
					//     courier_company: '',
					//     courier_company_id: '',
					//     content: ''
					// }
				],
				data: {
					fileItems: [],
					orderLogistics: [],
				},
				params: {},
			},
			handleList: {
				modal: false,
				loading: false,
				data: {},
				params: {
					ids: [],
					disposeStatus: '',
				},
			},
			disposeStatusList: [
				{ value: 'undisposed', label: '未处理' },
				{ value: 'disposed', label: '已处理' },
				{ value: 'exception_handling', label: '异常处理' },
			],
			orderSplitAudit: {
				modal: false,
				modal_loading: false,
				btn_loading: false,
				audit_search_loading: false,
				data: {
					parentOrder: {},
				},
				auditData: {
					audit_pass: null,
					auditor_id: null,
					remark: '',
				},
				auditList: [],
			},
			// 产品信息
			productCloumns: [
				{
					title: '产品名称',
					key: 'pro_name',
					align: 'center',
					minWidth: 120,
				},
				{
					title: '规格',
					key: 'standard',
					align: 'center',
				},
				{
					title: '单位',
					key: 'unit',
					align: 'center',
				},
				{
					title: '发货数量',
					key: 'number',
					align: 'center',
				},
				{
					title: '条码',
					key: 'barcode',
					align: 'center',
					minWidth: 100,
				},
				{
					title: '箱规',
					key: 'box_standard',
					align: 'center',
				},
			],
			// 物流弹窗数据
			sendDetails: {
				modal: false,
				showLoading: false,
				data: {
					delivery: {
						delivery_status: '',
						confirm_delivery_time: '',
						created_by: '',
					},
					logistics: [],
				},
				logisticsData: [],
			},
			logistics: [],
		}
	},
	computed: {
		deliveryNode: {
			get: function () {
				return this.sendDetails.data.delivery.delivery_mode === 'logistics' ? '物流' : '快递'
			},
			set: function (value) {
				return this.sendDetails.data.delivery.delivery_mod = value
			}
		}
	},
	methods: {
		init() {
			this.pageProps.page = 1
			this.pageProps.perPage = 10
			this.getList()
			// 加载所有权
			this.$api.getOwnership().then(res => {
				this.ownershipList = res
			})

			// 获取导单处理弹窗-处理人
			this.$api.loginMessage().then(res => {
				if (res.code === 0) {
					this.handleList.data.real_name = res.data.real_name
				}
			})
		},

		// 获取列表
		getList(type) {
			if (type == 'search') {
				this.pageProps.page = 1
			}
			this.loading = true
			let params = this.search
			params.page = this.pageProps.page
			params.perPage = this.pageProps.perPage
			for (let i in params) {
				if (!params[i]) delete params[i]
			}
			this.$api
				.sampleDeliveryList(params)
				.then(res => {
					this.listData.data = res.items
					if (res._meta) {
						this.pageProps.totalCount = res._meta.totalCount
						this.pageProps.currentPage = res._meta.currentPage
					}
				})
				.finally(() => {
					this.loading = false
				})
		},
		// 重置
		handleReset() {
			this.search = {}
			this.getList()
		},
		checkTable(selection) {
			this.checkList = selection
		},
		changePage(e) {
			this.pageProps.page = e
			this.getList()
		},
		changePageSize(e) {
			this.pageProps.perPage = e
			this.getList()
		},
		// 详情
		viewDetails(id) {
			this.detailsList.modal = true
			this.detailsList.loading = true
			this.$api
				.orderSampleDeliveryDetail({ id: id })
				.then(res => {
					if (res.code === 0) {
						this.detailsList.data = res.data
						this.orderData.data = res.data.allProduct || []
					}
				})
				.finally(() => {
					this.detailsList.loading = false
				})
		},
		closeModal(name) {
			this[name].modal = false
		},
		// 通知发货
		viewNotice() {
			if (this.checkList.length === 0) {
				this.$Message.error('请选择！')
				return false
			}
			let status = true
			for (let i in this.checkList) {
				if (this.checkList[i].delivery_status !== '待通知发货') {
					this.$Message.error('只能选择待通知发货状态的数据！')
					status = false
					return false
				}
			}
			if (status) {
				this.noticeList.modal = true
				this.formData.username = ''
				this.userList = []
			}
		},
		// 提交发货通知
		sumbitDeliveryNotice() {
			let order_list = []
			for (let i in this.checkList) {
				order_list.push(this.checkList[i].id)
			}
			let params = {}
			params.orderList = order_list
			params.username = this.formData.username
			if (params.username === undefined || params.username === '') {
				this.$Message.error('请输入工号/姓名！')
			} else {
				this.$api.NotificationOfDelivery(params).then(res => {
					if (res.code === 0) {
						this.$Message.success(res.message)
						this.getList()
					} else {
						this.$Message.error(res.message)
					}
				})
			}
		},
		// 发货设置
		viewSet() {
			if (this.checkList.length !== 1) {
				this.$Message.error('请选择一条数据！')
				return false
			}
			if (this.checkList[0].delivery_status === '已发货') {
				this.$Message.error('不能选择已发货的数据！')
				return false
			}
			let id = this.checkList[0].id
			this.setList.orderLogistics = []
			this.setList.data.orderLogistics = []
			this.$api.deliverSetDetail({ id: id }).then(res => {
				if (res.code === 0) {
					this.setList.data = res.data
					if (this.setList.data.orderLogistics !== undefined && this.setList.data.orderLogistics.length > 0) {
						this.setList.orderLogistics = this.setList.data.orderLogistics
					} else {
						this.setList.orderLogistics.push({
							orderLogisticsId: '',
							courierCompany: '',
							courierCompanyId: '',
							content: '',
						})
					}

					this.setList.modal = true
					if (this.setList.data.delivery_status === '已发货') {
						this.setList.data.isSend = '1'
					} else {
						this.setList.data.isSend = '0'
					}
				}
			})
		},
		/** 删除行 */
		removeRow(row) {
			this.setList.orderLogistics.splice(row._index, 1)
		},
		/** 添加行 */
		addRow() {
			this.setList.orderLogistics.push({
				orderLogisticsId: '',
				courierCompany: '',
				courierCompanyId: '',
				content: '',
			})

			this.$nextTick(() => {
				this.act = !this.act
			})
		},
		// 提交发货设置
		submitSet() {
			for (let i in this.setList.orderLogistics) {
				if (this.setList.orderLogistics[i].orderLogisticsId === '') {
					this.$Message.warning('请填写物流单号！')
					return false
				}
				if (this.setList.orderLogistics[i].courierCompany === '') {
					this.$Message.warning('请填写快递公司！')
					return false
				}
				if (this.setList.orderLogistics[i].courierCompanyId === '') {
					this.$Message.warning('请填写快递公司！')
					return false
				}
				if (this.setList.orderLogistics[i].content === '') {
					this.$Message.warning('请填写物流内容！')
					return false
				}
			}
			this.setList.data.orderLogistics = this.setList.orderLogistics
			this.setList.data.shortageInfo = this.setList.data.shortage_info

			let params = this.setList.data

			params.id = this.setList.data.order_id
			params.deliveryMode = this.setList.data.delivery_mode == '快递' ? 'express' : 'logistics'

			if (params.isSend === undefined) {
				this.$Message.error('确认发货为必填字段！')
				return false
			}
			// 后端要求不传确认时间字段
			delete params.confirm_delivery_time
			this.setList.buttonLoading = true

			this.$api.submitSet(params).then(res => {
				this.setList.buttonLoading = false
				if (res.code === 0) {
					this.$Message.success(res.message)
				} else {
					this.$Message.error(res.message)
				}
				this.setList.modal = false
				this.setList.data = {
					fileItems: [],
				}

				this.getList()
			})
		},
		// 确认发货单选框change
		isSendChange(value) {
			if (value === '1') {
				let timestamp = this.formatDate(Date.parse(new Date()) / 1000)
				this.setList.data.confirm_delivery_time = timestamp
			} else {
				this.setList.data.confirm_delivery_time = ''
			}
		},
		// 下载出货单
		downlodaSales(id) {
			this.$api.sampleDeliveryExport({ id: id }).then(res => {
				if (res.code === 0) {
					window.location.href = res.data[0]
				}
			})
		},

		//发货设置-物流设置   快递公司信息绑定
		changeCourierCompany(arr, index) {
			for (let i in this.fmsService) {
				if (arr.value == this.fmsService[i].courier_company_id) {
					this.setList.orderLogistics[index].courierCompany = arr.label
				}
			}
		},

		// 导单处理
		viewHandle() {
			if (this.checkList.length === 0) {
				this.$Message.error('请选择！')
				return false
			}
			this.handleList.params.disposeStatus = this.checkList[0].dispose_status
			this.handleList.modal = true
		},
		// 选择订单处理状态
		changeStatus(e) {
			// console.log(e);
			// console.log(this.exportArr.dispose_status);
		},
		// 选择日期
		getDate(e) {
			this.exportArr.startTime = e[0]
			this.exportArr.endTime = e[1]
		},
		// 订单导出
		orderExport() {
			this.handlerOrderExport.modal = true
		},
		//订单拆分
		orderSplit() {
			if (this.checkList.length !== 1) {
				this.$Message.error('请选择一条数据！')
				return false
			}
			if (
				this.formatDeliveryStatusEnglish(this.checkList[0].delivery_status) !== 'delivery_pending_notice' ||
				this.checkList[0].parent_order_id !== '0'
			) {
				this.$Message.error('仅在待通知发货状态下且没拆分过才可进行订单拆分！')
				return false
			}
			this.$router.push({ path: './sample-deliver-split', query: { id: this.checkList[0].id, type: 'add' } })
		},
		// 审核不通过修改子订单
		editOrderSplit(fatherOrderId) {
			this.detailsList.modal = false
			this.$router.push({ path: './sample-deliver-split', query: { id: fatherOrderId, type: 'edit' } })
		},
		//打开拆单审核模态框
		openOrderSplitModal() {
			if (this.checkList.length !== 1) {
				this.$Message.error('请选择一条数据！')
				return false
			}
			if (this.formatDeliveryStatusEnglish(this.checkList[0].delivery_status) !== 'wait_separate_audit') {
				this.$Message.error('仅在待拆单审核状态才能进行审核！')
				return false
			}
			this.orderSplitAudit.modal = true
			this.orderSplitAudit.modal_loading = true
			this.$api
				.orderSampleDeliveryDetail({ id: this.checkList[0].id })
				.then(res => {
					if (res.code === 0) {
						this.orderSplitAudit.data = res.data
					}
				})
				.finally(() => {
					this.orderSplitAudit.modal_loading = false
				})
		},
		// 拆单审核审核人模糊搜索
		searchAuditList(val) {
			this.orderSplitAudit.audit_search_loading = true
			this.$api
				.salesmanData({ username: val })
				.then(res => {
					if (res.code === 0) {
						this.orderSplitAudit.auditList = res.data
					}
				})
				.finally(() => {
					this.orderSplitAudit.audit_search_loading = false
				})
		},
		orderSplitAuditSubmit() {
			if (this.orderSplitAudit.auditData.audit_pass == null || this.orderSplitAudit.auditData.auditor_id == null) {
				this.$Message.warning('必填不能为空')
				return
			}
			let postData = {
				parentOrderId: this.orderSplitAudit.data.parent_order_id,
				audit_pass: this.orderSplitAudit.auditData.audit_pass,
				auditor_id: this.orderSplitAudit.auditData.auditor_id,
				remark: this.orderSplitAudit.auditData.remark,
			}
			this.orderSplitAudit.btn_loading = true
			this.$api
				.sampleSeparateOrderAudit(postData)
				.then(res => {
					if (res.code === 0) {
						this.$Message.success('审核成功！')
						this.orderSplitAudit.modal = false
						this.getList()
						// 清空上次审核数据
						this.orderSplitAudit.auditData = {
							audit_pass: null,
							auditor_id: null,
							remark: '',
						}
					} else {
						this.$Message.error('审核失败！')
					}
				})
				.finally(() => {
					this.orderSplitAudit.btn_loading = false
				})
		},
		// 提交订单导出
		submitOrderExport() {
			if (this.exportArr.disposeStatus) {
				let params = this.exportArr
				this.$api.orderExport(params).then(res => {
					if (res.code === 0) {
						this.$Message.success(res.message)
						window.location.href = res.data.url
						this.handlerOrderExport.modal = false
					}
				})
			} else {
				this.$Message.warning('请选择处理状态')
				return false
			}
		},
		// 提交导单处理
		submitHandle() {
			this.handleList.params.ids = []
			for (let i in this.checkList) {
				this.handleList.params.ids.push(this.checkList[i].id)
			}
			if (this.handleList.params.disposeStatus !== '') {
				let params = this.handleList.params
				params.disposeStatus = this.formatDisposeStatusEnglish(this.handleList.params.disposeStatus)
				this.$api.orderDeliverHandle(params).then(res => {
					if (res.code === 0) {
						this.$Message.success(res.message)
						this.handleList.modal = false
						this.getList()
					}
				})
			} else {
				this.$Message.error('请选择处理状态！')
			}
		},

		// 搜索用户列表
		queryUser(value) {
			this.loadingVisible = true
			this.$api.user({ username: value }).then(res => {
				this.loadingVisible = false
				if (res.items.length !== 0) {
					this.userList = res.items
				}
			})
		},

		// 选择用户列表
		selectUser(obj) {
			let list = this.userList.filter(n => {
				return obj.label === n.real_name && obj.value === n.username
			})
			if (list.length > 0) {
				this.formData.reviewer = list[0].real_name
				this.formData.reviewer_id = list[0].id
			}
		},

		// 转化时间
		formatDate(time, json) {
			if (json) {
				return this.$format(time, 'yyyy-MM-dd')
			} else {
				return this.$format(time, 'yyyy-MM-dd hh:mm')
			}
		},
		// 转化发货方式
		formatDeliveryMode(way) {
			for (let i in this.wayList) {
				if (way === this.wayList[i].key) {
					return this.wayList[i].value
				}
			}
		},
		// 转化发货状态
		formatDeliveryStatus(status) {
			for (let i in this.statusList) {
				if (status === this.statusList[i].key) {
					return this.statusList[i].value
				}
			}
		},
		// 转化发货状态（中转英）
		formatDeliveryStatusEnglish(status) {
			for (let i in this.statusList) {
				if (status === this.statusList[i].value) {
					return this.statusList[i].key
				}
			}
		},
		// 转化支付方式
		formatPayment(payment) {
			for (let i in this.paymentList) {
				if (payment === this.paymentList[i].key) {
					return this.paymentList[i].value
				}
			}
		},
		// 转化订单来源
		formatOrigin(origin) {
			for (let i in this.originList) {
				if (origin === this.originList[i].key) {
					return this.originList[i].value
				}
			}
		},
		// 转化处理状态
		formatDisposeStatus(status) {
			for (let i in this.disposeStatusList) {
				if (status === this.disposeStatusList[i].value) {
					return this.disposeStatusList[i].label
				}
			}
		},
		// 转化处理状态(中转英)
		formatDisposeStatusEnglish(status) {
			let res = this.disposeStatusList.filter(item => {
				return item.label == status
			})
			return res[0].value
		},
		// 上传文件成功
		importSuccess(res, file) {
			this.isShowProgress = false
			// 上传成功
			if (res.code === 0) {
				this.$Message.success(res.message)
				this.setList.data.fileItems = []
				this.setList.data.fileItems.push(res.data)
			} else {
				let desc = ''
				if (res.data !== '') {
					let arr = []
					for (let i in res.data) {
						arr.push(res.data[i])
					}
					desc = JSON.stringify(arr.join())
				} else {
					desc = res.message
				}
				this.$Notice.error({
					title: '导入失败！',
					desc: res.message,
				})
			}
		},

		// 文件的格式验证
		fileFormatError(file) {
			this.$Notice.error({
				title: '文件格式错误',
				desc: JSON.stringify(file),
			})
		},

		// 文件上传限制
		fileMaxSize(file) {
			this.$Notice.warning({
				title: '超出文件大小限制',
				desc: '文件 ' + file.name + ' 太大，不能超过 50M。',
			})
		},

		// 文件上传成功的进度条
		importProgress(event, file) {
			if (!event) return
			this.isShowProgress = true
			// 延迟一下，接收有bug
			setTimeout(() => {
				if (file.status === 'fail') {
					this.$Notice.error({
						title: '文件异常!',
					})
				}
			}, 1000)
			if (file.percentage === 100) {
				this.isShowProgress = false
			}
			this.percentProgress = event.percent
		},
		// 查看物流
		viewLogistics(id, index) {
			this.logistics[index].btnLoading = true
			this.$api.orderDeliveryQuery({ expressNum: id }).then(res => {
				// this.sendDetails.data.logistics[index].btnLoading = false;
				this.logistics[index].btnLoading = false

				if (!res.data.list || res.data.list.length == 0) {
					let json = {
						content: res.data.msg,
					}
					if (res.data.list) {
						json.isEmpty = true
					}
					if (!res.data.list) {
						json.isError = true
					}
					this.logistics[index].viewData = []
					this.logistics[index].isOpen = true
					this.logistics[index].viewData.push(json)
					return false
				}
				if (res.data.list !== undefined && res.data.list.length > 0) {
					let newArr = res.data.list

					this.logistics[index].viewData = []
					newArr.map(item => {
						let arr = item.time.split(' ')
						for (let i in arr) {
							// 月份
							if (i == 0) {
								let monData = arr[i].split('-')
								item.mon = monData[1] + '-' + monData[2]
							}
							// 时分
							if (i == 1) {
								let hourData = arr[i].split(':')
								item.hour = hourData[0] + ':' + hourData[1]
							}
						}
						this.logistics[index].viewData.push(item)
					})
				}
				this.logistics[index].isOpen = true
			})
		},
		// 关闭物流
		closeLogistics(index) {
			let data = this.logistics[index]
			data.viewData = []
			data.isOpen = false
			this.$set(this.logistics, index, data)
		},
	},
	activated() {
		let status = this.$route.query.delivery_status
		if (status) {
			this.search.delivery_status = status
		}else{
			this.search.delivery_status = ''

    }
		this.init()
		// 挂载物流公司
		this.fmsService = FMS
		// this.addRow();
	},
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

.ivu-table-row th {
	text-align: center;
	color: #515a6e;
	font-size: 12px;
	font-weight: 100;
}

.delivery-wrapper {
	overflow: visible;
}

.item {
	margin-top: 35px;
}

.item-required::before {
	content: '*';
	display: inline-block;
	margin-right: 4px;
	line-height: 1;
	font-family: SimSun;
	font-size: 14px;
	color: #ed4014;
}
</style>
