import Layout from '@/components/Layout'

import Login from '@/pages/base/login'
import CASLogin from '@/pages/base/casLogin'
import Register from '@/pages/base/register'
import NotFound from '@/pages/base/NotFound'

import BaseFindPasswd from '@/pages/base/findpasswd'
import BaseSendEmail from '@/pages/base/sendemail'
import BaseVerifyEmail from '@/pages/base/verifyemail'
import BaseResetPasswd from '@/pages/base/resetpasswd'
import BaseResetSuccess from '@/pages/base/resetsuccess'

import AccountCenter from '@/pages/account/infocenter'
import AccountSettings from '@/pages/account/settings'
import AccountCreatePartner from '@/pages/account/createpartner'
import AccountWaittingVerify from '@/pages/account/waittingverify'

import PartnerInfo from '@/pages/partner/partnerinfo'
import PartnerEdit from '@/pages/partner/partneredit'
import PartnerOrgManage from '@/pages/partner/orgmanage'
import PartnerTitleManage from '@/pages/partner/titlemanage'
import PartnerCustomerManage from '@/pages/partner/customermanage'

import DomainPartnerManage from '@/pages/admin/partnermanage'
import DomainPartnerVerify from '@/pages/admin/partnerverify'
import DomainPortalVerify from '@/pages/admin/portalverify'
import DomainContractManage from '@/pages/admin/contractmanage'
import DomainVerifyInfo from '@/pages/admin/verifyinfo'
import DomainPartnerInfo from '@/pages/admin/partnerinfo'
import DomainPartStaffs from '@/pages/admin/partnerstaffs'

import AdminFuncManage from '@/pages/system/funcmanage'
import AdminRoleManage from '@/pages/system/rolemanage'
import AdminTemplateManage from '@/pages/system/templatemanage'
import AdminPartnerTypeManage from '@/pages/system/partnertypemanage'
import AdminAccountManage from '@/pages/system/accountmanage'


import ToolsFileUpload from '@/pages/tools/fileupload'

const routes = [
  {
    path: '/',
    redirect: '/account/infocenter'
  },
  {
    path: '/login',
    name: '悦视觉.登录',
    component: Login
    // component: CASLogin
  },
  {
    path: '/register',
    name: '悦视觉.注册',
    component: Register
  },
  {
    path: '/findpasswd',
    component: BaseFindPasswd,
    children: [
      { path: '/', name: '找回密码', component: BaseSendEmail },
      { path: '/verifyemail', name: '验证邮箱', component: BaseVerifyEmail },
      { path: '/resetpasswd', name: '重置密码', component: BaseResetPasswd },
      { path: '/resetsuccess', name: '重置密码成功', component: BaseResetSuccess },
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
        path: 'createpartner',
        name: '注册我的企业',
        component: AccountCreatePartner
      },
      {
        path: 'waittingverify',
        name: '等待企业审核',
        component: AccountWaittingVerify
      },
    ]
  },
  {
    path: '/partner',
    name: '企业管理',
    component: Layout,
    children: [
      {
        path: 'partnerinfo',
        name: '企业信息',
        component: PartnerInfo,
      },
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
      {
        path: 'customermanage',
        name: '商城客户管理',
        component: PartnerCustomerManage
      },
    ]
  },
  {
    path: '/domain',
    name: '我的商家',
    component: Layout,
    children: [
      {
        path: 'portalverify',
        name: '门户网站审核',
        component: DomainPortalVerify,
      },
      {
        path: 'partnerverify',
        name: '商家审核',
        component: DomainPartnerVerify,
      },
      {
        path: 'verifyinfo',
        name: '商家信息审核',
        component: DomainVerifyInfo,
      },
      {
        path: 'partnerinfo',
        name: '商家信息查看',
        component: DomainPartnerInfo,
      },
      {
        path: 'partnermanage',
        name: '商家管理',
        component: DomainPartnerManage,
      },
      {
        path: 'contractmanage',
        name: '合同管理',
        component: DomainContractManage,
      },
    ]
  },
  {
    path: '/admin',
    name: '系统管理',
    component: Layout,
    children: [
      {
        path: 'funcmanage',
        name: '功能管理',
        component: AdminFuncManage,
      },
      {
        path: 'rolemanage',
        name: '角色管理',
        component: AdminRoleManage,
      },
      {
        path: 'templatemanage',
        name: '合同模板管理',
        component: AdminTemplateManage,
      },
      {
        path: 'partnertypemanage',
        name: '商家类型管理',
        component: AdminPartnerTypeManage,
      },
      {
        path: 'accountmanage',
        name: '账户管理',
        component: AdminAccountManage,
      },
    ]
  },
  {
    path: '/domain/staffmanage',
    name: '企业员工列表',
    component: DomainPartStaffs
  },
  {
    path: '/tools',
    name: '系统工具',
    component: Layout,
    children: [
      {
        path: 'imageUpload',
        name: '图片上传',
        component: ToolsFileUpload
      }
    ]
  },
  {
    path: '*',
    name: '404',
    component: NotFound
  },
]
export default routes
