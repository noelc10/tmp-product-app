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
  },
})

const emit = defineEmits(['update:isDialogVisible'])
const productStore = useProductStore()
const { product } = storeToRefs(productStore)

const loading = ref(false)

const updateModelValue = val => emit('update:isDialogVisible', val)

const onCancel = () => updateModelValue(false)
</script>

<template>
  <v-dialog
    persistent
    max-width="500"
    :model-value="props.isDialogVisible"
    @update:model-value="updateModelValue"
  >
    <v-card class="pa-4">
      <v-card-title class="px-0">
        <v-container fluid fill-height class="pa-0">
          <v-row align="center">
            <v-col>
              Product Details
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
        <v-carousel
          v-if="product.images.length"
          height="400"
          cycle
          hide-delimiters
          hide-delimiter-background
          :show-arrows="product.images.length > 1 ? 'hover': false"
        >
          <v-carousel-item
            v-for="(item, i) in product.images"
            :key="i"
            :src="item"
            cover
          ></v-carousel-item>
        </v-carousel>
        <v-img
          v-else
          height="400"
          src="https://i.imgur.com/sUFH1Aq.png"
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
          <div class="mt-4 text-body-2">
            {{ product?.description }}
          </div>
        </v-card-text>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
