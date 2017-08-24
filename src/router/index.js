import Layout from '@/components/Layout'
import Login from '@/pages/login'
import Register from '@/pages/register'
import NotFound from '@/pages/NotFound'
import NoPermission from '@/pages/NoPermission'
import Welcome from '@/pages/welcome'

import AccountHome from '@/pages/account/home'

const routes = [
  {
    path: '/',
    redirect: '/welcome'
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
    name: '账户主页',
    component: Layout,
    children: [
    	{
    		path: 'home',
        name: '账户首页',
    		component: AccountHome
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
