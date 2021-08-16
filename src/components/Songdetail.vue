<template>
  <div class="songdetail" :style="{ top: top }">
    <div
      class="backgroundimage"
      :style="{ backgroundImage: `url(${$store.state.pic})` }"
    ></div>
    <div class="songdetail-box">
      <div class="top">
        <div class="img-box" @click="changetop">
          <img src="../assets/img/down.png" alt="" />
        </div>
        <div class="name">
          <div class="van-ellipsis songname">{{ $store.state.songname }}</div>
          <div class="van-ellipsis arname">{{ $store.state.arname }}</div>
        </div>
      </div>
      <div class="center">
        <div class="playLyric" @click="lyricProgress" v-show="isshowjump">
          <img src="../assets/img/bofang2.png" alt="" />
        </div>
        <div
          class="img-box"
          :style="{ left: isshowLyric ? '-100vw' : '73px' }"
          @click="changeisshowLyric"
        >
          <img
            :src="$store.state.pic"
            alt=""
            class="rotate"
            :class="{ run: $store.state.isplay, stop: !$store.state.isplay }"
          />
        </div>
        <div
          class="lyric-box"
          :style="{ left: isshowLyric ? '10vw' : '110vw' }"
        >
          <div class="lyric" @click.stop="changeisshowLyric">
            <!-- <ul class="ul" @click.stop="changeMgTop" ref="ul"> -->
            <ul
              class="ul"
              @touchstart.stop="startUl"
              @touchmove.stop="moveUl"
              @touchend.stop="endUl"
              ref="ul"
              :style="{ marginTop: mgtop + 'px' }"
            >
              <li
                v-for="(item, index) in lyricArr"
                :class="{ active: indexActive == index }"
                :key="index"
              >
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="order" v-show="isshow">
          {{
            $store.state.playOrder == 0
              ? "单曲循环"
              : $store.state.playOrder == 1
              ? "顺序播放"
              : "随机播放"
          }}
        </div>
        <div class="progress-box">
          <div class="current">{{ currentTimes }}</div>
          <div class="progress">
            <div class="copy">
              <van-slider
                @drag-start="dragStart"
                @drag-end="dragEnd"
                @change="changeCurrent"
                :max="$store.state.duration"
                v-model="currentTime"
                active-color="#ee0a24"
              >
                <template #button>
                  <div class="custom-button"></div>
                </template>
              </van-slider>
            </div>
          </div>
          <div class="current">{{ duration }}</div>
        </div>
        <div class="five-img">
          <div v-for="(item, index) in imgs" :key="index">
            <img
              :src="
                index == 2 && !$store.state.isplay
                  ? item[1]
                  : index == 0 && $store.state.playOrder == 1
                  ? item[1]
                  : index == 0 && $store.state.playOrder == 2
                  ? item[2]
                  : item[0]
              "
              alt=""
              @click="witchState(index)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { artistdetail, getSongUrl, getLyric } from "../api/singerdetail";
