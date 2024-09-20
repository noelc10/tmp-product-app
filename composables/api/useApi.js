export const useAPI = () => {
  const config = useRuntimeConfig()

  const get = (url, params) => {
    return useFetch(() => url, {
      baseURL: config.public.apiBase,
      method: 'GET',
      ...params
    })
  }

  const post = (url, payload) => {
    return useFetch(() => url, {
      baseURL: config.public.apiBase,
      method: 'POST',
      body: payload,
      headers: {
        'Content-type': 'application/json',
      }
    })
  }

  const put = (url, payload) => {
    return useFetch(() => url, {
      baseURL: config.public.apiBase,
      method: 'PUT',
      body: payload,
      headers: {
        'Content-type': 'application/json',
      }
    })
  }

  const del = (url, params) => {
    return useFetch(() => url, {
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
