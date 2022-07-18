<template>
  <div>
    <Header></Header>
    <!-- 路由组件的入口 -->
    <router-view></router-view>
    <!-- 动态显示Footer组件，因为有些页面不需要Footer这个非路由组件 -->
    <Footer v-show="this.$route.meta.show"></Footer>
  </div>
</template>

<script>
import Header from '@/components/Header'
import Footer from '@/components/Footer'
export default {
  data() {
    return {
      
    }
  },
  components: {
    Header,
    Footer
  }
}
</script>

<style lang="less" scoped>

</style>
