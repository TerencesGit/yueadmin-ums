<template>
	<header class="header clearfix transition" :class="{'spread': isHideSidebar}">
		<div class="pull-left">
			<el-button type="primary" class="btn-toggle" @click="toggleSidebar"><i class="fa fa-bars"></i></el-button>
		</div>
		<el-dropdown :hide-on-click="false" trigger="click" class="pull-right">
		  <span class="el-dropdown-link">
		  	<img src="../assets/img/logo.png" class="avatar"/>
		    Transform<i class="el-icon-caret-bottom el-icon--right"></i>
		  </span>
		  <el-dropdown-menu slot="dropdown">
		    <el-dropdown-item @click.native="" disabled>修改密码</el-dropdown-item>
		    <el-dropdown-item @click.native=""><router-link :to="account">主页</router-link></el-dropdown-item>
				<el-dropdown-item divided><router-link :to="logout">退出</router-link></el-dropdown-item>
		  </el-dropdown-menu>
		</el-dropdown>
	</header>
</template>
<script>
  export default {
  	props: ['isHideSidebar'],
  	data () {
  		return {
  			logout: '/',
  			account: '/account/home'
  		}
  	},
    methods: {
      toggleSidebar () {
        this.$emit('toggleSide')
      }
    }
  }
</script>
<style scoped lang="scss">
	.header {
		position: fixed;
		top: 0;
		left: 240px;
		right: 0;
		z-index: 999;
		background: #fff;
		box-shadow: 0 0 1px rgba(0,0,0,0.25);
		&.spread {
			left: 0;
		}
	}
	.el-menu {
		border-radius: 0;
		background-color: rgba(255,255,255,.95);
	}
	.avatar {
		width: 20px;
		height: 20px;
		vertical-align: middle
	}
	.el-dropdown {
		min-width: 150px;
		height: 60px;
		line-height: 60px;
	}
	.el-dropdown-link {
		padding: 10px;
		border-radius: 4px;
    border: 1px solid #f0f0f8;
	}
	.el-dropdown-menu {
		width: 140px;
		a {
			display: block
		}
	}
	.btn-toggle {
		margin: 12px 20px;
	}
</style>
