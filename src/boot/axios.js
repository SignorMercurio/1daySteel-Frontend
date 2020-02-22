import Vue from 'vue'
import axios from 'axios'

Vue.prototype.$axios = axios.create({
  baseURL: 'http://47.100.30.181:8091/',
  timeout: 4000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
})

Vue.prototype.$axios.interceptors.response.use(
  res => {
    // 1008：账号升级，已废弃
    if (res.data.code && res.data.code !== 0 /*&& res.data.code !== 1008*/) {
      //console.log(res)
      Vue.prototype.$q.notify({
        color: 'negative',
        icon: 'error',
        message: res.data.msg
      })
    } else return res
  },
  err => {
    Vue.prototype.$q.notify({
      color: 'negative',
      icon: 'error',
      message: '请求超时...'
    })
    Promise.reject(err)
  }
)
