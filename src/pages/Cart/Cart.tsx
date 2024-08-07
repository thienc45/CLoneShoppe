import { useQuery } from '@tanstack/react-query'
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import purchaseApi from 'src/apis/purchase.api'
import path from 'src/constants/path'
import { purchasesStatus } from 'src/constants/purchase'
import { AppContext } from 'src/contexts/app.context'
import { formatCurrency, generateNameId } from 'src/utils/ultils'

export default function Cart() {

  const { isAuthenticated } = useContext(AppContext)

  const { data: purchasesInCartData } = useQuery({
    queryKey: ['purchases', { status: purchasesStatus.inCart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchasesStatus.inCart }),
    enabled: isAuthenticated
  })

  const purchasesInCart = purchasesInCartData?.data.data
  console.log(purchasesInCart)

  return (
    <div className='bg-neutral-100 py-16'>
      <div className="container w-[1280px]">
        <div className="overflow-auto">
          <div className="min-w-[1000px]">
            <div className="flex items-center ">
              <div className="w- grid grid-cols-12 rounded-sm bg-white py-5 px-9 text-sm capitalize text-gray-500 shadow">
                <div className="col-span-6">
                  <div className="flex items-center">
                    <div className="flex flex-shrink-0 items-center justify-center pr-3">
                      <input
                        type='checkbox'
                        className='h-5 w-5 accent-orange'
                      // checked={isAllChecked}
                      // onChange={handleCheckAll}
                      />
                    </div>
                    <div className='flex-grow text-black'>Sản phẩm</div>
                  </div>
                </div>
                <div className="col-span-6">
                  <div className='grid grid-cols-5 text-center'>
                    <div className='col-span-2'>Đơn giá</div>
                    <div className='col-span-1'>Số lượng</div>
                    <div className='col-span-1'>Số tiền</div>
                    <div className='col-span-1'>Thao tác</div>
                  </div>
                </div>
              </div>
              <div className="my-3 grid-cols-12 rounded-sm bg-white p-5 shadow">
                {purchasesInCart?.map((purchase, index) => (
                  <div
                    key={purchase._id}
                    className='mb-5 grid grid-cols-12 items-center rounded-sm border border-gray-200 bg-white py-5 px-4 text-center text-sm text-gray-500 first:mt-0'
                  >
                    <div className="col-span-6">
                      <div className="flex">
                        <div className="flex flex-shrink-0 items-center justify-center pr-3">
                          <input
                            type='checkbox'
                            className='h-5 w-5 accent-orange'
                          />
                        </div>
                        <div className="flex-grow">
                          <div className="flex">
                            <Link
                              className='h-20 w-20 flex-shrink-0'
                              to={`${path.home}${generateNameId({
                                name: purchase.product.name,
                                id: purchase.product._id
                              })}`}
                            >
                              <img alt={purchase.product.name} src={purchase.product.image} />
                            </Link>

                            <div className="flex-grow px-2 pt-1 pb-2">
                              <div className="col-span-2">
                                <div className="flex items-center justify-center">
                                  <span className='text-gray-300 line-through'>
                                    ₫{formatCurrency(purchase.product.price_before_discount)}
                                  </span>
                                  <span className='ml-3'>₫{formatCurrency(purchase.product.price)}</span>                                  </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
