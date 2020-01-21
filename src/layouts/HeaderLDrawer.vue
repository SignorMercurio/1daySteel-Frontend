<template>
  <q-layout view="hHh LpR fFf">
    <q-header reveal elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn
          dense
          flat
          round
          icon="menu"
          @click="left = !left"
          class="q-mr-sm"
        />
        <q-avatar>
          <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg" />
        </q-avatar>
        <q-toolbar-title>一天钢铁</q-toolbar-title>
        <q-space></q-space>
        <q-input
          dark
          dense
          standout
          placeholder="请输入搜索关键字..."
          v-model="searchText"
          debounce="1000"
          class="q-ml-md q-mr-md"
        >
          <template v-slot:append>
            <q-icon v-if="searchText === ''" name="search" />
            <q-icon
              v-else
              name="clear"
              class="cursor-pointer"
              @click="searchText = ''"
            />
          </template>
        </q-input>
        <q-btn v-if="!$store.state.userInfo" flat icon="person" to="auth/login"
          >登录</q-btn
        >
        <template v-else>
          {{ $store.state.userInfo.username }}
          <q-btn class="q-ml-sm" round>
            <q-avatar>
              <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg" />
            </q-avatar>
            <q-menu
              fit
              transition-show="flip-right"
              transition-hide="flip-left"
            >
              <q-list style="min-width:140px">
                <q-item clickable v-close-popup>
                  <q-item-section avatar>
                    <q-icon color="primary" name="account_circle"></q-icon>
                  </q-item-section>
                  <q-item-section>账户</q-item-section>
                </q-item>
                <q-item clickable v-close-popup>
                  <q-item-section avatar>
                    <q-icon color="primary" name="settings"></q-icon>
                  </q-item-section>
                  <q-item-section>设置</q-item-section>
                </q-item>
                <q-separator></q-separator>
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
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      v-model="left"
      side="left"
      elevated
      mini-to-overlay
      :mini="miniState"
      @mouseover="miniState = false"
      @mouseout="miniState = true"
    >
      <q-scroll-area class="fit">
        <q-list v-for="(menuItem, index) in menuList" :key="index">
          <q-item
            clickable
            :active="link === menuItem.route"
            v-ripple
            @click="
              link = menuItem.route
              $router.push(menuItem.route)
            "
          >
            <q-item-section avatar>
              <q-icon :name="menuItem.icon" />
            </q-item-section>
            <q-item-section>{{ menuItem.label }}</q-item-section>
          </q-item>

          <q-separator v-if="menuItem.separator" />
        </q-list>
      </q-scroll-area>
    </q-drawer>

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
      left: false,
      miniState: true,
      menuList: [
        {
          icon: 'home',
          label: '首页',
          route: '/'
        },
        {
          icon: 'format_list_numbered',
          label: '最新消息',
          route: '/latest'
        },
        {
          icon: 'favorite',
          label: '我的收藏',
          route: '/fav',
          separator: true
        },
        {
          icon: 'person',
          label: '个人中心',
          route: '/me'
        }
      ],
      link: this.$route.path,
      searchText: ''
    }
  },
  watch: {
    searchText: function(newVal) {
      if (newVal === '') {
        if (this.$route.path === '/search') {
          this.$router.back(-1)
        }
      } else {
        if (this.$route.path !== '/search') {
          this.$router.push('/search')
        }
        this.$store.commit('setKeyword', this.searchText)
      }
    }
  },
  created: function() {
    console.log(this.$route.path)
    if (this.$q.sessionStorage.has('userInfo')) {
      let info = this.$q.sessionStorage.getItem('userInfo')
      this.$store.dispatch('Login', info)
      this.$store.dispatch('getFavList')

      if (info.type !== 0) {
        this.menuList.push(
          {
            icon: 'update',
            label: '更新报价',
            route: '/update'
          },
          {
            icon: 'info',
            label: '基础信息',
            route: '/info'
          },
          {
            icon: 'how_to_reg',
            label: '会员中心',
            route: '/member'
          }
        )
      }
    }
  },
  methods: {
    logout() {
      this.$axios.post('signOut').then(() => {
        this.$q.notify({
          color: 'positive',
          icon: 'logout',
          message: '注销成功！'
        })
        this.$store.dispatch('Logout')
        setTimeout(() => {
          this.$router.push('/auth/login')
        }, 500)
      })
    }
  }
}
</script>
