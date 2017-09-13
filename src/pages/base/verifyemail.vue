<template>
	<section>
		<h4 class="message">重置密码邮件已发送到您的
		<router-link to="/">{{email}}</router-link>邮箱，请注意查收</h4>
	</section>
</template>
<script>
	export default {
		data() {
			return {
				email: ''
			}
		},
		methods: {

		},
		mounted() {
			this.$route.query && this.$route.query.email && (this.email = this.$route.query.email) || this.$router.back()
			this.$store.dispatch('changeStepActive', 1)
		}
	}
</script>
<style scoped lang="scss">
	.message {
		margin: 100px 0;
		text-align: center;
		font-size: 18px;
	}
</style>