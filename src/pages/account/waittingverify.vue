<template>
	<section>
		<div v-title :data-title="this.$route.name"></div>
		<el-card class="card-primary">
			<div slot="header">
				等待审核
			</div>
			<div class="card-content">
				<h3>
					<i class="fa fa-check"></i>
					提交成功！
				</h3>
				<p>
					请等待管理员审核... 
				</p>
				<router-link to="/account/infocenter">返回账户中心</router-link>
			</div>
		</el-card>
	</section>
</template>
<style scoped lang="scss">
	.el-card {
		min-height: 300px;
	}
	.card-content {
		padding: 15px 0;
		text-align: center;
		font-size: 18px;
		h3 {
			margin: 35px 0;
			font-size: 24px;
			i {
				margin-right: 10px;
				color: #7ABD54;
				font-size: 28px;
			}
		}
		p {
			margin: 15px 0;
			color: #666;
		}
	}
</style>