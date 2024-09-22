export const useAPI = () => {
  const config = useRuntimeConfig()

  const get = (url, params) => {
    return $fetch(url, {
      baseURL: config.public.apiBase,
      method: 'GET',
      ...params
    })
  }

  const post = (url, payload) => {
    return $fetch(url, {
      baseURL: config.public.apiBase,
      method: 'POST',
      body: payload,
      headers: {
        'Content-type': 'application/json',
      }
    })
  }

  const put = (url, payload) => {
    return $fetch(url, {
      baseURL: config.public.apiBase,
      method: 'PUT',
      body: payload,
      headers: {
        'Content-type': 'application/json',
      }
    })
  }

  const del = (url, params) => {
    return $fetch(url, {
      baseURL: config.public.apiBase,
      method: 'DELETE',
      ...params
    })
  }

  return {
    get,
    post,
    put,
    del
  }
}
