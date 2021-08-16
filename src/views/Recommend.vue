<template>
  <div class="recommend">
    <div class="swipe-box">
      <div class="swipe">
        <van-swipe>
          <van-swipe-item v-for="(item, index) in swipeInfo" :key="index">
            <img :src="item.pic" alt="" />
          </van-swipe-item>
        </van-swipe>
      </div>
    </div>
    <div class="recommendsong-bigbox">
      <div class="recommendsong-box" v-for="(v, i) in recommendInfo" :key="i">
        <div class="recommendsong">{{ v.name }}</div>
        <div class="songlist">
          <div
            class="ul"
            :style="{ width: v.recommendsongList.length * 120 + 'px' }"
          >
            <Single
              class="li"
              v-for="(item, index) in v.recommendsongList"
              :key="index"
              :playcount="item.playCount"
              :img="item.picUrl"
              :name="item.name"
              :i="i"
              :index="index"
              :id="item.id"
              :songlist="v.recommendsongList"
              @width-size="singlewidthsize"
            ></Single>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getBanner,
  getRecommendsongList,
  getRecommendmMv,
  getRecommendNewsong,
  getRecommendDjprogram,
} from "../api/recommend.js";
// import { getSongDetail } from "../api/recommend";
import Single from "../components/Single.vue";
export default {
  components: {
    Single,
  },
  data() {
    return {
      swipeInfo: [],

      recommendInfo: [
        {
          name: "推荐歌单",
          // 推荐歌单
          recommendsongList: [],
        },
        {
          name: "推荐新音乐",
          // 推荐新音乐
          recommendsongList: [],
        },
        {
          name: "推荐mv",
          recommendsongList: [],
        },
        {
          name: "推荐电台",
          recommendsongList: [],
        },
      ],
      singleWidth: 0,
    };
  },
  methods: {
    BannerFun() {
      getBanner().then((data) => {
        // console.log("data ==> ", data);
        if (data.code == 200) {
          data.banners.forEach((element) => {
            this.swipeInfo.push(element);
          });
        }
      });
    },
    // 获取推荐
    getRecommendsongListFun() {
      // 推荐歌单
      getRecommendsongList().then((data) => {
        if (data.code == 200) {
          data.result.forEach((element) => {
            this.recommendInfo[0].recommendsongList.push(element);
          });
        }
      });
      // 推荐新音乐
      getRecommendNewsong().then((data) => {
        if (data.code == 200) {
          data.result.forEach((element) => {
            this.recommendInfo[1].recommendsongList.push(element);
          });
        }
      });
      // 推荐mv
      getRecommendmMv().then((data) => {
        if (data.code == 200) {
          data.result.forEach((element) => {
            this.recommendInfo[2].recommendsongList.push(element);
          });
        }
      });
      // 推荐电台
      getRecommendDjprogram().then((data) => {
        if (data.code == 200) {
          data.result.forEach((element) => {
            this.recommendInfo[3].recommendsongList.push(element);
          });
        }
      });
      // 推荐节目
      // getRecommendProgram().then((data) => {
      //   if (data.code == 200) {
      //     if(data.result.length != 0){
      //       data.result.forEach((element) => {
      //         this.recommendInfo[4].recommendsongList.push(element);
      //       });
      //     }else{
      //       this.recommendInfo[4] = {}
      //     }
      //   }
      // });
    },
    singlewidthsize(size) {
      this.singleWidth = size;
    },
  },
  created() {
    this.BannerFun();
    this.getRecommendsongListFun();
  },
};
</script>

<style lang="less" scoped>
@import "../assets/css/recommend.less";
</style>