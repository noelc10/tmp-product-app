<script setup>
import { storeToRefs } from 'pinia'
import { useProductStore } from '@/stores/productStore'
import { useCategoryStore } from '@/stores/categoryStore'
import { useSnackbarStore } from '@/stores/snackbar/snackbarStore'
import { useConfirmDialogStore } from '@/stores/dialog/confirmDialogStore'

const route = useRoute()

const productStore = useProductStore()
const categoryStore = useCategoryStore()
const snackbarStore = useSnackbarStore()
const confirmDialogStore = useConfirmDialogStore()

const { products, offset, limit, filters, endRequest } = storeToRefs(productStore)
const { getProducts, clearProducts, deleteProduct } = useProductStore()
const categories = ref([
  {
    id: null,
    name: 'All',
  }
])
const loading = ref(true)

watch(
  route,
  async (val) => {
    if (val.name === 'index') {
      clearProducts()
      await init('ok')
      
      await categoryStore.getCategories()
      categories.value = [
        {
          id: null,
          name: 'All',
        },
        ...categoryStore.categoriesData
      ]
    }
  }, {
    immediate: true,
  }
)

async function init ({ done } = {}) {
  loading.value = true
  if (endRequest.value) {
    if (typeof done === 'function') done('ok')

    return
  }

  try {
    await getProducts(true)
    
    if (typeof done === 'function') done('ok')
  } catch (e) {
    snackbarStore.show({
      color: 'error',
      message: `Something went wrong while fetching product lists: : ${e?.statusText ?? e}`
    })
    
    if (typeof done === 'function') done('error')
  }

  loading.value = false
}

async function filterProductByCategory(id = null) {
  clearProducts()
  filters.value.categoryId = id
  await init('ok')
}

async function removeProduct(id) {
  const confirm = await confirmDialogStore.show('Are you sure you want to delete this product?', {
    title: 'Removing Product',
  })

  if (confirm) {
    await deleteProduct(id)
      .then(async () => {
        snackbarStore.show({
          message: 'Successfully delete selected product!',
        })
        
        clearProducts()
        await init('ok')
      })
      .catch(() => {
        snackbarStore.show({
          color: 'error',
          message: 'Something went wrong while deleting selected product!',
        })
      })
  }
}
</script>

<template>
  <v-infinite-scroll
    class="overflow-x-hidden"
    width="auto"
    :height="products?.length ? '82dvh' : 200"
    :items="products"
    @load="init"
  >
    <v-container fluid>
      <v-row justify="end">
        <v-col
          cols="12"
          sm="4"
          md="3"
          class="mb-4"
        >
          <VSelect
            v-model="filters.categoryId"
            hide-details
            variant="outlined"
            item-title="name"
            item-value="id"
            placeholder="Filter products by category..."
            :items="categories"
            @update:modelValue="filterProductByCategory"
          />
        </v-col>
      </v-row>
      
      <v-row>
        <v-fade-transition
          v-for="product in products"
          :key="product.id"
        >
          <v-col
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card
              :to="`/${product.id}`"
            >
              <v-btn
                icon
                color="green"
                class="mb-4"
                position="absolute"
                location="top right"
                size="36"
                :style="'top: 8px; right: 8px; z-index: 1'"
              >
                <v-icon icon="mdi-dots-vertical" />

                <v-menu
                  location="bottom"
                  transition="scale-transition"
                  activator="parent"
                >
                  <v-list>
                    <v-list-item
                      @click.prevent="navigateTo(`/${product.id}/edit`)"
                    >
                      <v-list-item-title>
                        <v-icon left icon="mdi-pencil" /> Edit
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      @click.prevent="removeProduct(product.id)"
                    >
                      <v-list-item-title>
                        <v-icon left icon="mdi-delete" /> Delete
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-btn>

              <v-img
                height="200px"
                :src="product?.images[0] ?? 'https://i.imgur.com/sUFH1Aq.png'"
                cover
              ></v-img>

              <v-card-title>
                {{ product?.title }}
              </v-card-title>

              <v-card-subtitle>
                {{ product?.category?.name }}
              </v-card-subtitle>

              <v-card-text>
                <div class="font-weight-bold text-h5">
                  ${{ product?.price }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-fade-transition>
      </v-row>
    </v-container>
    <template v-slot:empty>
      <v-container fluid v-if="!products.length && endRequest">
        <v-row>
          <v-col class="text-center">
            Product list empty!
          </v-col>
        </v-row>
      </v-container>
      <v-container fluid v-if="!products.length && !endRequest">
        <v-row>
          <v-col class="text-center">
            <v-progress-circular indeterminate />
          </v-col>
        </v-row>
      </v-container>
    </template>
    <template v-slot:loading>
      <v-container fluid v-if="!endRequest">
        <v-row v-if="!endRequest">
          <v-col class="text-center">
            <v-progress-circular indeterminate />
          </v-col>
        </v-row>
      </v-container>
    </template>
  </v-infinite-scroll>

  <v-fab
    color="green"
    location="bottom end"
    size="64"
    absolute
    app
    appear
    icon
    :to="'/add'"
    :style="'bottom: 10dvh;'"
  >
    <v-icon :icon="'mdi-plus'" />
    <v-tooltip
      activator="parent"
      location="top"
      :disabled="loading"
    >
      Add Product
    </v-tooltip>
  </v-fab>

  <NuxtPage />
</template>
