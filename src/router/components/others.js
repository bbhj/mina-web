import Layout from '@/layout'

export default [
  {
    path: '/others',
    name: 'others',
    component: Layout,
    redirect: 'noredirect'
  },
  {
    path: '/others/upload',
    name: 'others.upload.layout',
    component: () => import('@/views/others/upload/layout'),
    redirect: '/others/upload/index',
    meta: {}
  },
  {
    path: '/others/upload/index',
    name: 'others.upload.index',
    components: {
      default: () => import('@/views/others/upload/index'),
      create: () => import('@/views/others/upload/create'),
      edit: () => import('@/views/others/upload/edit')
    },
    hidden: true
  },
  {
    path: '/others/upload/edit/:id(\\d+)',
    name: 'others.upload.edit',
    component: () => import('@/views/others/upload/edit'),
    hidden: true
  }
]
