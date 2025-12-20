import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios'

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:59179/api/',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - clear token and redirect to login
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Common API methods
export const api = {
  // GET request
  get: <T = any>(url: string, config?: AxiosRequestConfig) => {
    return apiClient.get<T>(url, config)
  },

  // POST request
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
    return apiClient.post<T>(url, data, config)
  },

  // PUT request (full update)
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
    return apiClient.put<T>(url, data, config)
  },

  // PATCH request (partial update)
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
    return apiClient.patch<T>(url, data, config)
  },

  // DELETE request
  delete: <T = any>(url: string, config?: AxiosRequestConfig) => {
    return apiClient.delete<T>(url, config)
  }
}

export default apiClient

