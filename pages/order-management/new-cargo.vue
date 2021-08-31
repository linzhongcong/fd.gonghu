<template>
	<Card>
		<div slot="title" class="card-title">
			<Button @click="onSumb('def')" :loading="defLoading">保存为草稿</Button>
			<Button type="primary" @click="onSumb('sum')" :loading="sumLoading">提交</Button>
		</div>
		<Form ref="editForm" label-position="top" :model="addData" :rules="ruleCustom">
			<Row>
				<Col span="4">
					<!-- plaRemoteMethod -->
					<FormItem label="平台" :prop="'platform'">
						<!-- :rules="{ required: true, message: '平台不能为空', trigger: 'blur' }" -->
						<!-- <Select
							v-model="addData.platform"
							filterable
							remote
							:remote-method="plaRemoteMethod"
							:loading="plaSearchloading"
							clearable
						>
							<Option v-for="(option, index) in plaoptions" :value="option.merchant_name" :key="index">{{
								option.merchant_name
							}}</Option>
						</Select> -->
						<Input placeholder="请输入平台" v-model="addData.platform" clearable></Input>
					</FormItem>
				</Col>
				<Col span="4">
					<FormItem label="发货仓库" :prop="'delivery_warehouse'">
						<!-- :rules="{ required: true, message: '发货仓库不能为空', trigger: 'blur' }" -->
						<Select placeholder="请选择" v-model="addData.delivery_warehouse" clearable>
							<Option v-for="(item, index) in storeList" :value="item.label" :key="index">{{ item.label }}</Option>
						</Select>
					</FormItem>
				</Col>
				<Col span="4">
					<FormItem label="物流方式" :prop="'transport'">
						<!-- :rules="{ required: true, message: '物流方式不能为空', trigger: 'blur', type: 'date' }" -->
						<Select placeholder="请选择" v-model="addData.transport" clearable>
							<Option v-for="(item, index) in logisticsList" :value="item.label" :key="index">{{ item.label }}</Option>
						</Select>
					</FormItem>
				</Col>
				<Col span="4">
					<FormItem
						label="出库时间"
						:prop="'newtimeData.out_warehouse_time'"
						:rules="{ required: true, message: '出库时间不能为空', trigger: 'blur', type: 'date' }"
					>
						<!-- v-model="addData.to_warehouse_time" -->
						<!-- @on-change="
								event => {
									onTime(event, 'to_warehouse_time')
								}
							" -->
						<DatePicker
							type="datetime"
							:options="optionsData"
							placeholder="出库时间"
							clearable
							v-model="addData.newtimeData.out_warehouse_time"
							style="width:100%"
							@on-change="
								event => {
									onTime(event, 'out_warehouse_time')
								}
							"
						></DatePicker>
					</FormItem>
				</Col>
				<Col span="4">
					<FormItem
						label="到仓时间"
						:prop="'newtimeData.to_warehouse_time'"
						:rules="{ required: true, message: '到仓时间不能为空', trigger: 'blur', type: 'date' }"
					>
						<DatePicker
							type="date"
							placeholder="到仓时间"
							clearable
							v-model="addData.newtimeData.to_warehouse_time"
							style="width:100%"
							@on-change="
								event => {
									onTime(event, 'to_warehouse_time')
								}
							"
						></DatePicker>
					</FormItem>
				</Col>
			</Row>
			<Divider />
			<Row>
				<Col span="4">
					<FormItem label="提货仓库电话">
						<!-- :prop="'warehouse_phone'" -->
						<!-- :rules="{ validator: validatePhone, trigger: 'blur' }" -->
						<Input placeholder="提货仓库电话（选填）" v-model="addData.warehouse_phone" clearable></Input>
					</FormItem>
				</Col>
				<Col span="4">
					<FormItem label="提货人">
						<Input placeholder="提货人（选填）" v-model="addData.consignee" clearable></Input>
					</FormItem>
				</Col>
				<Col span="4">
					<FormItem label="提货人联系方式">
						<!-- :prop="'consignee_phone'" -->
						<Input placeholder="提货人联系方式（选填）" v-model="addData.consignee_phone" clearable></Input>
					</FormItem>
				</Col>
			</Row>
			<Row>
				<Col span="12">
					<FormItem
						label="送货地址"
						:prop="'consignee_address'"
						:rules="{ required: true, message: '送货地址不能为空', trigger: 'blur' }"
					>
						<Input placeholder="请输入送货地址" v-model="addData.consignee_address" clearable></Input>
					</FormItem>
				</Col>
			</Row>
			<Divider>备货信息</Divider>

			<div class="impro">
				<Button type="primary" @click="onLeadclick">批量导入</Button>
			</div>
			<div class="tabBox">
				<Table :columns="column" :data="addData.stock_up">
					<template slot-scope="{ row, index }" slot="action">
						<div>
							<Button type="text" style="color:rgb(0, 138, 212)" @click="onRedact(index,row)">编辑</Button>
							<Button type="text" style="color:red" @click="onTabDeal(index,row)">删除</Button>
						</div>
					</template>
				</Table>
			</div>

			<div class="sup-con" v-for="(item, index) in stock_up" :key="index">
				<Row>
					<Col span="3">
						<Input placeholder="请输入采购单号" v-model="item.purchase_order_number"></Input>
					</Col>
					<Col span="3">
						<!-- <Input placeholder="请输入货号"></Input> -->
						<Select
							v-model="item.article_number"
							filterable
							remote
							:remote-method="
								event => {
									remoteMethod(event, index, item)
								}
							"
							:loading="searchloading"
							@on-change="
								event => {
									artChange(event, index, item)
								}
							"
							clearable
							@on-clear="onSrtClean(index)"
							placeholder="请选择货号"
						>
							<Option v-for="(option, index) in item.artoptions" :value="option.article_number" :key="index">{{
								option.article_number
							}}</Option>
						</Select>
					</Col>
					<Col span="3">
						<Input placeholder="请输入条形码" readonly v-model="item.bar_code"></Input>
					</Col>
					<Col span="3">
						<Input placeholder="请输入箱规" readonly v-model="item.carton_size"></Input>
					</Col>
					<Col span="3">
						<InputNumber
							:min="0"
							placeholder="请输入申请数量"
							v-model="item.apply_number"
							style="width:100%"
						></InputNumber>
					</Col>
					<Col span="2">
						<InputNumber
							:min="0"
							style="width:100%"
							placeholder="请输入箱数"
							v-model="item.carton_number"
							type="number"
						></InputNumber>
					</Col>
					<Col span="2">
						<InputNumber
							:min="0"
							style="width:100%"
							placeholder="请输入尾数"
							v-model="item.mantissa_number"
							type="number"
						></InputNumber>
					</Col>
					<Col span="2">
						<InputNumber
							:min="0"
							style="width:100%"
							placeholder="请输入总箱数"
							v-model="item.total_carton_number"
							type="number"
						></InputNumber>
					</Col>
					<Col span="3" style="text-align:right">
						<Button type="text" style="color:rgb(0, 138, 212)" @click="artSave(item, index)">保存</Button>
						<Button type="text" style="color:red" @click="artDeal(index)">删除</Button> &nbsp;
					</Col>
				</Row>
			</div>
			<div class="add-carge" @click="addArt">
				+ 新增货品
			</div>
			<FormItem label="批次号要求">
				<Input placeholder="批次号要求" v-model="addData.batch_number_require" clearable></Input>
			</FormItem>
			<FormItem label="效期要求">
				<Input placeholder="效期要求" v-model="addData.effect_require" clearable></Input>
			</FormItem>
			<FormItem label="备注">
				<Input placeholder="备注" v-model="addData.remark" clearable></Input>
			</FormItem>
			<FormItem label="送货要求">
				<Input placeholder="送货要求" v-model="addData.delivery_requirements" clearable></Input>
			</FormItem>
		</Form>
		<Divider>物流要求</Divider>
		<Row>
			<Col span="12">
				<Card>
					<p slot="title"><span class="red">*</span> 车辆要求</p>
					<div class="box-center">
						<Form label-position="left" :label-width="100">
							<FormItem label="车箱高度要求">
								<Select
									placeholder="请选择"
									style="width:100px"
									v-model="isSense.carriage_high"
									@on-change="
										event => {
											onIs(event, 'carriage_high')
										}
									"
								>
									<Option v-for="(item, index) in isList" :value="item.value" :key="index">{{ item.label }}</Option>
								</Select>
								<Input
									placeholder="车箱高度要求"
									style="max-width:150px"
									v-model="addData.carriage_high"
									v-show="isSense.carriage_high == 'true'"
								></Input>
							</FormItem>
							<FormItem label="车身长度要求">
								<Select
									placeholder="请选择"
									style="width:100px"
									v-model="isSense.car_length"
									@on-change="
										event => {
											onIs(event, 'car_length')
										}
									"
								>
									<Option v-for="(item, index) in isList" :value="item.value" :key="index">{{ item.label }}</Option>
								</Select>
								<Input
									placeholder="车身长度要求"
									style="max-width:150px"
									v-model="addData.car_length"
									v-show="isSense.car_length == 'true'"
								></Input>
							</FormItem>
							<FormItem label="车底盘高度要求">
								<Select
									placeholder="请选择"
									style="width:100px"
									v-model="isSense.chassis_high"
									@on-change="
										event => {
											onIs(event, 'chassis_high')
										}
									"
								>
									<Option v-for="(item, index) in isList" :value="item.value" :key="index">{{ item.label }}</Option>
								</Select>
								<Input
									placeholder="车底盘高度要求"
									style="max-width:150px"
									v-model="addData.chassis_high"
									v-show="isSense.chassis_high == 'true'"
								></Input>
							</FormItem>
							<FormItem label="车牌要求">
								<Select
									placeholder="请选择"
									style="width:100px"
									v-model="isSense.plate_number"
									@on-change="
										event => {
											onIs(event, 'plate_number')
										}
									"
								>
									<Option v-for="(item, index) in isList" :value="item.value" :key="index">{{ item.label }}</Option>
								</Select>
								<Input
									placeholder="车牌要求"
									style="max-width:150px"
									v-model="addData.plate_number"
									v-show="isSense.plate_number == 'true'"
								></Input>
							</FormItem>
							<FormItem label="尾板要求">
								<Select
									placeholder="请选择"
									style="width:100px"
									v-model="isSense.pygidium"
									@on-change="
										event => {
											onIs(event, 'pygidium')
										}
									"
								>
									<Option v-for="(item, index) in isList" :value="item.value" :key="index">{{ item.label }}</Option>
								</Select>
								<Input
									placeholder="尾板要求"
									style="max-width:150px"
									v-model="addData.pygidium"
									v-show="isSense.pygidium == 'true'"
								></Input>
							</FormItem>
							<FormItem label="数量限制要求">
								<Select
									placeholder="请选择"
									style="width:100px"
									v-model="isSense.number_limit"
									@on-change="
										event => {
											onIs(event, 'number_limit')
										}
									"
								>
									<Option v-for="(item, index) in isList" :value="item.value" :key="index">{{ item.label }}</Option>
								</Select>
								<Input
									placeholder="数量限制要求"
									style="max-width:150px"
									v-model="addData.number_limit"
									v-show="isSense.number_limit == 'true'"
								></Input>
							</FormItem>
							<FormItem label="车型要求">
								<Select
									placeholder="请选择"
									style="width:100px"
									v-model="isSense.car_type"
									@on-change="
										event => {
											onIs(event, 'car_type')
										}
									"
								>
									<Option v-for="(item, index) in isList" :value="item.value" :key="index">{{ item.label }}</Option>
								</Select>
								<Input
									placeholder="车型要求"
									style="max-width:150px"
									v-model="addData.car_type"
									v-show="isSense.car_type == 'true'"
								></Input>
							</FormItem>
						</Form>
					</div>
				</Card>
			</Col>
			<Col span="12">
				<Card>
					<p slot="title"><span class="red">*</span> 入库要求</p>

					<Form label-position="left" :label-width="100">
						<div class="box-center">
							<FormItem label="是否需要仓配人员陪同送货" :label-width="160">
								<Select
									placeholder="请选择"
									style="width:100px"
									v-model="isSense.accompany"
									@on-change="
										event => {
											onIs(event, 'accompany')
										}
									"
								>
									<Option v-for="(item, index) in isList" :value="item.value" :key="index">{{ item.label }}</Option>
								</Select>
								<Input style="max-width:150px" v-model="addData.accompany" v-show="isSense.accompany == 'true'"></Input>
							</FormItem>

							<FormItem label="是否需要物流提供卸货" :label-width="160">
								<Select
									placeholder="请选择"
									style="width:100px"
									v-model="isSense.unload"
									@on-change="
										event => {
											onIs(event, 'unload')
										}
									"
								>
									<Option v-for="(item, index) in isList" :value="item.value" :key="index">{{ item.label }}</Option>
								</Select>
								<Input style="max-width:150px" v-model="addData.unload" v-show="isSense.unload == 'true'"></Input>
							</FormItem>

							<FormItem label="是否有入库指定时间" :label-width="160">
								<Select
									placeholder="请选择"
									style="width:100px"
									v-model="isSense.assign_put_time"
									@on-change="
										event => {
											onIs(event, 'assign_put_time')
										}
									"
								>
									<Option v-for="(item, index) in isList" :value="item.value" :key="index">{{ item.label }}</Option>
								</Select>
								<DatePicker
									type="datetime"
									format="yyyy-MM-dd HH:mm"
									placeholder="请选择入库指定时间"
									v-model="addData.newtimeData.assign_put_time"
									v-show="isSense.assign_put_time == 'true'"
									@on-change="
										event => {
											onTime(event, 'assign_put_time')
										}
									"
									style="width:150px"
								></DatePicker>
							</FormItem>

							<FormItem label="是否需要获取司机信息" :label-width="160">
								<Select
									placeholder="请选择"
									style="width:100px"
									v-model="isSense.driver_information"
									@on-change="
										event => {
											onIs(event, 'driver_information')
										}
									"
								>
									<Option v-for="(item, index) in isList" :value="item.value" :key="index">{{ item.label }}</Option>
								</Select>
								<Input
									style="max-width:150px"
									v-model="addData.driver_information"
									v-show="isSense.driver_information == 'true'"
								></Input>
							</FormItem>

							<FormItem label="是否需要现场垫付分类费" :label-width="160">
								<Select
									placeholder="请选择"
									style="width:100px"
									v-model="isSense.spot_classify_payment"
									@on-change="
										event => {
											onIs(event, 'spot_classify_payment')
										}
									"
								>
									<Option v-for="(item, index) in isList" :value="item.value" :key="index">{{ item.label }}</Option>
								</Select>
								<Input
									style="max-width:150px"
									v-model="addData.spot_classify_payment"
									v-show="isSense.spot_classify_payment == 'true'"
								></Input>
							</FormItem>

							<FormItem label="是否需要物流携带送货单据" :label-width="160">
								<Select
									placeholder="请选择"
									style="width:100px"
									v-model="isSense.take_receipts"
									@on-change="
										event => {
											onIs(event, 'take_receipts')
										}
									"
								>
									<Option v-for="(item, index) in isList" :value="item.value" :key="index">{{ item.label }}</Option>
								</Select>
								<Input
									style="max-width:150px"
									v-model="addData.take_receipts"
									v-show="isSense.take_receipts == 'true'"
								></Input>
							</FormItem>

							<FormItem label="是否需要现场垫付贴标费" :label-width="160">
								<Select
									placeholder="请选择"
									style="width:100px"
									v-model="isSense.spot_decals_payment"
									@on-change="
										event => {
											onIs(event, 'spot_decals_payment')
										}
									"
								>
									<Option v-for="(item, index) in isList" :value="item.value" :key="index">{{ item.label }}</Option>
								</Select>
								<Input
									style="max-width:150px"
									v-model="addData.spot_decals_payment"
									v-show="isSense.spot_decals_payment == 'true'"
								></Input>
							</FormItem>
						</div>
					</Form>
				</Card>
			</Col>
		</Row>
		<div class="line"></div>
		<Row>
			<Col span="24">
				<Card>
					<p slot="title"><span class="red">*</span> 司机要求</p>
					<div class="box-center">
						<Form>
							<FormItem label="着装要求">
								<Select
									placeholder="请选择"
									style="width:100px"
									v-model="isSense.dressing"
									@on-change="
										event => {
											onIs(event, 'dressing')
										}
									"
								>
									<Option v-for="(item, index) in isList" :value="item.value" :key="index">{{ item.label }}</Option>
								</Select>
								<Input
									placeholder="着装要求"
									style="max-width:180px"
									v-model="addData.dressing"
									v-show="isSense.dressing == 'true'"
								></Input>
							</FormItem>
							<FormItem label="性别要求">
								<Select
									placeholder="请选择"
									style="width:100px"
									v-model="isSense.sex"
									@on-change="
										event => {
											onIs(event, 'sex')
										}
									"
								>
									<Option v-for="(item, index) in isList" :value="item.value" :key="index">{{ item.label }}</Option>
								</Select>
								<Select
									placeholder="请选择"
									v-model="addData.sex"
									clearable
									style="max-width:180px"
									v-show="isSense.sex == 'true'"
								>
									<Option v-for="(item, index) in sexList" :value="item.label" :key="index">{{ item.label }}</Option>
								</Select>
							</FormItem>
							<FormItem label="年龄要求">
								<Select
									placeholder="请选择"
									style="width:100px"
									v-model="isSense.age"
									@on-change="
										event => {
											onIs(event, 'age')
										}
									"
								>
									<Option v-for="(item, index) in isList" :value="item.value" :key="index">{{ item.label }}</Option>
								</Select>
								<Input
									placeholder="年龄要求"
									style="max-width:180px"
									v-model="addData.age"
									v-show="isSense.age == 'true'"
								></Input>
							</FormItem>
						</Form>
					</div>
				</Card>
			</Col>
		</Row>
		<div class="line"></div>
		<Form label-position="left" :label-width="140">
			<Row>
				<Col span="24">
					<Card>
						<p slot="title">增加栏</p>
						<Row v-for="(item, key) in increased" :key="key">
							<Col span="6" offset="2">
								<FormItem label=" ">
									<Input v-model="item.increased_key"></Input>
								</FormItem>
							</Col>
							<Col span="2">
								<Select
									placeholder="请选择"
									style="width:100"
									v-model="item.is"
									@on-change="
										event => {
											onColum(event, key)
										}
									"
								>
									<Option v-for="(item, index) in isList" :value="item.value" :key="index">{{ item.label }}</Option>
								</Select>
							</Col>
							<Col span="10" v-show="item.increased_value != '$false'">
								<Input type="textarea" v-model="item.increased_value"></Input>
							</Col>
						</Row>

						<div class="add-carge" @click="addColum">
							+ 新增要求
						</div>
					</Card>
				</Col>
			</Row>
		</Form>

		<!-- 批量导入弹窗 -->
		<Modal v-model="leadShow" width="400">
			<p slot="header">
				批量导入货品
			</p>
			<div class="leadShop">
				<div>
					<p>1、下载模板，填写信息</p>
					<br />
					<Icon type="ios-paper-outline" :size="80" color="rgb(42, 165, 21)" />
					<br />
					<Button @click="downTemp">下载模板</Button>
				</div>
				<div>
					<p>2、上传填写好的文件</p>
					<br />
					<Icon type="ios-paper-outline" :size="80" :color="upData.color" />
					<br />
					<Upload action=" " accept=".xlsx" :show-upload-list="false" :before-upload="onUpdata" v-show="upData.status">
						<Button :loading="fileloading">上传文件</Button>
					</Upload>
					<Button v-show="!upData.status" @click="onLead">导入数据</Button>
				</div>
			</div>
			<div slot="footer"></div>
		</Modal>

		<!-- 编辑弹窗 -->
		<Spin size="large" fix v-if="spinShow"></Spin>
	</Card>
