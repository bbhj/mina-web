import url from 'url'
import request from '@/utils/request'
import { baseURL } from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/others/upload',
    method: 'get',
    params: query
  })
}

export function fetchItem(id) {
  return request({
    url: '/others/upload/' + id,
    method: 'get'
  })
}

export function storeItem(data) {
  return request({
    url: '/others/upload',
    method: 'post',
    data
  })
}

export function updateItem(data) {
  return request({
    url: '/others/upload/' + data.id,
    method: 'put',
    data
  })
}

// 生成文件访问 url 地址
export function getFileUrl(path) {
  if (path && path.length > 0) {
    return url.resolve(baseURL, '/storage/' + path)
  } else {
    return ''
  }
}

// 获取上传地址
export function getUploadUrl(action) {
  if (action && action.length > 0) {
    return baseURL + '/others/upload/' + action
  } else {
    return baseURL + '/others/upload'
  }
}

// 下载文件
export function getDownloadUrl(fileurl) {
  return baseURL + '/others/upload/download?url=' + fileurl
}

// 下载文件
export function postDownload(fileurl) {
  return request({
    url: '/others/upload/download',
    method: 'POST',
    data: {
      url: fileurl
    }
  })
}
