import { NotFound } from "./util"
import { ModelSerializer } from "./serializers"
const Mock = require('mockjs')

export class ModelViewSet {
  model = null
  queryset = []
  search_fields = []
  filterset_fields = []
  paginate_enabled = true
  lookup_field = 'id'
  ordering = ['-id']

  serializer_class = ModelSerializer
  list_serializer_class = ModelSerializer

  _filter_queryset = (request, source) => {
    return source.filter(item=>{
      for(const field of this.filterset_fields){
        if(field.includes('@daterange')){
          // daterange处理
          let fieldName = field.replace('@daterange','')
          const dateBegin = request.params[`${fieldName}_after`]
          const dateEnd = request.params[`${fieldName}_before`]
          if(dateBegin && item[fieldName]<dateBegin){return false}
          if(dateEnd && item[fieldName]>dateEnd){return false}
        } else {
          // 普通匹配
          const value = request.params[field]
          if(value!==undefined  && item[field].toString()!==value.toString()){return false}  
        }
      }
      if(request.params.search){
        for(let i=0;i<this.search_fields.length;i++){
          const fileName = this.search_fields[i]
          const value = item[fileName]
          if(value){
            if(Array.isArray(value)){
              if(value.find(item => {return item.includes(request.params.search)})){return true}
            } else {
              if(value.includes(request.params.search)){return true}
            }
          }
          if(value && value.indexOf(request.params.search)>=0){return true}
        }
        return false
      } else {
        return true
      }
    })
  }
  _sort_queryset = (request, source) => {
    let res = [...source]
    const ordering = request.params.ordering ? request.params.ordering.split(',') : this.ordering
    ordering.forEach(item=>{
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
  _get_serializer = (serializer_class, data, many) => {
    return new serializer_class(this._meta(), data, many)
  }
  _meta = () => {
    // 尝试用记录集的第一条记录作为元数据解析（简易化）
    if(this.queryset.length ===0){
      return null
    } else {
      return Object.keys(this.queryset[0])
    }
  }
  _paginate_queryset = (request, source) => {
    const {pageNo=1, pageSize=10} = request.params
    const data = source.filter((item, index) => index < pageSize*pageNo && index >= pageSize*(pageNo-1))
    return [200, {
      pageNo: pageNo,
      pageSize: pageSize,
      totalCount: source.length,
      data: this._get_serializer(this.list_serializer_class).serialize(data, true)
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
    const queryset = this._sort_queryset(request, this._filter_queryset(request, this.queryset))
    return this.paginate_enabled ? this._paginate_queryset(request, queryset) : [200, queryset]
  }
  create = (request) => {
    const data = this._get_serializer(this.serializer_class).serialize(request.data, false)
    data[this.lookup_field] = Mock.mock('@increment')
    this.queryset.push(data)
    return [201, data]
  }
  retrive = (request) => {
    const instance = this._get_object(request)
    return [200, this._get_serializer(this.serializer_class).serialize(instance, false)]
  }
  destroy = (request) => {
    const instance = this._get_object(request)
    this.queryset.splice(this.queryset.indexOf(instance),1)
    return [204,{}]
  }
  update = (request) => {
    const data = this._get_serializer(this.serializer_class).serialize(request.data, false)
    const instance = this._get_object(request)
    Object.assign(instance,data)
    return [200, instance]
  }

  _build_matcher = (detail=false, action=null) => {
    const ext = action ? `${action}/` : ''
    if(!detail){
      return `/api/${this.model}/${ext}`
    } else {
      return new RegExp(`/api/${this.model}/\\d+/${ext}`)
    }
  }
  
  routers = () => {
    if(!this.model){
      console.warn(`${this.constructor.name}未设置modal字段，无法输出rest接口`)
      return {}
    }
    const res = [
      ['GET', this._build_matcher(), this.list],
      ['GET', this._build_matcher(true), this.retrive],
      ['POST', this._build_matcher(), this.create],
      ['DELETE', this._build_matcher(true), this.destroy],
      ['PATCH', this._build_matcher(true), this.update],
    ]
    Object.entries(this).forEach(item => {
      const func = item[1]
      if(func.action){
        const {method, name, detail} = func.action
        res.push([method, this._build_matcher(detail,name), func])
      }
    })
    return res
  }
}