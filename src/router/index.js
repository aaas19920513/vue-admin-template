import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },

  {
    path: '/Api',
    component: Layout,
    redirect: '/Api/table',
    name: 'Example',
    meta: { title: 'Api管理', icon: 'example' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/mytable/index2'),
        meta: { title: 'Api列表', icon: 'table' }
      },
      {
        path: 'getCase',
        name: 'getCase',
        component: () => import('@/views/tree/index'),
        meta: { title: 'Case列表', icon: 'tree' }
      }
    ]
  },

  {
    path: '/',
    component: Layout,
    redirect: '/testsuite',
    children: [{
      path: 'testsuite',
      name: 'testsuite',
      component: () => import('@/views/testsuite/suite'),
      meta: { title: 'TestSuite', icon: 'dashboard' }
    },
    {
      path: 'suiteDetail',
      name: 'suiteDetail',
      component: () => import('@/views/testsuite/detail'),
      hidden: true
    }
    ]
  },

  // caseStep
  {
    path: '/step',
    component: Layout,
    children: [
      {
        path: 'get',
        name: 'StepDetail',
        component: () => import('@/views/casestep/stepDetail4'),
        hidden: true
      }
    ]
  },

  {
    path: '/mutable',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'mutable',
        component: () => import('@/views/mytable/index2'),
        meta: { title: 'Api列表', icon: 'form' }
      }
    ]
  },

  {
    path: '/test',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'test',
        component: () => import('@/views/casestep/stepDetail'),
        meta: { title: 'test', icon: 'form' }
      }
    ]
  },
  {
    path: '/report',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'report',
        component: () => import('@/views/httprunner/DebugReport'),
        meta: { title: 'report', icon: 'form' }
      }
    ]
  },

  {
    path: '/debug',
    component: Layout,
    children: [
      {
        path: 'debug',
        name: 'debug',
        component: () => import('@/views/debug/debug3'),
        meta: { title: 'debug', icon: 'form' }
      }
    ]
  },
  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
