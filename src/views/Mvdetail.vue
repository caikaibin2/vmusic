<template>
  <div class="mvdetail">
    <div class="top">
      <div class="img-box" @click="returns">
        <img src="../assets/img/left.png" alt="" />
      </div>
      <div class="name">
        <div class="mvname van-ellipsis">{{ mvDetail.name }}</div>
        <div class="arname van-ellipsis">{{ mvDetail.artistName }}</div>
      </div>
    </div>
    <div class="video">
      <video controls autoplay :src="url"></video>
    </div>
    <div class="type">
      <div class="similar-box">
        <div @click="changeActive" class="similar" :class="{ active: active }">
          相似mv
        </div>
      </div>
      <div class="comment-box">
        <div @click="changeActive" class="comment" :class="{ active: !active }">
          评论
        </div>
      </div>
    </div>
    <div class="type-content">
      <div class="similarMv" :style="{ left: active ? '0px' : '-110vw' }">
        <div
          class="similarMv-box"
          v-for="(item, index) in mvsimiArr"
          :key="index"
        >
          <div class="img-box">
            <img :src="item.cover" @click="jumpPage(item.id)" alt="" />
          </div>
          <div class="name">
            <div class="mvname van-ellipsis">{{ item.name }}</div>
            <div class="arname van-ellipsis">{{ item.artistName }}</div>
          </div>
        </div>
      </div>

      <div class="comment" :style="{ left: active ? '110vw' : '25px' }">
        <div
          class="comment-item"
          v-for="(item, index) in commentArr"
          :key="index"
        >
          <div class="people">
            <div class="img-box">
              <img :src="item.user.avatarUrl" alt="" />
            </div>
            <div class="nickname van-ellipsis">{{ item.user.nickname }}</div>
          </div>
          <div class="content">
            {{ item.content }}
          </div>
          <div class="time-operation">
            <div class="time">{{ time(item.time) }}</div>
            <div class="operation">
              <div class="fabulous">
                <img src="../assets/img/fabulous.png" alt="" />
                <div class="number">{{ item.likedCount }}</div>
              </div>
              <!-- <div class="comments">
                <img src="../assets/img/comment.png" alt="" />
                <div class="number">123456</div>
              </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getMvdetailInfo,
  getMvComment,
  getMvsimi,
  getMvUrl,
  getMvdetail,
} from "../api/mv";
export default {
  data() {
    return {
      active: true,
      // 这是相似mv列表
      mvsimiArr: [],
      //   评论数组
      commentArr: [],
      //   mv的详细信息
      mvDetail: {},
      url: "",
      id: null,
    };
  },
  created() {
    console.log(this.$route);
    let id = this.$route.query.id;
    this.id = this.$route;
    this.allFun(id);
  },
  methods: {
    //   全部的请求函数
    allFun(id) {
      this.getMvdetailInfoFun(id);
      this.getMvCommentFun(id);
      this.getMvsimiFun(id);
      this.getMvUrlFun(id);
      this.getMvdetailFun(id);
    },
    // 获取评论点赞的数量
    getMvdetailInfoFun(mvid) {
      getMvdetailInfo({ mvid }).then((data) => {
        if (data.code == 200) {
          console.log("评论点赞数量", data);
          //   this.mvDetail.commentCount = data.commentCount
        }
      });
    },
    // 获取该mv的所有评论
    getMvCommentFun(id) {
      getMvComment({ id }).then((data) => {
        if (data.code == 200) {
          console.log("评论 data==>", data);
          this.commentArr = data.comments;
        }
      });
    },
    // 获取相似mv
    getMvsimiFun(mvid) {
      getMvsimi({ mvid }).then((data) => {
        if (data.code == 200) {
          console.log("这是相似mv ==>", data);
          this.mvsimiArr = data.mvs;
        }
      });
    },
    changeActive() {
      this.active = !this.active;
    },
    getMvUrlFun(id) {
      getMvUrl({ id }).then((data) => {
        if (data.code == 200) {
          console.log("url", data);
          this.url = data.data.url;
        }
      });
    },
    getMvdetailFun(mvid) {
      getMvdetail({ mvid }).then((data) => {
        if (data.code == 200) {
          console.log("mv的详细信息 ==>", data);
          this.mvDetail = data.data;
        }
      });
    },
    // 返回上一级
    returns() {
      this.$router.go(-1);
      //   this.allFun(this.$route.query.id)
    },
    // 跳转页面
        jumpPage(id) {
        this.$router.push({ path: "/mvdetail", query: { id } });
        this.allFun(id);
        },
    // 时间戳改成时间格式
    time(time) {
      var getTime = new Date(time); //从后台获取过来的时间戳
      Date.prototype.toLocaleString = function () {
        let date = new Date(getTime); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let Y = date.getFullYear() + "-";
        let M =
          (date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1) + "-";
        let D =
          date.getDate() < 10 ? "0" + date.getDate() : date.getDate() + " ";
        let H =
          date.getHours() < 10 ? "0" + date.getHours() : date.getHours() + " ";
        let MI =
          date.getMinutes() < 10
            ? "0" + date.getMinutes()
            : date.getMinutes() + " ";
        let S =
          date.getSeconds() < 10
            ? "0" + date.getSeconds()
            : date.getSeconds() + " ";
        return Y + M + D + "  " + "   " + H + ":" + MI + ":" + S;
      };

      return getTime.toLocaleString();
    },
  },
  watch: {
    $route: function () {
      //   console.log("newval ==>",newval);
      //   console.log("oldval ==>",oldval);
      // console.log("route",this.$route.query.id);
      this.allFun(this.$route.query.id);
      console.log(this.time());
    },
  },
};
</script>

<style lang="less" scoped>
@import "../assets/css/mvdetail.less";
</style>