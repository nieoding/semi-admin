import React from 'react'
import BlankLayout from '@/layouts/blank'
import {Card, Form,Button, Toast} from '@douyinfe/semi-ui'
import {useStore} from '@/store'
import { useNavigate, useLocation} from 'react-router-dom' 
import * as service from '@/api/auth'
import to from 'await-to-js'


export default function Index(){
  const {store} = useStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [submitting, setSubmitting] = React.useState(false)
  const refForm = React.useRef<Form>(null)
  React.useEffect(()=>{
    document.title = `${store.app.siteName} - 系统登录`
  },[store.app.siteName])
  async function handleSubmit(values:any){
    setSubmitting(true)
    const params = Object.assign({}, values)
    const [err, res]: [any,any] = await to(service.login(params))
    setSubmitting(false)
    if(err){
      refForm.current?.formApi.reset()
      Toast.error(err.response.data)
    } else {
      window.localStorage['access-token'] = res.token
      const state: any = location.state
      navigate(state ? state.from: '/')
    }
  }
  return (
    <BlankLayout>
      <Card 
            shadows='always'
            style={{ width: 360, cursor: "auto" }}
            footerLine
            header={
              <h2 style={{width:'100%', textAlign:'center', color: 'var(--semi-color-text-2)'}}>{store.app.siteName}</h2>
            }
            footer={
              <Button theme="solid" loading={submitting} style={{width:'100%'}} onClick={() => {refForm.current && refForm.current.formApi.submitForm()}}>登录</Button>
            }
        >
            <Form ref={refForm} labelAlign="right" labelPosition="inset"  onSubmit={values => handleSubmit(values)}>
              <Form.Input
                field='username'
                label='用户名'
                rules={[
                  { required: true, message: '请输入' },
                ]}
              />
              <Form.Input
                field='password'
                label="密　码"
                type='password'
                rules={[
                  { required: true, message: '请输入' },
                ]}
                onEnterPress={()=>{refForm.current && refForm.current.formApi.submitForm()}}
              />
            </Form>
        </Card>
    </BlankLayout>
  )
}