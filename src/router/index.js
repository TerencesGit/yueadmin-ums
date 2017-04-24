import Hello from '@/components/Hello'
import Layout from '@/components/Layout'
import Login from '@/view/login'
import Home from '@/view/account/home'
const routes = [
  {
    path: '/',
    name: 'Hello',
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
  	path: '*',
  	redirect: '/account'
  }
]
export default routes
