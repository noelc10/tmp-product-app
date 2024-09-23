<template>
  <v-snackbar
    v-model="snackbarStore.showSnackbar"
    :color="snackbarStore.color"
    :timeout="snackbarStore.timer"
    rounded
    multi-line
    close-on-back
    content-class="d-flex"
    z-index="2500"
  >
    <v-icon left class="d-inline-flex" :icon="snackbarStore.icon" />
    
    {{ snackbarStore.message }}

    <template v-slot:actions>
      <v-btn
        icon
        variant="plain"
        size="small"
        @click="snackbarStore.showSnackbar = false"
      >
        <v-icon icon="mdi-close" />
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { useSnackbarStore } from '@/stores/snackbar/snackbarStore'

const snackbarStore = useSnackbarStore()
</script>
