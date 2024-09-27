<template>
  <v-dialog
    v-model="confirmDialogStore.open"
    :width="confirmDialogStore.options.width"
    @click:outside="confirmDialogStore.cancel()"
  >
    <v-card>
      <v-card-title>
        {{ confirmDialogStore.options.title }}
      </v-card-title>

      <v-card-text>
        {{ confirmDialogStore.options.message }}
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer />

        <v-btn
          class="px-4"
          :color="confirmDialogStore.options.cancelColor"
          @click="confirmDialogStore.cancel()"
        >
          {{ confirmDialogStore.options.cancelText }}
        </v-btn>

        <v-btn
          class="px-4"
          :color="confirmDialogStore.options.color"
          @click="confirmDialogStore.confirm()"
        >
          {{ confirmDialogStore.options.confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { useConfirmDialogStore } from '@/stores/dialog/confirmDialogStore'

const confirmDialogStore = useConfirmDialogStore()
</script>
