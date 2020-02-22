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
          <img src="statics/app-logo.jpg" />
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
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      v-model="left"
      side="left"
      elevated
      :mini="miniState"
      @mouseover="miniState = false"
      @mouseout="miniState = true"
    >
      <q-scroll-area class="fit">
        <q-list v-for="(menuItem, index) in menuList" :key="index">
          <q-item
            clickable
            :active="$route.path === menuItem.route"
            v-ripple
            :to="menuItem.route"
            exact
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
      miniState: true, // 左侧导航是否处于mini模式
      menuList: [
        {
          icon: 'home',
          label: '门户主页',
          route: '/',
          separator: true
        },
        {
          icon: 'dashboard',
          label: '管理系统',
          route: '/home'
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
        },
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
      ],
      searchText: '',
      logo: 'statics/app-logo.jpg'
    }
  },
  watch: {
    '$store.getters.getKeyword': function(newVal) {
      // 为了和首页的搜索同步
      this.searchText = newVal
    },
    searchText: function(newVal) {
      if (newVal === '') {
        if (this.$route.path === '/search') {
          // 清空，则取消搜索
          this.$router.back(-1)
        }
      } else {
        if (this.$route.path !== '/search') {
          // 在其它页面，则跳转到搜索页
          this.$router.push('/search')
        } // 已经在搜索页，只需要改变keyword
      }
      this.$store.commit('setKeyword', this.searchText)
    }
  },
  created: function() {
    let { getCompanyInfo } = this.$store.getters
    //if (getUserInfo && getUserInfo.type !== 0) { 个人账户已废弃
    // 设置右上角头像
    if (getCompanyInfo) {
      let { company_logo } = getCompanyInfo
      if (company_logo) this.logo = this.$head + company_logo

      this.$axios.get('message/content').then(res => {
        if (res.data.data) {
          this.$q
            .dialog({
              title: '更新报价',
              message: `客户于${this.$formatTime(
                res.data.data.creatime
              )}提醒您更新报价`,
              persistent: true,
              ok: {
                label: '更新报价',
                flat: true
              },
              cancel: {
                label: '稍后再说',
                flat: true
              }
            })
            .onOk(() => {
              this.$axios.delete('message/content').then(res => {
                if (res) {
                  this.$success('标记已读')
                  this.$router.push('/update')
                }
              })
            })
        }
      })
    }
    //}
    this.$store.commit('setMenu', this.menuList)
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
