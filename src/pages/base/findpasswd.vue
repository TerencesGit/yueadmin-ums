<template>
	<section class="page">
		<div v-title :data-title="this.$route.name"></div>
	  <el-row>
	  	<el-col :span="18" :offset="3">
	  		<el-card class="card-primary" style="margin-top: 10%">
	  			<div slot="header">找回密码</div>
		  		<el-steps space="22%" :active="stepActive" align-center center finish-status="success">
					  <el-step title="填写绑定邮箱"></el-step>
					  <el-step title="验证邮箱"></el-step>
					  <el-step title="重置密码"></el-step>
					  <el-step title="重置密码成功"></el-step>
					</el-steps>
					<keep-alive>
						<router-view></router-view>
			    </keep-alive>
	  		</el-card>
	  	</el-col>
	  </el-row>
	</section>
</template>
<script>
	import { mapGetters } from 'vuex'
	export default {
		name: 'findpasswd',
		data() {
			return {
			}
		},
		computed: {
		  ...mapGetters([
	  		'stepActive'
	  	])
	  },
	}
</script>
<style scoped lang="scss">
	.page {
		position: absolute;
		width: 100%;
		height: 100%;
		background: #f0f0f0
	}
	.el-steps {
		margin: 50px 0;
	}
	.el-card {
		min-height: 400px
	}
</style>