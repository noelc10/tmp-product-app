<script setup>
import { useProductStore } from '@/stores/productStore'
import { useSnackbarStore } from '@/stores/snackbar/snackbarStore'

const route = useRoute()

const { getProduct, clearProduct } = useProductStore()
const snackbarStore = useSnackbarStore()

const isDetailsDialogVisible = ref(false)

watch(
  route,
  async (val) => {
    try {
      await getProduct(val.params.product_id)
    } catch (e) {
      snackbarStore.show({
        color: 'error',
        message: 'Something went wrong while fetching product!',
      })

      navigateTo('/')

      return
    }

    if (val.name === 'index-product_id') isDetailsDialogVisible.value = true
  },
  { immediate: true }
)

watch(
  isDetailsDialogVisible,
  async (val) => {
    if (!val) {
      await setTimeout(() => {
        clearProduct()

        navigateTo('/')
      }, 500);
    }
  }
)
</script>

<template>
  <ProductDetails v-model:is-dialog-visible="isDetailsDialogVisible" />

  <NuxtPage />
</template>
