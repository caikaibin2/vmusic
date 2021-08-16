<template>
  <div class="search-bigbox">
    <div class="top">
      <div class="SuggestedSearch">
        <div class="item-box">
          <div
            class="item"
            v-for="(item, index) in SuggestedSearchArr"
            :key="index"
            @click="sSearch(item)"
          >
            <div class="van-ellipsis songname">{{ item.name }}</div>
            <div class="van-ellipsis arname">---{{ item.artists[0].name }}</div>
          </div>
        </div>
      </div>
      <div class="img-box" @click="$router.go(-1)">
        <img src="../assets/img/left.png" alt="" />
      </div>

      <div class="search">
        <van-search
          :value="value"
          @input="inputEvent"
          @clear="clear"
          @search="search(value)"
          @focus="value.length != 0 ? inputEvent(value) : ''"
          shape="round"
          placeholder="请输入搜索关键词"
        />
      </div>
    </div>

    <div class="history-box">
      <div class="text-box">
        <div class="text">历史</div>
        <div
          class="img-box"
          v-if="historyArr.length != 0"
          @click="deleteAllHis"
        >
          <img src="../assets/img/delete.png" alt="" />
        </div>
      </div>
      <div class="history">
        <div
          class="history-item van-ellipsis"
          v-for="(item, index) in historyArr"
          :key="index"
        >
          <div class="name" @click="search(item)">{{ item }}</div>
          <div class="delete" @click="deleteHisItem(index)">X</div>
        </div>
      </div>
    </div>

    <div class="hotSearch-box">
      <div class="text">热搜</div>
      <div class="hotSearch">
        <div
          class="hotSearch-item"
          v-for="(item, index) in hotSearchArr"
          :key="index"
          @click="search(item.searchWord)"
        >
          <div
            class="rank"
            :style="{
              color: index == 0 || index == 1 || index == 2 ? 'red' : '',
            }"
          >
            {{ index + 1 }}
          </div>
          <div class="content">
            <div class="name-playcount">
              <div class="name">{{ item.searchWord }}</div>
              <div class="playcount">{{ item.score }}</div>
            </div>
            <div class="describe van-ellipsis">
              {{ item.content }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="songdetail" v-if="songlist.length != 0">
      <div class="tops">
        <div class="count">共搜索{{ songlist.length }}首歌曲</div>
        <div class="close" @click="close">X</div>
      </div>
      <div class="song">
        <div class="song-item" v-for="(item, index) in songlist" :key="index">
          <div class="sort">{{ index + 1 }}</div>
          <div class="name">
            <!-- <div class="songname van-ellipsis">天外来物</div>
            <div class="arname">薛之谦</div> -->
            <div class="songname van-ellipsis">{{ item.name }}</div>
            <div class="arname">{{ item.ar[0].name }}</div>
          </div>
          <div class="playing" v-if="item.id == $store.state.id">
            <!-- <div class="playing" v-if="false" > -->
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
  getSearchSuggest,
  getSearchHot,
  getSearchDefault,
  getSearch,
} from "../api/search";
import { artistdetail, getSongUrl, getLyric } from "../api/singerdetail";
// import { getPlaylistDetail } from "../api/ranking";
export default {
  data() {
    return {
      value: "",
      // 延时器器
      Timeout: null,
      // 历史搜索
      historyArr: [],
      // 热搜列表
      hotSearchArr: [],
      // 推荐关键字
      SuggestedSearchArr: [],
      // 搜索后的歌曲
      songlist: [],
    };
  },
  created() {
    this.getSearchDefaultFun();
    this.getSearchHotFun();
    // console.log(this.$store.state.searchHistroy.length);
    // if (this.$store.state.searchHistroy.length != 0) {
    //   }
      this.historyArr = this.$store.state.searchHistroy;
  },
  mounted() {
    this.$nextTick(() => {
      this.monitorAudioPlay();
    });
  },
  methods: {
    inputEvent(keywords) {
      clearTimeout(this.Timeout);
      this.value = keywords;
      this.Timeout = setTimeout(() => {
        getSearchSuggest({ keywords }).then((data) => {
          if (data.code == 200) {
            console.log("keywords ==>", data);
            if (data.result.songs) {
              this.SuggestedSearchArr = data.result.songs;
            }
          }
        });
      }, 1000);
    },
    // 获取默认搜索关键字
    getSearchDefaultFun() {
      getSearchDefault().then((data) => {
        if (data.code == 200) {
          console.log("默认关键字 ==>", data);
        }
      });
    },
    // 获取热搜列表（简）
    getSearchHotFun() {
      getSearchHot().then((data) => {
        if (data.code == 200) {
          console.log("热搜列表 ==>", data);
          this.hotSearchArr = data.data;
        }
      });
    },
    // 清除关键字
    clear() {
      this.SuggestedSearchArr = [];
    },
    // 确定搜索触发的事件
    search(value) {
      clearTimeout(this.Timeout);
      console.log("value ==>", value);
      if (value.length == 0 || value == " ") {
        this.value = "";
        return;
      }
      getSearch(value).then((data) => {
        if (data.code == 200) {
          console.log("这是搜索后的结果", data);
          this.songlist = data.result.songs;
          this.SuggestedSearchArr = [];
          this.value = value;
          if (this.historyArr.indexOf(value) == -1) {
            this.historyArr.push(value);
          }
        }
      });
      // this.value = "";
      console.log(this.historyArr, this.value);
    },
    // 点击推荐搜索关键字
    sSearch(item) {
      console.log("item ==>", item);
      clearTimeout(this.Timeout);

      let str = item.name + item.artists[0].name;
      getSearch(str).then((data) => {
        if (data.code == 200) {
          console.log("这是搜索后的结果", data);
          this.songlist = data.result.songs;
          this.value = item.name + "--" + item.artists[0].name;
          this.SuggestedSearchArr = [];
          if (this.historyArr.indexOf(this.value) == -1) {
            this.historyArr.push(this.value);
          }
        }
      });
    },
    // 删除历史记录的某一个
    deleteHisItem(index) {
      this.$delete(this.historyArr, index);
    },
    // 删除所有历史记录
    deleteAllHis() {
      this.$dialog
        .confirm({
          // title: "删除历史记录",
          message: "是否删除所有的历史记录",
        })
        .then(() => {
          this.historyArr = [];
        })
        .catch(() => {});
    },
    // 关闭搜索结果的页面
    close() {
      this.songlist = [];
      this.value = "";
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
          console.log("歌词 ==>", data);
          if (data.lrc.lyric) {
            this.$store.commit("changeLyric", data.lrc.lyric);
          } else {
            this.$store.commit("changeLyric", "纯音乐，请欣赏");
          }
        }
      });
    },
    // 监听音频的暂停播放事件
    monitorAudioPlay() {
      let audio = this.$store.state.audio;
      audio.addEventListener("durationchange", () => {
        this.isplay = false;
      });
      audio.addEventListener("ended", () => {
        let state = this.$store.state;
        var index = 0;
        console.log("触发了结束事件");
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
  },
  watch: {
    value() {
      if (this.value.length == 0) {
        this.clear();
      }
    },
    historyArr() {
      this.$store.commit("changesearchHistroy", this.historyArr);
    },
  },
};
</script>

<style lang="less" scoped>
@import "../assets/css/search.less";
</style>