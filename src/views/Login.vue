<template>
  <div class="login">
    <div class="container">
      <img src="../assets/img1.jpg" class="avatar" alt="">
      <el-form :model="loginForm" :rules="rules" ref="loginForm" class="demo-ruleForm">
        <el-form-item prop="username">
          <el-input type="username" v-model="loginForm.username" clearable prefix-icon="myicon myicon-user" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" clearable prefix-icon="myicon myicon-key" placeholder="请输入密码" @keyup.enter.native="loginsubmit"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login-btn" @click="loginsubmit">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
// 引入login的接口
import { login } from '@/api/user_api.js'
export default {
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    loginsubmit () {
      // 判断当前验证是否通过
      this.$refs.loginForm.validate(valid => {
        console.log(this.loginForm)
        if (valid) {
          login(this.loginForm)
            .then(res => {
              console.log(res)
              if (res.data.meta.status === 200) {
                // 把当前登录成功返回的token存储到浏览器内存中
                localStorage.setItem('manager_token', res.data.data.token)
                // 登录成功跳转首页
                this.$router.push({ name: 'Home' })
              } else {
                this.$message.error(res.data.meta.msg)
              }
            })
            .catch(err => {
              console.log(err)
            })
        } else if (valid === false) {
          this.$message.error('用户名或密码不能为空')
          return false
        } else {
          this.$message({
            type: 'error',
            message: '数据输入错误，请重新输入'
          })
          return false
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.login {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #336393b5;
  .container {
    position: absolute;
    left: 0;
    right: 0;
    width: 400px;
    padding: 0px 40px 15px 40px;
    margin: 200px auto;
    background: white;
    .avatar {
      position: relative;
      left: 50%;
      width: 120px;
      height: 120px;
      margin-left: -60px;
      margin-top: -60px;
      box-sizing: border-box;
      border-radius: 50%;
      border: 10px solid #fff;
      box-shadow: 0 1px 5px #ccc;
      overflow: hidden;
    }
    .login-btn {
      width: 100%;
    }
  }
}
</style>
