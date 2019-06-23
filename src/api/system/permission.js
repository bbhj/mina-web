import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/system/permission',
    method: 'get',
    params: query
  })
}

export function fetchItem(id) {
  return request({
    url: '/system/permission/' + id,
    method: 'get'
  })
}

export function storeItem(data) {
  return request({
    url: '/system/permission',
    method: 'post',
    data
  })
}

export function updateItem(data) {
  return request({
    url: '/system/permission/' + data.id,
    method: 'put',
    data
  })
}
