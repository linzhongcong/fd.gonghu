<template>
  <div class="role">
    <CategoryCard>
      <template slot="left">
        <div class="role-left">
          <Row class="title" style="margin-bottom: 16px" type="flex" align="middle">
            <Col :lg="16">
              <h3>角色管理</h3>
            </Col>
            <Col class="title-add" :lg="8">
              <div>
                <i></i>
                <a href="javascript:;" @click="handleModal('role', 'add')">创建角色</a>
              </div>
            </Col>
          </Row>
          <ul class="content" @click="handleRoleIndex">
            <li class="role-item" v-for="(item, index) in roleList" :class="{'active-role-item': index === currentIndex}" :key="index" :data-index="index">{{item.name}}</li>
          </ul>
        </div>
      </template>
      <template slot="right">
        <div class="role-right" v-if="roleList.length === 0">
          <h3>暂无数据</h3>
        </div>
        <div class="role-right" v-else>
          <div class="title">
            <div class="title-top">
              <div class="title-left">
                <h3 class="name">{{currentRole.name}}</h3>
                <!-- <span class="remark">{{currentRole.description}}</span> -->
                <!-- <span class="remark">{{roleList.length > 0 ? currentRole.description : '暂无数据'}}</span> -->
              </div>
              <div class="title-right">
                <div>
                  <Icon type="md-settings" />
                  <span @click="handleModal('role', 'edit')">设置角色</span>
                </div>
              </div>
            </div>
            <p class="remark">{{currentRole.description}}</p>
          </div>
          <!-- 标签页 -->
          <Tabs v-model="currentTab" class="content">
            <!-- 员工页 start -->
            <TabPane label="员工" name="employee">
              <div class="tabpane-area" v-show="currentTab === 'employee'">
                <Row type="flex" justify="end" style="margin-bottom: 16px;">
                  <Button type="primary" @click="handleModal('employee', 'add')">关联员工</Button>
                </Row>
                <TableList
                  page-type="small"
                  :data="empTable.data"
                  :columns="empTable.columns"
                  :transfer="true"
                  :loading="empTable.loading"
                  :current="empTable.page"
                  :page-size="empTable.pageSize"
                  :total="empTable.totalCount"
                  @on-page-change="(e) => handleEmpTabPage(e, 'page')"
                  @on-page-size-change="(e) => handleEmpTabPage(e, 'pageSize')"
                  @on-selection-change="(selection) => handleSelect(selection, 'empTabList')">
                </TableList>
              </div>
            </TabPane>
            <!-- 员工页 end -->
            <!-- 权限页 start -->
            <TabPane label="权限" name="power">
              <div class="tabpane-area" v-show="currentTab === 'power'">
                <Row type="flex" justify="end" style="margin-bottom: 16px;">
                  <Button type="primary" :loading="powerSaveBtnLoading" @click="handleSavePower">保存</Button>
                </Row>
                <!-- 数据权限 start -->
                <div class="data-power">
                  <div class="power-title">
                    <h3>数据权限</h3>
                  </div>
                  <div class="power-content">
                    <div class="label">默认数据范围</div>
                    <RadioGroup v-model="powerDetail.defaultValue">
                      <Radio v-for="(item, index) in powerDetail.defaultList" :label="item.value" :key="'default' + index">{{item.label}}</Radio>
                    </RadioGroup>
                  </div>
                  <div class="power-content" v-show="powerDetail.defaultValue === 'department' || powerDetail.defaultValue === 'container'">
                    <div class="label">额外数据范围</div>
                    <CheckboxGroup v-model="powerDetail.extraValue">
                      <Checkbox v-for="(item, index) in powerDetail.extraList" :label="item.id" :key="'extra' + index">{{item.name}}</Checkbox>
                    </CheckboxGroup>
                  </div>
                </div>
                <!-- 数据权限 end -->
                <!-- 操作权限 start -->
                <div class="operation-power">
                  <div class="power-title">
                    <h3>操作权限</h3>
                  </div>
                  <div class="power-content" v-for="(item, index) in powerDetail.permissionList" :key="'power' + index">
                    <div class="label">
                      <Checkbox
                        :value="item.menuInfo.selected"
                        @click.native.prevent="handleCheckAll(item)">
                        {{item.menuInfo.menu}}
                      </Checkbox>
                    </div>
                    <CheckboxGroup v-model="item.selectedRoute" @on-change="(e) => handleCheckAllGroupChange(e, item)">
                      <Checkbox v-for="(r, i) in item.children" :label="r.name" :class="{'first-box': i === 0}" :key="'power-route' + i">{{r.name}}</Checkbox>
                    </CheckboxGroup>
                  </div>
                </div>
                <!-- 操作权限 end -->
                <Spin class="spin-fix" size="large" fix v-if="tabPaneSpinShow"></Spin>
              </div>
            </TabPane>
            <!-- 权限页 end -->
          </Tabs>
        </div>
      </template>
    </CategoryCard>
    <!-- 角色弹窗 start -->
    <Modal v-model="role.openModal" :title="role.type === 'add' ? '新建角色' : '设置角色'">
      <Form ref="role" :model="role.data" :rules="role.rules" :label-width="90" style="width: 70%;">
        <FormItem label="角色名称:" prop="name">
          <Input v-model="role.data.name" />
        </FormItem>
        <FormItem label="备注:">
          <Input v-model="role.data.description" />
        </FormItem>
      </Form>
      <template slot="footer">
        <Button v-if="role.type === 'edit'" type="error" :loading="role.delBtnLoading" @click="handleRole('delete').init('del', role.data)">删除角色</Button>
        <Button type="primary" :loading="role.subBtnLoading" @click="handleRole('submit').init('role', role.data)">确定</Button>
      </template>
    </Modal>
    <!-- 角色弹窗 end -->
    <!-- 关联员工弹窗 start -->
    <Modal v-model="employee.openModal" title="关联员工">
      <div class="add-worker">
        <div class="search-worker">
          <InputSearch
            ref="inputSearch1"
            dropdown-text="full_name"
            :dropdown-list="empList"
            :checked-list="employee.data.employeeIds"
            @on-search="queryEmployeeDeb"
            @on-select-change="(selection) => handleSelect(selection, 'employee')">
          </InputSearch>
        </div>
        <div class="selected-worker" @click="handleDelWorker">
          <div class="title">已选择:</div>
          <div v-for="(item, index) in employee.data.employeeIds">
            <span class="selected-box" >
            <span>{{item.real_name}}</span>
              <Icon type="ios-close" size="16" :data-index="index"/>
            </span>
          </div>
        </div>
      </div>
      <template slot="footer">
        <Button type="primary" :loading="employee.subBtnLoading" @click="handleEmployee('submit').init(employee.data)">确定</Button>
      </template>
    </Modal>
    <!-- 关联员工弹窗 end -->
  </div>
