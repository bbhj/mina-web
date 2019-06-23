import permission, { checkPermission } from './permission'

const install = function(Vue) {
  Vue.directive('permission', permission)
  Vue.prototype.$hasPerm = checkPermission
}

if (window.Vue) {
  window['permission'] = permission
  Vue.use(install); // eslint-disable-line
  Vue.prototype.$hasPerm = checkPermission // eslint-disable-line
}

permission.install = install
export default permission
