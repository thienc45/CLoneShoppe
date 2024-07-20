import { Product, ProductList, ProductListConfig } from 'src/types/product.type'
import { SuccesRessponse } from 'src/types/ultils.type'

import http from 'src/utils/http'

const URL = 'products'
const productApi = {
  getProducts(params: ProductListConfig) {
    return http.get<SuccesRessponse<ProductList>>(URL, {
      params
    })
  },
  getProductDetail(id: string) {
    return http.get<SuccesRessponse<Product>>(`${URL}/${id}`)
  }
}

export default productApi