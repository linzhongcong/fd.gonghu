<template>
  <div class="input-search">
    <div class="search-visible">
      <Input ref="input" v-model="value" placeholder="请输入工号/姓名" @on-focus="handleFocus" @on-blur="handleBlur" @on-change="handleChange">
        <Icon type="ios-search" slot="suffix" @click="search" />
      </Input>
    </div>
    <div class="search-dropdown" :style="{ 'padding': showDropdownList || showNotFoundText || showLoadingText ? '5px 0' : '0' }">
      <ul class="search-dropdown-not-found" v-show="showNotFoundText">
        <li>无匹配数据</li>
      </ul>
      <ul class="search-dropdown-list" v-show="showDropdownList">
        <li class="search-item" v-for="(item, index) in dropdownList" :key="index">
          <Checkbox v-model="item[dropdownCheckText]" @on-change="(b) => handleCheckboxChange(b, item)">{{item[dropdownText]}}</Checkbox>
        </li>
      </ul>
      <ul class="search-dropdown-loading" v-show="showLoadingText">
        <li>加载中</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    dropdownText: {
      type: String,
      default: 'label'
    },
    dropdownList: {
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
    },
    dropdownCheckText: {
      type: String,
      default: 'isChecked'
    }
  },
  data() {
    return {
      value: '',
      dropdownArea: null,
      selection: this.checkedList,
      showNotFoundText: false,
      showLoadingText: false,
      showDropdownList: false,
      isOutSide: true,
    }
  },
  methods: {
    // 输入框获取焦点事件
    handleFocus() {
      if (this.dropdownList.length === 0) {
        this.showNotFoundText = true
      } else {
        this.showDropdownList = true
      }
    },

    // 输入框失去焦点事件
    handleBlur() {
      if(!this.isOutSide) return // 鼠标
      this.showNotFoundText = false
      this.showLoadingText = false
      this.showDropdownList = false
    },

    // 输入框文本变化事件
    handleChange() {
      this.showNotFoundText = false
      this.showDropdownList = false
      this.showLoadingText = true
      this.search()
    },

    // 点击搜索事件
    search() {
      const value = this.value
      this.$emit('on-search', value)
      this.$refs.input.$children[0].focus()
    },

    // 复选框改变事件
    handleCheckboxChange(b, row) {
      if (b) {
        this.selection.push(row)
      } else {
        this.selection.splice(this.selection.indexOf(row), 1)
      }
      this.$emit('on-select-change', [ ...this.selection ])
    },

    // 遍历选择显示
    handleErgodic() {
      let dropdownList = this.dropdownList,
          checkedList = this.checkedList,
          dropdownCheckText = this.dropdownCheckText
      dropdownList.map((item) => {
        item[dropdownCheckText] = false
        checkedList.map((checkedItem) => {
          if (item.id === checkedItem.id) {
            item[dropdownCheckText] = true
            return
          }
        })
      })
    },

    // 清除搜索词
    handleClearQueryKey() {
      this.value = ''
    }
  },
  mounted() {
    let div = document.getElementsByClassName('search-dropdown')[0]
    div.addEventListener('mouseover', (e) => {
      this.isOutSide = false
      this.$refs.input.$children[0].focus()
    })
    div.addEventListener('mouseout', e => this.isOutSide = true)
  },
  watch: {
    dropdownList(newVal, oldVal) {
      this.showNotFoundText = false
      this.showLoadingText = false
      if (newVal.length === 0) {
        !!this.value && (this.showNotFoundText = true)
      } else {
        this.showDropdownList = true
      }
      this.handleErgodic()
    },
    checkedList(newVal, oldVal) {
      this.selection = newVal
      this.handleErgodic()
    }
  }
}
</script>

<style lang="less">
.input-search {
  width: 100%;
  position: relative;
  .search-dropdown {
    width: inherit;
    min-width: 184px;
    max-height: 200px;
    overflow: auto;
    margin: 5px 0;
    padding: 5px 0;
    background-color: #fff;
    box-sizing: border-box;
    border-radius: 4px;
    box-shadow: 0 1px 6px rgba(0,0,0,.2);
    position: absolute;
    top: 32px;
    left: 0px;
    transform-origin: center top;
    will-change: top, left;
    z-index: 900;
    .search-dropdown-not-found {
      text-align: center;
      color: #c5c8ce;
    }
    .search-dropdown-loading {
      text-align: center;
      color: #c5c8ce;
    }
    .search-dropdown-list {
      min-width: 100%;
      list-style: none;
      .search-item {
        margin: 0;
        line-height: normal;
        padding: 7px 16px;
        clear: both;
        color: #515a6e;
        font-size: 14px!important;
        white-space: nowrap;
        list-style: none;
        cursor: pointer;
        transition: background .2s ease-in-out;
        &:hover {
          background: #f3f3f3;
        }
      }
    }
  }
}
</style>