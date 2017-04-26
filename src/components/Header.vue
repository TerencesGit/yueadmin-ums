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
		    <el-dropdown-item @click.native=""><router-link :to="home">主页</router-link></el-dropdown-item>
				<el-dropdown-item divided><a @click="logout">退出</a></el-dropdown-item>
		  </el-dropdown-menu>
		</el-dropdown>
	</header>
</template>
<script>
import { requestExit } from '../api'
export default {
	props: ['isHideSidebar'],
	data () {
		return {
			home: '/account/home'
		}
	},
  methods: {
    toggleSidebar () {
      this.$emit('toggleSide')
    },
    logout () {
    	this.$confirm('确定退出系统?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
      	let params = 123
      	console.log(params)
      	requestExit(params).then(res => {
      		if(res.data.status === 2) {
      			this.$router.push('/login');
      			this.$message({
		          type: 'success',
		          message: '退出成功!'
		        })
      		} else {
      			this.$message({
		          type: 'success',
		          message: '删除成功!'
		        })
      		}
      	})
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      })
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
