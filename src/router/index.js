import Layout from '@/components/Layout'
import Login from '@/pages/login'
import CASLogin from '@/pages/casLogin'
import Register from '@/pages/register'
import NotFound from '@/pages/NotFound'
import NoPermission from '@/pages/NoPermission'
import Welcome from '@/pages/welcome'

import BaseFindPasswd from '@/pages/base/findpasswd'
import BaseSendEmail from '@/pages/base/sendemail'
import BaseVerifyEmail from '@/pages/base/verifyemail'
import BaseResetPasswd from '@/pages/base/resetpasswd'
import BaseResetSuccess from '@/pages/base/resetsuccess'

import AccountCenter from '@/pages/account/infocenter'
import AccountSettings from '@/pages/account/settings'
import RegistedPartner from '@/pages/account/registedpartner'
import WaittingVerify from '@/pages/account/waittingverify'

import PartnerEdit from '@/pages/partner/partneredit'
import PartnerOrgManage from '@/pages/partner/orgmanage'
import PartnerTitleManage from '@/pages/partner/titlemanage'

import AdminPartnerManage from '@/pages/admin/partnermanage'
import AdminPartnerVerify from '@/pages/admin/partnerverify'
import AdminContractManage from '@/pages/admin/contractmanage'

import SystemFuncManage from '@/pages/system/funcmanage'
import SystemRoleManage from '@/pages/system/rolemanage'
import SystemTemplateManage from '@/pages/system/templatemanage'
import SystemPartnerTypeManage from '@/pages/system/partnertypemanage'

const routes = [
  {
    path: '/',
    redirect: '/account/infocenter'
  },
  {
    path: '/login',
    name: '欢迎登录',
    component: Login
  },
  {
    path: '/register',
    name: '欢迎注册',
    component: Register
  },
  {
    path: '/findpasswd',
    component: BaseFindPasswd,
    children: [
      { path: '/', name: '找回密码', component: BaseSendEmail },
      { path: '/verifyemail', name: '发送邮件', component: BaseVerifyEmail },
      { path: '/resetpasswd', name: '重置密码', component: BaseResetPasswd },
      { path: '/resetsuccess', name: '重置密码成功', component: BaseResetSuccess },
    ]
  },
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: 'welcome',
        name: '欢迎',
        component: Welcome
      }
    ]
  },
  {
    path: '/account',
    name: '我的账户',
    component: Layout,
    children: [
    	{
    		path: 'infocenter',
        name: '账户中心',
    		component: AccountCenter
    	},
      {
        path: 'settings',
        name: '账户设置',
        component: AccountSettings
      },
      {
        path: 'registedpartner',
        name: '注册我的企业',
        component: RegistedPartner
      },
      {
        path: 'waittingverify',
        name: '等待企业审核',
        component: WaittingVerify
      },
    ]
  },
  {
    path: '/partner',
    name: '企业管理',
    component: Layout,
    children: [
      {
        path: 'infoedit',
        name: '信息编辑',
        component: PartnerEdit,
      },
      {
        path: 'organizemanage',
        name: '组织部门管理',
        component: PartnerOrgManage,
      },
      {
        path: 'titlemanage',
        name: '职位管理',
        component: PartnerTitleManage,
      },
    ]
  },
  {
    path: '/admin',
    name: '我的商家',
    component: Layout,
    children: [
      {
        path: 'partnerverify',
        name: '商家审核',
        component: AdminPartnerVerify,
      },
      {
        path: 'partnermanage',
        name: '商家管理',
        component: AdminPartnerManage,
      },
      {
        path: 'contractmanage',
        name: '合同管理',
        component: AdminContractManage,
      },
    ]
  },
  {
    path: '/system',
    name: '系统管理',
    component: Layout,
    children: [
      {
        path: 'funcmanage',
        name: '功能管理',
        component: SystemFuncManage,
      },
      {
        path: 'rolemanage',
        name: '角色管理',
        component: SystemRoleManage,
      },
      {
        path: 'templatemanage',
        name: '合同模板管理',
        component: SystemTemplateManage,
      },
      {
        path: 'partnertypemanage',
        name: '商家类型管理',
        component: SystemPartnerTypeManage,
      },
    ]
  },
  {
    path: '/NoPermission',
    name: 'nopermission',
    component: NoPermission
  },
  {
    path: '/NotFound',
    name: 'notfound',
    component: NotFound
  },
  {
  	path: '*',
  	redirect: '/NotFound'
  }
]
export default routes
