import Mock from 'mockjs'

const AdminList = [
	{
		userId: 1001,
		name: 'Transform',
		password: '12345678',
		realname: '李效腾',
		avatar: 'https://avatars1.githubusercontent.com/u/20084997?v=4&s=460',
		sexual: 1,
		email: '2630243397@qq.com',
		birthday: '1992-08-08',
		qq: '12345678',
		origin: 5,
		location: '北京',
		mobile: '',
		mobVerified: 0,
    emailVerified: 0,
		idcardNum: '130110199208081234',
		partnerId: 2017,
		partnerName: '悦视觉全球摄影',
		orgName: '技术部',
		areaName: '朝阳区',
		idcardPicFront: '',
		idcardPicBack: '',
		status: 1,
		isAdmin: 1
	},
]
const PartnerList= [
	{
		partnerId: 2017,
		name: '悦视觉全球摄影',
		shortName: '悦视觉',
		email: '20170828@qq.com',
		telphone: '19920170828',
		mobile: '19920170828',
		post: '100123',
		logo: 'http://www.yuanad.net/imageRepository/8ec0e47a-12c9-491d-9956-6751917d7613.jpg',
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
const UserList = [];
for(let i = 0; i < 6; i++) {
	UserList.push(Mock.mock({
		userId: Mock.Random.id(),
		name: Mock.Random.cname(),
		email: Mock.mock('@string("number", 7)') + '@163.com',
		mobile: '13' + Mock.mock('@string("number", 9)'),
		address: Mock.mock('@city'),
		createTime: new Date(2017, Math.floor(Math.random()*8), Math.floor(Math.random()*30)),
		gender: Mock.Random.integer(0, 1)
	}))
}
const OrganizeList = [
	{ orgId: 1, parentId: 0, name: '我的企业', open: true },
	{ orgId: 101, parentId: 1, name: '运营部', note: '运营部101', status: 1 },
	{ orgId: 102, parentId: 1, name: '财务部', note: '财务部102', status: 1 },
	{ orgId: 103, parentId: 1, name: '技术部', note: '技术部103', status: 1 },
	{ orgId: 104, parentId: 1, name: '销售部', note: '销售部104', status: 1 },
	{ orgId: 1011, parentId: 101, name: '客服部', note: '客服部1011', status: 1 },
	{ orgId: 1012, parentId: 101, name: '设计部', note: '设计部1012', status: 1 },
	{ orgId: 1021, parentId: 102, name: '结算部', note: '结算部1021', status: 1 },
	{ orgId: 1022, parentId: 102, name: '会计部', note: '会计部1022', status: 1 },
	{ orgId: 1031, parentId: 103, name: '开发部', note: '开发部1031', status: 1 },
	{ orgId: 1032, parentId: 103, name: '运维部', note: '运维部1032', status: 1 },
	{ orgId: 1041, parentId: 104, name: '客服部', note: '客服部1041', status: 1 },
	{ orgId: 1042, parentId: 104, name: '设计部', note: '设计部1042', status: 1 },
];
const OrganizeTree = [
	{
		orgId: 100,
		name: '我的企业',
		children: [
			{
				parentId: 1000,
				orgId: 1001,
				name: '运营部',
				children: [
					{
						parentId: 1001,
						orgId: 10011,
						name: '设计部',
					},
				]
			},
			{
				parentId: 1000,
				orgId: 1002,
				name: '销售部',
				children: [
					{
						parentId: 1002,
						orgId: 10021,
						name: '设计部',
					},
				]
			},
			{
				parentId: 1000,
				orgId: 1003,
				name: '财务部',
				children: [
					{
						parentId: 1003,
						orgId: 10031,
						name: '会计部',
					},
				]
			},
			{
				parentId: 1000,
				orgId: 1004,
				name: '技术部',
				children: [
					{
						parentId: 1004,
						orgId: 10041,
						name: '运维部',
					},
				]
			},
		]
	}
]
export {
	AdminList,
	UserList,
	PartnerList,
	OrganizeList
}