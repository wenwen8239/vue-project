<template>
  <div class="orders">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框模块 -->
    <div style="margin: 15px 0;">
      <el-input
        v-model="query"
        @keyup.enter.native="search"
        placeholder="请输入内容"
        style="width: 300px;margin-right: 15px;"
      >
        <template slot="append"></template>
        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
      </el-input>
      <!-- 添加按钮 -->
      <el-button type="success" @click="addDialogFormVisible = true">测试订单</el-button>
    </div>
    <!-- 订单数据列表表格 -->
    <el-table :data="orderList" border >
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="order_number" label="订单编号" width="250"></el-table-column>
      <el-table-column prop="order_price" label="订单价格" width="150"></el-table-column>
      <el-table-column prop="order_id" label="下单用户" width="100"></el-table-column>
      <el-table-column prop="order_pay" label="是否付款">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.order_pay === '0'">已付款</el-tag>
          <el-tag type="danger" v-if="scope.row.order_pay === '1'">未付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="is_send" label="是否发货"></el-table-column>
      <el-table-column prop="address" label="下单时间">
        <template slot-scope="scope">{{scope.row.create_time | timeformat}}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain>编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件模块 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5,10,15,20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
// 引入api接口
import { getAllOrderList } from '@/api/order_api.js'
export default {
  data () {
    return {
      orderList: [],
      query: '',
      pagenum: 1,
      pagesize: 10,
      total: 0
    }
  },
  mounted () {
    this.init()
  },
  // 定义局部过滤器
  filters: {
    timeformat: (time) => {
      time = new Date(time)
      var year = time.getFullYear()
      var month = time.getMonth() + 1
      var day = time.getDate()
      return year + '-' + month + '-' + day
    }
  },
  methods: {
    // 实现搜索
    search () {
      this.pagenum = 1
      this.init()
    },
    init () {
      // 获取所有订单列表数据
      getAllOrderList({ query: this.query, pagenum: this.pagenum, pagesize: this.pagesize })
        .then(res => {
          console.log(res)
          if (res.data.meta.status === 200) {
            this.orderList = res.data.data.goods
            this.total = res.data.data.total
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.init()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.init()
    }
  }

}
</script>

<style lang="less" scoped>
</style>
