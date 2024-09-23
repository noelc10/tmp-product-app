import { defineStore } from 'pinia'

export const useProductStore = defineStore('productStore', () => {
  const api = useAPI()
  
  const products = ref([])
  const offset = ref(0)
  const limit = ref(10)
  const filters = ref({
    categoryId: null
  })
  const lastRequest = ref(false)

  const product = ref(null)

  const getProducts = async (paginate = true) => {
    if (lastRequest.value) return

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
      lastRequest.value = true
    }
  }

  const clearProducts = () => {
    products.value = []
    lastRequest.value = false
  }

  const setProducts = (data) => {
    _each(data, (item) => {
      const i = _findIndex(products.value, { id: item.id })

      if (i < 0) {
        products.value.push(item)
      } else {
        products.value.splice(i, 1, item)
      }
    })
  }

  return {
    products,
    offset,
    limit,
    filters,
    lastRequest,
    product,

    getProducts,
    clearProducts,
  }
})
