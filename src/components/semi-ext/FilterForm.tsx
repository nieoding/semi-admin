import React from "react"
import { Form, Col, Row, Button } from "@douyinfe/semi-ui"
import { IconSearch, IconCaretup, IconCaretdown } from "@douyinfe/semi-icons"
import {format} from 'date-fns'
import { OptionProps } from "@douyinfe/semi-ui/lib/es/select"

const DATERANGE_PREFIX = '@daterange_'
const DATE_PREFIX = '@date_'

interface BasicField{
  span?: number,
  name?: string,
  label?: string,
  placeholder?: string
}
interface FilterField extends BasicField{
  advance?: boolean
  type?: 'daterange'|'date'|'custom'
  render?: Function
  choices?: OptionProps[]
}
export interface FilterOption {
  advance?:boolean,
  search?:BasicField,
  fields?: Array<FilterField>
}
interface FilterFormProps{
  onSubmit: (params:Record<string,any>) => void,
  option?: FilterOption
}

function formatDate(val:string){
  return format(new Date(val), 'yyyy-MM-dd')
}

export default function FilterForm(props: FilterFormProps){
  const roleForm = React.useRef<Form>(null)
  const [advance, setAdvance] = React.useState<boolean>(false)
  function handleSubmit(values: Record<string,any>){
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
      return <Form.DatePicker style={{width:'100%'}} placeholder={field.placeholder} field={`${DATERANGE_PREFIX}${field.name}`} label={field.label||field.name} type="dateRange" onChange={submitForm}/>
    }
    else if(field.type === 'date'){
      return <Form.DatePicker style={{width:'100%'}}  placeholder={field.placeholder} field={`${DATE_PREFIX}${field.name}`} label={field.label||field.name} onChange={submitForm}/>
    }
    else if(field.type === 'custom'){
      return field.render && field.render(submitForm)
    }
    return <Form.Select placeholder={field.placeholder||'全部'} field={field.name||''} label={field.label} style={{width:'100%'}} onChange={submitForm} showClear optionList={field.choices||[]}/>
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