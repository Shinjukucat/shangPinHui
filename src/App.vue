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
  },
  mounted() {
    // 通知vuex发请求，获取数据，存储于仓库中，这样就可以实现这条请求只执行一次，不会重复执行，优化项目
    this.$store.dispatch('categoryList');
  }
}
</script>

<style lang="less" scoped>

</style>
