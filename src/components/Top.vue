<template>
	<header>
		<div class="top">
			<div class="container-fluid">
				<div class="top-left">
					<a href="#" class="brand">
						<i class="fa fa-flag fa-lg"></i>
						悦视觉供应商系统
					</a>
				</div>
				<div class="top-right">
					<div class="provider-name">
						欢迎您：
						<span>北京鸿基国际旅行社有限责任公司第一分公司</span>
					</div>
					<div class="new-info">
						<a href="#">帮助</a>
						<a href="#">咨询及通告</a>
						<a href="#">公告</a>
						<a href="#">修改密码</a>
						<a href="#">退出</a>
					</div>
				</div>
			</div>
		</div>
		<nav>
			<el-menu :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" @select="handleSelect">
			  <el-menu-item index="1">处理中心</el-menu-item>
			  <el-submenu index="2">
			    <template slot="title">我的工作台</template>
			    <el-menu-item index="2-1">选项1</el-menu-item>
			    <el-menu-item index="2-2">选项2</el-menu-item>
			    <el-menu-item index="2-3">选项3</el-menu-item>
			  </el-submenu>
			  <el-menu-item index="3"><a href="https://www.ele.me" target="_blank">订单管理</a></el-menu-item>
			  <el-menu-item index="4"><a href="https://www.ele.me" target="_blank">订单管理</a></el-menu-item>
			  <el-menu-item index="5"><a href="https://www.ele.me" target="_blank">订单管理</a></el-menu-item>
			  <el-menu-item index="6"><a href="https://www.ele.me" target="_blank">订单管理</a></el-menu-item>
			  <el-menu-item index="7"><a href="https://www.ele.me" target="_blank">订单管理</a></el-menu-item>
			</el-menu>
		</nav>
	</header>
</template>
<script>
  export default {
    data() {
      return {
        activeIndex: '1',
        activeIndex2: '1'
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>
<style scoped lang="scss">
	.top {
		height: 50px;
		line-height: 50px;
		color: #fff;
		font-size: 12px;
		background: #394054
	}
	.top-left {
		float: left;
		.brand {
			color: #fff;
			font-size: 16px
		}
	}
	.top-right {
		float: right;
		div {
			display: inline-block;
		}
		.new-info a {
			color: #fff;
			padding: 0 10px;
			border-left: 1px solid #fff;
			&:first-child {
				border: 0
			}
		}
	}
	.el-menu {
		border-radius: 0;
		background: #fff
	}
</style>