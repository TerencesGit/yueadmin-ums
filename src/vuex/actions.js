export const toggleSidebar = ({ commit }) => {
	commit('TOGGLE_SIDEBAR')
}
export const saveUserInfo = ({ commit }, userInfo) => {
	commit('SAVE_USERINFO', userInfo)
}
export const changeStepActive = ({ commit }, step) => {
	commit('CHANGE_STEPACTIVE', step)
}
export const setUserPermission = ({ commit }, permission) => {
	commit('SET_PERMISSION', permission)
}
