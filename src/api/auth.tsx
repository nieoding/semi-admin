import request from '@/utils/request'

const URL = '/auth/'

export function login (params:any) {
  return request({
    url: `${URL}login/`,
    method: 'post',
    data: params
  })
}

export function logout () {
  return request({
    url: `${URL}logout/`,
    method: 'post'
  })
}

export function userinfo () {
  return request({
    url: `${URL}userinfo/`,
    method: 'get'
  }) 
}
