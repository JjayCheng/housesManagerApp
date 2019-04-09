<template>
  <div class="actionbar">
    <i class="iconfont icon-back" @click="$emit('back')"></i>
    <span class="title">{{title}}</span>
  </div>
</template>
<script>
export default {
  props: ['title']
}
</script>
<style scoped lang="stylus">
.actionbar
  position relative
  width 100%
  height 40px
  background skyblue
  color #fff
  text-align center
  line-height 40px
  .title
    font-size 18px
  .icon-back
    position absolute
    left 0
    display inline-block
    height 40px
    width 40px
    font-size 25px
</style>