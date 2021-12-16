import {init} from './util'

const DELAY = 200 // 模拟响应时间

if(process.env.NODE_ENV !== 'production'){
  const modals = [
    require('./services/auth')
  ]
  init(modals, DELAY)
}