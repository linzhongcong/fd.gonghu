<template>
	<div>
		<card>
			<Form slot="title" :label-width="64" inline>
				<Row type="flex" justify="space-between">
					<Col span="24" @keydown.native.enter.prevent="onSearch()">
						<FormItem label="员工工号:">
							<Input placeholder="请输入工号" v-model="topData.username" clearable />
						</FormItem>
						<FormItem label="员工姓名:">
							<Input placeholder="请输入员工姓名" v-model="topData.real_name" clearable />
						</FormItem>
						<FormItem label="视频标题:">
							<Input placeholder="请输入视频标题" v-model="topData.title" clearable />
						</FormItem>
						<FormItem label="状态:" :label-width="40">
							<Select style="width:200px" v-model="topData.status" clearable>
								<Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
							</Select>
						</FormItem>
						<Button type="primary" icon="ios-search" @click="onSearch()">查询</Button>
					</Col>
				</Row>
			</Form>

			<div>
				<Row>
					<Table :columns="columns" :data="tabData" :loading="tabLading">
						<template slot-scope="{ row }" slot="action">
							<Button type="text" size="small" style="color: #00BFFF" @click="onVideoClick(row.id, 0)">审核</Button>
							<Button type="text" size="small" style="color: #8A2BE2" @click="onVideoClick(row.id, 1)">预览</Button>
							<Button type="text" size="small" style="color: red" @click="BeOffline(row.id)">下线</Button>
							<!-- <Button type="error" size="small">Delete</Button> -->
						</template>

						<template slot-scope="{ row }" slot="content">
							<Tooltip placement="top-end">
								<div slot="content" class="pardata">
									<p>{{ row.content }}</p>
								</div>
								<div class="video-text">
									{{ row.content }}
								</div>
							</Tooltip>
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
				</Row>
			</div>

			<!-- 下线弹窗 -->
			<Modal v-model="beShow">
				<div class="beTitle" slot="header">
					<Icon type="ios-alert" color="#1E90FF" /> <span>确定下线所选视频吗?</span>
				</div>
				<Row>
					<Col span="4"> <span style="color:red">*</span> 原因: </Col>
					<Col span="20">
						<Input
							maxlength="30"
							show-word-limit
							type="textarea"
							placeholder="请输入下线原因"
							:autosize="{ minRows: 3, maxRows: 7 }"
							v-model="beText"
						/>
					</Col>
				</Row>
				<div slot="footer">
					<Button type="primary" @click="onBeOffline(beid)" :loading="bebtnLading">确定</Button>
					<Button @click="beShow = false">取消</Button>
				</div>
			</Modal>
		</card>
	</div>
</template>

<script>
export default {
	name: 'ranking-list',
	data() {
		return {
			//顶部搜索数据
			topData: {
				username: '',
				real_name: '',
				title: '',
				status: '',
				page: 1,
				perPage: 10,
			},
			columns: [
				{
					title: '序号',
					type: 'index',
					align: 'center',
					width: 60,
				},
				{
					title: '员工工号',
					key: 'created_jobnum',
					align: 'center',
				},
				{
					title: '员工姓名',
					key: 'created_by',
					align: 'center',
				},
				{
					title: '视频标题',
					key: 'title',
					align: 'center',
				},
				{
					title: '视频简介',
					slot: 'content',
					align: 'center',
				},
				{
					title: '上传时间',
					key: 'created_at',
					align: 'center',
				},
				{
					title: '状态',
					key: 'status',
					align: 'center',
				},
				{
					title: '审核时间',
					key: 'auditTime',
					align: 'center',
					render: (h, params) => {
						let str = params.row.auditLog ? params.row.auditLog.created_at : ' '
						return h(
							'span',
							{
								style: {
									color: '#000',
								},
							},
							str
						)
					},
				},
				{
					title: '审核人',
					key: 'audit_by',
					align: 'center',
					render: (h, params) => {
						let str = params.row.auditLog ? params.row.auditLog.created_by : ' '
						return h(
							'span',
							{
								style: {
									color: '#000',
								},
							},
							str
						)
					},
				},
				{
					title: '审核不通过 / 下线原因',
					key: 'audit_cause',
					align: 'center',
					width: 200,
					render: (h, params) => {
						let str = params.row.auditLog ? params.row.auditLog.opinion : ' '
						return h(
							'span',
							{
								style: {
									color: '#000',
								},
							},
							str
						)
					},
				},
				{
					title: '操作',
					slot: 'action',
					align: 'center',
					width: 200,
				},
			],
			stateList: [
				{ label: '待审核', value: 'auditPending' },
				{ label: '审核通过', value: 'auditPass' },
				{ label: '审核未通过', value: 'auditFailure' },
				{ label: '下线', value: 'close' },
			],
			//表格data
			tabData: [],
			//表格loading
			tabLading: true,
			//第几页点击
			tabPage: 1,
			//总共多少条
			pageData: 10,
			//一页显示多少条
			// pageSize:10,
			//下线弹窗
			beShow: false,
			//下线原因
			beText: '',
			//点击下线时id
			beid: '',
			//确定按钮loading
			bebtnLading: false,
		}
	},
	created() {
		this.getList(this.topData)
	},
	methods: {
		getList(params) {
			this.tabLading = true
			this.$api.rankingList(params).then(res => {
				this.tabData = res.items
				this.tabLading = false
				this.pageData = res._meta.totalCount
			})
		},
		//搜索点击
		onSearch() {
			this.tabPage = 1
			this.topData.page = 1
			this.getList(this.topData)
		},
		//一页显示多少行点击
		onChangePageSize(data) {
			// console.log(data)
			this.topData.perPage = data
			this.getList(this.topData)
		},
		//切页时
		changePage(data) {
			// console.log(data)
			this.topData.page = data
			this.getList(this.topData)
		},
		//点击下线按钮时
		BeOffline(id) {
			console.log(id)
			this.beid = id
			this.beText = ''
			this.beShow = true
		},
		//下线确定点击
		onBeOffline(id) {
			this.bebtnLading = true
			let obj = {
				id,
				type: 'close',
				opinion: this.beText,
			}
			this.$api
				.beoffline(obj)
				.then(res => {
					this.bebtnLading = false
					if (res.code == 0) {
						this.getList(this.topData)
						this.beShow = false
						this.$Message.success(res.message)
					}
				})
				.catch(erro => {
					this.bebtnLading = false
					this.$Message.error('异常错误！')
				})
		},
		//视频预览或者审核点击
		onVideoClick(id, type) {
			this.$router.push({
				path: 'ranking-video',
				query: {
					id,
					type: type ? 'look' : 'audit',
				},
			})
		},
	},
	activated() {
		this.getList(this.topData)
	},
}
</script>

<style lang="less" scoped>
/deep/ .ivu-form-item {
	margin-bottom: 0;
}

.tabpage {
	text-align: right;
	padding: 1rem 0;
}

/deep/.tabpage .ivu-page-total {
	float: left;
}
.video-text {
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	cursor: pointer;
}

.pardata {
	white-space: normal;
	word-break: break-all;
}
</style>
