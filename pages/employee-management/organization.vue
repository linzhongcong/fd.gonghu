<template>
  <div class="organization">
    <CategoryCard>
      <template slot="left">
        <div class="organization-left">
          <Row class="left-header" style="margin-bottom: 16px">
            <Col :lg="16">
              <div class="left-header-search">
                <Icon type="ios-search" size="16" @click="getTreeList(searchDeptTreeName)"/>
              </div>
              <Input v-model="searchDeptTreeName" placeholder="部门名称搜索" @on-enter="getTreeList(searchDeptTreeName)"/>
            </Col>
            <Col class="left-header-add" :lg="8">
              <div>
                <i></i>
                <a href="javascript:;" @click="handleModal('department', 'add')">新建部门</a>
              </div>
            </Col>
          </Row>
          <Tree class="left-content" ref="tree" :data="deptTreeList" @on-select-change="handleTreeChange"></Tree>
        </div>
      </template>
      <template slot="right">
        <div v-show="currentDetail !== null" class="organization-right">
          <Row type="flex" align="middle" style="margin-bottom: 16px">
            <Col span="12">
              <div class="right-header-title">
                <h3>{{`${currentDetail && currentDetail.title}(${empTable.totalCount}人)`}}</h3>
                <div>
                  <Icon type="md-settings" />
                  <span @click="handleModal('department', 'edit')">设置部门</span>
                </div>
              </div>
            </Col>
            <Col span="12">
              <div class="right-header">
                <div class="right-header-add">
                  <i></i>
                  <a href="javascript:;" @click="handleModal('employee', 'add')">添加员工</a>
                </div>
                <div class="right-header-add">
                  <i class="icon-edit"></i>
                  <a href="javascript:;" @click="handleModal('employee', 'edit')">编辑员工</a>
                </div>
              </div>
            </Col>
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
            @on-selection-change="(selection) => handleSelect(selection, 'empTabList')"
          ></TableList>
        </div>
      </template>
    </CategoryCard>
    <!-- 新建/设置部门模态窗 start -->
    <Modal v-model="department.modalOpen" :title="department.type === 'add' ? '新建部门' : '设置部门'">
      <Form ref="department" :model="department.data" :rules="department.rules" :label-width="90" style="width: 70%;">
        <FormItem label="部门名称:" prop="name">
          <Input v-model="department.data.name" placeholder="请输入内容" />
        </FormItem>
        <FormItem label="上级部门:" prop="parentId">
          <Cascader :data="department.treeList" v-model="department.data.parentId" change-on-select></Cascader>
        </FormItem>
        <FormItem label="部门负责人:">
          <Select
            v-model="department.data.managedId"
            clearable
            filterable
            :remote-method="queryEmployeeDeb"
            :placeholder="department.data.managedId > 0 ? `${department.data.username}/${department.data.managedBy}` : '请选择负责人'">
            <Option v-for="(item, index) in empList" :value="item.id" :label="item.full_name" :key="index"></Option>
          </Select>
        </FormItem>
      </Form>
      <template slot="footer">
        <Button v-if="department.type === 'edit'" type="error" :loading="department.delBtnLoading" @click="handleSubmitDept('delete').init('delete')">删除部门</Button>
        <Button type="primary" :loading="department.btnLoading" @click="handleSubmitDept(department.type).init('department')">确定</Button>
      </template>
    </Modal>
    <!-- 新建/设置部门模态窗 end -->
    <!-- 添加员工模态窗 start -->
    <Modal v-model="employee.modalOpen" :title="employee.type === 'add' ? '添加员工' : '编辑员工'" width="600">
      <div v-show="employee.type === 'add'" class="add-worker">
        <div class="search-worker">
          <InputSearch
            ref="inputSearch1"
            dropdown-text="full_name"
            :dropdown-list="empList"
            :checked-list="employee.data.checkedList"
            @on-search="queryEmployeeDeb"
            @on-select-change="(selection) => handleSelect(selection, 'employee')">
          </InputSearch>
        </div>
        <div class="selected-worker" @click="handleDelWorker">
          <div class="title">已选择:</div>
          <div v-for="(item, index) in employee.data.checkedList">
            <span class="selected-box" >
            <span>{{item.real_name}}</span>
              <Icon type="ios-close" size="16" :data-index="index"/>
            </span>
          </div>
        </div>
      </div>
      <div v-show="employee.type === 'edit'">
        <Form ref="employee" :model="employee.data" :rules="employee.rules" :label-width="60">
          <Row>
            <Col span="12">
              <FormItem label="工号:">
                <Input :value="employee.data.jobNumber" readonly/>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="姓名:">
                <Input :value="employee.data.name" readonly/>
              </FormItem>
            </Col>
            <Col span="15">
              <FormItem label="部门:" prop="offlineDeptId">
                <Cascader :data="employee.treeList" v-model="employee.data.offlineDeptId" change-on-select></Cascader>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
      <template slot="footer">
        <Button type="primary" :loading="employee.btnLoading" @click="handleSubmitEmp(employee.type).init()">确定</Button>
      </template>
    </Modal>
    <!-- 添加员工模态窗 end -->
  </div>
