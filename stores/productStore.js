import { defineStore } from "pinia"

export const useProductStore = defineStore('productStore', () => {
  const api = useAPI()
  
  const products = ref([])
  const offset = ref(0)
  const limit = ref(10)
  const filters = ref({
    categoryId: null
  })
  const lastRequest = ref(false)

  const getProducts = async (paginate = true) => {
    let query = ``
    
    if (lastRequest.value) {
      return
    }

    if (!paginate) {
      clearProducts()
    }

    if (paginate) {
      query = query + `offset=${offset.value}&limit=${limit.value}`

      offset.value = products.value.length > 0 ? offset.value + 10 : 0
    }

    if (filters.value.categoryId) {
      query = query + `${filters.categoryId ? (!paginate ? '?' : '&') + 'categoryId=' + filters.categoryId : ''}`
    }

    const data = await api.get(`/products${query ? '?' + query : ''}`)

    products.value.push(...data)

    if (!data.length || !paginate) {
      lastRequest.value = true
    }
  }

  const clearProducts = () => {
    products.value = []
  }

  return {
    products,
    offset,
    limit,
    lastRequest,

    getProducts,
    clearProducts,
  }
})
