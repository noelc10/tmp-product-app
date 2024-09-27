export const useAPI = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase

  const request = (url, options) => {
    return $fetch(url, { baseURL, ...options })
  }

  const get = (url, params) => request(url, { method: 'GET', ...params })
  const post = (url, payload) => request(url, {
      method: 'POST',
      body: payload,
    headers: { 'Content-type': 'application/json' }
  })

  const put = (url, payload) => request(url, {
      method: 'PUT',
      body: payload,
    headers: { 'Content-type': 'application/json' }
  })

  const del = (url, params) => request(url, { method: 'DELETE', ...params })

  return { get, post, put, del }
};
