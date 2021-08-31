<template>
	<div>
		<Card style="position:relative;" class="body">
			<!-- 返回 -->
			<Row slot="title" style="text-align:right;" class="head">
				<Button :loading="buttonLoading" @click="submitForm('formData')" :disabled="isDisabled">返回</Button>
			</Row>
			<!-- 发票invoice -->
			<Card>
				<Row class="invoice-info">
					<Col :lg="4" :md="24">
						平台：
						<span>{{ this.datalist.deploy.platform }}</span>
					</Col>
					<Col :lg="4" :md="24">
						发货仓库：
						<span>{{ this.datalist.deploy.delivery_warehouse }}</span>
					</Col>
					<Col :lg="4" :md="24">
						物流方式：
						<span>{{ this.datalist.deploy.transport }}</span>
					</Col>
					<Col :lg="6" :md="24">
						到仓时间：
						<span>{{ this.formatDate(this.datalist.deploy.to_warehouse_time, 'ymd') }}</span>
					</Col>
					<Col :lg="6" :md="24">
						出库时间：
						<span>{{ this.formatDate(this.datalist.deploy.out_warehouse_time) }}</span>
					</Col>
				</Row>
			</Card>
			<!-- 提货信息 -->
			<Card style="margin-top:5px">
				<div class="line">
					<div class="line-s"></div>
					<div class="font">提货信息</div>
					<div class="line-s"></div>
				</div>
				<Row class="up-goods-info">
					<Row style="margin-left:23px">
						<Col :lg="4" :md="24">
							提货仓库电话：
							<span>{{ this.datalist.deploy.warehouse_phone }}</span>
						</Col>
						<Col :lg="4" :md="24">
							提货人：
							<span>{{ this.datalist.deploy.consignee }}</span>
						</Col>
						<Col :lg="6" :md="24">
							提货人联系方式：
							<span>{{ this.datalist.deploy.consignee_phone }}</span>
						</Col>

						<Col :lg="24" :md="24" style="margin-top:20px">
							送货地址:
							<span>{{ this.datalist.deploy.consignee_address }}</span>
						</Col>
					</Row>

					<div class="line">
						<div class="line-s"></div>
						<div class="font">备货信息</div>
						<div class="line-s"></div>
					</div>
					<!-- 备货信息 -->
					<div class="details-table-hand">
						<Table center border size="small" :columns="columns1" :data="listdata"></Table>
					</div>
					<Row class="demand">
						<Col :lg="24" :md="24" class="interval">
							<div>批次号要求</div>
							<Input disabled :value="datalist.deploy.batch_number_require"></Input>
						</Col>
						<Col :lg="24" :md="24" class="interval">
							<div>效期要求</div>
							<Input disabled :value="datalist.deploy.effect_require"></Input>
						</Col>
						<Col :lg="24" :md="24" class="interval">
							<div>备注</div>
							<Input disabled :value="datalist.deploy.remark"></Input>
						</Col>
						<Col :lg="24" :md="24" class="interval">
							<div>送货要求</div>
							<Input disabled :value="datalist.deploy.delivery_requirements"></Input>
						</Col>
						<div class="line">
							<div class="line-s"></div>
							<div class="font">物流要求</div>
							<div class="line-s"></div>
						</div>
						<!-- 物流要求 -->
						<Row type="flex" justify="end" class="logistics">
							<Col :md="24" class="vehicles">
								<span class="requirement">&nbsp;车辆要求</span>
								<Row type="flex" justify="start" class="pand">
									<Col :lg="6" :md="24">车厢高度要求</Col>
									<Col style="width: 60%;" :md="24">{{ this.negative(this.datalist.logistics.carriage_high) }}</Col>
								</Row>
								<Row type="flex" justify="start" class="pand">
									<Col :lg="6" :md="24">车身长度要求</Col>
									<Col style="width: 60%;" :md="24">{{ this.negative(this.datalist.logistics.car_length) }}</Col>
								</Row>
								<Row type="flex" justify="start" class="pand">
									<Col :lg="6" :md="24">车底盘高度要求</Col>
									<Col style="width: 60%;" :md="24">
										{{ this.negative(this.datalist.logistics.chassis_high) }}
									</Col>
								</Row>
								<Row type="flex" justify="start" class="pand">
									<Col :lg="6" :md="24">车牌要求</Col>
									<Col style="width: 60%;" :md="24">{{ this.negative(this.datalist.logistics.plate_number) }}</Col>
								</Row>
								<Row type="flex" justify="start" class="pand">
									<Col :lg="6" :md="24">尾板要求</Col>
									<Col style="width: 60%;" :md="24">{{ this.negative(this.datalist.logistics.pygidium) }}</Col>
								</Row>
								<Row type="flex" justify="start" class="pand">
									<Col :lg="6" :md="24">数量限制要求</Col>
									<Col style="width: 60%;" :md="24">{{ this.negative(this.datalist.logistics.number_limit) }}</Col>
								</Row>
								<Row type="flex" justify="start" class="pand">
									<Col :lg="6" :md="24">车型要求</Col>
									<Col style="width: 60%;" :md="24">{{ this.negative(this.datalist.logistics.car_type) }}</Col>
								</Row>
							</Col>

							<Col :md="24" class="Put-storage">
								<span class="requirement">&nbsp;入库要求</span>
								<Row type="flex" justify="start" class="pand">
									<Col :lg="6" :md="24">是否需要仓配人员陪同送货</Col>
									<Col style="width: 60%;" :md="24">{{ this.negative(this.datalist.logistics.accompany) }}</Col>
								</Row>
								<Row type="flex" justify="start" class="pand">
									<Col :lg="6" :md="24">是否需要物流提供卸货</Col>
									<Col style="width: 60%;" :md="24">{{ this.negative(this.datalist.logistics.unload) }}</Col>
								</Row>
								<Row type="flex" justify="start" class="pand">
									<Col :lg="6" :md="24">是否有入库指定时间</Col>
									<Col style="width: 60%;" :md="24">{{
										this.datalist.logistics.assign_put_time === '0'
											? '否'
											: this.formatDate(this.datalist.logistics.assign_put_time)
									}}</Col>
								</Row>
								<Row type="flex" justify="start" class="pand">
									<Col :lg="6" :md="24">是否需要获取实际信息</Col>
									<Col style="width: 60%;" :md="24">{{
										this.negative(this.datalist.logistics.driver_information)
									}}</Col>
								</Row>
								<Row type="flex" justify="start" class="pand">
									<Col :lg="6" :md="24">是否需要现场垫付分类费</Col>
									<Col style="width: 60%;" :md="24">{{
										this.negative(this.datalist.logistics.spot_classify_payment)
									}}</Col>
								</Row>
								<Row type="flex" justify="start" class="pand">
									<Col :lg="6" :md="24">是否需要物流携带送货单据</Col>
									<Col style="width: 60%;" :md="24">{{ this.negative(this.datalist.logistics.take_receipts) }}</Col>
								</Row>
								<Row type="flex" justify="start" class="pand">
									<Col :lg="6" :md="24">是否需要现场垫付贴标费</Col>
									<Col style="width: 60%;" :md="24">{{
										this.negative(this.datalist.logistics.spot_decals_payment)
									}}</Col>
								</Row>
							</Col>
						</Row>
						<!-- 司机要求 -->

						<Row class="driver">
							<span class="requirement">&nbsp;司机要求</span>
							<Row type="flex" justify="start" class="driver-requirements">
								<Col :lg="6" :md="24">司机着装要求</Col>
								<Col :lg="18" :md="24">{{ this.negative(this.datalist.logistics.dressing) }}</Col>
							</Row>
							<Row type="flex" justify="start" class="driver-requirements">
								<Col :lg="6" :md="24">性别</Col>
								<Col :lg="18" :md="24">{{ this.negative(this.datalist.logistics.sex) }}</Col>
							</Row>
							<Row type="flex" justify="start" class="driver-requirements">
								<Col :lg="6" :md="24">年龄</Col>
								<Col :lg="18" :md="24">{{ this.negative(this.datalist.logistics.age) }}</Col>
							</Row>
						</Row>
						<!-- 增加栏 -->
						<Row class="driver">
							<span class="requirement">&nbsp;增加栏</span>
							<div v-for="(item) in this.datalist.deploy.increased" :key="item.increased_key">
								<Row type="flex" justify="start" class="driver-requirements">
									<Col span="6" :md="24">{{ item.increased_key }}</Col>
									<!-- style="width:%;" -->
									<Col style="width:10%;" :md="24">
										<div v-html="negative2(item.increased_value)"></div>
									</Col>
									<Col
										style="width:50%;"
										:md="24"
										v-html="item.increased_value === '$false' ? '' : item.increased_value"
									></Col>
								</Row>
							</div>
						</Row>
					</Row>
				</Row>
			</Card>
			<!-- 审核信息 -->
			<Card style="margin-top:5px">
				<Row class="audit-info">
					<div class="line">
						<div class="line-s"></div>
						<div class="font">审核信息</div>
						<div class="line-s"></div>
					</div>
					<div v-for="(item) in this.datalist.auditLog" :key="item.object_id">
						<Row class="audit-information-head">
							<Col :lg="5" :md="24" class="audit-information">
								审核人：
								<span>{{ item.created_by }}</span>
							</Col>
							<Col :lg="5" :md="24" class="audit-information">
								审核结果：
								<span v-html="item.audit_pass === '1' ? '通过' : '不通过'"></span>
							</Col>
							<Col :lg="8" :md="24" class="audit-information">
								审核时间：
								<span>{{ formatDate(item.created_at) }}</span>
							</Col>
							<Col :lg="24" :md="24" class="audit-information">
								审核意见：
								<span>{{ item.opinion }}</span>
							</Col>
						</Row>
					</div>
				</Row>
			</Card>
			<!--发货信息 -->
			<Card style="margin-top:5px">
				<Row class="audit-info">
					<div class="line">
						<div class="line-s"></div>
						<div class="font">发货信息</div>
						<div class="line-s"></div>
					</div>
					<Row>
						<Col :lg="5" :md="24">
							发货方式：
							<span v-html="this.datalist.transport === 'logistics' ? '物流' : '快递'"></span>
						</Col>
						<Col :lg="5" :md="24">
							确认发货：
							<span v-html="this.datalist.is_deliver === '1' ? '是' : '否'"></span>
						</Col>
						<Col :lg="7" :md="24">
							确认时间：
							<span>{{ formatDate(this.datalist.confirm_deliver_time) }}</span>
						</Col>
						<Col :lg="7" :md="24">
							物流单号：
							<span>{{ this.datalist.logistics_set[0].logistics_no }}</span>
						</Col>
					</Row>
					<Row>
						<Col :lg="10" :md="24">
							缺货信息：
							<span>{{ this.datalist.stock_out }}</span>
						</Col>
						<Col :lg="10" :md="24">
							其他异常：
							<span>{{ this.datalist.other_abnormal }}</span>
						</Col>
					</Row>
					<Row>
						<Col :lg="24" :md="24">
							下载物流单：
							<a
								target="_blank"
								:href="SERVER_BASE_URL + '/' + this.fileItem[0].url"
								v-if="this.fileItem.length !== 0"
								>{{ this.fileItem[0].title + '.' + this.fileItem[0].extension }}</a
							>
							<span v-else></span>
						</Col>
					</Row>
				</Row>
			</Card>
		</Card>
	</div>
