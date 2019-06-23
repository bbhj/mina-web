import storejs from 'store'

const TokenKey = 'Flex-Token'

export function getToken() {
  return storejs.get(TokenKey)
}

export async function setToken(token) {
  return storejs.set(TokenKey, token)
}

export function removeToken() {
  return storejs.remove(TokenKey)
}
