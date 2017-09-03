export const toggleSidebar = ({ commit }) => {
	commit('TOGGLE_SIDEBAR')
}
export const saveUserInfo = ({ commit }, userInfo) => {
	commit('SAVE_USERINFO', userInfo)
}
export const setUserPermission = ({ commit }, permission) => {
	commit('SET_PERMISSION', permission)
}
export const setPartner = ({ commit }, partner) => {
	commit('SET_PARTNER_INFO', partner)
}
export const setWareList = ({ commit }, warelist) => {
	commit('SET_WARELIST', warelist)
}
