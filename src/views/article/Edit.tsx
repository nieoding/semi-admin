import React from "react";
import { Modal, Form, Spin, Toast, Row, Col } from "@douyinfe/semi-ui";
import * as service from '@/api/article'
import {importances} from './components/const'
import Category from './components/Category'

interface EditProps {
  visible?: boolean,
  source?: service.Article,
  onClose: (updated:boolean)=>void
}
const initValues = {
  category: 1,
  importance: 1,
  create_time: new Date(),
  is_published: true
}

export default function Index(props:EditProps){
  const [loading, setLoading] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const roleForm = React.useRef<Form>(null)
  React.useEffect(()=>{
    if(props.visible){
      (async () =>{
        if(props.source){
          setLoading(true)
          const res:service.Article = await service.detail(props.source.id)
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
    Toast.success(props.source? '已更新' : '已添加')
    props.onClose(true)
  }
  return (
    <Modal
      visible={props.visible}
      width={800}
      title={props.source? '编辑' : '新增'}
      confirmLoading={submitting}
      onCancel={()=>props.onClose(false)}
      onOk={()=>{
        roleForm.current && roleForm.current.formApi.submitForm()
      }}
    >
      <Spin spinning={loading}>
        <Form ref={roleForm} initValues={initValues} onSubmit={handleSubmit}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Input label="作者" field="author" rules={[{required: true, message:'请输入'}]}/>
            </Col>
            <Col span={16}>
              <Form.Input label="标题" field="title" rules={[{required: true, message:'请输入'}]}/>
            </Col>
            <Col span={24}>
              <Form.TextArea label="正文" field="content" rules={[{required: true, message:'请输入'}]}/>
            </Col>
          </Row>
          <Form.Section>
            <Row gutter={16}>
              <Col span={6}>
                <Category label="分类" field="category" style={{width: '100%'}} rules={[{required: true, message:'请选择'}]}/>
              </Col>
              <Col span={6}>
              <Form.Select label="重要性" field="importance" optionList={importances} style={{width: '100%'}} rules={[{required: true, message:'请选择'}]}/>
              </Col>
              <Col span={6}>
                <Form.DatePicker type="dateTime" label="创建时间" field="create_time" style={{width: '100%'}} rules={[{required: true, message:'请选择'}]}/>
              </Col>
              <Col span={6}>
                <Form.Checkbox label="发布" field="is_published"/>
              </Col>
              <Col span={24}>
              <Form.TagInput label="标签" field="tags"/>
              </Col>
            </Row>
          </Form.Section>
        </Form>
      </Spin>
    </Modal>
  )
}