export default {
  props: ["top"],
  data() {
    return {
      currentTime: 0,
      // 是否显示播放顺序的状态
      isshow: false,
      // 是否显示歌词板块
      isshowLyric: false,
      imgs: [
        [
          require("../assets/img/loop.png"),
          require("../assets/img/order.png"),
          require("../assets/img/random.png"),
        ],
        [require("../assets/img/last.png")],
        [
          require("../assets/img/stop.png"),
          require("../assets/img/bofang1.png"),
        ],
        [require("../assets/img/next.png")],
        [require("../assets/img/like.png")],
      ],
      indexActive: 0,
      // 是否显示跳转播放进度的图标
      isshowjump: false,
      // 是否点击了跳转播放进度的图标
      isclickjump: false,
      // 刚开始时ul的margintop
      mgtop: 230,
      // 各个li的高度
      heightArr: [],
      // 前几个相加的li高度
      addHeightArr: [],
      // 移动时记录ul的margintop值
      temporaryMgtop: 0,
      // 开始移动歌词时的位置
      start: 0,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.monitorAudioPlay(this.$store.state.audio);
    });
  },
  methods: {
    // 修改是否显示歌词
    changeisshowLyric() {
      this.isshowjump = false;
      this.isshowLyric = !this.isshowLyric;
      this.getHeughtArr();
    },
    // 跳转歌词的进度
    lyricProgress() {
      this.isclickjump = true;
      this.isshowjump = false;
      let margintop = Math.abs(parseInt(this.$refs.ul.style.marginTop));
      for (let i = 0; i < this.addHeightArr.length; i++) {
        // console.log("margintop", margintop);
        if (
          margintop >= Math.abs(230 - this.addHeightArr[i]) &&
          margintop < Math.abs(230 - this.addHeightArr[i + 1])
        ) {
          this.indexActive = i + 1;
          // console.log(this.$store.state.audio);
          this.changemgtop = function () {
            this.$refs.ul.style.marginTop =
              this.mgtop - this.addHeightArr[this.indexActive] + "px";
          };
          this.$store.state.audio.currentTime = this.timeArr[this.indexActive];
          return;
        }
      }
    },
    // 手动改变ul的margintop属性值
    startUl(e) {
      if (e.touches[0]) {
        this.start = e.touches[0].pageY;
        this.temporaryMgtop = parseInt(this.$refs.ul.style.marginTop);
      }
    },
    moveUl(e) {
       this.isshowjump = true;
      this.changemgtop = function () {};
      this.$refs.ul.style.marginTop =
        this.temporaryMgtop - (this.start - e.touches[0].pageY) + "px";
    },
    endUl() {
     
      setTimeout(() => {
        if (this.isshowjump) {
          this.isshowjump = false;
          this.changemgtop = function () {
            this.$refs.ul.style.marginTop =
              this.mgtop - this.addHeightArr[this.indexActive] + "px";
          };
          this.changemgtop();
        }
      }, 2000);
    },
    // 播放时改变Margintop值
    changemgtop() {
      this.$refs.ul.style.marginTop =
        this.mgtop - this.addHeightArr[this.indexActive] + "px";
    },
    // 隐藏歌词页面
    changetop() {
      this.$emit("changeTop");
    },
    monitorAudioPlay(audio) {
      audio.addEventListener("durationchange", () => {
        this.$store.commit("changeIsplay", false);
        this.getHeughtArr();
      });
      // 网络差,缓冲时触发
      audio.addEventListener("waiting", () => {
        this.$store.commit("changeIsplay", true);
      });
      audio.addEventListener("timeupdate", () => {
        this.currentTime = audio.currentTime;
        this.activeIndex();
      });
    },
    // 点击暂停播放时触发
    playStopFun() {
      let state = this.$store.state;
      if (state.isplay) {
        state.audio.pause();
      } else {
        state.audio.play();
      }
    },
    // 获取歌手的信息
    artistdetailFun(id) {
      artistdetail({ id }).then((data) => {
        // console.log(data);
        if (data.code == 200) {
          // this.detail = data.data.artist;
          this.$store.commit("changepic", data.data.artist.cover);
        }
      });
    },
    // 切换音乐
    playMuisc(id, index) {
      getSongUrl({ id }).then((data) => {
        if (data.code == 200) {
          this.$store.state.audio.src = data.data[0].url;
          let song = this.$store.state.songlist[index];
          this.getlyric(song.id);
          artistdetail({ id: song.ar[0].id }).then((res) => {
            if (res.code == 200) {
              let obj = {
                songname: song.name,
                arname: song.ar[0].name,
                id: song.id,
                src: data.data[0].url,
                index: index,
                songlist: this.$store.state.songlist,
              };
              this.$store.commit("changeInfo", obj);
              this.artistdetailFun(song.ar[0].id);
            }
          });
        }
      });
    },
    // 播放顺序
    witchState(index) {
      let state = this.$store.state;
      if (index == 0) {
        if (!this.isshow) {
          this.$store.commit("cyhangePlayOrder");
          this.isshow = true;
          setTimeout(() => {
            this.isshow = false;
          }, 2000);
        }
      } else if (index == 1) {
        if (state.playOrder == 0) {
          state.audio.load();
        } else if (state.playOrder == 1) {
          if (state.index != 0) {
            this.playMuisc(state.songlist[state.index - 1].id, state.index - 1);
          } else {
            state.audio.load();
          }
        } else {
          let index = Math.floor(Math.random() * state.songlist.length);
          this.playMuisc(state.songlist[index - 1].id, state.index);
        }
      } else if (index == 2) {
        this.playStopFun();
      } else if (index == 3) {
        if (state.playOrder == 0) {
          state.audio.load();
        } else if (state.playOrder == 1) {
          if (state.index != state.songlist.length - 1) {
            this.playMuisc(state.songlist[state.index + 1].id, state.index + 1);
          } else {
            state.audio.load();
          }
        } else {
          let index = Math.floor(Math.random() * state.songlist.length);
          this.playMuisc(state.songlist[index].id, index);
        }
      }
    },
    // 开始拖拽进度条时触发
    dragStart() {
      this.$store.state.audio.removeEventListener("timeupdate", () => {});
    },
    dragEnd() {
      this.$store.state.audio.currentTime = this.currentTime;
      this.$store.state.audio.addEventListener("timeupdate", () => {
        this.currentTime = this.$store.state.audio.currentTime;
        this.$store.commit(
          "changeCurrentTime",
          this.$store.state.audio.currentTime
        );
      });
    },
    changeCurrent(time) {
      // console.log(time);
      this.$store.state.audio.currentTime = time;
    },
    // 获取歌词
    getlyric(id) {
      getLyric({ id }).then((data) => {
        if(data.lrc.lyric){
            this.$store.commit("changeLyric", data.lrc.lyric);
          }else{
            this.$store.commit("changeLyric", "纯音乐，请欣赏");
          }
      });
    },
    // 歌词亮的索引值
    activeIndex() {
      let currentTime = this.$store.state.currentTime;
      for (let i = 0; i < this.timeArr.length; i++) {
        if (
          currentTime >= this.timeArr[i] &&
          currentTime < this.timeArr[i + 1]
        ) {
          this.indexActive = i;
          return;
        }
      }
    },
    // 获取li的高度数组
    getHeughtArr() {
      // console.log("this.$refs",this.$refs.ul.children.length);
      let heightArr = [];
      let addHeightArr = [];
      let addHeight = 0;
      for (let i = 0; i < this.$refs.ul.children.length; i++) {
        let height = this.$refs.ul.children[i].clientHeight;
        addHeight += height;
        heightArr.push(height);
        addHeightArr.push(addHeight);
      }
      this.heightArr = heightArr;
      this.addHeightArr = addHeightArr;
    },
  },
  computed: {
    currentTimes: function () {
      let currentTime = parseInt(this.$store.state.currentTime);
      let min = currentTime / 60;
      let seconds = 0;
      min = min > 1 ? min : "0";
      seconds = min >= 1 ? currentTime % 60 : currentTime;
      seconds = seconds > 9 ? seconds : "0" + seconds;
      let time = parseInt(min) + ":" + seconds;
      return time;
    },
    // 总时长
    duration: function () {
      let currentTime = parseInt(this.$store.state.duration);
      let min = currentTime / 60;
      let seconds = 0;
      min = min > 0 ? min : "0";
      seconds = min > 0 ? currentTime % 60 : currentTime;
      seconds = seconds >= 10 ? seconds : "0" + seconds;
      let duration = parseInt(min) + ":" + seconds;
      return duration;
    },
    // 歌词数组
    lyricArr() {
      if(this.$store.state.lyric.length == 7){
        return ["纯音乐，请欣赏"]
      }
      let allLyric = this.$store.state.lyric.split("\n");

      // let timeArr = []
      let lyricArr = [];
      allLyric.forEach((item, index) => {
        let arr = item.split("]");
        if (index != allLyric.length - 1) {
          lyricArr.push(arr[1]);
        }
      });
      return lyricArr;
    },
    // 每段歌词的时间段
    timeArr() {
      if(this.$store.state.lyric.length == 7){
        return 0
      }
      let allLyric = this.$store.state.lyric.split("\n");

      let timeArr = [];
      allLyric.forEach((item, index) => {
        if (index != allLyric.length - 1) {
          let arr = item.split("]");
          let times = arr[0].slice(1).split(":");
          let time =
            (parseInt(times[0]) * 60 * 1000 +
              Number(parseFloat(times[1]).toFixed(2)) * 1000) /
            1000;
          timeArr.push(time);
        }
      });
      return timeArr;
    },
    // ul的marginTop的属性值
    // margintop(){
    //   // console.log(this.mgtop-this.heightArr[this.indexActive]);
    //   this.mgtop = this.mgtop + this.heightArr[this.indexActive]
    //   // let marginto = this.mgtop
    //   return 400
    // }
  },
  watch: {
    indexActive() {
      this.changemgtop();
    },
  },
};
</script>

<style lang="less" scoped>
@import "../assets/css/songdetail.less";
</style>