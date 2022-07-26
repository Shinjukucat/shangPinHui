<template>
  <div class="pagination">
    <button :disabled="pageNo == 1" @click="frontPage(pageNo)">上一页</button>
    <button v-if="calculateStartEnd.start > 1" @click="firstPage" :class="{active: pageNo == 1}">1</button>
    <button v-if="calculateStartEnd.start > 2">···</button>

    <!-- 分页器中间区域，continues区域 -->
  <button v-for="(page, index) in calculateStartEnd.end" :key="index" v-show="page >= calculateStartEnd.start" @click="goPage(page)" :class="{active: pageNo == page}">{{page}}</button>

    <button v-if="calculateStartEnd.end < totalPage - 1">···</button>
    <button v-if="calculateStartEnd.end < totalPage" @click="lastPage()" :class="{active: pageNo == totalPage}">{{totalPage}}</button>
    <button :disabled="pageNo == totalPage" @click="nextPage(pageNo)">下一页</button>

    <button style="margin-left: 30px">共 {{total}} 条</button>
  </div>
</template>

<script>
// 自己封装分页器
export default {
  name: "Pagination",
  props: ['pageNo', 'pageSize', 'total', 'continues'],
  computed: {
    // 计算总页数
    totalPage() {
      return Math.ceil(this.total/this.pageSize)
    },
    // 计算连续页码的起始页码数start和end
    calculateStartEnd() {
      // 将这几个属性结构出来，这样在使用的时候就不用加 this.了
      const {pageNo, totalPage, continues} = this;
      let start = 0, end = 0;
      // 考虑总页码数不足totalPage的情况，比如不足5页的情况
      if(totalPage < continues) {
        start = 1;
        end = totalPage;
      } else {
        // 正常情况下有两个情况需要考虑，start为0或负值，end超过总页数
        start = pageNo - parseInt(continues/2);
        end = pageNo + parseInt(continues/2);
        if(start < 1) {
          start = 1;
          end = continues;
        }
        if(end > totalPage) {
          end = totalPage;
          start = totalPage - continues + 1;
        }
      }
      return {start, end};
    }
  },
  methods: {
    // 上一页
    frontPage(pageNo) {
      this.$emit('getPageNo', pageNo - 1)
    },
    // 第一页
    firstPage() {
      this.$emit('getPageNo', 1)
    },
    // 中间的任意页
    goPage(page) {
      this.$emit('getPageNo', page)
    },
    // 最后一页
    lastPage() {
      this.$emit('getPageNo', this.totalPage)
    },
    // 下一页
    nextPage(pageNo) {
      this.$emit('getPageNo', pageNo + 1)
    }
  }
};
</script>

<style lang="less" scoped>
.pagination {
  text-align: center;
  button {
    margin: 0 5px;
    background-color: #f4f4f5;
    color: #606266;
    outline: none;
    border-radius: 2px;
    padding: 0 4px;
    vertical-align: top;
    display: inline-block;
    font-size: 13px;
    min-width: 35.5px;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    box-sizing: border-box;
    text-align: center;
    border: 0;

    &[disabled] {
      color: #c0c4cc;
      cursor: not-allowed;
    }

    &.active {
      cursor: not-allowed;
      background-color: #409eff;
      color: #fff;
    }
  }
}
.active {
  background-color: skyblue;
}
</style>
