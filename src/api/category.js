import request from '@/utils/request'

export function getCategory(query) {
  return request({
    url: '/category',
    method: 'get',
    params: query
  })
}

export function apiSelector(query) {
  return request({
    url: '/apiSelector',
    method: 'get',
    params: query
  })
}

export function caseSelector(query) {
  return request({
    url: '/caseSelector',
    method: 'get',
    params: query
  })
}
