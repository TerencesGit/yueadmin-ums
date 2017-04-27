import axios from 'axios'
import Qs from 'qs'
axios.defaults.baseURL = 'http://localhost:3000'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
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
  return Promise.reject(error)
})

export const requestLogin = params => { return axios.post('/signinPost', Qs.stringify(params))}
export const requestExit = () => { return axios.get('/logoutAsync')}
export const getUserPermission = () => { return axios.get('/user/permission')}
