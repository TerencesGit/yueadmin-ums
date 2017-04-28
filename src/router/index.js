import Hello from '@/components/Hello'
import Login from '@/view/login'
import NotFound from '@/view/NotFound'
import NoPermission from '@/view/NoPermission'

import Layout from '@/components/Layout'
import Home from '@/view/account/home'
import wareManage from '@/view/supplier/wareManage'
import addWare from '@/view/supplier/wareAdd'
import editWare from '@/view/supplier/wareEdit'

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
    path: '/account',
    name: 'account',
    component: Layout,
    children: [
    	{
    		path: 'home',
    		component: Home
    	}
    ]
  },
  {
    path: '/supplier',
    name: 'supplier',
    component: Layout,
    children: [
      {
        path: 'wareManage',
        component: wareManage
      },
      {
        path: 'addWare',
        component: addWare
      },
      {
        path: 'editWare',
        component: editWare
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
