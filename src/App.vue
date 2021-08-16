<template>
  <div id="app">
    <router-view></router-view>

    <div class="maxbig" v-if="$store.state.src">
      <Playaudio @Switchpage="top = '0px'"></Playaudio>
    </div>
    <div class="songdetail-box">
      <Songdetail :top="top" @changeTop="top = '105vh'"></Songdetail>
    </div>
    <audio ref="audio" autoplay v-show="false" controls src=""></audio>
  </div>
</template>

<script>
import Playaudio from "@/components/Playaudio.vue";
import Songdetail from "@/components/Songdetail.vue";
import {getSongUrl,getLyric,artistdetail} from './api/singerdetail';
export default {
  name: "app",
  components: { Playaudio, Songdetail },
  data() {
    return {
      top: "105vh",
    };
  },
  computed: {
    show() {
      if (this.$store.state.audio) {
        return this.$store.state.audio.src === "http://localhost:8080/";
      } else {
        return false;
      }
    },
  },
  mounted() {
    this.$store.commit("audio", this.$refs.audio);
    this.$nextTick(() => {
      this.monitorAudioPlay(this.$refs.audio);
    });
  },
  methods: {
    monitorAudioPlay(audio) {
      audio.addEventListener("pause", () => {
        this.$store.commit("changeIsplay", false);
      });
      audio.addEventListener("play", () => {
        this.$store.commit("changeIsplay", true);
      });
      // 播放中触发
      audio.addEventListener("timeupdate", () => {
        this.$store.commit("changeCurrentTime", audio.currentTime);
      });
      // 换音乐时触发
      audio.addEventListener("durationchange", () => {
        this.$store.commit("changeduration", audio.duration);
      });
      audio.addEventListener("ended", () => {
        let state = this.$store.state;
        var index = 0;
        if (state.playOrder == 0) {
          index = state.index;
        } else if (state.playOrder == 1) {
          index = this.$store.state.index + 1;
        } else {
          index = Math.floor(Math.random() * state.songlist.length);
        }
        console.log(index);
        let id = state.songlist[index].id;
        this.automaticplayMuisc(id, index);
      });
    },
     // 自动切换歌曲
    automaticplayMuisc(id, index) {
      getSongUrl({ id }).then((data) => {
        if (data.code == 200) {
          this.$store.state.audio.src = data.data[0].url;
          let song = this.$store.state.songlist[index];
          let obj = {
            songname: song.name,
            arname: song.ar[0].name,
            songlist: this.$store.state.songlist,
            id: song.id,
            src: data.data[0].url,
            index: index,
          };
          this.$store.commit("changeInfo", obj);
          console.log("图片",this.$store.state.songlist[index]);
            this.artistdetailFun(this.$store.state.songlist[index].ar[0].id);
        }
        // 获取音乐歌词
        this.getlyric(id);
      });
    },
    // 获取歌词
     getlyric(id) {
      getLyric({ id }).then((data) => {
        if (data.code == 200) {
          if (data.lrc.lyric) {
            this.$store.commit("changeLyric", data.lrc.lyric);
          } else {
            this.$store.commit("changeLyric", "纯音乐，请欣赏");
          }
        }
      });
    },
    //  获取歌手的信息
     artistdetailFun(id) {
      artistdetail({ id }).then((data) => {
        if (data.code == 200) {
          // this.detail = data.data.artist;
          this.$store.commit("changepic", data.data.artist.cover);
        }
      });
    },
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* padding-bottom: 50px; */
}
* {
  margin: 0;
  padding: 0;
}
.maxbig {
  width: 100%;
  height: 50px;
  /* background-color: aqua; */
  position: sticky;
  bottom: 0px;
  left: 0;
  z-index: 910;
}
.songdetail-box {
  z-index: 910px;
}
</style>
