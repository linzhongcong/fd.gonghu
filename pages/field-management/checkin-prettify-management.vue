<template>
	<Card>
		<!-- 头部搜索部分 -->
		<!-- 如果需要输入框失焦搜索在每个input加入@on-blur="onBlurSearch"同时去掉各个方法里把分页设置为1页10条的注释 -->
		<Row class="heard" @keydown.native.enter.prevent="onSearch">
      <Col span="3" style="padding-right:10px">
				<Select class="mb-5" v-model="topData.ownership" placeholder="数据权限范围" @on-change="onSearch">
          <Option v-for="(item, index) in dataPermissionRange" :value="item.value" :label="item.label" :key="'dataPer' + index"></Option>
        </Select>
			</Col>

			<Col span="3" style="padding-right:10px">
				<Input placeholder="请输入工号" v-model="topData.job_num" clearable @on-clear="onBlurSearch" />
			</Col>

			<Col span="3" style="padding-right:10px">
				<Input placeholder="请输入姓名" v-model="topData.created_by" clearable @on-clear="onBlurSearch" />
			</Col>
			<!-- 在Select加上@on-change="checkinSearch"可以让拜访类型在选择时就触发搜索 -->
			<Col span="3" style="padding-right:10px">
				<Select placeholder="拜访类型" v-model="topData.checkin_way" clearable>
					<Option v-for="item in checkinWay" :value="item.value" :key="item.value">{{ item.label }}</Option>
				</Select>
			</Col>
      <Col span="3" style="padding-right:10px">
        <Input v-model="topData.offline_dept_name" placeholder="系统部门" clearable />
      </Col>
			<Col span="3">
				<DatePicker type="date" placeholder="开始时间" @on-change="timeStartSearch" clearable></DatePicker>
			</Col>
			<Col span="3">
				<DatePicker type="date" placeholder="结束时间" @on-change="timeEndSearch" clearable></DatePicker>
			</Col>

			<Col span="3" style="padding-right:10px">
				<Input placeholder="合作商名称" v-model="topData.merchant_name" clearable @on-clear="onBlurSearch" />
			</Col>
		</Row>
		<div style="padding-top:10px">
			<Row @keydown.native.enter.prevent="onSearch">
        <Col span="3" style="padding-right:10px">
          <Input placeholder="门店名称" v-model="topData.facade_name" clearable @on-clear="onBlurSearch" />
        </Col>
				<Col span="3" style="padding-right:10px">
					<Input placeholder="门店地址" v-model="topData.facade_address" clearable @on-clear="onBlurSearch" />
				</Col>
				<Col span="3" style="padding-right:10px">
					<Input placeholder="签到地址" v-model="topData.checkin_address" clearable @on-clear="onBlurSearch" />
				</Col>
				<Col span="5">
					<Button type="primary" @click="onSearch">搜索</Button>
					<Button type="primary" @click="onDerive" v-permission="'/v1/checkin-prettify-management/export'">导出签到数据</Button>
				</Col>
			</Row>
		</div>
		<Divider />
		<Row>
			<div>
				<Table
					border
					ref="selection"
					:columns="table.columns"
					:data="table.data"
					:loading="tabLoading"
					@on-selection-change="onPitch"
				></Table>
				<div style="margin: 10px;overflow: hidden">
					<div class="tabpage">
						<Page
							size="small"
							show-elevator
							:current.sync="tabPage"
							:total="pageData"
							:page-size="pageSize"
							@on-change="changePage"
							@on-page-size-change="onChangePageSize"
							show-sizer
							show-total
						/>
					</div>
				</div>
			</div>
		</Row>
	</Card>
</template>

