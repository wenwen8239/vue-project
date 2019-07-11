// 引入axios
import axios from '@/api/common.js'

// 获取所有的订单列表数据
export const getAllOrderList = (params) => {
  return axios({
    url: 'orders',
    params
  })
}
