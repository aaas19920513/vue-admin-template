import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/interface',
    method: 'get',
    params
  })
}
