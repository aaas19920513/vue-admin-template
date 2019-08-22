import request from '@/utils/request'

export function runApi(data) {
  return request({
    url: '/run/api',
    method: 'post',
    data
  })
}

export function runCase(data) {
  return request({
    url: '/run/case',
    method: 'post',
    data
  })
}