</template>

<script>
export default {
	name: '',
	data() {
		const validatePhone = (rule, mobile, callback) => {
			// console.log(mobile)
			var tel = /^0\d{2,3}-?\d{7,8}$/
			var phone = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/
			if (mobile.length == 11) {
				//手机号码
				if (phone.test(mobile)) {
					callback()
				}
				callback(new Error('联系方式格式错误'))
			} else if (tel.test(mobile)) {
				//电话号码
				callback()
			} else if (mobile === '') {
				callback()
			}
			callback(new Error('联系方式格式错误'))
		}
		return {
			//上传文件按钮loading、
			fileloading: false,
			//如果为编辑设置loading
			spinShow: false,
			//如果为编辑草稿时，给id赋值然后传过去
			id: null,
			//添加数据
			addData: {
				platform: '', //平台
				delivery_warehouse: '', //发货仓库
				transport: '', //物流仓库
				to_warehouse_time: '', //出库时间
				out_warehouse_time: '', //到仓时间
				warehouse_phone: '', //仓库电话
				consignee_phone: '', //提货人联系方式
				consignee: '', //提货人
				consignee_address: '', //提货地址
				batch_number_require: '', //批次号要求
				effect_require: '', //效期要求
				remark: '', //备注
				delivery_requirements: '', //发货要求
				draft: '', //是否草稿
				carriage_high: '$false', //是否：否传空/是车箱高度要求
				car_length: '$false', //是否：否传空/是车身长度要求
				chassis_high: '$false', //是否：否传空/是车底盘高度要求
				plate_number: '$false', //是否：否传空/是车牌要求
				pygidium: '$false', //是否：否传空/是尾板要求
				number_limit: '$false', //是否：否传空/是数量限制要求
				car_type: '$false', //是否：否传空/是车型要求
				accompany: '$false', //是否：否传空/是则需要仓配人员陪同送货
				unload: '$false', //否传空/是则需要物流提供卸货
				assign_put_time: '', //是否：否传0/是则需有入库指定时间
				driver_information: '$false', //是否：否传空/是则需要获取司机信息
				spot_classify_payment: '$false', //是否：否传空/是则需要现场垫付分类费
				take_receipts: '$false', //是否：否传空/是则需要物流携带送货单据
				spot_decals_payment: '$false', //是否：否传空/是则需要现场垫付贴标费
				dressing: '$false', //是否：否传空/是着装要求
				sex: '$false', //是否：否传空/是性别要求
				age: '$false', //是否：否传空/是年龄要求
				stock_up: [
					// {
					// 	//备货信息
					// 	purchase_order_number: '', //采购单号
					// 	article_number: '', //必须货号/商品设置货号
					// 	bar_code: '', //条形码（货号带回/可修改）
					// 	carton_size: '', //箱规（货号带回/可修改）
					// 	apply_number: '', //申请数量
					// 	carton_number: '', //箱数
					// 	mantissa_number: '', //尾数
					// 	total_carton_number: '', //总箱数
					// 	product_name: '', //品名（货号带回）
					// 	product_id: '', //产品表id（货号带回）
					// },
				],
				increased: [
					//增加栏
					{
						increased_key: '',
						increased_value: null,
						is: '',
					},
				],

				newtimeData: {
					to_warehouse_time: '', //到仓时间
					out_warehouse_time: '', //出库时间
					assign_put_time: '', //入库指定时间
				},
			},
			//增加栏数据
			increased: [
				//增加栏
				// {
				// 	increased_key: '',
				// 	increased_value: '',
				// },
			],
			//发货仓库数据
			storeList: [{ label: '从化' }],
			//物流方式数据
			logisticsList: [{ label: '自仓约车' }, { label: '运营约车' }],
			//男女选择
			sexList: [{ label: '男' }, { label: '女' }],
			//表格信息
			column: [
				{
					title: '采购单号',
					align: 'center',
					key: 'purchase_order_number',
				},
				{
					title: '货号',
					align: 'center',
					key: 'article_number',
					render: (h, params) => {
						let str = params.row.article_number
						let isExisted = params.row.isExisted
						// console.log('isExisted', isExisted)
						return h(
							'span',
							{
								style: {
									color: isExisted ? '#000' : 'red',
								},
							},
							str
						)
					},
				},
				{
					title: '条形码',
					align: 'center',
					key: 'bar_code',
					render: (h, params) => {
						let str = params.row.bar_code
						let isExisted = params.row.isExisted
						return h(
							'span',
							{
								style: {
									color: isExisted ? '#000' : 'red',
								},
							},
							str
						)
					},
				},
				{
					title: '箱规',
					align: 'center',
					key: 'carton_size',
					render: (h, params) => {
						let str = params.row.carton_size
						let isExisted = params.row.isExisted
						return h(
							'span',
							{
								style: {
									color: isExisted ? '#000' : 'red',
								},
							},
							str
						)
					},
				},
				{
					title: '申请数量',
					align: 'center',
					key: 'apply_number',
					render: (h, params) => {
						let num = Number(params.row.apply_number)
						let str = num >= 0 ? num : num + '此值不能为负数'
						return h(
							'span',
							{
								style: {
									color: num >= 0 ? '#000' : 'red',
								},
							},
							str
						)
					},
				},
				{
					title: '箱数',
					align: 'center',
					key: 'carton_number',
					render: (h, params) => {
						let num = Number(params.row.carton_number)
						let str = num >= 0 ? num : num + '此值不能为负数'
						return h(
							'span',
							{
								style: {
									color: num >= 0 ? '#000' : 'red',
								},
							},
							str
						)
					},
				},
				{
					title: '尾数',
					align: 'center',
					key: 'mantissa_number',
					render: (h, params) => {
						let num = Number(params.row.mantissa_number)
						let str = num >= 0 ? num : num + '此值不能为负数'
						return h(
							'span',
							{
								style: {
									color: num >= 0 ? '#000' : 'red',
								},
							},
							str
						)
					},
				},
				{
					title: '总箱数',
					align: 'center',
					key: 'total_carton_number',
					render: (h, params) => {
						let num = Number(params.row.total_carton_number)
						let str = num >= 0 ? num : num + '此值不能为负数'
						return h(
							'span',
							{
								style: {
									color: num >= 0 ? '#000' : 'red',
								},
							},
							str
						)
					},
				},
				{
					title: '操作',
					slot: 'action',
					// width: 150,
					align: 'center',
				},
			],
			//备货信息
			stock_up: [
				{
					//备货信息
					purchase_order_number: null, //采购单号
					article_number: null, //必须货号/商品设置货号
					bar_code: null, //条形码（货号带回/可修改）
					carton_size: null, //箱规（货号带回/可修改）
					apply_number: null, //申请数量
					carton_number: null, //箱数
					mantissa_number: null, //尾数
					total_carton_number: null, //总箱数
					product_name: null, //品名（货号带回）
					product_id: null, //产品表id（货号带回）
					isExisted: 1,
					artoptions: [], //模糊搜索数组
				},
			],
			//是否
			isList: [
				{
					label: '是',
					value: 'true',
				},
				{
					label: '否',
					value: 'false',
				},
			],
			searchloading: false,
			//模糊搜索内容
			artoptions: [],
			//模糊搜索暂时存放
			// artList: [],
			leadShow: false,
			//上传后的数据
			upData: {
				color: 'rgb(81, 90, 110)',
				status: true,
			},
			//临时存放表格数据数据
			xlsData: [],
			//提交按钮loading
			sumLoading: false,
			//保存草稿loading
			defLoading: false,
			//平台模糊搜索loading
			plaSearchloading: false,
			//平台模糊搜索存放数组
			plaoptions: [],
			//是否绑定
			isSense: {
				carriage_high: 'false',
				car_length: 'false',
				chassis_high: 'false',
				plate_number: 'false',
				pygidium: 'false',
				number_limit: 'false',
				car_type: 'false',
				accompany: 'false',
				unload: 'false',
				assign_put_time: 'false',
				driver_information: 'false',
				spot_classify_payment: 'false',
				take_receipts: 'false',
				spot_decals_payment: 'false',
				dressing: 'false',
				sex: 'false',
				age: 'false',
			},
			//编辑用的临时存放数据
			redactData: {},
			redactShow: false,
			//编辑数据的索引
			redactIndex: 0,
			//限制不能选择当天
			optionsData: {
				disabledDate(date) {
					return date && date.valueOf() < Date.now()
				},
			},
			//时间格式
			newtimeData: {
				to_warehouse_time: '', //到仓时间
				out_warehouse_time: '', //出库时间
				assign_put_time: '', //入库指定时间
			},
			//处理模糊搜索赋值不显示的判断
			isExisted: 1,
			validatePhone,
			ruleCustom: {
				platform: [{ required: true, message: '平台不能为空', trigger: 'blur' }],
				delivery_warehouse: [{ required: true, message: '发货仓库不能为空', trigger: 'blur' }],
				out_warehouse_time: [{ required: true, message: '出库时间不能为空', trigger: 'blur', type: 'date' }],
				to_warehouse_time: [{ required: true, message: '到仓时间不能为空', trigger: 'blur', type: 'date' }],
				warehouse_phone: [{ validator: validatePhone, trigger: 'blur' }],
				consignee_address: [{ required: true, message: '送货地址不能为空', trigger: 'blur' }],
				consignee_phone: [{ validator: validatePhone, trigger: 'blur' }],
			},
		}
	},
	methods: {
		// onDel(id) {},
		//模糊搜索
		remoteMethod(query, index, item) {
			if (item.isExisted == 3) {
				item.isExisted = 4
				return
			}
			query = query.trim()
			if (query !== '') {
				this.searchloading = true
				this.getAction(query, index)
			} else {
				this.stock_up[index].artoptions = []
			}
		},
		//模糊搜索货号请求
		getAction(name, index) {
			this.$api.accountSearch({ name }).then(res => {
				// console.log(res)
				this.searchloading = false
				const list = res.data.map(item => {
					return {
						article_number: item.article_number,
						bar_code: item.bar_code,
						carton_size: item.carton_size,
						product_id: item.product_id,
						product_name: item.product_name,
					}
				})
				this.stock_up[index].artoptions = list.filter(
					item => item.article_number.toLowerCase().indexOf(name.toLowerCase()) > -1
				)
			})
		},
		//搜索点击时，触发相关数据
		artChange(data, index, item) {
			// console.log(data)
			let obj = {}
			item.artoptions.forEach(item => {
				if (item.article_number === data) {
					obj = item
					return
				}
			})
			// console.log(obj)
			this.stock_up[index].article_number = obj.article_number
			this.stock_up[index].bar_code = obj.bar_code
			this.stock_up[index].carton_size = obj.carton_size
			this.stock_up[index].product_id = obj.product_id
			this.stock_up[index].product_name = obj.product_name
		},
		reArtChange(data) {
			let obj = {}
			this.artoptions.forEach(item => {
				if (item.article_number === data) {
					obj = item
					return
				}
			})
			this.redactData.article_number = obj.article_number
			this.redactData.bar_code = obj.bar_code
			this.redactData.carton_size = obj.carton_size
			this.redactData.product_id = obj.product_id
			this.redactData.product_name = obj.product_name
		},
		//点击清空时
		onSrtClean(index) {
			this.stock_up[index].article_number = ''
			this.stock_up[index].bar_code = ''
			this.stock_up[index].carton_size = ''
			this.stock_up[index].product_id = ''
			this.stock_up[index].product_name = ''
		},
		//编辑数据点击清空
		onReSrtClean() {
			this.redactData.article_number = ''
			this.redactData.bar_code = ''
			this.redactData.carton_size = ''
			this.redactData.product_id = ''
			this.redactData.product_name = ''
		},
		//点击删除当前行
		artDeal(index) {
			this.stock_up.splice(index, 1)
		},
		//点击添加备货的保存时
		artSave(item, index) {
			// console.log(item)
			for (let i in item) {
				// console.log(i)
				if (item[i] === '' && i != 'purchase_order_number') {
					this.$Message.warning('请将内容填写完整，采购单号为选填！')
					return
				}
			}
			item.isExisted = 1
			this.addData.stock_up.push(item)
			this.stock_up.splice(index, 1)
		},
		//添加备货信息点击
		addArt() {
			let obj = {
				//备货信息
				purchase_order_number: '', //采购单号
				article_number: '', //必须货号/商品设置货号
				bar_code: '', //条形码（货号带回/可修改）
				carton_size: '', //箱规（货号带回/可修改）
				apply_number: '', //申请数量
				carton_number: '', //箱数
				mantissa_number: '', //尾数
				total_carton_number: '', //总箱数
				product_name: '', //品名（货号带回）
				product_id: '', //产品表id（货号带回）
				isExisted: 1, //正确与否
			}
			if (this.stock_up.length === 0) {
				this.stock_up.push(obj)
				return
			}
			let item = this.stock_up[this.stock_up.length - 1]
			for (let i in item) {
				// console.log(i)
				if (item[i] === '' && i != 'purchase_order_number') {
					this.$Message.warning('请将上述表单填写完整，采购单号为选填')
					return
				}
			}
			this.addData.stock_up.push(...this.stock_up)
			this.stock_up = []
			this.stock_up.push(obj)
		},
		//表格删除按钮
		onTabDeal(index,row) {
			this.addData.stock_up.splice(index, 1)
		},
		//如果选否，控制文本框显示与隐藏及文本框是否清空
		onIs(data, name) {
			// console.log(data)
			if (data === 'true') {
				this.addData[name] = ''
			} else {
				if (name === 'assign_put_time') {
					this.addData[name] = ''
					return
				}
				this.addData[name] = '$false'
			}
		},
		//增加栏
		addColum() {
			let obj = {
				increased_key: '',
				increased_value: null,
				is: '',
			}
			if (this.increased.length < 1) {
				this.increased.push(obj)
				return
			}
			for (let i in this.increased) {
				if (this.increased[i].increased_key === '') {
					this.$Message.warning('请将前面需要添加的信息填写完整再添加新的内容！')
					return
				}
			}
			this.increased.push(obj)
		},
		//点击
		onColum(data, index) {
			if (data === 'true') {
				this.increased[index].increased_value = ''
			} else {
				this.increased[index].increased_value = '$false'
			}
		},
		//点击批量导入
		onLeadclick() {
			this.xlsData = []
			this.leadShow = true
		},
		//下载模板
		downTemp() {
			this.$api.downtemp().then(res => {
				// console.log(res)
				window.location.href = res.data[0]
			})
		},
		//文件上传
		onUpdata(file) {
			if (file.size > 8388608) {
				this.$Message.error('上传失败，文件大于8M')
				return false
			}
			var UploadForm = new FormData()
			UploadForm.append('UploadForm[excel]', file)
			this.fileloading = true
			this.$api
				.inupdata(UploadForm)
				.then(res => {
					this.fileloading = false
					if (res.code == 0) {
						if (res.data.length == 0) {
							this.$Message.warning('表格数据为空！')
							return
						}
						this.$Message.success(res.message)
						// this.addData.stock_up.push(...res.data)
						this.xlsData = res.data
					} else {
						this.$Message.warning(res.message)
					}
				})
				.catch(err => {
					this.fileloading = false
				})
			return false
		},
		//点击导入数据
		onLead() {
			this.addData.stock_up.push(...this.xlsData)
			this.leadShow = false
		},
		//点击保存时
		onSumb(type) {
			// if (!this.isPhone(addData.warehouse_phone) && !this.isPhone(addData.consignee_phone)) {
			// 	return
			// }
			for (let i in this.addData.stock_up) {
				if (!this.addData.stock_up[i].isExisted) {
					this.$Message.warning('备货信息存在错误信息！请修改后上传！')
					return
				}
			}

			if (this.isstockUp(this.addData.stock_up)) {
				this.$Message.warning('备货信息中存在负数，请更改后提交！')
				return
			}
			// this.addData.increased = this.increased
			this.addData.increased = this.increased.map(({ increased_key, increased_value }) => ({
				increased_key,
				increased_value,
			}))
			let is = true
			this.$refs.editForm.validate(res => {
				// console.log(res)
				is = res
				if (!res) {
					return
					// this.sumLoading = false
					// this.defLoading = false
				}
			})
			if (this.addData.consignee_address == '') {
				return
			}
			if (this.addData.stock_up.length < 1) {
				this.$Message.warning('备货信息为必填信息')
				return
			}
			is = this.rulData(this.addData)
			if (!is) {
				return false
			}

			if (type === 'sum') {
				this.addData.draft = 0
				this.sumLoading = true
			} else {
				this.addData.draft = 1
				this.defLoading = true
			}

			if (this.id) {
				this.addData.id = this.id
				this.$api
					.alertData(this.addData)
					.then(res => {
						this.sumLoading = false
						this.defLoading = false
						if (res.code == 0) {
							this.$Message.success(res.message)
							this.$router.push({
								path: 'the-cargo',
							})
						} else {
							this.$Message.warning(res.message)
						}
					})
					.catch(error => {
						this.sumLoading = false
						this.defLoading = false
					})
			} else {
				// console.log('触发上报')
				let params = JSON.parse(JSON.stringify(this.addData))
				this.$api
					.wareAdd(params)
					.then(res => {
						this.sumLoading = false
						this.defLoading = false
						if (res.code == 0) {
							this.$Message.success(res.message)
							this.$router.push({
								path: 'the-cargo',
							})
						} else {
							this.$Message.warning(res.message)
						}
					})
					.catch(error => {
						this.sumLoading = false
						this.defLoading = false
					})
			}
		},
		//模糊搜索平台
		plaRemoteMethod(query) {
			if (query !== '') {
				this.plaSearchloading = true
				this.getPla(query)
			} else {
				this.plaoptions = []
			}
		},
		// 平台模糊搜索
		getPla(name) {
			this.$api.wareptSearch({ name }).then(res => {
				// console.log(res)
				this.plaSearchloading = false
				const list = res.data.map(item => {
					return {
						id: item.id,
						merchant_name: item.merchant_name,
					}
				})
				this.plaoptions = list.filter(item => item.merchant_name.toLowerCase().indexOf(name.toLowerCase()) > -1)
			})
		},
		//时间选择
		onTime(data, type) {
			this.addData[type] = data
			// console.log(this.addData[type])
		},
		//格式化时间
		timestampToTime(timestamp) {
			let date = new Date(timestamp * 1000) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
			let Y = date.getFullYear() + '-'
			let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
			let D = date.getDate() + ' '
			let h = date.getHours() + ':'
			let m = date.getMinutes() + ':'
			let s = date.getSeconds()
			return Y + M + D + h + m + s
			// return Y + M + D
		},
		//获取详情数据
		getDeatils(id) {
			this.spinShow = true
			this.$api.getwareData({ id }).then(res => {
				this.spinShow = false
				if (res.code == 0) {
					// console.log(res.data)
					res.data.to_warehouse_time = this.timestampToTime(res.data.to_warehouse_time)
					res.data.out_warehouse_time = this.timestampToTime(res.data.out_warehouse_time)
					// res.logistics.data.assign_put_time =
					// 	res.data.logistics.assign_put_time == 0 ? null : this.timestampToTime(res.data.assign_put_time)
					res.data.newtimeData = {
						to_warehouse_time: res.data.to_warehouse_time,
						out_warehouse_time: res.data.out_warehouse_time,
						assign_put_time:
							res.data.logistics.assign_put_time == 0 ? null : this.timestampToTime(res.data.logistics.assign_put_time),
					}
					res.data.logistics.assign_put_time = this.timestampToTime(res.data.logistics.assign_put_time)

					// console.log('res.data.newtimeData', res.data.newtimeData)
					this.addData.newtimeData = res.data.newtimeData

					for (let i in res.data) {
						for (let j in this.addData) {
							if (i == j) {
								this.addData[j] = res.data[i]
							}
						}
					}

					for (let k in res.data.logistics) {
						this.addData[k] = res.data.logistics[k]
						this.isSense[k] = res.data.logistics[k] == '$false' ? 'false' : 'true'
					}
					this.addData.stock_up = res.data.stockUp
					// console.log(this.addData)
					this.increased = this.addData.increased
					this.increased.forEach(item => {
						item.is = item.increased_value === '$false' ? 'false' : 'true'
					})
					if (!res.data.newtimeData.assign_put_time) {
						this.isSense.assign_put_time = 'false'
					}
					// console.log(this.addData)
					//处理一下判断数据是否错误的报红数据，后端不传所以自己加
					this.addData.stock_up.forEach((item, index) => {
						item.isExisted = 1
					})
				} else {
					this.$Message(res.message)
				}
			})
		},
		//验证选择是否的表单是否已填
		rulData(data) {
			let arr = [
				'carriage_high',
				'car_length',
				'chassis_high',
				'plate_number',
				'pygidium',
				'number_limit',
				'car_type',
				'accompany',
				'unload',
				'assign_put_time',
				'driver_information',
				'spot_classify_payment',
				'take_receipts',
				'spot_decals_payment',
				'dressing',
				'sex',
				'age',
			]
			if (!this.addData.sex || this.addData.sex === '') {
				this.$Message.warning('如若选择了性别要求为是，则必须选择性别!')
				return false
			}
			if (this.isSense.assign_put_time == 'true' && this.addData.assign_put_time === '') {
				this.$Message.warning('如若选择了需要入库指定时间则必须填写时间！')
				return false
			}
			for (let i in arr) {
				if (!data[arr[i]] && data[arr[i]] != '') {
					// console.log(data[arr[i]])

					this.$Message.warning('车辆要求,入库要求,司机要求为必填！请填写完整再提交！')
					return false
				}
			}
			return true
		},
		//编辑数据
		onRedact(index,row) {
			if (this.stock_up[0]) {
				if (this.stock_up[0].isExisted == 4) {
					this.$Message.warning('请完成上一次编辑')
					return
				}
			}
			let objString = JSON.stringify(this.addData.stock_up[index])
			let obj = JSON.parse(objString)

			delete obj.artoptions
			let artArr = [
				{
					article_number: obj.article_number,
				},
			]
			// this.artoptions = artArr
			obj.artoptions = artArr
			// console.log('artoptions',this.artoptions)
			if (!obj.isExisted) {
				obj.carton_size = ''
				obj.bar_code = ''
			}
			obj.isExisted = 3
			obj.apply_number = Number(obj.apply_number)
			obj.carton_number = Number(obj.carton_number)
			obj.mantissa_number = Number(obj.mantissa_number)
			obj.total_carton_number = Number(obj.total_carton_number)
			this.onTabDeal(index)
			this.stock_up.unshift(obj)
		},
		onRedactSave() {
			this.addData.stock_up[redactIndex] = this.redactData
			this.redactShow = false
		},
		//效验批量导入内容是否为负数
		isstockUp(arr) {
			let is = false
			arr.forEach(item => {
				if (
					Number(item.apply_number) < 0 ||
					Number(item.carton_number) < 0 ||
					Number(item.mantissa_number) < 0 ||
					Number(item.total_carton_number) < 0
				) {
					is = true
				}
			})
			return is
		},
		isPhone(num) {
			var tel = /^0\d{2,3}-?\d{7,8}$/
			var phone = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/
			if (phone.test(num)) {
				return true
			}
			if (tel.test(num)) {
				return true
			}
			if (num == '') {
				return true
			}
			this.$Message.warning('联系方式格式有误')
			return false
		},
	},
	created() {
		let id = this.$route.query.id
		if (id) {
			this.id = id
			this.getDeatils(id)
		}
	},
	watch: {
		xlsData: {
			handler(newName, oldName) {
				if (this.xlsData.length == 0) {
					this.upData.color = 'rgb(81, 90, 110)'
					this.upData.status = true
				} else {
					this.upData.color = 'rgb(42, 165, 21)'
					this.upData.status = false
				}
			},
		},
	},
}
</script>

<style lang="less">
.card-title {
	text-align: right;
}
.sup-con {
	padding-top: 1rem;
	overflow: hidden;
}
.tabBox {
	// padding-bottom: 2rem;
	/deep/.ivu-table-overflowX {
		overflow-x: hidden;
	}
}

.ivu-table-tip {
	overflow-x: hidden;
}

.add-carge {
	text-align: center;
	cursor: pointer;
	border: 1px rgb(192, 189, 189) dashed;
	padding: 0.5rem 0;
	margin: 1rem 0;
	border-radius: 5px;
	color: rgb(90, 90, 90);
}
.line {
	padding-bottom: 1rem;
}

.box-center {
	margin: 0 auto;
	// min-width: 50%;
	// max-width: 70%;
	width: 70%;
	// text-align: center;
}

.impro {
	text-align: right;
	padding-bottom: 1rem;
}

.leadShop {
	width: 100%;
	height: 100%;
	display: flex;
}
.leadShop > div {
	flex: 1;
	text-align: center;
}

.red {
	color: red;
}
</style>
