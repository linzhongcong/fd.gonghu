<template>
  <div class="ticket-reviewer">
    <Card>
      <template slot="title">
        <Row>
          <Col :md="21">
            <Input v-model="searchData.auditor" placeholder="请输入审核人姓名" @on-enter="getList('new')" clearable />
          </Col>
          <Col :md="3" style="text-align: right;">
            <Button type="primary" icon="ios-search" @click="getList('new')">搜 索</Button>
          </Col>
          <!-- 其他选项 -->
          <Col :md="21">
            <Button type="primary" @click="showEditModal('add')">添加</Button>
            
          </Col>
        </Row>
      </template>
      <div class="tips">
        <span class="text">本模块功能说明</span>
        <Poptip transfer trigger="hover" placement="right-start">
          <template slot="title">
            本模块功能用于对线下票务小程序的审核人进行管理，各类型审核人说明如下
          </template>
          <template slot="content">
            1. 一级审核人：申请人为普通用户，对应的可选审核人 <br>
            2. 二级审核人：申请人为一级审核人，对应的可选审核人 <br>
            3. 三级审核人：申请人为二级审核人，对应的可选审核人 <br>
            4. 四级审核人：申请人为三级审核人，对应的审核人只有申请人自己 <br>
            5. 行政审核人：当前系统行政审核人为李耀团、陈朝廷、吴超华。修改请联系 IT 同事处理 <br>
            6. 处理人：当前系统处理人为李耀团，陈朝廷，修改请联系 IT 同事处理 <br>
          </template>
          <Icon type="ios-help-circle-outline" />
        </Poptip>
      </div>
      <TableList
        page-type="small"
        :transfer="true"
        :data="tableData"
        :columns="tableColumns"
        :loading="tableLoading"
        :current="pageProps.page"
        :page-size="pageProps.perPage"
        :total="pageProps.totalCount"
        @on-action-edit="(row) => showEditModal('edit', row)"
        @on-action-delete="handleTableDataOnDelete"
        @on-page-change="(e) => handlePagerOnChange(e, 'page')"
        @on-page-size-change="(e) => handlePagerOnChange(e, 'perPage')"
        @on-selection-change="handleTableSelectionOnChange">
      </TableList>
    </Card>

    <Modal
      v-model="editModal.show"
      :title="editModal.type === 'edit' ? '编辑' : '添加'"
      @on-cancel="closeEditModal">
      <div style="position: relative;">
        <Form ref="editDataForm" :model="editData" :rules="editRules" :label-width="110">
          <FormItem label="审核人姓名：" prop="auditorId">
            <Select
              v-model="editData.auditorId"
              filterable
              :loading="remoteAuditorLoading"
              :remote-method="remoteAuditorsDeb"
              @on-change="handleAuditorOnChange"
              placeholder="请输入审核人姓名">
              <Option v-for="item in auditorOptions" :value="item.id" :label="item.label" :key="`auditor-options-${item.id}`"></Option>
            </Select>
          </FormItem>
          <FormItem label="审核人级别：" prop="level">
            <Select v-model="editData.level" placeholder="请选择审核人级别">
              <Option v-for="item in levelOptions" :value="item.value" :label="item.label" :key="`level-options-${item.value}`"></Option>
            </Select>
          </FormItem>
        </Form>
        <Spin fix v-if="editModal.spinShow"></Spin>
      </div>
      <div slot="footer">
        <Button @click="closeEditModal">取消</Button>
        <Button type="primary" :loading="editModal.submitting" @click="editOnSubmit(editModal.type)">确定</Button>
      </div>      
    </Modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableLoading: false,
      tableData: [],
      tableColumns: [
        {
          type: 'selection',
          width: 70,
          align: 'center',
        },
        {
          title: '审核人姓名',
          align: 'center',
          minWidth: 200,
          render: (h, {row}) => h('span', `${row.username}/${row.auditor}`)
        },
        {
          title: '审核人等级',
          key: 'auditorLevel',
          align: 'center',
          minWidth: 200,
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center',
          width: 150,
        },
      ],
      checkedList: [], // 表格选中项
      
      searchData: { // 查询条件
        auditor: '',
      },
      pageProps: { // 分页器属性
        page: 1,
        perPage: 10,
        totalCount: 0,
      },

      // 添加/编辑弹窗
      editModal: {
        type: 'edit',
        show: false,
        spinShow: false,
        submitting: false, // 提交loading
      },
      editData: { // 提交数据
        auditorId: '',
        level: '',
      },
      editRules: { // 规则
        auditorId: [{ required: true, message: '该项目不能为空', trigger: 'change' }],
        level: [{ required: true, message: '该项目不能为空', trigger: 'change' }],
      },

      levelOptions: [ // 审核人等级
        { value: '1', label: '一级审核人' },
        { value: '2', label: '二级审核人' },
        { value: '3', label: '三级审核人' },
        { value: '4', label: '四级审核人' },
      ],

      remoteAuditorLoading: false, // 审核人远程查询loading
      auditorOptions: [], // 审核人选项
      remoteAuditorsDeb: this.$debonce(this.remoteAuditors, 500),
    }
  },
  methods: {
    /**
     * 获取列表
     * @param {String} type: 是否查询新请求
     */
    async getList(type = '') {
      this.tableLoading = true;
      const { page, perPage } = this.pageProps;
      const params = {  ...this.searchData, page, perPage };
      !!type && (params.page = 1);

      try {
        const { code, data } = await this.$api.getTicketReviewerList(params);
        if (code === 0) {
          const { list, currentPage, totalCount } = data;
          const levelMap = [ '零', '一', '二', '三', '四' ];

          list.forEach(item => item.auditorLevel = `${levelMap[item.level]}级审核人`);
          this.pageProps.page = currentPage;
          this.pageProps.totalCount = totalCount;
          this.tableData = list;
        }
      } catch (error) {}
      this.tableLoading = false;
    },

    /**
     * 获取审核人数据
     * @param {String} name: 审核人名字
     */
    async remoteAuditors(name) {
      this.remoteLoading = true;
      name.includes('/') && (name = name.split('/')[1]);
      try {
        const { code, data } = await this.$api.oaUser({name});
        if (code === 0) {
          data.forEach(item => item.label = `${item.username}/${item.realName}`);
          this.auditorOptions = data;
        }
      } catch (error) {}
      this.remoteLoading = false;
    },

    /**
     * 确认添加/编辑
     * @param {String} type: 当前类型
     * @param {String} interfaceName: 调用接口名
     */
    async editAuditor(type, interfaceName) {
      const { editData, editModal, $Message } = this;
      const data = JSON.parse(JSON.stringify(editData));

      editModal.submitting = true;
      try {
        const { code } =  await this.$api[interfaceName](data);
        
        if (code === 0) {
          $Message.success(`${type === 'edit' ? '编辑' : '添加'}成功`);
          this.closeEditModal();
          this.getList();
        }
      } catch (error) {}
      editModal.submitting = false;
    },

    /**
     * 删除数据
     * @param {String} id: 数据id
     */
    async deleteAuditor(id) {
      try {
        const { code } = await this.$api.deleteTicketReviewer({id});
        
        if (code === 0) {
          this.$Message.warning('删除成功!');
          this.getList();
        }
      } catch (error) {}
    },

    /**
     * 添加/编辑弹窗 - 展示
     * @param {String} type: 当前类型
     * @param {Object} data: 编辑时传入当前行数据
     */
    async showEditModal(type, data = {}) {
      const { editData, editModal } = this;

      editModal.type = type;
      editModal.show = true;
      // 编辑
      if (type === 'edit') {
        editModal.spinShow = true;
        ['id', 'auditorId', 'auditor', 'level'].forEach(key => editData[key] = data[key]);
        await this.remoteAuditors(data.auditor);
        editModal.spinShow = false;
      }
    },

    // 添加/编辑弹窗 - 关闭
    closeEditModal() {
      const { editData, editModal } = this;

      this.$refs.editDataForm.resetFields();
      ['id', 'auditorId', 'auditor', 'level'].forEach(key => editData[key] = undefined); // 重置数据
      this.auditorOptions = [];
      editModal.show = false;
    },

    /**
     * 编辑/添加弹窗 - 确认
     * @param {String} type: 当前确认类型： add/添加  edit/编辑
     */
    editOnSubmit(type) {
      this.$refs.editDataForm.validate(valid => {
        if (valid) {
          const API = type === 'edit' ? 'updateTicketReviewer' : 'createTicketReviewer';
          this.editAuditor(type, API);
        }
      })
    },

    /**
     * 审核人选项变化
     * @param {String} id: 当前选中id
     */
    handleAuditorOnChange(id) {
      const { editData, auditorOptions } = this;
      const auditorInfo = auditorOptions.find(item => item.id === id);
      editData.auditor = auditorInfo && auditorInfo.realName;
    },

    /**
     * 表格选项变化
     * @param {Array} selections: 已选中选项
     */
    handleTableSelectionOnChange(selections) {
      this.checkedList = selections;
    },

    /**
     * 表格分页器变化
     * @param {Number} e: 当前值
     * @param {String} prop: 当前属性名
     */
    handlePagerOnChange(e, prop) {
      this.pageProps[prop] = e;
      this.getList();
    },

    /**
     * 表格某行数据被删除
     * @param {Object} data: 当前行数据 
     */
    handleTableDataOnDelete({id}) {
      this.tableLoading = true;
      this.deleteAuditor(id);
    },

  },
  mounted() {
    this.checkList = [];
    this.getList();
  }
}
</script>

<style lang="less" scoped>
.ticket-reviewer {
  .ivu-card-head {
    .ivu-input-wrapper {
      width: 250px;
    }
  }
  .tips {
    margin-bottom: 10px;
    .text {
      color: #ed4014;
    }
    .ivu-icon-ios-help-circle-outline:hover {
      cursor: pointer;
    }
  }
}
</style>