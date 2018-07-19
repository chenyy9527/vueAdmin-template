import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/supplier/list',
    method: 'get',
    params
  })
}

export function allList() {
  return request({
    url: '/supplier/all',
    method: 'get',
    async: false
  })
}

export function createSupplier(params) {
  return request({
    url: '/supplier/create',
    method: 'post',
    data: params
  })
}

export function updateSupplier(params) {
  return request({
    url: '/supplier/edit',
    method: 'post',
    data: params
  })
}

export function updateRuleStatus(params) {
  return request({
    url: '/supplier/updateChannelStatus',
    method: 'post',
    data: params
  })
}

export function getOriginList(params) {
  return request({
    url: '/supplier/queryOriginList',
    method: 'post',
    data: params
  })
}
export function querySettleList(params) {
  return request({
    url: '/supplier/querySettleList',
    method: 'post',
    data: params
  })
}
