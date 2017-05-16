import axios from 'axios'
import Qs from 'qs'
axios.defaults.baseURL = '/baseUrl'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.transformRequest = [(data) => { return Qs.stringify(data) }]
axios.defaults.timeout = 5000

//判断是否是本地调试 或者是 服务器访问
// const base = window.location.href.indexOf("localhost") >= 0 ? 
// 'http://www.yueshijue.com' : window.location.protocol + "//" + window.location.host;
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 发送请求之前
  return config
}, function (error) {
  // 请求错误
  console.log('request error')
  return Promise.reject(error)
})
// 登录
export const requestLogin = data => { return axios.post('/ysj/auth/login.json', data) }
// export const requestLogin = params => { return axios.get('/ysj/auth/login.json', {params: params})}

// 获取用户权限
export const getPermissionList = () => { return axios.get('/ysj/permission/getPermissionList.json')}

// 注册
export const requestRegister = data => { return axios.post('/register', data) }
// 登出
// export const requestExit = () => { return axios.get('/logoutAsync') }

export const requestExit = params => { return axios.get('/ysj/auth/logout.json', {params: params})}

//商户管理页面-获取用户分页
export const getBusinessList = params => { return axios.get('/ysj/yueShop/paginationYueShops.json', {params: params})}
