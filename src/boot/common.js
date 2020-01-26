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

Vue.prototype.$head = 'http://47.100.30.181:8091/'

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
