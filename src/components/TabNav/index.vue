<template>
  <!-- 商品分类导航 -->
  <div class="tab-nav">
    <div class="container">
      <div @mouseleave="hiddenTabNav" @mouseenter="showTabNav">
        <h2 class="all">全部商品分类</h2>
        <transition name="sort">
          <!-- 三级联动 -->
          <div class="sort" v-show="show">
            <!-- 事件委派 + 编程式导航 -->
            <div class="all-sort-list2" @click="goSearch">
              <!-- 一级菜单 -->
              <div class="item" v-for="(menu1, index) in categoryList" :key="menu1.categoryId" :class="{cur: currentIndex == index}">
                <h3 @mouseenter="changeIndex(index)" >
                  <a :data-categoryName="menu1.categoryName" :data-category1Id="menu1.categoryId">{{menu1.categoryName}}</a>
                </h3>
                <!-- 二级菜单 -->
                <div class="item-list clearfix" :style="{display: currentIndex == index ? 'block' : 'none'}">
                  <div class="subitem" v-for="(menu2) in menu1.categoryChild" :key="menu2.categoryId">
                    <dl class="fore">
                      <dt>
                        <a :data-categoryName="menu2.categoryName" :data-category2Id="menu2.categoryId">{{menu2.categoryName}}</a>
                      </dt>
                      <!-- 三级菜单 -->
                      <dd>
                        <em v-for="(menu3) in menu2.categoryChild" :key="menu3.categoryId">
                          <a :data-categoryName="menu3.categoryName"  :data-category3Id="menu3.categoryId">{{menu3.categoryName}}</a>
                        </em>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
      
      <nav class="nav">
        <a href="###">服装城</a>
        <a href="###">美妆馆</a>
        <a href="###">尚品汇超市</a>
        <a href="###">全球购</a>
        <a href="###">闪购</a>
        <a href="###">团购</a>
        <a href="###">有趣</a>
        <a href="###">秒杀</a>
      </nav>

    </div>
  </div>
</template>

<script>
// import _ from 'lodash'
// 按需引入
import throttle from 'lodash/throttle'
// 用mapState辅助函数去获取vuex里面的数据
import {mapState} from 'vuex';
export default {
  // name名字起作用了！！在注册全局组件的时候可以直接引用这个名字
  name: 'TabNav',
  data() {
    return {
      // 记录处于活跃状态的索引值
      currentIndex: -1,
      // 记录typebar的显示与隐藏
      show: true
    }
  },
  // 组件挂载完毕，可以发请求了
  mounted() {
    // 通知vuex发请求，获取数据，存储于仓库中，老师把这一步移到了app.vue里面
    // this.$store.dispatch('categoryList');
    // 当组件挂载完毕(DOM渲染完毕)，将show改为false
    // 如果不在home路径中就隐藏
    if(this.$route.path != '/home') {
      this.show = false
    }
  },
  computed: {
    // 当使用这个计算属性也就是这里的categoryList的时候，会自动执行后面的函数
    // 传入的参数state就是大仓库中的数据，包括home，search...里面的数据
    // ...mapState里面是一个对象，将vuex里面存储的state.home.categoryList赋值给categoryList
    // ...是ES6的展开运算符，在这里将categoryList数组展开
    ...mapState({
      categoryList: state => {
        console.log(state.home.categoryList);
        return state.home.categoryList;
      }
    })
  },
  methods: {
    // 监听鼠标经过
    // changeIndex(index) {
    //   // 当这步操作过快时，浏览器反应不过来，无法完整执行，当回调函数中数据较大时就会出现卡顿现象
    //   this.currentIndex = index
    // },
    // 通过回流的方法执行函数，用ES5写法  因为上面按需引入，这里直接使用throttle这个函数就可以了，不用加 _. 
    changeIndex: throttle(function(index) {
      this.currentIndex = index
    }, 50),
    // 进行路由跳转的方法
    goSearch(event) {
      // 最好的解决方案：编程式导航 + 事件委派
      // 利用事件委派又存在一些问题：1.如何确定点击的是a标签  2.如何确定点击的是第几级的a标签  3.如何获取参数【1/2/3级分类的产品名字和id】
      console.log(event)
      // 第一个问题：把子节点当中的a标签，加上自定义属性data-categoryname，其余的节点是没有的
      let element = event.target;
      // 获取到当前触发这个事件的节点，带有data-categoryname节点的就是a标签
      // 节点有一个dataset属性，里面装的就是属性名和id，因此可以获取节点的自定义属性和属性id值，将各个属性结构出来，没有的就是空null
      let {categoryname, category1id, category2id, category3id} = element.dataset;
      // 如果节点有categoryname属性就一定是a标签
      if(categoryname) {
        // 整理路由跳转参数，已经确定是要跳转到search页面，但是要在里面加上categoryName和categoryId作为路由参数传过去
        let location = {name: "Search"};
        let query = {categoryName: categoryname};
        // 一级分类、二级分类、三级分类的a标签
        if(category1id) {
          query.category1Id = category1id;
        } else if(category2id) {
          query.category2Id = category2id;
        } else {
          query.category3Id = category3id;
        }
        // 将query也加入到location对象里，location里面name是跳转到的地址，query是传入的参数，name指向跳转到的路径，路径里面加上query参数，query参数里面是name和id
        // 商品的分类参数全部都保存在了query里，搜索关键字在params里
        location.query = query;
        // 路由跳转
        this.$router.push(location);
      }
    },
    // 展示列表栏
    showTabNav() {
      if(this.$route.path != '/home') {
        this.show = true
      }
    },
    // 隐藏列表栏
    hiddenTabNav() {
      this.currentIndex = -1
      if(this.$route.path != '/home') {
        this.show = false
      }
    }
  }
};
</script>

