import request from '@/utils/request'
const URL = '/user/'

export interface User{
  id: number,
  username: string,
  password: string,
  role: string,
}

export function list (params:any): Promise<User[]>{
  return request.get(URL,{params:params})
}

export function create (params:any): Promise<User> {
  return request.post(URL,params)
}

export function detail (pk:string|number): Promise<User>{
  return request.get(`${URL}${pk}/`)
}

export function update (pk:string|number, params:any): Promise<User>{
  return request.patch(`${URL}${pk}/`, params)
}

export function del (pk:string|number) {
  return request.delete(`${URL}${pk}/`)
}
