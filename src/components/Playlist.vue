<template>
  <div class="playlist">
    <div class="songlist-box">
      <div class="songlist">
        <div
          class="song"
          v-for="(item, index) in $store.state.songlist"
          :key="index"
          :class="{ playing: $store.state.id == item.id }"
          @click="playMuisc(item.id, index)"
        >
          <div class="van-ellipsis songname">
            {{ index + 1 + "." + item.name }}
          </div>
          <div class="van-ellipsis arname">{{ item.ar[0].name }}</div>
          <div class="playing" v-if="item.id == $store.state.id">
            <div
              :class="{
                run: $store.state.isplay,
                paused: !$store.state.isplay,
              }"
              class="one"
            ></div>
            <div
              :class="{
                run: $store.state.isplay,
                paused: !$store.state.isplay,
              }"
              class="two"
            ></div>
            <div
              :class="{
                run: $store.state.isplay,
                paused: !$store.state.isplay,
              }"
              class="three"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getSongUrl, getLyric, artistdetail } from "../api/singerdetail";
export default {
  data() {
    return {};
  },
  methods: {
    // 获取歌手的信息
    artistdetailFun(id) {
      artistdetail({ id }).then((data) => {
        console.log(data);
        if (data.code == 200) {
          // this.detail = data.data.artist;
          this.$store.commit("changepic", data.data.artist.cover);
        }
      });
    },
    // 切换音乐
    playMuisc(id, index) {
        getSongUrl({ id }).then((data) => {
          // console.log(data);
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
            this.artistdetailFun(song.ar[0].id);
          }
        });
        // 获取音乐歌词
        this.getlyric(id);
    },
    // 获取歌词
    getlyric(id) {
      getLyric({ id }).then((data) => {
        if (data.code == 200) {
          this.$store.commit("changeLyric", data.lrc.lyric);
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.playlist {
  width: 100%;
  height: 100%;
  border-radius: 4px;
  overflow: auto;
  .songlist-box {
    .songlist {
      width: 100%;
      height: 100%;
      //   border-radius: 5px;
      .song {
        width: 100%;
        height: 40px;
        display: flex;
        line-height: 40px;
        background-color: rgb(249, 249, 249);
        &:nth-of-type(2n) {
          background-color: rgb(240, 240, 240);
        }
        .songname {
          width: 130px;
          height: 30px;
          padding-left: 30px;
        }
        .arname {
          width: 60px;
          height: 30px;
          margin-left: 40px;
        }
        .playing {
          width: 60px;
          height: 30px;
          display: flex;
          transform: rotate(180deg);
          margin-right: 10px;
          margin-top: 5px;
          div {
            width: 6px;
            height: 30px;
            margin-left: 4px;
            // margin-top: 20px;
            background-color: red;
          }
          .run {
            animation-play-state: running !important;
          }
          .paused {
            animation-play-state: paused !important;
          }
          .one {
            animation: one 0.8s linear 0s infinite;
          }
          .two {
            animation: two 0.8s linear 0.3s infinite;
          }
          .three {
            animation: three 0.8s linear 0.9s infinite;
          }
        }
      }
      .playing {
        color: red;
      }
    }
  }
}
@keyframes three {
  0% {
    height: 0px;
  }
  25% {
    height: 20px;
  }
  50% {
    height: 30px;
  }
  75% {
    height: 20px;
  }
  100% {
    height: 0px;
  }
}
@keyframes two {
  0% {
    height: 0px;
  }
  25% {
    height: 20px;
  }
  50% {
    height: 30px;
  }
  75% {
    height: 20px;
  }
  100% {
    height: 0px;
  }
}
@keyframes one {
  0% {
    height: 0px;
  }
  25% {
    height: 20px;
  }
  50% {
    height: 30px;
  }
  75% {
    height: 20px;
  }
  100% {
    height: 0px;
  }
}
</style>