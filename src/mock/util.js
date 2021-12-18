import request from "@/utils/request"
import {parseUserFromHeader} from './services/auth'
const Mock = require('mockjs')

function wrapper(config, func){
  try{
    config.user = parseUserFromHeader(config.headers)
    config.data = config.data && JSON.parse(config.data)
    if(!func.noauth && !config.user){throw new AuthenticationFailed('Token过期')}
    return func(config)  
  }
  catch(e){
    return [e.code || 500, e.message]
  }
}

export function noAuth(func){
    func.noauth=true
    return func
}
export class ModelViewSet {
  model = null
  queryset = []
  search_fields = []
  filterset_fields = []
  paginate_enabled = true
  lookup_field = 'id'
  ordering = ['-id']

  _filter_queryset = (request, source) => {
    return source.filter(item=>{
      for(let i=0;i<this.filterset_fields.length;i++){
        const fieldName = this.filterset_fields[i]
        const value = request.params[fieldName]
        if(value!==undefined  && item[fieldName]!==value){return false}
      }
      if(request.params.search){
        for(let i=0;i<this.search_fields.length;i++){
          const fileName = this.search_fields[i]
          const value = item[fileName]
          if(value && value.indexOf(request.params.search)>=0){return true}
        }
        return false
      } else {
        return true
      }
    })
  }
  _sort_queryset = (source) => {
    let res = [...source]
    this.ordering.forEach(item=>{
      const ar = item.split('-')
      const dec = ar.length===2
      const field = ar[ar.length-1]
      res.sort((a, b) => {
        const c = a[field]>b[field]
        if(dec){
          return c? -1: 1
        } else {
          return c? 1: -1
        }
      })
    })
    return res
  }
  _serialize = (data) => {
    if(this.queryset.length ===0){
      return {data}
    }
    const fields =Object.keys(this.queryset[0])
    const res = {}
    Object.keys(data).forEach(key=>{
      if(fields.indexOf(key)>=0){
        res[key] = data[key]
      }
    })
    return {data:res}
  }
  _paginate_queryset = (request, source) => {
    const {pageNo=1, pageSize=10} = request.params
    const data = source.filter((item, index) => index < pageSize*pageNo && index >= pageSize*(pageNo-1))
    return [200, {
      pageNo: pageNo,
      pageSize: pageSize,
      totalCount: source.length,
      data: data
    }]
  }
  _find_pk = (request) => {
    // 简单实现
    return request.url.split('/').reverse()[1]
  }
  _get_object = (request) => {
    const lookup_field = this.lookup_field
    const pk = this._find_pk(request)
    const instance = this.queryset.find(item=>item[lookup_field].toString()===pk)
    if(!instance){throw new NotFound(`记录未找到 ${this.lookup_field}=${pk}`)}
    return instance
  }

  list = (request) => {
    const queryset = this._sort_queryset(this._filter_queryset(request, this.queryset))
    return this.paginate_enabled ? this._paginate_queryset(request, queryset) : queryset
  }
  create = (request) => {
    const serialize = this._serialize(request.data)
    serialize.data[this.lookup_field] = Mock.mock('@increment')
    this.queryset.push(serialize.data)
    return [201,serialize.data]
  }
  retrive = (request) => {
    const instance = this._get_object(request)
    return [200, instance]
  }
  destroy = (request) => {
    const instance = this._get_object(request)
    this.queryset.splice(this.queryset.indexOf(instance),1)
    return [204,{}]
  }
  update = (request) => {
    const serialize = this._serialize(request.data)
    const instance = this._get_object(request)
    Object.assign(instance,serialize.data)
    return [200, instance]
  }
  
  routers = () => {
    if(!this.model){
      console.warn(`${this.constructor.name}未设置modal字段，无法输出rest接口`)
      return {}
    }
    return [
      ['GET', `/api/${this.model}/`, this.list],
      ['GET', new RegExp(`/api/${this.model}/\\d+/`), this.retrive],
      ['POST', `/api/${this.model}/`, this.create],
      ['DELETE', new RegExp(`/api/${this.model}/\\d+/`), this.destroy],
      ['PATCH', new RegExp(`/api/${this.model}/\\d+/`), this.update],
    ]
  }
}
export class ApiException extends Error {
  code = 500
}
export class ValidateException extends Error{
  code = 400
}
export class AuthenticationFailed extends Error{
  code = 401
}
export class PermissionFailed extends Error{
  code = 403
}
export class NotFound extends Error{
  code = 404
}

export function init(delay){
  const modulesFiles = require.context('./services', true, /\.js$/)
  const services = modulesFiles.keys().reduce((services, modulePath)=>{
    const value = modulesFiles(modulePath)
    services.push(value.default)
    return services
  },[])
  const MockAdapter = require("axios-mock-adapter");
  const adapter = new MockAdapter(request, { delayResponse: delay });
  services.forEach(routers=> {
    routers.forEach(([method, matcher, func])=>{
      let caller
      switch(method.toUpperCase()){
        case 'GET':
          caller = adapter.onGet(matcher)
          break
        case 'POST':
          caller = adapter.onPost(matcher)
          break
        case 'DELETE':
          caller = adapter.onDelete(matcher)
          break
        case 'PATCH':
          caller = adapter.onPatch(matcher)
          break
        default:
          console.warn(`method ${method} skip`)
          caller = adapter.onGet(matcher)
      }
      caller.reply(config=>{return wrapper(config, func)})
    })
  })
}