<script>
import globalMixin from '~/plugins/mixin'
export default {
	name: 'checkin-prettify-management',
  mixins: [globalMixin],
	data() {
		return {
			//控制表格loading
			tabLoading: false,
			//头部数据
			topData: {
        ownership: 'company', // 数据权限范围
				checkin_way: '', //拜访类型
				job_num: '', //员工工号
				created_by: '', //员工名称
				startTime: '', //开始时间(签到时间)
				endTime: '', //结束时间(签到时间)
				merchant_name: '', //合作商名称
				facade_name: '', //	门店名称
				facade_address: '', //门店地址
				checkin_address: '', //签到地址
				perPage: 10, //每页数据条数
				page: 1, //当前页数
			},
			tabPage: 1, //当前页数
			pageData: 10, //总数据
			pageSize: 10, //每页条数
			//表格数据
			table: {
				columns: [
					{
						type: 'selection',
						width: 60,
						align: 'center',
					},
					{
						title: '员工工号',
						key: 'jobNumber',
						align: 'center',
						width: 100,
					},
					{
						title: '员工姓名',
						key: 'createdBy',
						align: 'center',
						width: 100,
						render: (h, params) => {
              let { id, checkinWay, createdBy }= params.row
              checkinWay === 'stick_cabinet' && (checkinWay = 'counter')
              checkinWay === 'activity' && (checkinWay = 'activity')
              checkinWay === 'patrol' && (checkinWay = 'tour')
							return h(
								'a',
								{
                  on: {
                    click: () => this.$router.push(`/field-management/attendance-details/${checkinWay}?id=${id}`)
                  }
								},
								createdBy
							)
						},
					},
          {
            title: '员工职务',
            key: 'jobStation',
            align: 'center',
            minWidth: 135,
          },
					// {
					// 	title: '部门中心',
					// 	key: 'deptName',
					// 	align: 'center',
					// 	width: 180,
					// },
          {
						title: '系统部门',
						key: 'offlineDeptName',
						align: 'center',
						width: 180,
					},
					{
						title: '动销类型',
						key: 'checkinWay',
						align: 'center',
						width: 100,
            render: (h, params) => h('span', this.checkinWay[params.row.checkinWay].label)
					},
					{
						title: '签到时间',
						key: 'signinAt',
						align: 'center',
						width: 210,
            render: (h, params) => {
              let time = params.row.signin_at || params.row.signinAt,
                  day = new Date(time * 1000).getDay(),
                  week = ['日', '一', '二', '三', '四', '五', '六']
              return !+time
                ? h('span', '')
                : h('span', this.formatDate(time) + ` (星期${week[day]})`)
            },
					},
					{
						title: '签退时间',
						key: 'signoutAt',
						align: 'center',
						width: 210,
            render: (h, params) => {
              let time = params.row.signout_at || params.row.signoutAt,
                  day = new Date(time * 1000).getDay(),
                  week = ['日', '一', '二', '三', '四', '五', '六']
              return !+time
                ? h('span', '')
                : h('span', this.formatDate(time) + ` (星期${week[day]})`)
            },
					},
					{
						title: '签退状态',
						key: 'isException',
						align: 'center',
						width: 100,
            render: (h, params) => h('span', params.row.isException === 'no' ? '正常' : '异常')
					},
					{
						title: '动销时长',
						key: 'checkinLength',
						align: 'center',
						width: 120,
					},
					{
						title: '公司名称',
						key: 'merchantName',
						align: 'center',
						width: 150,
					},
					{
						title: '门店名称',
						key: 'facadeName',
						align: 'center',
						width: 120,
					},
					{
						title: '门店地址',
						key: 'facadeAddress',
						align: 'center',
						width: 200,
					},
					{
						title: '签到地址',
						key: 'checkinAddress',
						align: 'center',
						width: 200,
					},
				],
				data: [],
			},
			//拜访类型
			checkinWay: {
				stick_cabinet: {
					label: '贴柜',
					value: 'stick_cabinet',
				},
				activity: {
					label: '活动',
					value: 'activity',
				},
        patrol: {
          label: '巡店',
          value: 'patrol'
        }
			},
			//多选时下载id
			idList: [],
		}
	},
	activated () {
    this.getList(this.topData);
  },
	methods: {
		//失焦触发搜索
		onBlurSearch() {
			// this.topData.perPage = 10;
			// this.topData.page = 1;
			// this.tabPage = 1;
			// this.pageSize = 10; //每页条数
			// this.getList(this.topData);
			// console.log('搜索');
		},
		//开始时间变化时
		timeStartSearch(data) {
			this.topData.startTime = data
			// console.log(data)
			// this.topData.perPage = 10;
			// this.topData.page = 1;
			// this.tabPage = 1;
			// this.pageSize = 10; //每页条数
			// this.getList(this.topData);
		},
		//结束时间变化时
		timeEndSearch(data) {
			this.topData.endTime = data
			// this.topData.perPage = 10;
			// this.topData.page = 1;
			// this.tabPage = 1;
			// this.pageSize = 10; //每页条数
			// console.log(data)
			// this.getList(this.topData);
		},
		//分页器点击
		changePage(e) {
			// console.log(e);
			this.topData.page = e
			this.getList(this.topData)
			// The simulated data is changed directly here, and the actual usage scenario should fetch the data from the server
			// this.tableData1 = this.mockTableData1();
		},
		//获取列表信息
		getList(params) {
			this.tabLoading = true
			this.$api.guideList(params).then(res => {
        if (res.code === 0) {
          let data = res.data
          this.table.data = data.list
          this.pageData = data.totalCount
          this.topData.ownership = data.ownership
          this.handleValidateDataPermissionRange(this, 'isGetDataPermissionRange', 'dataPermissionRange', data.ownership)
          this.tabLoading = false
        }
			})
		},
		//拜访类型触发时
		checkinSearch(data) {
			// this.getList(this.topData);
		},
		//搜索按钮点击时
		onSearch() {
			this.topData.perPage = 10
			this.topData.page = 1
			this.tabPage = 1
			this.pageSize = 10
			this.getList(this.topData)
		},
		//导出数据
		onDerive() {
			let params = {}
			if (this.idList.length < 1) {
				params = this.topData
			} else {
				params.id_list = this.idList
			}
			this.$api
				.getDerive(params)
				.then(res => {
					// console.log(res)
					if (res.code == 0) {
						this.$Message.success('导出成功，正在为您下载！')
						window.location.href = res.data[0]
					}
				})
				.catch(reo => {
					this.$Message.error('下载出错！')
				})
		},
		//页数点击
		onChangePageSize(e) {
			this.topData.perPage = e
			this.getList(this.topData)
		},
		onPitch(row) {
			this.idList = []
			for (let i in row) {
				this.idList.push(row[i].id)
			}
		},
    formatDate(time, type = 'yyyy-MM-dd hh:mm:ss') {
      return this.$format(time, type)
    },
	}
}
</script>

<style lang="less" scoped>
.tabpage {
	text-align: right;
	width: 100%;
}
/deep/.tabpage .ivu-page-total {
	float: left;
}
</style>
