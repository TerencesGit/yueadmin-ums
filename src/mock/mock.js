import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { AdminList, UserList, PartnerList, OrganizeList } from './data/user'
let _AdminList = AdminList,
		_UserList = UserList,
		_PartnerList = PartnerList,
		_Organizes = OrganizeList;
const retObj = {
	code: '0001',
	message: '操作成功',
	result: {}
}
export default {
	bootstrap () {
		let mock = new MockAdapter(axios)
		// 登录
		mock.onPost('/login').reply(config => {
			let { username, password, isAdmin } = JSON.parse(config.data);
			console.log(username, password, isAdmin)
			let user = _AdminList.filter(user => user.name === username && 
				user.isAdmin === isAdmin)[0];
			console.log(user)
			if(user) {
				if(user.password === password) {
					return new Promise((resolve, reject) => {
						setTimeout(() => {
							retObj.result.account = _AdminList[0];
							resolve([200, retObj])
						}, 1000)
					})
				} else {
					let retObj = {
						code: '1002',
						message: '密码错误'
					}
					return new Promise((resolve, reject) => {
						setTimeout(() => {
							resolve([200, retObj])
						}, 1000)
					})
				}
			} else {
				let retObj = {
					code: '1001',
					message: '用户名不存在'
				}
				return new Promise((resolve, reject) => {
					setTimeout(() => {
						resolve([200, retObj])
					}, 1000)
				})
			}
		})
		// 用户信息
		mock.onGet('/account/info').reply(config => {
			let { accountId } = config.params;
			if(!accountId) {
				return new Promise((resolve, reject) => {
					const res = {
						response: {
							status: 400
						}
					}
					setTimeout(() => {
						reject(res)
					}, 500)
				})
			}
			let user = _AdminList.filter(user => user.accountId === accountId)[0]
			return new Promise((resolve, reject) => {
				if(user) {
					retObj.result.account = user;
					setTimeout(() => {
						resolve([200, retObj])
					}, 500)
				} else {
					let retObj = {
						code: '1001',
						message: '获取用户信息失败'
					}
					setTimeout(() => {
						resolve([200, retObj])
					}, 500)
				}
			})
		})
		// 企业信息
		mock.onGet('/partner/info').reply(config => {
			retObj.result.partnerInfo = _PartnerList[0]
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				})
			})
		})
		// 组织部门树
		mock.onGet('/partner/readOrganizeTree').reply(config => {
			retObj.result = {
				organizeTree: _Organizes
			}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
						resolve([200, retObj])
				}, 500)
			})
		})
		// 用户列表
		mock.onGet('/account/list').reply(config => {
			let { orgId, name } = config.params
			_UserList.forEach(user => {
				user.organize = name
			})
			_UserList.sort(() => {
  			return 0.5 - Math.random()
  		})
			retObj.result = {
				userList: _UserList
			}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
						resolve([200, retObj])
				}, 500)
			})
		})
		// 新增/编辑组织树
		mock.onPost('/partner/saveOrganizeTree').reply(config => {
			let { orgId, name, note, parentId } = JSON.parse(config.data)
			// console.log(orgId, name, note, parentId)
			if(orgId) {
				_Organizes.some(org => {
					if(org.orgId === orgId) {
						org.name = name;
						org.note = note
					}
				})
			} else {
				_Organizes.push({
					orgId: new Date().getTime(),
					name,
					note,
					parentId
				})
			}
			retObj.result = {}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 删除部门
		mock.onPost('/partner/deleteOrganize').reply(config => {
			let { orgId } = JSON.parse(config.data)
			_Organizes = _Organizes.filter(org => org.orgId !== orgId)
			retObj.result = {}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 设置部门状态
		mock.onPost('/partner/setOrganizeStatus').reply(config => {
			let { orgId, status } = JSON.parse(config.data)
			_Organizes.filter(org => {
				if(org.orgId === orgId) {
					org.status = org.status === 1 ? 0 : 1
				}
			})
			retObj.result = {}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 移除员工
		mock.onPost('/partner/removeUser').reply(config => {
			let { userId } = JSON.parse(config.data)
			_UserList = _UserList.filter(user => user.userId !== userId)
			retObj.result = {}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
	}
}