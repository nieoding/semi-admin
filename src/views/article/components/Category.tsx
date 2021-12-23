import React from 'react'
import { Form } from "@douyinfe/semi-ui";
import { OptionProps } from '@douyinfe/semi-ui/lib/es/select'
import * as service from '@/api/dict'
export default function Index(props:any){
  const [options, setOptions] = React.useState<OptionProps[]>([])
  const [loading, setLoading] = React.useState(false)
  React.useEffect(() =>{
    (async ()=>{
      setLoading(true)
      const res = await service.categories()
      const items: OptionProps[] = []
      res.forEach(item=>{
        items.push({value: item.id, label: item.name})
      })
      setOptions(items)
      setLoading(false)
    })()
  }, [])
  return <Form.Select loading={loading} optionList={options} {...props}/>
}