import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/system/config',
    method: 'get',
    params: query
  })
}

export function fetchItem(id) {
  return request({
    url: '/system/config/' + id,
    method: 'get'
  })
}

export function storeItem(data) {
  return request({
    url: '/system/config',
    method: 'post',
    data
  })
}

export function updateItem(data) {
  return request({
    url: '/system/config/' + data.id,
    method: 'put',
    data
  })
}
