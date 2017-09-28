<template>
	<section>
		<div class="message">
			<h4> <i class="el-icon-circle-check"></i>密码重置成功！</h4>
			<p class="">
	      <span id="count">{{count}}</span>秒后自动跳转到
	      <router-link to="/login">登录页面</router-link>
	    </p>
		</div>
	</section>
</template>
<script>
	import { getMyInfo } from '@/api'
	export default {
		data() {
			return {
				count: 5
			}
		},
		methods: {
			// 倒计时
			countDown() {
				let timer = null;
				timer = setInterval(() => {
					this.count--;
					if(this.count <= 0) {
						clearInterval(timer)
						this.$router.push('/login')
					}
				}, 1000)
			},
			// 判断用户是否登录
			getUserInfo() {
				getMyInfo().then(res => {
					console.log(res)
					if(res.data.code === '0001') {
						this.$router.push({ path: '/account/infocenter' })
					} else if(res.data.code === '0009') {
						this.countDown()
					} else {
						this.$message.error(res.data.message)
					}
				}).catch(err => {
					console.log(err)
					this.$catchError(err)
				})
			},
		},
		mounted() {
			this.getUserInfo()
			this.$store.dispatch('changeStepActive', 4)
		}
	}
</script>
<style scoped lang="scss">
	.message {
		text-align: center;
		h4 {
			margin: 30px 0;
			font-size: 18px;
			i {
				margin-right: 10px;
				color: #13ce66;
				font-size: 20px;
			}
		}
	}
</style>