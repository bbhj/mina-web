import store from '@/store'

const superRoles = ['root']

/**
 * @param {Array} roles
 * @returns {Boolean}
 */
export function hasSuperRole(roles) {
  return superRoles.some(role => {
    return roles.includes(role)
  })
}

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    const roles = store.getters && store.getters.roles
    const permissionRoles = value

    const hasPermission = roles.some(role => {
      return permissionRoles.includes(role)
    })

    if (!hasPermission) {
      return false
    }
    return true
  } else {
    console.error(`need roles! Like v-permission="['admin','editor']"`)
    return false
  }
}

/**
 * @param Number group_id
 * @param string value
 * @returns {Boolean}
 */
export function checkGroupValue(group_id, value) {
  let result = false
  store.getters.groups.forEach(item => {
    if (item.group_id === group_id && item.value === value) {
      result = true
    }
  })
  if (!result) {
    result = hasSuperRole(store.getters.roles)
  }
  return result
}
