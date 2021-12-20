const Mock = require('mockjs')
const queryset = [
  {
    id: Mock.mock('@increment'),
    username: 'admin',
    password: 'admin',
    role: 'admin',
  },
  {
    id: Mock.mock('@increment'),
    username: 'guest',
    password: 'guest',
    role: 'guest',
  }
]
export default queryset