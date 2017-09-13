<template>
	<section>
		<el-form :model="passwdForm" ref="passwdForm" :rules="rules" label-width="80px">
			<el-form-item label="新密码" prop="passwd">
				<el-input type="password" v-model.trim="passwdForm.passwd" placeholder="设置新密码"></el-input>
			</el-form-item>
			<el-form-item label="确认密码" prop="confirmPass">
				<el-input type="password" v-model.trim="passwdForm.confirmPass" placeholder="再次输入密码"></el-input>
			</el-form-item>
			<el-form-item label="">
				<el-button type="primary" style="width: 100%; margin-top: 15px" @click="passwdSubmit">提 交</el-button>
			</el-form-item>
		</el-form>
	</section>
</template>
<script>
	import MD5 from '@/assets/js/md5'
	import { resetPasswd } from '@/api'
	export default {
		data() {
			const validateConfirmPass = (rule, value, callback) => {
	      if (!value) {
	        callback(new Error('请再次输入密码'))
	      } else if (value !== this.passwdForm.passwd) {
	        callback(new Error('两次密码输入不一致'))
	      } else {
	        callback()
	      }
	    }
			return {
				passwdForm: {
					passwd: '',
					confirmPass: ''
				},
				rules: {
					passwd: [
						{ required: true, message: '请设置新密码', trigger: 'blur'},
						{ min: 8, message: '密码长度不少于8位', trigger: 'blur'},
					],
					confirmPass: [
						{required: true, validator: validateConfirmPass, trigger: 'blur'},
					]
				}
			}
		},
		methods: {
			passwdSubmit() {
				this.$refs.passwdForm.validate(valid => {
					if(!valid) return;
					let data = {
						passwd: MD5.hex_md5(this.passwdForm.passwd),
						passwd2: MD5.hex_md5(this.passwdForm.confirmPass)
					}
					resetPasswd(data).then(res => {
						if(res.data.code === '0001') {
							this.$router.push({
								path: 'resetsuccess',
							})
						} else {
							this.$message.error(res.data.message)
						}
					}).catch(err => {
						console.log(err)
						this.$catchError(err)
					})
				})
			}
		},
		mounted() {
			this.$store.dispatch('changeStepActive', 2)
		}
	}
</script>
<style scoped lang="scss">
	.el-form {
		width: 40%;
		margin: 50px auto;
	}
</style>