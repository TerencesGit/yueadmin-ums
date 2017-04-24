<template>
	<aside class="sidebar transition" :class="{'hide': isHideSidebar}">
    <div class="sidebar-wrap">
      <div class="sidebar-header">
        <a href="/" class="brand ellipsis" :title="name">
          <i class="fa fa-flag fa-lg"></i>
          <strong>{{ name }}</strong>
        </a>
      </div>
      <div class="divide-line"></div>
  		<el-menu default-active="1-1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" theme="dark" unique-opened=true>
        <el-submenu :index="menu.index" v-for="menu in menus">
          <template slot="title"><i class="fa fa-lg" :class="menu.logo"></i>{{ menu.name }}</template>
            <el-menu-item :index="item.index" v-for="item in menu.submenu">
            	<router-link :to="item.link">{{ item.name }}</router-link>
            </el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
	</aside>
</template>
<script>
  export default {
    props: ['isHideSidebar'],
    data () {
      return {
        name: '我的企业',
        menus: [
          {
            name: '账户管理',
            index: '1',
            logo: 'fa-user',
            submenu: [
              {name: '账户首页', link: '/account/home', index: '1-1'}
              // {name: '账户编辑', link: '/account/edit', index: '1-2'},
              // {name: '账户安全', link: '/account/security', index: '1-3'}
            ]
          },
          {
            name: '供应商',
            index: '2',
            logo: 'fa-paw',
            submenu: [
              {name: '商品管理', link: '/supplier/wareManage', index: '2-1'}
            ]
          },
          {
            name: '分销商',
            index: '3',
            logo: 'fa-sitemap',
            submenu: [
              {name: '订单管理', link: '/distributor/orderManage', index: '3-1'}
            ]
          },
          {
            name: '平台管理员',
            index: '4',
            logo: 'fa-desktop',
            submenu: [
              {name: '商品上架审核', link: '/admin/wareAudit', index: '4-1'}
            ]
          }
        ]
      }
    },
    methods: {
      handleOpen (key, keyPath) {
      },
      handleClose (key, keyPath) {
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
	}
  .sidebar.hide {
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
