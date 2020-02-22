import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function(/* { ssrContext } */) {
  const Store = new Vuex.Store({
    state: {
      userInfo: null,
      companyInfo: null,
      fav: [],
      keyword: '',
      menuList: []
    },
    getters: {
      getUserInfo: state => state.userInfo,
      getCompanyInfo: state => state.companyInfo,
      getFav: state => state.fav,
      getKeyword: state => state.keyword,
      getMenuList: state => state.menuList
    },
    mutations: {
      login(state, userInfo) {
        state.userInfo = userInfo
      },
      logout(state) {
        state.userInfo = null
        state.companyInfo = null
        state.fav = []
        state.menuList = []
      },
      setFav(state, fav) {
        state.fav = fav
      },
      setKeyword(state, keyword) {
        state.keyword = keyword
      },
      setCompany(state, companyInfo) {
        state.companyInfo = companyInfo
      },
      setMenu(state, menuList) {
        state.menuList = menuList
      }
    },
    actions: {
      Login({ commit, state, dispatch }, userInfo) {
        commit('login', userInfo)
        sessionStorage.setItem('store', JSON.stringify(state))
        if (userInfo.type === 1) {
          dispatch('getCompany', userInfo.id)
        }
      },
      Logout({ commit }) {
        commit('logout')
        sessionStorage.removeItem('store')
      },
      getFavList({ commit }) {
        Vue.prototype.$axios.get('collection/group_names').then(res => {
          if (res) {
            commit('setFav', res.data.data)
          }
        })
      },
      getCompany({ commit }, id) {
        Vue.prototype.$axios.get(`company?user_id=${id}`).then(res => {
          if (res) {
            commit('setCompany', res.data.data)
          }
        })
      }
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

  return Store
}
