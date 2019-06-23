import { assign, merge, find, camelCase, trimStart } from 'lodash'
import { asyncRoutes, buildRoutes, constantRoutes } from '@/router'
import { hasSuperRole } from '@/utils/permission' // check has super role

const namePrefix = 'api.'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  if (routes) {
    routes.forEach(route => {
      const tmp = { ...route }
      if (hasPermission(roles, tmp)) {
        if (tmp.children) {
          tmp.children = filterAsyncRoutes(tmp.children, roles)
        }
        res.push(tmp)
      }
    })
  }

  return res
}

/**
 * 通过 menu 自建路由树
 * @param routes buildRoutes
 * @param menus
 */
function buildAsyncRouter(routes, menus) {
  const res = []
  if (menus) {
    menus.forEach(menu => {
      const name = trimStart(menu.name, namePrefix)
      let route = find(routes, { name })
      if (route) {
        const permMenus = menu.permissions.map(perm => {
          const permName = trimStart(perm.name, namePrefix)
          return find(routes, { name: permName })
        }).filter(item => item)
        if (menu.children) {
          route = assign(route, {
            // path: menu.uri,
            meta: merge(route.mate, {
              title: camelCase(name),
              icon: menu.icon || ''
            }),
            children: merge(buildAsyncRouter(routes, menu.children), permMenus)
          })
        }
        res.push(route)
      } else {
        console.warn(`${menu.name} can not found.`)
      }
    })
  }
  return res
}

const state = {
  permissions: [],
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_PERMISSIONS: (state, { menus, routes }) => {
    const getMenuNames = list => {
      return list
        ? list.reduce((total, item) => {
          if (item.name) {
            total = total.concat(trimStart(item.name, namePrefix))
          }
          if (item.permissions) {
            total = total.concat(item.permissions.map(perm => trimStart(perm.name, namePrefix)))
          }
          total = total.concat(getMenuNames(item.children))
          return total
        }, [])
        : []
    }
    const getRouteNames = list => {
      return list
        ? list.reduce((total, item) => {
          if (item.name) {
            total = total.concat(trimStart(item.name, namePrefix))
          }
          total = total.concat(getRouteNames(item.children))
          return total
        }, [])
        : []
    }
    state.permissions = []
      .concat(getMenuNames(menus))
      .concat(getRouteNames(routes))
  },
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, data) {
    return new Promise(resolve => {
      const { roles, menus } = data
      let accessedRoutes
      if (hasSuperRole(roles)) {
        accessedRoutes = asyncRoutes
      } else if (menus && menus.length > 0) {
        accessedRoutes = buildAsyncRouter(buildRoutes, menus)
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      // console.log('generateRoutes', accessedRoutes, roles)
      commit('SET_ROUTES', accessedRoutes)
      commit('SET_PERMISSIONS', { menus, routes: accessedRoutes })
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
