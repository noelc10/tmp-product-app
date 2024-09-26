import { defineStore } from 'pinia'

export const useProductStore = defineStore('productStore', () => {
  const api = useAPI()
  const helpers = useHelpers()
  
  const products = ref([])
  const offset = ref(0)
  const limit = ref(10)
  const filters = ref({
    categoryId: null
  })
  const endRequest = ref(false)

  const product = ref(null)

  const getProducts = async (paginate = true) => {
    if (endRequest.value) return

    if (!paginate) clearProducts()

    const queryParameters = []
    if (paginate) {
      queryParameters.push(`offset=${offset.value}`, `limit=${limit.value}`)
      offset.value = products.value.length > 0 ? offset.value + limit.value : 0
    }

    if (filters.value.categoryId) {
      queryParameters.push(`categoryId=${filters.value.categoryId}`)
    }

    const queryString = queryParameters.length ? `?${queryParameters.join('&')}` : ''
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

      if (i < 0) {
        products.value.push({
          ...item,
          images: sanitizeImage(item.images)
        })
      } else {
        products.value.splice(i, 1, item)
      }
    })
  }
  
  const setProduct = (data) => {
    clearProduct()
    
    data.images = sanitizeImage(data.images)

    product.value = data
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

  const submitProduct = async payload => {
    if (payload?.id) {
      await api.put(`/products/${payload.id}`, payload)

      return
    }

    await api.post('/products', payload)
  }

  const deleteProduct = id => {
    return new Promise(async (resolve, reject) => {
      await api.del(`/products/${id}`)
        .then(() => {
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  const sanitizeImage = (images) => {
    let sanitizedImgs = helpers.sanitizeArray(images)

    return Array.isArray(images)
      ? sanitizedImgs
      : helpers.isValidJSON(images)
        ? JSON.parse(images)
        : sanitizedImgs
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
