<template>
  <div class="add">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="title">添加商品信息</div>
    <!-- 步骤条 -->
    <el-steps :active="activeName - 0" finish-status="success">
      <el-step title="步骤 1"></el-step>
      <el-step title="步骤 2"></el-step>
      <el-step title="步骤 3"></el-step>
      <el-step title="步骤 4"></el-step>
      <el-step title="步骤 5"></el-step>
    </el-steps>
    <!-- 标签页 -->
    <el-form ref="addForm" :model="addForm" :label-width="'80px'">
      <el-tabs v-model="activeName" tab-position="left">
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称">
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="addForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="addForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="addForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader :options="goodsCateList" :props="cascaderProps" clearable @change="getcate" v-model="addForm.goods_cat"></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>
        <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <el-upload
            class="upload-demo"
            action="http://localhost:8888/api/private/v1/upload"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :headers="gettoken()"
            :before-upload="beforeUpload"
            :file-list="fileList"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <quill-editor
            v-model="addForm.goods_introduce"
            ref="myQuillEditor"
            :options="editorOption"
            style="height: 400px;border-bottom:1px solid #ccc"
          >
          </quill-editor>
        </el-tab-pane>
      </el-tabs>
      <el-row class="btn">
        <el-button>取消</el-button>
        <el-button type="primary" @click="addGoods">确定</el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script>
// 引入api接口
import { getCateList } from '@/api/categories_api.js'
import { quillEditor } from 'vue-quill-editor'
import { addGoods } from '@/api/goods_api.js'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

export default {
  components: {
    quillEditor
  },
  data () {
    return {
      activeName: '0',
      // 添加商品数据
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_cat: '',
        goods_introduce: '',
        pics: [],
        attrs: [],
        goods_state: 1 // 手动设置商品状态
      },
      // 级联菜单数据源
      goodsCateList: [],
      // 配置级联菜单选项
      cascaderProps: {
        checkStrictly: true,
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      fileList: [],
      editorOption: {}
    }
  },
  mounted () {
    getCateList(3)
      .then(res => {
        // console.log(res)
        if (res.data.meta.status === 200) {
          this.goodsCateList = res.data.data
        }
      })
      .catch(err => {
        console.log(err)
      })
  },
  methods: {
    getcate (value) {
      // console.log(value)
      // console.log(this.cascaderProps.value)
      // 获取双向绑定数据
      this.addForm.goods_cat = value.join(',')
    },
    // 移除图片时触发
    handleRemove (file, fileList) {
      // console.log(file, fileList)
      if (!file.response) {
        return
      }
      // 查询对应文件中的图片并移除
      for (var i = 0; i < this.addForm.pics.length; i++) {
        if (this.addForm.pics[i].pic === file.response.data.tmp_path) {
          this.addForm.pics.splice(i, 1)
        }
      }
    },
    // 设置上传图片时的token
    gettoken () {
      var token = localStorage.getItem('manager_token')
      return { Authorization: token }
    },
    // 上传图片成功将图片添加到数据对象中
    handleSuccess (response, file, fileList) {
      // console.log(response)
      // console.log(file)
      // console.log(fileList)
      this.addForm.pics.push({ 'pic': response.data.tmp_path })
    },
    // 添加商品
    addGoods () {
      addGoods(this.addForm)
        .then(res => {
          console.log(res)
          if (res.data.meta.status === 201) {
            this.$message({
              type: 'success',
              message: res.data.meta.msg
            })
            // 跳转页面
            this.$router.push({ name: 'List' })
          } else {
            this.$message({
              type: 'error',
              message: res.data.meta.msg
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 上传文件前限制文件的类型
    beforeUpload (file) {
      console.log(file)
      if (file.type.indexOf('image/') === -1) {
        this.$message({
          type: 'warning',
          message: '请选择图片格式的文件'
        })
        return false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  background: #f5f5f5;
  padding: 12px;
  margin-bottom: 10px;
}
.el-steps {
  margin-bottom: 15px;
}
.btn {
  margin-top: 10px;
  text-align: center;
}
</style>
