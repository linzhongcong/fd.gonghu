<template>
	<Card>
		<Tabs v-model="currentTabPane">
			<TabPane label="基础信息" name="shopAddress" :style="{height: tabPaneHeight}" >
				<Row ref="shopAddressForm">
					<Row>
						<Col><h3>基础信息</h3></Col>
						<Col>
							<Form :model="shopAddress.basicForm" :label-width="100" style="padding-top: 20px">
								<Row >
									<Col span="11">
										<FormItem label="商家名称：">
											<Input v-model="shopAddress.basicForm.merchant_name" readonly/>
										</FormItem>
									</Col>
									<Col span="5">
										<FormItem label="商家类型：">
											<Input v-model="shopAddress.basicForm.merchant_type" readonly/>
										</FormItem>
									</Col> 
								</Row>
								<Row >
									<Col span="5">
										<FormItem label="创建人：">
											<Input v-model="shopAddress.basicForm.created_by" readonly/>
										</FormItem>
									</Col>
									<Col span="5" offset="1">
										<FormItem label="创建时间：">
											<Input v-model="shopAddress.basicForm.created_at" readonly/>
										</FormItem>
									</Col>
								</Row>
								<Row >
									<Col span="5">
										<FormItem label="业务员：">
											<Input v-model="shopAddress.basicForm.salesman" readonly/>
										</FormItem>
									</Col>
									<Col span="5" offset="1">
										<FormItem label="联系人姓名：">
											<Input v-model="shopAddress.basicForm.contact_name" readonly/>
										</FormItem>
									</Col>
									<Col span="5" >
										<FormItem label="联系人电话：">
											<Input v-model="shopAddress.basicForm.contact_phone" readonly/>
										</FormItem>
									</Col>
								</Row>
									<Row style="height:100px">
									<Col span="2" align='start' style="font-size:12px;padding-left:33px">
										营业执照：
									</Col>
									<Col span="20" v-if="shopAddress.basicForm.businessLicense" >
									<div class="upload-list" v-for="(item,index) in shopAddress.basicForm.businessLicense" :key="index">
                			<template >
                    <img :src="item.url_show" style="width:100px;height:100px;object-fit:cover">
                    <div class="upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleView(item,index,'1','businessLicense')"></Icon>
                    </div>
                </template>
                </div>
									</Col>
								
								</Row>
							</Form>
						</Col>
					</Row>
					<hr class="hr"/>
					<Row>
						<Col><h3>政策信息</h3></Col>
						<Col>
							<Form :model="shopAddress.policyForm" :label-width="100" style="padding-top: 20px">
								<Row >
									<Col span="5">
										<FormItem label="合同签约日期：">
											<Input v-model="shopAddress.policyForm.begin_at" readonly style="text-align: center"/>
										</FormItem>
									</Col>
									<Col span="5" offset="1">
										<FormItem label="合同到期日期：">
											<Input v-model="shopAddress.policyForm.end_at" readonly/>
										</FormItem>
									</Col> 
									<Col span="5">
										<FormItem label="开始合作日期">
											<Input v-model="shopAddress.policyForm.cooperate_start_at" readonly/>
										</FormItem>
									</Col> 
								</Row>
								<Row >
									<Col span="16">
										<FormItem label="合同地址：">
											<Input v-model="shopAddress.policyForm.contract_addr" readonly/>
										</FormItem>
									</Col>
								</Row>
								<Row >
									<Col span="5">
										<FormItem label="合同政策：">
											<Input v-model="shopAddress.policyForm.partner_policy_name" readonly/>
										</FormItem>
									</Col>
									<Col span="5" offset="1">
										<FormItem label="合作方式：">
											<Input v-model="shopAddress.policyForm.payment_method" readonly/>
										</FormItem>
									</Col>
								</Row>
								<Row >
									<Col span="5">
										<FormItem label="账期：">
											<Input v-model="shopAddress.policyForm.payment_days" readonly/>
										</FormItem>
									</Col>
									<Col span="5" offset="1">
										<FormItem label="结账日：">
											<Input v-model="shopAddress.policyForm.payment_at" readonly/>
										</FormItem>
									</Col>
								</Row>
								<Row >
									<Col span="16">
										<FormItem label="备注：">
											<Input v-model="shopAddress.policyForm.remark" readonly/>
										</FormItem>
									</Col>
								</Row>
							</Form>
						</Col>
					</Row>

					<hr class="hr"/>
					<Row>
						<Col><h3>附件信息</h3></Col>
						<Col style="padding-top: 20px">
							<Row v-for="(item, index) in shopAddress.annexForm.fileItems" :key="index">
								<Col span="16" v-if="item.extension === 'jpg' || item.extension === 'jpeg' ">
									<div class="annex">
										<span class="label">附件{{index + 1}}：</span>
											<div class="content" @click="preview(item.url)">
												<Tooltip content="点击预览图片" placement="top">
													{{item.title}}.{{item.extension}}
												</Tooltip>
											</div>
									</div>
								</Col>
								<Col span="16" v-else>
									<div class="annex">
										<span class="label">附件{{index + 1}}：</span>
										<div class="content" @click="dowmload(item.url)">
												<Tooltip content="点击下载文件" placement="top">
													{{item.title}}.{{item.extension}}
												</Tooltip>
											</div>
									</div>
								</Col>
							</Row>
						</Col>
					</Row>
					<hr class="hr"/>
					<Row>
						<Col><h3>收货地址</h3></Col>
            <Col>
              <Form  :model="receiptForm.searchForm" :label-width="100" style="padding-top: 20px">
                <Row type="flex" justify="space-between" >
                  <Col >
                    <FormItem label="收货地址：">
                      <Input v-model="receiptForm.searchForm.receiving_address" clearable/>
                    </FormItem>
                  </Col>
                  <Col align='right'>
                    <FormItem >
                      <Button type="primary" @click="search('receiptForm')">搜索</Button>
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            </Col>
						<Col style="padding-top: 20px" :span="24" >
						<Table :columns='receiptForm.columns' :data='receiptForm.contractorReceivingAddrGroup' border :loading="tableLoading"></Table>
							<hr class="hr"/>
						</Col>
					</Row>
          <Row ref="page" style="padding: 20px 0">
            <div style="float: left">共 {{receiptForm.pageProps.total}} 条</div>
            <div style="float: right">
              <Page :total="receiptForm.pageProps.total" :current="receiptForm.pageProps.page" transfer size="small" show-elevator show-sizer @on-change="(val) => changePage('receiptForm')" @on-page-size-change="(val) => changePageSize(val,'receiptForm')" />
            </div>
          </Row>
				</Row>
					<hr class="hr"/>
				<Row ref="shopAddressTable" class="shopaddress">
					<Col><h3>门店信息</h3></Col>
					<Col>
						<Form  :model="shopAddress.searchForm" :label-width="100" style="padding-top: 20px">
							<Row type="flex" justify="space-between" >
								<Col >
									<FormItem label="门店名称：">
										<Input v-model="shopAddress.searchForm.name" clearable/>
									</FormItem>
								</Col>
								<Col >
									<FormItem label="门店地址：">
										<Input v-model="shopAddress.searchForm.address" style="width: 500px"  clearable/>
									</FormItem>
								</Col>
								<Col >
									<FormItem >
										<Button type="primary" @click="search('shopAddress')">搜索</Button>
									</FormItem>
								</Col>
							</Row>
						</Form>
					</Col>
					<Col>
					<Row >
								<Table :columns="shopAddress.columns" :data="shopAddress.data" border :loading="tableLoading">
								<div slot-scope="{row, index}" slot="facadeFileItem" :key="index + 'facadeFileItem'">
									<div class="upload-list" v-for="(item2,index2) in row.fileItems" :key="index2">
                		<template >
                    <img :src="item2.url_show" style="width:100px;height:100px;object-fit:cover">
                    <div class="upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleView(item2,index2,'1','facadeFileItem')"></Icon>
                       
                    </div>
                		</template>
                </div>
									</div>
									</Table>
							</Row>
					</Col>
				</Row>
				<Row ref="page" style="padding: 20px 0">
					<div style="float: left">共 {{shopAddress.pageProps.total}} 条</div>
					<div style="float: right">
						<Page :total="shopAddress.pageProps.total" :current="shopAddress.pageProps.page" transfer size="small" show-elevator show-sizer @on-change="(val)=>changePage(val,'shopAddress')" @on-page-size-change="(val)=>changePageSize(val,'shopAddress')" />
					</div>
				</Row>
          <hr class="hr"/>
					<Row>
						<Col><h3>审核信息</h3></Col>
						<Col>
							<Form :model="shopAddress.reviewForm" :label-width="100" style="padding-top: 20px">
								<Row >
									<Col span="5">
										<FormItem label="审核人：">
											<Input v-model="shopAddress.reviewForm.reviewer" readonly/>
										</FormItem>
									</Col>
									<Col span="5" offset="1">
										<FormItem label="审核结果：">
											<Input v-model="shopAddress.reviewForm.audit_pass" readonly/>
										</FormItem>
									</Col>
								</Row>
								<Row >
									<Col span="5">
										<FormItem label="审核时间：">
											<Input v-model="shopAddress.reviewForm.reviewer_at" readonly/>
										</FormItem>
									</Col>
									<Col span="5" offset="1">
										<FormItem label="审核意见：">
											<Input v-model="shopAddress.reviewForm.opinion" readonly/>
										</FormItem>
									</Col>
								</Row>
							</Form>
						</Col>
					</Row>
				<!-- <Row >
					<div style="text-align: right; padding-top: 20px">
						<Button type="primary" @click="back">返回</Button>
					</div>
				</Row> -->
			</TabPane>
			<TabPane label="订单信息" name="order" :style="{height: tabPaneHeight}">
				<Form ref="orderForm" :model="order.searchForm" :label-width="130" inline>
					<FormItem label="总下单次数：">
						<Input v-model="order.searchForm.order_count" readonly/>
					</FormItem>
					<FormItem label="总订单应收金额：">
						<Input v-model="order.searchForm.order_price" readonly/>
					</FormItem>
					<FormItem label="已收款金额：">
						<Input v-model="order.searchForm.order_receipt_price" readonly/>
					</FormItem>
					<FormItem label="最近下单时间">
						<Input v-model="order.searchForm.order_time" readonly/>
					</FormItem>
				</Form>
				<Row ref="orderTable">
					<Table :columns="order.columns" :data="order.data" border :loading="tableLoading">
						<template slot="item_no" slot-scope="{ row }">
							<div v-for="item in row.product" :key="item.id">{{item.item_no}}</div>
						</template>
						<template slot="number" slot-scope="{ row }">
							<div v-for="item in row.product" :key="item.id">{{item.number}}</div>
						</template>
					</Table>
				</Row>
				<Row ref="page" style="padding: 20px 0">
				<div style="float: left">共 {{order.pageProps.total}} 条</div>
				<div style="float: right">
					<Page :total="order.pageProps.total" :current="order.pageProps.page" transfer size="small" show-elevator show-sizer @on-change="changePage" @on-page-size-change="changePageSize" />
				</div>
			</Row>
			</TabPane>
			<TabPane label="销售单信息" name="sale" :style="{height: tabPaneHeight}">
				<Form ref="saleForm" :model="sale.searchForm" :label-width="130" inline>
					<FormItem label="总销售单量：">
						<Input v-model="sale.searchForm.count" readonly/>
					</FormItem>
					<FormItem label="总销售单货值：">
						<Input v-model="sale.searchForm.price" readonly/>
					</FormItem>
					<FormItem label="最近下单时间：">
						<Input v-model="sale.searchForm.time" readonly/>
					</FormItem>
				</Form>
				<Row ref="saleTable">
					<Table :columns="sale.columns" :data="sale.data" border :loading="tableLoading">
						<template slot="item_no" slot-scope="{ row }">
								<div v-for="(item, index) in row.product" :key="index">{{item}}</div>
						</template>
					</Table>
				</Row>
				<Row ref="page" style="padding: 20px 0">
					<div style="float: left">共 {{sale.pageProps.total}} 条</div>
					<div style="float: right">
						<Page :total="sale.pageProps.total" :current="sale.pageProps.page" transfer size="small" show-elevator show-sizer @on-change="changePage" @on-page-size-change="changePageSize" />
					</div>
			</Row>
			</TabPane>
			<TabPane label="库存单信息" name="stock" :style="{height: tabPaneHeight}">
				<Form ref="stockForm" :model="stock.searchForm" :label-width="130" inline>
					<FormItem label="总库存单量：">
						<Input v-model="stock.searchForm.count" readonly/>
					</FormItem>
					<FormItem label="总库存单货值">
						<Input v-model="stock.searchForm.price" readonly/>
					</FormItem>
					<FormItem label="最近下单时间：">
						<Input v-model="stock.searchForm.time" readonly/>
					</FormItem>
				</Form>
				<Row ref="stockTable">
					<Table :columns="stock.columns" :data="stock.data" border :loading="tableLoading">
						<template slot="item_no" slot-scope="{ row }">
							<div v-for="(item, index) in row.product" :key="index">{{item}}</div>
						</template>
					</Table>
				</Row>
				<Row ref="page" style="padding: 20px 0">
				<div style="float: left">共 {{stock.pageProps.total}} 条</div>
				<div style="float: right">
					<Page :total="stock.pageProps.total" :current="stock.pageProps.page" transfer size="small" show-elevator show-sizer @on-change="changePage" @on-page-size-change="changePageSize" />
				</div>
			</Row>
			</TabPane>
			<TabPane label="签到信息" name="checkIn" :style="{height: tabPaneHeight}">
				<Form ref="checkInForm" :model="checkIn.searchForm" :label-width="130" inline>
					<FormItem label="总签到次数：">
						<Input v-model="checkIn.searchForm.count" readonly/>
					</FormItem>
					<FormItem label="最近一次签到人：">
						<Input v-model="checkIn.searchForm.person" readonly/>
					</FormItem>
					<FormItem label="最后一次签到时间：">
						<Input v-model="checkIn.searchForm.time" readonly/>
					</FormItem>
				</Form>
				<Row ref="checkInTable">
					<Table :columns="checkIn.columns" :data="checkIn.data" border :loading="tableLoading" />
				</Row>
				<Row ref="page" style="padding: 20px 0">
				<div style="float: left">共 {{checkIn.pageProps.total}} 条</div>
				<div style="float: right">
					<Page :total="checkIn.pageProps.total" :current="checkIn.pageProps.page" transfer size="small" show-elevator show-sizer @on-change="changePage" @on-page-size-change="changePageSize" />
				</div>
			</Row>
			</TabPane>
		</Tabs>
			<Row >
				<div style="text-align: right">
					<Button type="primary" @click="back">返回</Button>
				</div>
			</Row>
			<!--预览图片-->
    <Modal
      v-model="premodal"
      title="图片预览"
      :mask-closable="false"
      scrollable
      footer-hide
    >
      <img class="preimg" :src="readImageUrl" />
    </Modal>
		    <!-- 图片预览 -->
    <Modal v-model="showBusinessLicenseImg">
          <img :src="showBusinessLicenseImgUrl " v-if="showBusinessLicenseImg" style="width: 100%">
    </Modal>
	</Card>
