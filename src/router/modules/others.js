import { camelCase } from 'lodash'
import Layout from '@/layout'

export default {
  path: '/others',
  name: 'others',
  component: Layout,
  redirect: 'noredirect',
  meta: {
    title: camelCase('others'),
    icon: 'tab',
    roles: ['root']
  },
  children: [
    {
      path: 'upload',
      name: 'others.upload.layout',
      component: () => import('@/views/others/upload/layout'),
      redirect: '/others/upload/index',
      meta: {
        title: camelCase('others.upload.layout'),
        icon: 'documentation'
      },
      children: [
        {
          path: 'index',
          name: 'others.upload.index',
          components: {
            default: () => import('@/views/others/upload/index'),
            create: () => import('@/views/others/upload/create'),
            edit: () => import('@/views/others/upload/edit')
          },
          meta: {
            title: camelCase('others.upload.index'),
            icon: 'upload',
            noCache: true
          },
          hidden: true
        },
        {
          path: 'edit/:id(\\d+)',
          name: 'others.upload.edit',
          component: () => import('@/views/others/upload/edit'),
          meta: {
            title: camelCase('others.upload.edit'),
            noCache: true
          },
          hidden: true
        }
      ]
    }
  ]
}
