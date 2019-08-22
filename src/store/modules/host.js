const state = {
  host: ''
}

const mutations = {
  changeHost: (state, host) => {
    state.host = host
  }
}
// https://vuex.vuejs.org/zh/guide/actions.html

const actions = {
  changeHostByAyn({ commit }, data) {
    commit('changeHost', data)
  },
  changeHostByAyn1(context, n = 0) {
    console.log(context)
    return context.commit('changeHost', n)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
