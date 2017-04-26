// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import axios from 'axios'
import Router from 'vue-router'
import App from './App'
import routes from './router'
import NProgress from 'nprogress'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import 'font-awesome/css/font-awesome.min.css'
import 'animate.css/animate.min.css'
import 'nprogress/nprogress.css'
import '@/assets/css/base.css'
Vue.use(ElementUI)
Vue.use(Router)
NProgress.configure({ ease: 'ease', speed: 2000 })
// NProgress.configure({ showSpinner: false })
Vue.config.productionTip = false
const axio = axios.create({
  baseURL: 'http:localhost:3000',
  timeout: 5000
});
const router = new Router({
  routes  
})
router.beforeEach((to, from, next) => {
	if(to.path === '/logout') {
		localStorage.removeItem('userId')
		next('/signin')
	}
	let userId = localStorage.getItem('userId')
	if (!userId && to.path != '/signin') {
		console.log(userId)
		next('/signin')
	} else {
		next()
	}
})
router.afterEach((to, from, next) => {
  console.log(to.path);
});
/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
