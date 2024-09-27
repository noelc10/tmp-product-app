import { defineStore } from 'pinia'

export const useCategoryStore = defineStore('categoryStore', () => {
  const api = useAPI()
  const categories = ref([])

  const categoriesData = computed(() => categories.value)
  const getCategories = async () => {
    try {
    const data = await api.get('/categories')
    setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
      clearCategories()
  }
  }

  const clearCategories = () => {
    categories.value = []
  }

  const setCategories = (data) => {
    const categoryMap = new Map(categories.value.map(item => [item.id, item]))
    data.forEach(item => {
      categoryMap.set(item.id, item)
    })
    categories.value = Array.from(categoryMap.values())
  }
  return {
    categories,
    categoriesData,
    getCategories,
    clearCategories
  }
})
