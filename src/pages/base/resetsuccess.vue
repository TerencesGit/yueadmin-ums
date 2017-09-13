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
	export default {
		data() {
			return {
				count: 5
			}
		},
		methods: {
			countDown() {
				let timer = null;
				timer = setInterval(() => {
					this.count--;
					if(this.count <= 0) {
						clearInterval(timer)
						this.$router.push('/login')
					}
				}, 1000)
			}
		},
		mounted() {
			this.$store.dispatch('changeStepActive', 4)
			this.countDown()
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