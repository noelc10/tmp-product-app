<script setup>
const route = useRoute()

const isFormDialogVisible = ref(false)

watch(
  route,
  (val) => {
    if (val.name === 'index-add') isFormDialogVisible.value = true
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
