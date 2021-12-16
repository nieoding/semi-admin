import React from 'react'
import BlankLayout from '@/layouts/blank'
import { useNavigate } from 'react-router';
import { Empty, Button } from '@douyinfe/semi-ui';
import { IllustrationConstruction, IllustrationConstructionDark } from '@douyinfe/semi-illustrations';
export default function Index() {
  const navigate = useNavigate()
  return (
    <BlankLayout>
      <Empty
        image={<IllustrationConstruction style={{width: 150, height: 150}} />}
        darkModeImage={<IllustrationConstructionDark style={{width: 150, height: 150}} />}
        title="404"
        description="页面不存在"
      >
        <Button type="primary" theme="solid" onClick={() => {navigate('/')}}>返回首页</Button>
      </Empty>
    </BlankLayout>
  )
}