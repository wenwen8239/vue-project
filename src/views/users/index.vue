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
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949" @change="changeUserState(scope.row.id,scope.row.mg_state)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="info" icon="el-icon-edit" @click="showEditDialog(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
            <el-button type="success" icon="el-icon-share" @click="showgrantDialog(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="warning" icon="el-icon-delete" @click="delUserById(scope.row.id)"></el-button>
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
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色模块 -->
    <el-dialog title="分配角色" :visible.sync="grantDialogFormVisible">
      <el-form :model="grantForm" :label-width="'120px'">
        <el-form-item label="用户名">
          <el-input v-model="grantForm.username" autocomplete="off" disabled style="width: 100px;"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="grantForm.rid" clearable placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="grantDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="grantRoleSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户信息模块 -->
    <el-dialog title="编辑用户" :visible.sync="editDialogFormVisible">
      <el-form :model="editForm" :rules="rules" ref="editForm" :label-width="'100px'">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editForm.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 引入api接口
import { getUserList, addUser, deleteUser, updateUserState, grantUserRole, editUser } from '@/api/user_api.js'
import { getAllRoleList } from '@/api/role_api.js'
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
      pagesize: 2,

      userList: [],
      // 添加用户数据
      addForm: {
        username: '',
        password: '',
        email: '123@qq.com',
        mobile: '16778966553'
      },
      // 设置当前添加用户对话框的显示或隐藏
      addDialogFormVisible: false,
      // 设置当前分配角色对话框显示或隐藏
      grantDialogFormVisible: false,
      // 设置分配角色数据
      grantForm: {
        username: '',
        id: '',
        rid: ''
      },
      // 设置当前编辑用户对话框显示或隐藏
      editDialogFormVisible: false,
      // 设置编辑用户信息
      editForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      // 设置分配角色信息
      roleList: [],
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
    // 获取所有的分配角色
    getAllRoleList()
      .then(res => {
        if (res.data.meta.status === 200) {
          this.roleList = res.data.data
        }
      })
      .catch(err => {
        console.log(err)
      })
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
          this.userList = res.data.data.users
          this.total = res.data.data.total
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 切换页面显示条数
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
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
      this.$refs.addForm.validate(valid => {
        if (valid) {
          addUser(this.addForm)
            .then(res => {
              console.log(res)
              if (res.data.meta.status === 201) {
                // 提示消息
                this.$message.success(res.data.meta.msg)
                // 隐藏弹出框
                this.addDialogFormVisible = false
                // 重置表单元素设置
                this.$refs.addForm.resetFields()
                // 重新获取总页数
                this.init()
              } else {
                // 提示消息
                this.$message.error(res.data.meta.msg)
              }
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          return false
        }
      })
    },
    // 实现修改用户状态
    changeUserState (uid, type) {
      updateUserState(uid, type)
        .then(res => {
          console.log(res)
          this.$message({
            type: 'success',
            message: res.data.meta.msg
          })
        })
        .catch(err2 => {
          this.$message({
            type: 'success',
            message: '状态设置失败'
          })
        })
    },
    // 实现删除用户数据
    delUserById (id) {
      // 点击删除弹出提示框
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用删除用户数据接口
        deleteUser(id)
          .then(res => {
            console.log(res)
            if (res.data.meta.status === 200) {
              // 提示消息
              this.$message({
                type: 'success',
                message: res.data.meta.msg
              })
              // 现在我们需要实现当当前页面只剩下一条数据的时候，删除这条数据能返回上一页数据
              this.pagenum = Math.ceil((this.total - 1) / this.pagesize) < this.pagenum ? --this.pagenum : this.pagenum
              // 重新刷新页面
              this.init()
            } else {
              // 提示消息
              this.$message({
                type: 'warning',
                message: res.data.meta.msg
              })
            }
          })
          .catch(err1 => {
            this.$message({
              type: 'info',
              message: '删除失败'
            })
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 实现分配角色数据的替换显示
    showgrantDialog (row) {
      // console.log(row)
      // 将对话框显示
      this.grantDialogFormVisible = true
      // 修改文本框的用户名
      this.grantForm.username = row.username
      // 修改数据的id
      this.grantForm.id = row.id
      // 实现下拉列表数据的显示
      this.grantForm.rid = row.rid
    },
    // 给选择角色确定按钮注册点击事件
    grantRoleSubmit () {
      // 先判断是否选择了角色
      if (!this.grantForm.rid) {
        // 提示消息
        this.$message({
          type: 'warning',
          message: '请先选择角色'
        })
        return false
      }
      // 调用分配角色接口
      grantUserRole(this.grantForm.id, this.grantForm.rid)
        .then(res => {
          console.log(res)
          if (res.data.meta.status === 200) {
            // 提示消息
            this.$message({
              type: 'success',
              message: res.data.meta.msg
            })
            this.grantDialogFormVisible = false
            this.init()
            // 为了保险起见，可以加上这句，这是防御性编程
            // this.grantForm.rid = ''
          } else {
            // 提示消息
            this.$message({
              type: 'error',
              message: res.data.meta.msg
            })
          }
        })
        .catch(err3 => {
          // 提示消息
          this.$message({
            type: 'error',
            message: '获取失败'
          })
        })
    },
    // 显示编辑信息
    showEditDialog (row) {
      // 设置编辑用户对话框显示
      this.editDialogFormVisible = true
      // console.log(row)
      // 修改对话框的信息
      this.editForm.id = row.id
      this.editForm.username = row.username
      this.editForm.email = row.email
      this.editForm.mobile = row.mobile
    },
    // 实现用户编辑
    editUserSubmit () {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          // 验证文本框内容是否有填写
          editUser(this.editForm)
            .then(res => {
              console.log(res)
              if (res.data.meta.status === 200) {
                // 提示消息
                this.$message({
                  type: 'success',
                  message: res.data.meta.msg
                })
                // 设置编辑用户对话框显示
                this.editDialogFormVisible = false
                this.init()
              } else {
                // 提示消息
                this.$message({
                  type: 'error',
                  message: res.data.meta.msg
                })
              }
            })
            .catch(err2 => {
              // 提示消息
              this.$message({
                type: 'error',
                message: '获取失败'
              })
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
