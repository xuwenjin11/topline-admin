import Vue from 'vue'
import Router from 'vue-router'
import nprogress from 'nprogress'
import { getUser } from '@/utils/auth'
Vue.use(Router)

const router = new Router({
  routes: [
    // {
    //   name: 'home',
    //   path: '/',
    //   @可以直接定位到src目录下面
    //   在整个项目中，模块路径中的 @ 表示的是 src 目录
    //   无论你当前模块在哪里，@ 都可以直接定位到 src
    //   加载一个目录可以默认加载它的 index.js、index.vue、index.json。。。
    //   使用component路由懒加载方式，只查看当前页面，减少加载时间
    //   component: () => import('@/views/home')
    // },
    {
      name: 'layout',
      path: '/',
      component: () => import('@/views/layout'),
      children: [
        {
          name: 'home',
          path: '',
          component: () => import('@/views/home')
        },
        {
          name: 'publish',
          path: '/publish',
          component: () => import('@/views/publish')
        },
        {
          name: 'article',
          path: '/article',
          component: () => import('@/views/article')
        }
      ]
    },
    {
      name: 'login',
      path: '/login',
      component: () => import('@/views/login')
    }
  ]
})
// 前置路由守卫
router.beforeEach((to, from, next) => {
  // 加载进度条
  nprogress.start()
  // 获取localStorage存储的登录信息，判断是否登录
  const userInfo = getUser()
  // 未登录状态时，如果不是登录状态需要先登录
  if (to.path !== '/login') {
    // 当在登录页面时，想要跳转到其他页面时，进度条停止加载
    nprogress.done()
    // 未登录状态时
    if (!userInfo) {
      next({ name: 'login' })
    } else {
      next()
    }
  } else {
    // 如果是登录状态，已经登录过了，想要跳转到登录页，就强制刷新首页
    if (!userInfo) {
      next()
    } else {
      next({ name: 'home' })
      window.location.reload()
    }
  }
  // 246810万能验证码
  // 导航守卫结束后关闭进度条
  router.afterEach((to, from) => {
    nprogress.done()
  })
})
export default router
