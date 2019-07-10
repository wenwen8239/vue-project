<template>
  <div class="home">
    <el-container>
      <el-aside width="200px">
        <div class="logo"></div>
        <el-menu
          :router="true"
          :unique-opened="true"
          :default-active="'2-2'"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-submenu :index="first.id + ''" v-for=" first in menuList" :key="first.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{first.authName}}</span>
            </template>
            <el-menu-item :index="'/home/'+second.path" v-for="second in first.children" :key="second.id">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{second.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <i class="myicon myicon-menu toggle-btn"></i>
          <span class="system-title">后台管理系统</span>
          <a href="javascript:viod(0)" class="welcome" @click="loginOut">退出</a>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
// 引入api接口
import { getLeftMenuList } from '@/api/right_api.js'
export default {
  data () {
    return {
      menuList: []
    }
  },
  mounted () {
    // 获取左侧用户菜单权限显示
    getLeftMenuList()
      .then(res => {
        // console.log(res)
        this.menuList = res.data.data
      })
      .catch(err => {
        console.log(err)
      })
  },
  methods: {
    // 实现退出功能
    loginOut () {
      // 将本地存储的token清除
      localStorage.removeItem('manager_token')
      // 跳转至登录页
      this.$router.push('/login')
    }
  }
}
</script>
<style lang="less" scoped>
.home {
  height: 100%;
  .el-menu-admin:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .el-container {
    height: 100%;
  }
  .el-aside {
    background-color: #545c64;
  }
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #545c64;
  }
  .logo {
    height: 60px;
    background: url(../assets/img7.jpg);
    background-size: 100% 100%;
    background-color: #fff;
  }
  .toggle-btn {
    padding: 0 15px;
    margin-left: -20px;
    font-size: 36px;
    color: white;
    cursor: pointer;
    line-height: 60px;
    &:hover {
      background-color: #4292cf;
    }
  }
  .system-title {
    font-size: 28px;
    color: white;
  }
  .welcome {
    color: white;
  }
}
</style>
