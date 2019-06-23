import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/system/scheduling',
    method: 'get',
    params: query
  })
}

export function runItem(id) {
  return request({
    url: '/system/scheduling/run',
    method: 'post',
    data: { id }
  })
}

export function fetchItem(id) {
  return request({
    url: '/system/scheduling/' + id,
    method: 'get'
  })
}

export function storeItem(data) {
  return request({
    url: '/system/scheduling',
    method: 'post',
    data
  })
}

export function updateItem(data) {
  return request({
    url: '/system/scheduling/' + data.id,
    method: 'put',
    data
  })
}
