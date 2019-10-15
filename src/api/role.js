import { axios } from '@/utils/request'
import { stringify } from 'qs'

/**
 * role list func
 * @param parameter
 * @returns {*}
 */
export function queryRole (parameter) {
  console.log('parameter', stringify(parameter))
  return axios({
    url: `/v1.0/roles?${stringify(parameter)}`,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function addRole (parameter) {
  return axios({
    url: `/v1.0/roles`,
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: parameter
  })
}

export function updateRole (parameter) {
  return axios({
    url: `/v1.0/roles${parameter.roleId}`,
    method: 'PUT',
    data: parameter
  })
}

export function fetchRole (parameter) {
  return axios({
    url: `/v1.0/roles/${parameter.roleId}`,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function deleteRoles (parameter) {
  return axios({
    url: `/v1.0/roles`,
    method: 'DELETE',
    data: parameter
  })
}
