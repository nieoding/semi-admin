import React from "react"
import { Form, Col, Row, Button } from "@douyinfe/semi-ui"
import { IconSearch, IconCaretup, IconCaretdown } from "@douyinfe/semi-icons"
import {format} from 'date-fns'
import { OptionProps } from "@douyinfe/semi-ui/lib/es/select"

const DATERANGE_PREFIX = '@daterange_'
const DATE_PREFIX = '@date_'

interface BasicField{
  /** 间距 */
  span?: number,
  /** 字段名 */
  name?: string,
  /** 显示名称 */
  label?: string,
  /** 占位符 */
  placeholder?: string
}
interface FilterField extends BasicField{
  /** 是否扩展字段，扩展字段只有在展开时显示 */
  advance?: boolean
  /** 字段类型，默认是下拉选择，支持日期、日期范围、自定义 */
  type?: 'daterange'|'date'|'custom'
  /** 如果type=custom，使用render来渲染 */
  render?: (submit: Function) => React.ReactNode
  /** 选择项， 格式：{value:'', label:''} */
  choices?: OptionProps[]
}
export interface FilterOption {
  /** 是否有展开/收起功能 */
  advance?:boolean,
  /** 搜索框配置 */
  search?:BasicField,
  /** 筛选项列表 */
  fields?: Array<FilterField>
}
interface FilterFormProps{
  /** 筛选提交回调 */
  onSubmit: (params:Record<string,any>) => void,
  /** 配置项 */
  option?: FilterOption
}

function formatDate(val:string){
  return format(new Date(val), 'yyyy-MM-dd')
}

export default function FilterForm(props: FilterFormProps){
  const roleForm = React.useRef<Form>(null)
  const [values, setValues] = React.useState<Record<string,any>>()
  const [advance, setAdvance] = React.useState<boolean>(false)
  function handleSubmit(values: Record<string,any>){
    setValues(values)
    const params:Record<string,any> = {}
    Object.entries(values).forEach(item =>{
      const key = item[0]
      const value = item[1]
      if(key.indexOf(DATERANGE_PREFIX)>=0){
        if (value.length > 0){
          const itemKey = key.substr(DATERANGE_PREFIX.length)
          params[`${itemKey}_after`] = formatDate(value[0])
          params[`${itemKey}_before`] = formatDate(value[1])
        }
      }
      else if(key.indexOf(DATE_PREFIX)>=0){
        const itemKey = key.substr(DATE_PREFIX.length)
        params[itemKey] = formatDate(value)
      } else {
        params[key] = item[1]
      }
    })
    props.onSubmit(params)
  }
  function submitForm(){
    roleForm.current && roleForm.current.formApi.submitForm()
  }
  function renderField(field: FilterField){
    if (field.type === 'daterange'){
      return <Form.DatePicker initValue={values && field.name && values[`${DATERANGE_PREFIX}${field.name}`]} style={{width:'100%'}} placeholder={field.placeholder} field={`${DATERANGE_PREFIX}${field.name}`} label={field.label||field.name} type="dateRange" onChange={submitForm}/>
    }
    else if(field.type === 'date'){
      return <Form.DatePicker initValue={values && field.name && values[`${DATE_PREFIX}${field.name}`]}  style={{width:'100%'}}  placeholder={field.placeholder} field={`${DATE_PREFIX}${field.name}`} label={field.label||field.name} onChange={submitForm}/>
    }
    else if(field.type === 'custom'){
      return field.render && field.render(submitForm)
    }
    return <Form.Select initValue={values && field.name && values[field.name]}  placeholder={field.placeholder||'全部'} field={field.name||''} label={field.label} style={{width:'100%'}} onChange={submitForm} showClear optionList={field.choices||[]}/>
  }
  function renderFields(){
    if (!props.option|| !props.option.fields){
      return
    }
    return props.option.fields.map((field, i) => {
      let needShow = true
      if (props.option && props.option.advance) {
        if(field.advance && !advance){
          needShow = false
        }
      }
      return needShow && <Col key={i} md={field.span||6} sm={24}>{renderField(field)}</Col>
    }
    )
  }
  function renderSearch(){
    const search = props.option && props.option.search
    if(!search){
      return ''
    }
    return (
      <Col md={search.span} sm={24}>
        <Form.Input
            field={search.name||'search'}
            label={search.label || '搜索'}
            placeholder={search.placeholder || '输入搜索条件'}
            suffix={<IconSearch />}
            showClear
            onClear={submitForm}
            onEnterPress={submitForm}
            />
      </Col>
    )
  }
  function renderAdvance(){
    if(!props.option || !props.option.advance){
      return
    }
    return (
      <Col md={2} sm={24}>
        <Form.Slot style={{display:"flex",alignItems:"center", height:'100%'}}>
          <Button 
            onClick={()=>{setAdvance(!advance)}}
            icon={advance ? <IconCaretup/> : <IconCaretdown/>}
            theme="borderless"
            iconPosition="right"
          >
            {advance ? '收起': '展开'}
          </Button>
        </Form.Slot>
      </Col>
    )
  }
  return (
    <Form ref={roleForm} labelPosition="inset" onSubmit={handleSubmit}>
      <Row gutter={6} style={{marginTop:-18}}>
      {
        renderFields()
      }
      {
        renderSearch()
      }
      {
        renderAdvance()
      }
      <Col span={0}>
        <Form.Input style={{display:'none'}} field='_hidden'/>
      </Col>
      </Row>
    </Form>
  )
}