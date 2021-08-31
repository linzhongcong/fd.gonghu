<template>
  <div class="render-child-cell">
    <Table @on-selection-change="changeSelect" ref="tableChild" :columns="childColum" :show-header="false" :data="data">
      <template slot="action" slot-scope="{row}" v-if="actionData">
        <Tooltip
                :content="item.txt"
                placement="top"
                v-for="(item, index) in actionData"
                :key="index"
                :style="index!==actionData.length - 1?'margin-right: 5px':''">
          <Button :type="item.type" :icon="item.icon" @click="item.fn(row)" v-if="!item.pTitle"
                  :disabled="typeof item.disabledKey === 'function' ? !!(item.disabledKey(row)) : !!row[item.disabledKey]">
                  <template v-if="item.font">{{item.font}}</template>
          </Button>
          <Poptip confirm :title="item.pTitle" @on-ok="item.fn(row)" transfer v-else>
            <Button :icon="item.icon" :disabled="typeof item.disabledKey === 'function' ? !!(item.disabledKey(row)) : !!row[item.disabledKey]">
              <template v-if="item.font">{{item.font}}</template>
            </Button>
          </Poptip>
        </Tooltip>
      </template>
    </Table>
  </div>
</template>

<script>
  export default {
    /**
     * author: shenyipeng
     *
     * @prop {Array} column: 子列表iview-table的column
     *    1.会直接过滤expand
     *    2.调用父组件方法直接用render并且事件写成箭头函数里面直接调用
     *       如：render: (h, params) => {
     *            return h('a', {
     *              on: {
     *                click: () => {
     *                  this.showDetail(params.row.id)
     *                }
     *              },
     *              domProps: {
     *                innerHTML: params.row.productCode
     *              },
     *            })
     *          }
     *
     *  @prop {Array} data: 子列表iview-table的data
     *
     *  @prop {Array} childSelect: 子列表iview-table的选中项
     *
     *  @prop {Array} actionData: 子列表slot=action项的插槽渲染按钮数组(column如果有slot=action必传)
     *     @param {Srting} txt: tooltip文字
     *     @param {Srting} font: 按钮文字 (2019.12.18 liweijin新增)
     *     @param {Srting} icon: 按钮icon的iview-icon
     *     @param {Srting} type: iview按钮的type
     *     @param {Srting} pTitle: iview按钮外层包车的Tooltip组件
     *     @param {Srting | Function} disabledKey: 按钮 :disabled=!!row[disabledKey] 如果是Function则取返回结果
     *     @param {Function} fn: 按钮点击事件，传入箭头函数里面直接调用父组件方法
     *        如： fn: (row) => {
     *               this.del(row.id)
     *             }
     *
     *  @emit changeChildSelect: 改变子组件选项 触发的emit
     *    @param {Array} list: 选中的数组
     */
    props: {
      column: {
        required: true,
        type: Array
      },
      data: {
        required: true,
        type: Array
      },
      childSelect: {
        required: true,
        type: Array
      },
      actionData: {
        required: false,
        type: Array
      }
    },
    data() {
      return {
        isRender: false,
        privateSeletData: [],
        childColum: []
      }
    },
    created() {
      // 初始化childColum
      let res = [...this.column]
      res = res.map((item, index) => {
        item.className = 'child-table-item'
        if (item.type === 'expand') {
          return {
            title: 'nullItem',
            key: 'nullItem',
            align: 'center',
            width: item.width,
            className: 'child-table-item'
          }
        }
        let result = {...item}
        delete result.__id
        return result
      })
      this.childColum = res
    },
    mounted() {
      let objData = this.$refs.tableChild.objData
      for (const k in objData) {
        let findData = this.childSelect.find((item) => objData[k].id === item.id)
        if (findData) {
          this.privateSeletData.push(findData)
          objData[k]._isChecked = true
        }
      }
      this.$nextTick(() => {
        this.isRender = true
      })
    },
    methods: {
      changeSelect(selectList) {
        let result = []
        // 查询是否有新增数据
        let newData = null
        selectList.forEach((item) => {
          if (!this.privateSeletData.find((it) => it.id === item.id)) {
            newData = item
          }
        })
        // 查询删除数据
        if (!newData) {
          let delData = null
          this.privateSeletData.forEach((item) => {
            if (!selectList.find((it) => it.id === item.id)) {
              delData = item
            }
          })
          this.childSelect.forEach((item) => {
            if (item.id !== delData.id) {
              result.push(item)
            }
          })
        } else {
          result = [...this.childSelect, newData]
        }
        this.$emit('changeChildSelect', JSON.parse(JSON.stringify(result)))
        this.privateSeletData = selectList
      }
    },
    watch: {
      childSelect(newVal) {
        console.log(3)
        if (newVal.length === 0 && this.isRender) {
          let objData = this.$refs.tableChild.objData
          this.privateSeletData = []
          for (const k in objData) {
            let findData = this.childSelect.find((item) => objData[k].id === item.id)
            if (objData[k]._isChecked) {
              if (findData) {
                this.privateSeletData.push(findData)
              }
              objData[k]._isChecked = false
            }
          }
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .render-child-cell {
    /deep/ .ivu-table-wrapper {
      border: 0;
    }

    /deep/ .ivu-table-row .ivu-table-column-center:last-child {
      border-right: 0;
    }

    /deep/ .ivu-table-body.ivu-table-overflowX {
      overflow-x: hidden
    }

    .href {
      cursor: pointer;
      color: #2d8cf0;

      &:hover {
        color: #57a3f3;
      }
    }
    /deep/ .child-table-item {
      background-color: #99c3ef;
    }
  }
</style>
