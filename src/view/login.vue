<template>
  <transition name="slide-fade"
  >
    <div class="container">
      <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="90px" class="demo-ruleForm" :class="{'animated shake': invalid}">
        <h2 class="page-header">欢迎登录</h2>
        <el-form-item label="用户名" prop="name">
          <el-input v-model.string="ruleForm2.name" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="ruleForm2.pass" auto-complete="off" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="确认密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="el-button--block"  @keyup.enter="submitForm('ruleForm2')" @click="submitForm('ruleForm2')" :loading="logging">
            提交
          </el-button>
        </el-form-item>
      </el-form>    
    </div>
  </transition>
</template>
<script>
import { requestLogin } from '../api'
import NProgress from 'nprogress'
export default {
  data() {
    // var checkAge = (rule, value, callback) => {
    //   if (!value) {
    //     return callback(new Error('用户名不能为空'));
    //   }
    //   setTimeout(() => {
    //     if (!Number.isInteger(value)) {
    //       callback(new Error('请输入数字值'));
    //     } else {
    //       if (value < 18) {
    //         callback(new Error('必须年满18岁'));
    //       } else {
    //         callback();
    //       }
    //     }
    //   }, 1000);
    // };
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.ruleForm2.checkPass !== '') {
          this.$refs.ruleForm2.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm2.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      invalid: false,
      logging: false,
      ruleForm2: {
        name: '',
        pass: '',
        checkPass: ''
      },
      rules2: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, message: '长度不少于5个字符', trigger: 'blur' }
        ],
        pass: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid && !this.logging) {
          this.logging = true
          NProgress.start()
          NProgress.inc()
          requestLogin(this.ruleForm2).then(res => {
            if (res.data.status === 0) {
              this.$message({
                type: 'error',
                message: '用户名不存在'
              })
            } else if (res.data.status === 1) {
              this.$message({
                type: 'error',
                message: '密码错误'
              })
            } else if (res.data.status === 2) {
              localStorage.setItem('sessionId', res.data.sessionID)
              this.$message({
                type: 'success',
                message: '登录成功'
              })
              this.$router.push({ path: '/account/home' })
            } else {
              this.$message({
                type: 'error',
                message: '登录失败，请重试'
              })
            }
            this.logging = false
          })
          .catch(function (error) {
            console.log(error);
          })
          NProgress.done()
        } else {
          this.invalid = true
          console.log('error submit!!');
          return false;
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
  .container {
    overflow: hidden
  }
	.demo-ruleForm {
		width: 430px;
		margin: 8% auto 0;
		padding: 30px;
		border-radius: 5px;
		background: #fff
	}
	.page-header {
		padding-bottom: 9px;
    margin: 0 0 20px;
    border-bottom: 1px solid #eee;
	}
  .slide-fade-enter-active {
    transition: all .5s ease;
  }
  .slide-fade-enter {
    transform: translateY(-30px);
    opacity: 0;
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
