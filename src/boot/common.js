import Vue from 'vue'
import { copyToClipboard, openURL } from 'quasar'

Vue.prototype.$open = function(url) {
  openURL(url)
}

Vue.prototype.$copy = function(url) {
  copyToClipboard(url).then(() => {
    this.$q.notify({
      color: 'positive',
      icon: 'assignment_turned_in',
      message: '复制成功！'
    })
  })
}

Vue.prototype.$head = 'http://139.196.176.11:8091/'

Vue.prototype.$base_url = 'http://139.196.176.11:8092/#/'

Vue.prototype.$success = function(ops, icon = 'check_circle') {
  this.$q.notify({
    color: 'positive',
    icon: icon,
    message: `${ops}成功！`
  })
}

Vue.prototype.$fail = function(msg) {
  this.$q.notify({
    color: 'negative',
    icon: 'error',
    message: msg
  })
}

Vue.prototype.$getList = function(props, url, table) {
  table.loading = true
  let { page, rowsPerPage } = props.pagination
  this.$axios.get(url + `pageNum=${page}&pageSize=${rowsPerPage}`).then(res => {
    if (res) {
      let { items, pageNum, pageSize, total } = res.data.data
      table.data = items
      table.pagination = {
        page: pageNum,
        rowsPerPage: pageSize,
        rowsNumber: total
      }
      table.loading = false
    }
  })
}

Vue.prototype.$formatTime = val => {
  return (val ? new Date(val) : new Date()).toLocaleString('chinese', {
    hour12: false
  })
}

Vue.prototype.$remind = function(id) {
  this.$axios.post(`message/content?id=${id}`).then(res => {
    if (res) {
      this.$success('提醒更新')
    }
  })
}

Vue.prototype.$ifExpire = function(update_time, status = 0) {
  if (status === 1) return false

  // 可能有效，也可能失效
  let expire_time = new Date(update_time).getTime()
  return expire_time < Date.now()
}
