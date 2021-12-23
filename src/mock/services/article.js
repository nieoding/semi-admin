import queryset from "../models/article";
import { categories } from "../models/dict";
import { ModelViewSet } from '../rest'
import * as serializers from '../serializers'
import {Action} from '../util'

class ListSerlaizer extends serializers.ModelSerializer {
  category = serializers.SerializerMethodField((source) => {
    return categories.find(item=>item.id===source.category).name
  })
  meta_excludes = ['content']
}

class ArticleViewSet extends ModelViewSet {
  queryset = queryset
  model = 'article'
  ordering = ['-id']
  filterset_fields = ['category', 'create_time@daterange', 'importance', 'is_published']
  search_fields = ['author', 'title', 'tags']
  list_serializer_class = ListSerlaizer
  bulkDelete = Action((request)=>{
    const ids = request.data.ids
    this.queryset = this.queryset.filter(item => !ids.includes(item.id))
    return [200,]
  }, 'delete')
}
const routers = new ArticleViewSet().routers()
export default routers