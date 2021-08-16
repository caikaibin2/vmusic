import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    audio:null,
    // 作者照片
    pic:null,
    // 歌名
    songname:null,
    // 作者姓名
    arname:null,
    // 播放的音乐列表
    songlist:null,
    // 音乐的id
    id:null,
    // 音乐的url
    src:null,
    // 当前播放在音乐列表的索引值
    index:null,
    // 是否播放中
    isplay:null,
    // 播放的排序 0表示单曲循环 1表示顺序播放 2表示随机
    playOrder:1,
    // 当前播放的时长
    currentTime:0,
    // 播放的总时长
    duration:0,
    // 歌词
    lyric:" ",
    // 搜索历史记录
    searchHistroy:[]
  },
  mutations: {
    audio(state,audio){
      // console.log("audio",audio);
      state.audio = audio
    },
    changeInfo(state,data){
      state.songname = data.songname
      state.arname = data.arname,
      state.songlist = data.songlist
      state.id = data.id
      state.src = data.src
      state.index = data.index
    },
    changeIsplay(state,data){
      state.isplay = data
    },
    changepic(state,data){
      state.pic = data
    },
    cyhangePlayOrder(state){
      if(state.playOrder == 2){
        state.playOrder = 0
      }else{
        state.playOrder ++
      }
    },
    changeCurrentTime(state,data){
      state.currentTime = data
    },
    changeduration(state,data){
      state.duration = data
    },
    changeLyric(state,data){
      state.lyric = data
    },
    changesearchHistroy(state,data){
      state.searchHistroy = data
    }
  },
  getters:{
    isplay(state){
      return state.audio.paused;
    }
  },
  actions: {
  },
  modules: {
  }
})
