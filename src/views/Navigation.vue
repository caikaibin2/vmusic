<template>
  <div class="navigation">
    <div class="nvpage">
      <div class="navigation-container">
        <div class="swiper-wrapper navigation-pagination">
          <div class="swiper-slide">
            <img src="../assets/img/muisc1.jpg" alt="">
          </div>
          <div class="swiper-slide">
            <img src="../assets/img/muisc3.jpg" alt="">
          </div>
          <div class="swiper-slide">
            <img src="../assets/img/muisc2.jpg" alt="">
            <div class="gohome">
                <router-link to="/">进入首页</router-link>
            </div>
          </div>
        </div>
        <!-- Add Pagination -->
        <div class="swiper-pagination"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Swiper from "swiper";
export default {
 created() {
   if(window.localStorage.getItem('first')){
     this.$router.push({path:'/'})
   }else{
     window.localStorage.setItem('first','first')
   }
 },
  mounted() {
    new Swiper(".navigation-container", {
      pagination: {
        el: ".swiper-pagination",
      },
    });
  },
};
</script>
<style lang="less" scoped>

  .swiper-container {
    width: 100%;
    height: 100%;
  }

  .swiper-slide {
    text-align: center;
    font-size: 18px;
    background: #fff;

    /* Center slide text vertically */
    display: -webkit-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
  }
  .swiper-slide{

    img{
      width: 100vw;
      height: 100vh;
    }
    .gohome{
      position: absolute;
      right: 20px;
      bottom: 40px;
      border: 1px #a79b99 solid;
      padding: 5px 8px;
      border-radius: 20px;
      a{
        color: #a79b99;
        font-size: 14px;
      }
    }
  }
</style>