// 引入vue
import Vue from 'vue'
// 引入路由
import VueRouter from 'vue-router'
// 引入登录页面
import Login from '@/views/Login.vue'
// 引入首页
import Home from '@/views/Home.vue'
// 引入welcome子组件
import Wel from '@/views/welcome.vue'
// 引入用户列表子组件
import Users from '@/views/users/index.vue'
// 引入用户管理子组件
import Role from '@/views/right/roleList.vue'
// 引入权限管理子组件
import Right from '@/views/right/rightList.vue'

// 注册路由
Vue.use(VueRouter)
// 创建一个路由对象
var router = new VueRouter({
  routes: [
    // 配置默认路由
    {
      path: '/',
      redirect: { name: 'Wel' }
    },
    // 配置单个路由对象
    // 设置登录页
    {
      name: 'Login',
      path: '/login',
      component: Login
    },
    // 设置首页
    {
      name: 'Home',
      path: '/Home',
      component: Home,
      children: [
        // 重定向首页页面显示
        {
          path: '/Home',
          redirect: { name: 'Wel' }
        },
        // 设置欢迎页
        {
          name: 'Wel',
          path: 'wel',
          component: Wel
        },
        // 设置用户列表页
        {
          name: 'Users',
          path: 'users',
          component: Users
        },
        // 设置角色管理页
        {
          name: 'Role',
          path: 'roles',
          component: Role
        },
        // 设置权限管理页
        {
          name: 'Right',
          path: 'right',
          component: Right
        }
      ]
    }
  ]
})

// 暴露路由
export default router
