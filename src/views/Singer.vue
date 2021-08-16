<template>
  <div class="bigsinger">
    <div class="loading" v-show="!loading">
      <van-loading size="60px" vertical>加载中...</van-loading>
    </div>
    <div
      v-show="loading"
      class="singerlist-bigbox"
      @touchstart="touchstart"
      @touchmove="touchmove"
      @touchend="touchend"
      :style="{ marginTop ,paddingBottom : $store.state.src==false?'':'50px'}"
      ref="ul"
    >
      <div
        class="singerlist-box"
        v-for="(item, index) in sortTypeSingles"
        :key="index"
        :ref="'li' + index"
      >
        <div class="type">{{ index == 0 ? "热门" : typeText[index] }}</div>
        <div class="singerlist">
          <div
            class="singer"
            v-for="v in item"
            @click="jumpRouter(v.id)"
            :key="v.id"
          >
            <div class="img-box">
              <img :src="v.picUrl" alt="" />
            </div>
            <div class="name">
              <p>{{ v.name }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="typeList">
      <!-- <a href="#mao">haoyang </a> -->
      <div v-show="loading">
        <div
          @click="jump(index)"
          v-for="(item, index) in typeText"
          :key="index"
        >
          {{ item }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getArtistList, getHotSingerList } from "../api/singer";
export default {
  data() {
    return {
      typeText: ["热门", "A", "B", "C", "D", "E", "F"],
      typeSingles: [],
      // 排序后
      sortTypeSingles: [],
      //   数据请求完再排序
      sortIndex: 0,
      startY: 0,
      moveY: 0,
      endY: 0,
      differ: 0,
      marginTop: "0px",
      liListHeight: [],
      loading: false,
    };
  },
  methods: {
    getArtistListFun() {
      this.typeText.slice(1).forEach((element) => {
        getArtistList({ type: 1, area: -1, initial: element, limit: 10 }).then(
          (data) => {
            if (data.code == 200) {
              this.$set(this.typeSingles, element, data.artists);
              
              
              this.sortIndex++;
              //   console.log("this.typeSingles ==>", this.typeSingles);
            }
          }
        );
      });
      //   console.log("this.typeSingles", this.typeSingles);
      // console.log(this.typeText.slice(1));
    },
    getgetHotSingerList() {
      getHotSingerList().then((data) => {
        if (data.code == 200) {
          //   this.typeSingles.push({"hot":data.artists})
          //   this.typeSingles["hot"] = data.artists;
          this.$set(this.typeSingles, "hot", data.artists);
          this.sortIndex++;
        }
      });
    },
    sortTypeSingleFun() {
      this.typeText.forEach((item, sortIndex) => {
        if (sortIndex == 0) {
          //   this.sortTypeSingles.push({"hot":this.typeSingles["hot"]});
          this.sortTypeSingles.push(this.typeSingles["hot"]);
        } else {
          //   this.sortTypeSingles.push({item:this.typeSingles[item]});
          this.sortTypeSingles.push(this.typeSingles[item]);
        }
      });
      this.getHeightList();
    },
    touchstart(e) {
      this.startY = e.changedTouches[0].pageY;
      // console.log(this.$refs.ul.clientHeight );
    },
    touchmove(e) {
      // console.log("move e ==>",e.changedTouches[0].pageY);
      // console.log(this.$refs.ul.style.marginTop);
      let moveY = e.changedTouches[0].pageY;
      let differ = moveY - this.startY;
      let marginTop = parseInt(this.$refs.ul.style.marginTop);
      let height = this.$refs.ul.offsetHeight - 560;
      //   console.log(marginTop, differ);
      // console.log("height ", height, marginTop);
      if (marginTop >= 0 && differ > 0) {
        this.$refs.ul.style.marginTop = "0px";
        this.marginTop = "0px";
      } else if (Math.abs(marginTop) >= height && differ < 0) {
        this.$refs.ul.style.marginTop = -height + "px";
        this.marginTop = -height + "px";
      } else {
        this.$refs.ul.style.marginTop =
          parseInt(this.marginTop) + differ + "px";
      }
      // this.$refs.ul.style.marginTop = "-120px"
    },
    touchend() {
      // console.log("end e ==>",e.changedTouches[0].pageY);
      this.marginTop = this.$refs.ul.style.marginTop;
    },
    jump(index) {
      console.log(index);
      this.$refs.ul.style.transition = "all 0.5s";
      this.marginTop = -this.liListHeight[index] + "px";
      setTimeout(() => {
        this.$refs.ul.style.transition = "none";
      }, 500);
    },
    getHeightList() {
      this.$nextTick(() => {
        
        let addHeight = 0;
        this.typeText.forEach((item, index) => {
          let li = "li" + index;
          if (index == 0) {
            this.liListHeight.push(0);
          } else {
            addHeight += this.$refs[li][0].clientHeight + 10;
            this.liListHeight.push(addHeight);
          }
        });
        // console.log(this.liListHeight);
        
      });
    },
    jumpRouter(id) {
      this.$router.push({ path: "/singerdetail", query: { id: id } });
    },
  },
  created() {
    this.getgetHotSingerList();
    this.getArtistListFun();
  },
  mounted() {},
  watch: {
    sortIndex: function () {
      if (this.sortIndex == this.typeText.length) {
        this.loading = !this.loading;
        this.sortTypeSingleFun();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.bigsinger {
  overflow: hidden;
  width: 100%;
  height: 560px;
}
.loading{
  margin-top: 210px;
}
.singerlist-box {
  .type {
    width: 100%;
    height: 30px;
    line-height: 30px;
    background-color: rgb(226, 226, 226);
    color: white;
    font-size: 16px;
  }
  .singerlist {
    width: 100%;
    .singer {
      width: 94%;
      margin: 10px auto;
      // margin-top: 10px;
      display: flex;
      border-bottom: 1px solid rgb(233, 234, 235);
      .img-box {
        flex: 1;
        img {
          width: 100%;
          border-radius: 8px;
        }
      }
      .name {
        flex: 3;
        p {
          margin-left: 20px;
          height: 100%;
          line-height: 80px;
          font-size: 20px;
        }
      }
    }
  }
}
.typeList {
  position: fixed;
  right: 20px;
  top: 200px;
  div {
    margin-top: 20px;
    text-align: center;
    color: rgb(216, 214, 204);
  }
}
</style>