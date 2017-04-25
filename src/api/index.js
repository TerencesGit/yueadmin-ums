import axios from 'axios'
import qs from 'qs'
const baseUrl = 'http://localhost:3000'
axios.defaults.baseURL = 'http://localhost:3000'
const postAxios = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000,
  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
})
export const requestLogin = params => { return postAxios.post('/user/signinPost', qs.stringify(params))}
