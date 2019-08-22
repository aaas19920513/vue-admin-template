import request from '@/utils/request'

export function getSuite(query) {
  return request({
    url: '/suite',
    method: 'get',
    params: query
  })
}

export function fetchSuite(id) {
  return request({
    url: '/suite/' + id,
    method: 'get'
  })
}

export function fetchSuiteByPv(pv) {
  return request({
    url: '/suiteDetail/' + pv,
    method: 'get'
  })
}

export function createSuite(data) {
  return request({
    url: '/suite',
    method: 'post',
    data
  })
}

export function updateSuite(id, data) {
  const url = '/suite/' + id
  return request({
    url: url,
    method: 'put',
    data
  })
}

export function deleteSuite(id) {
  const url = '/suite/' + id
  return request({
    url: url,
    method: 'delete'
  })
}
