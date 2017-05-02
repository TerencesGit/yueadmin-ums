import Hello from '@/components/Hello'
import Login from '@/view/login'
import NotFound from '@/view/NotFound'
import NoPermission from '@/view/NoPermission'

import Layout from '@/components/Layout'
import Home from '@/view/account/home'
import brandManage from '@/view/provider/brandManage'
import brandDetail from '@/view/provider/brandDetail'

import wareManage from '@/view/provider/wareManage'
import addWare from '@/view/provider/wareAdd'
import editWare from '@/view/provider/wareEdit'

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
    path: '/provider',
    name: 'provider',
    component: Layout,
    children: [
      { path: 'brandManage', component: brandManage, name: '品牌管理' },
      { path: 'brandDetail', component: brandDetail, name: '品牌详情' },
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
