<template>
  <div>
    <Card>
      <div slot="title">
        <Row type="flex" justify="space-between">
          <Col>
            <Input v-model.trim="searchData.team_name" placeholder="团队名称" style="width:150px" clearable @keydown.native.enter.prevent="getList('search')"/>
            <Select v-model="searchData.channel" style="width: 130px" placeholder="选择渠道" clearable>
              <Option v-for="item in channelList" :key="item.value" :value="item.value">{{ item.label }}</Option>
            </Select>
            <Button type="primary" icon="ios-search" @click="getList('search')">查询</Button>
<!--            <Button type="primary" @click="resetSearch">重置</Button>-->
          </Col>
        </Row>
        <Row type="flex" justify="space-between" class="row-style">
          <Col>
            <Button type="primary" @click="$router.push('/employee-management/add-team')">添加团队</Button>
            <Button type="primary" @click="settingAble">启用/禁用</Button>
          </Col>
        </Row>
      </div>
      <div>
        <Row>
          <Table border ref="selection" :columns="tableColumns" :data="tableData" :loading="tableLoading"
                 highlight-row @on-selection-change="onSelectionChange"></Table>
        </Row>
        <Row>
          <div style="padding: 20px 0">
            <div style="float: left">共 {{pageProps.total}} 条</div>
            <div style="float: right">
              <Page :total="pageProps.total" :current="pageProps.page" size="small" show-elevator show-sizer
                    @on-change="changePage" @on-page-size-change="changePageSize"/>
            </div>
          </div>
        </Row>
      </div>
    </Card>

    <!-- 详情 -->
    <Modal v-model="detailModal" title="团队详情" width="1000">
      <div class="rel">
        <Spin v-if="spinShow" size="large" fix></Spin>
        <div class="ivu-table-wrapper margin-bottom-10 margin-top-10">
          <div class="ivu-table ivu-table-small ivu-table-border">
            <div class="ivu-table-body">
              <table cellspacing="0" cellpadding="0" border="0" width="100%">
                <tbody>
                <tr class="ivu-table-row">
                  <td class="head-bg">
                    <div class="ivu-table-cell">
                      <span>团队名称</span>
                    </div>
                  </td>
                  <td colspan="3">
                    <div class="ivu-table-cell">
                      <span>{{teamDetail.team_name}}</span>
                    </div>
                  </td>
                  <td class="head-bg">
                    <div class="ivu-table-cell">
                      <span>渠道</span>
                    </div>
                  </td>
                  <td>
                    <div class="ivu-table-cell">
                      <span>{{teamDetail.channel}}</span>
                    </div>
                  </td>
                </tr>


                </tbody>
              </table>

              <table cellspacing="0" cellpadding="0" border="0" width="100%"
                     v-for="(team, index) in teamDetail.children" :key="index">
                <tbody>
                <tr class="ivu-table-row">
                  <td class="head-bg">
                    <div class="ivu-table-cell">
                      <span>下属分队</span>
                    </div>
                  </td>
                  <td colspan="3">
                    <div class="ivu-table-cell">
                      <span>{{team.team_name}}</span>
                    </div>
                  </td>
                  <td class="head-bg">
                    <div class="ivu-table-cell">
                      <span>启用/禁用</span>
                    </div>
                  </td>
                  <td>
                    <div class="ivu-table-cell">
                      <span>{{team.team_status == 0 ? '禁用' : '启用'}}</span>
                    </div>
                  </td>
                </tr>

                <tr class="ivu-table-row">
                  <td class="head-bg">
                    <div class="ivu-table-cell">
                      <span>备注</span>
                    </div>
                  </td>
                  <td colspan="5">
                    <div class="ivu-table-cell">
                      <span>{{team.team_remark}}</span>
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
        <!--        <Button type="primary" :loading="editData.loading">保 存</Button>-->
      </div>
    </Modal>

  </div>
