import axios from 'axios'
import Auth from './Auth'

const auth = new Auth()
const instance = axios.create({
  headers: {
    Authorization: `Bearer ${auth.getAccessToken()}`
  }
})

instance.interceptors.response.use(null, function (error) {
  if (error.response.status === 401) {
    window.location = '/login'
  }
  return Promise.reject(error)
})
export default instance
