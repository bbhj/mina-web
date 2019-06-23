import Layout from '@/layout'

export default [
  {
    path: '/system',
    name: 'system',
    component: Layout,
    redirect: 'noredirect'
  },
  // 用户管理
  {
    path: '/system/user',
    name: 'system.user.layout',
    component: () => import('@/views/system/user/layout'),
    redirect: '/system/user/index',
    meta: {}
  },
  {
    path: '/system/user/index',
    name: 'system.user.index',
    component: () => import('@/views/system/user/index'),
    meta: {
      noCache: true
    },
    hidden: true
  },
  {
    path: '/system/user/create',
    name: 'system.user.create',
    component: () => import('@/views/system/user/create'),
    hidden: true
  },
  {
    path: '/system/user/edit/:id(\\d+)',
    name: 'system.user.edit',
    component: () => import('@/views/system/user/edit'),
    hidden: true
  },
  // 角色管理
  {
    path: '/system/role',
    name: 'system.role.layout',
    component: () => import('@/views/system/role/layout'),
    redirect: '/system/role/index',
    meta: {}
  },
  {
    path: '/system/role/index',
    name: 'system.role.index',
    component: () => import('@/views/system/role/index'),
    props: (route) => {
      return {
        type: 'tow_team'
      }
    },
    hidden: true
  },
  {
    path: '/system/role/create',
    name: 'system.role.create',
    component: () => import('@/views/system/role/create'),
    hidden: true
  },
  {
    path: '/system/role/edit/:id(\\d+)',
    name: 'system.role.edit',
    component: () => import('@/views/system/role/edit'),
    hidden: true
  },
  // 组织管理
  {
    path: '/system/group',
    name: 'system.group.layout',
    component: () => import('@/views/system/group/layout'),
    redirect: '/system/group/index',
    meta: {}
  },
  {
    path: '/system/group/index',
    name: 'system.group.index',
    component: () => import('@/views/system/group/index'),
    props: (route) => {
      return {
        type: 'tow_team'
      }
    },
    hidden: true
  },
  {
    path: '/system/group/create',
    name: 'system.group.create',
    component: () => import('@/views/system/group/create'),
    hidden: true
  },
  {
    path: '/system/group/edit/:id(\\d+)',
    name: 'system.group.edit',
    component: () => import('@/views/system/group/edit'),
    hidden: true
  }
]
