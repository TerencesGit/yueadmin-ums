import axios from 'axios'
import Utils from '@/assets/js/utils'
import MockAdapter from 'axios-mock-adapter'
import { UserList, PartnerList, OrganizeList, ModuleList, FunctionList, 
				TitleList, RoleList, OrgRoles, RoleFuncs, ContractTempList, PartnerTypeList, 
				TypeRoles, Contracts } from './data/user'
let _UserList = UserList,
		_PartnerList = PartnerList,
		_Organizes = OrganizeList,
		_ModuleList = ModuleList,
		_FunctionList = FunctionList,
		_TitleList = TitleList,
		_RoleList = RoleList,
		_OrgRoles = OrgRoles,
		_RoleFuncs = RoleFuncs,
		_ContractTempList = ContractTempList,
		_PartnerTypeList = PartnerTypeList,
		_TypeRoles = TypeRoles,
		_Contracts = Contracts;
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
		// 登录
		mock.onPost('/login').reply(config => {
			let { username, password } = JSON.parse(config.data);
			let loginUser = _UserList.filter(user => user.email === username)[0];
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
		mock.onPost('/baseInter/register.do').reply(config => {
			let { email, passwd, passwd2 } = JSON.parse(config.data);
			// console.log(email, passwd, passwd2
			let userId = new Date().getTime();
			_UserList.push({
				userId,
				email,
				password: passwd,
				sexual: 1,
				partnerId: '',
				mobVerified: 0,
		    emailVerified: 0,
		    status: 1,
				createTime: new Date(),
			}) 
			retObj.result = {}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 查询邮箱或手机号是否已被使用
		mock.onGet('/baseInter/accountFind.do').reply(config => {
			let { account } = config.params;
			// console.log(account)
			let _user = _UserList.filter(user => user.email === account);
			let finded = _user.length > 0 ? true : false;
			retObj.result = {
				finded
			}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 发送找回密码邮件
		mock.onPost('/baseInter/sendForgotPwdEmail.do').reply(config => {
			let { email } = JSON.parse(config.data)
			console.log(email)
			retObj.result = {}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 重置密码
		mock.onPost('/baseInter/resetPasswd.do').reply(config => {
			let { passwd, passwd2 } = JSON.parse(config.data)
			console.log(passwd, passwd2)
			retObj.result = {}
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
		// 获取用户信息
		mock.onGet('/accountInter/getMyInfo.do').reply(config => {
			let userId = Utils.getCookie('userId');
			if(!userId) {
				return new Promise((resolve, reject) => {
					setTimeout(() => {
						resolve([200, retExpireObj])
					}, 500)
				})
			}
			let _userInfo = _UserList.filter(user => user.userId == userId)[0];
			_Organizes.filter(org => {
				if(org.orgId == _userInfo.orgId) {
					_userInfo.orgName = org.name
				}
			})
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
		// 获取商家信息
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
			if(!(_userInfo && _userInfo.partnerId)) {
				return new Promise((resolve, reject) => {
					let retObj = {
						code: '3001',
						message: '尚未注册企业',
						result: {}
					}
					setTimeout(() => {
						resolve([200, retObj])
					}, 500)
				})
			}
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
		// 获取当前用户所属商户信息
		mock.onGet('/partnerInter/getMyPartnerInfo.do').reply(config => {
			let userId = Utils.getCookie('userId');
			if(!userId) {
				return new Promise((resolve, reject) => {
					setTimeout(() => {
						resolve([200, retExpireObj])
					}, 500)
				})
			}
			let _userInfo = _UserList.filter(user => user.userId == userId)[0];
			if(!(_userInfo && _userInfo.partnerId)) {
				return new Promise((resolve, reject) => {
					let retObj = {
						code: '3001',
						message: '尚未注册企业',
						result: {}
					}
					setTimeout(() => {
						resolve([200, retObj])
					}, 500)
				})
			}
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
		// 更新当前用户所属商户信息
		mock.onPost('/partnerInter/updateMyPartnerInfo.do').reply(config => {
			let { partnerId, name, shortName } = JSON.parse(config.data);
			console.log(partnerId, name, shortName)
			retObj.result = {}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
						resolve([200, retObj])
				}, 500)
			})
		})
		// 获取商家组织部门树
		mock.onGet('/partnerInter/getMyPartnerOrgs.do').reply(config => {
			retObj.result = {
				organizeTree: _Organizes
			}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
						resolve([200, retObj])
				}, 500)
			})
		})
		// 获取商家角色列表
		mock.onGet('/partnerInter/getMyPartnerRoles.do').reply(config => {
			let total = _RoleList.length;
			retObj.result = {
				roleList: _RoleList,
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
		// 获取部门关联角色列表
		mock.onGet('/partnerInter/getRolesByOrg.do').reply(config => {
			let { orgId } = config.params;
			let currOrg = _Organizes.filter(org => org.orgId === orgId)[0];
			let orgRoles = [];
			if(currOrg.parentId === 0) {
				orgRoles = _RoleList
			} else {
				orgRoles = _OrgRoles.filter(orgRole => orgRole.orgId === orgId);
			}
			let retObj = {
				code: '0001',
				message: '操作成功',
				result: {
					orgRoles
				}
			}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 配置部门关联角色列表
		mock.onPost('/partnerInter/updateOrgRole.do').reply(config => {
			let { orgId, roleIdList } = JSON.parse(config.data);
			let orgRoles = _OrgRoles.filter(orgRole => orgRole.orgId == orgId);
			if(orgRoles.length === 0) {
				roleIdList.forEach(roleId => {
					_OrgRoles.push({
						orgRoleId: new Date().getTime(),
						orgId,
						roleId,
					})
				})
			} else {
				orgRoles.forEach(orgRole => {
					roleIdList.filter(roleId => {
						if(orgRole.roleId !== roleId) {
							_OrgRoles.push({
								orgRoleId: new Date().getTime(),
								orgId,
								roleId,
							})
						}
					})
				})
			}
			retObj.result = {}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 获取组织节点下的员工
		mock.onGet('/partnerInter/getOrganizeStaff.do').reply(config => {
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
		// 新增组织节点
		mock.onPost('/partnerInter/createOrganize.do').reply(config => {
			let { name, note, parentId } = JSON.parse(config.data)
			_Organizes.push({
				orgId: new Date().getTime(),
				name,
				note,
				parentId
			})
			retObj.result = {}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 编辑组织节点
		mock.onPost('/partnerInter/updateOrganize.do').reply(config => {
			let { orgId, name, note, parentId } = JSON.parse(config.data)
			_Organizes.some(org => {
				if(org.orgId === orgId) {
					org.name = name;
					org.note = note
				}
			})
			retObj.result = {}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 删除组织节点
		mock.onPost('/partnerInter/delOrganize.do').reply(config => {
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
		// 设置组织节点状态
		mock.onPost('/partnerInter/updateOrgStatus.do').reply(config => {
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
		// 员工代注册
		mock.onPost('/partnerInter/registerByAgency.do').reply(config => {
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
		// 设置员工部门
		mock.onPost('/partnerInter/updateStaffOrg.do').reply(config => {
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
		mock.onPost('/partnerInter/removeUser.do').reply(config => {
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
		mock.onPost('/partnerInter/updateStaffStatus.do').reply(config => {
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
		mock.onGet('/partnerInter/getMyPartnerTitleList.do').reply(config => {
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
		mock.onPost('/partnerInter/updateStaffTitle.do').reply(config => {
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
		// 新建职位
		mock.onPost('/partnerInter/createTitle.do').reply(config => {
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
		mock.onPost('/partnerInter/updateTitle.do').reply(config => {
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
		mock.onPost('/partnerInter/delTitle.do').reply(config => {
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
		// 获取功能模块列表
		mock.onGet('/adminInter/getModules.do').reply(config => {
			let retObj = {
				code: '0001',
				message: '操作成功',
				result: {
					modules: _ModuleList
				}
			}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 新建功能模块
		mock.onPost('/adminInter/createModule.do').reply(config => {
			let { name, contextRoot, note } = JSON.parse(config.data);
			let moduleId = new Date().getTime();
			_ModuleList.push({
				moduleId,
				name,
				contextRoot,
				note,
			})
			_FunctionList.push({
				funcId: new Date().getTime(),
				moduleId,
				parentId: 0,
				name,
				status: 1
			})
			retObj.result = {}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 更新功能模块
		mock.onPost('/adminInter/updateModule.do').reply(config => {
			let { moduleId, name, contextRoot, note } = JSON.parse(config.data);
			_ModuleList.filter(module => {
				if(module.moduleId === moduleId) {
					module.name = name;
					module.contextRoot = contextRoot;
					module.note = note;
				}
			})
			retObj.result = {}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 根据模块id获取模块功能点列表
		mock.onGet('/adminInter/getModuleFunctionList.do').reply(config => {
			let { moduleId } = config.params;
			let functions = _FunctionList.filter(func => func.moduleId == moduleId)
			// if(functions.length === 0) {}
			retObj.result = {
				functions
			}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 新建功能点
		mock.onPost('/adminInter/createFunction.do').reply(config => {
			let { parentId, name, funcMd5, funcUrl, funcSeq, viewname, 
				funcIco, funcDesc, isMenu, status, moduleId } = JSON.parse(config.data);
			_FunctionList.push({
				funcId: new Date().getTime(),
				name,
      	funcMd5,
    		funcUrl,
    		funcSeq,
    		viewname,
    		funcIco,
    		funcDesc,
    		isMenu,
				status,
				parentId,
				moduleId,
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
			let { funcId, name, funcMd5, funcUrl, funcSeq, viewname, 
				funcIco, funcDesc, isMenu, status } = JSON.parse(config.data);
			_FunctionList.filter(func => {
				if(func.funcId === funcId) {
					func.name = name;
					func.funcMd5 = funcMd5;
	    		func.funcUrl = funcUrl;
	    		func.funcSeq = funcSeq;
	    		func.viewname = viewname;
	    		func.funcIco = funcIco;
	    		func.funcDesc = funcDesc;
	    		func.isMenu = isMenu;
					func.status = status;
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
			_FunctionList = _FunctionList.filter(func => func.funcId !== funcId)
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
			let funcIdList = _RoleFuncs.filter(rolefunc => rolefunc.roleId == roleId).map(func => func.funcId)
			let _funcList = [];
			funcIdList.forEach(funcId => {
				_funcList.push(
					_FunctionList.filter(func => func.funcId == funcId)[0]
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
				_RoleFuncs.push({
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
		// 获取合同模板列表
		mock.onGet('/adminInter/getContractTemplates.do').reply(config => {
			let { pageNo, pageSize } = config.params;
			let total = _ContractTempList.length;
			let templatePage = _ContractTempList.filter((temp, index) => index < pageNo * pageSize && index >= (pageNo - 1) * pageSize );
			retObj.result = {
				templateList: templatePage,
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
		// 新建合同模板
		mock.onPost('/adminInter/createTemplate.do').reply(config => {
			let { name, templateFile, note } = JSON.parse(config.data);
			_ContractTempList.push({
				templateId: new Date().getTime(),
				name,
				templateFile,
				note
			})
			retObj.result = {}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 更新合同模板
		mock.onPost('/adminInter/updateTemplate.do').reply(config => {
			let { templateId, name, templateFile, note } = JSON.parse(config.data);
			_ContractTempList.filter(temp => {
				if(temp.templateId == templateId) {
					temp.name = name,
					temp.templateFile = templateFile,
					temp.note = note
				}
			})
			retObj.result = {}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 删除合同模板
		mock.onPost('/adminInter/delTemplate.do').reply(config => {
			let { templateId } = JSON.parse(config.data);
			_ContractTempList = _ContractTempList.filter(temp => temp.templateId != templateId)
			retObj.result = {}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 获取商家类型列表
		mock.onGet('/adminInter/getPartnerTypes.do').reply(config => {
			let { pageNo, pageSize } = config.params;
			let total = _PartnerTypeList.length;
			let partnerTypes = _PartnerTypeList.filter((temp, index) => index < pageNo * pageSize && index >= (pageNo - 1) * pageSize );
			retObj.result = {
				partnerTypes: partnerTypes,
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
		// 设置商家类型启用/禁用状态
		mock.onPost('/adminInter/updatePartnerTypeStatus.do').reply(config => {
			let { typeId, status } = JSON.parse(config.data);
			_PartnerTypeList.filter(type => {
				if(type.typeId == typeId) {
					type.status = status
				}
			})
			retObj.result = {}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 新建商家类型
		mock.onPost('/adminInter/createPartnerType.do').reply(config => {
			let { typeName, note } = JSON.parse(config.data);
			_PartnerTypeList.push({
				typeId: new Date().getTime(),
				typeName,
				note,
				status: 1
			})
			retObj.result = {}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 更新商家类型
		mock.onPost('/adminInter/updatePartnerType.do').reply(config => {
			let { typeId, typeName, note } = JSON.parse(config.data);
			_PartnerTypeList.filter(type => {
				if(type.typeId == typeId) {
					type.typeName = typeName;
					type.note = note
				}
			})
			retObj.result = {}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 获取某商家类型关联的角色列表
		mock.onGet('/adminInter/getRolesByPartType.do').reply(config => {
			let { typeId } = config.params;
			let roles = _TypeRoles.filter(typeRole => typeRole.typeId == typeId)
			let retObj = {
				code: '0001',
				message: '操作成功',
				result: {
					roles
				}
			}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 设置商家类型关联的角色
		mock.onPost('/adminInter/updatePartnerTypeRole.do').reply(config => {
			let { typeId, roleIdList } = JSON.parse(config.data);
			let typeRoles = _TypeRoles.filter(type => type.typeId == typeId);
			if(typeRoles.length === 0) {
				roleIdList.forEach(roleId => {
					_TypeRoles.push({
						typeRoleId: new Date().getTime(),
						typeId,
						roleId,
					})
				})
			} else {
				typeRoles.forEach(typeRole => {
					roleIdList.filter(roleId => {
						if(typeRole.roleId !== roleId) {
							_TypeRoles.push({
								typeRoleId: new Date().getTime(),
								typeId,
								roleId,
							})
						}
					})
				})
			}
			retObj.result = {}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 获得商家分页列表
		mock.onGet('/domainInter/getPartnerList.do').reply(config => {
			let { pageNo, pageSize, status, isVerified } = config.params;
			let _partnerList = _PartnerList;
			if(isVerified >= 0) {
				_partnerList = _PartnerList.filter(part => part.isVerified == isVerified)
			}
			if(status >= 0) {
				_partnerList = _PartnerList.filter(part => part.status == status)
			}
			let total = _partnerList.length;
			let partnerPage = _partnerList.filter((part, index) => 
				index < pageNo * pageSize && index >= (pageNo - 1) * pageSize)
			let retObj = {
				code: '0001',
				message: '操作成功',
				result: {
					partners: partnerPage,
					pageInfo: {
						total
					}
				}
			}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 更新商家的类型
		mock.onPost('/domainInter/updatePartType.do').reply(config => {
			let { partnerId, typeId } = JSON.parse(config.data);
			_PartnerList.filter(part => {
				if(part.partnerId == partnerId) {
					part.typeId = typeId;
				}
			})
			retObj.result = {}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 更新商家状态
		mock.onPost('/domainInter/updatePartnerStatus.do').reply(config => {
			let { partnerId, status } = JSON.parse(config.data);
			_PartnerList.filter(part => {
				if(part.partnerId == partnerId) {
					part.status = status === 1 ? 0 : 1;
				}
			})
			retObj.result = {}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 获取合同分页列表
		mock.onGet('/domainInter/getContracts.do').reply(config => {
			let { pageNo, pageSize } = config.params;
			let total = _Contracts.length;
			_Contracts.forEach(cont => {
				_ContractTempList.filter(temp => {
					if(temp.templateId == cont.templateId) {
						cont.templateName = temp.name
					}
				})
				_PartnerList.filter(part => {
					if(part.partnerId == cont.partyB) {
						cont.partyBName = part.name
					}
				})
			})
			retObj.result = {
				contracts: _Contracts,
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
		// 新建合同
		mock.onPost('/domainInter/createContract.do').reply(config => {
			let { contractCode, partyAName, partyB, templateId, signTime, effectiveDate,
					expireDate, attachFiles, note } = JSON.parse(config.data);
			_Contracts.push({
				contractId: new Date().getTime(),
				contractCode,
				partyAName,
				partyB,
				templateId,
				signTime,
				effectiveDate,
				expireDate, 
				attachFiles,
				note,
			})
			retObj.result = {}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 更新合同
		mock.onPost('/domainInter/updateContract.do').reply(config => {
			let { contractId, contractCode, partyAName, partyB, 
					templateId, signTime, effectiveDate, expireDate, 
					attachFiles, note } = JSON.parse(config.data);
			_Contracts.some(contract => {
				if(contract.contractId == contractId) {
					contract.contractCode = contractCode;
					contract.partyAName = partyAName;
					contract.partyB = partyB;
					contract.templateId = templateId;
					contract.signTime = signTime;
					contract.effectiveDate = effectiveDate;
					contract.expireDate = expireDate;
					contract.attachFiles = attachFiles;
					contract.note = note;
				}
			})
			retObj.result = {}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 商家审核通过
		mock.onPost('/domainInter/examPartner.do').reply(config => {
			let { partnerId, typeId } = JSON.parse(config.data);
			_PartnerList.filter(part => {
				if(part.partnerId == partnerId) {
					part.typeId = typeId;
					part.isVerified = 1
				}
			})
			retObj.result = {}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				}, 500)
			})
		})
		// 商家审核驳回
		mock.onPost('/domainInter/rejectPartner.do').reply(config => {
			let { partnerId, rejectInfo } = JSON.parse(config.data);
			_PartnerList.filter(part => {
				if(part.partnerId == partnerId) {
					part.rejectInfo = rejectInfo;
					part.isVerified = 2
				}
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