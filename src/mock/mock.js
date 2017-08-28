import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
const UserList = [
	{
		accountId: 1001,
		name: 'Transform',
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
	},
]
const retObj = {
	code: '0001',
	message: '操作成功',
	result: {}
}
export default {
	bootstrap () {
		let mock = new MockAdapter(axios)
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
	}
}