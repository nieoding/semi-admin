import React from 'react'
import { Row } from "@douyinfe/semi-ui"

export default function Index(props: {children: React.ReactNode}){
  return (
    <div 
        style={{
          paddingTop:100,
          height:'100%',
          backgroundColor: 'var(--semi-color-bg-1)',
        }}
    >
        <Row type="flex" justify="center">
          {props.children}
        </Row>
    </div>
  )
}