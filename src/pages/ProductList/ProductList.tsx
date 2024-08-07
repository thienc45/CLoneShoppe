import { useQuery } from '@tanstack/react-query'
import productApi from 'src/apis/product.api'
import AsideFilter from '../AsideFilter'
import Product from '../Product/Product'
import SortProductList from '../SortProduclist'
import Pagination from 'src/components/Paginate/Paginate'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { ProductList, ProductListConfig } from 'src/types/product.type'
import { AxiosResponse } from 'axios'
import { SuccesRessponse } from 'src/types/ultils.type'
import categoryApi from 'src/apis/category.api'

export default function ProductList1() {
  const queryConfig = useQueryConfig()

  const { data: productsData }: { data?: AxiosResponse<SuccesRessponse<ProductList>> } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => productApi.getProducts(queryConfig as ProductListConfig),

    staleTime: 3 * 60 * 1000,
    // keepPreviousData: true,
  });

  const pageSize = productsData?.data?.data?.pagination?.page_size || 0;

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return categoryApi.getCategories()
    }
  })

  return (
    <div className='bg-gray-200 py-6'>
      <div className='container'>
        <div className='grid grid-cols-12 gap-6'>
          <div className='col-span-3'>
            <AsideFilter queryConfig={queryConfig} categories={categoriesData?.data.data || []} />
          </div>
          <div className='col-span-9'>
            <SortProductList queryConfig={queryConfig} pageSize={pageSize} />
            <div className='mt-6  grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3'>
              {productsData && productsData.data.data.products.map((product) => (
                <div className='col-span-1' key={product._id}>
                  <Product product={product} />
                </div>
              ))}
            </div>
            <Pagination queryConfig={queryConfig} pageSize={pageSize} />
          </div>
        </div>
      </div>
    </div>
  )
}
