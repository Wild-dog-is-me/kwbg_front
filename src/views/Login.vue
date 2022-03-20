<template>
  <div
    class="loginBody"
    v-loading="loading"
    element-loading-text="正在登入..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.2)"
  >
    <vue-particles
      color="#99CCFF"
      :particleOpacity="0.8"
      :particlesNumber="60"
      shapeType="star"
      :particleSize="4"
      linesColor="#0066FF"
      :linesWidth="2"
      :lineLinked="true"
      :lineOpacity="0.4"
      :linesDistance="150"
      :moveSpeed="3"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="push"
    >
    </vue-particles>
    <el-form
      :rules="rules"
      ref="loginForm"
      :model="loginForm"
      class="loginContainer"
    >
      <p class="title" :style="{ color: themeColor }">School Office</p>

      <!--表单描述-->
      <p class="desc">江 苏 师 范 大 学 科 文 学 院</p>
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          clearable
          auto-complete="false"
          placeholder="用户名"
          prefix-icon="el-icon-user-solid"
        />
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          type="password"
          v-model="loginForm.password"
          clearable
          auto-complete="false"
          placeholder="密码"
          prefix-icon="el-icon-lock"
        />
      </el-form-item>

      <el-form-item prop="code">
        <div style="display: flex; justify-content: space-between">
          <el-input v-model="loginForm.code" auto-complete="false" @keyup.enter.native="submitLogin" placeholder="验证码"
            style="width: 220px" prefix-icon="el-icon-picture" />
          <div class="captchaContent">
            <div v-if="captchaLoad">
              <i class="el-icon-loading" style="margin-right: 5px" />loading...
            </div>
            <img v-else :src="captchaUrl" @click="updateCaptcha" title="点击更换" />
          </div>
        </div>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="checked" :style="{ color: themeColor }"
          >记住我</el-checkbox
        >
      </el-form-item>

      <el-form-item>
        <!--提交按钮-->
        <el-button
          type="primary"
          class="submitBtn"
          @click="submitLogin"
          :style="{ backgroundColor: themeColor }"
        >
          <span v-if="!loading">登&emsp;入</span>
          <span v-else
            ><i
              class="el-icon-loading"
              style="margin-right: 10px"
            />登&emsp;入&emsp;中&emsp;...</span
          >
        </el-button>
      </el-form-item>
    </el-form>
    <!--底部内容-->
    <p class="footer_content" :style="{ color: themeColor }">
      <span> Copyright © 2022 </span>
      <span>
        <i class="fa fa-github" />
        <a
          href="https://github.com/Wild-dog-is-me"
          target="_blank"
          :style="{ color: themeColor }"
          >GitHub</a
        >
      </span>
      <span>
        <i class="fa fa-qq" />
        @Author:21软件3-耿沁园
      </span>
      <span>
        <i class="fa fa-history" />
        江苏师范大学科文学院办公系统
      </span>
    </p>
  </div>
</template>

<script>
  import {postRequest} from "../utils/api";
  export default {
    name: "Login",
    data() {
      return {
        captchaLoad: false,
        themeColor: "#409EFF",
        captchaUrl: 'http://localhost:8081/captcha?time=' + new Date(),
        loginForm: {
          username: "admin",
          password: "123456",
          code: '',
        },
        checked: true,
        loading: false,
        rules: {
          username: [{
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          }, ],
          password: [{
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }],
          code: [{
            required: true,
            message: "请输入验证码",
            trigger: "blur"
          }],
        },
      }
    },
    methods: {
      updateCaptcha() {
        this.captchaUrl = 'http://localhost:8081/captcha?time=' + new Date();
      },
      submitLogin() {
        this.$refs.loginForm.validate((valid) => {
                if (valid) {
                  postRequest("http://localhost:8081/login", this.loginForm).then(resp => {
                    if(resp){
                      const tokenStr = resp.obj.tokenHead+resp.obj.token;
                      console.log(tokenStr)
                      window.sessionStorage.setItem('tokenStr',tokenStr);
                      this.$router.replace('/home')
                    }
                  });
                } else {
                  this.$message.error("请输入所有字段");
                  return false;
                }
              });
              // alert(1111)
            },
          },
        };
</script>


<style scoped>
/*登录主体部分*/
.loginBody {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #f5f5f5 url("../assets/images/background2.svg");
  background-size: cover;
}

/*登录主容器*/
.loginContainer {
  background-clip: padding-box;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 350px;
}

/*登录标题*/
.title {
  margin: 0 auto;
  text-align: center;
  font-size: 35px;
  font-weight: bold;
}

/*描述*/
.desc {
  text-align: center;
  color: grey;
  font-size: 14px;
  line-height: 60px;
}

/*图片验证码区域*/
.captchaContent {
  width: 115px;
  height: 40px;
  cursor: pointer;
  color: #808080;
  text-align: center;
}

.el-form-item__content {
  display: flex;
  align-items: center;
}

/*忘记密码*/
.forget {
  float: right;
  font-size: 14px;
  text-decoration: none;
}

/*登录按钮*/
.submitBtn {
  border: none;
  width: 100%;
  font-size: 15px;
  font-weight: bold;
}

/*其他登录方式*/
.otherLogin {
  /*平均分布*/
  display: flex;
  justify-content: space-between;
  margin: 10px 0 0 0;
  padding: 0;
  list-style: none;
  width: 100%;
}

.otherLogin li {
  line-height: 35px;
  font-size: 20px;
  text-align: center;
  color: #fff;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  cursor: pointer;
}

.footer_content {
  left: 0;
  position: fixed;
  bottom: 0;
  /* top 0 就是顶部 */
  width: 100%;
  z-index: 100;
  display: flex;
  justify-content: center;
  color: #ffff;
}

/*   底部a标签  */
.footer_content a {
  font-size: 14px;
  margin-left: 15px;
  text-decoration: none;
}

.footer_content a:hover {
  text-decoration: underline;
}

.footer_content span {
  margin-right: 50px;
}

.backgroud {
  width: 100%;
  height: 100%;
}
</style>
