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
// 引入商品管理页面
import Goods from '@/views/goods/goods.vue'
// 引入商品列表页面
import List from '@/views/goods/list.vue'
// 引入添加商品页面
import Add from '@/views/goods/add.vue'
// 引入商品分类页面
import Categories from '@/views/goods/categories.vue'
// 引入订单列表页面
import Order from '@/views/order/orders.vue'

// 注册路由
Vue.use(VueRouter)
// 创建一个路由对象
var router = new VueRouter({
  routes: [
    // 配置默认路由
    {
      path: '/',
      redirect: { name: 'Home' }
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
      // 重定向首页页面显示
      redirect: { name: 'Wel' },
      children: [
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
          path: 'rights',
          component: Right
        },
        // 商品管理页面
        {
          name: 'Goods',
          path: 'goods',
          component: Goods,
          redirect: { name: 'List' },
          children: [
            // 商品列表页面
            {
              name: 'List',
              path: 'lists',
              component: List
            },
            {
              name: 'Add',
              path: 'add',
              component: Add
            }
          ]
        },
        // 商品分类页面
        {
          name: 'Categories',
          path: 'categories',
          component: Categories
        },
        // 订单列表页面
        {
          name: 'Order',
          path: 'orders',
          component: Order
        }
      ]
    }
  ]
})

// 暴露路由
export default router
