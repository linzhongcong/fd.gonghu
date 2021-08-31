<template>
  <div>
    <div class="hide-bottom-box"></div>
    <div class="bottom-box">
      <div class="btn-box">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
  }
</script>

<style lang="less" scoped>
.hide-bottom-box{
  height: 60px;
  width: 100%;
}
.bottom-box{
  position: fixed;
  bottom: 0;
  z-index: 5;
  right: 0;
  height: 60px;
  width: 100%;
  box-shadow: 4px -4px 4px #eee;
  background: #fff;
  .btn-box{
    position: absolute;
    right: 45px;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
