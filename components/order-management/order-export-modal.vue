<template>
  <div class="order-export">
    <Modal
      class-name="order-export-modal"
      title="导出数据"
      :value="show"
      :mask-closable="true"
      @on-cancel="handleOnCancel"
    >
      <Form ref="form1" :model="formData" :rules="formDataRules" :label-width="100">
        <FormItem label="下单时间">
          <DatePicker type="daterange" v-model="formData.orderTime" placeholder="开始时间和结束时间"></DatePicker>
        </FormItem>
        <FormItem label="处理状态" prop="disposeStatus">
          <Select v-model="formData.disposeStatus">
            <Option v-for="(item, index) in disposeStatusOptions" :value="item.value" :label="item.label" :key="`disposeStatusOptions${index}`"></Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="handleOnCancel">取消</Button>
        <Button type="primary" :loading="submitting" @click="handleOnOk">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'order-export-modal',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    submitting: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      formData: {
        orderTime: [],
        disposeStatus: '',
        kind: 'common',
      },
      formDataRules: {
        disposeStatus: [{ required: true, message: '该选项不能为空', trigger: 'change' }]
      },

      // 选项
      disposeStatusOptions: [
        { value: 'undisposed', label: '未处理' },
        { value: 'disposed', label: '已处理' },
        { value: 'exception_handling', label: '异常处理' },
      ],
    }
  },
  watch: {
    show(newVal, oldVal) {
      if (newVal) {
        this.formData.orderTime = [];
        this.$refs.form1.resetFields();
      }
    }
  },
  methods: {
    // 确认
    handleOnOk() {
      this.$refs.form1.validate((valid) => {
        console.log(valid)
        if (valid) {
          let data = JSON.parse(JSON.stringify(this.formData));
          const [ startTime, endTime ] = data.orderTime;
          !!startTime && (data.startTime = this.formatDate(new Date(startTime).getTime() / 1000));
          !!endTime && (data.endTime = this.formatDate(new Date(endTime).getTime() / 1000));
          
          this.$emit('on-ok', data);
        }
      })
    },

    // 取消
    handleOnCancel() {
      this.$emit('on-cancel');
    },

    // 格式化日期
    formatDate(time, type = 'yyyy-MM-dd') {
      return this.$format(time, type);
    },
  }
}
</script>

<style lang="less" scoped>
.order-export-modal {
  .ivu-select,
  .ivu-date-picker {
    width: 200px;
  }
}
</style>