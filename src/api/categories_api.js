// 引入axios
import axios from '@/api/common.js'
// 获取所有的商品分类数据
export const getCateList = (type) => {
  return axios({
    url: 'categories',
    params: { type }
  })
}
