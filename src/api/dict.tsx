import request from '@/utils/request'

export interface Catetory {
  id: number,
  name: string
}

export function categories(): Promise<Catetory[]>{
  return request.get('/dict/category/')
}