</template>

<script>
import Cookies from 'js-cookie'
import { SERVER_BASE_URL } from '~/api/config'

export default {
	data() {
		return {
			SERVER_BASE_URL: SERVER_BASE_URL,
			buttonLoading: false,
			isDisabled: false,
			// 表头
			columns1: [
				{
					title: '采购单号',
					align: 'center',
					key: 'purchase_order_number',
				},
				{
					title: '货号',
					align: 'center',
					key: 'article_number',
				},
				{
					title: '条形码',
					align: 'center',
					key: 'bar_code',
				},
				{
					title: '箱规',
					align: 'center',
					key: 'carton_size',
				},
				{
					title: '申请数量',
					align: 'center',
					key: 'apply_number',
				},
				{
					title: '箱数',
					align: 'center',
					key: 'carton_number',
				},
				{
					title: '尾数',
					align: 'center',
					key: 'mantissa_number',
				},
				{
					title: '总箱数',
					align: 'center',
					key: 'total_carton_number',
				},
				{
					title: '实际备货数量',
					align: 'center',
					key: 'real_stock_number',
				},
			],
			// 列表数据
			listdata: [],
			formdata: {
				batch_number_require: 2,
				remark: '请注意查收',
				effect_require: '明年',
			},
			datalist: {
				logistics_set: [
					{
						logistics_no: '',
					},
				],
				other_abnormal: '',
				order_number: '',
				deploy: {
					platform: '',
				},
				logistics: {
					carriage_high: '',
				},
			},
			fileItem: [],
		}
	},

	methods: {
		submitForm() {
			if (this.$route.query.redirect) {
				this.$router.push({
					path: `/receipt/${this.$route.query.redirect}`,
				})
			} else {
				this.$router.go(-1)
			}
		},
		// 开始
		init() {
			let prarms = {
				id: this.$route.query.id,
			}

			this.$api.warehouseDeliverDetails(prarms).then(res => {
				if (res.code === 0) {
					this.fileItem = res.data.fileItem

					this.datalist = res.data
					if (this.datalist.logistics_set === null) {
						this.datalist.logistics_set = [
							{
								logistics_no: '',
							},
						]
					}
					this.listdata = this.datalist.stockUp
				}
			})
		},
		// 时间转化
		formatDate(time, json) {
			if (!time) {
				return '否'
			}
			if (json) {
				return this.$format(time, 'yyyy-MM-dd')
			} else {
				return this.$format(time, 'yyyy-MM-dd hh:mm:ss')
			}
		},
		// 审核
		findAuditStatus(json) {
			for (let i in this.statusList) {
				if (json == this.statusList[i].value) {
					return this.statusList[i].label
				}
			}
		},
		negative(no) {
			return no === '$false' ? '否' : no ? no : '是'
		},
		negative2(no) {
			if (no == '$false' || no != '') {
				return '是'
			} else {
				return '否'
			}
		},
		//
		nothing(no) {
			return no === '' ? '无' : no
		},
	},
	mounted() {
		this.init()
	},
	activated() {
		this.init()
	},
}
</script>

