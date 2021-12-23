export function SerializerMethodField(func){
  func.isfield = true
  return func
}

export class ModelSerializer{
  meta_fields = 'all'
  meta_excludes = []

  constructor(meta) {
    this._initmeta = meta
  }
  _cache = () => {
    !this._meta && (this._meta = this._make_meta())
    !this._customFields && (this._customFields = this._fetch_custom_fields())
  }
  _make_meta = () => {
    const fields = this.meta_fields === 'all' ? this._initmeta : this.meta_fields
    if(!fields){return null}
    return fields.filter(item=>!this.meta_excludes.includes(item))
  }
  _fetch_custom_fields = () => {
    const res = []
    Object.entries(this).forEach(([key, func]) => {
      if(func && func.isfield){
        res.push(key)
      }
    })
    return res
  }
  _get_value = (source, key) => {
    if (this._customFields.includes(key)){
      const func = this[key]
      return func(source)
    } else {
      return source[key]
    }
  }
  _serialize_object = (source) => {
    if(!this._meta){return source}
    const res = {}
    Object.keys(source).forEach(key=>{
      if(this._meta.includes(key)){
        res[key] = this._get_value(source, key)
      }
    })
    return res
  }
  serialize = (source, many) => {
    this._cache()
    if(many){
      const res = []
      source.forEach(item=>{
        res.push(this._serialize_object(item))
      })
      return res
    } else {
      return this._serialize_object(source)
    }
  }
}