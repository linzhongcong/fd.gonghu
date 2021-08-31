<template>
  <div class="table">
    <Table 
      :data="data"
      :columns="columns"
      :border="border"
      :width="width"
      :height="height"
      :max-height="maxHeight"
      :loading="loading"
      :disabled-hover="disabledHover"
      :highlight-row="highlightRow"
      @on-current-change="(currentRow, oldCurrentRow) => $emit('on-current-change', currentRow, oldCurrentRow)"
      @on-select="(selection, row) => $emit('on-select', selection, row)"
      @on-select-cancel="(selection, row) => $emit('on-select-cancel', selection, row)"
      @on-select-all="(selection) => $emit('on-select-all', selection)"
      @on-select-all-cancel="(selection) => $emit('on-select-all-cancel', selection)"
      @on-selection-change="(selection) => $emit('on-selection-change', selection)"
      @on-row-click="(row, index) => $emit('on-row-click', row, index)"
      @on-cell-click="(row, column, data, event) => $emit('on-row-click', row, column, data, event)"
    >
      <!-- 操作 -->
      <template slot-scope="{ row }" slot="action">
        <Tooltip placement="top" content="编辑" transfer>
          <Button type="primary" @click="$emit('on-action-edit', row)" icon="md-create" size="small" :disabled="handleDisabled(row, editRule)"></Button>
        </Tooltip>
        <Poptip @on-ok="$emit('on-action-delete', row)" confirm title="您确认删除这条内容吗？" transfer>
          <Button size="small" icon="md-trash" :disabled="handleDisabled(row, deleteRule)"></Button>
        </Poptip>
      </template>
    </Table>
    <div v-if="!pagerHide" class="page">
      <div class="page-right">
        <Page 
          :size="pageType"
          :current="current"
          :total="total"
          :page-size="pageSize"
          :page-size-opts="pageSizeOpts"
          :placement="placement"
          :show-total="showTotal"
          :show-elevator="showElevator"
          :show-sizer="showSizer"
          :transfer="transfer"
          @on-change="(e) => $emit('on-page-change', e)"
          @on-page-size-change="(e) => $emit('on-page-size-change', e)"
        />
      </div>
    </div>
  </div>
</template>

<script>
/**
 * author: liruiyong
 * version: v1.0.2
 * 全局模块: 带分页器表格
 * 适用范围: 简单的表格展示, 该版本暂不支持 拖拽, 排序, 树型等功能, 如需使用可直接在此组件基于iView文档进行再次封装
 * 新增属性：
 *  pager-hide: 控制分页器 显示与隐藏，默认为展示
 *  deleteRule: 需要表格的操作列时，删除按钮的禁用规则 请用字符串的形式写表达式，默认为可删除。当前行的数据都以row开头，例：需要使用当前行id做匹配，则写成 - row.id
 *  editRule: 需要表格的操作列时，编辑按钮的禁用规则 请用字符串的形式写表达式，默认为可编辑。当前行的数据都以row开头，例：需要使用当前行id做匹配，则写成 - row.id
 *  外部需要表格的操作列时 - 在columns传入一个带有 slot: action 的对象; 例：{ slot: 'action', title: '操作', align: 'center', minWidth: 100 }
 * 新增指令：
 *  on-action-edit：操作 - 编辑时触发，返回值为 {Object} 当前行数据
 *  on-action-delete：操作 - 确认删除时触发，返回值为 {Object} 当前行数据
 *  其余参数可以参考iView文档使用，返回值与iView文档保持一致
 */
export default {
  name: 'table-list',
  props: {
    pagerHide: {
      type: Boolean,
      default: false
    },
    deleteRule: {
      type: String,
      default: ''
    },
    editRule: {
      type: String,
      default: ''
    },
    data: {
      type: Array,
      default() {
        return []
      }
    },
    columns: {
      type: Array,
      default() {
        return []
      }
    },
    border: {
      type: Boolean,
      default: true
    },
    width: {
      type: Number | String
    },
    height: {
      type: Number | String
    },
    maxHeight: {
      type: Number | String
    },
    loading: {
      type: Boolean,
      default: false
    },
    highlightRow: {
      type: Boolean,
      default: false
    },
    disabledHover: {
      type: Boolean,
      default: false
    },
    current: {
      type: Number,
      default: 1
    },
    total: {
      type: Number,
      default: 0
    },
    pageType: {
      type: String
    },
    pageSize: {
      type: Number,
      default: 10
    },
    pageSizeOpts: {
      type: Array,
      default() {
        return [10, 20, 30, 40]
      }
    },
    placement: {
      type: String,
      default: 'bottom'
    },
    showTotal: {
      type: Boolean,
      default: true
    },
    showElevator: {
      type: Boolean,
      default: true
    },
    showSizer: {
      type: Boolean,
      default: true
    },
    transfer: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    /**
     * 列表 - 操作按钮是否禁用
     * @param {Object} row: 当前行数据
     * @param {String} str: 需要被转换执行的表达式（内部可能会有用到row的情况）
     */
    handleDisabled(row, str) {
      return eval(str)
    }
  }
}
</script>

<style lang="less" scoped>
.table {
  .page {
    margin-top: 16px;
    overflow: hidden;
    .page-right {
      text-align: right;
      /deep/ .ivu-page-total {
        float: left;
      }
    }
  }
}
</style>