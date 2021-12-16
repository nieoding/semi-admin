import React from 'react'
import { IconHome } from '@douyinfe/semi-icons'

export type RouterItem = {
  name: string,
  path: string,
  children?: Array<RouterItem>,
  component?: Function,
  hidden?: boolean
  meta?: {
    title: string,
    icon?: JSX.Element,
    permission?: Array<string>
  }
}
export const LOGIN_PATH = '/login'
export const KEY_HOME = 'dashboard'

const asyncRouters:Array<RouterItem> = [
  {
    path: '/',
    name: KEY_HOME,
    component: React.lazy(() => import('@/views/dashboard')),
    meta: { title: '首页', icon: <IconHome/>}
  },
]

export {asyncRouters}