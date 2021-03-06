// 引入vue
import Vue from 'vue'
// 引入app.vue
import App from './App.vue'
// 引入路由
import router from '@/router/router.js'
// 引入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入公共样式文件
import '@/styles/index.less'
// 引入store
import store from './store'

Vue.config.productionTip = false
// 注册element-ui
Vue.use(ElementUI)

// 添加路由导航守卫
router.beforeEach((to, from, next) => {
  var token = localStorage.getItem('manager_token')
  if (token || to.path === '/login') {
    // 如果有token就next，继续执行
    next()
  } else if (!token && to.path !== '/login') {
    // 如果没有token或者你要去登录，重定向到登录页
    next({ name: 'Login' })
  }
})

new Vue({
  // 注入路由
  router,
  // 注入store
  store,
  render: h => h(App)
}).$mount('#app')
