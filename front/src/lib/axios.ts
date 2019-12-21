import Axios from 'axios'
import { message } from 'antd'

const axios = Axios.create({
  baseURL: '/api'
})

axios.interceptors.request.use(config => {
  if (localStorage) {
    config.headers.Authorization = localStorage.getItem("clouds-token")
  }
  return config
})

axios.interceptors.response.use(
  // success
  response => {
    // do sth
    return response
  },

  // failed
  err => {
    let { msg } = err.response.data
    if (msg && msg === 'check token failed') {
      throw err
    }

    if (msg) {
      message.error(`${msg}.`, 5)
    } else {
      message.error(err.response.data ? `request failed: ${err.response.data}` : 'unknown error.', 5)
    }

    throw err
  }
)

export default axios
