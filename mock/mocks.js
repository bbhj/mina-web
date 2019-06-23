import auth from './auth'
import role from './role'
import article from './article'
import search from './remoteSearch'

export default [
  ...auth,
  ...role,
  ...article,
  ...search
]

