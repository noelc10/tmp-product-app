<script setup>
import { useProductStore } from '@/stores/productStore'
import { useSnackbarStore } from '@/stores/snackbar/snackbarStore'

const route = useRoute()

const { getProduct, clearProduct } = useProductStore()
const snackbarStore = useSnackbarStore()

const isFormDialogVisible = ref(false)

const handleRouteChange = async (val) => {
  try {
      await getProduct(val.params.product_id)
    if (val.name === 'index-product_id-edit') isFormDialogVisible.value = true
  } catch (e) {
    snackbarStore.show({
      color: 'error',
      message: 'Something went wrong while fetching product!',
    })
        navigateTo('/')
    }
  }

const handleDialogVisibilityChange = async (val) => {
  if (!val) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    clearProduct()
    navigateTo('/')
  }
}

watch(route, handleRouteChange, { immediate: true })
watch(isFormDialogVisible, handleDialogVisibilityChange)
</script>

<template>
  <ProductForm v-model:is-dialog-visible="isFormDialogVisible" />
</template>
