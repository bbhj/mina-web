import { forIn, camelCase } from 'lodash'

export const mergeParts = (name, title, list) => {
  const res = {}
  res['route'] = {}
  res['route'][name] = title
  res[name] = {}

  forIn(list, (item, part) => {
    res[name][part] = item.fields
    forIn(item.route, (value, key) => {
      if (key === 'index') {
        res['route'][camelCase(`${name}.${part}`)] = value
      }
      res['route'][camelCase(`${name}.${part}.${key}`)] = value
    })
  })
  return res
}
