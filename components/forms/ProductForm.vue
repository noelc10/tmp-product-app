<script setup>
import { useSnackbarStore } from '@/stores/snackbar/snackbarStore'
import { useProductStore } from '@/stores/productStore'
import { useCategoryStore } from '@/stores/categoryStore'
import { VForm } from 'vuetify/components/VForm'
import { storeToRefs } from 'pinia'
import { useField, useFieldArray, useForm } from 'vee-validate'
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

const initialValues = ref({ images: [''] })

const { errors, meta, isSubmitting, isValidating, handleSubmit } = useForm({
  initialValues: initialValues.value,
  validationSchema: yup.object({
    title: yup.string().required('The title field is required.').min(2, 'The description field should have at least 2 characters.'),
    description: yup.string().required('The description field is required.').min(3, 'The description field should have at least 3 characters.'),
    price: yup.number().required('The price field is required.').positive('The price field should be greater than 0.').integer().typeError('The price field must be a number.'),
    categoryId: yup.string().required('The category ID field is required.'),
    images: yup.array().of(yup.string('The images field/s must be in a form of text.').url('The images field/s must be a valid URL.')).optional().ensure(),
  }),
})

const title = useField('title')
const description = useField('description')
const price = useField('price')
const categoryId = useField('categoryId')
const { remove, push, fields } = useFieldArray('images')

const categories = ref([
  {
    id: null,
    name: 'All',
  },
  ...categoryStore.categoriesData
])

const refProductVForm = ref()

const loading = ref(false)

const editMode = computed(() => {
  return product.value !== null
})

const submitDisabled = computed(() => isSubmitting.value || isValidating.value || !meta.value.valid)

watch(product,
  val => {
    if (val) {
      initialValues.value = { ...product.value }
      initialValues.value.categoryId = product.category.id
      delete initialValues.value.category
    }
  },
  {
    immediate: true,
  },
)

const updateModelValue = val => {
  emit('update:isDialogVisible', val)
}

const onSubmit = handleSubmit(async (values, { resetForm }) => {
  loading.value = true
  
  try {
    await productStore.submitProduct(values)

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

  loading.value = false
})

const onCancel = () => {
  updateModelValue(false)
}

onMounted(async () => {
  loading.value = true
  await categoryStore.getCategories()
  loading.value = false
})
</script>

<template>
  <v-dialog
    persistent
    max-width="500"
    :model-value="props.isDialogVisible"
    @update:model-value="updateModelValue"
  >
    <v-form
      ref="refProductVForm"
      :disabled="loading"
      @submit.prevent="onSubmit"
    >
      <v-card class="pa-4">
        <v-card-title>
          <v-container fluid fill-height class="px-0">
            <v-row align="center">
              <v-col>
                {{ editMode ? 'Update' : 'Add' }} Product
              </v-col>
              <v-spacer />
              <v-col class="text-right">
                <v-btn icon variant="plain" size="small" @click="onCancel">
                  <v-icon :icon="'mdi-close'" />
                    <v-tooltip
                      activator="parent"
                      location="top"
                      :disabled="loading"
                    >
                      Close
                    </v-tooltip>
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card-title>
  
        <v-card-text class="pa-0">
          <v-container fluid>
            <v-row>
              <v-col cols="12">
                <label>Title</label>
                <v-text-field
                  v-model="title.value.value"
                  required
                  label=""
                  variant="outlined"
                  :error-messages="title.errorMessage.value"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <label>Price</label>
                <v-text-field
                  v-model="price.value.value"
                  required
                  label=""
                  min="0"
                  variant="outlined"
                  :error-messages="price.errorMessage.value"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <label>Description</label>
                <v-textarea
                  v-model="description.value.value"
                  required
                  label=""
                  type="textarea"
                  variant="outlined"
                  :error-messages="description.errorMessage.value"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <label>Category</label>
                <v-select
                  v-model="categoryId.value.value"
                  :items="categoryStore.categoriesData"
                  item-title="name"
                  item-value="id"
                  label=""
                  placeholder="Select Category"
                  variant="outlined"
                  :error-messages="categoryId.errorMessage.value"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <label>Image URLs</label>
                <v-container
                  fluid
                  class="px-0"
                >
                  <v-row
                    v-for="(field, i) in fields"
                    :key="field.key"
                    justify="center"
                  >
                    <v-col cols="10">
                      <v-text-field
                        v-model="field.value"
                        required
                        label=""
                        type="url"
                        placeholder="https://image-url.com"
                        variant="outlined"
                        :error-messages="errors[`images[${i}]`]"
                      />
                    </v-col>
                    <v-col cols="2">
                      <v-btn
                        icon
                        color="error"
                        size="24"
                        class="mt-4"
                        @click.prevent="remove(i)"
                      >
                        <v-icon :icon="'mdi-close'" />
                        <v-tooltip
                          activator="parent"
                          location="top"
                          :disabled="loading"
                        >
                          Remove URL
                        </v-tooltip>
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-btn
                        icon
                        color="primary"
                        size="24"
                        @click.prevent="push('')"
                      >
                        <v-icon :icon="'mdi-plus'" />
                        <v-tooltip
                          activator="parent"
                          location="top"
                          :disabled="loading"
                        >
                          Add URL Field
                        </v-tooltip>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
  
        <v-card-actions class="mt-4">
          <v-spacer />
  
          <v-btn
            rounded
            type="submit"
            variant="tonal"
            class="px-8 float-right text-uppercase text-white bg-info"
            :disabled="submitDisabled"
          >
            {{ editMode ? 'Update' : 'Add' }}
          </v-btn>
          <v-btn
            rounded
            variant="tonal"
            class="px-8 float-right text-uppercase text-white bg-error"
            @click="onCancel"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>
