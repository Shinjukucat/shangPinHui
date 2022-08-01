<template>
  <div class="cart">
    <h4>全部商品</h4>
    <div class="cart-main">
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>
      <div class="cart-body">
        <ul class="cart-list" v-for="shop in shopcartList" :key="shop.id">
          <li class="cart-list-con1">
            <input type="checkbox" name="chk_list" :checked="shop.isChecked == 1" @change="changeCheckedStatus(shop.skuId, $event)" />
          </li>
          <li class="cart-list-con2">
            <img :src="shop.imgUrl" />
            <div class="item-msg">
              {{shop.skuName}}
            </div>
          </li>
          <li class="cart-list-con4">
            <span class="price">{{shop.skuPrice + '.00'}}</span>
          </li>
          <li class="cart-list-con5">
            <a href="javascript:void(0)" class="mins" @click="changeNum('cut', -1, shop)">-</a>
            <input
              autocomplete="off"
              type="text"
              :value="shop.skuNum"
              minnum="1"
              class="itxt"
              @change="changeNum('change', $event.target.value * 1, shop)"
            />
            <a href="javascript:void(0)" class="plus" @click="changeNum('add', 1, shop)">+</a>
          </li>
          <li class="cart-list-con6">
            <span class="sum">{{shop.skuPrice * shop.skuNum + '.00'}}</span>
          </li>
          <li class="cart-list-con7">
            <a href="#none" class="sindelet" @click="deleteShop(shop)">删除</a>
            <br />
            <a href="#none">移到收藏</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="cart-tool">
      <div class="select-all">
        <input class="chooseAll" type="checkbox" :checked="isAllChecked && shopcartList.length > 0" @click="changeAllShopStatus($event)" />
        <span>全选</span>
      </div>
      <div class="option">
        <a @click="deleteAllShop">删除选中的商品</a>
        <a href="#none">移到我的关注</a>
        <a href="#none">清除下柜商品</a>
      </div>
      <div class="money-box">
        <div class="chosed">已选择 <span>{{totalCount}}</span> 件商品</div>
        <div class="sumprice">
          <em>总价（不含运费） ：</em>
          <i class="summoney">{{totalPrice}}</i>
        </div>
        <div class="sumbtn">
          <router-link to="/trade" class="sum-btn">结算</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import _ from 'lodash'
// 按需引入
import throttle from 'lodash/throttle'
import {mapGetters} from 'vuex'
export default {
  name: "ShopCart",
  mounted() {
    this.getShopcartData()
  },
  methods: {
    getShopcartData() {
      this.$store.dispatch('getShopcartList')
    },
    // 商品数量的改变，记住每一次修改都是要发送请求的，这样这个商品数量才是真正的修改，如果点的太快服务器翻译不过来的话，商品数量会为负，所以加上节流
     changeNum: throttle(async function(type, disNum, shop){
      // 三个改变商品数量的事件使用同一个方法，因为都是调用同一个actions
      // type用来区分三个不同的改变，disNum显示改变量，shop显示点击的是哪个商品
      // console.log(type, disNum, shop)
      switch(type) {
        case 'add':
          disNum = 1;
          break;
        case 'cut':
          shop.skuNum > 1 ? disNum = -1 : disNum = 0;
          break;
        case 'change':
          // if(isNaN(disNum) || disNum < 1)
          //   disNum = 0;
          // else 
          //   disNum = parseInt(disNum) - shop.skuNum;
          disNum = isNaN(disNum) || disNum < 1 ? 0 : parseInt(disNum) - shop.skuNum
      }
      try {
        // await这里用来等待服务器返回数据 await(async wait)异步等待
        await this.$store.dispatch('addUpdataShopcart', {skuId: shop.skuId, skuNum: disNum});
        this.getShopcartData()
      } catch (error) {
      }
    },1000),
    // 删除商品
    async deleteShop(shop) {
      try {
        await this.$store.dispatch('deleteShop', shop.skuId);
        this.getShopcartData()
      } catch (error) {
        
      }
    },
    // 切换商品选中状态
    async changeCheckedStatus(skuId, event) {
      try {
        // $event.target.checked 拿到的勾选状态返回值是bool值，将他改为字符串用于传参
        let isChecked = event.target.checked ? '1' : '0';
        await this.$store.dispatch('changeChecked', {skuId: skuId, isChecked: isChecked});
      } catch (error) {
        
      }
    },
    // 删除已选中的商品
    async deleteAllShop() {
      try {
        await this.$store.dispatch('deleteAllShop');
        this.getShopcartData()
      } catch (error) {
        alert(error.message)
      }
    },
    // 全选框，修改所有商品的选中状态
    async changeAllShopStatus(event) {
      try {
        let isAllChecked = event.target.checked ? '1' : '0'
        await this.$store.dispatch('changeAllChecked', isAllChecked)
        this.getShopcartData()
      } catch (error) {
        alert(error.message)
      }
    },
  },
  computed: {
    ...mapGetters(['shopCartList']),
    shopcartList() {
      return this.shopCartList || []
    },
    // 计算勾选商品的个数
    totalCount() {
      let count = 0;
      this.shopcartList.forEach(item => {
        if(item.isChecked == 1) {
          count += item.skuNum
        }
      })
      return count
    },
    // 计算勾选商品的总价
    totalPrice() {
      let sum = 0;
      this.shopcartList.forEach(item => {
        if(item.isChecked == 1) {
          sum += item.skuPrice * item.skuNum
        }
      });
      return sum
    },
    // 计算商品是否已全部勾选
    isAllChecked() {
      // every方法：当所有item里面的isChecked属性都等于1的时候，返回true，只要有一个不符合就返回false
      return this.shopcartList.every(item => item.isChecked == 1)
    }
  }
};
</script>

