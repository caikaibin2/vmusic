<template>
  <div class="home">
    <div class="lefts">
      <van-popup
        v-model="show"
        position="left"
        :style="{ width: '70%', height: '200%' }"
      >
        <div class="bigbox">
          <div class="login" @click="isloginPage">
            <div class="img-box">
              <img
                :src="
                  userPic ||
                  'https://p3.music.126.net/SUeqMM8HOIpHv9Nhl9qt9w==/109951165647004069.jpg'
                "
                alt=""
              />
            </div>
            <div class="name van-ellipsis">
              {{ userName || "立即登录" }}<span>></span>
            </div>
          </div>
          <div class="content">
            <div class="box">
              <div class="item" v-for="(item, index) in list" :key="index">
                <div class="img-box">
                  <img :src="item.img" alt="" />
                </div>
                <div class="text">{{ item.text }}</div>
                <div class="right-img">
                  <img :src="imgs[2]" alt="" />
                </div>
              </div>
            </div>
          </div>
          <div class="logOut" v-if="userPic" @click="logout">退出登录</div>
        </div>
      </van-popup>
    </div>
    <div class="top">
      <div class="vmuisc">
        <div class="left" @click="show = true">
          <img :src="imgs[0]" alt="" />
        </div>
        <div class="center">VMUISC</div>
        <div class="right" @click="go">
          <img :src="imgs[1]" alt="" />
        </div>
      </div>
      <div class="jump-box">
        <div
          class="jump"
          @click="clickJump(index)"
          v-for="(item, index) in jumpList"
          :key="index"
        >
          <router-link
            :class="{ active: jumpIndex == index }"
            :to="item.path"
            >{{ item.name }}</router-link
          >
        </div>
      </div>

      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { getUserInfo} from "../api/recommend";
export default {
  name: "Home",
  data() {
    return {
      show: false,
      imgs: [
        require("../assets/img/more.png"),
        require("../assets/img/search.png"),
        require("../assets/img/right_.png"),
        require("../assets/img/wdxx.png"),
      ],
      jumpList: [
        {
          path: "/recommend",
          name: "推荐",
        },
        {
          path: "/ranking",
          name: "排行",
        },
        {
          path: "/singer",
          name: "歌手",
        },
        {
          path: "/mv",
          name: "MV",
        },
      ],
      list: [
        {
          img: require("../assets/img/wdxx.png"),
          text: "我的信息",
        },
        {
          img: require("../assets/img/ybzx.png"),
          text: "云贝中心",
        },
        {
          img: require("../assets/img/czzzx.png"),
          text: "创作者中心",
        },
        {
          img: require("../assets/img/ycyp.png"),
          text: "云村有票",
        },
        {
          img: require("../assets/img/sc.png"),
          text: "商城",
        },
      ],
      userName: "",
      userPic: "",

      jumpIndex: 0,
    };
  },
  created() {
   
    let uid = window.localStorage.getItem("userId");
    if (uid) {
      this.getUserInfoFun(uid);
    } else {
      this.userPic = "";
      this.userName = "";
    }
    // 当前路由的路径
    this.currentRouter(this.$router.history.current.fullPath);
  },
  methods: {
    // 去搜索页面
    go() {
      this.$router.push({ path: "/search" });
    },
    clickJump(index) {
      this.jumpIndex = index;
      console.log(index);
    },
    // 还原路由的选项
    currentRouter(path) {
      for (let i = 0; i < this.jumpList.length; i++) {
        if (this.jumpList[i].path == path) {
          this.jumpIndex = i;
          return;
        }
      }
    },
    // 获取用户的信息
    getUserInfoFun(uid) {
      getUserInfo({ uid }).then((data) => {
        if (data.code == 200) {
          console.log("用户信息 ==>", data);
          this.userName = data.profile.nickname;
          this.userPic = data.profile.avatarUrl;
        }
      });
    },
    isloginPage() {
      if (window.localStorage.getItem("userId")) {
        return;
      }
      this.$router.push({ path: "/login" });
    },
    // 退出登录
    logout() {
      this.$dialog.confirm({
        message: "是否退出当前账号",
      })
        .then(() => {
          window.localStorage.removeItem("userId")
          window.localStorage.removeItem("token")
          // this.userPic = "";
          // this.userName = "";
          this.$router.push({path:'/login'})

        })
        .catch(() => {
          // on cancel
        });
    },
  },
};
</script>
<style lang="less" scoped>
@import "../assets/css/home.less";
</style>
