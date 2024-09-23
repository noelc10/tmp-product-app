import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSnackbarStore = defineStore('snackbarStore', () => {
  const showSnackbar = ref(false)
  const message = ref('')
  const color = ref('success')
  const icon = ref('mdi-check')
  const timer = ref(5000)

  function show(data) {
    message.value = data.message || ''
    color.value = data.color || 'success'
    timer.value = data.timer || 5000
    icon.value = data.color === 'success'
      ? 'mdi-check'
      : data.color === 'error'
        ? 'mdi-alert-circle'
        : data.color === 'warning'
          ? 'mdi-alert'
          : data.color === 'info' ? 'info' : data.icon || 'mdi-check'
    showSnackbar.value = true
  }

  function reset() {
    showSnackbar.value = false
    message.value = ''
    color.value = 'success'
    icon.value = 'mdi-check'
    timer.value = 3000
  }

  return {
    showSnackbar,
    message,
    color,
    icon,
    timer,
    show,
    reset
  }
})
