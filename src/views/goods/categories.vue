<template>
  <div class="categories">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加分类 -->
    <el-button type="success">添加分类</el-button>
    <!-- 表格展示数据 -->

  </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
</style>
