import Vue from 'vue'
import App from './App.vue'
// 先找文件，没有就找目录
// 如果找到目录，优先加载目录中的 index
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入less公共样式
import './styles/index.less'
// 引入进度条样式
import '../node_modules/nprogress/nprogress.css'
Vue.config.productionTip = false
Vue.use(ElementUI)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
