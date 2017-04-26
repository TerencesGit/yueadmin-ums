<template>
  <div class="container animated fadeInDown">
    <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="90px" class="demo-ruleForm">
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
        <el-button type="primary" class="el-button--block"  @keyup.enter="submitForm('ruleForm2')" @click="submitForm('ruleForm2')">
          提交
        </el-button>
      </el-form-item>
    </el-form>    
  </div>
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
      let _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          NProgress.start()
          NProgress.inc()
          let param = this.ruleForm2
          requestLogin(param).then(res => {
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
              console.log(res.data.userId)
              localStorage.setItem('userId', res.data.userId);
              this.$message({
                type: 'success',
                message: '登录成功'
              })
              _this.$router.push({ path: '/account/home' })
            } else {
              this.$message({
                type: 'error',
                message: '登录失败，请重试'
              })
            }
          })
          .catch(function (error) {
            console.log(error);
          })
          NProgress.done()
        } else {
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
</style>
