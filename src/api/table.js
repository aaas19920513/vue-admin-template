import request from '@/utils/request'

export function getList() {
  return request({
    url: '/interface',
    method: 'get'
  })
}
