<template>
  <div class="opration-log" :style="'margin-top:' + top + 'px'">
    <h3 v-if="!hideTitle">操作日志</h3>
    <Table border ref="selection" :loading="loading" :max-height="height" :columns="columns" :data="dataLists">
      <template slot-scope="{row, index}" slot="serial">
        <span>{{index + 1}}</span>
      </template>
      <template slot-scope="{row}" slot="ext">
        <div v-html="row.content"></div>
      </template>
    </Table>

    <!-- 分页 -->
    <div class="foot-page">
      共&nbsp;{{total}}&nbsp;条
      <Page
              size="small"
              :total="total"
              show-elevator
              show-sizer
              :current="page"
              :page-size="perPage"
              @on-change="pageChange"
              @on-page-size-change="perPageChange"
      />
    </div>
  </div>
</template>

<script>
  export default {
    /**
     *
     * @prop {String} moduleName: 接口模块名称 (必须属性)
     * @prop {String} moduleId: 接口模块名称 (非必须属性)
     * @prop {Number | String} height: iview-table的max-height
     * @prop {Number | String} top: iview-table的上外边距（margin-top）
     * @prop {Boolean} hideTitle: 隐藏标题
     *
     *
     */
    props: {
      // 模块名称
      moduleName: {
        type: String,
        required: true
      },
      moduleId: {
        required: false
      },
      height: {
        type: Number | String,
        default: 550
      },
      top: {
        type: String | Number,
        default: 30
      },
      hideTitle: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        loading: false,
        page: 1,
        perPage: 10,
        // 总条数
        total: 0,
        // 操作日志表头
        columns: [
          {
            title: '序号',
            slot: 'serial',
            align: 'center',
            width: 100
          },
          {
            title: '操作',
            key: 'title',
            align: 'center',
            minWidth: 100
          },
          {
            title: '内容',
            key: 'ext',
            slot: 'ext',
            align: 'center',
            minWidth: 100
          },
          {
            title: '操作人',
            key: 'createdBy',
            align: 'center',
            minWidth: 100
          },
          {
            title: '操作时间',
            key: 'createdAt',
            align: 'center',
            minWidth: 100,
            maxWidth: 210
          },
        ],
        // 列表数据
        dataLists: []

      }
    },
    mounted() {
      this.getLog()
    },
    methods: {
      // 获取日志
      getLog() {
        let sendData = {
          page: this.page,
          perPage: this.perPage,
          moduleName: this.moduleName,
          moduleId: this.moduleId
        }
        this.loading = true
        this.$API.getLog(sendData)
          .then(res => {
            this.total = res.data.count
            res.data.list.forEach(item => {
              item.createdAt = this.$formatDate(item.createdAt, 'yyyy-MM-dd HH:mm:ss')
            })
            this.dataLists = res.data.list
          })
          .finally(() => {
            this.loading = false
          })
      },
      pageChange(page) {
        this.page = page
        this.getLog()
      },
      perPageChange(size) {
        this.perPage = size
        this.getLog()
      }
    },
    watch: {
      moduleId (newId) {
        if (newId) {
          this.getLog()
        }
      }
    }
  }
</script>

<style lang="less" scoped>
.opration-log {
  // padding: 0 20px;
}
.opration-log h3 {
  margin-bottom: 15px;
}
.foot-page {
  padding: 10px;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
