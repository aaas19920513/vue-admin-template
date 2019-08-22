import request from '@/utils/request'

export function getCase(query) {
  return request({
    url: '/case',
    method: 'get',
    params: query
  })
}

export function createCase(data) {
  return request({
    url: '/case',
    method: 'post',
    data
  })
}

export function deleteCase(ids) {
  const url = '/case/delete_lots'
  return request({
    url: url,
    method: 'delete',
    params: ids
  })
}
export function updateCase(id, data) {
  const url = '/case/' + id
  return request({
    url: url,
    method: 'put',
    data
  })
}
export function copyCase(id) {
  const url = '/case/copy/' + id + '/'
  return request({
    url: url,
    method: 'post'
  })
}
