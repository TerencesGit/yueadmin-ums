<template>
  <transition name="fade">
    <div class="login-page">
      <div v-title :data-title="this.$route.name"></div>
      <header class="login-header">
        <div class="container">
          <div class="logo">
          <span></span>
            <h3>欢迎登录</h3>
          </div>
        </div>
      </header>
      <main class="login-main">
        <div class="container">
          <el-form 
            :model="loginForm" 
            :rules="rules" 
            ref="loginForm" 
            class="login-form"
            :label-width="labelWith">
            <h2 class="form-title">欢迎登录</h2>
            <el-form-item label="用户名" prop="username">
              <el-input v-model.trim="loginForm.username" placeholder="请输入邮箱号/手机号"></el-input>
            </el-form-item>
            <el-form-item label="密 码" prop="password">
              <el-input type="password" v-model.trim="loginForm.password" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item label="" label-width="0" class="remember">
              <el-checkbox-group v-model="loginForm.remember">
                <el-checkbox name="type">记住密码</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label-width="0" class="submit">
              <el-button 
                type="primary" 
                :loading="logging" 
                style="width: 100%" 
                @click="submitForm">
                提 交
              </el-button>
            </el-form-item>
            <el-form-item label-width="0" class="link">
              <router-link to="/register">尚未注册？</router-link>
              <span style="margin: 0 10px">|</span>
              <router-link to="/findpasswd">忘记密码</router-link>
            </el-form-item>
          </el-form> 
        </div>   
      </main>
      <footer class="login-footer">
        <div class="container">
          <p>Copyright © 2017 yueshijue.com版权所有</p>
        </div>
      </footer>
    </div>
  </transition>
</template>
<script>
  import { requestLogin } from '@/api'
  import Utils from '@/assets/js/utils'
  export default {
    data() {
      return {
        labelWith: '80px',
        logging: false,
        loginForm: {
          username: '',
          password: '',
          remember: true,
        },
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
          ],
        }
      };
    },
    methods: {
      submitForm () {
        this.$refs.loginForm.validate(valid => {
          if (valid && !this.logging) {
            this.logging = true;
            let data = {
              username: this.loginForm.username,
              password: this.$Md5.hex_md5(this.loginForm.password)
            }
            requestLogin(data).then(res => {
              this.logging = false;
              if (res.data.code === '0001') {
                let user = {
                  name: escape(btoa(data.username)),
                  pwd: escape(btoa(this.loginForm.password)),
                }
                if(this.loginForm.remember) {
                  localStorage.setItem('user', JSON.stringify(user))
                } else {
                  localStorage.removeItem('user')
                }
                Utils.setCookie('userId', res.data.result.userInfo.userId)
                this.$router.push({ path: '/account/infocenter' })
              } else {
                this.$message.error(res.data.message)
              }
            }).catch(err => {
              console.log(err)
              this.logging = false
            })
          }
        })
      },
    },
    mounted () {
      let user = JSON.parse(localStorage.getItem('user'));
      if(user && user.name && user.pwd) {
        this.loginForm.username = atob(unescape(user.name))
        this.loginForm.password = atob(unescape(user.pwd))
      }
    }
  }
</script>