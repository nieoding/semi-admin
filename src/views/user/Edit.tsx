import React from "react";
import { Modal, Form, Spin, Toast } from "@douyinfe/semi-ui";
import * as service from '@/api/user'

interface EditProps {
  visible?: boolean,
  source?: service.User,
  onClose: (updated:boolean)=>void
}
export const Roles = [
  {value: 'admin', label: '管理员'},
  {value: 'guest', label: '游客'},
]

export default function Index(props:EditProps){
  const [loading, setLoading] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const roleForm = React.useRef<Form>(null)
  React.useEffect(()=>{
    if(props.visible){
      (async () =>{
        if(props.source){
          setLoading(true)
          const res:service.User = await service.detail(props.source.id)
          setLoading(false)
          roleForm.current && roleForm.current.formApi.setValues(res)
        }
      })()
    }
  },[props.visible, props.source])
  async function handleSubmit(values: Record<string,any>){
    setSubmitting(true)
    const func = props.source ? service.update(props.source.id, values) : service.create(values)
    await func
    setSubmitting(false)
    Toast.success(props.source? '用户已更新' : '用户已添加')
    props.onClose(true)
  }
  return (
    <Modal
      visible={props.visible}
      title={props.source? '编辑用户' : '新增用户'}
      confirmLoading={submitting}
      onCancel={()=>props.onClose(false)}
      onOk={()=>{
        roleForm.current && roleForm.current.formApi.submitForm()
      }}
    >
      <Spin spinning={loading}>
        <Form ref={roleForm} onSubmit={handleSubmit}>
          <Form.Input field="username" label="用户名" rules={[{required: true, message: '请输入'}]}/>
          <Form.Input field="password" label="密码" rules={[{required: true, message: '请输入'}]}/>
          <Form.Select field="role" label="角色" style={{width: '100%'}} optionList={Roles} rules={[{required: true, message: '请选择'}]}/>
        </Form>
      </Spin>
    </Modal>
  )
}