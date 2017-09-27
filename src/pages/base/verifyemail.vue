<template>
	<section>
		<h4 class="message">
			邮箱验证码已发送到您的{{emailForm.email}}邮箱，请注意查收
		</h4>
		<el-form :model="emailForm" ref="emailForm" :rules="rules" label-width="120px">
			<el-form-item label="邮箱验证码" prop="activeCode">
				<el-input v-model.trim="emailForm.activeCode" placeholder="输入邮箱验证码"></el-input>
			</el-form-item>
			<el-form-item label="">
				<el-button type="primary" style="width: 100%;" @click="emailCodeSubmit">提 交</el-button>
			</el-form-item>
		</el-form>
	</section>
</template>
<script>
	import { validateEmailCode } from '@/api'
	export default {
		data() {
			return {
				emailForm: {
					email: '',
					activeCode: ''
				},
				rules: {
					activeCode: [
						{required: true, message: '输入邮箱验证码', trigger: 'blur'},
					]
				}
			}
		},
		methods: {
			emailCodeSubmit() {
				this.$refs.emailForm.validateField('activeCode', (errMessage) => {
					if(errMessage) return;
					let data = {
						email: this.emailForm.email,
						activeCode: this.emailForm.activeCode
					}
					validateEmailCode(data).then(res => {
						if(res.data.code === '0001') {
							// this.$message(res.data.message)
							this.$router.push({
								path: 'resetpasswd',
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
			this.$route.query && this.$route.query.email && (this.emailForm.email = this.$route.query.email) || this.$router.back()
			this.$store.dispatch('changeStepActive', 1)
		}
	}
</script>
<style scoped lang="scss">
	.message {
		margin: 20px 0 0;
		text-align: center;
		font-size: 16px;
	}
	.el-form {
		width: 40%;
		margin: 30px auto;
	}
</style>