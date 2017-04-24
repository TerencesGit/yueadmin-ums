<template>
	<el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="80px" class="demo-ruleForm">
		<h2 class="page-header">欢迎登录</h2>
		<el-form-item label="用户名" prop="age">
	    <el-input v-model.number="ruleForm2.age" placeholder="请输入用户名"></el-input>
	  </el-form-item>
	  <el-form-item label="密码" prop="pass">
	    <el-input type="password" v-model="ruleForm2.pass" auto-complete="off" placeholder="请输入密码"></el-input>
	  </el-form-item>
	  <el-form-item label="确认密码" prop="checkPass">
	    <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="确认密码"></el-input>
	  </el-form-item>
	  <el-form-item>
	    <el-button type="primary" class="el-button--block" @click="submitForm('ruleForm2')">
	    	提交
	    </el-button>
	  </el-form-item>
	</el-form>
</template>
<script>
  export default {
    data() {
      var checkAge = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('用户名不能为空'));
        }
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error('请输入数字值'));
          } else {
            if (value < 18) {
              callback(new Error('必须年满18岁'));
            } else {
              callback();
            }
          }
        }, 1000);
      };
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
          pass: '',
          checkPass: '',
          age: ''
        },
        rules2: {
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ],
          age: [
            { validator: checkAge, trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          	location.href = '#/account/home'
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }
</script>
<style scoped lang="scss">
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
