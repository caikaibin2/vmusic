<template>
  <div class="single" ref="single" @click="play">
    <div class="img-count">
      <img :src="img" alt="" />
      <div>{{ playCountFun(playcount) }}</div>
    </div>
    <div class="name van-multi-ellipsis--l2">
      {{ name }}
    </div>
  </div>
</template>

<script>
import {  getSongUrl, getLyric } from "../api/singerdetail";
import { getSongDetail } from "../api/recommend";

export default {
  props: ["playcount", "img", "name", "i", "index", "id", "songlist"],
  data() {
    return {
      singerid: 0,
      songs: [],
      copySongs: [],
      // 请求完数据之后才可以
      startIndex:0
    };
  },
  created() {
    if (this.i == 1) {
      // console.log("this.songlist==》", this.songlist);
      this.getSongDetailFuntion();
    }
  },
  mounted() {
    this.getSingleWidth();
   
  },
  methods: {
    playCountFun(playCount) {
      if (playCount >= 0 && playCount < 10000) {
        return playCount;
      } else if (playCount > 10000 && playCount < 100000000) {
        return (playCount / 10000).toFixed(2) + "万";
      } else if (playCount >= 100000000) {
        return (playCount / 100000000).toFixed(2) + "亿";
      }
    },
    getSingleWidth() {
      this.$emit("width-size", this.$refs.single.clientWidth);
    },
    play() {
      if(this.i == 0){
        this.$router.push({path:'/singerdetail',query:{id:this.id,filter:true}})
      }else if (this.i == 1 && this.startIndex == 15) {
        // 点击推荐音乐时触发
        this.getSongDetailFun(this.id);
        // this.playMuisc(this.id, this.index);
      }else if(this.i == 2){
        this.$router.push({path:'/mvdetail',query:{id:this.id}})
      }
    },
    // 获取音乐的详情信息
    getSongDetailFun(ids) {
      getSongDetail({ ids }).then((data) => {
        if (data.code == 200) {
          // console.log("音乐的详情信息", data);
          this.playMuisc(this.id, this.index, data.songs[0].name);
        }
      });
    },
    // 获取音乐的详情信息并排序
    getSongDetailFuntion() {
      this.songlist.forEach((item) => {
        getSongDetail({ ids: item.song.id }).then((data) => {
          if (data.code == 200) {
            // console.log("音乐的详情信息", data);
            this.songs.push(data.songs[0]);
            this.startIndex ++
          }
        });
      });
    },
    // 排序
    sort(){
       this.songlist.forEach((item) => {
        //  console.log("item==>",item.song.id,this.songs.length);
        for (let i = 0; i < this.songs.length; i++) {
          // console.log("this.songs[i].id==>",this.songs[i].id);
          if (item.song.id == this.songs[i].id) {
            this.copySongs.push(this.songs[i]);
            break;
          }
        }
      });
    },
    // 切换音乐
    playMuisc(id, index, arname) {
      getSongUrl({ id }).then((data) => {
        // console.log(data);
        if (data.code == 200) {
          this.$store.state.audio.src = data.data[0].url;
          console.log("this.copySongs ====>",this.copySongs);
          let obj = {
            songname: this.name,
            arname,
            songlist: this.copySongs,
            id: this.id,
            src: data.data[0].url,
            index: index,
          };
          this.$store.commit("changeInfo", obj);
          this.$store.commit("changepic", this.songlist[index].picUrl);
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
          console.log("图片",this.songlist[index]);
            this.$store.commit("changepic", this.songlist[index].picUrl);
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
    // 监听音频的暂停播放事件
    monitorAudioPlay(audio) {
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
   
  },
  watch:{
    startIndex(){
      if(this.startIndex == 15){
        this.sort()
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "../assets/css/single.less";
</style>