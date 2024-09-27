import { defineStore } from 'pinia'

export const useProductStore = defineStore('productStore', () => {
  const api = useAPI()
  const helpers = useHelpers()
  
  const products = ref([])
  const offset = ref(0)
  const limit = ref(10)
  const filters = ref({ categoryId: null })
  const endRequest = ref(false)
  const product = ref(null)

  const buildQueryString = (params) => {
    return params.length ? `?${params.join('&')}` : ''
  }
  const updateOffset = (paginate) => {
    if (paginate) {
      offset.value = products.value.length > 0 ? offset.value + limit.value : 0
    }
  }

  const getProducts = async (paginate = true) => {
    if (endRequest.value) return
    if (!paginate) clearProducts()

    const queryParameters = []
    if (paginate) {
      queryParameters.push(`offset=${offset.value}`, `limit=${limit.value}`)
      updateOffset(paginate)
    }
    if (filters.value.categoryId) {
      queryParameters.push(`categoryId=${filters.value.categoryId}`)
    }
    const queryString = buildQueryString(queryParameters)
    const data = await api.get(`/products${queryString}`)

    setProducts(data)
    if (!data.length || !paginate) {
      endRequest.value = true
    }
  }

  const getProduct = async (id) => {
    const data = await api.get(`/products/${id}`)
    if (data) setProduct(data)
  }

  const setProducts = (data) => {
    _each(data, (item) => {
      const i = _findIndex(products.value, { id: item.id })
      const sanitizedItem = { ...item, images: sanitizeImage(item.images) }

      if (i < 0) {
        products.value.push(sanitizedItem)
      } else {
        products.value.splice(i, 1, sanitizedItem)
      }
    })
  }
  
  const setProduct = (data) => {
    clearProduct()
    product.value = { ...data, images: sanitizeImage(data.images) }
  }

  const clearProducts = () => {
    products.value = []
    offset.value = 0
    limit.value = 10
    endRequest.value = false
  }

  const clearProduct = () => {
    product.value = null
  }

  const submitProduct = async (payload) => {
    const method = payload?.id ? 'put' : 'post'
    const url = payload?.id ? `/products/${payload.id}` : '/products'
    await api[method](url, payload)
  }

  const deleteProduct = async (id) => {
    try {
      await api.del(`/products/${id}`)
    } catch (error) {
      throw error
    }
  }

  const sanitizeImage = (images) => {
    const sanitizedImgs = helpers.sanitizeArray(images)
    return Array.isArray(images) ? sanitizedImgs : helpers.isValidJSON(images) ? JSON.parse(images) : sanitizedImgs
  }

  return {
    products,
    offset,
    limit,
    filters,
    endRequest,
    product,
    getProducts,
    clearProducts,
    setProducts,
    getProduct,
    clearProduct,
    setProduct,
    submitProduct,
    deleteProduct,
  }
})
