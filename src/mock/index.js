const DELAY = 200 // 模拟响应时间

if(process.env.NODE_ENV !== 'production'){
  const util = require('./util')
  util.init(DELAY)
}