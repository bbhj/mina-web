/* Router Modules */
// import systemRouter from './system'
// import othersRouter from './others'

export default [
  /** when your routing map is too long, you can split it into small modules **/
  // systemRouter,
  // othersRouter,

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]
