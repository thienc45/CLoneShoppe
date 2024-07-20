import http from 'src/utils/http'
import { Category } from 'src/types/category.type'
import { SuccesRessponse } from 'src/types/ultils.type'


const URL = 'categories'

const categoryApi = {
  getCategories() {
    return http.get<SuccesRessponse<Category[]>>(URL)
  }
}

export default categoryApi