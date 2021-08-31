<template>
	<div>
		<Card>
			<!-- 上半部分 -->
			<Row slot="title">
				<Col :sm="24" @keydown.native.enter.prevent="getList('search')">
					<!-- 查询 -->
					<Form ref="search" :model="search" class="search">
						<FormItem>
							<Select placeholder="所有权" @on-change="getList('search')" clearable v-model="search.ownership">
								<Option
									v-for="item in ownershipList"
									:value="item.ownership"
									:key="item.ownership"
									:label="item.label"
								></Option>
							</Select>
						</FormItem>

						<FormItem>
							<Input v-model="search.platform" placeholder="商家" clearable />
						</FormItem>
						<FormItem>
							<Input v-model="search.order_number" placeholder="订单号" clearable />
						</FormItem>
						<FormItem>
							<Select placeholder="发货状态" @on-change="getList('search')" clearable v-model="search.deliver_status">
								<Option
									v-for="option in statusList"
									:key="'user' + option.key"
									:value="option.key"
									:label="option.value"
								></Option>
							</Select>
						</FormItem>

						<FormItem>
							<Select placeholder="处理状态" @on-change="getList('search')" clearable v-model="search.deal_status">
								<Option
									v-for="(option, index) in disposeStatusList"
									:key="index"
									:value="option.value"
									:label="option.label"
								></Option>
							</Select>
						</FormItem>
						<!-- 查询重置 -->
						<FormItem style="float: right;">
							<Button type="primary" icon="md-search" style="padding: 4px 15px" @click="getList('search')">查询</Button>
							<Button icon="md-repeat" style="padding: 4px 15px" @click="handleReset('search')">重置</Button>
						</FormItem>
					</Form>
				</Col>
				<Col :sm="24">
					<Col :sm="24">
						<Button type="success" icon="ios-list-box-outline" @click="viewNotice">通知发货</Button>
						<Button type="success" icon="ios-create-outline" @click="viewSet">发货设置</Button>
						<Button type="success" icon="ios-create-outline" @click="viewHandle">导单处理</Button>
						<Button type="success" icon="ios-download-outline" @click="orderExport">订单导出</Button>
						<Progress v-show="isShowProgress" :percent="percentProgress"></Progress>
					</Col>
				</Col>
				<!-- 发货通知完成中 -->
				<Modal v-model="noticeList.modal" :loading="noticeList.loading" title="发货通知">
					<Form>
						<FormItem label="通知仓配中心发货处理:">
							<Select
								:remote-method="queryUser"
								:label="formData.reviewer"
								v-model="formData.username"
								filterable
								remote
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
					<div slot="footer">
						<Button type="primary" @click="sumbitDeliveryNotice" :loading="noticeList.loading">确定</Button>
					</div>
				</Modal>
				<!-- 发货设置 -->
				<Modal v-model="setList.modal" :loading="setList.loading" title="发货设置" width="1000">
					<div class="rel">
						<div class="ivu-table-wrapper">
							<div class="ivu-table ivu-table-small ivu-table-border">
								<div class="ivu-table-body">
									<table cellspacing="0" cellpadding="0" border="0" width="100%">
										<tr class="ivu-table-row">
											<td colspan="2" class="head-bg">
												<div class="ivu-table-cell">订单号</div>
											</td>
											<td colspan="8">
												<span v-text="setList.data.order_number"></span>
											</td>
										</tr>
										<!-- <tr class="ivu-table-row">
                      <td colspan="2" class="head-bg">
                        <div class="ivu-table-cell">下载出货单</div>
                      </td>
                      <td colspan="8">
                        <a @click="downlodaSales(setList.data.id)">出货单</a>
                      </td>
                    </tr>-->
										<tr class="ivu-table-row">
											<td colspan="2" class="head-bg">
												<div class="ivu-table-cell">上传物流单</div>
											</td>
											<td colspan="3">
												<Upload
													name="UploadForm[file]"
													:action="fileUploadMaterial"
													:headers="fileUploadHeaders"
													:show-upload-list="false"
													:max-size="51200"
													:on-progress="importProgress"
													:on-success="importSuccess"
													:on-exceeded-size="fileMaxSize"
													style="margin-left:1px;display:inline-block"
												>
													<!--  验证文件 -->
													<!-- :format="['xlsx']" -->
													<!--   文件格式错误-->
													<!-- :on-format-error="fileFormatError" -->
													<Button icon="ios-cloud-upload-outline">上传</Button>
												</Upload>

												<a
													v-if="setList.data.fileItem.length === 0 ? false : 1"
													:href="setList.data.fileItem[0].url_show"
													>{{ setList.data.fileItem[0].title }}.{{ setList.data.fileItem[0].extension }}</a
												>
											</td>

											<td colspan="2">发货方式</td>
											<td colspan="3">
												<RadioGroup v-model="setList.data.transport">
													<Radio label="express">
														<span>快递</span>
													</Radio>
													<Radio label="logistics">
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
												<RadioGroup
													v-model="setList.data.is_deliver"
													@on-change="isSendChange(setList.data.is_deliver)"
												>
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
												<span v-text="formatDate(setList.data.confirm_deliver_time)"></span>
											</td>
										</tr>
										<tr class="ivu-table-row">
											<td colspan="2" class="head-bg">
												<div class="ivu-table-cell">缺货信息</div>
											</td>
											<td colspan="8">
												<Input v-model="setList.data.stock_out" placeholder="请输入" style="width: 400px;" />
											</td>
										</tr>
										<tr class="ivu-table-row">
											<td colspan="2" class="head-bg">
												<div class="ivu-table-cell">其他异常</div>
											</td>
											<td colspan="8">
												<Input v-model="setList.data.other_abnormal" placeholder="请输入" style="width: 400px;" />
											</td>
										</tr>
									</table>
								</div>
							</div>
						</div>
						<Divider>物流设置</Divider>
						<Table
							ref="myTable1"
							border
							:columns="deliveryColumns"
							:data="setList.logistics_set"
							class="delivery-wrapper"
						>
							<template slot="order_logistics_id" slot-scope=""></template>
							<template slot="company" slot-scope=""></template>
							<template slot="content" slot-scope=""></template>
							<template slot="action" slot-scope="">
								<!-- <template slot-scope="{ row }" slot="action">
								<Tooltip placement="top" content="编辑" transfer>
                  <Button icon="md-add" @click="addRow()" v-if="row._index === 0"></Button>
                  <Button icon="md-remove" @click="removeRow(row)" v-else></Button>
                </Tooltip> -->
							</template>
						</Table>
					</div>
					<div slot="footer">
						<Button type="primary" @click="submitSet" :loading="setList.buttonLoading">提交</Button>
					</div>
				</Modal>

				<!-- 导单处理 -->
				<Modal v-model="handleList.modal" :loading="handleList.loading" title="导单处理" width="1000">
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
														<RadioGroup v-model="handleList.params.deal_status">
															<Radio label="normal-deal">已处理</Radio>
															<Radio label="no-deal">未处理</Radio>
															<Radio label="exception-deal">异常处理</Radio>
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
						<Button type="primary" :loading="handleList.loading" @click="submitHandle">提交</Button>
					</div>
				</Modal>
				<!-- 订单导出 -->
				<Modal
					v-model="handlerOrderExport.modal"
					:loading="handlerOrderExport.loading"
					title="已审核订单导出"
					width="800"
				>
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
						<Row>
							<Col span="12" offset="6">
								处理状态：
								<Select v-model="exportArr.deal_status" @on-change="changeStatus" style="width:120px">
									<Option
										v-for="item in handlerStatusList"
										:value="item.key"
										:key="item.key"
										:label="item.value"
									></Option>
								</Select>
								<span>（必选条件）</span>
							</Col>
						</Row>
					</div>

					<div slot="footer">
						<Button type="default" @click="closeModal('handlerOrderExport')">关闭</Button>
						<Button type="primary" :loading="handlerOrderExport.loading" @click="submitOrderExport">提交</Button>
					</div>
				</Modal>
			</Row>
			<!-- 表格 -->
			<Row class="margin-top-10" style="clear: both;">
				<Table
					border
					highlight-row
					:columns="listData.columns"
					:data="listData.data"
					@on-selection-change="checkTable"
					:loading="loading"
					size="small"
				></Table>
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
			</Row>
		</Card>

		<!-- 物流弹窗 -->
		<Modal v-model="sendDetails.modal" :loading="handleList.loading" title="发货详情" width="800" class="modal-height">
			<div class="rel">
				<Form label-position="top">
					<Row>
						<Col :md="6">
							<FormItem label="订单编号">
								<Input :value="sendDetails.data.order_number" disabled clearable />
							</FormItem>
						</Col>
						<Col :md="6">
							<FormItem label="平台">
								<Input v-model="sendDetails.data.platform" disabled clearable />
							</FormItem>
						</Col>
						<Col :md="6">
							<FormItem label="发货仓库">
								<Input v-model="sendDetails.data.delivery_warehouse" disabled clearable />
							</FormItem>
						</Col>
						<Col :md="6">
							<FormItem label="发货状态">
								<template v-if="sendDetails.data.status">
									<Input :value="sendDetails.data.status" disabled />
								</template>
								<Input v-else value="暂无" disabled />
							</FormItem>
						</Col>

						<Col :md="6">
							<FormItem label="确认发货时间">
								<template v-if="sendDetails.data.confirm_deliver_time">
									<Input v-model="sendDetails.data.confirm_deliver_time" disabled />
								</template>
								<Input v-else value="暂无" disabled />
							</FormItem>
						</Col>
						<Col :md="6">
							<FormItem label="发货人">
								<template v-if="sendDetails.data.noticed_by">
									<Input v-model="sendDetails.data.noticed_by" disabled />
								</template>
								<Input v-else value="暂无" disabled />
							</FormItem>
						</Col>
						<Col :md="6">
							<FormItem label="发货方式">
								<template v-if="sendDetails.data.transport">
									<Input v-model="transport" disabled />
									
								</template>
								<Input v-else value="暂无" disabled />
							</FormItem>
						</Col>
						<Col :md="6">
							<FormItem label="缺货信息">
								<template v-if="sendDetails.data.stock_out">
									<Input v-model="sendDetails.data.stock_out" disabled />
								</template>
								<Input v-else value="暂无" disabled />
							</FormItem>
						</Col>
						<Col :md="6">
							<FormItem label="其他异常">
								<template v-if="sendDetails.data.other_abnormal">
									<Input v-model="sendDetails.data.other_abnormal" disabled />
								</template>
								<Input v-else value="暂无" disabled />
							</FormItem>
						</Col>
						<Col :md="8">
							<FormItem label="物流单附件">
								<template v-if="sendDetails.data.fileItem">
									<a
										:href="file + '/' + item.url"
										v-for="(item, index) in sendDetails.data.fileItem"
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
								<Input v-model="logItem.logistics_no" disabled clearable />
							</FormItem>
						</Col>
						<Col :md="6">
							<FormItem label="快递公司">
								<Input v-model="logItem.company" disabled clearable />
							</FormItem>
						</Col>
						<Col :md="12">
							<FormItem label="内容">
								<Input v-model="logItem.content" disabled clearable style="width: 70%;" />
								<Button
									type="primary"
									@click="viewLogistics(logItem.logistics_no, logIndex)"
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
	name: 'deliver',
	//   单引号-----
	data() {
		return {
			// 首页加载动画
			loading: false,
			// 导单处理
			handleList: {
				modal: false,
				loading: false,
				data: {
					real_name: '',
				},
				params: {
					id: '',
					deal_status: '',
				},
			},
			// 上表单数据
			search: {
				platform: '', //商家
				order_number: '', //订单编号
				deliver_status: '', //发货状态
				deal_status: '处理状态',
				ownership: '', //所有权
				// 公司所以权
				cityList: [
					{
						value: 'beijing',
						label: '公司所有权',
					},
					{
						value: 'shanghai',
						label: '部门所有权',
					},
					{
						value: 'shanghai1',
						label: '我的所有权',
					},
				],
			},
			// 表单通知发货
			formData: {
				delivery_ids: '',
				username: '',
			},
			userList: [],
			loadingVisible: false,
			// 发货通知
			noticeList: {
				loading: false,
				reviewer: '',
				username: '',
				modal: false,
				value: '',
			},
			// 物流设置
			setList: {
				modal: false,
				loading: false,
				buttonLoading: false,
				// 必填信息单
				logistics_set: [
					{
						logistics_no: '', //物流单号
						company: '', //快递公司

						content: '', //内容
					},
				],
				data: {
					logistics_set: [],

					fileItem: [],

					transport: '', //快递公司

					confirm_deliver_time: '', //确认时间
				},
				params: {},
			},
			isShowProgress: false,
			percentProgress: 0,

			// 下表单数据
			act: false, // 用于触发渲染
			spinShow: false,
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
				{ key: 'no-deal', value: '未处理' },
				{ key: 'normal-deal', value: '已处理' },
				{ key: 'exception-deal', value: '异常处理' },
			],
			exportArr: {
				deal_status: '',
				start_time: '',
				end_time: '',
			},
			// 订单导出
			handlerOrderExport: {
				modal: false,
				loading: false,
			},
			originList: [
				{ key: 'MiniProgram', value: '小程序' },
				{ key: 'backstage', value: '后台添加' },
			],
			statusList: [
				{ key: 'wait-notice-delivery', value: '待通知发货' },
				{ key: 'to-deliver', value: '待发货' },
				{ key: 'delivered', value: '已发货' },
			],
			wayList: [
				{ key: 'logistics', value: '物流' },
				{ key: 'express', value: '快递' },
			],

			listData: {
				columns: [
					{ type: 'selection', width: 60, align: 'center' },
					{
						type: 'index',
						title: '序号',
						width: 65,
						align: 'center',
					},
					{
						key: 'platform',
						title: '商家名称',
						minWidth: 180,
						align: 'center',
					},
					{
						key: 'order_number',
						title: '订单编号',
						minWidth: 180,
						align: 'center',
						render: (h, params) => {
							return h(
								'a',
								{
									on: {
										click: () => {
											this.$router.push({
												path: '/order-management/outside-calls-deliver-details',
												query: { id: params.row.id },
											})
										},
									},
								},
								params.row.order_number
							)
						},
					},
					{
						key: 'order_time',
						title: '下单时间',
						minWidth: 145,
						align: 'center',
						render: (h, params) => {
							return h('span', this.formatDate(params.row.order_time, 'ymd'))
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
										params.row.stockUp.map(item => {
											return h('li', item.article_number)
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
										params.row.stockUp.map(item => {
											return h('li', item.apply_number)
										})
									),
								]
							)
						},
					},

					{
						key: 'transport',
						title: '发货方式',
						minWidth: 120,
						align: 'center',
						render: (h, params) => {
							return h('span', params.row.transport == 'express' ? '快递' : '物流')
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
												.deliveryDeliver({ id: params.row.id })
												.then(res => {
													this.sendDetails.data = JSON.parse(JSON.stringify(res.data))
													let data = JSON.parse(JSON.stringify(res.data))
													// if (!data.delivery_status) {
													// 	data.delivery_status = ''
													// }
													// if (!data.delivery.confirm_delivery_time) {
													// 	data.delivery.confirm_delivery_time = ''
													// }
													// if (!data.delivery.created_by) {
													// 	data.delivery.created_by = ''
													// }
													// if (!data.delivery.delivery_mode) {
													// 	data.delivery.delivery_mode = ''
													// }
													// if (!data.delivery.shortage_info) {
													// 	data.delivery.shortage_info = ''
													// }
													// if (!data.delivery.remark) {
													// 	data.delivery.remark = ''
													// }
													if (data.logistics_set) {
														data.logistics_set.map(item => {
															item.btnLoading = false
														})
													}

													// data.delivery.confirm_delivery_time = this.formatDate(data.delivery.confirm_delivery_time)
													// data.delivery.delivery_mode = this.formatDeliveryMode(data.delivery.delivery_mode)
													// data.delivery_status = this.formatDeliveryStatus(data.delivery_status)
													this.sendDetails.data = data
													this.sendDetails.logistics = this.sendDetails.data.logistics_set
													this.logistics = this.sendDetails.data.logistics_set
												})
												.finally(() => {
													this.sendDetails.showLoading = false
												})
										},
									},
								},
								this.formatDeliveryStatus(params.row.deliver_status)
							)
						},
					},
					{
						title: '处理状态',
						minWidth: 120,
						align: 'center',
						render: (h, params) => {
							return h('span', this.formatDisposeStatus(params.row.deal_status))
						},
					},
					{
						key: 'deal_by',
						title: '处理人',
						minWidth: 120,
						align: 'center',
					},
					{
						title: '处理时间',
						minWidth: 145,
						align: 'center',
						render: (h, params) => {
							return h('span', this.formatDate(params.row.deal_time, 'ymd'))
						},
					},
				],
				data: [],
			},
			disposeStatusList: [
				{ value: 'no-deal', label: '未处理' },
				{ value: 'normal-deal', label: '已处理' },
				{ value: 'exception-deal', label: '异常处理' },
			],
			// 列表分页属性
			pageProps: {
				page: 1,
				perPage: 10,
				currentPage: 1,
				totalCount: 0,
			},
			// 选中
			checkList: [],
			// 物流公司
			fmsService: [],

			// 设置物流
			deliveryColumns: [
				{
					title: '物流单号',
					key: 'logistics_no',
					align: 'center',
					render: (h, params) => {
						return h('Input', {
							props: {
								value: params.row.logistics_no,
							},
							on: {
								input: e => {
									this.setList.logistics_set[params.index].logistics_no = e
								},
							},
						})
					},
				},
				{
					title: '快递公司',
					key: 'company',
					align: 'center',
					render: (h, params) => {
						return h(
							'Select',
							{
								props: {
									value: params.row.company,
								},
								on: {
									'on-change': e => {
										this.setList.logistics_set[params.index].company = e
									},
								},
							},
							this.fmsService.map(function(type) {
								return h(
									'Option',
									{
										props: {
											value: type.courier_company,
											key: type.courier_company_id,
											label: type.courier_company,
										},
									},
									type.courier_company
								)
							})
						)
					},
				},
				{
					title: '内容',
					key: 'content',
					align: 'center',
					width: 400,
					render: (h, params) => {
						return h('Input', {
							props: {
								value: params.row.content,
							},
							on: {
								input: e => {
									this.setList.logistics_set[params.index].content = e
								},
							},
						})
					},
				},
				// {
				//   key: 'action',
				//   title: '操作',
				//   width: 100,
				//   align: 'center',
				//   slot: 'action',
				// },
			],
			prorstse: {},
			test: '',
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
	methods: {
		// 加载所有权

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
		// 查询
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
				.warehouseDeliverlist(params)
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
		// 发货通知
		viewNotice() {
			if (this.checkList.length === 0) {
				this.$Message.error('请选择！')
				return false
			}
			let status = true
			for (let i in this.checkList) {
				// 需要循环去判断当前选中的列表中有没有通知发货 如果有其他的弹出提醒
				if (this.formatDeliveryStatus(this.checkList[i].deliver_status) !== '待通知发货') {
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
		//发货设置
		viewSet() {
			this.setList.buttonLoading = false
			if (this.checkList.length !== 1) {
				this.$Message.error('请选择一条数据！')
				return false
			}
			let isStatus = this.formatDeliveryStatus(this.checkList[0].deliver_status)
			if (isStatus === '已发货') {
				this.$Message.error('不能选择已发货的数据！')
				return false
			}

			// if (this.formatDeliveryStatus(this.checkList[0].deliver_status) === '待发货') {
			let id = this.checkList[0].id
			this.setList.data.logistics_set = []
			this.setList.logistics_set = []
			this.$api.shippingInformation({ id: id }).then(res => {
				if (res.code === 0) {
					this.setList.data = res.data
					this.setList.data.fileItem = res.data.fileItem

					// 测试
					if (this.setList.data.logistics_set === null) {
						this.setList.data.logistics_set = []
					}

					if (this.setList.data.logistics_set.length > 0 && this.setList.data.logistics_set !== null) {
						// this.setList.logistics_set = this.setList.data.logistics_set
						// 产品要显示单条数据
						this.setList.logistics_set = [this.setList.data.logistics_set[0]]
					} else {
						this.setList.logistics_set.push({
							logistics_no: '',
							company: '',
							content: '',
						})
					}
					this.setList.modal = true

					if (this.setList.data.is_deliver === '1') {
						this.setList.data.is_deliver = '1'
					} else {
						this.setList.data.is_deliver = '0'
					}
					if (this.setList.data.transport === 'logistics') {
						this.setList.data.transport = 'logistics'
					} else {
						this.setList.data.transport = 'express'
					}
				}
			})
			// } else {
			// 	this.$Message.error('只能选择待发货状态的数据！')
			// }
		},
		// 提交发货通知
		sumbitDeliveryNotice() {
			let order_list = []
			for (let i in this.checkList) {
				order_list.push(this.checkList[i].id)
			}
			// 把每一项选中的id添加到order_list数组中
			let params = {}
			params.delivery_ids = order_list.toString()

			params.username = this.formData.username

			if (params.username === undefined || params.username === '') {
				this.$Message.error('请输入工号/姓名！')
			} else {
				this.noticeList.loading = true
				this.$api.notificationShipment(params).then(res => {
					this.noticeList.loading = false
					this.noticeList.modal = false
					if (res.code === 0) {
						this.$Message.success(res.message)
						this.noticeList.loading = true
						this.getList()
					} else {
						this.$Message.error(res.message)
						this.noticeList.loading = true
						this.getList()
					}
				})
			}
		},
		// 删除行
		removeRow(row) {
			this.setList.logistics_set.splice(row._index, 1)
		},
		/** 添加行 */
		addRow() {
			this.setList.logistics_set.push({
				logistics_no: '',
				company: '',
				content: '',
			})

			this.$nextTick(() => {
				this.act = !this.act
			})
		},
		// 导单处理
		viewHandle() {
			if (this.checkList.length === 0) {
				this.$Message.error('请选择！')
				return false
			}
			this.handleList.params.deal_status = ''
			this.handleList.modal = true
		},
		// 选择日期
		getDate(e) {
			this.exportArr.start_time = e[0]
			this.exportArr.end_time = e[1]
		},
		//时间转化
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
		//   重置按钮
		handleReset() {
			this.search = {}
			this.getList()
		},
		// 表单打勾
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
		// 取消
		// 下载出货单
		// downlodaSales(id) {
		//   this.$api.downlodaOrder({ id: id }).then((res) => {
		//     if (res.code === 0) {
		//       window.location.href = res.data[0]
		//     }
		//   })
		// },
		// 确认发货单选框change
		isSendChange(value) {
			if (value === '1') {
				// let timestamp = (Date.parse(new Date()) / 1000).toString()
				// this.setList.data.confirm_deliver_time = timestamp
				// 确认时间
				// this.setList.data.confirm_deliver_time = ''
			} else {
				// this.setList.data.confirm_deliver_time = ''
			}
		},
		// 导单提交
		// submitHandle() {
		// 	this.handleList.params.id = []
		// 	for (let i in this.checkList) {
		// 		this.handleList.params.id.push(this.checkList[i].id)
		// 	}

		// },
		// 导单处理
		viewHandle() {
			if (this.checkList.length === 0) {
				this.$Message.error('请选择！')
				return false
			}

			this.handleList.params.deal_status = this.checkList[0].deal_status
			this.handleList.modal = true
		},
		// 选择日期
		getDate(e) {
			this.exportArr.start_time = e[0]
			this.exportArr.end_time = e[1]
		},
		//时间转化
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
		//   重置按钮
		handleReset() {
			this.search = {}
			this.getList()
		},
		// 表单打勾
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
		// 取消
		// 下载出货单
		// downlodaSales(id) {
		//   this.$api.downlodaOrder({ id: id }).then((res) => {
		//     if (res.code === 0) {
		//       window.location.href = res.data[0]
		//     }
		//   })
		// },
		// 确认发货单选框change
		isSendChange(value) {
			if (value === '1') {
				// let timestamp = (Date.parse(new Date()) / 1000).toString()
				// this.setList.data.confirm_deliver_time = timestamp
				// 确认时间
				// this.setList.data.confirm_deliver_time = ''
			} else {
				// this.setList.data.confirm_deliver_time = ''
			}
		},
		// 导单提交
		submitHandle() {
			this.handleList.params.id = []
			for (let i in this.checkList) {
				this.handleList.params.id.push(this.checkList[i].id)
			}
			if (this.handleList.params.deal_status !== '') {
				this.handleList.params.id = this.handleList.params.id.toString()
				let params = this.handleList.params
			}
			const params = this.handleList.params
			this.$api.deliveryDealing(params).then(res => {
				this.$Message.success("操作成功")
			}).catch(err => {
				this.$Message.error('操作失败'+er)
			})
			this.$nextTick(() => {
				this.act = !this.act
			})
		},
		// 提交订单导出
		submitOrderExport() {
			if (this.exportArr.deal_status) {
				let params = this.exportArr
				this.handlerOrderExport.loading = true
				this.$api.orderExportx(params).then(res => {
					this.handlerOrderExport.loading = false
					if (res.code === 0) {
						this.$Message.success(res.message)
						window.location.href = res.data[0]
						this.handlerOrderExport.modal = false
					}
				})
			} else {
				this.$Message.warning('请选择处理状态')
				return false
			}
		},
		// 提交发货设置
		submitSet() {
			for (let i in this.setList.logistics_set) {
				if (this.setList.logistics_set[i].logistics_no === '') {
					this.$Message.warning('请填写物流单号！')
					return false
				}
				if (this.setList.logistics_set[i].company === '') {
					this.$Message.warning('请填写快递公司！')
					return false
				}
				if (this.setList.logistics_set[i].content === '') {
					this.$Message.warning('请填写物流内容！')
					return false
				}
			}
			this.setList.data.logistics_set = this.setList.logistics_set
			let params = this.setList.data

			params.fileItems = this.setList.data.fileItem

			params.id = this.setList.data.id

			// 后端要求不传确认时间字段
			delete params.confirm_deliver_time
			// delete this.setList.data.fileItem

			this.setList.buttonLoading = true
			this.$api.shipmentSettings(params).then(res => {
				this.setList.buttonLoading = false
				if (res.code === 0) {
					this.$Message.success(res.message)
				} else {
					this.$Message.error(res.message)
				}
				this.setList.modal = false
				this.setList.data = {
					fileItem: [],
				}
				this.getList()
				this.checkList = []
			})
		},
		changeStatus() {},
		// 关闭
		closeModal(name) {
			this[name].modal = false
		},
		orderExport() {
			this.handlerOrderExport.modal = true
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
			//  判断搜索列表里有没有当前选中的对象
			let list = this.userList.filter(n => {
				return obj.label === n.real_name && obj.value === n.username
			})

			if (list.length > 0) {
				// 把选中的放进表单
				this.formData.reviewer = list[0].real_name
				this.formData.reviewer_id = list[0].id
			}
		},
		importSuccess(res, file) {
			this.isShowProgress = false

			// 上传成功
			if (res.code === 0) {
				this.$Message.success(res.message)
				delete this.setList.data.fileItem
				this.setList.data.fileItem = []
				this.setList.data.fileItem.push(res.data)
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
		// fileFormatError(file, fileList) {
		//   console.log(file, fileList)
		//   this.$Notice.error({
		//     title: '文件格式错误',
		//     desc: JSON.stringify(file),
		//   })
		// },

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

	mounted() {
		this.fmsService = FMS
		this.init()
	},
	computed: {
		transport: {
			get: function () {
				return this.sendDetails.data.transport === 'logistics' ? '物流' : '快递'
			},
			set: function (value) {
				this.sendDetails.data.transport = value
			}
		}
	},
	activated() {
		let status = this.$route.query.deliver_status
		let id_collect = this.$route.query.id_collect
		if (status) {
			this.search.deliver_status = status
    }else{
        this.search.deliver_status = ''
      }
    if (id_collect) {
			this.search.id_collect = id_collect
		}else{
			this.search.id_collect = ''

    }
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
.ivu-col {
	padding-left: 0;
}
</style>