</template>

<script>
import CategoryCard from '../my-components/category-card'
import InputSearch from '../my-components/input-search'
export default {
  components: { CategoryCard, InputSearch },
  data() {
    return {
      currentDetail: null,
      empTable: {
        columns: [
          {
            type: 'selection',
            minWidth: 60,
            align: 'center'
          },
          {
            title: '工号',
            key: 'username',
            minWidth: 150,
            align: 'center'
          },
          {
            title: '姓名',
            key: 'realName',
            minWidth: 180,
            align: 'center',
            render: (h, {row}) => {
              if (row.isManager) {
                return h('div', {}, [
                  h('span', row.realName),
                  h('span', {
                    style: {
                      display: 'inline-block',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      color: '#818A9E',
                      padding: '0 6px',
                      marginLeft: '6px',
                    }
                  }, '负责人')
                ])
              } else {
                return h('span', row.realName)
              }
            }
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
            minWidth: 200,
            align: 'center'
          },
          {
            title: '角色',
            key: 'roles',
            minWidth: 160,
            align: 'center'
          },
        ],
        data: [],
        page: 1,
        pageSize: 10,
        totalCount: 0,
        loading: false,
      },
      empTabCheckedList: [],
      searchDeptTreeName: '',
      deptTreeList: [],
      department: { // 部门模态窗
        type: 'add',
        modalOpen: false,
        btnLoading: false,
        delBtnLoading: false,
        treeList: [],
        managerList: [],
        data: {
          name: '',
          parentId: [],
          managedId: undefined,
        },
        rules: {
          'name': [{ required: true, message: '该项目不能为空', trigger: 'blur' }],
          'parentId': [{ required: true, message: '该项目不能为空', trigger: 'change', type: 'array' }],
        }
      },
      empList: [], // 员工列表
      employee: { // 员工模态窗
        type: 'add',
        modalOpen: false,
        btnLoading: false,
        treeList: [],
        data: {
          checkedList: [],
        },
        rules: {
          'offlineDeptId': [{ required: true, message: '该项目不能为空', trigger: 'change', type: 'array' }]
        }
      },
      queryEmployeeDeb: this.$debonce(this.queryEmployee, 500)
    }
  },
  methods: {
    /**
     * 获取树型列表
     * @param {String} name: 搜索部门词
     * @param {String} range: 使用范围 global-组织架构页  其他区域下只需要按格式传递进区域对象
     */
    async getTreeList (name, range = 'global') {
      let res
      try {
        res = await this.$api.getOrganizationDeptTree({name})
        if (res.code === 0) {
          if (range === 'global') {
            this.deptTreeList = res.data
            if (res.data.length > 0) {
              this.currentDetail = res.data[0]
              this.getEmployeeList()
              this.$set(this.deptTreeList[0], 'expand', true)
              this.$set(this.deptTreeList[0], 'selected', true)
            } else {
              this.currentDetail = null
            }
          } else {
            this[range].treeList = res.data
          }
        }
      } catch (error) {
        this.$Notice.error({
          title: error.code,
          desc: error.message
        })
      }
    },

    /**
     * 获取员工列表
     * @param {String} type: 是否发起全新搜索 默认-否
     */
    async getEmployeeList(type = '') {
      let res, 
          params = {
            offlineDeptId: this.currentDetail.id,
            page: this.empTable.page,
            perPage: this.empTable.pageSize
          }
      this.empTable.totalCount = 0
      this.empTable.loading = true
      type && (params.page = 1)
      try {
        res = await this.$api.getOrganizationEmployeeList(params)
        if (res.code === 0) {
          this.empTable.data = res.data.list
          this.empTable.page = res.data.currentPage
          this.empTable.pageSize = res.data.perPage
          this.empTable.totalCount = res.data.totalCount
          this.empTable.loading = false
        }
      } catch (error) {
        this.$Notice.error({
          title: error.code,
          desc: error.message
        })
      }
    },

    /**
     * 获取部门信息
     * @param {String} type: 获取哪个状态下的部门信息
     */
    async getDeptDetail(type = 'dept') {
      let res, id = this.currentDetail.id
      try {
        res = await this.$api.getOrganizationDeptDetail({id})
        if (res.code === 0) {
          let data = res.data
          if (type === 'dept') {
            data.managedId > 0 && this.queryEmployee(data.managedBy)
            this.department.data = data
            this.$nextTick(() => this.$refs.department.validate())
          } else if (type === 'emp') {
            this.employee.data.offlineDeptId = data.parentId
          }
        }
      } catch (error) {
        this.$Notice.error({
          title: error.code,
          desc: error.message
        })
      }
    },

    /**
     * 搜索负责人
     * @param {String} username: 员工姓名/工号
     */
    async queryEmployee(username) {
      if (username.indexOf('/') > -1) return
      let res
      try {
        res = await this.$api.user({username})
        this.empList = res.items
      } catch (error) {
        this.$Notice.error({
          title: error.code,
          desc: error.message
        })
      }
    },

    /**
     * 确认 新建/编辑/删除 部门
     * @param {String} state: 操作的状态
     */
    handleSubmitDept(state) {
      const obj = {
        status: '',
        state: {
          add: async (params) => {
            let res
            try {
              res = await this.$api.createOrganizationDept(params)
              if (res.code === 0) {
                this.department.btnLoading = false
                this.department.modalOpen = false
                this.getTreeList()
              }
            } catch (error) {
              this.department.btnLoading = false
              this.$Notice.error({
                title: error.code,
                desc: error.message
              })
            }
          },
          edit: async (params) => {
            let res
            try {
              res = await this.$api.updateOrganizationDept(params)
              if (res.code === 0) {
                this.department.btnLoading = false
                this.department.modalOpen = false
                this.getTreeList()
              }
            } catch (error) {
              this.department.btnLoading = false
              this.$Notice.error({
                title: error.code,
                desc: error.message
              })
            }
          },
          delete: async (id) => {
            let res
            try {
              res = await this.$api.deleteOrganizationDept({id})
              if (res.code === 0) {
                this.department.delBtnLoading = false
                this.department.modalOpen = false
                this.getTreeList()
              }
            } catch (error) {
              this.department.delBtnLoading = false
              this.$Notice.error({
                title: error.code,
                desc: error.message
              })
            }
          }
        },
        init: (name) => {
          if (name === 'delete') {
            this.$Modal.confirm({
              title: '确认删除该部门',
              onOk: () => {
                this.department.delBtnLoading = true
                return obj.state[obj.status](this.currentDetail.id)
              }
            })
            return
          }
          this.$refs[name].validate((valid) => {
            if (valid) {
              let params = JSON.parse(JSON.stringify(this[name].data))
              params.parentId = params.parentId.pop()
              this.department.btnLoading = true
              return obj.state[obj.status](params)
            }
          })
        }
      }
      obj.status = state
      return obj
    },

    /**
     * 确认 添加/编辑 员工
     * @param {String} state: 操作的状态
     */
    handleSubmitEmp(state) {
      const obj = {
        status: '',
        state: {
          add: async () => {
            let res, params, { checkedList } = this.employee.data
            if (checkedList.length === 0) {
              this.employee.btnLoading = false
              return this.$Message.warning('请选择员工')
            }
            params = {
              employeeIds: checkedList.map(item => item.id),
              offlineDeptId: this.currentDetail.id
            }
            try {
              res = await this.$api.addOrganizationEmployee(params)
              if (res.code === 0) {
                this.$Message.success('操作成功')
                this.employee.btnLoading = false
                this.employee.modalOpen = false
                this.getEmployeeList('new')
              }
            } catch (error) {
              this.employee.btnLoading = false
              this.$Notice.error({
                title: error.code,
                desc: error.message
              })
            }
          },
          edit: () => {
            this.$refs.employee.validate(async (valid) => {
              if (valid) {
                let res, params, { employeeId, offlineDeptId } = this.employee.data
                params = {
                  employeeId,
                  offlineDeptId: offlineDeptId.pop()
                }
                try {
                  res = await this.$api.updateOrganizationEmployee(params)
                  if (res.code === 0) {
                    this.$Message.success('操作成功')
                    this.employee.btnLoading = false
                    this.employee.modalOpen = false
                    this.getEmployeeList()
                  }
                } catch (error) {
                  this.employee.btnLoading = false
                }
              } else {
                this.employee.btnLoading = false
                this.$Notice.error({
                  title: error.code,
                  desc: error.message
                })
              }
            })
          }
        },
        init: () => {
          this.employee.btnLoading = true
          return obj.state[obj.status]()
        }
      }
      obj.status = state
      return obj
    },

    /**
     * 操作部门弹窗 - 为新增或编辑
     * @param {String} type: 操作类型
     */
    handleDept(type) {
      this.department.type = type
      this.department.data = {
        name: '',
        parentId: [],
        managedId: undefined,
      }
      this.getTreeList('', 'department')
      if (type === 'edit') {
        this.getDeptDetail('dept')
      }
      return true
    },

    /**
     * 操作员工弹窗 - 为新增或编辑
     * @param {String} type: 操作类型
     */
    handleEmp(type) {
      this.employee.type = type
      if (type === 'add') { // 添加
        this.employee.data = {
          checkedList: []
        }
        this.$refs.inputSearch1.handleClearQueryKey()
        return true
      } else if (type === 'edit') { // 编辑
        let empTabCheckedList = this.empTabCheckedList
        if (empTabCheckedList.length !== 1) {
          this.$Message.warning('请选择一条数据')
          return false
        }
        this.employee.data = {
          name: empTabCheckedList[0].realName,
          jobNumber: empTabCheckedList[0].username,
          employeeId: empTabCheckedList[0].id,
          offlineDeptId: []
        }
        this.getTreeList('', 'employee')
        this.getDeptDetail('emp')
        return true
      }
    },

    /**
     * 删除选中的员工数据
     * @param {Object} e: 事件对象
     */
    handleDelWorker(e) {
      if (e.target.nodeName === 'I') {
        this.employee.data.checkedList.splice(e.target.dataset.index, 1)
      }
    },

    /**
     * 树型选中状态发生改变
     * @param {Array} selection: 选中数据
     */
    handleTreeChange (selection) {
      if (selection.length > 0) {
        this.currentDetail = selection[0]
        this.empTabCheckedList = []
        this.getEmployeeList()
      } else {
        this.currentDetail = null
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
          this.employee.data.checkedList = selection
          break
        case 'empTabList':
          this.empTabCheckedList = selection
          break
        default:
          break
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
     * 开启弹窗
     * @param {String} prop: 弹窗对象
     * @param {Srting} type: 打开类型
     */
    handleModal (prop, type) {
      let flag = true
      this.empList = []
      if (prop === 'department') {
        flag = this.handleDept(type)
      } else if (prop === 'employee') {
        flag = this.handleEmp(type)
      }
      flag && (this[prop].modalOpen = true)
    },
  },
  mounted() {
    this.getTreeList()
  },
}
</script>

<style lang="less" scoped>
.organization {
  .organization-left {
    .left-header {
      .left-header-search {
        position: absolute;
        width: 24px;
        z-index: 5;
        right: 8px;
        background-color: #fff;
        top: 1px;
        bottom: 1px;
        cursor: pointer;
        .ivu-icon {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }
      .left-header-add {
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
          background: url('~assets/images/add-icon.png') no-repeat;
          background-size: cover;
        }
        a {
          vertical-align: middle;
        }
      }
    }
    // .left-content {
      // .ivu-tree-title {
      //   width: 90%;
      // }
    // }
  }
  .organization-right {
    .right-header-title {
      h3 {
        display: inline-block;
        margin-right: 16px;
      }
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
    .right-header {
      display: flex;
      justify-content: flex-end;
      .right-header-add {
        display: inline-block;
        margin-right: 16px;
        &:last-child {
          margin-right: 0;
        }
        i {
          display: inline-block;
          width: 16px;
          height: 16px;
          vertical-align: middle;
          background: url('~assets/images/add-icon-outline.png') no-repeat;
          background-size: cover;
        }
        a {
          vertical-align: middle;
        }
        .icon-edit {
          background: url('~assets/images/edit-icon-outline.png') no-repeat;
          background-size: cover;
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