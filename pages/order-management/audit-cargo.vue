<template>
	<div class="content">
		<div class="box">
			<Card>
				<Row>
					<Col span="4"> 平台：{{ data.platform }} </Col>
					<Col span="4"> 发货仓库：{{ data.delivery_warehouse }} </Col>
					<Col span="4"> 物流方式：{{ data.transport }} </Col>
					<Col span="4"> 到仓时间：{{ timestampToTime(data.to_warehouse_time) }} </Col>
					<Col span="4"> 出库时间：{{ timestampToTime(data.out_warehouse_time, 'out') }} </Col>
				</Row>
			</Card>
		</div>
		<div class="box">
			<Card>
				<Divider>提货信息</Divider>
				<Row>
					<Col span="4"> 提货仓库电话:{{ data.warehouse_phone }} </Col>
					<Col span="4"> 提货人：{{ data.consignee }} </Col>
					<Col span="4"> 提货人联系方式：{{ data.consignee_phone }} </Col>
				</Row>
				<Row style="margin-top:1rem">
					<Col> 送货地址:{{ data.consignee_address }} </Col>
				</Row>
				<Divider>备货信息</Divider>
				<div class="tabBox">
					<Table :columns="column" :data="data.stockUp"></Table>
				</div>
				<Row>
					<Col style="padding-bottom:1rem">
						批次号要求
						<Input disabled :value="data.batch_number_require"></Input>
					</Col>
					<Col style="padding-bottom:1rem">
						效期要求
						<Input disabled :value="data.effect_require"></Input>
					</Col>
					<Col style="padding-bottom:1rem">
						备注
						<Input disabled :value="data.remark"></Input>
					</Col>
					<Col>
						送货要求
						<Input
							:rows="5"
							:autosize="{ maxRows: 5, minRows: 5 }"
							type="textarea"
							disabled
							:value="data.delivery_requirements"
						></Input>
					</Col>
				</Row>
				<Divider>提货信息</Divider>
				<Row>
					<Col span="12">
						<Card>
							<p slot="title">车辆要求</p>
							<div class="text-box">
								<div class="centen-box">
									<p>车箱高度要求： {{ data.logistics.carriage_high == '' ? '否' : data.logistics.carriage_high }}</p>
									<p>车身长度要求： {{ data.logistics.car_length == '' ? '否' : data.logistics.car_length }}</p>
									<p>车底盘高度要求： {{ data.logistics.chassis_high == '' ? '否' : data.logistics.chassis_high }}</p>
									<p>车牌要求： {{ data.logistics.plate_number == '' ? '否' : data.logistics.plate_number }}</p>
									<p>尾板要求： {{ data.logistics.pygidium == '' ? '否' : data.logistics.pygidium }}</p>
									<p>数量限制要求： {{ data.logistics.number_limit == '' ? '否' : data.logistics.number_limit }}</p>
									<p>车型要求： {{ data.logistics.car_type == '' ? '否' : data.logistics.car_type }}</p>
								</div>
							</div>
						</Card>
					</Col>
					<Col span="12">
						<Card style="min-height=700px">
							<p slot="title">入库要求</p>
							<div class="text-box">
								<div class="centen-box">
									<p>
										是否需要仓配人员陪同送货： {{ data.logistics.accompany == '' ? '否' : data.logistics.accompany }}
									</p>
									<!-- <p>是否需要物流提供卸货 {{ data.logistics.unload }}</p> -->
									<p>
										是否有入库指定时间：
										{{ data.logistics.assign_put_time == 0 ? '否' : timestampToTime(data.logistics.assign_put_time) }}
									</p>
									<p>
										是否需要获取司机信息：
										{{ data.logistics.driver_information == '' ? '否' : data.logistics.driver_information }}
									</p>
									<p>
										是否需要现场垫付分类费：
										{{ data.logistics.spot_classify_payment == '' ? '否' : data.logistics.spot_classify_payment }}
									</p>
									<p>
										是否需要物流携带送货单据：
										{{ data.logistics.take_receipts == '' ? '否' : data.logistics.take_receipts }}
									</p>
									<p>
										是否需要现场垫付贴标费：
										{{ data.logistics.spot_decals_payment == '' ? '否' : data.logistics.spot_decals_payment }}
									</p>
									<p>
										是否需要物流提供卸货:
										{{ data.logistics.unload == '' ? '否' : data.logistics.unload }}
									</p>
								</div>
							</div>
						</Card>
					</Col>
				</Row>
				<div class="driverBox">
					<Card>
						<p slot="title">司机要求</p>
						<div class="driver-box">
							<p>着装要求： {{ data.logistics.dressing == '' ? '否' : data.logistics.dressing }}</p>
							<p>性别要求： {{ data.logistics.sex == '' ? '否' : data.logistics.sex }}</p>
							<p>年龄要求： {{ data.logistics.age == '' ? '否' : data.logistics.age }}</p>
						</div>
					</Card>
				</div>
				<div class="add-box">
					<Card>
						<p slot="title">增加栏</p>
						<div class="driver-box">
							<Row style="margin-bottom:1rem" v-for="(item, index) in data.increased" :key="index">
								<Col span="3">
									{{ item.increased_key + '：' + (item.increased_value != '$false' ? ' 是' : '否') }}
								</Col>
								<Col span="6">
									<!-- <Input
										:rows="5"
										v-show="item.increased_value != '$false' && item.increased_value != ''"
										:value="item.increased_value"
										:autosize="{ maxRows: 5, minRows: 5 }"
										type="textarea"
										disabled
									></Input> -->
									{{ item.increased_value === '$false' ? '' : item.increased_value }}
								</Col>
							</Row>
						</div>
					</Card>
				</div>
				<div style="padding-top:1rem">
					<Card>
						<div style="padding-bottom:1rem">
							<RadioGroup v-model="aduit.audit_pass">
								<span style="color:red">* </span>审核结果：
								<Radio label="1">
									<span>通过</span>
								</Radio>
								<Radio label="2">
									<span>不通过</span>
								</Radio>
							</RadioGroup>
						</div>
						<Row>
							<Col span="2">
								审核意见
							</Col>
							<Col span="22">
								<Input type="textarea" v-model="aduit.opinion"></Input>
							</Col>
						</Row>
					</Card>
				</div>
				<div class="footer">
					<Button @click="goBack">返回</Button>
					<Button type="primary" @click="onAduit" :loading="btnloading">提交</Button>
				</div>
			</Card>
		</div>
		<Spin size="large" fix v-if="spinShow"></Spin>
	</div>
