import { camelCase } from 'lodash'
import Layout from '@/layout'

export default {
  path: '/system',
  name: 'system',
  component: Layout,
  redirect: 'noredirect',
  meta: {
    title: camelCase('system'),
    icon: 'component',
    roles: ['root']
  },
  children: [
    {
      path: 'user',
      name: 'system.user.layout',
      component: () => import('@/views/system/user/layout'),
      redirect: '/system/user/index',
      meta: {
        title: camelCase('system.user.layout'),
        icon: 'peoples'
      },
      children: [
        {
          path: 'index',
          name: 'system.user.index',
          component: () => import('@/views/system/user/index'),
          meta: {
            title: camelCase('system.user.index'),
            icon: 'user',
            noCache: true
          },
          hidden: true
        },
        {
          path: 'edit/:id(\\d+)',
          name: 'system.user.edit',
          component: () => import('@/views/system/user/edit'),
          meta: {
            title: camelCase('system.user.edit'),
            noCache: true
          },
          hidden: true
        }
      ]
    },
    {
      path: 'role',
      name: 'system.role.layout',
      component: () => import('@/views/system/role/layout'),
      redirect: '/system/role/index',
      meta: {
        title: camelCase('system.role.layout'),
        icon: 'tree'
      },
      children: [
        {
          path: 'index',
          name: 'system.role.index',
          components: {
            default: () => import('@/views/system/role/index'),
            create: () => import('@/views/system/role/create'),
            edit: () => import('@/views/system/role/edit')
          },
          meta: {
            title: camelCase('system.role.index'),
            icon: 'role',
            noCache: true
          },
          hidden: true
        },
        {
          path: 'edit/:id(\\d+)',
          name: 'system.role.edit',
          component: () => import('@/views/system/role/edit'),
          meta: {
            title: camelCase('system.role.edit'),
            noCache: true
          },
          hidden: true
        }
      ]
    },
    {
      path: 'menu',
      component: () => import('@/views/system/menu/layout'), // Parent router-view
      name: 'system.menu.layout',
      redirect: '/system/menu/index',
      meta: {
        title: camelCase('system.menu.layout'),
        icon: 'nested',
        noCache: true,
        roles: []
      },
      children: [
        {
          path: 'index',
          name: 'system.menu.index',
          component: () => import('@/views/system/menu/index'),
          meta: {
            title: camelCase('system.menu.index'),
            noCache: true,
            breadcrumb: false
          }
        },
        {
          path: 'edit/:id(\\d+)',
          component: () => import('@/views/system/menu/edit'),
          name: 'system.menu.edit',
          meta: {
            title: camelCase('system.menu.edit'),
            noCache: true
          },
          hidden: true
        }
      ]
    },
    {
      path: 'group',
      name: 'system.group.layout',
      component: () => import('@/views/system/group/layout'),
      redirect: '/system/group/index',
      meta: {
        title: camelCase('system.group.layout'),
        icon: 'tree'
      },
      children: [
        {
          path: 'index',
          name: 'system.group.index',
          components: {
            default: () => import('@/views/system/group/index'),
            create: () => import('@/views/system/group/create'),
            edit: () => import('@/views/system/group/edit')
          },
          meta: {
            title: camelCase('system.group.index'),
            icon: 'group',
            noCache: true
          },
          hidden: true
        },
        {
          path: 'edit/:id(\\d+)',
          name: 'system.group.edit',
          component: () => import('@/views/system/group/edit'),
          meta: {
            title: camelCase('system.group.edit'),
            noCache: true
          },
          hidden: true
        }
      ]
    },
    {
      path: 'permission',
      component: () => import('@/views/system/permission/layout'), // Parent router-view
      name: 'system.permission.layout',
      redirect: '/system/permission/index',
      meta: {
        title: camelCase('system.permission.layout'),
        icon: 'password',
        noCache: true,
        roles: []
      },
      children: [
        {
          path: 'index',
          name: 'system.permission.index',
          component: () => import('@/views/system/permission/index'),
          meta: {
            title: camelCase('system.permission.index'),
            noCache: true,
            breadcrumb: false
          }
        },
        {
          path: 'edit/:id(\\d+)',
          component: () => import('@/views/system/permission/edit'),
          name: 'system.permission.edit',
          meta: {
            title: camelCase('system.permission.edit'),
            noCache: true
          },
          hidden: true
        }
      ]
    },
    {
      path: 'config',
      name: 'system.config.layout',
      component: () => import('@/views/system/config/layout'),
      redirect: '/system/config/index',
      meta: {
        title: camelCase('system.config.layout'),
        icon: 'table'
      },
      children: [
        {
          path: 'index',
          name: 'system.config.index',
          components: {
            default: () => import('@/views/system/config/index'),
            create: () => import('@/views/system/config/create'),
            edit: () => import('@/views/system/config/edit')
          },
          meta: {
            title: camelCase('system.config.index'),
            icon: 'config',
            noCache: true
          },
          hidden: true
        },
        {
          path: 'edit/:id(\\d+)',
          name: 'system.config.edit',
          component: () => import('@/views/system/config/edit'),
          meta: {
            title: camelCase('system.config.edit'),
            noCache: true
          },
          hidden: true
        }
      ]
    },
    {
      path: 'scheduling',
      component: () => import('@/views/system/scheduling/layout'), // Parent router-view
      name: 'system.scheduling',
      redirect: '/system/scheduling/index',
      meta: {
        title: camelCase('system.scheduling.layout'),
        icon: 'list',
        noCache: true,
        roles: []
      },
      children: [
        {
          path: 'index',
          name: 'system.scheduling.index',
          component: () => import('@/views/system/scheduling/index'),
          meta: {
            title: camelCase('system.scheduling.index'),
            noCache: true,
            breadcrumb: false
          }
        }
      ]
    },
    {
      path: 'operation-log',
      component: () => import('@/views/system/operation-log/layout'), // Parent router-view
      name: 'system.operation-log',
      redirect: '/system/operation-log/index',
      meta: {
        title: camelCase('system.operationLog.layout'),
        icon: 'form',
        noCache: true,
        roles: []
      },
      children: [
        {
          path: 'index',
          name: 'system.operation-log.index',
          component: () => import('@/views/system/operation-log/index'),
          meta: {
            title: camelCase('system.operationLog.index'),
            noCache: true,
            breadcrumb: false
          }
        }
      ]
    }
  ]
}
