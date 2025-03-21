import Vue from 'vue'
import router from './router'
import store from './store'

import NProgress from 'nprogress' // progress bar
import '@/components/NProgress/nprogress.less' // progress bar custom style
import notification from 'ant-design-vue/es/notification'
import { setDocumentTitle, domTitle } from '@/utils/domUtil'
import { ACCESS_TOKEN } from '@/store/mutation-types'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['login', 'register', 'registerResult'] // no redirect whitelist
const defaultRoutePath = '/dashboard/workplace'

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  to.meta && (typeof to.meta.title !== 'undefined' && setDocumentTitle(`${to.meta.title} - ${domTitle}`))
  if (Vue.ls.get(ACCESS_TOKEN)) {
    /* has token */
    if (to.path === '/user/login') {
      next({ path: defaultRoutePath })
      NProgress.done()
    } else {
      if (store.getters.roles.length === 0) {
        store
          .dispatch('GetInfo')
          .then(res => {
            // const menus = res.data && res.data.menus
            const menus = [
              // dashboard
              {
                'name': 'dashboard',
                'parentId': 0,
                'id': 1,
                'meta': {
                  'icon': 'dashboard',
                  'title': '仪表盘',
                  'show': true
                },
                'component': 'RouteView',
                'redirect': '/dashboard/workplace'
              },
              {
                'name': 'workplace',
                'parentId': 1,
                'id': 7,
                'meta': {
                  'title': '工作台',
                  'show': true
                },
                'component': 'Workplace'
              },
              {
                'name': 'monitor',
                'path': 'https://www.baidu.com/',
                'parentId': 1,
                'id': 3,
                'meta': {
                  'title': '监控页（外部）',
                  'target': '_blank',
                  'show': true
                }
              },
              {
                'name': 'Analysis',
                'parentId': 1,
                'id': 2,
                'meta': {
                  'title': '分析页',
                  'show': true
                },
                'component': 'Analysis',
                'path': '/dashboard/analysis'
              },
              {
                'name': 'tests',
                'parentId': 1,
                'id': 8,
                'meta': {
                  'title': '测试功能',
                  'show': true
                },
                'component': 'TestWork'
              },

              // form
              {
                'name': 'form',
                'parentId': 0,
                'id': 10,
                'meta': {
                  'icon': 'form',
                  'title': '表单页'
                },
                'redirect': '/form/base-form',
                'component': 'PageView'
              },
              {
                'name': 'basic-form',
                'parentId': 10,
                'id': 6,
                'meta': {
                  'title': '基础表单'
                },
                'component': 'BasicForm'
              },
              {
                'name': 'step-form',
                'parentId': 10,
                'id': 5,
                'meta': {
                  'title': '分步表单'
                },
                'component': 'StepForm'
              },
              {
                'name': 'advanced-form',
                'parentId': 10,
                'id': 4,
                'meta': {
                  'title': '高级表单'
                },
                'component': 'AdvanceForm'
              },

              // list
              {
                'name': 'list',
                'parentId': 0,
                'id': 10010,
                'meta': {
                  'icon': 'table',
                  'title': '列表页',
                  'show': true
                },
                'redirect': '/list/table-list',
                'component': 'PageView'
              },
              {
                'name': 'table-list',
                'parentId': 10010,
                'id': 10011,
                'path': '/list/table-list/:pageNo([1-9]\\d*)?',
                'meta': {
                  'title': '查询表格',
                  'show': true
                },
                'component': 'TableList'
              },
              {
                'name': 'basic-list',
                'parentId': 10010,
                'id': 10012,
                'meta': {
                  'title': '标准列表',
                  'show': true
                },
                'component': 'StandardList'
              },
              {
                'name': 'card',
                'parentId': 10010,
                'id': 10013,
                'meta': {
                  'title': '卡片列表',
                  'show': true
                },
                'component': 'CardList'
              },
              {
                'name': 'search',
                'parentId': 10010,
                'id': 10014,
                'meta': {
                  'title': '搜索列表',
                  'show': true
                },
                'redirect': '/list/search/article',
                'component': 'SearchLayout'
              },
              {
                'name': 'article',
                'parentId': 10014,
                'id': 10015,
                'meta': {
                  'title': '搜索列表（文章）',
                  'show': true
                },
                'component': 'SearchArticles'
              },
              {
                'name': 'project',
                'parentId': 10014,
                'id': 10016,
                'meta': {
                  'title': '搜索列表（项目）',
                  'show': true
                },
                'component': 'SearchProjects'
              },
              {
                'name': 'application',
                'parentId': 10014,
                'id': 10017,
                'meta': {
                  'title': '搜索列表（应用）',
                  'show': true
                },
                'component': 'SearchApplications'
              },

              // profile
              {
                'name': 'profile',
                'parentId': 0,
                'id': 10018,
                'meta': {
                  'title': '详情页',
                  'icon': 'profile',
                  'show': true
                },
                'redirect': '/profile/basic',
                'component': 'RouteView'
              },
              {
                'name': 'basic',
                'parentId': 10018,
                'id': 10019,
                'meta': {
                  'title': '基础详情页',
                  'show': true
                },
                'component': 'ProfileBasic'
              },
              {
                'name': 'advanced',
                'parentId': 10018,
                'id': 10020,
                'meta': {
                  'title': '高级详情页',
                  'show': true
                },
                'component': 'ProfileAdvanced'
              },

              // system
              {
                'name': 'system',
                'parentId': 0,
                'id': 200,
                'meta': {
                  'title': '系统管理',
                  'icon': 'profile',
                  'show': true
                },
                'redirect': '/system/user',
                'component': 'RouteView'
              },
              {
                'name': 'user',
                'parentId': 200,
                'id': 20001,
                'meta': {
                  'title': '用户管理',
                  'show': true
                },
                'component': 'User'
              },
              {
                'name': 'role',
                'parentId': 200,
                'id': 20002,
                'meta': {
                  'title': '角色管理',
                  'show': true
                },
                'component': 'Role'
              },

              // result
              {
                'name': 'result',
                'parentId': 0,
                'id': 10021,
                'meta': {
                  'title': '结果页',
                  'icon': 'check-circle-o',
                  'show': true
                },
                'redirect': '/result/success',
                'component': 'PageView'
              },
              {
                'name': 'success',
                'parentId': 10021,
                'id': 10022,
                'meta': {
                  'title': '成功',
                  'hiddenHeaderContent': true,
                  'show': true
                },
                'component': 'ResultSuccess'
              },
              {
                'name': 'fail',
                'parentId': 10021,
                'id': 10023,
                'meta': {
                  'title': '失败',
                  'hiddenHeaderContent': true,
                  'show': true
                },
                'component': 'ResultFail'
              },

              // Exception
              {
                'name': 'exception',
                'parentId': 0,
                'id': 10024,
                'meta': {
                  'title': '异常页',
                  'icon': 'warning',
                  'show': true
                },
                'redirect': '/exception/403',
                'component': 'RouteView'
              },
              {
                'name': '403',
                'parentId': 10024,
                'id': 10025,
                'meta': {
                  'title': '403',
                  'show': true
                },
                'component': 'Exception403'
              },
              {
                'name': '404',
                'parentId': 10024,
                'id': 10026,
                'meta': {
                  'title': '404',
                  'show': true
                },
                'component': 'Exception404'
              },
              {
                'name': '500',
                'parentId': 10024,
                'id': 10027,
                'meta': {
                  'title': '500',
                  'show': true
                },
                'component': 'Exception500'
              },

              // account
              {
                'name': 'account',
                'parentId': 0,
                'id': 10028,
                'meta': {
                  'title': '个人页',
                  'icon': 'user',
                  'show': true
                },
                'redirect': '/account/center',
                'component': 'RouteView'
              },
              {
                'name': 'center',
                'parentId': 10028,
                'id': 10029,
                'meta': {
                  'title': '个人中心',
                  'show': true
                },
                'component': 'AccountCenter'
              },
              // 特殊三级菜单
              {
                'name': 'settings',
                'parentId': 10028,
                'id': 10030,
                'meta': {
                  'title': '个人设置',
                  'hideHeader': true,
                  'hideChildren': true,
                  'show': true
                },
                'redirect': '/account/settings/base',
                'component': 'AccountSettings'
              },
              {
                'name': 'BaseSettings',
                'path': '/account/settings/base',
                'parentId': 10030,
                'id': 10031,
                'meta': {
                  'title': '基本设置',
                  'show': false
                },
                'component': 'BaseSettings'
              },
              {
                'name': 'SecuritySettings',
                'path': '/account/settings/security',
                'parentId': 10030,
                'id': 10032,
                'meta': {
                  'title': '安全设置',
                  'show': false
                },
                'component': 'SecuritySettings'
              },
              {
                'name': 'CustomSettings',
                'path': '/account/settings/custom',
                'parentId': 10030,
                'id': 10033,
                'meta': {
                  'title': '个性化设置',
                  'show': false
                },
                'component': 'CustomSettings'
              },
              {
                'name': 'BindingSettings',
                'path': '/account/settings/binding',
                'parentId': 10030,
                'id': 10034,
                'meta': {
                  'title': '账户绑定',
                  'show': false
                },
                'component': 'BindingSettings'
              },
              {
                'name': 'NotificationSettings',
                'path': '/account/settings/notification',
                'parentId': 10030,
                'id': 10034,
                'meta': {
                  'title': '新消息通知',
                  'show': false
                },
                'component': 'NotificationSettings'
              }
            ]
            store.dispatch('GenerateRoutes', { menus }).then(() => {
              // 根据roles权限生成可访问的路由表
              // 动态添加可访问路由表
              router.addRoutes(store.getters.addRouters)
              const redirect = decodeURIComponent(from.query.redirect || to.path)
              if (to.path === redirect) {
                // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
                next({ ...to, replace: true })
              } else {
                // 跳转到目的路由
                next({ path: redirect })
              }
            })
          })
          .catch(() => {
            notification.error({
              message: '错误',
              description: '请求用户信息失败，请重试'
            })
            store.dispatch('Logout').then(() => {
              next({ path: '/user/login', query: { redirect: to.fullPath } })
            })
          })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.includes(to.name)) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next({ path: '/user/login', query: { redirect: to.fullPath } })
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
