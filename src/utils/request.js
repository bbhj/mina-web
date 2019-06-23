import axios from 'axios'
import { has, get } from 'lodash'
import contentDisposition from 'content-disposition'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

const blobHeaders = ['application/x-msdownload', 'application/vnd.ms-office', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']

const blobInterceptor = response => {
  if (response.headers && blobHeaders.indexOf(response.headers['content-type']) !== -1) {
    let fileName = ''
    if (response.headers['content-disposition']) {
      const disposition = contentDisposition.parse(response.headers['content-disposition'])
      if (has(disposition, 'parameters.filename')) {
        fileName = get(disposition, 'parameters.filename')
      }
    }
    const blob = new Blob([response.data])
    if ('download' in document.createElement('a')) { // 非IE下载
      const elink = document.createElement('a')
      elink.download = fileName
      elink.style.display = 'none'
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href) // 释放URL 对象
      document.body.removeChild(elink)
    } else { // IE10+下载
      navigator.msSaveBlob(blob, fileName)
    }
    return true
  }
}

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api 的 base_url
  withCredentials: true, // 跨域请求时发送 cookies
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // Do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Accept'] = 'application/json'
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get information such as headers or status
   * Please return  response => response
  */
  // response => response.data,
  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    // 处理文件
    if (blobInterceptor(response)) {
      return response
    }

    const res = response.data
    if (res.state.code !== 200) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.state.code === 50008 || res.state.code === 50012 || res.state.code === 50014) {
        // 请自行在引入 MessageBox
        // import { Message, MessageBox } from 'element-ui'
        MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('passport/resetToken').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    const res = has(error.response, 'data') ? error.response.data : {}
    if (res.state.code === undefined) {
      res.state.code = has(error.response, 'status') ? error.response.status : 0
    }
    console.log('err' + error) // for debug
    Message({
      message: res.message || error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service

export const baseURL = process.env.VUE_APP_BASE_API

// 获取默认请求头
export const getHeaders = () => {
  const headers = {
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'application/json',
    'Authorization': 'Bearer ' + getToken()
  }
  return headers
}
