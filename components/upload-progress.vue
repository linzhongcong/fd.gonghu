<template>
  <Upload
    :action="action"
    :headers="headers"
    :multiple="multiple"
    :paste="paste"
    :disabled="disabled"
    :data="data"
    :name="name"
    :with-credentials="withCredentials"
    :show-upload-list="showUploadList"
    :type="type"
    :accept="accept"
    :format="format"
    :max-size="maxSize"
    :before-upload="beforeUpload"
    :on-progress="onProgressFn"
    :on-success="onSuccessFn"
    :on-error="onError"
    :on-preview="onPreview"
    :on-remove="onRemove"
    :on-format-error="onFormatError"
    :on-exceeded-size="onExceededSize"
    :default-file-list="defaultFileList"
    ref="upload"
    >
    <slot></slot>
  </Upload>
</template>

<script>
  /**
   * 上传中间件， 用于修改iview上传进度条后台未接收完就百分百的问题
  */
  // 每次增加最大最小值
  const max = 3;
  const min = 1;
  export default {
    mounted () {
      this.$nextTick(() => {
        this.$refs.upload.handleProgress = (e, file) => {
          const _file = this.$refs.upload.getFile(file);
          this.$refs.upload.onProgress(e, _file, this.$refs.upload.fileList);
        }
      })
    },
    props: {
      action: String,
      headers: {
        type: Object,
        default() { return {} }
      },
      multiple: {
        type: Boolean,
        default: false
      },
      paste: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      data: Object,
      name: {
        type: String,
        default: 'file'
      },
      withCredentials: {
        type: Boolean,
        default: false
      },
      showUploadList: {
        type: Boolean,
        default: true
      },
      type: {
        type: String,
        default: 'select'
      },
      accept: String,
      format: {
        type: Array,
        default() { return [] }
      },
      maxSize: Number,
      beforeUpload: Function,
      onProgress: Function,
      onSuccess: Function,
      onError: Function,
      onPreview: Function,
      onRemove: Function,
      onFormatError: Function,
      onExceededSize: Function,
      defaultFileList: Array
    },
    methods: {
      onProgressFn (event, file, fileList) {
        this.stageFirst(file)
        event.target.onprogress = (event) => {}
      },
      // 第一阶段
      stageFirst (file) {
        let percentage = 0;
        file.timerSecond = null;
        file.timerThird = null;
        file.timerTimeoutFirst = null;
        file.timerTimeoutSecond = null;
        file.timerFirst = setInterval(() => {
          let random = Math.random() * (max - min) + min;
          percentage += random
          file.percentage = percentage;
          if (percentage > 35) {
            // 停止第一阶段
            clearInterval(file.timerFirst)
            // 进入第一个停止阶段
            file.timerTimeoutFirst = setTimeout(() => {
              // 开始第二阶段
              this.stageSecond(file)
            }, 15000);
          }
        }, 500) 
      },
      // 第二阶段
      stageSecond (file) {
        let percentage = file.percentage;
        file.timerSecond = setInterval(() => {
          let random = Math.random() * (max - min) + min;
          percentage += random
          file.percentage = percentage;
          if (percentage > 75) {
            // 停止第二阶段
            clearInterval(file.timerSecond)
            // 进入第二个停止阶段
            file.timerTimeoutSecond = setTimeout(() => {
              // 开始第三阶段
              this.stageThird(file)
            }, 20000);
          }
        }, 500)
      },
      // 第三阶段
      stageThird (file) {
        let percentage = file.percentage;
        file.timerThird = setInterval(() => {
          let random = Math.random() * (max - min) + min;
          percentage += random
          if (percentage > 99) {
            percentage = 99
            // 停止第三阶段
            clearInterval(file.timerThird)
          }
          file.percentage = percentage;
        }, 500)
      },
      onSuccessFn (res, file, fileList) {
        clearInterval(file.timerFirst)
        clearInterval(file.timerSecond)
        clearInterval(file.timerThird)
        clearTimeout(file.timerTimeoutFirst)
        clearTimeout(file.timerTimeoutSecond)
        file.timerFirst = null;
        file.timerSecond = null;
        file.timerThird = null;
        file.timerTimeoutFirst = null;
        file.timerTimeoutSecond = null;
        if (res.code === 0) {
          file.percentage = 100;
          file.status = 'finished'
        }
        setTimeout(() => {
          this.onSuccess(res, file, fileList)
        }, 500);
      }
    }
  }
</script>

<style lang="less" scoped>

</style>