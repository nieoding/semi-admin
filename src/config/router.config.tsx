import React from 'react'
import { IconHome, IconUser, IconApps } from '@douyinfe/semi-icons'

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
  {
    path: 'refresh',
    name: 'refresh',
    component: React.lazy(() => import('@/views/refresh')),
    hidden: true
  },
  {
    path: 'user',
    name: 'user',
    component: React.lazy(() => import('@/views/user')),
    meta: { title: '用户管理', icon: <IconUser/>, permission:['admin']}
  },
  {
    path: 'article',
    name: 'article',
    component: React.lazy(() => import('@/views/article')),
    meta: { title: '新闻管理', icon: <IconApps />}
  }
]

export {asyncRouters}