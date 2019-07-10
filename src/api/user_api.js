// 这里是设置用户api接口的文件
// 引入axios
import axios from '@/api/common.js'

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
// 实现修改用户状态
export const updateUserState = (uid, type) => {
  return axios({
    method: 'put',
    url: `users/${uid}/state/${type}`
  })
}
// 实现删除用户数据
export const deleteUser = (id) => {
  return axios({
    method: 'delete',
    url: `users/${id}`
  })
}
// 实现分配用户角色
export const grantUserRole = (id, rid) => {
  return axios({
    method: 'put',
    url: `users/${id}/role`,
    data: { rid }
  })
}
// 实现编辑用户信息
export const editUser = (data) => {
  return axios({
    method: 'put',
    url: `users/${data.id}`,
    data: { email: data.email, mobile: data.mobile }
  })
}
