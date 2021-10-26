<template>
  <div class="row-button">
    <Button v-if="!hideAdd" @click="$emit('on-add')">+</Button>
    <Button v-else @click="$emit('on-remove')">-</Button>
    <Button type="primary" @click="$emit('on-reset')">重置</Button>
  </div>
</template>

<script>
export default {
  props: {
    hideAdd: {
      type: Boolean,
      default: false,
    }
  }
}
</script>

<style lang="less" scoped>
.row-button {
  .ivu-btn {
    margin-right: 5px;
    &:last-child {
      margin-right: 0;
    }
  }
}
</style>