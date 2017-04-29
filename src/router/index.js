import Hello from '@/components/Hello'
import Login from '@/view/login'
import NotFound from '@/view/NotFound'
import NoPermission from '@/view/NoPermission'

import Layout from '@/components/Layout'
import Home from '@/view/account/home'
import brandManage from '@/view/supplier/brandManage'
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
      { path: 'brandManage', component: brandManage, name: '品牌管理' },
      { path: 'wareManage', component: wareManage, name: '商品管理' },
      { path: 'addWare',component: addWare, name: '商品添加' },
      { path: 'editWare',component: editWare, name: '商品编辑' },
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
