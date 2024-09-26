<script setup>
import { useSnackbarStore } from '@/stores/snackbar/snackbarStore'
import { storeToRefs } from 'pinia'

const snackbarStore = useSnackbarStore()
const { showSnackbar, color, timer, location, icon, message } = storeToRefs(snackbarStore)
</script>

<template>
  <v-snackbar
    v-model="showSnackbar"
    :color="color"
    :timeout="timer"
    :location="location"
    rounded
    multi-line
    close-on-back
    content-class="d-flex"
    z-index="2500"
  >
    <v-icon left class="d-inline-flex" :icon="icon" />
    
    {{ message }}

    <template v-slot:actions>
      <v-btn
        icon
        variant="plain"
        size="small"
        @click="showSnackbar = false"
      >
        <v-icon icon="mdi-close" />
      </v-btn>
    </template>
  </v-snackbar>
</template>
