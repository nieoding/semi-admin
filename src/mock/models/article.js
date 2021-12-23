import { categories } from './dict'
import { randomChoice } from '../util'
const Mock = require('mockjs')

const queryset = []
const count = 20
for (let i = 0; i < count; i++) {
  queryset.push(Mock.mock({
    id: '@increment',
    create_time: '@datetime',
    author: '@cname',
    title: '@ctitle',
    content: '@cparagraph',
    importance: '@integer(1, 3)',
    category: randomChoice(categories)[0].id,
    'is_published|1': true,
    'tags': randomChoice(["可爱", "全球疫情", "冬奥会", "大楼", "黄金", "脆弱", "微信", "元宇宙", "税务"],Mock.Random.integer(1,4))
  }))
}

export default queryset