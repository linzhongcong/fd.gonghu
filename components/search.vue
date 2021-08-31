<template>
  <div @click.stop style="display: inline-block; width: 100%;" ref="root">
    <div class="ivu-input-wrapper ivu-input-wrapper-default ivu-input-type" v-if="!multiple">
      <div class="ivu-input-inner-container" ref="input">
        <input
        :style="clearable?'padding-right: 2em':''"
        @focus="_foucusInput"
        @blur="_blurInput"
        @input="_changeQuery"
        class="ivu-input ivu-input-default"
        type="text"
        :placeholder="placeholder"
        v-model="searchTxt"
        :disabled="disabled">
        <i @click="clearSingleSelect" v-if="clearable" class="ivu-icon ivu-icon-ios-close-circle ivu-select-arrow"></i>
      </div>
      <transition name="list">
        <div class="ivu-select-dropdown" v-show="isShowList && firstSearch" ref="list"
             :style="isListPositionTop ? 'top: unset; bottom: 100%' : ''">
          <ul class="ivu-select-not-found" v-show="!list.length || loading || lazyLoading">
            <li v-show="!list.length && !loading && !lazyLoading">{{notFoundText}}</li>
            <li v-show="loading || lazyLoading">{{loadingText}}</li>
          </ul>
          <ul class="ivu-select-dropdown-list" v-show="list.length && !loading && !lazyLoading">
            <li
            class="ivu-select-item"
            :class="item[listValue] === value ? 'ivu-select-item-selected ivu-select-item-focus' : ''"
            v-for="(item,index) in list"
            :key="index" @click="_choseItem(index)"
            >{{item[listLabel]}}
            </li>
          </ul>
        </div>
      </transition>
    </div>
    <div class="ivu-select ivu-select-multiple ivu-select-default" v-if="multiple" style="position:relative;">
      <div class="ivu-select-selection" @click="_muGetFocus" style="cursor:text;" ref="input">
        <div class="ivu-tag ivu-tag-checked" @click.stop v-for="(item, index) in selectList" :key="index">
          <span class="ivu-tag-text">{{item[listLabel]}}</span>
          <i class="ivu-icon ivu-icon-ios-close" @click="_muDelItem(index)"></i>
        </div>
        <input
        ref="muInput"
        class="ivu-select-input"
        type="text"
        style="cursor:text"
        v-model="searchTxt"
        @click.stop
        @focus="_foucusInput"
        @input="_changeQuery"
        :style="!value.length?'width: 100%':'width:' + (searchTxt.length?searchTxt.length*1 + 1:2) + 'em'">
        <i @click.stop="clearSingleSelect" v-if="clearable"
           class="ivu-icon ivu-icon-ios-close-circle ivu-select-arrow"></i>
      </div>
      <transition name="list">
        <div class="ivu-select-dropdown" style="width:100%;" v-show="isShowList && firstSearch" ref="list">
          <ul class="ivu-select-not-found" v-show="!list.length || loading || lazyLoading">
            <li v-show="!list.length && !loading && !lazyLoading">{{notFoundText}}</li>
            <li v-show="loading || lazyLoading">{{loadingText}}</li>
          </ul>
          <ul class="ivu-select-dropdown-list" v-show="list.length && !loading && !lazyLoading">
            <li
            class="ivu-select-item"
            :class="item.isSelect ? 'ivu-select-item ivu-select-item-selected' : ''"
            v-for="(item,index) in muList"
            :key="index" @click="_muSelectItem(index)"
            >{{item[listLabel]}}
            </li>
          </ul>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
  /**
   * 一、prop(*号必传)
   *  1.与iview相同
   *   *@prop {any}      value (同iview):  指定选中项目的 value 值，可以使用 v-model 双向绑定数据。多选时只接受 Array
   *   *@prop {Function} remoteMethod/remote-method (同iview):  远程搜索的方法
   *   @prop {Boolen}    multiple (同iview):  是否支持多选
   *   @prop {Boolen}    disabled (同iview):  是否禁用
   *   @prop {Boolen}    clearable (同iview,单选多选都有效):  是否可以清空选项
   *   @prop {Boolen}    loading (同iview):  当前是否正在远程搜索
   *   @prop {String}    loadingText/loading-text (同iview):  远程搜索中的文字提示
   *   @prop {String}    notFoundText/not-found-text (同iview):  当下拉列表为空时显示的内容
   *   @prop {String}    placeholder (同iview):  当下拉列表为空时显示的内容
   *  2.不同
   *   *@prop  {Array}   list:  下拉列表内容，同iview的Option组件遍历的数组
   *   *@prop  {String}  listValue/list-value:  下拉列表内容选项值(即选中绑定给value的值)，同iview的Option组件的value
   *   @prop  {String}   lisLabel/list-label:  下拉列表内战展示内容，同iview的Option组件的label/展示内容, 默认与value相同。
   *   @prop  {Boolean}  autoSearch/auto-search: 外部赋值value是否自动搜索, 默认为true
   *   @prop  {Number}   lazyTime/lazy-time: 模糊搜索延迟时间（毫秒）
   *
   * 二、events
   *  @event on-change  value改变时触发
   *  @event on-select  点击选中某项时触发
   *
   * 三、methods
   *  @method clearSingleSelect 清空value
   *  @method getSelectObj      获取当前选中对象  即list数组选中的一整个对象，多选则返回选中的多个对象构成数组
   *  @method search            外部调用搜索
   *      @param {string} query 搜索的参数
   */
  import AsyncValidator from 'async-validator';

  export default {
    name: 'Input',
    props: {
      value: {
        required: true
      },
      remoteMethod: {
        type: Function,
        required: true
      },
      list: {
        type: Array,
        required: true
      },
      listValue: {
        type: String,
        required: true
      },
      listLabel: {
        type: String,
        default() {
          return this.listValue;
        }
      },
      autoSearch: {
        type: Boolean,
        default: true
      },
      clearable: {
        type: Boolean,
        default: false
      },
      loading: {
        type: Boolean,
        default: false
      },
      loadingText: {
        type: String,
        default: '加载中'
      },
      notFoundText: {
        type: String,
        default: '无匹配数据'
      },
      multiple: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      placeholder: {
        type: String,
        default: ''
      },
      lazyTime: {
        type: Number,
        default: 300
      }
    },
    created() {
      if (this.multiple) {
        window.addEventListener('click', this._muCloseList);
      }
    },
    mounted() {
      // 多级遍历第一次进来value直接有值  强制调用value的watch一次
      if (!this.firstSearch && this.value) {
        setTimeout(() => {
          if (!this.firstSearch) {
            this.firstSearch = true;
            if (this.multiple) {
              // 检测value赋值给selectList
              this._muSearchOption();
            } else {
              // 检测value赋值searchTxt和selectItem
              this._searchOption();
            }
            if (this.innerAssign) {
              // 内部赋值
              this.innerAssign = false;
              return;
            }
            if (this.autoSearch) {
              // 赋值自动搜索
              clearTimeout(this.timer)
              this.remoteMethod(this.value);
            } else {
              // 赋值不自动搜索
              if (this.list.length) {
                this._searchOption();
              }
            }
          }
        }, 300);
      }
    },
    beforeDestroy() {
      if (this.multiple) {
        window.removeEventListener('click', this._muCloseList);
      }
    },
    data() {
      return {
        searchTxt: '',
        selectItem: null,
        selectList: [],
        isShowList: false,
        firstSearch: false,
        isFocus: false,
        innerAssign: false,
        innerSearchTxt: false,
        waitSearch: false,
        isManualSearch: false,
        isListPositionTop: false,
        lazyLoading: false,
        timer: null
      };
    },
    methods: {
      // 清除搜索
      clearSingleSelect() {
        this.innerAssign = true;
        this.searchTxt = '';
        this.selectItem = null
        if (this.multiple) {
          this.$emit('input', []);
        } else {
          this.$emit('input', null);
        }
        this.dispatch();
      },
      // 获取当前选中对象
      getSelectObj() {
        return JSON.parse(JSON.stringify(this.selectItem));
      },
      // 外部调用搜索
      search(query) {
        if (!query) return;
        this.searchTxt = query;
        this.isManualSearch = true;
        this._changeQuery(null, query);
      },
      // 改变搜索词语
      _changeQuery(e, query) {
        if (!this.firstSearch) {
          this.firstSearch = true;
        }
        let searchTxt = query || this.searchTxt;
        if (!searchTxt) {
          return;
        }
        this.innerSearchTxt = false;
        if (!query) {
          this.isShowList = true;
        }
        clearTimeout(this.timer)
        this.lazyLoading = true;
        this.timer = setTimeout(() => {
          this.remoteMethod(searchTxt);
          this.lazyLoading = false;
        }, this.lazyTime);
      },
      // 选择
      _choseItem(i) {
        this.innerAssign = true;
        this.selectItem = this.list[i];
        this.searchTxt = this.selectItem[this.listLabel];
        this.$emit('on-select', this.list[i][this.listValue]);
        this.$emit('input', this.list[i][this.listValue]);
      },
      // 从list中寻找符合value赋值给searchTxt和searchItem
      _searchOption() {
        if (!this.value) {
          this.selectItem = null;
          this.searchTxt = '';
          return;
        }
        let selectItem = this.list.find(item => item[this.listValue] === this.value);
        if (selectItem) {
          this.selectItem = selectItem;
          this.searchTxt = selectItem[this.listLabel];
        }
      },
      // 失去焦点
      _blurInput() {
        this.isFocus = false;
        this.isShowList = false;
        if (this.selectItem) {
          this.searchTxt = this.selectItem[this.listLabel];
        } else {
          this.searchTxt = ''
        }
      },
      // 触发父FormItem验证
      dispatch() {
        let parent = this.$parent || this.$root;
        let name = parent.$options.name;

        if (parent.$options.name !== 'FormItem') return;

        let formRules = parent.FormInstance.rules;
        let selfRules = parent.rules;
        formRules = formRules ? formRules[parent.prop] : [];
        let rules = [].concat(selfRules || formRules || [])
        if (!rules || rules.length === 0) {
          if (!this.required) {
            return true;
          } else {
            rules = [{required: true}];
          }
        }
        parent.validateState = 'validating';
        let descriptor = {};
        descriptor[parent.prop] = rules;
        const validator = new AsyncValidator(descriptor);
        let model = {};
        model[parent.prop] = parent.fieldValue;
        validator.validate(model, {firstFields: true, suppressWarning: true}, errors => {
          parent.validateState = !errors ? 'success' : 'error';
          parent.validateMessage = errors ? errors[0].message : '';
          callback(parent.validateMessage);
          parent.FormInstance && parent.FormInstance.$emit('on-validate', parent.prop, !errors, parent.validateMessage || null);
        });
        parent.validateDisabled = false;
      },
      // 获得焦点
      _foucusInput(e) {
        this.isFocus = true;
        if (this.list.length && this.firstSearch) {
          this._getBottomHeight();
          this.isShowList = true;
        }
      },
      // 多选点击外框强制获得焦点
      _muGetFocus() {
        this.$refs.muInput.focus();
        let txt = this.searchTxt;
        this.searchTxt = '';
        setTimeout(() => {
          this.searchTxt = txt;
        }, 1);
      },
      // 多选删除某项
      _muDelItem(i) {
        let result = this.value.filter((item, index) => {
          return index !== i;
        });
        this.selectList = this.selectList.filter((item, index) => {
          return index !== i;
        });
        this.innerAssign = true;
        this.$emit('input', result);
        this.$emit('on-select', result);
      },
      // 多选选中某项
      _muSelectItem(i) {
        let itemIndex = null;
        this.innerAssign = true;
        let hasItem = this.selectList.find((item, index) => {
          if (item[this.listValue] === this.list[i][this.listValue]) {
            itemIndex = index;
          }
          return item[this.listValue] === this.list[i][this.listValue];
        });
        if (hasItem) {
          this.selectList.splice(itemIndex, 1);
        } else {
          this.selectList.push(this.list[i]);
        }
        let result = this.selectList.map(item => item[this.listValue]);
        this.$emit('input', result);
        this.$emit('on-select', result);
      },
      // 多选从list中寻找符合value赋值给searchList
      _muSearchOption() {
        let selectList = this.list.filter(item => {
          return this.value.find(sItem => sItem === item[this.listValue]);
        });
        let newArr = [];
        selectList.forEach((item) => {
          if (!this.selectList.find(sItem => item[this.listValue] === sItem[this.listValue])) {
            newArr.push(item);
          }
        });
        this.selectList = [...this.selectList, ...newArr];
      },
      _muCloseList() {
        this.isShowList = false;
      },
      // 获取高度并设置下拉框往上或者往下
      _getBottomHeight() {
        setTimeout(() => {
          try {
            let computedObj = this.$refs.list.getBoundingClientRect()
            let inputObj = this.$refs.input.getBoundingClientRect()
            let offWinBottom = this._getClientHeight() - (inputObj.top - this._getScrollTop() + inputObj.height);
            let offElementHeight = 200;
            if (offElementHeight > offWinBottom) {
              // 向上
              if (!this.isListPositionTop) {
                this.isListPositionTop = true
              }
            } else {
              // 向下
              if (this.isListPositionTop) {
                this.isListPositionTop = false
              }
            }
          } catch (err) {
            console.log('浏览器不支持getBoundingClientRect')
          }
        }, 100);
      },
      // 获取滚动条卷去高度
      _getScrollTop() {
        var scrollTop = 0;
        if (document.documentElement && document.documentElement.scrollTop) {
          scrollTop = document.documentElement.scrollTop;
        } else if (document.body) {
          scrollTop = document.body.scrollTop;
        }
        return scrollTop;
      },
      // 获取视窗高度
      _getClientHeight() {
        var clientHeight = 0;
        if (document.body.clientHeight && document.documentElement.clientHeight) {
          var clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
        } else {
          var clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
        }
        return clientHeight;
      }
    },
    watch: {
      list(newVal, oldVal) {
        if (newVal.length) {
          // list有长度
          this._getBottomHeight();
          if (this.multiple) {
            // 检测value赋值给selectList
            this._muSearchOption();
          } else {
            // 手动调用search触发on-change
            if (this.isManualSearch) {
              this.isManualSearch = false;
              this._searchOption();
              this.$emit('on-change', this.value);
            }
            // 检测value赋值searchTxt和selectItem
            if (this.innerSearchTxt) {
              this.innerSearchTxt = false;
              this._searchOption();
            }
          }
        }
      },
      value(newVal, oldVal) {
        // 外部赋值
        if (!this.firstSearch) {
          this.firstSearch = true;
          if (!newVal) return
        }
        if (newVal) {
          this.dispatch();
        }
        if (this.multiple) {
          // 检测value赋值给selectList
          this._muSearchOption();
        } else {
          // 检测value赋值searchTxt和selectItem
          this._searchOption();
        }
        this.$emit('on-change', newVal);
        if (this.innerAssign) {
          // 内部赋值
          return;
        }
        this.innerSearchTxt = true;
        if (this.autoSearch) {
          // 赋值自动搜索
          clearTimeout(this.timer)
          this.remoteMethod(this.value);
        } else {
          // 赋值不自动搜索
          if (this.list.length) {
            this._searchOption();
          }
        }
      },
      loading() {
        this._getBottomHeight()
      }
    },
    computed: {
      muList() {
        let list = this.list;
        let value = this.value;
        if (!this.multiple) return '';
        list = JSON.parse(JSON.stringify(list)) || [];
        list.forEach((item) => {
          if (value.find(sItem => sItem === item[this.listValue])) {
            item.isSelect = true;
          }
        });
        let otherList = this.selectList.filter((item) => {
          let isHas = !list.find(sItem => item[this.listValue] === sItem[this.listValue])
          if (isHas) {
            item.isSelect = true;
            return isHas;
          }
        }) || [];
        return [...otherList, ...list];
      }
    }
  };
</script>

<style lang="less" scoped>
  .list-enter-active, .list-leave-active {
    transition: .3s all;
  }

  .list-enter-to, .list-leave {
    opacity: 1;
  }

  .list-enter, .list-leave-to {
    opacity: 0;
  }

  .fade-enter-active, .fade-leave-active {
    transition: .3s all;
  }

  .fade-enter-to, .fade-leave {
    opacity: 1;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  .ivu-input-inner-container .ivu-icon {
    cursor: pointer;
    display: none;
  }

  .ivu-input-inner-container:hover .ivu-icon {
    display: block;
  }

  .ivu-select-selection > .ivu-icon {
    cursor: pointer;
    display: none;
  }

  .ivu-select-selection:hover > .ivu-icon {
    display: block;
  }
</style>
