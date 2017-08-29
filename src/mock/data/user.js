import Mock from 'mockjs'
const UserList = [];
for(let i = 0; i < 6; i++) {
	UserList.push(Mock.mock({
		userId: Mock.Random.guid(),
		name: Mock.Random.cname(),
		mobile: '13' + Mock.mock('@string("number", 9)'),
		address: Mock.mock('@city'),
		createTime: new Date(2017, Math.floor(Math.random()*8), Math.floor(Math.random()*30)),
		gender: Mock.Random.integer(0, 1)
	}))
}
export {
	UserList
}