<template>
  <div class="mv">
    <div class="mv-box">
      <div class="mv-item" v-for="(item, index) in showMv" :key="item.id">
        <div class="img-box">
          <img
            class="img"
            :src="item.cover"
            alt=""
            v-if="!(index == activeIndex)"
          />
          <img
            class="img1"
            v-if="!(index == activeIndex)"
            @click="changeActive(index, item.id)"
            src="../assets/img/bofang1.png"
            alt=""
          />
          <!-- <div class="duration" v-if="!(index == activeIndex)">2:00</div> -->
          <!-- <div class="ear-box" v-if="!(index==activeIndex)">
              <div class="ear">
                  <img src="../assets/img/bofang3.png" alt="">
              </div>
              <div class="playcount">{{item.playCount}}111</div>
          </div> -->
          <video
            v-if="index == activeIndex"
            controls
            autoplay
            :ref="'video' + index"
            :src="item.url"
          ></video>
        </div>
        <div class="Info">
          <div class="name">
            <div class="mvname van-ellipsis" @click="jumpDetail(item.id)">{{ item.name }}</div>
            <div class="arname van-ellipsis">{{ item.artistName }}</div>
          </div>
        </div>
      </div>
      <div class="loading" @click="push">
        {{ showMv.length == 100 ? "已经到底了！！" : "点击加载更多......" }}
      </div>
    </div>
  </div>
</template>

<script>
import { getAllMv, getMvUrl } from "../api/mv";
export default {
  data() {
    return {
      // 所有Mv
      allMv: [],
      // 显示的Mv
      showMv: [],
      // 显示的条数
      showIndex: 1,
      //   播放的索引值
      activeIndex: -1,
      //   播放的情况
      playDetailArr: [],
    };
  },
  created() {
    this.getAllMvFun();
  },
  methods: {
    //   跳转页面
      jumpDetail(id){
          this.$router.push({path:'./mvdetail',query:{id}})
      },
    // 获取所有Mv
    getAllMvFun() {
      getAllMv().then((data) => {
        if (data.code == 200) {
          console.log(data);
          this.allMv = data.data;
          this.push();

          console.log(this.showMv);
          console.log("playDetailArr", this.playDetailArr);
        }
      });
    },
    // 获取mv视屏
    getMvUrlFun(id, index) {
      getMvUrl({ id }).then((data) => {
        if (data.code == 200) {
          let video = "video" + index;
          this.$set(this.showMv[index], "url", data.data.url);
            console.log(this.$refs[video][0], this.playDetailArr[index].currentTime);
          this.$refs[video][0].currentTime =
            this.playDetailArr[index].currentTime;
        }
      });
    },
    changeActive(index, id) {
      this.activeIndex = index;
      // 获取mv的url并播放
      this.getMvUrlFun(id, index);
      this.ListeningEvents(index)

    },
    // 监听事件
    ListeningEvents(index) {
      console.log("this.$refs ==>", this.$refs, index);
      this.$nextTick(() => {
        let video = "video" + index;
        this.$refs[video][0].addEventListener("timeupdate", () => {
          this.$set(
            this.playDetailArr[index],
            "currentTime",
            this.$refs[video][0].currentTime
          );

            console.log(this.playDetailArr[index].currentTime);
        //   this.playDetailArr[index].currentTime = this.$refs[video][0].currentTime;
        });
      });
    },
    // 加载更多mv
    push() {
      if (this.showMv.length == 100) {
        return;
      }

      let arr = this.allMv.slice(
        10 * this.showIndex,
        10 * (this.showIndex + 1)
      );
      arr.forEach((item) => {
        this.showMv.push(item);
        this.playDetailArr.push({
          currentTime: 0,
          url: "",
        });
      });
      this.showIndex++;
    },
  },
};
</script>

<style lang="less" scoped>
@import "../assets/css/mv.less";
</style>