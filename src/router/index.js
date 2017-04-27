import Hello from '@/components/Hello'
import Login from '@/view/login'
import NotFound from '@/view/NotFound'
import NoPermission from '@/view/NoPermission'

import Layout from '@/components/Layout'
import Home from '@/view/account/home'

const routes = [
  {
    path: '/',
    name: 'Hello',
    component: Hello
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/logout',
    name: 'logout',
    component: Login
  },
  {
    path: '/account',
    name: 'layout',
    component: Layout,
    children: [
    	{
    		path: 'home',
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
  {
  	path: '*',
  	redirect: '/NotFound'
  }
]
export default routes
