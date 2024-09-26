<script setup>
import { useProductStore } from '@/stores/productStore'
import { useSnackbarStore } from '@/stores/snackbar/snackbarStore'

const route = useRoute()

const { getProduct, clearProduct } = useProductStore()
const snackbarStore = useSnackbarStore()

const isFormDialogVisible = ref(false)

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

    if (val.name === 'index-product_id-edit') isFormDialogVisible.value = true
  },
  { immediate: true }
)

watch(
  isFormDialogVisible,
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
  <ProductForm v-model:is-dialog-visible="isFormDialogVisible" />
</template>
