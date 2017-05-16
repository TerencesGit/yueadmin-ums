import Hello from '@/components/Hello'
import Login from '@/view/login'
import Register from '@/view/register'
import NotFound from '@/view/NotFound'
import NoPermission from '@/view/NoPermission'

import Layout from '@/components/Layout'

import Home from '@/view/User/account/home'
import businessManage from '@/view/Finance/installmentLoan/businessManage'
import loanManage from '@/view/Finance/installmentLoan/loanManage'

const routes = [
  {
    path: '/',
    name: 'Hello',
    component: Hello
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
    path: '/account',
    name: '账户主页',
    component: Layout,
    children: [
    	{
    		path: 'home',
        name: '账户首页',
    		component: Home
    	}
    ]
  },
  {
    path: '/installmentLoan',
    name: '分期贷平台',
    component: Layout,
    children: [
      {
        path: 'businessManage',
        name: '商户管理',
        component: businessManage
      },
      {
        path: 'customerManage',
        name: 'C端用户管理',
        component: Home
      },
      {
        path: 'loanManage',
        name: '分期贷管理',
        component: loanManage
      },
      {
        path: 'financeManage',
        name: '金融机构管理',
        component: Home
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
  // {
  // 	path: '*',
  // 	redirect: '/NotFound'
  // }
]
export default routes
