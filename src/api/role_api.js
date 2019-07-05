// 引入axios
import axios from '@/api/commit.js'
// 获取所有分配角色信息
export const getAllRoleList = () => {
  return axios({
    url: 'roles'
  })
}
