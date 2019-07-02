/***
 * vuex：集中式状态（数据）管理
 * 我们将不好组件通信的交互的组件数据放到这里
 * 使用从这里使用修改从这里修改
 * 这里的数据和任何组件都是无关的
 * 这里的数据任何组件都可以访问和修改
 * 而且这里的数据是响应式的，数据的改变会直接影响组件视图更新
 *
 */
import Vue from 'vue'
import Vuex from 'vuex'
import { getUser, setUser } from '@/utils/auth'

Vue.use(Vuex)

const store = new Vuex.Store({
  // state中的数据在任何组件中都可以访问到
  state: {
    user: getUser() || {} // user中的初始数据来源于本地存储
  },
  mutations: {
    // increment (state) {
    //   state.count++
    changeUser (state, user) {
      Object.assign(state.user, user)
      setUser(state.user)
    }
  }
})

export default store
