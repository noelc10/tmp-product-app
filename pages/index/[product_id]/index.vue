<script setup>
import { useProductStore } from '@/stores/productStore'
import { useSnackbarStore } from '@/stores/snackbar/snackbarStore'

const route = useRoute()
const { getProduct, clearProduct } = useProductStore()
const snackbarStore = useSnackbarStore()
const isDetailsDialogVisible = ref(false)

const fetchProduct = async (productId) => {
  try {
    await getProduct(productId)
    } catch (e) {
      snackbarStore.show({
        color: 'error',
        message: 'Something went wrong while fetching product!',
      })
      navigateTo('/')
    return false
    }
  return true
}

watch(
  () => route.params.product_id,
  async (productId) => {
    if (await fetchProduct(productId) && route.name === 'index-product_id') {
      isDetailsDialogVisible.value = true
    }
  },
  { immediate: true }
)

watch(
  isDetailsDialogVisible,
  (visible) => {
    if (!visible) {
      setTimeout(() => {
        clearProduct()
        navigateTo('/')
      }, 500)
    }
  }
)
</script>

<template>
  <ProductDetails v-model:is-dialog-visible="isDetailsDialogVisible" />

  <NuxtPage />
</template>
