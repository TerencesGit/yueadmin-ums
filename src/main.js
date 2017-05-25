// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import Vuex from 'vuex'
import Router from 'vue-router'
import axios from 'axios'
import App from './App'
import routes from './router'
import store from './vuex/store'
import ElementUI from 'element-ui'
import { Message, Loading } from 'element-ui'
import NProgress from 'nprogress'
import moment from 'moment'
import utils from '@/assets/js/utils'
import 'element-ui/lib/theme-default/index.css'
import 'font-awesome/css/font-awesome.min.css'
import 'nprogress/nprogress.css'
import '@/assets/css/base.scss'
NProgress.configure({ ease: 'ease', speed: 500, minimum: 0.5})
NProgress.configure({ showSpinner: false })
Vue.use(Router)
Vue.use(Vuex)
Vue.use(ElementUI)
Vue.prototype.$moment = moment
Vue.prototype.$nprogress = NProgress
Vue.config.productionTip = false
Vue.filter('DateFormat', function(value){
	return moment(value).format('YYYY-MM-DD')
})
Vue.filter('TimeFormat', function(value){
	return moment(value).format('YYYY-MM-DD HH:mm:ss')
})
Vue.directive('title', {
  inserted (el, binding) {
    document.title = el.dataset.title
  }
})
Vue.component('back-button', {
	template: '<button class="back-button" @click="back">返回</button>',
	methods: {
		back () {
			this.$router.back()
		}
	}
})
const router = new Router({
  routes  
})
router.beforeEach((to, from, next) => {
	if(to.path === '/logout') {
		utils.delCookie('isLogin')
		return next('/login')
	}
	if(to.path === '/register' || to.path === '/login') {
		return next()
	}
	let sessionId = localStorage.getItem('sessionId')
	if (!sessionId && to.path != '/login') {
		next('/login')
	} else {
		NProgress.start()
		next()
	}
})
router.afterEach((to, from, next) => {
  console.log(to.path)
  NProgress.done()
})
/* response interceptors */
// 添加请求拦截器
// var globalLoading;
axios.interceptors.request.use(function (config) {
  // globalLoading = Loading.service({fullscreen: true})
  return config
}, function (error) {
  // 请求错误
  console.log('request error')
  return Promise.reject(error)
})
axios.interceptors.response.use(function (res) {
	// globalLoading.close()
  if (res.data.code ===  999) {
  	// utils.delCookie('isLogin')
  	localStorage.clear()
    Message.info({
   	  message: '长时间未操作,请重新登录'
    })
    return router.push('/login')
  } else if (res.data.code === 403) {
  	return router.push('/NoPermission')
  }
  return res;
}, function (error) {
  // response error
  Message.info({
 	  message: '服务器响应错误，请重试'
  })
  return Promise.reject(error)
})
/* eslint-disable no-new */
new Vue({
	store,
  router,
  render: h => h(App)
}).$mount('#app')