</template>

<script>
import { SERVER_BASE_URL } from '~/api/config';
	export default {
		data() {
			return {
				//预览
        showBusinessLicenseImg:false,
        showBusinessLicenseImgUrl:'',
				premodal: false,
				readImageUrl: '',
				currentTabPane: 'shopAddress',
				tabPaneHeight: '',
				tableLoading: false,
				shopAddress: {
					columns: [
						{ type: 'selection', width: 60, align: 'center' },
            // { title: '门店编号', key: 'id', minWidth: 85, align: 'center' },
            { title: '门店名称', key: 'name', minWidth: 150, align: 'center' },
            { title: '省', key: 'province', minWidth: 85, align: 'center' },
            { title: '市', key: 'city', minWidth: 85, align: 'center' },
            { title: '区', key: 'county', minWidth: 85, align: 'center' },
            { title: '门店地址', key: 'address', minWidth: 250, align: 'center' },
            { 
              title: '经营状态',
              key: 'manageStatus',
              minWidth: 100,
              align: 'center',
              render: (h, params) => {
                let status = params.row.manageStatus
                if(status === 'open') {
                  return h('span', '在业')
                } else if(status === 'close') {
                  return h('span', '停业')
                }
              }
            },
					],
					data:[],//店铺
					basicForm: {
						merchant_name: '', 
						merchant_type: '',
						created_by: '', 
						created_at: '',
						salesman: '',
						contact_name: '',
						contact_phone: '',
						businessLicense:[],//营业照片
					},
					policyForm: {
						begin_at: '',
						end_at: '',
						cooperate_start_at: '',
						contract_addr: '',
						partner_policy_name: '',
						payment_method: '',
						payment_days: '',
						payment_at: '',
						remark: '',
					},
					reviewForm: {
						reviewer: '',
						audit_pass: '',
						reviewer_at: '',
						opinion: '',
					},
					annexForm: {
						fileItems: [],
					},

					searchForm: {
						name: '',
						address: '',
					},
					pageProps: {
						total: 0,
						page: 1,
						perPage: 10
					}
				},
				receiptForm: {
					pageProps: {
						total: 0,
						page: 1,
						perPage: 10
					},
					searchForm: {
						receiving_address: '',
					},
						contractorReceivingAddrGroup: [],
						columns:[
							{
								title: '序号',
							 type: 'index',
								align: 'center',
								width: 100
							},
							{
								title: '收货地址地区',
								key: 'county',
								align: 'center',
								render: (h, params) => {
              		return h('div', {
              		}, [params.row.province+params.row.city+params.row.county]);
            		}
							},
							{
								title: '收货地址',
								key: 'receiving_address',
								align: 'center',
							},
							{
								title: '联系人',
								key: 'contact',
								align: 'center',
								width: 200
							},
							{
								title: '联系方式',
								key: 'contact_information',
								align: 'center',
								width: 300
							},
						]
						
					},
				order: {
					searchForm: {
						order_count: '',
						order_price: '',
						order_receipt_price: '',
						order_time: '',
					},
					columns: [
						{
							title: '序号',
							key: 'id',
							align: 'center',
							width: 100
						},
						{
							title: '订单编号',
							key: 'order_sn',
							align: 'center',
						},
						{
							title: '下单时间',
							key: 'order_time',
							align: 'center',
						},
						{
							title: '货号',
							align: 'center',
							slot: 'item_no',
							width: 200
						},
						{
							title: '数量',
							align: 'center',
							slot: 'number'
						},
						{
							title: '订单应收金额',
							key: 'total_order_amount',
							align: 'center',
						},
						{
							title: '审核状态',
							key: 'status',
							align: 'center',
						},
						{
							title: '收款状态',
							key: 'receivables_status',
							align: 'center',
						},
						{
							title: '完成收款时间',
							key: 'collection_completion_at',
							align: 'center',
						}
					],
					data: [],
					pageProps: {
						total: 0,
						page: 1,
						perPage: 10
					},
					tableHeight:'',
					formHeight:'',
				},
				sale: {
					searchForm: {
						count: '',
						price: '',
						time: '',
					},
					columns: [
						{
							title: '序号',
							key: 'id',
							align: 'center',
							width: 100
						},
						{
							title: '销售单编号',
							key: 'version',
							align: 'center',
						},
						{
							title: '销售时间',
							key: 'created_at',
							align: 'center',
						},
						{
							title: '货号',
							key: 'product',
							align: 'center',
							slot: 'item_no',
							width: 200
						},
						{
							title: '数量',
							key: 'product_num',
							align: 'center',
						},
						{
							title: '销售单货值',
							key: 'total_value',
							align: 'center',
						},
						{
							title: '审核状态',
							key: 'audit_status',
							align: 'center',
						},
						{
							title: '创建人',
							key: 'created_by',
							align: 'center',
						},
						{
							title: '审核通过时间',
							key: 'auditPassTime',
							align: 'center',
						}
					],
					data: [],
					pageProps: {
						total: 0,
						page: 1,
						perPage: 10
					},
					tableHeight:'',
					formHeight:'',
				},
				stock: {
					searchForm: {
						count: '',
						price: '',
						time: '',
					},
					columns: [
						{
							title: '序号',
							key: 'id',
							align: 'center',
							width: 100
						},
						{
							title: '库存单编号',
							key: 'version',
							align: 'center',
						},
						{
							title: '库存时间',
							key: 'created_at',
							align: 'center',
						},
						{
							title: '货号',
							key: 'product',
							align: 'center',
							slot: 'item_no',
							width: 200
						},
						{
							title: '数量',
							key: 'product_num',
							align: 'center',
						},
						{
							title: '库存单货值',
							key: 'total_value',
							align: 'center',
						},
						{
							title: '审核状态',
							key: 'audit_status',
							align: 'center',
						},
						{
							title: '创建人',
							key: 'created_by',
							align: 'center',
						},
						{
							title: '审核通过时间',
							key: 'auditPassTime',
							align: 'center',
						}
					],
					data: [],
					pageProps: {
						total: 0,
						page: 1,
						perPage: 10
					},
					tableHeight:'',
					formHeight:'',
				},
				checkIn: {
					searchForm: {
						count: '',
						person: '',
						time: ''
					},
					columns: [
						{
							title: '序号',
							key: 'id',
							align: 'center',
							width: 100
						},
						{
							title: '员工姓名',
							key: 'created_by',
							align: 'center',
						},
						{
							title: '所属队长',
							key: 'cap',
							align: 'center',
						},
						{
							title: '部门中心',
							key: 'dept_name',
							align: 'center',
							width: 200
						},
						{
							title: '签到时间',
							key: 'signin_at',
							align: 'center',
						},
						{
							title: '拜访时长(小时)',
							key: 'checkin_length',
							align: 'center',
							width: 150
						},
						{
							title: '门店名称',
							key: 'facadeName',
							align: 'center',
							width: 200,
						},
						{
							title: '陈列级别',
							key: 'level',
							align: 'center',
						},{
							title: '陈列描述',
							key: 'remark',
							align: 'center',
						},
						{
							title: '备注',
							key: 'out_remark',
							align: 'center',
							width: 200,
						}
					],
					data: [],
					pageProps: {
						total: 0,
						page: 1,
						perPage: 10
					},
					tableHeight:'',
					formHeight:'',
				},
			}
		},
		created(){
			this.id = this.$route.query.id
			this.getData('form')
			this.getData('table')
		},
		watch: {
			'currentTabPane': function (currentTabPane, lastTabPane) {
				// 设置高度 tabPaneHeight
				this.getData('form')
				this.getData('table')
			}
		},
		methods: {
			      //预览
      handleView (file,index,index2,type) {
          this.showBusinessLicenseImg = true; 
          this.showBusinessLicenseImgUrl = file.url_show;
      },
        // 收货地址列表
      getAddress(index){
        let params = {
          contractor_id: index.contractor_id ? index.contractor_id : index.id,
          page: this.receiptForm.pageProps.page,
          perPage: this.receiptForm.pageProps.perPage,
          receiving_address: this.receiptForm.searchForm.receiving_address ? this.receiptForm.searchForm.receiving_address :'' 
        }
        this.$api.contractorTabAddress(params).then(res => {
          this.$nextTick(() => {
            res.items ? this.receiptForm.contractorReceivingAddrGroup = res.items : this.receiptForm.contractorReceivingAddrGroup = []
            this.receiptForm.pageProps.total =  res._meta.totalCount
          })
        })
      },
      // 门店信息列表
      getShopInfo(index){
        let params = {
          contractor_id: index.contractor_id ? index.contractor_id : index.id,
          page: this.shopAddress.pageProps.page,
          perPage: this.shopAddress.pageProps.perPage,
          name: this.shopAddress.searchForm.name ? this.shopAddress.searchForm.name :'' ,
          address	: this.shopAddress.searchForm.address	 ? this.shopAddress.searchForm.address	 :'' 
        }
        this.$api.contractorTabShopInfo(params).then(res => {
          console.log(res)
          this.$nextTick(() => {
            this.shopAddress.data = res.items || res.data.list || []
            this.shopAddress.pageProps.total =  res.data.totalCount
          })
        })
      },
			// 获取中元素高
			getEleHeight(el){
				return this.$refs[el].$el.offsetHeight
			},
			// 设置当前 tabpane 的高度
			setTabPaneHeight(currentTabPane){
				if(currentTabPane != 'shopAddress'){
						let elForm = currentTabPane + 'Form'
						let elTable = currentTabPane + 'Table'
						this.pageHeight = this.pageHeight ? this.pageHeight : this.getEleHeight('page')
						this[currentTabPane].formHeight = this[currentTabPane].formHeight ? this[currentTabPane].formHeight : this.getEleHeight(elForm)
						this[currentTabPane].tableHeight = this.getEleHeight(elTable)
						this.tabPaneHeight = `${this[currentTabPane].formHeight + this[currentTabPane].tableHeight + this.pageHeight }px` 
					}else {
						this.tabPaneHeight = this.baseTabpaneheight
					}
			},
			// 获取页面信息 status：tab 
			getData(type){ 
				let params = {}
				params.status = this.currentTabPane
				params.id = this.id
				params.contractor_id = this.id

				if (type === 'table') {
					let { perPage, page } = this[this.currentTabPane].pageProps
					params.perPage = perPage
					params.page = page

          if(this.currentTabPane === 'shopAddress'){
            let { name, address } = this[this.currentTabPane].searchForm
            params.name = name
            params.address = address
          }
					this.getTable(params)
				}else {
					this.getInfo(params)
				}
			},
      getInfo(params){ // 获取表单展示数据
      if(this.currentTabPane != 'shopAddress'){
        this.$api.getContractDetailOrder(params).then(res => {
						if(res.code === 0){
							this.setDetailInfo(res.data)
						}
          })
      }
      else{
				this.$api.getContractoreDetail(params).then(res => {
						if(res.code === 0){
							this.setDetailInfo(res.data)
						}
          })
          }
      },
      /***
       * 后期极度需要重构
       * 在v1接口上 对收货地址 与 门店信息 表格进行截取
       * 截取为v2 版本收货地址 门店信息表格内容
       *
       */
      getTable(params,type){ // 获取表格数据
        if(this.currentTabPane === 'shopAddress') {
          if(type){
            switch(type){
              case 'receiptForm':
                this.getAddress(params);
                break;
              case 'shopAddress':
                this.getShopInfo(params);
                break;
            }
          }else{
            //刚进入
            this.getShopInfo(params);
            this.getAddress(params);
          }
          // 重新计算高度
          this.setTabPaneHeight(this.currentTabPane)
        }else{
          let currentTabPane = params.status
          this.tableLoading = true
          this.$api.getContractoreTable(params).then(res => {
            let { items, _meta } = res
            items.forEach(item => {
              if(item.order_time){ item.order_time = this.$format(item.order_time, 'yyyy-MM-dd') }
              if(item.created_at){ item.created_at = this.$format(item.created_at, 'yyyy-MM-dd') }
              if(item.collection_completion_at){ item.collection_completion_at = this.$format(item.collection_completion_at, 'yyyy-MM-dd') }
              if(item.auditPassTime){ item.auditPassTime = this.$format(item.auditPassTime, 'yyyy-MM-dd') }
              if(item.signin_at){ item.signin_at = this.$format(item.signin_at, 'yyyy-MM-dd') }
            })
            this[currentTabPane].data = items
            this[currentTabPane].pageProps.page = _meta.currentPage
            this[currentTabPane].pageProps.perPage = _meta.perPage
            this[currentTabPane].pageProps.total = _meta.totalCount
          }).finally(() => {
            this.tableLoading = false
              // 重新计算高度
            this.setTabPaneHeight(currentTabPane)
          })
        }
			},
			setDetailInfo(data){
				let currentTabPane = this.currentTabPane
				if(currentTabPane === 'shopAddress'){
					let {
						// basic
						id,
						merchant_name,
						merchant_type,
						created_by,
						created_at,
						salesman,
						contact_name,
						contact_phone,
						businessLicense	, 
						// policy
						begin_at,
						end_at,
						cooperate_start_at,
						contract_addr,
						partner_policy_name,
						payment_method,
						payment_days,
						payment_at,
						remark,
						// review
						reviewer,
						audit_pass,
						reviewer_at,
						opinion,
						// annex
						fileItems,
            contractorReceivingAddrGroup
						// receipt
						} = data
					this[currentTabPane].basicForm = {
						merchant_name,
						merchant_type: this.switchMerchantType(merchant_type),
						created_by,
						created_at: this.$format(created_at, 'yyyy-MM-dd'),
						salesman,
						contact_name,
						contact_phone,
						businessLicense
					}
					payment_method=payment_method=='spot_cash'?'现款现货':(payment_method=='monthly'?'月结':'实销实结')
					this[currentTabPane].policyForm = {
						begin_at: this.$format(begin_at, 'yyyy-MM-dd'),
						end_at: this.$format(end_at, 'yyyy-MM-dd'),
						cooperate_start_at: this.$format(cooperate_start_at, 'yyyy-MM-dd'),
						contract_addr,
						partner_policy_name,
						payment_method,
						payment_days,
						payment_at,
						remark,
					}
					this[currentTabPane].reviewForm = {
						reviewer,
						audit_pass,
						reviewer_at: this.$format(reviewer_at, 'yyyy-MM-dd'),
						opinion,
					}
					this[currentTabPane].annexForm = { fileItems }
					this[currentTabPane].receiptForm = { contractorReceivingAddrGroup }
					if(this[currentTabPane].receiptForm.contractorReceivingAddrGroup.length>0){
						this.tableLoading=false
					}
				}else{
					if(data.order_time){
						data.order_time = this.$format(data.order_time, 'yyyy-MM-dd')
					}
					if(data.time){
						data.time = this.$format(data.time, 'yyyy-MM-dd')
					}
          this[currentTabPane].searchForm = data
				}
			},
			// 改变页码
			changePage (e,type) {
        if(type){
          let currentTabPane = this.currentTabPane
          if(type == 'shopAddress'){
            this.shopAddress.pageProps.page = e
          }else{

            this.receiptForm.pageProps.page = e
          }
          let { perPage, page } = this[currentTabPane].pageProps
          let { name, address } = this[currentTabPane].searchForm
          let params = {
            contractor_id: this.id,
            status: currentTabPane,
            perPage,
            page,
            name,
            address,
          }
			  	this.getTable(params,type)

        }else{
          let currentTabPane = this.currentTabPane
          this[currentTabPane].pageProps.page = e
          // 根据 currentTabPane 去请求数据
          this.getData('table')

        }
			},
			// 改变每页显示数
			changePageSize (e,type) {
        
        if(type){
          let currentTabPane = this.currentTabPane
          if(type == 'shopAddress'){
            this.shopAddress.pageProps.perPage = e
          }else{

            this.receiptForm.pageProps.perPage = e
          }
          let { perPage, page } = this[currentTabPane].pageProps
          let { name, address } = this[currentTabPane].searchForm
          let params = {
            contractor_id: this.id,
            status: currentTabPane,
            perPage,
            page,
            name,
            address,
          }
          this.getTable(params,type)

        }else{
          let currentTabPane = this.currentTabPane
          this[currentTabPane].pageProps.perPage = e
          // 根据 currentTabPane 去请求数据
          this.getData('table')
        }
			},
			// 搜索
			search(type){
				let currentTabPane = this.currentTabPane
				let { perPage, page } = this[currentTabPane].pageProps
				let { name, address } = this[currentTabPane].searchForm
				let params = {
					contractor_id: this.id,
					status: currentTabPane,
					perPage,
					page,
					name,
					address,
				}
				this.getTable(params,type)
			},
			preview(url){
				this.premodal = true
				this.readImageUrl = SERVER_BASE_URL + '/' + url
			},
			dowmload(url){
				let data = SERVER_BASE_URL + '/' + url
				let a = document.createElement('a');
				a.setAttribute('href', data);
				a.setAttribute('download', data.split('/').pop()); //分割路径，取出最后一个元素
				a.setAttribute('target', '_blank');
				a.setAttribute('id', 'DownloadFile');
				// 防止反复添加
				if(document.getElementById('DownloadFile')) {
					document.body.removeChild(document.getElementById('DownloadFile'));
				}
				document.body.appendChild(a);
				a.click();
			},
			// 返回
			back(){
				this.$router.push({
					path: '/contract/partner-management'
				})
			},
      switchMerchantType(merchantType){
			  switch (merchantType) {
          case 'other':
            return '其他'
            break;
          case 'ka':
            return 'KA'
            break;
          case 'cs':
            return 'CS'
            break;
          case 'store':
            return '便利店'
            break;
          case 'otc':
            return 'OTC'
            break;
          default:
            return '-';
        }
      }
		}
	}
