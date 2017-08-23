<template>
	<aside class="sidebar transition" :class="{'hide': sidebarStatus}">
    <div class="sidebar-wrap">
      <div class="sidebar-header">
        <a href="/" class="brand ellipsis" :title="partner.name">
          <i class="fa fa-flag fa-lg"></i>
          <strong>{{ title }}</strong>
        </a>
      </div>
      <div class="divide-line"></div>
  		<el-menu 
        router 
        theme="dark" 
        :default-active="$route.path" 
        :unique-opened="true" 
        :collapse="sidebarStatus">
        <el-submenu :index="index+''" v-for="(menu, index) in routes" :key="menu.id">
          <template slot="title">
            <i class="fa fa-lg" :class="menu.icon"></i>
            <span slot="title">{{ menu.name }}</span>
          </template>
            <el-menu-item :index="submenu.index" v-for="submenu in menu.children" :key="submenu.id">
            	<router-link :to="submenu.link">{{ submenu.name }}</router-link>
            </el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
	</aside>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      title: '悦视觉后台用户管理系统',
      routes: [
        {
          name: '账户管理',
          icon: 'fa-user',
          children: [
            {
              name: '账户首页', link: '/account/home', index: '/account/home'
            },
            {
              name: '账户编辑', link: '/account/edit', index: '/account/edit'
            },
            {
              name: '账户安全', link: '/account/security', index: '/account/security'
            },
            {
              name: '注册我的企业', link: '/account/partnerRegisted', index: '/account/partnerRegisted'
            },
          ]
        },
        {
          name: '我的企业管理',
          icon: 'fa-home',
          children: [
            {
              name: '企业首页', link: '/partner/home', index: '/partner/home'
            },
            {
              name: '企业信息', link: '/partner/info', index: '/partner/info'
            },
            {
              name: '组织部门管理', link: '/partner/organizeManage', index: '/partner/organizeManage'
            },
            {
              name: '员工管理', link: '/partner/staffManage', index: '/partner/staffManage'
            },
            {
              name: '岗位管理', link: '/partner/titleManage', index: '/partner/titleManage'
            },
          ]
        },
        {
          name: '我的商家',
          icon: 'fa-sitemap',
          children: [
            {
              name: '商家审核', link: '/admin/partnerVerify', index: '/admin/partnerVerify'
            },
            {
              name: '商家管理', link: '/admin/partnerManage', index: '/admin/partnerManage'
            },
            {
              name: '合同管理', link: '/admin/contractManage', index: '/admin/contractManage'
            },
            {
              name: '合同模板管理', link: '/admin/templateManage', index: '/admin/templateManage'
            },
          ]
        },
        {
          name: '系统管理',
          icon: 'fa-cog',
          children: [
            {
              name: '功能管理', link: '/admin/functionManage', index: '/admin/functionManage'
            },
            {
              name: '角色管理', link: '/admin/roleManage', index: '/admin/roleManage'
            },
            {
              name: '商家类型管理', link: '/admin/partTypeManage', index: '/admin/partTypeManage'
            },
            {
              name: '公告信息管理', link: '/admin/noticeManage', index: '/admin/noticeManage'
            },
            {
              name: '账户管理', link: '/admin/accountManage', index: '/admin/accountManage'
            },
          ]
        },
      ],
      isCollapse: false
    }
  },
  computed: {
    ...mapGetters([
      'sidebarStatus'
    ]),
    // ...mapGetters({
    //   routers: 'userPermission'
    // }),
    ...mapGetters({
      partner: 'partnerInfo'
    }),
  },
}
</script>
<style scoped lang="scss">
	.sidebar {
		position: fixed;
		top: 0;
    left: 0;
    z-index: 99;
		width: 240px;
		height: 100%;
    // overflow: hidden;
		background-color: #324157;
    &.hide {
      // left: -240px;
      width: 64px;
    }
	}
  .sidebar-wrap {
    position: absolute;
    width: 240px;
    height: 100%;
    overflow-y: auto;
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
