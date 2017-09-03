import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as actions from './actions'
Vue.use(Vuex)

const state = {
	sidebarStatus: false,
	userInfo: {},
	userPermission: [],
	partnerInfo: {},
	wareList: []
}

const mutations = {
	TOGGLE_SIDEBAR (state) {
		state.sidebarStatus = !state.sidebarStatus
	},
	SAVE_USERINFO (state, userInfo) {
		state.userInfo = userInfo
	},
	SET_PERMISSION (state, permission) {
		state.userPermission = permission
	},
	SET_PARTNER_INFO (state, partner) {
		state.partnerInfo = partner
	},
	SET_WARELIST (state, warelist) {
		state.wareList = warelist
	}
}
export default new Vuex.Store({
	state,
	actions,
	mutations,
	getters
})
