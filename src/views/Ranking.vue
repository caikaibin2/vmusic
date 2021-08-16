<template>
  <div>
    <div class="loading" v-show="loading">
      <van-loading size="60px" vertical>加载中...</van-loading>
    </div>
    <!-- <keep-alive> -->
    <div
      class="ranking"
      v-show="!loading"
      :style="{ paddingBottom: $store.state.src == false ? '' : '50px' }"
    >
      <Rankingitem
        v-for="(item, index) in allRankingList"
        :key="index"
        :pic="item.playlist.coverImgUrl"
        :nameList="threeNamelist[index]"
        :id="item.playlist.id"
      ></Rankingitem>
    </div>
    <!-- </keep-alive> -->
  </div>
</template>

<script>
import Rankingitem from "../components/RankingItem.vue";
import { gettoplist, getPlaylistDetail } from "../api/ranking";
export default {
  components: { Rankingitem },
  data() {
    return {
      allRankingList: [],
      threeNamelist: [],
      loading: true,
    };
  },
  beforeRouteEnter(to, from, next) {
    gettoplist().then((data) => {
      console.log(data);
      // if (data.code == 200) {
      //   this.allRankingList = data.list;
      // }
      next((vw) => {
        vw.getPlaylistDetailFun(data.list);
      });
    });
  },
  methods: {
    getPlaylistDetailFun(list) {
      list.forEach((element, index) => {
        let id = element.id;
        getPlaylistDetail({ id }).then((data) => {
          if (data.code == 200) {
            this.allRankingList.push(data);
            let arr = [];
            for (let i = 0; i < 3; i++) {
              arr.push(data.playlist.tracks[i].al.name);
            }
            this.threeNamelist.push(arr);
            if (index == list.length - 1) {
              this.loading = !this.loading;
            }
          }
        });
      });
      console.log("allRankingList ", this.allRankingList);
    },
  },
};
</script>

<style lang="less" scoped>
.loading {
  margin-top: 210px;
}
.ranking {
  width: 375px;
  height: 567px;
  overflow: auto;
}
</style>