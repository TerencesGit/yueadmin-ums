import Hello from '@/components/Hello'
import Login from '@/view/login'
import Register from '@/view/register'
import NotFound from '@/view/NotFound'
import NoPermission from '@/view/NoPermission'

import Layout from '@/components/Layout'
import Home from '@/view/account/home'
import brandManage from '@/view/provider/brandManage'
import brandDetail from '@/view/provider/brandDetail'

import wareManage from '@/view/provider/wareManage'
import addWare from '@/view/provider/wareAdd'
import editWare from '@/view/provider/wareEdit'

import html5Editor from '@/view/tools/VueHtml5Editor'
import UEditor from '@/view/tools/UEditor'

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
    path: '/tools',
    name: 'tools',
    component: Layout,
    children: [
      { path: 'vueHtml5Editor', component: html5Editor, name: 'Html5富文本编辑' },
      { path: 'UEditor', component: UEditor, name: 'UEditor富文本编辑' },
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
