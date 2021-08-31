<template>
	<div class="box">
		<Card>
			<div slot="title">
				<div class="top-title" >
					<Select style="max-width:150px" placeholder="所有权" v-model="topData.ownership">
						<Option v-for="(item, index) in ownershipList" :value="item.ownership" :key="index">{{
							item.label
						}}</Option>
					</Select>
					<Input placeholder="申请人" style="max-width:150px" v-model="topData.created_by" clearable  @keydown.native.enter.prevent="onSearch"></Input>
					<Input placeholder="订单号" style="max-width:150px" v-model="topData.order_number" clearable  @keydown.native.enter.prevent="onSearch"></Input>
					<Input
						placeholder="采购单号"
						style="max-width:150px"
						v-model="topData.purchase_order_number"
            @keydown.native.enter.prevent="onSearch"
						clearable
					></Input>
					<Input placeholder="货号" style="max-width:150px" v-model="topData.article_number" clearable  @keydown.native.enter.prevent="onSearch"></Input>
					<Input placeholder="条形码" style="max-width:150px" v-model="topData.bar_code" clearable  @keydown.native.enter.prevent="onSearch"></Input>
					<Input placeholder="平台" style="max-width:150px" v-model="topData.platform" clearable  @keydown.native.enter.prevent="onSearch"></Input>
					<Select style="max-width:200px" placeholder="状态" v-model="topData.status" clearable>
						<Option v-for="(item, index) in statusList" :value="item.value" :key="index">{{ item.label }}</Option>
					</Select>
					<Button type="primary" icon="ios-search" @click="onSearch">搜索</Button>
				</div>
				<div>
					<Button type="primary" @click="onAdd()">添加</Button>
					<Button type="primary" @click="onAudit">审核</Button>
					<Button type="primary" @click="onPrint">打印备货单</Button>
				</div>
			</div>
			<Table
				:columns="column"
				:data="tabdata"
				:loading="tabLoading"
				@on-cell-click="goDetails"
				@on-selection-change="onPitch"
				border
			>
				<!-- <template slot-scope="{ row, index }" slot="purchase_order_number">
					<div class="tabs">
						<Table :columns="tabcolumns" :data="row.stockUp"></Table>
					</div>
				</template> -->
				<template slot-scope="{ row }" slot="action">
					<div>
						<Button
							type="primary"
							style="margin-right: 15px"
							icon="md-create"
							@click="onCompile(row.id)"
							:disabled="row.status != 'wait_audit' && row.status != 'fail_audit' && row.status != 'draft'"
						></Button>

						<Poptip confirm title="您确定要删除这条数据吗?" @on-ok="onDel(row.id)" transfer>
							<Button
								icon="md-trash"
								:disabled="row.status != 'wait_audit' && row.status != 'fail_audit' && row.status != 'draft'"
							></Button>
						</Poptip>
					</div>
				</template>
			</Table>
			<div class="tabpage">
				<Page
					:total="pageData"
					show-elevator
					show-sizer
					:current.sync="tabPage"
					:page-size-opts="[10, 20]"
					@on-change="changePage"
					@on-page-size-change="onChangePageSize"
					show-total
					size="small"
				/>
			</div>
		</Card>

		<Modal v-model="printShow" title="打印备货单" width="80" ok-text="打印" @on-ok="onOkPrint">
			<Spin size="large" fix v-if="spinShow"></Spin>
			<div class="printtable" ref="print">
				<!-- <div class="printTOP"></div> -->
				<div class="ivu-table-wrapper">
					<div class="ivu-table ivu-table-small ivu-table-border">
						<div class="ivu-table-body">
							<table cellspacing="0" cellpadding="0" border="0" width="100%">
								<tbody class="ivu-table-tbody">
									<tr class="ivu-table-row">
										<td colspan="13" class="ivu-table-cell tabtitle">
											<h1 class="printTitle">慕可外仓调货</h1>
											<div id="qrcode">
												<canvas id="QRCode"></canvas>
											</div>
										</td>
									</tr>
									<tr class="ivu-table-row">
										<td colspan="2">
											<div class="ivu-table-cell">平台</div>
										</td>
										<td colspan="3">
											<div class="ivu-table-cell">{{ printData.platform }}</div>
										</td>
										<td colspan="2">
											<div class="ivu-table-cell">发货仓库</div>
										</td>
										<td colspan="2">
											<div class="ivu-table-cell">{{ printData.delivery_warehouse }}</div>
										</td>
										<td colspan="2">
											<div class="ivu-table-cell">到仓时间</div>
										</td>
										<td colspan="2">
											<div class="ivu-table-cell">{{ timestampToTime(printData.to_warehouse_time) }}</div>
										</td>
									</tr>
									<tr class="ivu-table-row">
										<td colspan="5">
											<div class="ivu-table-cell"></div>
										</td>
										<td colspan="2">
											<div class="ivu-table-cell">物流方式</div>
										</td>
										<td colspan="2">
											<div class="ivu-table-cell">{{ printData.transport }}</div>
										</td>
										<td colspan="2">
											<div class="ivu-table-cell">出库时间</div>
										</td>
										<td colspan="2">
											<div class="ivu-table-cell">{{ timestampToTime(printData.out_warehouse_time, 'out') }}</div>
										</td>
									</tr>
									<tr class="ivu-table-row">
										<td colspan="13" class="ivu-table-cell">
											提货仓库电话：{{ printData.warehouse_phone }} 提货人：{{ printData.consignee }} 提货人联系方式：{{
												printData.consignee_phone
											}}
											送货地址：{{ printData.consignee_address }}
										</td>
									</tr>
									<tr class="ivu-table-row">
										<td>
											<div class="ivu-table-cell">采购单号</div>
										</td>
										<td>
											<div class="ivu-table-cell">货号</div>
										</td>
										<td>
											<div class="ivu-table-cell">条形码</div>
										</td>
										<td>
											<div class="ivu-table-cell">箱规</div>
										</td>
										<td>
											<div class="ivu-table-cell">申请数量</div>
										</td>
										<td>
											<div class="ivu-table-cell">箱数</div>
										</td>
										<td>
											<div class="ivu-table-cell">尾数</div>
										</td>
										<td>
											<div class="ivu-table-cell">总箱数</div>
										</td>
										<td>
											<div class="ivu-table-cell">实际备货数量</div>
										</td>
										<td>
											<div class="ivu-table-cell">备注</div>
										</td>
										<td>
											<div class="ivu-table-cell">批次号要求</div>
										</td>
										<td>
											<div class="ivu-table-cell">效期要求</div>
										</td>
										<td>
											<div class="ivu-table-cell">送货要求</div>
										</td>
									</tr>
									<tr v-for="(item, index) in printData.stockUp" :key="index">
										<td>{{ item.purchase_order_number }}</td>
										<td>{{ item.article_number }}</td>
										<td>{{ item.bar_code }}</td>
										<td>{{ item.carton_size }}</td>
										<td>{{ item.apply_number }}</td>
										<td>{{ item.carton_number }}</td>
										<td>{{ item.mantissa_number }}</td>
										<td>{{ item.total_carton_number }}</td>
										<td>{{ item.real_stock_number }}</td>
										<td :rowspan="index" v-if="!index > 0">{{ printData.remark }}</td>
										<td :rowspan="index" v-if="!index > 0">{{ printData.batch_number_require }}</td>
										<td :rowspan="index" v-if="!index > 0">{{ printData.effect_require }}</td>
										<td :rowspan="index" v-if="!index > 0">{{ printData.delivery_requirements }}</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
				<p style="padding:1rem 0;">为了减少调仓物流问题，提高物流入仓完成率，现在对运营提备货时需填物流安排要求：</p>
				<div class="ivu-table-wrapper">
					<div class="ivu-table ivu-table-small ivu-table-border">
						<div class="ivu-table-body">
							<table cellspacing="0" cellpadding="0" border="0" width="100%">
								<tbody class="ivu-table-tbody">
									<tr class="ivu-table-row">
										<td colspan="3" class="ivu-table-cell">车辆要求</td>
										<td colspan="3" class="ivu-table-cell">司机要求</td>
										<td colspan="3" class="ivu-table-cell">入库要求</td>
										<td colspan="4" class="ivu-table-cell">增加栏</td>
									</tr>
									<tr class="ivu-table-row">
										<td colspan="1">
											<div class="ivu-table-cell">车箱高度要求</div>
										</td>
										<td colspan="2">
											<div class="ivu-table-cell">{{ printData.logistics.carriage_high }}</div>
										</td>
										<td colspan="1">
											<div class="ivu-table-cell">着装要求</div>
										</td>
										<td colspan="2">
											<div class="ivu-table-cell">{{ printData.logistics.dressing }}</div>
										</td>
										<td colspan="1">
											<div class="ivu-table-cell">是否需要仓配人员陪同送货</div>
										</td>
										<td colspan="2">
											<div class="ivu-table-cell">{{ printData.logistics.accompany }}</div>
										</td>
										<td
											colspan="4"
											:rowspan="printData.increased.length < 7 ? 7 : printData.increased.length"
											style="padding:0;position: relative;"
										>
											<!-- <div class="ivu-table-cell">是否需要寄回单回来</div> -->
											<table cellspacing="0" cellpadding="0" border="0" width="100%" style="padding:0;maring:0; ">
												<tbody style="padding:0;maring:0;">
													<tr v-for="(item, index) in printData.increased" :key="index">
														<td colspan="1">
															<div class="ivu-table-cell">{{ item.increased_key }}</div>
														</td>
														<td colspan="2" style="border-right:0">
															<div class="ivu-table-cell">{{ item.increased_value }}</div>
														</td>
													</tr>
													<tr v-for="(value, keys) in trFillnum" :key="'n' + keys" style="border-right:0">
														<td colspan="1" :style="keys == trFillnum.length - 1 ? 'border-bottom:0;' : ''">
															<div class="ivu-table-cell" style="border-right:0">.</div>
														</td>
														<td
															colspan="2"
															:style="
																keys == trFillnum.length - 1 ? 'border-bottom:0;border-right:0;' : 'border-right:0'
															"
														>
															<div class="ivu-table-cell" style="border-right:0">.</div>
														</td>
													</tr>
												</tbody>
											</table>
										</td>
										<!-- <td colspan="2">
											<div class="ivu-table-cell"></div>
										</td> -->
									</tr>

									<tr class="ivu-table-row">
										<td colspan="1">
											<div class="ivu-table-cell">车身长度要求</div>
										</td>
										<td colspan="2">
											<div class="ivu-table-cell">{{ printData.logistics.car_length }}</div>
										</td>
										<td colspan="1">
											<div class="ivu-table-cell">性别要求</div>
										</td>
										<td colspan="2">
											<div class="ivu-table-cell">{{ printData.logistics.sex }}</div>
										</td>
										<td colspan="1">
											<div class="ivu-table-cell">是否需要物流提供卸货</div>
										</td>
										<td colspan="2">
											<div class="ivu-table-cell">{{ printData.logistics.unload }}</div>
										</td>
										<!-- <td colspan="2">
											<div class="ivu-table-cell">是否需要反光衣</div>
										</td>
										<td colspan="2">
											<div class="ivu-table-cell"></div>
										</td> -->
									</tr>

									<tr class="ivu-table-row">
										<td colspan="1">
											<div class="ivu-table-cell">车底盘高度要求</div>
										</td>
										<td colspan="2">
											<div class="ivu-table-cell">{{ printData.logistics.chassis_high }}</div>
										</td>
										<td colspan="1">
											<div class="ivu-table-cell">年龄要求</div>
										</td>
										<td colspan="2">
											<div class="ivu-table-cell">{{ printData.logistics.age }}</div>
										</td>
										<td colspan="1">
											<div class="ivu-table-cell">是否有入库指定时间</div>
										</td>
										<td colspan="2">
											<div class="ivu-table-cell">{{ timestampToTime(printData.logistics.assign_put_time) }}</div>
										</td>
										<!-- <td colspan="2">
											<div class="ivu-table-cell">是否需要自仓约车</div>
										</td>
										<td colspan="2">
											<div class="ivu-table-cell"></div>
										</td> -->
									</tr>

									<tr class="ivu-table-row">
										<td colspan="1">
											<div class="ivu-table-cell">车牌要求</div>
										</td>
										<td colspan="2">
											<div class="ivu-table-cell">{{ printData.logistics.plate_number }}</div>
										</td>
										<td colspan="1">
											<!-- <div class="ivu-table-cell">年龄要求</div> -->
										</td>
										<td colspan="2">
											<div class="ivu-table-cell"></div>
										</td>
										<td colspan="1">
											<div class="ivu-table-cell">是否需要获取司机信息</div>
										</td>
										<td colspan="2">
											<div class="ivu-table-cell">{{ printData.logistics.driver_information }}</div>
										</td>
										<!-- <td colspan="4"></td> -->
									</tr>

									<tr class="ivu-table-row">
										<td colspan="1">
											<div class="ivu-table-cell">尾板要求</div>
										</td>
										<td colspan="2">
											<div class="ivu-table-cell">{{ printData.logistics.pygidium }}</div>
										</td>
										<td colspan="1">
											<!-- <div class="ivu-table-cell">年龄要求</div> -->
										</td>
										<td colspan="2">
											<div class="ivu-table-cell"></div>
										</td>
										<td colspan="1">
											<div class="ivu-table-cell">是否需要现场垫付分类费</div>
										</td>
										<td colspan="2">
											<div class="ivu-table-cell">{{ printData.logistics.spot_classify_payment }}</div>
										</td>
										<!-- <td colspan="4"></td> -->
									</tr>

									<tr class="ivu-table-row">
										<td colspan="1">
											<div class="ivu-table-cell">数量限制要求</div>
										</td>
										<td colspan="2">
											<div class="ivu-table-cell">{{ printData.logistics.number_limit }}</div>
										</td>
										<td colspan="1">
											<!-- <div class="ivu-table-cell">年龄要求</div> -->
										</td>
										<td colspan="2">
											<div class="ivu-table-cell"></div>
										</td>
										<td colspan="1">
											<div class="ivu-table-cell">是否需要物流携带送货单据</div>
										</td>
										<td colspan="2">
											<div class="ivu-table-cell">{{ printData.logistics.take_receipts }}</div>
										</td>
										<!-- <td colspan="4"></td> -->
									</tr>

									<tr class="ivu-table-row">
										<td colspan="1">
											<div class="ivu-table-cell">车型要求</div>
										</td>
										<td colspan="2">
											<div class="ivu-table-cell">{{ printData.logistics.car_type }}</div>
										</td>
										<td colspan="1">
											<!-- <div class="ivu-table-cell">年龄要求</div> -->
										</td>
										<td colspan="2">
											<div class="ivu-table-cell"></div>
										</td>
										<td colspan="1">
											<div class="ivu-table-cell">是否需要现场垫付贴标费</div>
										</td>
										<td colspan="2">
											<div class="ivu-table-cell">{{ printData.logistics.spot_decals_payment }}</div>
										</td>
										<!-- <td colspan="4"></td> -->
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</Modal>
	</div>
