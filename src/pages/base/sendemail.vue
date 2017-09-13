<template>
	<section>
		<el-form :model="emailForm" ref="emailForm" :rules="rules" label-width="80px">
			<el-form-item label="邮箱号" prop="email">
				<el-input v-model.trim="emailForm.email" placeholder="输入绑定邮箱号"></el-input>
			</el-form-item>
			<el-form-item label="验证码" prop="imgcode">
				<el-input v-model.trim="emailForm.imgcode" placeholder="输入验证码" style="float: left; width: 65%; margin-right: 15px;"></el-input>
    		<canvas id="canvasCode" width="80px" height="35px" class="canvas-code" @click="drawCode"></canvas>
			</el-form-item>
			<el-form-item label="">
				<el-button type="primary" style="width: 100%; margin-top: 15px" @click="emailSubmit">下一步</el-button>
			</el-form-item>
		</el-form>
	</section>
</template>
<script>
	import Utils from '@/assets/js/utils'
	import { accountFind, sendForgotPwdEmail } from '@/api'
	export default {
		data() {
			const validateEmail = (rule, value, callback) => {
				if (!value) {
	        callback(new Error('请输入邮箱号'))
	      } else {
	      	let params = {
	      		account: value
	      	}
	      	accountFind(params).then(res => {
	      		if(res.data.code === '0001') {
	      			if(res.data.result.finded) {
	      				callback()
	      			} else {
	      				callback(new Error('该邮箱尚未绑定'))
	      			}
	      		} else {
	      			this.$message.error(res.data.message)
	      		}
	      	})
	      }
			}
			const validateCode = (rule, value, callback) => {
	      if (!value) {
	        callback(new Error('输入绑定邮箱号'))
	      } else if (value.toUpperCase() !== this.authCode.toUpperCase()) {
	        callback(new Error('验证码错误'))
	      } else {
	        callback()
	      }
	    }
			return {
				emailForm: {
					email: '',
					imgcode: ''
				},
				authCode: '',
				rules: {
					email: [
						{required: true, message: '输入绑定邮箱号', trigger: 'blur'},
						{type: 'email', message: '邮箱格式错误', trigger: 'blur'},
						{ validator: validateEmail, trigger: 'blur'},
					],
					imgcode: [
						{required: true, validator: validateCode, trigger: 'blur'},
					]
				}
			}
		},
		methods: {
			drawCode () {
	      this.authCode = Utils.canvasCode('canvasCode')
	    },
			emailSubmit() {
				this.$refs.emailForm.validate(valid => {
					if(!valid) return;
					let data = {
						email: this.emailForm.email
					}
					sendForgotPwdEmail(data).then(res => {
						if(res.data.code === '0001') {
							this.$router.push({
								path: 'verifyemail',
								query: {
									email: data.email
								}
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
			this.$store.dispatch('changeStepActive', 0)
			this.drawCode()
		}
	}
</script>
<style scoped lang="scss">
	.el-form {
		width: 40%;
		margin: 50px auto;
	}
</style>