const data = {
  // title: '其它管理'
}
const context = require.context(`.`, false, /\.js$/)
const re = /\.\/(.*)\.js/

context.keys().map(item => {
  const name = item.match(re)[1]
  if (name !== 'index') {
    data[item.match(re)[1]] = context(item).default
  }
})

export default data
