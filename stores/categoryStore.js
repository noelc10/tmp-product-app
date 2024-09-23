import { defineStore } from 'pinia'

export const useCategoryStore = defineStore('categoryStore', () => {
  const api = useAPI()

  const categories = ref([])

  const categoriesData = computed(() => {
    return categories.value
  })

  const getCategories = async () => {
    clearCategories()
    
    const data = await api.get('/categories')
    
    setCategories(data)
  }

  const clearCategories = () => {
    categories.value = []
  }

  const setCategories = (data) => {
    data.forEach(item => {
      const i = _findIndex(categories.value, { id: item.id })

      if (i < 0) {
        categories.value.push(item)
      } else {
        categories.value.splice(i, 1, item)
      }
    })
  }

  return {
    categories,

    categoriesData,

    getCategories,
    clearCategories
  }
})
