<template>
  <div class="role-permission">
    <Card>
      <template slot="title">
        <Row type="flex" justify="space-between">
          <div>
            <Input v-model="permissionName" placeholder="请输入权限名称" @on-enter="getList('new')" clearable />
            <Select 
              transfer
              clearable
              filterable
              :loading="remoteQueryLoading"
              :remote-method="queryPermissionMenuDeb"
              @on-change="(value) => handleSelect(value, 'permissionMenuId')"
              placeholder="请输入权限模块">
              <Option v-for="(item, index) in permissionMenuList" :key="'perm' + index" :label="item.name" :value="item.id"></Option>
            </Select>
            <Button type="primary" icon="ios-search" @click="getList('new')">搜 索</Button>
          </div>
          <Button type="primary" @click="handleModal('permission', 'add')">新建权限</Button>
        </Row>
      </template>
      <TableList
        page-type="small"
        :transfer="true"
        :data="permissionTable.data"
        :columns="permissionTable.columns"
        :loading="permissionTable.loading"
        :current="permissionTable.page"
        :page-size="permissionTable.pageSize"
        :total="permissionTable.totalCount"
        @on-page-change="(e) => handleTablePage(e, 'page')"
        @on-page-size-change="(e) => handleTablePage(e, 'pageSize')"
        @on-selection-change="(selection) => handleSelect(selection, 'permissionTable')">
      </TableList>
    </Card>
    <!-- 权限弹窗 start -->
    <Modal v-model="permission.openModal" :title="permission.type === 'add' ? '新建权限' : '设置权限'" @on-visible-change="permissionModalChange">
      <div>
        <Form ref="permission1" :model="permission.data" :rules="permission.rules" :label-width="90" style="width: 70%;">
          <FormItem label="权限名称:" prop="name">
            <Input v-model="permission.data.name" placeholder="请输入权限名称" />
          </FormItem>
          <FormItem label="权限模块:" prop="menuId">
            <Select 
              transfer
              clearable
              filterable
              v-model="permission.data.menuId"
              :loading="remoteQueryLoading"
              :remote-method="queryPermissionMenuDeb"
              @on-change="(value) => handleSelect(value, 'permission')"
              :placeholder="permission.data.menuId ? '正在加载' : '请输入权限模块'">
              <Option v-for="(item, index) in permissionMenuList" :key="'perm' + index" :label="item.name" :value="item.id"></Option>
            </Select>
          </FormItem>
          <FormItem label="关联路由:" prop="route">
            <Select
              transfer
              clearable
              filterable
              v-model="permission.data.route"
              :loading="remoteQueryLoading"
              :remote-method="queryConnectRouteDeb"
              :placeholder="permission.data.route ? '正在加载' : '请输入关联路由'">
              <Option v-for="(item, index) in connectRouteList" :key="'route' + index" :label="item.name" :value="item.name"></Option>
            </Select>
          </FormItem>
          <FormItem label="关联规则:">
            <Select
              transfer
              clearable
              filterable
              v-model="permission.data.ruleName"
              :loading="remoteQueryLoading"
              :remote-method="queryConnectRuleDeb"
              :placeholder="permission.data.ruleName ? '正在加载' : '请输入关联规则'">
              <Option v-for="(item, index) in connectRuleList" :key="'route' + index" :label="item.name" :value="item.name"></Option>
            </Select>
          </FormItem>
          <FormItem label="描述:">
            <Input v-model="permission.data.description" type="textarea" placeholder="请输入描述" />
          </FormItem>
        </Form>
      </div>
      <template slot="footer">
        <Button type="primary" :loading="permission.subBtnLoading" @click="handlePermission(permission.type).init(permission)">确定</Button>
      </template>
    </Modal>
    <!-- 权限弹窗 end -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      remoteQueryLoading: false,
      permissionName: '',
      permissionMenuId: undefined,
      permissionTable: {
        loading: false,
        page: 1,
        pageSize: 10,
        totalCount: 0,
        data: [],
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '权限名称',
            key: 'name',
            minWidth: 200,
            align: 'center'
          },
          {
            title: '权限模块',
            key: 'menuName',
            minWidth: 200,
            align: 'center'
          },
          {
            title: '关联路由',
            key: 'route',
            minWidth: 300,
            align: 'center'
          },
          {
            title: '关联规则',
            key: 'ruleName',
            minWidth: 200,
            align: 'center'
          },
          {
            title: '描述',
            key: 'description',
            minWidth: 200,
            align: 'center'
          },
          {
            title: '操作',
            width: 100,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Tooltip', {
                  props: {
                    transfer: true,
                    placement: 'top',
                    content: '编辑'
                  }
                }, [
                  h('Button', {
                    props: {
                      size: 'small',
                      icon: 'md-create',
                      type: 'primary'
                    },
                    style: {
                      marginRight: '10px'
                    },
                    on: {
                      click: () => {
                        this.handleModal('permission', 'edit', params.row)
                      }
                    }
                  })
                ]),
                h('Poptip', {
                  props: {
                    title: '您确认删除这条内容吗？',
                    confirm: true,
                    transfer: true
                  },
                  on: {
                    'on-ok': () => {
                      this.handlePermission('delete').init(params.row)
                    }
                  }
                }, [
                  h('Button', {
                    props: {
                      size: 'small',
                      icon: 'md-trash',
                    }
                  })
                ])
              ])
            }
          }
        ]
      },
      permissionMenu: {
        menuId: undefined,
      },
      permission: {
        type: 'add',
        openModal: false,
        subBtnLoading: false,
        data: {
          name: '',
          menuId: '',
          route: '',
          ruleName: '',
          description: '',
        },
        rules: {
          'name': [{ required: true, message: '该项目不能为空', trigger: 'change' }],
          'menuId': [{ required: true, message: '该项目不能为空', trigger: 'change' }],
          'route': [{ required: true, message: '该项目不能为空', trigger: 'change' }],
        }
      },
      permissionMenuList: [], // 权限 - 模块
      connectRouteList: [], // 权限 - 关联路由
      connectRuleList: [], // 权限 - 关联规则
      queryPermissionMenuDeb: this.$debonce(this.queryPermissionMenu, 500),
      queryConnectRouteDeb: this.$debonce(this.queryConnectRoute, 500),
      queryConnectRuleDeb: this.$debonce(this.queryConnectRule, 500),
    }
  },
  methods: {
    /**
     * 获取权限列表
     */
    async getList(type = '') {
      let res,
          params, 
          permissionTable = this.permissionTable
      permissionTable.loading = true
      params = {
        name: this.permissionName,
        menuId: this.permissionMenuId,
        page: permissionTable.page,
        perPage: permissionTable.pageSize
      }
      params = JSON.parse(JSON.stringify(params))
      !!type && (params.page = 1)
      try {
        res = await this.$api.getPermissionList(params)
        if (res.code === 0) {
          permissionTable.data = res.data.list
          permissionTable.page = res.data.currentPage
          permissionTable.totalCount = res.data.totalCount
          permissionTable.loading = false
        }
      } catch (error) {
        permissionTable.loading = false
      }
    },

    /**
     * 搜索权限列表
     */
    async queryPermissionMenu(menu) {
      let res
      this.remoteQueryLoading = true
      try {
        res = await this.$api.getPermissionMenu({menu})
        if (res.code === 0) {
          this.remoteQueryLoading = false
          this.permissionMenuList = res.data
        }
      } catch (error) {
        this.remoteQueryLoading = false
      }
    },

    /**
     * 查询关联路由
     */
    async queryConnectRoute(route) {
      let res
      this.remoteQueryLoading = true
      try {
        res = await this.$api.getPermissionConnectRoute({route})
        if (res.code === 0) {
          this.remoteQueryLoading = false
          this.connectRouteList = res.data
        }
      } catch (error) {
        this.remoteQueryLoading = false
      }
    },

    /**
     * 查询关联规则
     */
    async queryConnectRule(rule) {
      let res
      this.remoteQueryLoading = true
      try {
        res = await this.$api.getPermissionConnectRule({rule})
        if (res.code === 0) {
          this.remoteQueryLoading = false
          this.connectRuleList = res.data
        }
      } catch (error) {
        this.remoteQueryLoading = false
      }
    },

    /**
     * 选项变化
     */
    handleSelect(data, type) {
      switch (type) {
        case 'permissionMenuId':
          !data && (this.permissionMenuList = [])
          this[type] = data
          this.getList('new')
          break
        default:
          break
      }
    },

    /**
     * 切换分页操作
     */
    handleTablePage(e, prop) {
      this.permissionTable[prop] = e
      this.getList()
    },

    /**
     * 弹窗
     */
    handleModal(target, type, data = {}) {
      if (target === 'permission') {
        this.beforePermissionOpenModal(type, data)
      }
      this[target].openModal = true
    },

    /**
     * 弹窗状态变化事件
     */
    permissionModalChange(res) {
      this.connectRuleList = []
      this.connectRouteList = []
      this.permissionMenuList = []
      // 需要在弹窗关闭重置数据， 弹窗前重置数据有异常
      if (!res) {
        let mapping = ['name', 'menuId', 'route', 'ruleName', 'description'],
            data = this.permission.data
        mapping.forEach(item => data[item] = '')
      }
    },

    /**
     * 权限弹窗 前置操作
     */
    beforePermissionOpenModal(type, data) {
      let permission = this.permission
      this.permissionMenuList = []
      permission.type = type
      if (type === 'edit') {
        ['name', 'menuId', 'route', 'ruleName', 'description'].forEach(item => permission.data[item] = data[item])
        permission.data.rawName = data.name
        permission.data.rawMenuId = data.menuId
        !!data.menuName && this.queryPermissionMenu(data.menuName)
        !!data.ruleName && this.queryConnectRule(data.ruleName)
        !!data.route && this.queryConnectRoute(data.route)
      }
    },

    /**
     * 提交权限 添加/编辑/删除
     */
    handlePermission(state) {
      const obj = {
        status: '',
        state: {
          add: async (permission) => {
            let res, params = JSON.parse(JSON.stringify(permission.data))
            params.ruleName = params.ruleName || null
            delete params.rawName
            delete params.rawMenuId
            try {
              res = await this.$api.createPermission(params)
              if (res.code === 0) {
                permission.subBtnLoading = false
                permission.openModal = false
                this.$Message.success('操作成功')
                this.getList('new')
              }
            } catch (error) {
              permission.subBtnLoading = false
            }
          },
          edit: async (permission) => {
            let res, params = JSON.parse(JSON.stringify(permission.data))
            params.ruleName = params.ruleName || null
            try {
              res = await this.$api.updatePermission(params)
              if (res.code === 0) {
                permission.subBtnLoading = false
                permission.openModal = false
                this.$Message.success('操作成功')
                this.getList()
              }
            } catch (error) {
              permission.subBtnLoading = false
            }
          },
          delete: async (params) => {
            let res, { name, menuId } = params
            try {
              res = await this.$api.deletePermission({name, menuId})
              if (res.code === 0) {
                this.$Message.success('操作成功')
                this.getList()
              }
            } catch (error) {
              
            }
          }
        },
        init: (data) => {
          if (obj.status === 'delete') {
            return obj.state[obj.status](data)
          }
          this.$refs.permission1.validate((valid) => {
            if (valid) {
              this.permission.subBtnLoading = true
              return obj.state[obj.status](data)
            }
          })
        }
      }
      obj.status = state
      return obj
    },
  },
  mounted() {
    this.getList()
  }
}
</script>

<style lang="less" scoped>

</style>