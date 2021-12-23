import request from '@/utils/request'
const URL = '/article/'

export interface Article{
  id: number,
  create_time: string,
  author: string,
  title: string,
  content: string,
  importance: number,
  category: number,
  is_published: boolean,
  tags: string[],
}

export function list (params:any): Promise<Article[]>{
  return request.get(URL,{params:params})
}

export function create (data:any): Promise<Article> {
  return request.post(URL,data)
}

export function detail (pk:string|number): Promise<Article>{
  return request.get(`${URL}${pk}/`)
}

export function update (pk:string|number, params:any): Promise<Article>{
  return request.patch(`${URL}${pk}/`, params)
}

export function del (pk:string|number) {
  return request.delete(`${URL}${pk}/`)
}

export function bulkDelete (data:any){
  return request.post(`${URL}delete/`, data)
}
