import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/interface',
    method: 'get',
    params: query
  })
}

export function fetchApi(id) {
  return request({
    url: '/interface',
    method: 'get',
    params: { id }
  })
}

export function fetchApiByPv(pv) {
  return request({
    url: '/interface/' + pv,
    method: 'get'
  })
}

export function createApi(data) {
  return request({
    url: '/interface',
    method: 'post',
    data
  })
}

export function updateApi(id, data) {
  const url = '/interface/' + id
  return request({
    url: url,
    method: 'put',
    data
  })
}

export function deleteApi(id) {
  const url = '/interface/' + id
  return request({
    url: url,
    method: 'delete'
  })
}