</script>

<style lang="less" scoped>
.hr {
	color: #dcdee2;
	background-color: #dcdee2;
	margin-bottom: 20px ;
	height: 1px;
	border-top: none;
}
/deep/ input {
	text-align: center;
} 
/deep/ .shopaddress{
	input {
		text-align: left;
	}
}
.annex {
	display: flex;
	height: 32px;
	margin-bottom: 20px;
	.label {
		width: 100px;
		padding: 10px 12px 10px 0;
		line-height: 1;
		text-align: right;
		font-size: 12px;
	}
	.content {
		flex: 1;
		padding: 4px 7px;
		border-radius: 4px;
		border: 1px solid #dcdee2;
		line-height: 1.5;
		font-size: 12px;
		text-align: center;
		color: #0000ff;
		cursor:pointer;
	}
}
.preimg {
  width: 100%;
  display: block;
  margin: 0 auto;
}			
// 
.upload-list{
    position: relative;
    display: inline-block;
    margin: 0 5px;
  }
.upload-list-cover{
    position: absolute;
    display: none;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
  }
  .upload-list:hover .upload-list-cover{
        display: block;
    }
 .upload-list-cover i{
	 			width: 100%;
        color: #fff;
        font-size: 30px;
        line-height: 100px;
        cursor: pointer;
        margin: 0 auto;
    }
</style>