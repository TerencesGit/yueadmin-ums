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
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import moment from 'moment'
import VueHtml5Editor from 'vue-html5-editor'
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
const editorOptions = {
    image: {
        // 文件最大体积，单位字节  max file size 
        sizeLimit: 512 * 1024,
        // 上传参数,默认把图片转为base64而不上传 
        // upload config,default null and convert image to base64 
        upload: {
            url: 'http://localhost:3000/brand/provider/brandUpload',
            headers: {},
            params: {},
            fieldName: 'image'
        },
        // 压缩参数,默认使用localResizeIMG进行压缩,设置为null禁止压缩 
        // compression config,default resize image by localResizeIMG (https://github.com/think2011/localResizeIMG) 
        // set null to disable compression 
        compress: {
            width: 1600,
            height: 1600,
            quality: 80
        },
        // 响应数据处理,最终返回图片链接 
        // handle response data，return image url 
        uploadHandler(responseText){
            //default accept json data like  {ok:false,msg:"unexpected"} or {ok:true,data:"image url"} 
            var json = JSON.parse(responseText)
            if (!json.ok) {
                alert(json.msg)
            } else {
                return json.data
            }
        }
    },
    language: "zh-cn"
}
Vue.use(VueHtml5Editor, editorOptions)
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
	let isLogin = utils.getCookie('isLogin')
	if (!isLogin && to.path != '/login') {
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
axios.interceptors.response.use(function (res) {
  if (res.data.status ===  '401') {
  	utils.delCookie('isLogin')
    router.push('/login')
    Message.info({
   	  message: '长时间未操作,请重新登录'
    })
  } else if (res.data.status === '403') {
  	router.push('/NoPermission')
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
