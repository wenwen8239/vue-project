<template>
  <div class="roleList">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加角色 -->
    <el-button type="success" @click="addDialogFormVisible = true">添加角色</el-button>
    <!-- 展开行功能表格 -->
    <el-table :data="roleList" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope" >
          <el-row v-for="first in scope.row.children" :key="first.id" style="margin-bottom: 10px;">
            <el-col :span="3">
              <el-tag
                closable
                :type="'success'"
                @close="delRight(scope.row,first.id)"
              >{{first.authName}}</el-tag>
            </el-col>
            <el-col :span="21">
              <el-row v-for="second in first.children" :key="second.id" style="margin-bottom: 6px;">
                <el-col :span="3">
                  <el-tag
                    closable
                    :type="'wraning'"
                    @close="delRight(scope.row,second.id)"
                  >{{second.authName}}</el-tag>
                </el-col>
                <el-col :span="21">
                  <el-tag
                    closable
                    :type="'danger'"
                    v-for="third in second.children"
                    :key="third.id"
                    style="margin: 0 6px 6px 0;"
                    @close="delRight(scope.row,third.id)"
                  >{{third.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col v-show="scope.row.children.length === 0">暂无数据显示，请先添加数据</el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="info" icon="el-icon-edit" @click="editRoleDialog(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配权限" placement="top">
            <el-button type="success" icon="el-icon-share" @click="showGrantDialog(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="warning" icon="el-icon-delete" @click="delRoleSubmit(scope.row.id)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加分配权限对话框 -->
    <el-dialog title="授权角色" :visible.sync="grantdialogFormVisible">
      <!-- 添加树形结构 -->
      <el-tree
        ref="mytree"
        :data="rightList"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="checkedArr"
        :props="defaultProps"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="grantdialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="grantRightSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加角色模块 -->
    <el-dialog title="添加角色" :visible.sync="addDialogFormVisible">
      <el-form :model="addForm" :rules="rules" ref="addForm" :label-width="'100px'">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoleSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑角色模块 -->
    <el-dialog title="编辑角色" :visible.sync="editDialogFormVisible">
      <el-form :model="editForm" :rules="rules" ref="editForm" :label-width="'100px'">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 引入api接口
import { getAllRoleList, delRightByRoleId, grantRightRole, addRoles, delRoleById, editRole } from '@/api/role_api.js'
import { getAllRightList } from '@/api/right_api.js'
export default {
  data () {
    return {
      // 定义角色id
      roleId: '',
      // 定义角色数组
      roleList: [],
      // 显示或者隐藏添加分配权限对话框
      grantdialogFormVisible: false,
      // 定义一个空数组存储用户权限
      rightList: [],
      defaultProps: {
        children: 'children', // 用于查新下一级节点属性名称
        label: 'authName' // 用户展示的属性名称
      },
      // 所有被选中的数据
      checkedArr: [],
      // 隐藏添加角色模态框
      addDialogFormVisible: false,
      // 定义添加角色信息
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      // 隐藏编辑角色模态框
      editDialogFormVisible: false,
      // 定义编辑角色信息
      editForm: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      // 定义规则
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    // 初始化页面
    this.init()
  },
  methods: {
    init () {
      // 显示所有的角色
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
    // 实现删除角色指定权限
    delRight (roleId, rightId) {
      console.log(roleId.id)
      delRightByRoleId(roleId.id, rightId)
        .then(res => {
          // 显示提示信息
          this.$message({
            type: 'success',
            message: res.data.meta.msg
          })
          // 重置当前展开行数据的数据源
          roleId.children = res.data.data
        })
        .catch(err => {
          // 显示提示信息
          this.$message({
            type: 'success',
            message: err.data.meta.msg
          })
        })
    },
    // 展示所有的树形结构数据
    showGrantDialog (row) {
      // 将分配权限对话框显示
      this.grantdialogFormVisible = true
      // 存储当前操作的元素id
      this.roleId = row.id
      // 调用接口展示树形组件数据
      getAllRightList('tree')
        .then(res => {
          // console.log(res)
          this.rightList = res.data.data
        })
        .catch(err => {
          console.log(err)
        })
      // 在每次打开对话框的时候初始化数组
      this.checkedArr.length = 0
      // 实现属性结构节点的默认选择
      row.children.forEach(first => {
        if (first.children && first.children.length > 0) {
          first.children.forEach(second => {
            if (second.children && second.children.length > 0) {
              second.children.forEach(third => {
                this.checkedArr.push(third.id)
              })
            }
          })
        }
      })
    },
    // 给确定按钮注册点击事件
    grantRightSubmit () {
      // 隐藏对话框
      this.grantdialogFormVisible = false
      // 获取当前点击的节点的id和父节点的id
      var arr = this.$refs.mytree.getCheckedNodes()
      console.log(arr)
      // 定义一个空数组
      var temp = []
      // 遍历获取到的id与rid，存储到数组中
      for (var i = 0; i < arr.length; i++) {
        temp.push(arr[i].id + ',' + arr[i].pid)
      }
      console.log(temp)
      // 把所有数组拼接成字符串形式
      var str = temp.join(',')
      console.log(str)
      // 去掉数组中重复的数据,但是只要数组可以去重，我们要重新把字符串转换为数组
      var str2 = str.split(',')
      // 使用展开运算符获取去重后的数组
      var finalArr = [...new Set(str2)]
      console.log(finalArr)
      // 为角色分配权限
      grantRightRole(this.roleId, finalArr.join(','))
        .then(res => {
          if (res.data.meta.status === 200) {
            // 显示提示信息
            this.$message({
              type: 'success',
              message: res.data.meta.msg
            })
            this.init()
          } else {
            // 显示提示信息
            this.$message({
              type: 'warning',
              message: res.data.meta.msg
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 实现添加角色
    addRoleSubmit () {
      // 验证输入框是否为空
      this.$refs.addForm.validate(valid => {
        if (valid) {
          addRoles(this.addForm)
            .then(res => {
              // console.log(res)
              if (res.data.meta.status === 201) {
                // 添加角色对话框隐藏
                this.addDialogFormVisible = false
                // 给出提示
                this.$message.success(res.data.meta.msg)
                // 重置表单
                this.$refs.addForm.resetFields()
                // 刷新页面
                this.init()
              } else {
                // 给出提示
                this.$message.warning(res.data.meta.msg)
              }
            })
            .catch(err1 => {
              // 显示提示信息
              this.$message({
                type: 'error',
                message: '创建失败'
              })
            })
        } else {
          return false
        }
      })
    },
    // 实现删除角色
    delRoleSubmit (id) {
      console.log(id)
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用删除角色接口
        delRoleById(id)
          .then(res => {
            console.log(res)
            if (res.data.meta.status === 200) {
              this.$message({
                type: 'success',
                message: res.data.meta.msg
              })
              // 刷新页面
              this.init()
            } else {
              this.$message({
                type: 'warning',
                message: res.data.meta.msg
              })
            }
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 显示编辑角色
    editRoleDialog (row) {
      // console.log(row)
      // 显示编辑角色模态框
      this.editDialogFormVisible = true
      this.editForm.id = row.id
      this.editForm.roleName = row.roleName
      this.editForm.roleDesc = row.roleDesc
    },
    // 实现编辑角色
    editRoleSubmit () {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          editRole(this.editForm)
            .then(res => {
              // 隐藏编辑角色模态框
              this.editDialogFormVisible = false
              // 给出提示
              this.$message.success('修改成功')
              // 刷新页面
              this.init()
            })
            .catch(err => {
              console.log(err)
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
