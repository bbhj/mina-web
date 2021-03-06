import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/system/user',
    method: 'get',
    params: query
  })
}

export function fetchItem(id) {
  return request({
    url: '/system/user/' + id,
    method: 'get'
  })
}

export function storeItem(data) {
  return request({
    url: '/system/user',
    method: 'post',
    data
  })
}

export function updateItem(data) {
  return request({
    url: '/system/user/' + data.id,
    method: 'put',
    data
  })
}
