<template>
  <q-layout view="hHh lpR fFf">
    <q-header reveal elevated class="bg-primary text-white">
      <q-toolbar>
        <q-avatar>
          <img src="statics/app-logo.jpg" />
        </q-avatar>
        <q-toolbar-title>一天钢铁</q-toolbar-title>
        <template v-if="new RegExp(/\/pages\/\d/).test($route.path)">
          <q-space></q-space>
          <q-btn
            v-if="!$store.getters.getUserInfo"
            flat
            icon="person"
            to="/auth/login"
            >登录</q-btn
          >
          <template v-else>
            {{ $store.getters.getUserInfo.username }}
            <q-btn class="q-ml-sm" round>
              <q-avatar>
                <img :src="logo" />
              </q-avatar>
              <q-menu
                fit
                transition-show="flip-right"
                transition-hide="flip-left"
              >
                <q-list style="min-width:140px">
                  <q-item clickable v-close-popup @click="logout">
                    <q-item-section avatar>
                      <q-icon color="primary" name="logout"></q-icon>
                    </q-item-section>
                    <q-item-section>注销</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </template>
        </template>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <transition
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
        appear
        duration="300"
      >
        <router-view />
      </transition>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  data() {
    return {
      logo: 'statics/app-logo.jpg'
    }
  },
  created() {
    let { getCompanyInfo } = this.$store.getters
    if (getCompanyInfo) {
      let { company_logo } = getCompanyInfo
      if (company_logo) this.logo = this.$head + company_logo
    }
  },
  methods: {
    logout() {
      this.$axios.post('signOut').then(() => {
        this.$success('注销', 'logout')
        this.$store.dispatch('Logout')
        setTimeout(() => {
          this.$router.push('/auth/login')
        }, 500)
      })
    }
  }
}
</script>
