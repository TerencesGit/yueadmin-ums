<template>
	<aside class="sidebar">
    <div class="sidebar-wrap">
      <div class="sidebar-header">
        <a href="/" class="brand ellipsis" title="我的企业">
          <i class="fa fa-flag fa-lg"></i>
          <strong>我的企业</strong>
        </a>
      </div>
      <div class="divide-line"></div>
  		<el-menu default-active="1-1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" theme="dark" unique-opened="true">
        <el-submenu index="1">
          <template slot="title"><i class="fa fa-user fa-lg"></i>账户管理</template>
          <!-- <el-menu-item-group> -->
            <el-menu-item index="1-1">
            	<router-link to="/account/home">账户首页</router-link>
            </el-menu-item>
            <el-menu-item index="1-2">
      				<router-link to="/account/edit">账户编辑</router-link>
            </el-menu-item>
            <el-menu-item index="1-3">
            	<router-link to="/account/security">账户安全</router-link>
            </el-menu-item>
          <!-- </el-menu-item-group> -->
        </el-submenu>
        <el-submenu index="2">
          <template slot="title"><i class="el-icon-message"></i>供应商</template>
            <el-menu-item index="2-1">
              <router-link to="/supplier/wareManage">商品管理</router-link>
            </el-menu-item>
            <el-menu-item index="2-2">
              <router-link to="/supplier/stockManage">库存管理</router-link>
            </el-menu-item>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title"><i class="el-icon-message"></i>分销商</template>
            <el-menu-item index="3-1">订单管理</el-menu-item>
        </el-submenu>
        <el-submenu index="4">
          <template slot="title"><i class="el-icon-message"></i>平台管理员</template>
            <el-menu-item index="4-1">商品上架审核</el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
	</aside>
</template>
<script>
  export default {
    data () {
      return {
      }
    },
    methods: {
      handleOpen (key, keyPath) {
        console.log(key)
        console.log(keyPath)
      },
      handleClose (key, keyPath) {
        console.log(key, keyPath)
      }
    }
  }
</script>
<style scoped lang="scss">
	.sidebar {
		position: fixed;
		top: 0;
    left: 0;
		width: 240px;
		height: 100%;
    overflow: hidden;
		background-color: #324157;
    transition: left .3s;
	}
  .sidebar.sidebar-close {
    left: -240px;
  }
  .sidebar-wrap {
    position: absolute;
    width: 260px;
    height: 100%;
    overflow-y: scroll;
  }
  .sidebar-header {
    padding: 20px 15px;
    text-align: left;
    .brand {
      margin: 10px 0;
      font-size: 16px;
      line-height: 1.1;
      color: #DFE4ED;
    }
  }
  .divide-line {
    width: 100%;
    height: 2px;
    overflow: hidden;
    font-size: 0;
    background-color: #233b4c;
  }
  .el-submenu {
    text-align: left;
    .el-menu-item {
      padding-left: 10px
    }
  }
	.el-menu-item {
    text-indent: 5px;
		a {
			display: block;
			text-decoration: none;
			color: #bfcbd9;
		}
		.router-link-active {
			color: #fff;
		}
	}
	.el-submenu .fa {
		vertical-align: baseline;
    margin-right: 10px;
	}
</style>
