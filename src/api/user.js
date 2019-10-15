import { axios } from '@/utils/request'
import { stringify } from 'qs'

/**
 * user page func
 * parameter: {
 *     keyword: '',
 * }
 * @param parameter
 * @returns {*}
 */
export function getUserPage (parameter) {
  return axios({
    url: `/v1.0/users/page?${stringify(parameter)}`,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function addUser (parameter) {
  return axios({
    url: `/v1.0/users`,
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: parameter
  })
}

export function updateUser (parameter) {
  return axios({
    url: `/v1.0/users/${parameter.userId}`,
    method: 'PUT',
    data: parameter
  })
}

export function fetchUser (parameter) {
  return axios({
    url: `/v1.0/users/${parameter.userId}`,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function resetUserPwd (parameter) {
  return axios({
    url: `/v1.0/users/reset-pwd/${parameter.userId}`,
    method: 'PUT'
  })
}

export function updateUserStatus (parameter) {
  return axios({
    url: `/v1.0/users/${parameter.userId}/status/${parameter.status}`,
    method: 'PUT'
  })
}

export function deleteUsers (parameter) {
  return axios({
    url: `/v1.0/users`,
    method: 'DELETE',
    data: parameter
  })
}
