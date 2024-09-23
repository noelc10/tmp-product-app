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

const { products, offset, limit, filters, lastRequest } = storeToRefs(productStore)
const categories = ref([
  {
    id: null,
    name: 'All',
  }
])

watch(
  route,
  async (val) => {
    if (val.name === 'index') {
      await categoryStore.getCategories()
      categories.value.push(...categoryStore.categoriesData)
    }
  }, {
    immediate: true,
  }
)

async function init ({ done } = {}) {
  if (lastRequest.value) {
    if (typeof done === 'function') done('empty')

    return
  }

  try {
    await productStore.getProducts(true)

    if (typeof done === 'function') done('ok')
  } catch (e) {
    snackbarStore.show({
      color: 'error',
      message: `Something went wrong while fetching product lists: : ${e?.statusText ?? e}`
    })

    if (typeof done === 'function') done('error')
  }
}

async function filterProductByCategory(id) {
  productStore.clearProducts()
  filters.value.categoryId = id
  await init()
}
</script>

<template>
  <v-infinite-scroll
    :height="products?.length ? '86vh' : 200"
    :items="products"
    @load="init"
  >
    <v-container fluid>
      <v-row justify="end">
        <v-col cols="12" sm="4" md="3">
          <VSelect
            v-model="filters.categoryId"
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
        <v-col
          v-for="product in products"
          :key="product.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card>
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
                  <v-list-item>
                    <v-list-item-title>
                      <v-icon left icon="mdi-pencil" /> Edit
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item>
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
      </v-row>
    </v-container>
    <template v-slot:empty>
      <v-container v-if="!products.length && lastRequest" fluid>
        <v-row>
          <v-col class="text-center">
            Product list empty!
          </v-col>
        </v-row>
      </v-container>
      <v-container v-if="!products.length && !lastRequest" fluid>
        <v-row>
          <v-col class="text-center">
            <v-progress-circular indeterminate />
          </v-col>
        </v-row>
      </v-container>
    </template>
  </v-infinite-scroll>

  <v-fab
    color="primary"
    icon="mdi-plus"
    location="bottom end"
    size="64"
    absolute
    app
    appear
    :to="'/add'"
    :style="'bottom: 8vh;'"
  ></v-fab>

  <NuxtPage />
</template>
