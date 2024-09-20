<script setup>
const api = useAPI()

const { data: products } = await api.get('/products')
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col
        v-for="product in products"
        :key="product.id"
        cols="12"
        md="4"
      >
        <v-card>
          <v-img
            height="200px"
            :src="product.images[0]"
            cover
          ></v-img>

          <v-card-title>
            {{ product.title }}
          </v-card-title>

          <v-card-subtitle>
            ${{ product.price }}
          </v-card-subtitle>

          <v-card-actions>
            <v-spacer />
            <v-btn
              color="orange-lighten-2"
              text="details"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
