import Vue from 'vue'
import Vuex from 'vuex'
import { SessionStorage } from 'quasar'
// import example from './module-example'

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
      keyword: ''
    },
    getters: {
      getUserInfo: state => state.userInfo,
      getCompanyInfo: state => state.companyInfo,
      getFav: state => state.fav,
      getKeyword: state => state.keyword
    },
    mutations: {
      login(state, userInfo) {
        state.userInfo = userInfo
      },
      logout(state) {
        state.userInfo = null
        state.companyInfo = null
        state.fav = []
      },
      setFav(state, fav) {
        state.fav = fav
      },
      setKeyword(state, keyword) {
        state.keyword = keyword
      },
      setCompany(state, companyInfo) {
        state.companyInfo = companyInfo
      }
    },
    actions: {
      Login({ commit }, userInfo) {
        commit('login', userInfo)
        SessionStorage.set('userInfo', userInfo)
        if (userInfo.type !== 0) {
          Vue.prototype.$axios
            .get(`company?user_id=${userInfo.id}&id=36017`)
            .then(res => {
              if (res) {
                commit('setCompany', res.data.data)
              }
            })
        }
      },
      Logout({ commit }) {
        commit('logout')
        SessionStorage.remove('userInfo')
      },
      getFavList({ commit }) {
        Vue.prototype.$axios.get('collection/group_names').then(res => {
          if (res) {
            commit('setFav', res.data.data)
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
