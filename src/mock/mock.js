import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
const UserList = [
	{
		accountId: 1001,
		name: 'Transform',
		password: '12345678',
		// avatar: '',
		avatar: 'https://avatars1.githubusercontent.com/u/20084997?v=4&s=460',
		gender: 1,
		email: '2630243397@qq.com',
		birthday: '1992-08-08',
		qq: '12345678',
		origin: 5,
		location: '北京',
		mobile: '',
		idcard: '130110199208081234',
		partner: '悦视觉全球摄影',
		organize: '技术部',
		idcardPicFront: '',
		idcardPicBack: '',
		isAdmin: 1
	},
]
const PartnerList= [
	{
		name: '悦视觉全球摄影',
		shortName: '悦视觉',
		email: '20170828@qq.com',
		telphone: '19920170828',
		mobile: '19920170828',
		post: '100123',
		logo: 'https://avatars1.githubusercontent.com/u/20084997?v=4&s=460',
		memberNum: '',
		idcardNum: '',
		idcardPicFront: '',
		contactName: 'XXX',
		contactAddress: '北京市朝阳区',
		licenseNum: '12345678',
		licensePic: '',
		corporationName: 'XXX',
		note: '悦视觉全球摄影简介'
	}
]
const retObj = {
	code: '0001',
	message: '操作成功',
	result: {}
}
export default {
	bootstrap () {
		let mock = new MockAdapter(axios)
		mock.onPost('/login').reply(config => {
			let { username, password, isAdmin } = JSON.parse(config.data);
			console.log(username, password, isAdmin)
			let user = UserList.filter(user => user.name === username && 
				user.isAdmin === isAdmin)[0];
			console.log(user)
			if(user) {
				if(user.password === password) {
					return new Promise((resolve, reject) => {
						setTimeout(() => {
							retObj.result.account = UserList[0];
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
			let user = UserList.filter(user => user.accountId === accountId)[0]
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
		mock.onGet('/partner/info').reply(config => {
			retObj.result.partnerInfo = PartnerList[0]
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([200, retObj])
				})
			})
		})
	}
}