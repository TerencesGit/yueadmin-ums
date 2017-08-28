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
import NProgress from 'nprogress'
import moment from 'moment'
import Mock from './mock'
import 'element-ui/lib/theme-default/index.css'
import 'font-awesome/css/font-awesome.min.css'
import 'nprogress/nprogress.css'
import '@/assets/css/base.scss'
NProgress.configure({ ease: 'ease', speed: 500, minimum: 0.5, showSpinner: false})
Mock.bootstrap()
Vue.use(Vuex)
Vue.use(Router)
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
Vue.prototype.$catchError = (err) => {
  if(err.response) {
    let res = err.response;
    if(res.status) {
      let status = res.status;
      if(status === 400) {
        ElementUI.Message('请求错误')
      } else {
        ElementUI.Message('服务器响应错误')
      }
    }
  } else {
    ElementUI.Message('服务器响应超时')
  }
}
const router = new Router({
  routes  
})
router.beforeEach((to, from, next) => {
  let user = sessionStorage.getItem('account')
  let logRequired = to.path.indexOf('account') !== -1 || 
                    to.path.indexOf('admin') !== -1;
  if(logRequired && !user) {
    ElementUI.Message('尚未登录或当前会话已过期')
    return router.push('/login')
  } 
  NProgress.start()
  next()
})
router.afterEach((to, from, next) => {
  // console.log(to.path)
  NProgress.done()
})
axios.interceptors.request.use(config => {
  return config
}, error => {
  return Promise.reject(error)
})
axios.interceptors.response.use(res =>{
  if (res.data.code ===  999) {
  	localStorage.clear()
    return router.push('/login')
  } else if (res.data.code === 403) {
  	return router.push('/NoPermission')
  }
  return res;
}, error => {
  return Promise.reject(error)
})
/* eslint-disable no-new */
new Vue({
	store,
  router,
  render: h => h(App)
}).$mount('#app')
