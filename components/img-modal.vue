<template>
  <Modal v-model="modalShow" :width="width" footer-hide @on-cancel="onClose" :closable="false">
    <a href="javascript:;" class="ivu-modal-close" @click.prevent="onClose">
      <i class="ivu-icon ivu-icon-ios-close"></i>
    </a>
    <div class="content">
      <Icon v-show="(index !== 0) && !imgLoading" class="left" type="ios-arrow-back" size="32" @click="handlePrev"/>
      <Icon v-show="(index !== imgArr.length - 1) && !imgLoading" class="right" type="ios-arrow-forward" size="32" @click="handleNext"/>
      <div class="content-img">
        <div :class="imgLoading ? 'loading' : 'close-loading'">
          <Spin :class="!imgLoading && 'close-spin'" fix size="large"></Spin>
        </div>
        <img id="img" :src="imgArr[index]" alt="">
      </div>
      <div class="origin">
        <a class="origin-img" v-show="!imgLoading" @click.prevent="showOriginImg(imgArr[index])">查看原图</a>
      </div>
    </div>
  </Modal>
</template>

<script>
export default {
  /**
   * author: liruiyong
   * version: 1.0.1
   * 全局模块 - 大图查看
   * 外部传入参数：
   *  show : 当前弹窗的显示/关闭
   *  imgArr : 格式化后的数组，数组可使用map返回一个新数组，数组形式 [url, url, url]
   *  imgIndex : 展开的图片的下标，需与数组对应
   *  width : 展开的弹窗宽度（可选项）
   * 外部关闭弹窗自定义指令
   *  closeImgModal : 
   *   点击关闭按钮或者遮罩区域。关闭当前图片查看弹窗，触发父级函数
   *   返回值为一个对象(Object), options: show, index, arr
   *   可直接在外部解构使用 show, index, arr 重置数据
   */
  props: {
    show: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '700'
    },
    imgIndex: {
      type: Number,
      default: 0
    },
    imgArr: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      img: '',
      index: 0,
      modalShow: false,
      imgLoading: true,
    }
  },
  watch: {
    show(newVal, oldVal) {
      this.modalShow = newVal
    },
    imgIndex(newVal, oldVal) {
      this.index = newVal
    }
  },
  methods: {
    /**
     * 切换上一张
     */
    handlePrev() {
      this.img.src = ''
      this.img.src = this.imgArr[--this.index]
      this.imgLoading = true
    },

    /**
     * 切换下一张
     */
    handleNext() {
      this.img.src = ''
      this.img.src = this.imgArr[++this.index]
      this.imgLoading = true
    },

    /**
     * 关闭模态框
     */
    onClose() {
      this.index = 0
      this.imgLoading = true
      this.$emit('closeImgModal', { show: false, index: 0, arr: [] })
    },

    /**
     * 查看原图
     */
    showOriginImg(url) {
      window.open(url)
    }
  },
  mounted() {
    this.img = document.getElementById('img')
    this.img.onload = () => {
      this.imgLoading = false
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  padding: 25px 16px 0;
  .left {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    cursor: pointer;
  }
  .right{
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    cursor: pointer;
  }
  .content-img {
    width: 100%;
    position: relative;
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
    .loading {
      width: 100%;
      height: 100%;
      position: absolute;
      background-color: #fff;
      top: 0;
      left: 0;
      opacity: 1;
    }
    .close-loading {
      opacity: 0;
      transition: all .2s linear;
      .ivu-spin-fix {
        height: 0;
        background-color: transparent;
        transition: all .2s linear;
        /deep/ .ivu-spin-main {
          display: none;
        }
      }
    }
  }
  .origin {
    position: absolute;
    left: 50%;
    bottom: -50px;
    transform: translateX(-50%);
    a {
      padding: 10px 16px;
      border-radius: 4px;
      background-color: rgba(0, 0, 0, .4);
      color: #ddd;
      letter-spacing: 1px;
      &:hover {
        transition: all .2s linear;
        background-color: rgba(0, 0, 0, .6);
        color: #fff;
      }
    }
  }
}
</style>