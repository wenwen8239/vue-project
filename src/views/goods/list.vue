<template>
  <div class="goods">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框模块 -->
    <div style="margin: 15px 0;">
      <el-input
        v-model="goodsObj.query"
        @keyup.enter.native="search"
        placeholder="请输入内容"
        style="width: 300px;margin-right: 15px;"
      >
        <template slot="append"></template>
        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
      </el-input>
      <!-- 添加按钮 -->
      <el-button type="success" @click="addDialogFormVisible = true;$router.push({name: 'Add'})">添加商品</el-button>
    </div>
    <!-- 商品列表展示区域 -->
    <el-table :data="goodsList" border style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="450"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格"></el-table-column>
      <el-table-column prop="goods_state" label="商品状态"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
      <el-table-column prop="add_time" label="创建时间"></el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="info" icon="el-icon-edit"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
            <el-button type="success" icon="el-icon-share"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="warning" icon="el-icon-delete"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件模块 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="goodsObj.pagenum"
      :page-sizes="[10,20,30,40]"
      :page-size="goodsObj.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
// 引入api接口
import { getAllGoodList } from '@/api/goods_api.js'
export default {
  data () {
    return {
      goodsList: [],
      goodsObj: {
        // 定义搜索关键字
        query: '',
        pagesize: 10,
        pagenum: 1
      },
      // 定义总条数
      total: 0
    }
  },
  mounted () {
    // 初始化分页
    this.init()
  },
  methods: {
    // 实现分页
    init () {
      getAllGoodList(this.goodsObj)
        .then(res => {
          // console.log(res)
          this.goodsList = res.data.data.goods
          // 设置总条数
          this.total = res.data.data.total
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.goodsObj.pagesize = val
      this.init()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.goodsObj.pagenum = val
      this.init()
    },
    // 实现搜索
    search () {
      this.goodsObj.pagenum = 1
      this.init()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
