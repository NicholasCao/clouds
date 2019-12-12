import Axios from 'axios'
import { message } from 'antd'

const axios = Axios.create({
  baseURL: '/api'
})

axios.interceptors.response.use(
  // success
  response => {
    // do sth
    return response
  },

  // failed
  err => {
    console.error(err.response.data)
    let { msg } = err.response.data
    if (msg) {
      message.error(`${msg}.`, 5)
    } else {
      message.error('unknown error.', 5)
    }

    throw err
  }
)

export default axios
