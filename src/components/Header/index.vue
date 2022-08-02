<template>
  <!-- 头部 -->
  <header class="header">
    <!-- 头部的第一行 -->
    <div class="top">
      <div class="container">
        <div class="loginList">
          <p>尚品汇欢迎您！</p>
          <p v-if="! userName">
            <router-link to="/login"><p>请登录</p></router-link>
            <router-link to="/register" class="register"><p>免费注册</p></router-link>
          </p>
          <p v-else>
            <i>{{userName}}</i>
            <i class="register" @click="loginout">退出登录</i>
          </p>
        </div>
        <div class="typeList">
          <router-link to="/center/myorder">我的订单</router-link>
          <router-link to="/shopcart">我的购物车</router-link>
          <a href="###">我的尚品汇</a>
          <a href="###">尚品汇会员</a>
          <a href="###">企业采购</a>
          <a href="###">关注尚品汇</a>
          <a href="###">合作招商</a>
          <a href="###">商家后台</a>
        </div>
      </div>
    </div>
    <!--头部第二行 搜索区域-->
    <div class="bottom">
      <h1 class="logoArea">
        <router-link class="logo" to="/home">
          <img src="./images/logo.png" alt="" />
        </router-link>
      </h1>
      <div class="searchArea">
        <form action="###" class="searchForm">
          <input
            type="text"
            id="autocomplete"
            class="input-error input-xxlarge"
            v-model="keyword"
          />
          <button class="sui-btn btn-xlarge btn-danger" type="button" @click="goSearch">
            搜索
          </button>
        </form>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      keyword: ''
    }
  },
  methods: {
    goSearch() {
      // 路由传递参数
      // 第一种方式：字符串形式，keyword是params参数，?k= 后面的是query参数
      // this.$router.push('/search/' + this.keyword + "?k=" + this.keyword.toUpperCase())
      // 第二种方式：模板字符串形式
      // this.$router.push(`/search/${this.keyword}?k=${this.keyword.toUpperCase()}`)
      // 对象形式(最常用的方式)，params传递参数不能路径不能用path，只能用name
      // this.$router.push({name: 'Search', params: {keyword: this.keyword}, query: {k: this.keyword.toUpperCase()}})

      // 如果有query参数也加到路径里传过去
      if(this.$route.query) {
        // params参数要占位，query不用
        let location = {name: 'Search', params: {keyword: this.keyword || undefined}};
        location.query = this.$route.query;
        this.$router.push(location);
      }
      else {
        let location = {name: 'Search', params: {keyword: this.keyword || undefined}};
        this.$router.push(location);
      }
    },
    // 退出登录按钮
    async loginout() {
      try {
        await this.$store.dispatch('commitLoginout');
        // 如果退出成功，跳转到home页面
        this.$router.push('/home')
      } catch (error) {
        alert(error.message)
      }
    }
  },
  mounted() {
    this.$bus.$on('clearKeyword', () => {
      this.keyword = ''
    })
  },
  computed: {
    // 查看此时仓库有没有用户名
    userName() {
      return this.$store.state.user.userInfo.name
    },
  }
};
</script>

<style lang="less" scoped>
.header {
  & > .top {
    background-color: #eaeaea;
    height: 30px;
    line-height: 30px;

    .container {
      width: 1200px;
      margin: 0 auto;
      overflow: hidden;

      .loginList {
        float: left;

        p {
          float: left;
          margin-right: 10px;

          .register {
            border-left: 1px solid #b3aeae;
            padding: 0 5px;
            margin-left: 5px;
          }
        }
      }

      .typeList {
        float: right;

        a {
          padding: 0 10px;

          & + a {
            border-left: 1px solid #b3aeae;
          }
        }
      }
    }
  }

  & > .bottom {
    width: 1200px;
    margin: 0 auto;
    overflow: hidden;

    .logoArea {
      float: left;

      .logo {
        img {
          width: 175px;
          margin: 25px 45px;
        }
      }
    }

    .searchArea {
      float: right;
      margin-top: 35px;

      .searchForm {
        overflow: hidden;

        input {
          box-sizing: border-box;
          width: 490px;
          height: 32px;
          padding: 0px 4px;
          border: 2px solid #ea4a36;
          float: left;

          &:focus {
            outline: none;
          }
        }

        button {
          height: 32px;
          width: 68px;
          background-color: #ea4a36;
          border: none;
          color: #fff;
          float: left;
          cursor: pointer;

          &:focus {
            outline: none;
          }
        }
      }
    }
  }
}
</style>
