<template>
  <div>
    <!-- 三级分类Tab区域 -->
    <TabNav></TabNav>
    <!-- 主体区域 -->
    <div class="main">
      <div class="py-container">
        <!--面包屑区域——搜索的query关键字-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <li class="with-x" v-if="searchFormParams.categoryName">
              {{ searchFormParams.categoryName
              }}<i @click="removeCategoryName">×</i>
            </li>
            <li class="with-x" v-if="searchFormParams.keyword">
              {{ searchFormParams.keyword }}<i @click="removeKeyword">×</i>
            </li>
            <li class="with-x" v-if="searchFormParams.trademark">
              {{ searchFormParams.trademark.split(":")[1]
              }}<i @click="removeTradmark">×</i>
            </li>
            <li
              class="with-x"
              v-for="(attr, index) in searchFormParams.props"
              :key="index"
            >
              {{ attr.split(":")[1] }}<i @click="removeAttr(index)">×</i>
            </li>
          </ul>
        </div>

        <!--商品参数表格组件-->
        <!-- 通过添加自定义事件实现子传父 -->
        <SearchSelector @tradmarkInfo="tradmarkInfo" @attrInfo="attrInfo" />

        <!--order参数所在部分 商品带图片的展示-->
        <div class="details clearfix">
          <!-- 综合、销量... -->
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <ul class="sui-nav">
                <li :class="{ active: isOne }" @click="changeOrder('1')">
                  <a
                    >综合<span v-show="isAsc && isOne">⬆</span
                    ><span v-show="isDesc && isOne">⬇</span></a
                  >
                </li>
                <li :class="{ active: isTwo }" @click="changeOrder('2')">
                  <a
                    >价格<span v-show="isAsc && isTwo">⬆</span
                    ><span v-show="isDesc && isTwo">⬇</span></a
                  >
                </li>
              </ul>
            </div>
          </div>
          <!-- 十张图片区域 -->
          <div class="goods-list">
            <ul class="yui3-g">
              <li class="yui3-u-1-5" v-for="good in goodsList" :key="good.id">
                <div class="list-wrap">
                  <div class="p-img">
                    <router-link :to="`/detail/${good.id}`">
                      <img v-lazy="good.defaultImg" />
                    </router-link>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥</em>
                      <i>{{ good.price }}.00</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <a target="_blank" href="item.html" :title="good.title">{{
                      good.title
                    }}</a>
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>2000</span>人评价</i>
                  </div>
                  <div class="operate">
                    <a
                      href="success-cart.html"
                      target="_blank"
                      class="sui-btn btn-bordered btn-danger"
                      >加入购物车</a
                    >
                    <a href="javascript:void(0);" class="sui-btn btn-bordered"
                      >收藏</a
                    >
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <!-- 分页区域 -->
          <!-- 给自己封装的分页器组件传参，continues是中间的页数的个数 -->
          <Pagination
            :pageNo="searchFormParams.pageNo"
            :pageSize="searchFormParams.pageSize"
            :total="total"
            :continues="5"
            @getPageNo="getPageNo"
          ></Pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import {mapState} from 'vuex'
