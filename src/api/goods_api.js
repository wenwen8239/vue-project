// 引入axios
import axios from '@/api/common.js'
// 商品列表数据展示
export const getAllGoodList = (params) => {
  return axios({
    url: 'goods',
    params
  })
}
