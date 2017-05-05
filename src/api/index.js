import axios from 'axios'
import Qs from 'qs'
axios.defaults.baseURL = 'http://localhost:3000'
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
export const requestLogin = data => { return axios.post('/login', data) }
// 注册
export const requestRegister = data => { return axios.post('/register', data) }
// 登出
export const requestExit = () => { return axios.get('/logoutAsync') }
// 获取侧边栏
export const getUserPermission = () => { return axios.get('/user/permission')}
// 品牌管理
export const brandList = () => { return axios.get('/brand/provider/brandList')}
export const brandAdd = data => { return axios.post('/brand/provider/brandAdd', data)}
export const brandSave = data => { return axios.post('/brand/provider/brandSave', data)}
export const brandDel = params => { return axios.get('/brand/provider/brandDel', {params: params})}
export const brandDetail = params => { return axios.get('/brand/provider/brandDetail', {params: params})}
// 商品管理
export const getWareList = () => { return axios.get('/user/getWareList')}
export const addWare = data => { return axios.post('/user/addWare', data)}
export const getWareDetail = params => { return axios.get('/user/wareDetail', {params: params})}