import { mapGetters } from "vuex";
import SearchSelector from "./SearchSelector/SearchSelector";
export default {
  name: "Search",
  data() {
    return {
      // 保存表单参数，传递给getSearchList actions方法的参数，用于发送请求时携带的参数
      searchFormParams: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
        categoryName: "",
        // 搜索的关键字
        keyword: "",
        // 商品排序 默认是综合降序 1综合 2价格 asc升序 desc降序
        order: "1:desc",
        pageNo: 1,
        pageSize: 3,
        // 平台售卖属性带的参数
        props: [],
        // 牌子
        trademark: "",
      },
    };
  },
  components: {
    SearchSelector,
  },
  beforeMount() {
    // 将home路由传递过来的保存在路径中的query参数保存在搜索表单数据中
    // 复杂的写法
    // this.searchFormParams.category1Id = this.$route.query.category1Id;
    // this.searchFormParams.category2Id = this.$route.query.category2Id;
    // this.searchFormParams.category3Id = this.$route.query.category3Id;
    // this.searchFormParams.categoryName = this.$route.query.categoryName;
    // this.searchFormParams.keyword = this.$route.query.keyword;
    // Object.assign写法,ES4新增的写法,合并对象
    // 这个函数会在mounted函数执行之前执行，将括号中的对象进行合并(将拥有相同属性名的属性值合并)
    //在发送请求之前，把接口需要传递的参数，进行整理
    Object.assign(this.searchFormParams, this.$route.query, this.$route.params);
  },
  mounted() {
    // 这样把请求数据直接放在mounted里面只能执行一次，但是搜索页面肯定是需要多次发送请求的，所以这里用shop_b的方法
    // this.$store.dispatch("getSearchList", {});
    this.getSearchData();
  },
  computed: {
    // ...mapState({
    //   // 通过右边的箭头函数将返回值保存到左边的属性中
    //   goodsList: state => state.search.searchList.goodsList,
    // })
    // mapGetters里面传递的是数组，因为getters计算是没有划分模块的
    ...mapGetters(["goodsList", "total", "totalSize"]),
    // 判断order字符串中是否有1/2，以此来给综合/价格加背景
    isOne() {
      // 没有1就返回false
      return this.searchFormParams.order.indexOf("1") != -1;
    },
    isTwo() {
      return this.searchFormParams.order.indexOf("2") != -1;
    },
    isAsc() {
      // 没有asc就返回false
      return this.searchFormParams.order.indexOf("asc") != -1;
    },
    isDesc() {
      return this.searchFormParams.order.indexOf("desc") != -1;
    },
  },
  methods: {
    // 发送请求的方法，把发送请求的方法写在这里，就可以通过多次调用方法来多次请求数据了，而且mounted里面也可以调用这个方法进行初始的请求
    getSearchData() {
      this.$store.dispatch("getSearchList", this.searchFormParams);
    },
    removeCategoryName() {
      this.searchFormParams.categoryName = "";
      this.searchFormParams.category1Id = "";
      this.searchFormParams.category2Id = "";
      this.searchFormParams.category3Id = "";
      this.getSearchData();
      // 点击叉号关闭面包屑标签后，地址栏的参数并没有改，通过路由跳转跳转到默认路径(但是如果有params参数时需要保留params参数，因为标签只是query的参数，点叉号只是想清除query参数)
      // this.$router.push('Search')
      if (this.$route.params)
        this.$router.push({ name: "Search", params: this.$route.params });
      else this.$router.push("Search");
    },
    removeKeyword() {
      this.searchFormParams.keyword = "";
      // 通知兄弟组件清除搜索框里的keyword
      this.$bus.$emit("clearKeyword");
      this.getSearchData();
      if (this.$route.query)
        this.$router.push({ name: "Search", query: this.$route.query });
      else this.$router.push("Search");
    },
    removeTradmark() {
      this.searchFormParams.trademark = "";
      this.getSearchData();
    },
    removeAttr(index) {
      this.searchFormParams.props.splice(index, 1);
      this.getSearchData();
    },
    // 子给父通信用的是自定义事件
    tradmarkInfo(tradMark) {
      // console.log(tradMark)
      this.searchFormParams.trademark = `${tradMark.tmId}:${tradMark.tmName}`;
      this.getSearchData();
    },
    attrInfo(attr, attrValue) {
      // 服务器要求传递的参数的格式： ['属性ID:属性值:属性名']
      let props = `${attr.attrId}:${attrValue}:${attr.attrName}`;
      // == -1说明props数组里面没有没有现在点的这个属性
      if (this.searchFormParams.props.indexOf(props) == -1)
        this.searchFormParams.props.push(props);
      this.getSearchData();
    },
    // 综合和价格按钮的点击事件
    changeOrder(flag) {
      // flag形参，它是一个标记，代表用户点击的是综合(1)，还是价格(2)
      let originOrder = this.searchFormParams.order;
      let originFlag = originOrder.split(":")[0];
      let originSort = originOrder.split(":")[1];
      let nowOrder = "";
      if (flag === originFlag)
        nowOrder = `${originFlag}:${originSort === "asc" ? "desc" : "asc"}`;
      else nowOrder = `${flag}:${"desc"}`;
      this.searchFormParams.order = nowOrder;
      this.getSearchData();
    },
    // 获得当前点击的页码数的自定义事件
    getPageNo(pageNo) {
      this.searchFormParams.pageNo = pageNo;
      this.getSearchData();
    },
  },
  watch: {
    // 通过监听路由的变化来请求数据从而刷新页面
    $route(newValue, oldValue) {
      // 再次发送请求之前请求的参数也要发生变化
      Object.assign(
        this.searchFormParams,
        this.$route.query,
        this.$route.params
      );
      // 路由发生变化了，说明点击了新的参数，再次发送请求
      this.getSearchData();
      // 在一次请求完毕后，将这次请求的category1、2、3Id的值置空，以免影响下一次的请求，因为如果不置空的话这一次的id值如果不背覆盖会携带到下一次的搜索
      this.searchFormParams.category1Id = "";
      this.searchFormParams.category2Id = "";
      this.searchFormParams.category3Id = "";
    },
  },
};
</script>