</template>

<script>
import CategoryCard from '../my-components/category-card'
import InputSearch from '../my-components/input-search'
export default {
  name: 'test',
  components: { CategoryCard, InputSearch },
  data() {
    return {
      currentIndex: 0,
      tabPaneSpinShow: false,
      powerSaveBtnLoading: false,
      empList: [], // 员工列表
      roleList: [], // 角色列表
      currentTab: 'employee',
      empTable: {
        loading: false,
        page: 1,
        pageSize: 10,
        totalCount: 0,
        columns: [
          {
            type: 'selection',
            minWidth: 60,
            align: 'center'
          },
          {
            title: '工号',
            key: 'username',
            minWidth: 120,
            align: 'center'
          },
          {
            title: '姓名',
            key: 'realName',
            minWidth: 150,
            align: 'center'
          },
          {
            title: '系统部门',
            key: 'offlineDeptName',
            minWidth: 200,
            align: 'center'
          },
          {
            title: '职务',
            key: 'jobStation',
            minWidth: 180,
            align: 'center'
          },
          {
            title: '当前拥有角色',
            key: 'roles',
            minWidth: 200,
            align: 'center'
          },
          {
            title: '操作',
            minWidth: 100,
            align: 'center',
            render: (h, params) => {
              return h('Poptip', {
                props: {
                  title: '确认移除此员工',
                  confirm: true,
                  transfer: true
                },
                on: {
                  'on-ok': () => {
                    this.handleEmployee('delete').init(params.row.id)
                  }
                }
              }, [h('Button', {
                props: {
                  size: 'small',
                  icon: 'md-trash'
                }
              })])
            }
          }
        ],
        data: []
      },
      powerDetail: { // 数据权限标签页
        defaultList: [], // 默认数据
        extraList: [], // 额外数据
        permissionList: [], // 操作权限
      },
      role: { // 角色对象
        type: 'add',
        openModal: false,
        subBtnLoading: false,
        delBtnLoading: false,
        data: {},
        rules: {
          'name': [{ required: true, message: '该项目不能为空', trigger: 'blur' }]
        }
      },
      employee: { // 员工对象
        type: 'add',
        openModal: false,
        subBtnLoading: false,
        data: {},
        rules: {
          'employeeIds': [{ required: true, message: '该项目不能为空', trigger: 'change', type: 'array' }]
        }
      },
      queryEmployeeDeb: this.$debonce(this.queryEmployee, 500)
    }
  },
  computed: {
    currentRole() {
      return this.roleList[this.currentIndex]
    }
  },
  methods: {
    /**
     * 获取角色列表
     */
    async getRoleList() {
      let res
      try {
        res = await this.$api.getRoleList()
        if (res.code === 0) {
          this.roleList = res.data
          !!this.roleList.length && this.getEmployeeList()
        }
      } catch (error) {
        
      }
    },

    /**
     * 获取员工列表
     */
    async getEmployeeList(type = '') {
      let res, params, empTable = this.empTable
      params = {
        roleName: this.currentRole.name,
        perPage: empTable.pageSize,
        page: empTable.page,
      }
      empTable.loading = true
      !!type && (params.page = 1)
      try {
        res = await this.$api.getRoleEmployeeList(params)
        if (res.code === 0) {
          empTable.data = res.data.list
          empTable.page = res.data.currentPage
          empTable.totalCount = res.data.totalCount
          empTable.loading = false
        }
      } catch (error) {
        empTable.loading = false
      }
    },

    /**
     * 搜索员工信息
     */
    async queryEmployee(username) {
      if (username.indexOf('/') > -1) return
      let res
      try {
        res = await this.$api.user({username})
        this.empList = res.items
      } catch (error) {
        
      }
    },

    /**
     * 获取角色权限
     * @param {String} roleName: 角色名称
     */
    async getRolePower() {
      let res, roleName = this.currentRole.name
      this.tabPaneSpinShow = true
      try {
        res = await this.$api.getRolePermissionInfo({roleName})
        if (res.code === 0) {
          let data = res.data
          data.permissionList.forEach((item) => {
            if (item.selectedRoute.length === item.children.length) {
              item.menuInfo.selected = true
            }
          })
          this.powerDetail = data
          this.tabPaneSpinShow = false
        }
      } catch (error) {
        this.tabPaneSpinShow = false
      }
    },

    /**
     * 保存角色权限
     */
    async handleSavePower() {
      this.powerSaveBtnLoading = true
      let res, params = JSON.parse(JSON.stringify(this.powerDetail))
      params.permissionList = params.permissionList.reduce((arr, item) => [...arr, ...item.selectedRoute], [])
      params.roleName = this.currentRole.name
      if (params.defaultValue === 'self' || params.defaultValue === 'company') params.extraValue = [] // 选中本人或全公司需将额外数据范围清除
      delete params.defaultList
      delete params.extraList
      try {
        res = await this.$api.saveRolePermissionInfo(params)
        if (res.code === 0) {
          this.powerSaveBtnLoading = false
          this.$Message.success('操作成功')
          this.getRolePower()
        }
      } catch (error) {
        this.powerSaveBtnLoading = false
      }
    },

    /**
     * 角色操作 添加/编辑/删除
     * @param {String} state: 操作状态
     */
    handleRole(state) {
      const obj = {
        status: '',
        state: {
          submit: async (data) => {
            let res, apiName = this.role.type
            apiName = apiName === 'add' ? 'createRole' : 'updateRole'
            try {
              res = await this.$api[apiName](data)
              if (res.code === 0) {
                this.role.subBtnLoading = false
                this.role.openModal = false
                this.$Message.success('操作成功')
                this.getRoleList()
              }
            } catch (error) {
              this.role.subBtnLoading = false
            }
          },
          delete: async (name) => {
            let res
            try {
              res = await this.$api.deleteRole({name})
              if (res.code === 0) {
                this.currentIndex = 0
                this.role.delBtnLoading = false
                this.role.openModal = false
                this.$Message.success('操作成功')
                this.getRoleList()
              }
            } catch (error) {
              this.role.subBtnLoading = false
            }
          }
        },
        init: (name, params) => {
          params = JSON.parse(JSON.stringify(params))
          if (name === 'del') { // 如果为删除，弹框
            this.$Modal.confirm({
              title: '确认删除该角色',
              onOk: () => {
                this.role.delBtnLoading = true
                return obj.state[obj.status](params.rawName)
              }
            })
          } else {
            this.$refs[name].validate((valid) => {
              if (valid) {
                this.role.subBtnLoading = true
                return obj.state[obj.status](params)
              }
            })
          }
        }
      }
      obj.status = state
      return obj
    },

    /**
     * 员工管理 添加/删除
     */
    handleEmployee(state) {
      const obj = {
        status: '',
        state: {
          submit: async (data) => {
            let res, params = JSON.parse(JSON.stringify(data))
            if (params.employeeIds.length === 0) {
              this.$Message.warning('请选择员工数据')
              this.employee.subBtnLoading = false
              return
            }
            params.employeeIds = params.employeeIds.map(item => item.id)
            try {
              res = await this.$api.connectRoleEmployee(params)
              if (res.code === 0) {
                this.employee.subBtnLoading = false
                this.employee.openModal = false
                this.$Message.success('操作成功')
                this.getEmployeeList('new')
              }
            } catch (error) {
              this.employee.subBtnLoading = false
            }
          },
          delete: async (employeeId) => {
            let res,
                params = {
                  employeeId,
                  roleName: this.currentRole.name
                }
            try {
              res = await this.$api.deleteConnectRoleEmployee(params)
              if (res.code === 0) {
                this.employee.subBtnLoading = false
                this.$Message.success('操作成功')
                this.getEmployeeList()
              }
            } catch (error) {
              this.employee.subBtnLoading = false
            }
          }
        },
        init: (params) => {
          this.employee.subBtnLoading = true
          return obj.state[obj.status](params)
        }
      }
      obj.status = state
      return obj
    },

    /**
     * 打开弹窗
     * @param {String} prop: 操作的弹窗对象
     * @param {String} type: 操作的类型
     */
    handleModal(prop, type) {
      let flag = true
      if (prop === 'role') {
        flag = this.beforeRoleModalOpen(type)
      } else if (prop === 'employee') {
        flag = this.beforeEmpModalOpen(type)
      }
      flag && (this[prop].openModal = true)
    },

    /**
     * 添加/创建角色 弹窗之前的操作
     * @param {Sting} type: 操作的类型
     */
    beforeRoleModalOpen(type) {
      let role = this.role
      role.type = type
      if (type === 'add') {
        role.data = {
          name: '',
          description: ''
        }
      } else if (type === 'edit') {
        role.data = {
          name: this.currentRole.name,
          rawName: this.currentRole.name,
          description: this.currentRole.description,
        }
        this.$nextTick(() => this.$refs.role.validate())
      }
      return true
    },

    /**
     * 关联员工 弹窗之前的操作
     */
    beforeEmpModalOpen(type) {
      let employee = this.employee
      employee.type = type
      employee.data = {
        roleName: this.currentRole.name,
        employeeIds: []
      }
      this.empList = []
      this.$refs.inputSearch1.handleClearQueryKey()
      return true
    },

    /**
     * 删除选中的员工数据
     * @param {Object} e: 事件对象
     */
    handleDelWorker(e) {
      if (e.target.nodeName === 'I') {
        this.employee.data.employeeIds.splice(e.target.dataset.index, 1)
      }
    },

    /**
     * 选中事件
     * @param {Array} selection: 选中的数据
     * @param {String} target: 对应的选项目标
     */
    handleSelect(selection, target) {
      switch (target) {
        case 'employee':
          this.employee.data.employeeIds = selection
          break
        default:
          break
      }
    },

    /**
     * 角色管理列表 选项变化事件
     * @param {Object} e: 事件对象
     */
    handleRoleIndex(e) {
      let target = e.target
      if (target.nodeName === 'LI') {
        this.currentIndex = +target.dataset.index
        this.tabChange(this.currentTab)
      }
    },

    /**
     * 员工表分页变化
     * @param {Number} e: 改变的数量
     * @param {String} prop: 改变的属性，页码还是页大小
     */
    handleEmpTabPage(e, prop) {
      this.empTable[prop] = e
      this.empTabCheckedList = []
      this.getEmployeeList()
    },

    /**
     * 当前选项
     * @param {Object} rowData: 当前选项组合数据对象
     */
    handleCheckAll(rowData) {
      rowData.menuInfo.selected = !rowData.menuInfo.selected
      if (rowData.menuInfo.selected) {
        rowData.selectedRoute = rowData.children.map(item => item.name)
      } else {
        rowData.selectedRoute = []
      }
    },

    /**
     * 选项发生改变事件
     * @param {Array} selection: 选中的数据
     * @param {Object} rowData: 当前选项组合数据对象
     */
    handleCheckAllGroupChange(selection, rowData) {
      if (selection.length === rowData.children.length) {
        rowData.menuInfo.selected = true
      } else {
        rowData.menuInfo.selected = false
      }
    },

    /**
     * 标签发生变化
     * @param {String} name: 发生变化的标签
     */
    tabChange(name) {
      switch (name) {
        case 'employee':
          this.getEmployeeList()
          break
        case 'power':
          this.getRolePower()
          break
        default:
          break
      }
    },
  },
  mounted() {
    this.getRoleList()
  },
  watch: {
    currentTab(newVal, oldVal) {
      this.tabChange(newVal)
    }
  }
}
</script>

