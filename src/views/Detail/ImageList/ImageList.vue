<template>
  <div class="swiper-container" ref="swiper">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="(slide, index) in skuImageList" :key="slide.id">
        <img :src="slide.imgUrl" :class="{active: currentIndex == index}" @click="changeActive(index)" />
      </div>
    </div>
    <div class="swiper-button-next"></div>
    <div class="swiper-button-prev"></div>
  </div>
</template>

<script>
import Swiper from "swiper";
export default {
  name: "ImageList",
  data() {
    return {
      currentIndex: 0
    }
  },
  props: ['skuImageList'],
  watch: {
    skuImageList: {
      handler(newValue, oldValue) {
        this.$nextTick(() => {
          new Swiper(this.$refs.swiper, {
            // 如果需要前进后退按钮 
            navigation: {
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            },
            // 一个slide里面显示几个图片
            slidesPerView: 3,
            // 每一次切换的图片个数
            slidesPerGroup: 1
          });
        })
      }
    }
  },
  methods: {
    // 在修改currentIndex值的时候顺便给它的兄弟传递这个索引让兄弟展示对应的图片
    changeActive(index) {
      this.currentIndex = index;
      // 给兄弟传递点击图片的索引值，让兄弟展示这个索引值对应的图片
      this.$bus.$emit('getIndex', this.currentIndex)
    }
  }
};
</script>

<style lang="less" scoped>
.swiper-container {
  height: 56px;
  width: 412px;
  box-sizing: border-box;
  padding: 0 0 0 60px;

  .swiper-slide {
    width: 56px;
    height: 56px;

    img {
      width: 100%;
      height: 100%;
      border: 1px solid #ccc;
      padding: 2px;
      width: 50px;
      height: 50px;
      display: block;

      &.active {
        border: 2px solid #f60;
        padding: 1px;
      }
    }
  }

  .swiper-button-next {
    left: auto;
    right: 0;
  }

  .swiper-button-prev {
    left: 0;
    right: auto;
  }

  .swiper-button-next,
  .swiper-button-prev {
    box-sizing: border-box;
    width: 12px;
    height: 56px;
    background: rgb(235, 235, 235);
    border: 1px solid rgb(204, 204, 204);
    top: 0;
    margin-top: 0;
    &::after {
      font-size: 12px;
    }
  }
}
</style>