<style lang="less" scoped>
.main {
  margin: 10px 0;

  .py-container {
    width: 1200px;
    margin: 0 auto;

    .bread {
      margin-bottom: 5px;
      overflow: hidden;

      .sui-breadcrumb {
        padding: 3px 15px;
        margin: 0;
        font-weight: 400;
        border-radius: 3px;
        float: left;

        li {
          display: inline-block;
          line-height: 18px;

          a {
            color: #666;
            text-decoration: none;

            &:hover {
              color: #4cb9fc;
            }
          }
        }
      }

      .sui-tag {
        margin-top: -5px;
        list-style: none;
        font-size: 0;
        line-height: 0;
        padding: 5px 0 0;
        margin-bottom: 18px;
        float: left;

        .with-x {
          font-size: 12px;
          margin: 0 5px 5px 0;
          display: inline-block;
          overflow: hidden;
          color: #000;
          background: #f7f7f7;
          padding: 0 7px;
          height: 20px;
          line-height: 20px;
          border: 1px solid #dedede;
          white-space: nowrap;
          transition: color 400ms;
          cursor: pointer;

          i {
            margin-left: 10px;
            cursor: pointer;
            font: 400 14px tahoma;
            display: inline-block;
            height: 100%;
            vertical-align: middle;
          }

          &:hover {
            color: #28a3ef;
          }
        }
      }
    }

    .details {
      margin-bottom: 5px;

      .sui-navbar {
        overflow: visible;
        margin-bottom: 0;

        .filter {
          min-height: 40px;
          padding-right: 20px;
          background: #fbfbfb;
          border: 1px solid #e2e2e2;
          padding-left: 0;
          border-radius: 0;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

          .sui-nav {
            position: relative;
            left: 0;
            display: block;
            float: left;
            margin: 0 10px 0 0;

            li {
              float: left;
              line-height: 18px;

              a {
                display: block;
                cursor: pointer;
                padding: 11px 15px;
                color: #777;
                text-decoration: none;
              }

              &.active {
                a {
                  background: #e1251b;
                  color: #fff;
                }
              }
            }
          }
        }
      }

      .goods-list {
        margin: 20px 0;

        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            height: 100%;
            width: 20%;
            margin-top: 10px;
            line-height: 28px;

            .list-wrap {
              .p-img {
                padding-left: 15px;
                width: 215px;
                height: 255px;

                a {
                  color: #666;

                  img {
                    max-width: 100%;
                    height: auto;
                    vertical-align: middle;
                  }
                }
              }

              .price {
                padding-left: 15px;
                font-size: 18px;
                color: #c81623;

                strong {
                  font-weight: 700;

                  i {
                    margin-left: -5px;
                  }
                }
              }

              .attr {
                padding-left: 15px;
                width: 85%;
                overflow: hidden;
                margin-bottom: 8px;
                min-height: 38px;
                cursor: pointer;
                line-height: 1.8;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;

                a {
                  color: #333;
                  text-decoration: none;
                }
              }

              .commit {
                padding-left: 15px;
                height: 22px;
                font-size: 13px;
                color: #a7a7a7;

                span {
                  font-weight: 700;
                  color: #646fb0;
                }
              }

              .operate {
                padding: 12px 15px;

                .sui-btn {
                  display: inline-block;
                  padding: 2px 14px;
                  box-sizing: border-box;
                  margin-bottom: 0;
                  font-size: 12px;
                  line-height: 18px;
                  text-align: center;
                  vertical-align: middle;
                  cursor: pointer;
                  border-radius: 0;
                  background-color: transparent;
                  margin-right: 15px;
                }

                .btn-bordered {
                  min-width: 85px;
                  background-color: transparent;
                  border: 1px solid #8c8c8c;
                  color: #8c8c8c;

                  &:hover {
                    border: 1px solid #666;
                    color: #fff !important;
                    background-color: #666;
                    text-decoration: none;
                  }
                }

                .btn-danger {
                  border: 1px solid #e1251b;
                  color: #e1251b;

                  &:hover {
                    border: 1px solid #e1251b;
                    background-color: #e1251b;
                    color: white !important;
                    text-decoration: none;
                  }
                }
              }
            }
          }
        }
      }

      .page {
        width: 733px;
        height: 66px;
        overflow: hidden;
        float: right;

        .sui-pagination {
          margin: 18px 0;

          ul {
            margin-left: 0;
            margin-bottom: 0;
            vertical-align: middle;
            width: 490px;
            float: left;

            li {
              line-height: 18px;
              display: inline-block;

              a {
                position: relative;
                float: left;
                line-height: 18px;
                text-decoration: none;
                background-color: #fff;
                border: 1px solid #e0e9ee;
                margin-left: -1px;
                font-size: 14px;
                padding: 9px 18px;
                color: #333;
              }

              &.active {
                a {
                  background-color: #fff;
                  color: #e1251b;
                  border-color: #fff;
                  cursor: default;
                }
              }

              &.prev {
                a {
                  background-color: #fafafa;
                }
              }

              &.disabled {
                a {
                  color: #999;
                  cursor: default;
                }
              }

              &.dotted {
                span {
                  margin-left: -1px;
                  position: relative;
                  float: left;
                  line-height: 18px;
                  text-decoration: none;
                  background-color: #fff;
                  font-size: 14px;
                  border: 0;
                  padding: 9px 18px;
                  color: #333;
                }
              }

              &.next {
                a {
                  background-color: #fafafa;
                }
              }
            }
          }

          div {
            color: #333;
            font-size: 14px;
            float: right;
            width: 241px;
          }
        }
      }
    }
  }
}
</style>
