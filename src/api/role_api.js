// 引入axios
import axios from '@/api/commit.js'
// 获取所有分配角色信息
export const getAllRoleList = () => {
  return axios({
    url: 'roles'
  })
}
// 实现删除角色指定权限
export const delRightByRoleId = (roleId, rightId) => {
  return axios({
    method: 'delete',
    url: `roles/${roleId}/rights/${rightId}`
  })
}
// 为角色分配权限
export const grantRightRole = (roleId, rids) => {
  return axios({
    method: 'post',
    url: `roles/${roleId}/rights`,
    data: { rids }
  })
}
// 实现添加角色
export const addRoles = (data) => {
  return axios({
    method: 'post',
    url: 'roles',
    data
  })
}
// 实现删除角色
export const delRoleById = (id) => {
  return axios({
    method: 'delete',
    url: `roles/${id}`
  })
}
// 根据id查找对应的角色
export const editRoleById = (id) => {
  return axios({
    url: `roles/${id}`
  })
}
// 实现编辑角色
export const editRole = (data) => {
  return axios({
    method: 'put',
    url: `roles/${data.id}`,
    data: { roleName: data.roleName, roleDesc: data.roleDesc }
  })
}
