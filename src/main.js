import Vue from 'vue'
import App from './App.vue'
// 先找文件，没有就找目录
// 如果找到目录，优先加载目录中的 index
import router from './router'
import ElementUI from 'element-ui'
import { getUser, removeUser } from '@/utils/auth'
import 'element-ui/lib/theme-chalk/index.css'
// 引入less公共样式
import './styles/index.less'
// 引入进度条样式
import '../node_modules/nprogress/nprogress.css'
// 配置axios,使其可以在任何文件都可以使用，配置路径
import axios from 'axios'
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0'
// axios.defaults.baseURL = 'http://toutiao.course.itcast.cn/mp/v1_0'
// 进行守卫拦截
/* Axios 请求拦截器：axios 发出去的请求会先经过这里
 * config 是本次请求相关的配置对象
 */
axios.interceptors.request.use(config => {
  const user = getUser()
  // 如果有user，则往header中添加用户的token
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})
// /**
//  * axios响应拦截器，对响应的拦截进行获取，处理
//  * 返回数据401的状态码，表示token过期或未上传成功
//  * 在响应拦截器中进行处理
//  */
axios.interceptors.response.use(response => {
  // 在响应拦截器中可以进行对响应数据的处理，对响应数据的格式进行控制
  // 如果响应数据状态码>=200并<400,进入以下处理程序
  if (typeof response.data === 'object' && response.data.data) {
    return response.data.data
  } else {
    return response.data
  }
}, error => {
  console.log(111)
  if (error.response.status === 401) {
    // 清除token
    removeUser()
    router.push({
      name: '/login'
    })
  }
  return Promise.reject(error)
})
Vue.prototype.$http = axios

Vue.config.productionTip = false
Vue.use(ElementUI)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
