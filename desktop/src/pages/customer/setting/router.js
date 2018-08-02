/* eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'
import MpAuthorize from '@/components/customer/setting/MpAuthorize'
import MpExamine from '@/components/customer/setting/MpExamine'
import PayConfig from '@/components/customer/setting/PayConfig'
import ManageSubaccount from '@/components/customer/setting/ManageSubaccount'
import ManageTemplate from '@/components/customer/setting/ManageTemplate'
import CreateTemplate from '@/components/customer/setting/managetemplate/CreateTemplate'
import ManagePosition from '@/components/customer/setting/ManagePosition'
import CreatePosition from '@/components/customer/setting/manageposition/CreatePosition'
import ModifyPosition from '@/components/customer/setting/manageposition/ModifyPosition'
import ModifyTemplate from '@/components/customer/setting/managetemplate/ModifyTemplate'
import ModifyPwd from '@/components/customer/setting/ModifyPwd'
import ShareContent from '@/components/customer/setting/ShareContent'
import CustomerTool from '@/components/customer/setting/CustomerTool'

Vue.use(Router)
let router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/mpauthorize'
    },
    {
      path: '/mpauthorize',
      component: MpAuthorize,
      meta: { title: '小程序管理' }
    },
    {
      path: '/mpexamine',
      component: MpExamine,
      meta: { title: '小程序审核' }
    },
    {
      path: '/payconfig',
      component: PayConfig,
      meta: { title: '支付配置' }
    },
    {
      path: '/managesubaccount',
      component: ManageSubaccount,
      meta: { title: '子账号管理' }
    },
    {
      path: '/sharecontent',
      component: ShareContent,
      meta: { title: '分享内容' }
    },
    {
      path: '/customertool',
      component: CustomerTool,
      meta: { title: '客服工具' }
    },
    {
      path: '/modifypwd',
      component: ModifyPwd,
      meta: { title: '修改密码' }
    },
    {
      path: '/managetemplate',
      component: ManageTemplate,
      meta: { title: '模板管理' },
      name: 'managetemplate',
      children: [
        { 
          path: 'createtemplate', component: CreateTemplate,
          meta: { title: '新建运费模板' }
        },
        {
          path: 'modifytemplate', component: ModifyTemplate,
          meta: { title: '编辑运费模板' }
        }
      ]
    },
    {
      path: '/manageposition',
      component: ManagePosition,
      meta: { title: '职位管理' },
      name: 'manageposition',
      children: [
        {
          path: 'createposition', component: CreatePosition,
          meta: { title: '添加职位' }
        },
        {
          path: 'modifyposition', component: ModifyPosition,
          meta: { title: '修改职位' }
        }
      ]
    }
  ]
})
router.afterEach(to => { document.title = to.meta.title })
export default router