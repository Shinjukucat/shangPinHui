<template>
  <div>
    <tab-nav></tab-nav>
    <list-container></list-container>
    <recommend></recommend>
    <rank></rank>
    <like></like>
    <floor v-for="(floor) in floorList" :key="floor.id" :floorInfo="floor"></floor>
    <brand></brand>
  </div>
</template>

<script>
//引入辅助函数
import {mapState} from 'vuex';
import ListContainer from '@/views/Home/ListContainer/index.vue'
import Recommend from '@/views/Home/Recommend/index.vue'
import Rank from '@/views/Home/Rank/index.vue'
import Like from '@/views/Home/Like/index.vue'
import Floor from '@/views/Home/Floor/index.vue'
import Brand from '@/views/Home/Brand/index.vue'
export default {
  components: {
    ListContainer,
    Recommend,
    Rank,
    Like,
    Floor,
    Brand
  },
  //Home组件的组件挂载完毕，生命周期函数，通过Vuex发请求，获取Floor组件数据
  mounted(){
    //父组件的生命周期函数（mounted），在这里通知Vuex发请求【获取Floor组件需要的数据】
    //由于Home父组件的mounted中通知Vuex发请求，请求回来以后，Floor组件才遍历出来。
    //当父组件的mounted执行的时候，Floor组件可能没有遍历完毕
    this.$store.dispatch('getFloorList')
  },
  //计算属性
  computed:{
    ...mapState({
       floorList: state => state.home.floorList
    })
  }
}
</script>

<style>

</style>