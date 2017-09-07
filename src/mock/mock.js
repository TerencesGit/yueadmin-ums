import axios from 'axios'
import Utils from '@/assets/js/utils'
import MockAdapter from 'axios-mock-adapter'
import { UserList, PartnerList, OrganizeList, FunctionTree, TitleList, 
	RoleList, RoleFunc } 
				from './data/user'
let _UserList = UserList,
		_PartnerList = PartnerList,
		_Organizes = OrganizeList,
		_FunctionTree = FunctionTree,
		_TitleList = TitleList,
		_RoleList = RoleList,
		_RoleFunc = RoleFunc;
const retObj = {
	code: '0001',
	message: '操作成功',
	result: {}
}
const retExpireObj = {
	code: '0000',
	message: '尚未登录或当前会话已过期',
	result: {}
}
export default {
	bootstrap () {
		let mock = new MockAdapter(axios)
		// 用户登录
		mock.onPost('/login').reply(config => {
			let { username, password, isAdmin } = JSON.parse(config.data);
			let loginUser = _UserList.filter(user => user.email === username && 
				user.isAdmin === isAdmin)[0];
			if(loginUser) {
				if(loginUser.password === password) {
					return new Promise((resolve, reject) => {
						setTimeout(() => {
							retObj.result.userInfo = loginUser;
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
		// 登出
		mock.onGet('/logout').reply(config => {
			Utils.delCookie('userId')
			retObj.result = {}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 注册
		mock.onPost('/regist').reply(config => {
			let { realname, email, password, orgId } = JSON.parse(config.data);
			_UserList.push({
				createTime: new Date(),
				realname,
				email,
				orgId
			})
			retObj.result = {}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 获取用户信息
		mock.onGet('/accountInter/getMyinfo.do').reply(config => {
			let userId = Utils.getCookie('userId');
			if(!userId) {
				return new Promise((resolve, reject) => {
					setTimeout(() => {
						resolve([200, retExpireObj])
					}, 500)
				})
			}
			let _userInfo = _UserList.filter(user => user.userId == userId)[0]
			let retObj = {
				code: '0001',
				message: '操作成功',
				result: {
					userInfo: _userInfo
				}
			}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 更新用户信息
		mock.onPost('/accountInter/updateMyInfo.do').reply(config => {
			let userId = Utils.getCookie('userId');
			if(!userId) {
				return new Promise((resolve, reject) => {
					setTimeout(() => {
						resolve([200, retExpireObj])
					}, 500)
				})
			}
			let { name, realname, sexual, qq, birthday, areaName, idcardNum, 
				idcardPicFront, idcardPicBack } = JSON.parse(config.data);
			_UserList.filter(user => {
				if(user.userId == userId) {
					user.name = name;
					user.realname = realname;
					user.sexual = sexual;
					user.qq = qq;
					user.birthday = birthday;
					user.areaName = areaName;
					user.idcardNum = idcardNum;
					user.idcardPicFront = idcardPicFront;
					user.idcardPicBack = idcardPicBack;
				}
			})
			retObj.result = {}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 更新密码
		mock.onPost('/accountInter/updatePwd.do').reply(config => {
			let userId = Utils.getCookie('userId');
			let { oldPassword, newPassword } = JSON.parse(config.data);
			let retObj = {
				code: '0001',
				message: '操作成功',
				result: {}
			}
			_UserList.filter(user => {
				if(user.userId == userId && user.password == oldPassword) {
					user.password = newPassword
				} else {
					retObj = {
						code: '1003',
						message: '原密码错误',
						result: {}
					}
				}
			})
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 新建商家信息
		mock.onPost('/accountInter/createPartner.do').reply(config => {
			let partnerInfo = JSON.parse(config.data);
			return new Promise((resolve, reject) => {
				setTimeout(() => {
						resolve([200, retObj])
				}, 500)
			})
		})
		// 获取企业信息
		mock.onGet('/accountInter/getMyPartner.do').reply(config => {
			let userId = Utils.getCookie('userId');
			if(!userId) {
				return new Promise((resolve, reject) => {
					setTimeout(() => {
						resolve([200, retExpireObj])
					}, 500)
				})
			}
			let _userInfo = _UserList.filter(user => user.userId == userId)[0];
			let _partnerId = _userInfo.partnerId;
			let _partnerInfo = _PartnerList.filter(p => p.partnerId == _partnerId)[0]
			retObj.result = {
				partnerInfo: _partnerInfo
			}
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
		mock.onGet('/user/list').reply(config => {
			let { orgId, pageNo, pageSize } = config.params;
			let currOrg = OrganizeList.filter(org => org.orgId == orgId)[0];
			let total = 0, userPage = null;
			if(currOrg.parentId == 0) {
				total = _UserList.length
				userPage = _UserList.filter((user, index) => index < pageNo * pageSize && index >= (pageNo - 1) * pageSize)
			} else {
				let orgList = OrganizeList.filter(org => org.orgId == orgId || org.parentId == orgId)
				let _userList = [];
				orgList.forEach(org => {
					let orgUser = _UserList.filter(user => user.orgId == org.orgId);
					_userList = orgUser.length > 0 ? _userList.concat(orgUser) : _userList
				})
				total = _userList.length;
				userPage = _userList.filter((user, index) => index < pageNo * pageSize && index >= (pageNo - 1) * pageSize)
			}
  	  userPage.forEach(user => {
  	  	user.orgName = _Organizes.filter(org => org.orgId == user.orgId)[0].name;
  	  	_TitleList.filter(title => {
  	  		if(title.titleId == user.titleId) {
  	  			user.titleName = title.titleName
  	  		}
  	  	})
  	  })
			retObj.result = {
				userList: userPage,
				pageInfo: {
					total: total
				}
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
			let _orgUser = _UserList.filter(user => user.orgId == orgId);
			if(_orgUser.length !== 0) {
				let retObj = {
					code: '3001',
					message: '该部门有员工，不可删除',
					result: {}
				}
				return new Promise((resolve, reject) => {
					setTimeout(() => {
						resolve([200, retObj])
					}, 500)
				})
			}
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
		// 设置员工部门
		mock.onPost('/partner/setUserOrg').reply(config => {
			let { userId, orgId } = JSON.parse(config.data)
			let _orgName = _Organizes.filter(org => org.orgId == orgId)[0].name;
			_UserList.filter(user => {
				if(user.userId == userId) {
					user.orgId = orgId;
					user.orgName = _orgName
				}
			})
			retObj.result = {}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 删除用户
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
		// 设置员工状态
		mock.onPost('/partner/setUserStatus').reply(config => {
			let { userId, status } = JSON.parse(config.data)
			_UserList.filter(user => {
				if(user.userId == userId) {
					user.status = status
				}
			})
			retObj.result = {}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 获取职位列表
		mock.onGet('/partner/getPartnerTitle').reply(config => {
			let { pageNo, pageSize } = config.params;
			let userId = Utils.getCookie('userId');
			let partnerId = _UserList.filter(user => user.userId == userId)[0].partnerId;
			let partnerTitle = _TitleList.filter(title => title.partnerId == partnerId)
			let total = partnerTitle.length;
			let titlePage = partnerTitle.filter((t,index) => index < pageNo * pageSize && index >= (pageNo - 1) * pageSize)
			retObj.result = {
				titleList: titlePage,
				pageInfo: {
					total
				}
			}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 设置员工职位
		mock.onPost('/partner/setUserTitle').reply(config => {
			let { userId, titleId } = JSON.parse(config.data)
			let titleName = _TitleList.filter(title => title.titleId == titleId)[0].titleName
			_UserList.filter(user => {
				if(user.userId == userId) {
					user.titleId = titleId,
					user.titleName = titleName
				}
			})
			retObj.result = {}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 创建职位
		mock.onPost('/partner/createTitle').reply(config => {
			let userId = Utils.getCookie('userId');
			let partnerId = _UserList.filter(user => user.userId == userId)[0].partnerId;
			let { titleName, titleDesc } = JSON.parse(config.data)
			_TitleList.push({
				titleId: new Date().getTime(),
				titleName,
				titleDesc,
				partnerId,
			})
			retObj.result = {}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 编辑职位
		mock.onPost('/partner/updateTitle').reply(config => {
			let { titleId, titleName, titleDesc } = JSON.parse(config.data)
			_TitleList.filter(title => {
				if(title.titleId == titleId) {
					title.titleName = titleName;
					title.titleDesc = titleDesc
				}
			})
			retObj.result = {}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 删除职位
		mock.onPost('/partner/delTitle').reply(config => {
			let { titleId } = JSON.parse(config.data)
			let _title = _TitleList.filter(title => title.titleId == titleId)[0];
			_TitleList.splice(_TitleList.indexOf(_title), 1)
			retObj.result = {}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 获取功能树
		mock.onGet('/adminInter/getFunctionTree.do').reply(config => {
			let { moduleId } = config.params;
			let moduleFuncTree = _FunctionTree.filter(func => func.moduleId == moduleId)
			retObj.result = {
				functionTree: moduleFuncTree
			}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 创建功能点
		mock.onPost('/adminInter/createFunction.do').reply(config => {
			let { parentId, name, funcDesc } = JSON.parse(config.data);
			_FunctionTree.push({
				funcId: new Date().getTime(),
				name,
				funcDesc,
				status: 1,
				parentId,
			})
			retObj.result = {}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 更新功能点
		mock.onPost('/adminInter/updateFunction.do').reply(config => {
			let { funcId, name, funcDesc } = JSON.parse(config.data);
			_FunctionTree.filter(func => {
				if(func.funcId === funcId) {
					func.name = name;
					func.funcDesc = funcDesc
				}
			})
			retObj.result = {}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 删除功能点
		mock.onPost('/adminInter/delFunction.do').reply(config => {
			let { funcId } = JSON.parse(config.data)
			_FunctionTree = _FunctionTree.filter(func => func.funcId !== funcId)
			retObj.result = {}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 获取角色分页列表
		mock.onGet('/adminInter/getSysRoles.do').reply(config => {
			let { pageNo, pageSize } = config.params;
			let total = _RoleList.length;
			let rolePage = _RoleList.filter((role, index) => index < pageNo * pageSize && index >= (pageNo - 1) * pageSize)
			retObj.result = {
				roleList: rolePage,
				pageInfo: {
					total: total
				}
			}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 设置角色启用/禁用状态
		mock.onPost('/adminInter/updateRoleStatus.do').reply(config => {
			let { roleId, status } = JSON.parse(config.data);
			_RoleList.filter(role => {
				if(role.roleId == roleId) {
					role.status = status
				}
			})
			retObj.result = {}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 新建角色
		mock.onPost('/adminInter/createRole.do').reply(config => {
			let { roleName, roleDesc } = JSON.parse(config.data)
			_RoleList.push({
				roleId: new Date().getTime(),
				roleName,
				roleDesc,
				status: 1
			})
			retObj.result = {}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 更新角色
		mock.onPost('/adminInter/updateRole.do').reply(config => {
			let { roleId, roleName, roleDesc } = JSON.parse(config.data)
			_RoleList.filter(role => {
				if(role.roleId == roleId) {
					role.roleName = roleName;
					role.roleDesc = roleDesc;
				}
			})
			retObj.result = {}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 删除角色
		mock.onPost('/adminInter/delRole.do').reply(config => {
			let { roleId } = JSON.parse(config.data)
			_RoleList = _RoleList.filter(role => role.roleId != roleId)
			retObj.result = {}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 获取角色关联的功能点
		mock.onGet('/adminInter/getRoleFunctions.do').reply(config => {
			let { roleId } = config.params
			let funcIdList = _RoleFunc.filter(rolefunc => rolefunc.roleId == roleId).map(func => func.funcId)
			let _funcList = [];
			funcIdList.forEach(funcId => {
				_funcList.push(
					_FunctionTree.filter(func => func.funcId == funcId)[0]
				)
			})
			let retObj = {
				code: '0001',
				message: '操作成功',
				result: {
					roleFuncs: _funcList
				}
			}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 配置角色功能
		mock.onPost('/adminInter/updateRoleFunction.do').reply(config => {
			let { roleId, funcIdList } = JSON.parse(config.data)
			funcIdList.forEach(funcId => {
				_RoleFunc.push({
					roleId,
					funcId,
				})
			})
			retObj.result = {}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
	}
}