</template>

<script>
export default {
	name: '',
	data() {
		return {
			id: null,
			//详情数据
			data: { stockUp: [], logistics: {}, increased: [] },
			column: [
				{
					key: 'purchase_order_number',
					title: '采购单号',
					align: 'center',
				},
				{
					key: 'article_number',
					title: '货号',
					align: 'center',
				},
				{
					key: 'bar_code',
					title: '条形码',
					align: 'center',
				},
				{
					key: 'carton_size',
					title: '箱规',
					align: 'center',
				},
				{
					key: 'apply_number',
					title: '申请数量',
					align: 'center',
				},
				{
					key: 'carton_number',
					title: '箱数',
					align: 'center',
				},
				{
					key: 'mantissa_number',
					title: '尾数',
					align: 'center',
				},
				{
					key: 'total_carton_number',
					title: '总箱数',
					align: 'center',
				},
				{
					key: 'real_stock_number',
					title: '实际备货数量',
					align: 'center',
				},
			],
			//审核信息
			aduit: {
				audit_pass: 0,
				opinion: '',
				object_id: '',
			},
			//按钮loading
			btnloading: false,
			//页面加载中
			spinShow: true,
			//审核状态
			statusList: [
				{
					value: 'wait_audit',
					lable: '待审核',
				},
				{
					value: 'fail_audit',
					lable: '审核不通过',
				},
				{
					value: 'wait_deliver',
					lable: '待发货',
				},
				{
					value: 'stocking_up',
					lable: '备货中',
				},
				{
					value: 'already_deliver',
					lable: '已发货',
				},
			],
		}
	},
	created() {
		this.id = this.$route.query.id
		this.getList(this.id)
		// console.log('id', this.id)
	},
	methods: {
		getList(id) {
			this.spinShow = true
			this.$api.getwareData({ id }).then(res => {
				// console.log(res)
				this.spinShow = false
				if (res.code == 0) {
					for (let i in res.data.logistics) {
						// res.data[i] = res.data[i] == '$false' ? ' ' : res.data[i]
						if (res.data.logistics[i] == '$false') {
							// console.log(res.data[i])
							res.data.logistics[i] = '否'
						} else if (res.data.logistics[i] == '') {
							res.data.logistics[i] = '是'
						}
					}
					this.data = res.data
					// console.log(this.data)
				}
			})
		},
		//格式化时间,加type返回时分秒
		timestampToTime(timestamp, type) {
			let date = new Date(timestamp * 1000) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
			let Y = date.getFullYear() + '-'
			let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
			let D = date.getDate() + ' '
			let h = date.getHours() + ':'
			let m = date.getMinutes() + ':'
			let s = String(date.getSeconds())
			// return Y + M + D + h + m + s
			h = h.length < 3 ? '0' + h : h
			m = m.length < 3 ? '0' + m : m
			s = s.length < 2 ? '0' + s : s
			if (type === 'out') {
				return Y + M + D + h + m + s
			} else {
				return Y + M + D
			}
			// return Y + M + D
		},

		//提交审核
		onAduit() {
			this.aduit.object_id = this.id
			if (!this.aduit.audit_pass) {
				this.$Message.warning('请填写必要审核信息')
				return
			}
			this.btnloading = true
			// console.log(this.aduit)
			this.$api
				.getwareaudit(this.aduit)
				.then(res => {
					this.btnloading = false
					// console.log(res)
					if (res.code == 0) {
						this.$Message.success(res.message)
						this.$router.push({
							path: 'the-cargo',
						})
					} else {
						this.$Message.warning(res.message)
					}
				})
				.catch(err => {
					this.btnloading = false
				})
		},
		//返回
		goBack() {
			this.$router.push({
				path: 'the-cargo',
			})
		},
	},
}
</script>

<style lang="less">
.box {
	margin-bottom: 1rem;
}

.ivu-table-tip {
	overflow-x: hidden;
}

.tabBox {
	padding-bottom: 2rem;
	/deep/.ivu-table-overflowX {
		overflow-x: hidden;
	}
}

.text-box {
	width: 100%;
	height: 100%;
	text-align: center;
}

.centen-box {
	margin: 0 auto;
	display: inline-block;
	// text-align: center;
	text-align: left;
}

.centen-box > p {
	padding-bottom: 1rem;
}

.driver-box {
	margin-left: 5%;
}

.driver-box p {
	padding-bottom: 1rem;
}

.driverBox {
	padding: 2rem 0;
}

.footer {
	padding-top: 1rem;
	text-align: right;
}
</style>
