import defaultSettings from '@/settings'
import Layout from '@/layout'

const { showSettings, fixedHeader, sidebarLogo, fullScreen } = defaultSettings

const state = {
  showSettings: showSettings,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,
  fullScreen: fullScreen
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

// const apis = '/apis'
const apis = process.env.VUE_APP_BASE_API

const menuList = [
  // {
  //   path: '/login',
  //   component: () => import('@/views/login/index'),
  //   hidden: true
  // },
  //
  // {
  //   path: '/404',
  //   component: () => import('@/views/404'),
  //   hidden: true
  // },




  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  apis,
  menuList
}

