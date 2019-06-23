import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/system/role',
    method: 'get',
    params: query
  })
}

export function fetchItem(id) {
  return request({
    url: '/system/role/' + id,
    method: 'get'
  })
}

export function storeItem(data) {
  return request({
    url: '/system/role',
    method: 'post',
    data
  })
}

export function updateItem(data) {
  return request({
    url: '/system/role/' + data.id,
    method: 'put',
    data
  })
}
