<template>
  <div class="rightList">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格数据展示区域 -->
    <el-table :data="rightList" border style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
      <el-table-column prop="path" label="路径" width="180"></el-table-column>
      <el-table-column label="层级" width="180">
      <template slot-scope="scope">
        {{scope.row.level | levelFormar}}
      </template>
    </el-table-column>
    </el-table>
  </div>
</template>

<script>
// 引入api文件
import { getAllRightList } from '@/api/right_api.js'
export default {
  data () {
    return {
      rightList: []
    }
  },
  filters: {
    levelFormar: (level) => {
      if (level === '0') {
        return '一级'
      } else if (level === '1') {
        return '二级'
      } else if (level === '2') {
        return '三级'
      }
    }
  },
  mounted () {
    getAllRightList('list')
      .then(res => {
        console.log(res)
        if (res.data.meta.status === 200) {
          this.rightList = res.data.data
        }
      })
      .catch(err => {
        console.log(err)
      })
  },
  method: {

  }
}
</script>

<style lang="less" scoped>
</style>