<style lang="less" scoped>
.tab-nav {
  border-bottom: 2px solid #e1251b;

  .container {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    position: relative;

    .all {
      width: 210px;
      height: 45px;
      background-color: #e1251b;
      line-height: 45px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }

    .nav {
      a {
        height: 45px;
        margin: 0 22px;
        line-height: 45px;
        font-size: 16px;
        color: #333;
      }
    }

    .sort {
      position: absolute;
      left: 0;
      top: 45px;
      width: 210px;
      height: 461px;
      position: absolute;
      background: #fafafa;
      z-index: 999;

      .all-sort-list2 {
        .item {
          h3 {
            line-height: 28px;
            font-size: 14px;
            font-weight: 400;
            overflow: hidden;
            padding: 0 20px;
            margin: 0;

            a {
              color: #333;
            }
          }

          .item-list {
            display: none;
            position: absolute;
            width: 734px;
            min-height: 460px;
            background: #f7f7f7;
            left: 210px;
            border: 1px solid #ddd;
            top: 0;
            z-index: 9999 !important;

            .subitem {
              float: left;
              width: 650px;
              padding: 0 4px 0 8px;

              dl {
                border-top: 1px solid #eee;
                padding: 6px 0;
                overflow: hidden;
                zoom: 1;

                &.fore {
                  border-top: 0;
                }

                dt {
                  float: left;
                  width: 54px;
                  line-height: 22px;
                  text-align: right;
                  padding: 3px 6px 0 0;
                  font-weight: 700;
                }

                dd {
                  float: left;
                  width: 415px;
                  padding: 3px 0 0;
                  overflow: hidden;

                  em {
                    float: left;
                    height: 14px;
                    line-height: 14px;
                    padding: 0 8px;
                    margin-top: 5px;
                    border-left: 1px solid #ccc;
                  }
                }
              }
            }
          }
        }
        .cur {
          background-color: skyblue;
        }
      }
    }
    // 过渡动画样式
    // 过度动画开始状态(进入)
    .sort-enter {
      height: 0;
    }
    // 过渡动画结束状态(结束)
    .sort-enter-to {
      height: 461px;
    }
    // 定义动画事件、速率
    .sort-enter-active {
      transition: all .5s linear;
    }
  }
}
</style>
