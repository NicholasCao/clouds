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
    console.error(err.response)
    let { msg } = err.response
    if (msg) {
      message.error(`Error: ${msg}.`, 5)
    } else {
      message.error('Unknown error.')
    }

    throw err
  }
)

export default axios
