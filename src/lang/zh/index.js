import { merge } from 'lodash'
import { mergeParts } from './utils'
import common from './common'
import system from './system/index'
import others from './others'

export default merge(
  mergeParts('system', '系统管理', system),
  mergeParts('others', '其它管理', others),
  {
    common,
    route: {
      dashboard: '首页',
      Dashboard: '首页',
      backToTop: '返回顶部',
      charts: '图表',
      Table: 'Table',
      errorPages: '错误页面',
      page401: '401',
      page404: '404',
      errorLog: '错误日志',
      excel: 'Excel',
      exportExcel: '导出 Excel',
      selectExcel: '导出 已选择项',
      mergeHeader: '导出 多级表头',
      uploadExcel: '上传 Excel',
      zip: 'Zip',
      pdf: 'PDF',
      exportZip: 'Export Zip',
      theme: '换肤',
      clipboardDemo: 'Clipboard',
      i18n: '国际化',
      externalLink: '外链'
    },
    navbar: {
      logOut: '退出登录',
      dashboard: '首页',
      github: '项目地址',
      theme: '换肤',
      size: '布局大小'
    },
    login: {
      title: '系统登录',
      logIn: '登录',
      username: '账号',
      password: '密码',
      capsLockIsOn: '大小写锁定已打开',
      any: '随便填',
      thirdparty: '第三方登录',
      thirdpartyTips: '本地不能模拟，请结合自己业务进行模拟！！！'
    },
    errorLog: {
      tips: '请点击右上角bug小图标',
      description: '现在的管理后台基本都是spa的形式了，它增强了用户体验，但同时也会增加页面出问题的可能性，可能一个小小的疏忽就导致整个页面的死锁。好在 Vue 官网提供了一个方法来捕获处理异常，你可以在其中进行错误处理或者异常上报。',
      documentation: '文档介绍'
    },
    excel: {
      export: '导出',
      selectedExport: '导出已选择项',
      placeholder: '请输入文件名(默认excel-list)'
    },
    zip: {
      export: '导出',
      placeholder: '请输入文件名(默认file)'
    },
    pdf: {
      tips: '这里使用   window.print() 来实现下载pdf的功能'
    },
    theme: {
      change: '换肤',
      documentation: '换肤文档',
      tips: 'Tips: 它区别于 navbar 上的 theme-pick, 是两种不同的换肤方法，各自有不同的应用场景，具体请参考文档。'
    },
    tagsView: {
      refresh: '刷新',
      close: '关闭',
      closeOthers: '关闭其它',
      closeAll: '关闭所有'
    },
    settings: {
      title: '系统布局配置',
      theme: '主题色',
      tagsView: '开启 Tags-View',
      fixedHeader: '固定 Header',
      sidebarLogo: '侧边栏 Logo'
    }
  }
)
