import Layout from '@/components/Layout'
import Login from '@/pages/login'
import Register from '@/pages/register'
import NotFound from '@/pages/NotFound'
import NoPermission from '@/pages/NoPermission'
import Welcome from '@/pages/welcome'

import AccountCenter from '@/pages/account/infocenter'
import AccountSettings from '@/pages/account/settings'
import RegistedPartner from '@/pages/account/registedpartner'
import WaittingVerify from '@/pages/account/waittingverify'

import PartnerEdit from '@/pages/partner/partneredit'
import PartnerOrgManage from '@/pages/partner/orgmanage'

import SystemFuncManage from '@/pages/system/funcmanage'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: '欢迎登录',
    component: Login
  },
  {
    path: '/register',
    name: '欢迎注册',
    component: Register
  },
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: 'welcome',
        name: '欢迎',
        component: Welcome
      }
    ]
  },
  {
    path: '/account',
    name: '我的账户',
    component: Layout,
    children: [
    	{
    		path: 'infocenter',
        name: '账户中心',
    		component: AccountCenter
    	},
      {
        path: 'settings',
        name: '账户设置',
        component: AccountSettings
      },
      {
        path: 'registedpartner',
        name: '注册我的企业',
        component: RegistedPartner
      },
      {
        path: 'waittingverify',
        name: '等待企业审核',
        component: WaittingVerify
      },
    ]
  },
  {
    path: '/partner',
    name: '企业管理',
    component: Layout,
    children: [
      {
        path: 'infoedit',
        name: '信息编辑',
        component: PartnerEdit,
      },
      {
        path: 'organizemanage',
        name: '组织部门管理',
        component: PartnerOrgManage,
      }
    ]
  },
  {
    path: '/system',
    name: '系统管理',
    component: Layout,
    children: [
      {
        path: 'funcmanage',
        name: '功能管理',
        component: SystemFuncManage,
      }
    ]
  },
  {
    path: '/NoPermission',
    name: 'nopermission',
    component: NoPermission
  },
  {
    path: '/NotFound',
    name: 'notfound',
    component: NotFound
  },
  {
  	path: '*',
  	redirect: '/NotFound'
  }
]
export default routes