<style lang="less" scoped>
// 修改物流要求样式

.head.ivu-row {
	button {
		width: 72px;
	}
	padding: 7px 10px;
}

/deep/ .ivu-card-head {
	padding: 0;
}
/deep/ .ivu-card-body {
	padding: 5px;
}

.body {
	padding: 0;
	margin: 0;
	.head {
		background-color: rgb(255, 255, 255);
	}
	height: 100%;
	background-color: rgb(228, 228, 228);

	.invoice-info {
		border-radius: 5px;
		width: 100%;
		height: 30px;
		line-height: 30px;
		margin-bottom: 0px;
		margin-left: 24px;
	}
	.line {
		height: 50px;
		padding-left: 5px;
		display: flex;
		justify-content: center;
		align-items: center;
		.line-s {
			width: 45%;
			height: 1px;
			background-color: rgb(228, 228, 228);
		}
		.font {
			margin: 0 20px;
			font-weight: 700;
		}
	}
	.up-goods-info {
		border-radius: 5px;
		width: 100%;

		margin-bottom: 10px;

		.details-table-hand {
			margin: 5px 5px 10px 5px;
		}
		.demand {
			padding: 5px;
		}
		.logistics {
			display: flex;
			justify-content: space-around;
			.vehicles {
				padding-top: 5px;
				flex: 1;
				min-width: 400px;
				margin: 0 10px;
				border: 1px #e0e0e0 solid;

				.pand {
					margin: 25px 0;
					margin-left: 100px;

					.ivu-col {
						width: 140px;
					}
				}
			}
			.Put-storage {
				padding-top: 5px;
				flex: 1;
				min-width: 400px;
				margin: 0 10px;
				border: 1px rgb(228, 228, 228) solid;
				.pand {
					margin: 25px 0;
					margin-left: 50px;

					.ivu-col {
						width: 200px;
					}
				}
			}
		}
		.driver {
			margin: 10px;
			padding-top: 5px;
			height: 100%;
			border: 1px rgb(228, 228, 228) solid;
			.driver-requirements {
				margin: 15px 0;
				margin-left: 100px;

				.ivu-col {
					width: 300px;
				}
			}
		}
	}
	.audit-info {
		padding: 0 0 0 23px;
		height: 100%;
		border-radius: 5px;
		.audit-information-head {
			margin-bottom: 15px;
			.audit-information {
				margin: 10px 0;
			}
		}

		.ivu-col {
			margin: 20px 0;
		}
	}

	// 分界线
	.interval {
		// width: 100%;
		margin-bottom: 15px;
		// margin-left: 20px;
	}
	.requirement {
		margin-left: 5px;
	}
	.ivu-input {
		margin: 10px 0;
		color: #000;
		background-color: rgb(228, 228, 228);
	}
	.delivery-requirements {
		// width: 98%;
		height: 30px;
		padding: 5px 5px;
		border-radius: 5px;
		background-color: rgb(228, 228, 228);
	}
}
/deep/.ivu-table-overflowX {
	overflow-x: hidden;
}
</style>
