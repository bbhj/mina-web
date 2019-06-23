import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/system/group',
    method: 'get',
    params: query
  })
}

export function fetchItem(id) {
  return request({
    url: '/system/group/' + id,
    method: 'get'
  })
}

export function storeItem(data) {
  return request({
    url: '/system/group',
    method: 'post',
    data
  })
}

export function updateItem(data) {
  return request({
    url: '/system/group/' + data.id,
    method: 'put',
    data
  })
}
