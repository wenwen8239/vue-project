// 引入axios
import axios from '@/api/common.js'

// 获取所有权限数据
export const getAllRightList = (type) => {
  return axios({
    url: `rights/${type}`
  })
}
// 获取左侧菜单栏的用户权限
export const getLeftMenuList = () => {
  return axios({
    url: 'menus'
  })
}
