import axios from 'axios'

const api = axios.create({
  // Point directly to your live production API
  baseURL: 'https://blog-website-3-3ag4.onrender.com', 
});

// Attach JWT token automatically to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('blog_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Handle 401 globally — token expired or invalid
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('blog_token')
      localStorage.removeItem('blog_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ─── Auth ────────────────────────────────────────────────
export const registerUser = (data) => api.post('/register', data)
export const loginUser = (data) => api.post('/login', data)
export const logoutUser = () => api.post('/logout')
export const getProfile = () => api.get('/profile')

// ─── Blog ────────────────────────────────────────────────
export const getAllBlogs = () => api.get('/blog/getall')
export const getMyBlogs = () => api.get('/blog/getmyblog')
export const getBlogById = (id) => api.get(`/blog/getbyid/${id}`)
export const createBlog = (data) => api.post('/blog/create', data)
export const updateBlog = (id, data) => api.patch(`/blog/edit/${id}`, data)
export const deleteBlog = (id) => api.delete(`/blog/delete/${id}`)

export default api
