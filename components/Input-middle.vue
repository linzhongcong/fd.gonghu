<template>
  <Input
    ref="input"
    v-bind="{...$props, ...$attrs}"
    :value="value"
    @input="input"
    @on-enter="enter"
    @on-click="() => {$emit('on-click')}"
    @on-change="e => {$emit('on-change', e)}"
    @on-focus="() => {$emit('on-focus')}"
    @on-blur="blur"
    @on-keyup="e => {$emit('on-keyup', e)}"
    @on-keydown="e => {$emit('on-keydown', e)}"
    @on-keypress="e => {$emit('on-keypress', e)}"
    @on-search="value => {$emit('on-search', value)}"
    @on-clear="() => {$emit('on-clear')}">
      <slot name="prepend" slot="prepend" />
      <slot name="append" slot="append" />
      <slot name="prefix" slot="prefix" />
      <slot name="suffix" slot="suffix" />
    </Input>
</template>

<script>
  /**
   * @author shenyipeng
   * 用于给iview Input 默认拥有trim效果的中间件，原理是直接覆盖原iview做中间件作用。
   * 注：事件和插槽均为写死，如iview更新了新的事件/插槽，需要手动在组建添加（如果有大佬能优化也请抢救一下）
  */
  import { Input } from 'view-design';
  export default {
    props: ['value'],
    name: 'input-middle',
    methods: {
      input (value) {
        this.$emit('input', value);
      },
      blur () {
        let value = this.$refs.input.currentValue;
        if (value && typeof value !== 'number') {
          let result = value.trim();
          if (result !== value) {
            this.$emit('input', result);
          }
        }
        this.$emit('on-blur');
      },
      enter () {
        if (this.$attrs.type === 'textarea') return;
        let value = this.$refs.input.currentValue;
        if (value && typeof value !== 'number') {
          let result = value.trim();
          if (result !== value) {
            this.$emit('input', result);
          }
        }
        this.$emit('on-enter');
      }
    },
    components: {
      Input
    }
  };
</script>

<style lang="less" scoped>

</style>