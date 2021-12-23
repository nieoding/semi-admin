import { categories } from '../models/dict'

const routers = [
  ["GET", "/api/dict/category/", () => {return [200, categories]}],
]
export default routers