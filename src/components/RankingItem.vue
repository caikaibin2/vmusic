<template>
  <div class="rankingitem"  @click="jumpPage">
    <div class="item-box">
      <div class="left">
        <img :src="pic" alt="" />
      </div>
      <div class="right">
        <div class="song van-ellipsis" v-for="(item, index) in nameList" :key="index">
          {{ index + 1 + "." + item }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["pic", "nameList",'id'],
  methods: {
     jumpPage(){
      console.log(this.id);
      this.$router.push({name:'SingerDetail', params: { id: this.id }})
    }
  },
};
</script>

<style lang="less" scoped>
.rankingitem {
  width: 100%;
  //   height: 100px;
  //   background-color: aqua;
  margin-top: 10px;
  .item-box {
    width: 94%;
    height: 100%;
    margin: 0 auto;
    //   padding: 20px 0;
    display: flex;
    .left {
      flex: 1;
      img {
        width: 100%;
        height: 100%;
        border-radius: 5px;
      }
    }
    .right {
      flex: 3;
      .song {
        margin-left: 20px;
        width: 240px;
        height: 33.33px;
        line-height: 33.33px;
        overflow: hidden;
      }
    }
  }
}
</style>