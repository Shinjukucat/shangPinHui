<template>
  <div class="spec-preview">
    <img :src="imgObj.imgUrl" />
    <!-- 外面的框框 可放大区域 添加事件区域 -->
    <div class="event" @mousemove="handel"></div>
    <!-- 放大的大图区域 -->
    <div class="big">
      <img :src="imgObj.imgUrl" ref="bigImg" />
    </div>
    <!-- 蒙版 遮罩层 绿色框框区域 -->
    <div class="mask" ref="mask"></div>
  </div>
</template>

<script>
  export default {
    name: "Zoom",
    data() {
      return {
        nowIndex: 0
      }
    },
    props: ['skuImageList'],
    computed: {
      imgObj() {
        return this.skuImageList[this.nowIndex] || {}
      }
    },
    mounted() {
      // 全局事件总线：获取兄弟组件穿过来的索引值
      this.$bus.$on('getIndex', (index) => {
        this.nowIndex = index
      })
    },
    methods: {
      handel(event) {
        // event是浏览器监听的鼠标事件，鼠标的时时刻刻的位置信息
        // console.log(event)
        let mask = this.$refs.mask;
        let bigImg = this.$refs.bigImg;
        // 用鼠标现在距离外面框框左侧的距离减去绿色框框的宽度的一半，计算鼠标的实时位置
        let left = event.offsetX - mask.offsetWidth/2;
        let top = event.offsetY - mask.offsetHeight/2;
        // 约束绿色框框的位置，也就是约束鼠标放大的区域
        if(left < 0)  left = 0;
        if(left > mask.offsetWidth)   left = mask.offsetWidth;
        if(top < 0)   top = 0;
        if(top > mask.offsetHeight)   top = mask.offsetHeight;
        mask.style.left = left + 'px';
        mask.style.top = top + 'px';
        // 鼠标在小图里右移时其实大图中的图片是在左移，所以加 - ，因为图片放大了两倍，所以移动的距离也要 * 2
        // 图片是藏在它外面的盒子下面的，被挡住的部分展示不出来，只会展示这个盒子大小方框漏出来的部分
        bigImg.style.left = - 2 * left + 'px';
        bigImg.style.top = - 2 * top + 'px';
      }
    }
  }
</script>

<style lang="less">
  .spec-preview {
    position: relative;
    width: 400px;
    height: 400px;
    border: 1px solid #ccc;

    img {
      width: 100%;
      height: 100%;
    }

    .event {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 998;
    }

    .mask {
      width: 50%;
      height: 50%;
      background-color: rgba(0, 255, 0, 0.3);
      position: absolute;
      left: 0;
      top: 0;
      display: none;
    }

    .big {
      width: 100%;
      height: 100%;
      position: absolute;
      top: -1px;
      left: 100%;
      border: 1px solid #aaa;
      overflow: hidden;
      z-index: 998;
      display: none;
      background: white;

      img {
        width: 200%;
        max-width: 200%;
        height: 200%;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
    // 使我的鼠标移到小图上时才会展示bigImg
    .event:hover~.mask,
    .event:hover~.big {
      display: block;
    }
  }
</style>