</template>

<script>
import QRCode from 'qrcode'
export default {
	name: 'the-cargo',
	data() {
		return {
			//所有权数据
			ownershipList: [],
			//头部模糊搜索数据
			topData: {
				ownership: 'company', //所有权
				created_by: '', //申请人
				bar_code: '', //条形码
				purchase_order_number: '', //采购订单号
				article_number: '', //货号
				order_number: '', //订单号
				status: '', //状态
				platform: '', //平台
				page: 1, //当前页
				perPage: 10, //每页数目
			},
			//loading
			tabLoading: true,
			pageData: 20, //列表总共多少数据
			tabPage: 1, //分页器在第几页
			statusList: [
				{
					label: '待审核',
					value: 'wait_audit',
				},
				{
					label: '审核不通过',
					value: 'fail_audit',
				},
				{
					label: '待发货',
					value: 'wait_deliver',
				},
				{
					label: '备货中',
					value: 'stocking_up',
				},
				{
					label: '已发货',
					value: 'already_deliver',
				},
				{
					label: '草稿',
					value: 'draft',
				},
			], //状态数据
			// 表格内容
			column: [
				{
					type: 'selection',
					width: 60,
					align: 'center',
				},
				{
					title: '序号',
					type: 'index',
					align: 'center',
					width: 80,
				},
				{
					title: '订单号',
					width: 160,
					key: 'order_number',
					align: 'center',
					render: (h, params) => {
						let str = params.row.order_number
						// console.log(str)
						return h(
							'span',
							{
								style: {
									color: 'rgb(81, 160, 244)',
									cursor: 'pointer',
								},
							},
							str
						)
					},
				},
				{
					title: '申请人',
					width: 150,
					key: 'created_by',
					align: 'center',
				},
        {
          title: '订单二维码',
          width: 110,
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
				{
					title: '平台',
					width: 150,
					key: 'platform',
					align: 'center',
				},
				{
					title: '采购单号',
					width: 150,
					key: 'purchase_order_number',
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
										return h('li', item.purchase_order_number.length < 1 ? ' ' : item.purchase_order_number)
									})
								),
							]
						)
					},
				},
				{
					title: '货号',
					width: 200,
					key: 'article_number',
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
					title: '条形码',
					width: 150,
					key: 'bar_code',
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
										return h('li', item.bar_code)
									})
								),
							]
						)
					},
				},
				{
					title: '箱规',
					width: 150,
					key: 'carton_size',
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
										return h('li', item.carton_size)
									})
								),
							]
						)
					},
				},
				{
					title: '申请数量',
					width: 150,
					key: 'apply_number',
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
					title: '箱数',
					width: 150,
					key: 'carton_number',
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
										return h('li', item.carton_number)
									})
								),
							]
						)
					},
				},
				{
					title: '尾数',
					width: 150,
					key: 'mantissa_number',
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
										return h('li', item.mantissa_number)
									})
								),
							]
						)
					},
				},
				{
					title: '总箱数',
					width: 150,
					key: 'total_carton_number',
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
										return h('li', item.total_carton_number)
									})
								),
							]
						)
					},
				},
				{
					title: '实际备货数量',
					width: 150,
					key: 'real_stock_number',
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
										return h('li', item.real_stock_number)
									})
								),
							]
						)
					},
				},
				//到这里
				{
					title: '下单时间',
					width: 150,
					key: 'created_at',
					align: 'center',
					render: (h, params) => {
						let time = this.timestampToTime(params.row.created_at)
						return h(
							'span',
							{
								style: {
									// color: 'rgb(0, 51, 255)',
									cursor: 'pointer',
								},
							},
							time
						)
					},
				},
				{
					title: '状态',
					width: 150,
					key: 'status',
					align: 'center',
					render: (h, params) => {
						// let str=
						let status = params.row.status
						let str = ''
						for (let i in this.statusList) {
							if (this.statusList[i].value === status) {
								str = this.statusList[i].label
								break
							}
						}
						return h(
							'span',
							{
								style: {
									// color: 'rgb(0, 51, 255)',
									cursor: 'pointer',
								},
							},
							str
						)
					},
				},
				{
					title: '操作',
					slot: 'action',
					width: 150,
					align: 'center',
				},
			],
			//表里表格数据
			tabcolumns: [
				{
					title: '采购单号',
					key: 'purchase_order_number',
					align: 'center',
				},
				{
					title: '货号',
					key: 'article_number',
					align: 'center',
				},
				{
					title: '条形码',
					key: 'bar_code',
					align: 'center',
				},
				{
					title: '箱规',
					key: 'carton_size',
					align: 'center',
				},
				{
					title: '申请数量',
					key: 'apply_number',
					align: 'center',
				},
				{
					title: '箱数',
					key: 'carton_number',
					align: 'center',
				},
				{
					title: '尾数',
					key: 'mantissa_number',
					align: 'center',
				},
				{
					title: '总箱数',
					key: 'total_carton_number',
					align: 'center',
				},
				{
					title: '实际备货数量',
					key: 'real_stock_number',
					align: 'center',
				},
			],
			//表格数据
			tabdata: [{ stockUp: [] }],
			//选中时的数据
			pitchList: [],
			//打印窗口
			printShow: false,
			//打印数据
			printData: { logistics: {}, increased: [] },
			//打印窗口loading
			spinShow: false,
			//处理表格
			trFillnum: [{ key: 1 }],
			QRCodeMsg: '',
		}
	},
	methods: {
		//拿到所有数据
		getList(params) {
			this.tabLoading = true
			this.$api
				.warehouseList(params)
				.then(({ code, items, _meta }) => {
					this.tabLoading = false
					this.tabdata = items
					this.pageData = _meta.totalCount
					// console.log('this.pageData', this.pageData)
				})
				.catch(error => {
					this.tabLoading = false
				})
		},
		//获取所有权数据
		getOwnership() {
			this.$api.getOwnership().then(res => {
				// console.log(res)
				this.ownershipList = res
				// this.ownershipList.push({
				// 	label: '全部所有权',
				// 	ownership: 'all',
				// })
			})
		},
		//删除数据
		onDel(id) {
			this.$api.warehouseDeal({ id }).then(res => {
				// console.log(res)
				if (res.code == 0) {
					this.$Message.success(res.message)
					this.getList(this.topData)
				} else {
					this.$Message.warning(res.message)
				}
			})
		},
		//订单号点击时
		goDetails(row, column) {
			// console.log(column)
			if (column.key == 'order_number') {
				this.$router.push({
					path: 'particulars-cargo',
					query: {
						id: row.id,
					},
				})
			}
		},
		//选中时
		onPitch(data) {
			this.pitchList = data
		},

		//点击审核时
		onAudit() {
			// console.log(this.pitchList)
			if (this.pitchList.length === 1) {
				if (this.pitchList[0].status != 'wait_audit') {
					this.$Message.warning('请确保订单属于待审核状态！')
					return
				}
				this.$router.push({
					path: 'audit-cargo',
					query: {
						id: this.pitchList[0].id,
					},
				})
			} else {
				this.$Message.warning('请选择一个数据进行操作！')
			}
		},
		onPrint() {
			if (this.pitchList.length === 1) {
				if (
					this.pitchList[0].status != 'wait_deliver' &&
					this.pitchList[0].status != 'stocking_up' &&
					this.pitchList[0].status != 'already_deliver'
				) {
					this.$Message.warning('仅在待发货，备货中及已发货状态下可打印')
					return
				}
				this.printShow = true
				this.getPrint(this.pitchList[0].id)
			} else {
				this.$Message.warning('请选择一个数据进行操作！')
			}
		},
		//格式化时间
		//格式化时间
		timestampToTime(timestamp, type) {
			if (timestamp == 0) {
				return '否'
			}
			let date = new Date(timestamp * 1000) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
			let Y = date.getFullYear() + '-'
			let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
			let D = date.getDate() + ' '
			let h = date.getHours() + ':'
			let m = date.getMinutes() + ':'
			let s = String(date.getSeconds())
			// return Y + M + D + h + m + s
			// return Y + M + D;
			h = h.length < 3 ? '0' + h : h
			m = m.length < 3 ? '0' + m : m
			s = s.length < 2 ? '0' + s : s
			if (type === 'out') {
				return Y + M + D + h + m + s
			} else {
				return Y + M + D
			}
		},
		changePage(data) {
			// console.log(data)
			this.topData.page = data
			this.getList(this.topData)
		},
		onChangePageSize(data) {
			this.topData.perPage = data
			this.getList(this.topData)
		},
		//点击搜索
		onSearch() {
			this.topData.page = 1
			this.topData.perPage = 10
			this.tabPage = 1
			this.getList(this.topData)
		},
		//打印信息获取
		getPrint(id) {
			this.spinShow = true
			this.$api.warehousePrint({ id }).then(({ code, data }) => {
				this.spinShow = false
				if (code == 0) {
					for (let i in data.logistics) {
						if (data.logistics[i] === '$false') {
							data.logistics[i] = '否'
						} else if (data.logistics[i] === '') {
							data.logistics[i] = '是'
						}
					}

					for (let j in data.increased) {
						if (data.increased[j].increased_value === '$false') {
							data.increased[j].increased_value = '否'
						} else if (data.increased[j].increased_value === '') {
							data.increased[j].increased_value = '是'
						}
					}
					this.QRCodeMsg = data.order_number
					// console.log(data.increased)
					this.printData = data
					this.trFill(this.printData.increased.length)
				}
			})
		},
		//点击打印时
		onOkPrint() {
			this.$print(this.$refs.print)
		},
		//添加点击
		onAdd(id) {
			// console.log(1111)
			if (id) {
			} else {
				this.$router.push({
					path: 'new-cargo',
				})
			}
		},
		//点击编辑跳转路由
		onCompile(id) {
			this.$router.push({
				path: 'new-cargo',
				query: {
					id,
				},
			})
		},
		//处理tab
		trFill(data) {
			this.trFillnum = []
			if (data < 7) {
				// this.trFillnum = 7 - data
				let num = 7 - data
				for (let i = 0; i < num; i++) {
					this.trFillnum.push({ key: i })
				}
			}
			// console.log('this.trFillnum', this.trFillnum)
		},
	},
	created() {
		// this.QRCodeMsg = 'http://www.baidu.com'
		this.getList(this.topData)
		this.getOwnership()
	},
	activated() {
		this.getList(this.topData)
	},
	watch: {
		// 通过监听获取数据
		QRCodeMsg(val) {
			// 获取页面的canvas
			var msg = document.getElementById('QRCode')
			// 将获取到的数据（val）画到msg（canvas）上
			QRCode.toCanvas(msg, val, function(error) {
				// console.log(error)
			})
		},
	},
}
</script>

<style lang="less">
.tabpage {
	text-align: right;
	padding: 1rem 0;
}

.top-title {
	padding-bottom: 1rem;
}

/deep/.tabs .ivu-table-overflowX {
	overflow: hidden;
}

/deep/.tabpage .ivu-page-total {
	float: left;
}

.printtable {
	overflow: hidden;
}

// .item-style {
// 	li {
// 		list-style: none;
// 		line-height: 35px;
// 		border-bottom: 1px #dcdee2 solid;
// 		margin: 0 -18px;
// 	}

// 	li:last-child {
// 		border-bottom: none;
// 	}
// }

.item-style li {
	list-style: none;
	line-height: 35px;
	border-bottom: 1px #dcdee2 solid;
	margin: 0 -18px;
	white-space: pre;
}
.item-style li:last-child {
	border-bottom: none;
}

.tables {
	position: absolute;
	top: 0;
	width: 100%;
}

.printTOP {
	width: 100%;
	height: 10%;
	text-align: center;
	line-height: 2;
	position: relative;
}

#qrcode {
	float: right;
	display: block;
}

.printTitle {
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
}

.tabtitle {
	position: relative;
}
</style>
