<template>
  <div class="playaudio">
    <div class="img-box">
      <div class="img-box1">
        <img
          :class="{ run: isplay == true, paused: isplay == false }"
          :src="$store.state.pic"
          @click="switchpage"
        />
      </div>
      <div class="name">
        <div class="songname van-ellipsis">{{ $store.state.songname }}</div>
        <div class="arname van-ellipsis">{{ $store.state.arname }}</div>
      </div>
      <div class="img-box2">
        <img
          @click="ispaused"
          :src="isplay == true ? srcs[1] : srcs[0]"
          alt=""
        />
      </div>
      <div class="img-box3" @click="showplaylist">
        <img src="../assets/img/gengduo.png" alt="" />
      </div>
    </div>
    <!-- <div
      class="playlist-box"
      :class="{ shows: isplaylist, hiddens: !isplaylist }"
    >
     
    </div> -->
    <div class="playlist-box1">
      <van-popup
        v-model="show"
        position="bottom"
        :style="{ height: '50%', paddingBottom: '70px' }"
      >
        <div class="playstate-box">
          <div class="playstate">
            <div class="img-box">
              <img
                :src="
                  $store.state.playOrder == 0
                    ? imgs[0]
                    : $store.state.playOrder == 1
                    ? imgs[1]
                    : imgs[2]
                "
                @click="$store.commit('cyhangePlayOrder')"
              />
            </div>
            <div>{{$store.state.playOrder == 0
                    ? '单曲循环'
                    : $store.state.playOrder == 1
                    ? '列表播放'
                    : '随机播放'}}</div>
          </div>
          <div class="playstate">
            <div class="img-box">
              <img src="../assets/img/like.png" />
            </div>
            <div>全部收藏</div>
          </div>
        </div>
        <Playlist></Playlist>
        <div class="close" @click="close">关闭</div></van-popup
      >
    </div>
  </div>
</template>

<script>
// import { pause } from "../js/auidioEvent";
import Playlist from "../components/Playlist.vue";
export default {
  components: { Playlist },
  data() {
    return {
      show: false,
      isplay: false,
      // 暂停播放的图标
      srcs: [
        require("../assets/img/bofang.png"),
        require("../assets/img/suspend.png"),
      ],
      // 这是播放状态的图标
      imgs: [
        require("../assets/img/loop.png"),
        require("../assets/img/order.png"),
        require("../assets/img/random.png"),
      ],
      isplaylist: false,
    };
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$store.state.audio) {
        this.monitorAudioPlay(this.$store.state.audio);
      }
    });
  },
  methods: {
    ispaused() {
      console.log(this.$store.state.audio.paused);
      if (this.$store.state.audio.paused == true) {
        this.$store.state.audio.play();
      } else {
        this.$store.state.audio.pause();
      }
    },
    // 监听音频的暂停播放事件
    monitorAudioPlay(audio) {
      audio.addEventListener("pause", () => {
        this.isplay = !this.isplay;
      });
      audio.addEventListener("play", () => {
        this.isplay = !this.isplay;
      });
      audio.addEventListener("durationchange", () => {
        this.isplay = false;
      });
      // 网络差,缓冲时触发
      audio.addEventListener("waiting", () => {
        this.isplay = true;
      });
    },
    // 显示播放列表
    showplaylist() {
      this.show = true;
      this.isplaylist = !this.isplaylist;
    },
    // 切换到歌词页面
    switchpage() {
      this.$emit("Switchpage");
    },
    close() {
      this.show = !this.show;
    },
  },
  computed: {},
};
</script>

<style lang="less" scoped>
@import "../assets/css/playaudio";
</style>