import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/system/menu',
    method: 'get',
    params: query
  })
}

export function fetchItem(id) {
  return request({
    url: '/system/menu/' + id,
    method: 'get'
  })
}

export function storeItem(data) {
  return request({
    url: '/system/menu',
    method: 'post',
    data
  })
}

export function updateItem(data) {
  return request({
    url: '/system/menu/' + data.id,
    method: 'put',
    data
  })
}
