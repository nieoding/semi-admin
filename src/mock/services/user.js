import { ModelViewSet } from '../rest'
import users from '../models/user'

class UserViewSet extends ModelViewSet{
  queryset = users
  model = 'user'
  paginate_enabled = false
  ordering = ['id']
}
const routers = new UserViewSet().routers()
export default routers