<script setup>
import { useSnackbarStore } from '@/stores/snackbar/snackbarStore'
import { useProductStore } from '@/stores/productStore'
import { useCategoryStore } from '@/stores/categoryStore'
import { VForm } from 'vuetify/components/VForm'
import { storeToRefs } from 'pinia'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  }
})

const emit = defineEmits([
  'update:isDialogVisible',
])

const productStore = useProductStore()
const categoryStore = useCategoryStore()
const snackbarStore = useSnackbarStore()

const { product } = storeToRefs(productStore)

const { defineField, errors, meta, isSubmitting, isValidating, handleSubmit } = useForm({
  validationSchema: yup.object({
    title: yup.string().required('The title field is required.').min(2, 'The description field should have at least 2 characters.').default(null),
    description: yup.string().required('The description field is required.').min(3, 'The description field should have at least 3 characters.').default(null),
    price: yup.number().required('The price field is required.').min(0, 'The price field should have at least value of 0.').positive().default(null),
    categoryId: yup.string().required('The category ID field is required.').default(null),
    images: yup.array().of(yup.string().url()).optional().default(['']),
  }),
})

const title = useField('title')
const description = useField('description')
const price = useField('price')
const categoryId = useField('categoryId')
const images = useField('images')

const categories = ref([
  {
    id: null,
    name: 'All',
  },
  ...categoryStore.categoriesData
])

const refProductVForm = ref()

// const formData = ref({
//   title: null,
//   price: null,
//   description: null,
//   categoryId: null,
//   images: []
// })
// const formData = ref({
//   title: useField('title'),
//   price: useField('price'),
//   description: useField('description'),
//   categoryId: useField('categoryId'),
//   images: useField('images')
// })

const loading = ref(false)

const editMode = computed(() => {
  return product.value
})

watch(product,
  val => {
    if (val) {
      formData.value = { ...product.value }
      formData.value.categoryId = product.category.id
      delete formData.value.category
    }
  },
  {
    immediate: true,
  },
)

const updateModelValue = val => {
  emit('update:isDialogVisible', val)

  clearForm()
}

const onSubmit = () => {
  refProductVForm.value?.validate().then(async ({ valid: isValid, resetForm }) => {
    if (isValid) {
      try {
        loading.value = true

        await productStore.submitProduct(formData.value)

        snackbarStore.show({
          color: 'success',
          message: `Successfully ${editMode.value ? 'updating' : 'adding'} product.`,
        })

        resetForm()

        updateModelValue(false)
      } catch (e) {
        if ((e.status >= 400 && e.status >= 499) || e?.data?.errors) {
          snackbarStore.show({
            color: 'error',
            message: `Validation error while ${editMode.value ? 'updating' : 'adding'} product. Kindly please check the form data for validated valued before submitting.`,
          })
        }
        
        snackbarStore.show({
          color: 'error',
          message: `Something went wrong while ${editMode.value ? 'updating' : 'adding'} product: ${e?.statusText + ': ' + e?.data?.message ?? e?.statusText}`,
        })
      }
    }
  })

  loading.value = false
}

const onCancel = () => {
  updateModelValue(false)
}

const clearForm = () => {
  // formData.value = {
  //   title: null,
  //   price: null,
  //   description: null,
  //   categoryId: null,
  //   images: []
  // }
}

onMounted(async () => {
  loading.value = true
  await categoryStore.getCategories()
  loading.value = false
})
</script>

<template>
  <VDialog
    persistent
    max-width="500"
    :model-value="props.isDialogVisible"
    @update:model-value="updateModelValue"
  >
    <VForm
      ref="refProductVForm"
      :disabled="loading"
      @submit.prevent="onSubmit"
    >
      <VCard class="pa-4">
        <VCardTitle>
          <VContainer fluid fill-height class="px-0">
            <VRow align="center">
              <VCol>
                {{ editMode ? 'Update' : 'Add' }} Product
              </VCol>
              <VSpacer />
              <VCol class="text-right">
                <VBtn icon variant="plain" size="small" @click="onCancel">
                  <VIcon :icon="'mdi-close'" />
                    <VTooltip
                      activator="parent"
                      location="top"
                      :disabled="loading"
                    >
                      Close
                    </VTooltip>
                </VBtn>
              </VCol>
            </VRow>
          </VContainer>
        </VCardTitle>
  
        <VCardText class="pa-0">
          <VContainer fluid>
            <VRow>
              <VCol cols="12">
                <label>Title</label>
                <VTextField
                  v-model="title.value.value"
                  required
                  label=""
                  variant="outlined"
                  :error-messages="title.errorMessage.value"
                />
              </VCol>
            </VRow>
            <VRow>
              <VCol cols="12">
                <label>Price</label>
                <VTextField
                  v-model="price.value.value"
                  required
                  label=""
                  type="number"
                  min="0"
                  variant="outlined"
                  :error-messages="price.errorMessage.value"
                />
              </VCol>
            </VRow>
            <VRow>
              <VCol cols="12">
                <label>Description</label>
                <VTextarea
                  v-model="description.value.value"
                  required
                  label=""
                  type="textarea"
                  variant="outlined"
                  :error-messages="description.errorMessage.value"
                />
              </VCol>
            </VRow>
            <VRow>
              <VCol cols="12">
                <label>Category</label>
                <VSelect
                  v-model="categoryId.value.value"
                  :items="categoryStore.categoriesData"
                  item-title="name"
                  item-value="id"
                  label=""
                  placeholder="Select Category"
                  variant="outlined"
                  :error-messages="categoryId.errorMessage.value"
                />
              </VCol>
            </VRow>
            <VRow>
              <VCol cols="12">
                <label>Image URL</label>
                <VTextField
                  v-model="images.value.value"
                  required
                  label=""
                  placeholder="https://image-url.com"
                  variant="outlined"
                />
              </VCol>
            </VRow>
          </VContainer>
        </VCardText>
  
        <VCardActions class="mt-4">
          <VSpacer />
  
          <VBtn
            rounded
            type="submit"
            variant="tonal"
            class="px-8 float-right text-uppercase text-white bg-info"
          >
            {{ editMode ? 'Update' : 'Add' }}
          </VBtn>
          <VBtn
            rounded
            variant="tonal"
            class="px-8 float-right text-uppercase text-white bg-error"
            @click="onCancel"
          >
            Cancel
          </VBtn>
        </VCardActions>
      </VCard>
    </VForm>
  </VDialog>
</template>
