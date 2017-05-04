<template>
  <transition name="slide-fade">
    <div class="container">
      <div v-title :data-title="this.$route.name"></div>
      <el-form :model="loginForm" :rules="loginRules" ref="loginForm" class="login-form" :class="{'animated shake': invalid}">
        <h2 class="page-header">欢迎登录</h2>
        <el-form-item label="用户名" prop="username" label-width="90px">
          <el-input v-model.string="loginForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密 码" prop="password" label-width="90px">
          <el-input type="password" v-model="loginForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="authcode" label-width="90px">
          <el-input type="text" v-model="loginForm.authcode" placeholder="请输入验证码" style="float: left; width: 70%; margin-right: 15px;"></el-input>
          <el-button style="width: 67px; padding: 8px; font-size: 18px" @click="createCode">{{ randomCode }}</el-button>
        </el-form-item>
        <el-form-item label="记住密码" label-width="90px" style="margin-bottom: 5px">
          <el-checkbox-group v-model="loginForm.remember">
            <el-checkbox name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item style="margin-bottom: 5px">
          <el-button type="primary" class="el-button--block" :loading="logging" @click="submitForm('loginForm')">
            提 交
          </el-button>
        </el-form-item>
        <el-form-item style="margin: 0; text-align: center;">
          <router-link to="/register">尚未注册？</router-link>
          <span style="margin: 0 10px">|</span>
          <router-link to="/forgetPass">忘记密码</router-link>
        </el-form-item>
      </el-form>    
    </div>
  </transition>
</template>
<script>
import { requestLogin } from '../api'
import utils from '../assets/js/utils'
export default {
  data() {
    var validateCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'))
      } else if (value.toUpperCase() !== this.randomCode.toUpperCase()) {
        callback(new Error('验证码错误'))
      } else {
        callback()
      }
    }
    return {
      invalid: false,
      logging: false,
      randomCode: '',
      loginForm: {
        username: '',
        password: '',
        authcode: '',
        remember: false
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, message: '长度不少于5个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 8, max: 20, message: '长度在 8 到 20 个字符', trigger: 'blur'}
        ],
        authcode: [
          { required: true, validator: validateCode, trigger: 'blur'}
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid && !this.logging) {
          this.logging = true
          requestLogin(this.loginForm).then(res => {
            if (res.data.status === 1) {
              utils.setCookie('sessionId', res.data.sessionID)
              if (this.loginForm.remember) {
                let uname = escape(btoa(this.loginForm.username))
                let upass = escape(btoa(this.loginForm.password))
                utils.setCookie('uname', uname, '7d')
                utils.setCookie('upass', upass, '7d')
              } else {
                utils.delCookie('uname')
                utils.delCookie('upass')
              }
              this.$message({
                type: 'success',
                message: res.data.message
              })
              this.$router.push({ path: '/account/home' })
            } else {
              this.$message({
                type: 'error',
                message: res.data.message
              })
              this.createCode()
            }
            this.logging = false
          })
          .catch(function (error) {
            console.log(error);
          })
        } else {
          this.invalid = true
          console.log('error submit!!');
          return false;
        }
      })
    },
    createCode () {
      this.randomCode = ''
      const ALPHABET = 'abcdefghijklmnopqrstuvwxyzQWERTYUIOPASDFGHJKLZXCVBNM1234567890'
      for (let i = 0; i < 4; i++) {
        this.randomCode += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length))
      }
    }
  },
  mounted () {
    this.createCode()
    if (utils.getCookie('uname') && utils.getCookie('upass')) {
      this.loginForm.username = atob(unescape(utils.getCookie('uname')))
      this.loginForm.password = atob(unescape(utils.getCookie('upass')))
      this.loginForm.remember = true
    }
  }
}
</script>
<style scoped>
  .container {
    overflow: hidden
  }
	.login-form {
		width: 430px;
		margin: 8% auto 0;
		padding: 30px;
		border-radius: 5px;
		background: #fff
	}
  .animated {
    -webkit-animation-duration: 1s;
    animation-duration: 1s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    z-index: 100
  }

  .animated.infinite {
    -webkit-animation-iteration-count: infinite;
    animation-iteration-count: infinite
  }

  .animated.hinge {
    -webkit-animation-duration: 2s;
    animation-duration: 2s
  }
  @-webkit-keyframes shake {
    0%,
    100% {
      -webkit-transform: translateX(0);
      transform: translateX(0)
    }
    10%,
    30%,
    50%,
    70%,
    90% {
      -webkit-transform: translateX(-10px);
      transform: translateX(-10px)
    }
    20%,
    40%,
    60%,
    80% {
      -webkit-transform: translateX(10px);
      transform: translateX(10px)
    }
  }

  @keyframes shake {
    0%,
    100% {
      -webkit-transform: translateX(0);
      -ms-transform: translateX(0);
      transform: translateX(0)
    }
    10%,
    30%,
    50%,
    70%,
    90% {
      -webkit-transform: translateX(-10px);
      -ms-transform: translateX(-10px);
      transform: translateX(-10px)
    }
    20%,
    40%,
    60%,
    80% {
      -webkit-transform: translateX(10px);
      -ms-transform: translateX(10px);
      transform: translateX(10px)
    }
  }

  .shake {
    -webkit-animation-name: shake;
    animation-name: shake
  }
</style>