<style lang="less" scoped>
.cart {
  width: 1200px;
  margin: 0 auto;

  h4 {
    margin: 9px 0;
    font-size: 14px;
    line-height: 21px;
  }

  .cart-main {
    .cart-th {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 10px;
      overflow: hidden;

      & > div {
        float: left;
      }

      .cart-th1 {
        width: 25%;

        input {
          vertical-align: middle;
        }

        span {
          vertical-align: middle;
        }
      }

      .cart-th2 {
        width: 25%;
      }

      .cart-th3,
      .cart-th4,
      .cart-th5,
      .cart-th6 {
        width: 12.5%;
      }
    }

    .cart-body {
      margin: 15px 0;
      border: 1px solid #ddd;

      .cart-list {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        overflow: hidden;

        & > li {
          float: left;
        }

        .cart-list-con1 {
          width: 15%;
        }

        .cart-list-con2 {
          width: 35%;

          img {
            width: 82px;
            height: 82px;
            float: left;
          }

          .item-msg {
            float: left;
            width: 150px;
            margin: 0 10px;
            line-height: 18px;
          }
        }

        .cart-list-con4 {
          width: 10%;
        }

        .cart-list-con5 {
          width: 17%;

          .mins {
            border: 1px solid #ddd;
            border-right: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }

          input {
            border: 1px solid #ddd;
            width: 40px;
            height: 33px;
            float: left;
            text-align: center;
            font-size: 14px;
          }

          .plus {
            border: 1px solid #ddd;
            border-left: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }
        }

        .cart-list-con6 {
          width: 10%;

          .sum {
            font-size: 16px;
          }
        }

        .cart-list-con7 {
          width: 13%;

          a {
            color: #666;
          }
        }
      }
    }
  }

  .cart-tool {
    overflow: hidden;
    border: 1px solid #ddd;

    .select-all {
      padding: 10px;
      overflow: hidden;
      float: left;

      span {
        vertical-align: middle;
      }

      input {
        vertical-align: middle;
      }
    }

    .option {
      padding: 10px;
      overflow: hidden;
      float: left;

      a {
        float: left;
        padding: 0 10px;
        color: #666;
      }
    }

    .money-box {
      float: right;

      .chosed {
        line-height: 26px;
        float: left;
        padding: 0 10px;
      }

      .sumprice {
        width: 200px;
        line-height: 22px;
        float: left;
        padding: 0 10px;

        .summoney {
          color: #c81623;
          font-size: 16px;
        }
      }

      .sumbtn {
        float: right;

        a {
          display: block;
          position: relative;
          width: 96px;
          height: 52px;
          line-height: 52px;
          color: #fff;
          text-align: center;
          font-size: 18px;
          font-family: "Microsoft YaHei";
          background: #e1251b;
          overflow: hidden;
        }
      }
    }
  }
}
</style>
