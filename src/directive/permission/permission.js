import store from '@/store'
import { hasSuperRole } from '@/utils/permission' // check has super role

const cmpkPermission = (list, perms) => {
  return perms.some(role => {
    return list.includes(role)
  })
}

export const checkPermission = value => {
  if (value && value instanceof Array && value.length > 0) {
    const hasNamePermission = cmpkPermission(store.state.permission && store.state.permission.permissions, value)
    const hasSuperRolePermission = hasSuperRole(store.state.passport.roles)
    const hasRolePermission = cmpkPermission(store.state.passport && store.state.passport.roles, value)

    return hasNamePermission || hasSuperRolePermission || hasRolePermission
  } else {
    throw new Error(`need roles! Like v-permission="['admin','editor']"`)
  }
}

export default {
  inserted: (el, binding, vnode) => {
    const { value } = binding
    const hasPermission = checkPermission(value)

    if (!hasPermission) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
}
