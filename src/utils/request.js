import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'

// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL, // api base_url
  timeout: 6000 // 请求超时时间
})

// 获取token
const getToken = url => {
  let token = ''
  const storeToken = Vue.ls.get(ACCESS_TOKEN)
  if (url.indexOf('/oauth/token') !== -1) {
    token = 'Basic ZnJvbnQ6ZnJvbnQ='
  } else if (storeToken) {
    token = 'Bearer ' + storeToken
  }
  return token
}

const err = (error) => {
  if (error.response) {
    const data = error.response.data
    const token = Vue.ls.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
      return Promise.reject(error)
    }
    if (error.response.status === 401) {
      notification.error({
        message: 'Unauthorized',
        description: 'Authorization verification failed'
      })
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
      return Promise.reject(error)
    }
    notification.error({
      message: '请求错误',
      description: data.message
    })
  }
  return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use(config => {
  const token = getToken(config.url)
  if (token) {
    config.headers['Authorization'] = token // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  return config
}, err)

// response interceptor
service.interceptors.response.use((response) => {
  const data = response.data
  if (data.code !== 0) {
    notification.error({
      message: '请求错误',
      description: data.message
    })
    return Promise.reject(response)
  }
  return data
}, err)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, service)
  }
}

export {
  installer as VueAxios,
  service as axios
}
