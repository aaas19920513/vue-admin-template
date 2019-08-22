import request from '@/utils/request'

export function getStep(query) {
  return request({
    url: '/step',
    method: 'get',
    params: query
  })
}

export function addStep(data) {
  return request({
    url: '/step',
    method: 'post',
    data
  })
}

export function updateStep(id, data) {
  return request({
    url: '/step/' + id,
    method: 'put',
    data
  })
}

export function deleteStep(id) {
  const url = '/step/' + id
  return request({
    url: url,
    method: 'delete'
  })
}