<style lang="less" scoped>
.role {
  .role-left {
    .title {
      padding-bottom: 16px;
      border-bottom: 1px solid #e8eaec;
      .title-add {
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 0;
        i {
          display: inline-block;
          width: 15px;
          height: 15px;
          vertical-align: middle;
          background: url('~assets/images/add-icon-outline.png') no-repeat;
          background-size: cover;
        }
        a {
          vertical-align: middle;
        }
      }
    }
    .content {
      font-size: 16px;
      color: #515A6E;
      .role-item {
        list-style: none;
        padding: 8px 0 8px 10px;
        background-color: transparent;
        border-radius: 4px;
        transition: all .3s ease;
        &:hover {
          cursor: pointer;
          color: #2D8CF0;
        }
        &.active-role-item {
          color: #fff;
          background-color: #00A1E9;
        }
      }
    }
  }
  .role-right {
    padding-top: 2px;
    .title {
      margin-bottom: 16px;
      .title-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .title-left {
          // display: flex;
          .name {
            display: inline-block;
            font-size: 18px;
          }
          // .remark {
          //   padding-left: 10px;
          // }
        }
        .title-right {
          flex: 0 0 80px;
          div {
            display: inline-block;
            span {
              font-size: 12px;
              vertical-align: middle;
              cursor: pointer;
              &:hover {
                transition: color .2s ease;
                color: #414A5E;
              }
            }
          }
        }
      }
      .remark {
        color: #bbb;
      }
    }
    .content {
      .tabpane-area {
        position: relative;
        .data-power {
          .power-title {
            display: block;
            padding-bottom: 10px;
            margin-bottom: 16px;
            border-bottom: 1px solid #e8eaec;
          }
          .power-content {
            display: flex;
            padding-left: 16px;
            margin-bottom: 16px;
            .label {
              flex: 0 0 120px;
              margin-right: 16px;
            }
            .ivu-radio-group {
              .ivu-radio-wrapper {
                margin-right: 10px;
              }
            }
            .ivu-checkbox-group {
              display: inline-block;
              .ivu-checkbox-wrapper {
                margin-right: 10px;
                margin-bottom: 8px;
              }
            }
          }
        }
        .operation-power {
          .power-title {
            display: block;
            padding-bottom: 10px;
            margin-bottom: 16px;
            border-bottom: 1px solid #e8eaec;
          }
          .power-content {
            display: flex;
            padding-left: 16px;
            margin-bottom: 16px;
            .label {
              flex: 0 0 120px;
              margin-right: 16px;
            }
            .ivu-checkbox-group {
              display: inline-block;
              .ivu-checkbox-wrapper {
                margin-right: 10px;
                margin-bottom: 8px;
              }
              // .first-box {
              //   display: block;
              // }
            }
          }
        }
        /deep/ .spin-fix {
          .ivu-spin-main {
            top: 10%;
          }
        }
      }
      
    }
  }
}
.ivu-modal {
  .add-worker {
    width: 100%;
    min-height: 280px;
    display: flex;
    .search-worker {
      flex: 0 0 70%;
      border-right: 1px solid #e8eaec;
      padding-right: 3%;
    }
    .selected-worker {
      flex: 0 0 30%;
      padding-left: 3%;
      .selected-box {
        display: inline-block;
        background-color: #eee;
        padding: 5px;
        border-radius: 4px;
        margin-top: 8px;
        .ivu-icon {
          cursor: pointer;
        }
      }
    }
  }
}
</style>