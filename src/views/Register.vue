<template>
  <div class="register">
    <div class="top">
      <div class="img-box" @click="$router.go(-1)">
        <img src="../assets/img/left.png" alt="" />
      </div>
      <div class="name">
        <div class="text">{{ text }}</div>
      </div>
    </div>
    <div class="content">
      <div class="input-box">
        <van-field
          v-model="phone"
          type="tel"
          center
          clearable
          label="手机号"
          placeholder="请输入手机号码"
          maxlength="11"
        >
          <template #button>
            <div
              class="emit-phone"
              @click="emitPhone"
              :class="{ active: active, noactive: !active }"
            >
              {{ verificationText }}
            </div>
          </template>
        </van-field>
        <van-field
          v-model="nickname"
          label="昵称"
          placeholder="请输入你的昵称"
        />
        <van-field
          v-model="password"
          type="password"
          placeholder="请输入密码"
          label="密码"
        />
        <!-- 允许输入正整数，调起纯数字键盘 -->
        <van-field
          v-model="digit"
          placeholder="请输入4位数的验证码"
          label="验证码"
          maxlength="4"
          type="digit"
        />
      </div>
      <div class="determine" @click="emit">
        {{ text }}
      </div>
    </div>
  </div>
</template>

<script>
import { emitCaptcha, emitCellphone,existence } from "../api/register";
export default {
  data() {
    return {
      // 验证的文本
      verificationText: "发送短信验证",
      // 类型
      text: "",
      //   手机号码
      phone: "",
      password: "",
      //   验证码
      digit: "",
      nickname: "",
      active: true,
    };
  },
  created() {
    this.text = this.$route.query.name;
  },
  methods: {
    //   发送验证
    emitPhone() {
      console.log(this.active);
      if (this.phone.length != 11) {
        this.$toast({
          message: "请输入正确的手机号码",
          duration: 2000,
        });
        return;
      }
      if (this.active) {
        emitCaptcha({ phone: this.phone }).then((data) => {
          console.log(data);
          if (data.code == 200 && data.data) {
            this.active = false;
            var index = 10;

            var timer = setInterval(() => {
              index--;
              this.verificationText = index + "秒后发送短信验证";
              if (index == 0) {
                this.active = true;
                this.verificationText = "发送短信验证";
                clearInterval(timer);
              }
            }, 1000);
          }else if(data.code == 400){
            this.$toast(data.message)
          }
        });
      }
    },
    // 修改密码/注册
    emit() {
      if (this.phone.length != 11) {
        this.$toast({
          message: "请输入正确的手机号码",
        });
        return ;
      } else if (this.nickname.length == 0 || this.nickname == " ") {
        this.$toast({
          message: "请输入昵称，且不能为空格",
        });
        this.nickname = "";
         return ;
      } else if (this.password.length == 0) {
        this.$toast({
          message: "请输入密码",
        });
         return ;
      } else if (this.digit.length != 4) {
        this.$toast({
          message: "请输入正确格式验证码",
        });
         return ;
      }
      // 检查手机号是否注册过
      existence({phone:this.phone}).then(data => {
        if(this.$route.query.name == '注册'){
          if(data.hasPassword){
            this.$toast('该手机号码已注册')
            return ;
          }else{
            this.emitCellphoneFun()
          }
          
        }else{
          if(!data.hasPassword){
            this.$toast('该手机号码没有注册')
            return ;
          }else{
            this.emitCellphoneFun()
          }
        }
      })
     
    },
    // 注册、修改密码请求
    emitCellphoneFun(){
       emitCellphone({
        captcha: this.digit,
        password: this.password,
        phone: this.phone,
        nickname: this.nickname
      }).then((data) => {
        console.log(data);
          if(data){
              console.log("验证的结果 ==>",data);
             if(data.code ==200){
                this.$toast({
                  message:this.$route.query.name+"成功"
              })
              var _this = this
              setTimeout(()=>{
                  _this.$router.go(-1)
              },2000)
             }else{
               this.$toast(data.message)
             }
          }else{
            this.$toast('昵称被占用了，请重新输入昵称')
          }
      });
    }
  },
};
</script>

<style lang="less" scoped>
@import "../assets/css/register.less";
</style>