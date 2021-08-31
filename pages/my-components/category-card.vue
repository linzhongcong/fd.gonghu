<template>
  <div class="card">
    <div class="ivu-card left">
      <slot name="left"></slot>
    </div>
    <div class="ivu-card right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less">
.card {
  display: flex;
  background: #fff;
  border: 1px solid #e8eaec;
  border-radius: 4px;
  font-size: 14px;
  position: relative;
  transition: all .2s ease-in-out;
  padding: 16px;
  &:hover {
    box-shadow: 0 1px 6px rgba(0,0,0,.1);
    border-color: #eee;
  }
  .left {
    flex: 0 0 27%;
    max-width: 27%;
    border: 1px solid #e8eaec;
    background-image: none;
    margin-right: 2%;
    padding: 8px;
    overflow: auto;
  }
  .right {
    flex: 0 0 71%;
    border: 1px solid #e8eaec;
    padding: 8px;
    overflow: auto;
  }
}
</style>