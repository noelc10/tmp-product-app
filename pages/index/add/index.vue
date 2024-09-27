<script setup>
const route = useRoute()
const isFormDialogVisible = ref(false)

watch(
  () => route.name,
  (name) => {
    isFormDialogVisible.value = (name === 'index-add')
  },
  { immediate: true }
)

watch(
  isFormDialogVisible,
  (val) => {
    if (!val) navigateTo('/')
  }
)
</script>

<template>
  <ProductForm v-model:is-dialog-visible="isFormDialogVisible" />
</template>
