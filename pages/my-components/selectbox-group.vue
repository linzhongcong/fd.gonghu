<template>
  <div class="select">
    <div :class="className">
      <div class="select-box-all">
        <Checkbox v-if="selectionList.length" :value="checkAll" @on-change="handleCheckAll">{{boxAllText}}</Checkbox>
      </div>
      <div class="select-box-option">
        <CheckboxGroup v-model="selectedData" @on-change="handleCheck">
          <div v-for="(item, index) in selectionList" :key="index">
            <Checkbox :label="item"></Checkbox>
            <slot :name="'box' + index"></slot>
          </div>
        </CheckboxGroup>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    boxAllText: {
      type: String,
      default: '全选'
    },
    className: {
      type: String,
      default: 'select-box'
    },
    selectionList: {
      type: Array,
      default() {
        return []
      }
    },
    checkedList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data(){
    return {
      checkAll: false,
      selectedData: this.checkedList
    }
  },
  methods: {
    // 全选
    handleCheckAll(state) {
      this.selectedData = state ? this.selectionList : []
      this.$emit('on-all-change', [...this.selectedData])
    },
    // 选择
    handleCheck(data) {
      if (data.length === this.selectionList.length) {
        this.checkAll = true
      } else {
        this.checkAll = false
      }
      this.$emit('on-change', data)
    }
  },
}
</script>

<style lang="less">
.select {
  padding: 16px;
  .select-box {
    display: flex;
    .select-box-all {
      margin-right: 20px;
    }
    .select-box-option {
      .ivu-checkbox-group {
        div {
          display: inline-block;
          margin-right: 16px;
          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
  }
}
</style>