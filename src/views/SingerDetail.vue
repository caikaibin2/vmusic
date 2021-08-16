<template>
  <div class="singerdetail">
    <div class="top" :style="{ backgroundImage: `url(${pic})` }">
      <div class="type">
        <div class="img-box" @click="upperLevel">
          <img src="../assets/img/left.png" alt="" />
        </div>
        <div class="singer">
          <span>{{ type }}</span>
        </div>
      </div>
      <div class="text-playcount">
        <div class="text">{{ detail.name }}</div>
        <!-- <div class="playcount">
          <img src="../assets/img/ear.png" alt="" />&nbsp;
          <p>191万</p>
        </div> -->
      </div>
    </div>
    <div class="songList-box">
      <div class="top-label">
        <div class="img-box">
          <img src="../assets/img/play.png" alt="" />
        </div>
        <div class="playall">
          播放全部<span>(共{{ songlist.length }}首)</span>
        </div>
      </div>
      <div
        class="songlist"
        :style="{ height: $store.state.src == null ? '375px' : '326px' }"
      >
        <div class="song" v-for="(item, index) in songlist" :key="index">
          <div class="sort">{{ index + 1 }}</div>
          <div class="name">
            <div class="songname van-ellipsis">{{ item.name }}</div>
            <div class="arname">{{ item.ar[0].name }}</div>
          </div>
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
          <div
            class="playing1"
            v-if="!(item.id == $store.state.id)"
            @click.stop="playMuisc(item.id, index)"
          >
            <img src="../assets/img/play.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  artistdetail,
  getArtistSongs,
  getSongUrl,
  getLyric,
  getplaylist
} from "../api/singerdetail";
import { getPlaylistDetail } from "../api/ranking";
export default {
  data() {
    return {
      detail: {},
      songlist: [],
      pic: null,
      type: "",
    };
  },
  mounted() {
    if(this.$route.query.filter){
      getplaylist({id:this.$route.query.id}).then(data => {
        console.log("详情的歌单 ==>",data);
        if(data.code ==200){
          this.pic = data.playlist.coverImgUrl
          this.songlist =  data.playlist.tracks
        }
      })
      return ;
    }
    if (this.$route.params.id) {
      this.getPlaylistDetailFun(this.$route.params.id);

      this.type = "排行榜";
    } else {
      this.artistdetailFuns(this.$route.query.id);
      this.getArtistSongsFun(this.$route.query.id);

      this.type = "歌手";
    }
    this.$nextTick(() => {
      this.monitorAudioPlay(this.$store.state.audio);
    });
  },
  methods: {
    // 返回上一级
    upperLevel() {
      // console.log('111')
      this.$router.go(-1);
    },

    // 获取歌手的信息
    artistdetailFun(id) {
      artistdetail({ id }).then((data) => {
        if (data.code == 200) {
          // this.detail = data.data.artist;
          this.$store.commit("changepic", data.data.artist.cover);
        }
      });
    },
    artistdetailFuns(id) {
      artistdetail({ id }).then((data) => {
        if (data.code == 200) {
          this.pic = data.data.artist.cover;
        }
      });
    },
    // 获取歌手的歌曲
    getArtistSongsFun(id) {
      getArtistSongs({ id }).then((data) => {
        if (data.code == 200) {
          this.songlist = data.songs;
        }
      });
    },
    // 切换音乐
    playMuisc(id, index) {
      getSongUrl({ id }).then((data) => {
        // console.log(data);
        if (data.code == 200) {
          this.$store.state.audio.src = data.data[0].url;
          let song = this.songlist[index];
          let obj = {
            songname: song.name,
            arname: song.ar[0].name,
            songlist: this.songlist,
            id: song.id,
            src: data.data[0].url,
            index: index,
          };
          this.$store.commit("changeInfo", obj);
          this.artistdetailFun(song.ar[0].id);
          console.log("切换歌曲");
        }
        // 获取音乐歌词
        this.getlyric(id);
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
          this.artistdetailFun(song.ar[0].id);
        }
        // 获取音乐歌词
        this.getlyric(id);
      });
    },
    // 获取歌词
    getlyric(id) {
      getLyric({ id }).then((data) => {
        if (data.code == 200) {
          console.log("歌词 ==>",data);
          if(data.nolyric){
            this.$store.commit("changeLyric", "纯音乐，请欣赏");
            return ;
          }
          if(data.lrc.lyric){
            this.$store.commit("changeLyric", data.lrc.lyric);
          }
        }
      });
    },
    // 监听音频的暂停播放事件
    monitorAudioPlay(audio) {
      audio.addEventListener("durationchange", () => {
        // this.isplay = false;
      });
      audio.addEventListener("ended", () => {
        console.log(1111222);
        let state = this.$store.state;
        var index = state.index;
        if (state.playOrder == 0) {
          index = state.index;
        } else if (state.playOrder == 1) {
          index = this.$store.state.index + 1;
        } else {
          index = Math.floor(Math.random() * state.songlist.length);
        }
        let id = state.songlist[index].id;
        this.automaticplayMuisc(id, index);
      });
    },
    // 获取排行版详情
    getPlaylistDetailFun(id) {
      getPlaylistDetail({ id }).then((data) => {
        if (data.code == 200) {
          this.detail = data.playlist;
          this.pic = this.detail.coverImgUrl;
          this.songlist = data.playlist.tracks;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
@import "../assets/css/singerdetail.less";
</style>