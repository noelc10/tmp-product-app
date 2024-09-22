<script setup>
import { storeToRefs } from 'pinia'
import { useProductStore } from '@/stores/productStore'

const route = useRoute()

const productStore = useProductStore()
const { products, offset, limit, filters, lastRequest } = storeToRefs(productStore)
const loading = ref(false)

watch(
  route,
  async (val) => {
    if (val.name === 'index') {
      await init(true)
    }
  }
)

async function init ({ done }) {
  if (lastRequest.value) {
    done('empty')

    return
  }
  
  loading.value = true

  try {
    await productStore.getProducts(true)
  } catch (e) {
    console.log(e)
  }

  loading.value = false

  done('ok')
}
</script>

<template>
  <v-infinite-scroll :height="products.length ? '86vh' : 100" :items="products" :onLoad="init">
    <v-container fluid>
      <v-row>
        <v-col
          v-for="product in products"
          :key="product.id"
          cols="12"
          md="4"
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
              :src="product.images[0]"
              cover
            ></v-img>

            <v-card-title>
              {{ product.title }}
            </v-card-title>

            <v-card-subtitle>
              {{ product.category.name }}
            </v-card-subtitle>

            <v-card-text>
              <div class="font-weight-bold text-h5">
                ${{ product.price }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <template v-slot:empty>
      <v-container v-if="!products.length" fluid>
        <v-row>
          <v-col class="text-center">
            Product list empty!
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
    :style="'bottom: 8vh;'"
  ></v-fab>
</template>
