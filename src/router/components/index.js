/* Router Modules */
import system from './system'
import others from './others'

export default [
  /** when your routing map is too long, you can split it into small modules **/
  ...system,
  ...others,

  { path: '*', redirect: '/404', hidden: true }
]
