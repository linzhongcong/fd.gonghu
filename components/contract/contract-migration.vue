<template>
  <div class="contract-migration">
    <Modal
      v-model="show"
      class-name="contract-migration-modal"
      :mask-closable="!submitLoading"
    >
      <template #header>
        <div class="ivu-modal-header-inner">合作商迁移合作客户</div>
      </template>
      <div class="content">是否将<span class="contract-name">{{ contractInfo.merchantName }}</span>迁入合作客户</div>
      <template #footer>
        <Button @click="closeModal()">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="onSubmit">确定</Button>
      </template>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'contract-migration-modal',
  data() {
    return {
      show: false, // 弹窗是否展示
      submitLoading: false, // 确定loading

      contractInfo: {}, // 合作商信息
    }
  },
  methods: {
    /**
     * 合作商迁移
     * @param {Number|String} id: 合作商id
     */
    async migration(id) {
      this.submitLoading = true;
      try {
        const { code } = await this.$api.contractorMigration(id);
        if (code === 0) {
          this.$Message.success('迁移成功!');
          this.closeModal(true);
          this.$emit('on-success');
        }
      } catch (error) {}
      this.submitLoading = false;
    },

    /**
     * 初始化弹窗
     * @param {Object} data: 初始化弹窗传入Object
     * @param {Object} data.data: 当前合作商数据
     */
    initModal({ data }) {
      data = JSON.parse(JSON.stringify(data));
      this.contractInfo = data;
      this.show = true;
    },

    /**
     * 关闭弹窗
     * @param {Boolean} force: 是否强制关闭弹窗
     */
    closeModal(force = false) {
      if (!force && this.submitLoading) return false;

      this.show = false;
    },

    /**
     * 确定
     */
    onSubmit() {
      const { id } = this.contractInfo;
      this.migration(id);
    }
  },
}
</script>

<style lang="less" scoped>
.contract-migration-modal {
  .ivu-modal-header-inner {
    display: inline-block;
    width: 100%;
    height: 20px;
    line-height: 20px;
    font-size: 16px;
    color: #17233d;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 700;
  }
  .content {
    text-align: center;
    font-size: 15px;
    .contract-name {
      color: #2d8cf0;
      font-weight: 700;
      margin: 0 10px;
    }
  }
}
</style>