import request from '@/utils/request'

export function getLoginState() {
  return request({
    url: '/wechat/pc-login-state',
    method: 'get'
  })
}

export function checkLogin(state) {
  return request({
    url: '/wechat/pc-check',
    method: 'post',
    data: { state }
  })
}
