import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import DOMPurify from 'dompurify'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import productApi from 'src/apis/product.api'
import purchaseApi from 'src/apis/purchase.api'
import ProductRating from 'src/components/ProductRating/ProducRating'
import QuantityController from 'src/components/QuantityController'
import { purchasesStatus } from 'src/constants/purchase'
import { ProductListConfig, Product as ProductType } from 'src/types/product.type'
import { formatCurrency, formatNumberToSocialStyle, getIdFromNameId, rateSale } from 'src/utils/ultils'
import Product from '../Product/Product'

export default function ProductDetail() {
  const queryClient = useQueryClient()
  const { nameId } = useParams()
  const id = getIdFromNameId(nameId as string)
  const { data: productDetail } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getProductDetail(id as string)
  })

  const [currentIndexImages, setCurrentIndexImages] = useState([0, 5])
  const [activeImage, setActiveImage] = useState('')
  const product = productDetail?.data.data
  const imageRef = useRef<HTMLImageElement>(null)
  const currentImages = useMemo(() => product ? product.images.slice(...currentIndexImages) : [], [product, currentIndexImages])

  const queryConfig: ProductListConfig = { limit: '20', page: '1', category: product?.category._id }

  const [buyCount, setBuyCount] = useState(1)
  const { data: productsData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => productApi.getProducts(queryConfig),
    staleTime: 3 * 60 * 1000,
    enabled: Boolean(product)
  })

  const addToCartMutation = useMutation({
    mutationFn: purchaseApi.addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases', { status: purchasesStatus.inCart }] })
      toast.success('Added to cart successfully!', { autoClose: 1000 })
    },
    onError: (error: any) => {
      toast.error(`Error adding to cart: ${error.message}`)
    },
  })

  useEffect(() => {
    if (product && product.images.length > 0) {
      setActiveImage(product.images[0])
    }
  }, [product])

  const chooseActive = (img: string) => {
    setActiveImage(img)
  }

  const next = () => {
    if (currentIndexImages[1] < (product as ProductType).images.length) {
      setCurrentIndexImages((prev) => [prev[0] + 1, prev[1] + 1])
    }
  }

  const prev = () => {
    if (currentIndexImages[0] > 0) {
      setCurrentIndexImages((prev) => [prev[0] - 1, prev[1] - 1])
    }
  }

  const handleZoom = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const image = imageRef.current as HTMLImageElement
    const { naturalHeight, naturalWidth } = image
    const offsetX = event.pageX - (rect.x + window.scrollX)
    const offsetY = event.pageY - (rect.y + window.scrollY)

    const top = offsetY * (1 - naturalHeight / rect.height)
    const left = offsetX * (1 - naturalWidth / rect.width)
    image.style.width = naturalWidth + 'px'
    image.style.height = naturalHeight + 'px'
    image.style.maxWidth = 'unset'
    image.style.top = top + 'px'
    image.style.left = left + 'px'
  }

  const handleRemoveZoom = () => {
    imageRef.current?.removeAttribute('style')
  }

  const handleBuyCount = (value: number) => {
    setBuyCount(value)
  }

  const addToCart = () => {
    if (!product) {
      toast.error('Product data is missing')
      return
    }

    const payload = {
      buy_count: buyCount,
      product_id: product._id,
    }

    addToCartMutation.mutate(payload)
  }

  if (!product) return null

  return (
    <div className='bg-white p-4 shadow'>
      <div className="bg-white p-4 shadow container w-[1280px]">
        <div className="grid grid-cols-12 gap-9">
          <div className="col-span-5">
            <div className="relative w-full cursor-zoom-in overflow-hidden pt-[100%] shadow" onMouseMove={handleZoom} onMouseLeave={handleRemoveZoom}>
              <img
                src={activeImage}
                alt={product.image}
                className='absolute pointer-events-none  top-0 left-0 bg-white w-full h-full object-cover'
                ref={imageRef}
              />
            </div>
            <div className="relative mt-4 grid grid-cols-5 gap-1">
              <button className='absolute left-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white' onClick={prev}>
                <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='h-5 w-5'>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
                </svg>
              </button>

              {currentImages.map((img) => {
                const isActive = img === activeImage
                return (
                  <div key={img} className='relative w-full pt-[100%]' onMouseEnter={() => chooseActive(img)}>
                    <img src={img} alt={product.name} className='absolute top-0 left-0 bg-white w-full h-full object-cover' />
                    {isActive && <div className='absolute inset-0 border-2 border-orange' />}
                  </div>
                )
              })}

              <button className='absolute right-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white' onClick={next}>
                <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='h-5 w-5'>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                </svg>
              </button>
            </div>
          </div>
          <div className="col-span-7">
            <h1 className='text-xl font-medium uppercase'>{product.name}</h1>
            <div className="mt-8 flex items-center">
              <div className="flex items-center">
                <span className='mr-1 border-b border-b-orange text-orange'>{product.rating}</span>
                <ProductRating rating={product.rating} activeClassname='fill-orange text-orange h-4 w-4' nonActiveClassname='fill-gray-300 text-gray-300 h-4 w-4' />
                <div className='mx-4 h-4 w-[1px] bg-gray-300'></div>
                <div>
                  <span>{formatNumberToSocialStyle(product.sold)}</span>
                  <span className='ml-1 text-gray-500'>Đã bán</span>
                </div>
              </div>
            </div>
            <div className="mt-8 flex items-center bg-gray-50 px-5 py-4">
              <div className='text-gray-500 line-through'>₫{formatCurrency(product.price_before_discount)}</div>
              <div className='ml-3 text-3xl font-medium text-orange'>₫{formatCurrency(product.price)}</div>
              <div className='ml-4 rounded-sm bg-orange px-1 py-[2px] text-xs font-semibold uppercase text-white'>
                {rateSale(product.price_before_discount, product.price)} giảm
              </div>
            </div>
            <div className='mt-8 flex items-center'>
              <div className='capitalize text-gray-500'>Số lượng</div>
              <QuantityController value={buyCount} max={product.quantity} onIncrease={handleBuyCount} onDecrease={handleBuyCount} onType={handleBuyCount} />
              <div className='ml-6 text-sm text-gray-500'>{product.quantity} sản phẩm có sẵn</div>
            </div>
            <div className='mt-8 flex items-center'>
              <button onClick={addToCart} className='flex h-12 items-center justify-center rounded-sm border border-orange bg-orange/10 px-5 capitalize text-orange shadow-sm hover:bg-orange/5'>
                <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='mr-3 h-6 w-6'>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M2.25 3h1.386a1.5 1.5 0 011.426 1.106l.564 2.256M6.75 15h10.5M6.75 15l-1.5-6h12l-1.5 6M6.75 15l.857 3.428A1.5 1.5 0 009.07 19.5h5.858a1.5 1.5 0 001.463-1.072L17.25 15M10.5 9h3m-6.386-4.638l1.12 4.48m0 0l.512 2.048A1.5 1.5 0 009.07 12h5.858a1.5 1.5 0 001.463-1.072l.512-2.048m-7.756 0h6.386' />
                </svg>
                Thêm vào giỏ hàng
              </button>
              <button className='ml-4 flex h-12 items-center justify-center rounded-sm bg-orange px-5 capitalize text-white shadow-sm outline-none hover:bg-orange/90'>
                Mua ngay
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className='mt-8'>
        <div className='container w-[1280px]'>
          <div className='mt-8 bg-white p-4 shadow'>
            <div className='container'>
              <div className='mt-4 text-lg font-bold uppercase'>Mô tả sản phẩm</div>
              <div className='mt-4 mb-4 text-sm leading-loose' dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description) }} />
            </div>
          </div>
        </div>
      </div>
      <div className='mt-8'>
        <div className='container w-[1280px]'>
          <div className='mt-8 uppercase text-gray-400'>Có thể bạn cũng thích</div>
          {productsData && (
            <div className='mt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3'>
              {productsData.data.data.products.map((product: ProductType) => (
                <div className='col-span-1' key={product._id}>
                  <Product product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
