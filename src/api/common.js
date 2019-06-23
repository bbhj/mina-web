import request from '@/utils/request'

export function commonData(query) {
  return request({
    url: '/common/data',
    method: 'get',
    params: query
  })
}
