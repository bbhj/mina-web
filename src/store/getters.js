const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.passport.token,
  avatar: state => state.passport.avatar,
  name: state => state.passport.name,
  introduction: state => state.passport.introduction,
  roles: state => state.passport.roles,
  groups: state => state.passport.groups,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs
}
export default getters
