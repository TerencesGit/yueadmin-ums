import Layout from '@/components/Layout'

import Login from '@/pages/login'
import Register from '@/pages/register'
import NotFound from '@/pages/NotFound'
import NoPermission from '@/pages/NoPermission'

import Home from '@/pages/home'

const routes = [
  {
    path: '/',
    redirect: '/account/home'
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
