<template>
  <transition name="fade" v-on:after-leave="afterLeave">
    <span class="notifiction" v-show="show">{{title}}</span>
  </transition>
</template>
<script>
export default {
  props: ['title'],
  data(){
    return {
      show: false
    }
  },
  mounted() {
    this.show = true;
    const timer = setTimeout(() => {
      this.show = false;
    }, 2000);
  },
  methods: {
    afterLeave() {
      this.$destroy();
      this.$el.remove();
    }
  }
  
}
</script>
<style scoped lang="stylus">
.notifiction
  position fixed
  width calc(100% - 100px)
  left 50px
  bottom 50px
  padding 15px 0
  background rgba(0, 0, 0, 0.6)
  font-size 15px
  text-align center
  color #fff
  border-radius 5px
  word-wrap nowrap
  overflow hidden
</style>