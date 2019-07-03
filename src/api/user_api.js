// 引入axios
import axios from 'axios'
// 设置基准路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 实现用户登陆
export const login = (data) => {
  return axios({
    method: 'post',
    url: 'login',
    data
  })
}
// 获取用户数据
export const getUserList = (params) => {
  return axios({
    url: 'users',
    params: params
  })
}
// 实现新增用户数据
export const addUser = (data) => {
  return axios({
    method: 'post',
    url: 'users',
    data
  })
}
// 实现删除用户数据
export const removeUser = (id) => {
  return axios({
    method: 'delete',
    url: `users/:${id}`
  })
}
