<template>
  <div class="order-invalid">
    <Modal
      class-name="order-audit-modal"
      width="600"
      :value="show"
      :closable="false"
      :mask-closable="true"
      @on-cancel="handleOnCancel"
    >
      <div>
        <Form :label-width="100">
          <FormItem label="作废说明：">
            <Input type="textarea" v-model="invalidReason" />
          </FormItem>
          <FormItem label="作废确认：">
            <Checkbox v-model="isAgree">已确认作废</Checkbox>
            <div class="ivu-form-item-error-tip">备注：确认作废提交后，订单流程将终止，且状态无法改变!</div>
          </FormItem>
        </Form>
      </div>

      <div slot="footer">
        <Button @click="handleOnCancel">取消</Button>
        <Button type="primary" :loading="submitting" @click="handleOnOk">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'order-invalid',
  props: {
    show: { // 展示
      type: Boolean,
      default: false,
    },
    id: { // 当前id
      type: String|Number,
      default: '',
    },
    submitting: { // 确认加载
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      invalidReason: '', // 作废原因
      isAgree: false,
    }
  },
  watch: {
    show(newVal, oldVal) {
      if (newVal) {
        this.invalidReason = '';
        this.isAgree = false;
      }
    },
  },
  methods: {
    // 确认
    handleOnOk() {
      const { id, invalidReason, isAgree } = this;
      if (!isAgree) return this.$Message.warning('请先同意作废!');
      this.$emit('on-ok', { id, invalidReason });
    },

    // 取消
    handleOnCancel() {
      this.$emit('on-cancel');
    }
  }
}
</script>

<style lang="less" scoped>

</style>