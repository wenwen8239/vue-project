<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框模块 -->
    <div style="margin: 15px 0;">
      <el-input v-model="query" @keyup.enter.native="search()" placeholder="请输入内容" style="width: 300px;margin-right: 15px;">
        <template slot="append"></template>
        <el-button slot="append" icon="el-icon-search" @click='search()'></el-button>
      </el-input>
      <!-- 添加按钮 -->
      <el-button type="success" @click="addDialogFormVisible = true">添加用户</el-button>
    </div>
    <!-- 展示表格模块 -->
    <el-table :data="userList" border style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态" width="100">
        <template slot-scope="scope">
          <el-switch v-model="value2" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="info" icon="el-icon-edit" @click="getUserList(scope.$index, scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
            <el-button type="success" icon="el-icon-share" ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="warning" icon="el-icon-delete" @click="removeUser(scope.$index, scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页模块 -->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <!-- 添加用户模块 -->
    <el-dialog title="添加用户" :visible.sync="addDialogFormVisible">
      <el-form :model="addForm" :rules="rules" ref="addForm" >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 引入api接口
import { getUserList, addUser, removeUser } from '@/api/user_api.js'
export default {
  data () {
    return {
      // 设置总条数
      total: 0,
      // 用户搜索关键字
      query: '',
      // 当前页面
      pagenum: 1,
      // 每页显示5条记录
      pagesize: 1,
      value2: true,
      userList: [],
      // 添加用户数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 设置当前添加用户对话框的显示或隐藏
      addDialogFormVisible: false,
      // 设置用户数据规则
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { message: '请输入正确的邮箱格式', trigger: 'blur', pattern: /\w+[@]\w+[.]\w{2,3}/ }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { message: '请输入正确的手机号', trigger: 'blur', pattern: /^1[345678]\d{9}$/ }
        ]
      }
    }
  },
  mounted () {
    // 调用获取分页数据
    this.init()
  },
  methods: {
    // 封装搜索
    search () {
      this.pagenum = 1
      this.init()
    },
    // 初始化分页数据
    init () {
      // 获取用户数据
      getUserList({ query: this.query, pagenum: this.pagenum, pagesize: this.pagesize })
        .then(res => {
          // console.log(res)
          this.userList = res.data.data.users
          this.total = res.data.data.total
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 切换页面显示条数
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      // 重置当前页面显示数据条数
      this.pagesize = val
      this.init()
    },
    // 切换当前页码
    handleCurrentChange (val) {
      // 重置当前页面数据
      this.pagenum = val
      // 调用获取分页数据
      this.init()
    },
    // 实现添加用户
    addUser () {
      // console.log(this)
      this.$refs.addForm.validate(valid => {
        if (valid) {
          addUser(this.addForm)
            .then(res => {
              console.log(res)
              if (res.data.meta.status === 201) {
                // 隐藏弹出框
                this.addDialogFormVisible = false
                // 重置表单元素设置
                this.$refs.addForm.resetFields()
              } else {
                // 提示消息
                this.$message.error(res.data.meta.msg)
              }
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
    },
    // 实现删除用户数据
    removeUser (index, row) {
      var id = parseInt(row.id)
      console.log(id)
      removeUser(id)
        .then(res => {
          // 提示消息
          this.$message.error(res.data.meta.msg)
        })
        .catch(err => {
          // 提示消息
          this.$message.error(err.data.meta.msg)
        })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
