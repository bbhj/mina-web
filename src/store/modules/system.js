const system = {
  namespaced: true,
  state: {
    permissionTypeList: [
      { value: 'menu', label: '菜单' },
      { value: 'api_common', label: '通用接口' }
    ],
    getListLable(list, value) {
      let res = value
      list.forEach(item => {
        if (item.value === value) {
          res = item.label
        }
      })
      return res
    }
  },
  mutations: {
  },
  actions: {
  }
}

export default system
