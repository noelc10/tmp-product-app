import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConfirmDialogStore = defineStore('confirmDialogStore', () => {
  const open = ref(false)
  const promiseResolved = ref(null)
  const options = ref({
    title: '',
    message: '',
    color: 'error',
    cancelColor: '',
    cancelText: 'Cancel',
    confirmText: 'Confirm',
    cancelTypeText: true,
    confirmTypeText: false,
    width: '500'
  })

  function show(message, opts = {}) {
    promiseResolved.value = null
    options.value = {
      ...options.value,
      ...opts,
      message
    }
    open.value = true

    return new Promise((resolve) => {
      promiseResolved.value = resolve
    })
  }

  function cancel() {
    promiseResolved.value(false)
    open.value = false
    reset()
  }

  function confirm() {
    promiseResolved.value(true)
    open.value = false
    reset()
  }

  function reset() {
    options.value = {
      color: 'error',
      cancelText: 'Cancel',
      confirmText: 'Confirm',
      width: '500'
    }
  }

  return {
    open,
    options,
    show,
    cancel,
    confirm,
    reset
  }
})
