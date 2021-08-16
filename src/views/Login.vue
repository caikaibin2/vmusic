<template>
  <div class="login">
    <div class="upperlevel" @click="$router.go(-1)">
      <img src="../assets/img/left.png" alt="" />
    </div>
    <div class="login-content">
      <div class="type">
        <div class="phone">手机登录</div>
        <div class="mailbox">邮箱登录</div>
      </div>
      <div class="phone-login">
        <!-- 输入手机号，调起手机号键盘 -->
        <van-field
          v-model="tel"
          placeholder="输入手机号码"
          maxlength="11"
          type="tel"
          label="手机号"
        />
        <van-field
          v-model="password"
          :type="isshowPassword ? 'text' : 'password'"
          placeholder="请输入密码"
          label="密码"
        >
          <template #button>
            <div class="icon" @click="isshowPassword = !isshowPassword">
              <div class="img-box">
                <img :src="isshowPassword ? eyes[1] : eyes[0]" alt="" />
              </div>
            </div>
          </template>
        </van-field>
        <div class="loginbt" @click="login">登录</div>
        <div class="register-forget">
          <div
            class="register"
            @click="
              $router.push({ path: '/register', query: { name: '注册' } })
            "
          >
            立即注册
          </div>
          <div
            class="forget"
            @click="
              $router.push({ path: '/register', query: { name: '修改密码' } })
            "
          >
            忘记密码？
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Login, existence } from "../api/register";
export default {
  data() {
    return {
      tel: "13544596023",
      password: "",
      isshowPassword: false,
      eyes: [
        require("../assets/img/eye-c.png"),
        require("../assets/img/eye-o.png"),
      ],
    };
  },
  methods: {
    login() {
      console.log("点击了");
      if (this.tel.length == 0 || this.password.length == 0) {
        this.$toast("手机号码和密码不能为空！");
        return;
      }
      if (this.tel.length != 11) {
        this.$toast("请输入正确的手机号码");
        return;
      }
      existence({ phone: this.tel }).then((data) => {
        console.log(data);
        if (data.code == 200) {
          if (data.hasPassword) {
            Login({ phone: this.tel, password: this.password }).then((data) => {
              console.log(data);
              if (data) {
                if (data.code == 200) {
                  console.log("登录", data);
                  window.localStorage.setItem('token',data.token)
                  window.localStorage.setItem('userId',data.account.id)
                  this.$toast('登录成功')
                  this.$router.push({path:'./navigation'})
                } else if (data.code == 502) {
                  this.$toast("密码或账号错误，请重新输入");
                }
              } else {
                this.$toast("密码错误超过限制的次数");
              }
            });
          } else {
            this.$toast("该手机号码没有注册");
          }
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
@import "../assets/css/login.less";
</style>