<template>
	<aside class="sidebar transition" :class="{'hide': sidebarStatus}">
    <div class="sidebar-wrap">
      <div class="sidebar-header">
        <a href="/" class="brand ellipsis" :title="partner.name">
          <i class="fa fa-flag fa-lg"></i>
          <strong>{{ partner.name }}</strong>
        </a>
      </div>
      <div class="divide-line"></div>
  		<el-menu :default-active="$route.path" class="el-menu-vertical-demo" theme="dark" :unique-opened="true" router>
        <el-submenu :index="index+''" v-for="(menu, index) in routers" :key="menu.id">
          <template slot="title"><i class="fa fa-lg" :class="menu.icon"></i>{{ menu.name }}</template>
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
      routers: [
        {
          name: '分期贷平台管理',
          icon: 'fa-user',
          children: [
            {name: '商户管理', link: '/installmentLoan/businessManage', index: '/installmentLoan/businessManage'},
            {name: 'C端客户管理', link: '/installmentLoan/customerManage', index: '/installmentLoan/customerManage'},
            {name: '分期贷订单管理', link: '/installmentLoan/loanManage', index: '/installmentLoan/loanManage'},
            {name: '金融机构管理', link: '/installmentLoan/financeManage', index: '/installmentLoan/financeManage'},
            // {name: '账户编辑', link: '/account/edit', index: '1-2'},
            // {name: '账户安全', link: '/account/security', index: '1-3'}
          ]
        },
        {
          name: '我的企业',
          icon: 'fa-paw',
          children: [
            {name: '企业信息', link: '/myBusiness/businessInfo', index: '/myBusiness/businessInfo'},
            {name: '二维码分享', link: '/myBusiness/QRCodeShare', index: '/myBusiness/QRCodeShare'},
          ]
        },
        {
          name: '分销商',
          icon: 'fa-sitemap',
          children: [
            {name: '订单管理', link: '/distributor/orderManage', index: '3-1'}
          ]
        },
        {
          name: '平台管理员',
          icon: 'fa-desktop',
          children: [
            {name: '商品上架审核', link: '/admin/wareAudit', index: '4-1'}
          ]
        }
      ]
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