</template>
<script>
  export default {
    name: 'team-management',
    data() {
      return {
        spinShow: true,
        prohibitmodel: false,
        tableLoading: false,
        loadingSelect: false,
        detailModal: false,
        pageProps: {
          total: 10,
          page: 1,
          pageSize: 10
        },
        checkList: [],
        searchData: {
          team_name: '',
          channel: '',
        },
        editData: {
          loading: false
        },
        channelList: [
          {value: 'CS', label: 'CS'},
          {value: 'KA', label: 'KA'},
          {value: 'OTC', label: 'OTC'},
          {value: '便利店', label: '便利店'},
          {value: '其他', label: '其他'}
        ],
        tableColumns: [
          {type: 'selection', align: 'center', width: 60},
          {title: '序号', type: 'index', align: 'center', width: 65},
          {
            title: '团队名称', key: 'team_name', align: 'center', minWidth: 200,
            render: (h, {row}) => {
              return h('a', {
                attrs: {
                  href: 'javascript:void(0)'
                },
                on: {
                  click: () => {
                    this.getTeamManagementDetail(row.uuid)
                    this.detailModal = true
                  }
                }
              }, row.team_name);
            }
          },
          {title: '渠道', key: 'channel', align: 'center', width: 100},
          {
            title: '状态', key: 'team_status', align: 'center', width: 65,
            render: (h, {row}) => h('span', {}, row.team_status == 0 ? '禁用' : '启用')
          },
          {title: '备注', key: 'team_remark', align: 'center', minWidth: 200},
          {
            title: '操作',
            key: 'do',
            align: 'center',
            width: 150,
            render: (h, {row}) => {
              return h('div', [
                h('Tooltip', {
                  props: {
                    content: '编辑',
                    placement: 'top'
                  }
                }, [
                  h('Button', {
                    props: {
                      type: 'primary',
                      icon: 'md-create',
                      size: 'small'
                    },
                    style: {
                      marginRight: '3px'
                    },
                    on: {
                      'click': () => {
                        // TODO: 调整到添加页面
                        this.$router.push({
                          path: '/employee-management/add-team',
                          query: {
                            uuid: row.uuid
                          }
                        })
                      }
                    }
                  })
                ]),
                h('Poptip', {
                  props: {
                    confirm: true,
                    title: '您确认删除该团队吗？',
                    transfer: true
                  },
                  on: {
                    'on-ok': () => {
                      this.$api.delTeamManagement({
                        id: row.id,
                        uuid: row.uuid
                      }).then(() => {
                        this.$Message.success('删除成功')
                        this.getList()
                      })
                    }
                  }
                }, [
                  h('Button', {
                    props: {
                      icon: 'md-trash',
                      size: 'small',
                    }
                  })
                ])
              ])
            }
          }
        ],
        tableData: [],
        teamDetail: [],
      }
    },
    activated() {
      if(this.$route.query.id_collect){
        this.searchData.id_collect = this.$route.query.id_collect||''
      }else{
        this.searchData.id_collect = ''

      }
      this.getList()
    },
    methods: {

      // resetSearch() {
      //   this.searchData = {
      //     team_name: '',
      //     channel: '',
      //   }
      //    this.getList('search')
      // },

      // 改变页码
      changePage(e) {
        this.pageProps.page = e
        this.getList()
      },

      // 改变每页显示数
      changePageSize(e) {
        this.pageProps.pageSize = e
        this.getList()
      },


      getList(type) {
        if (type == 'search') {
          this.pageProps.pageSize = 10
          this.pageProps.page = 1
        }
        let params = this.searchData
        // 清除select后，给默认值
        this.tableLoading = true
        params.pageSize = this.pageProps.pageSize
        params.page = this.pageProps.page
        this.tableLoading = true
        // console.log(params,'293');
        this.$api.getTeamManagementList(params).then((res) => {
          let {items, _meta} = res
          this.tableData = items
          this.pageProps.total = _meta.totalCount
          this.pageProps.page = _meta.currentPage
        }).finally(() => {
          this.tableLoading = false
        })
      },

      // 获取当行数据
      onSelectionChange(currentRow) {
        this.checkList = currentRow
      },

      // 启用或禁用
      settingAble() {
        if (this.checkList.length === 0) return this.$Message.warning('请选择')
        let params = this.checkList.map(items => {
          return {
            id: items.id,
            team_status: items.team_status == 0 ? 1 : 0,
            uuid: items.uuid
          }
        })

        this.$api.setTeamManagementStatus(params).then(res => {
          if (res.code !== 0) return
          this.$Message.success(res.message)
          this.getList()
        })
      },

      // 详情
      getTeamManagementDetail(uuid) {
        this.spinShow = true
        this.$api.getTeamManagementDetail({uuid}).then(res => {
          if (res.code !== 0) return
          this.teamDetail = res.data
          this.spinShow = false
        })
      },
    },
   watch:{
      $route:{
        deep: true,
        handler:function(newVal,oldVal){
          if(oldVal.name == newVal.name && Object.keys(newVal.query)){
              this.searchData = {} 
              this.getList()
          }
        }
      }
    }
  }
</script>
<style scoped>
  .row-style {
    margin-top: 10px;
  }

</style>
