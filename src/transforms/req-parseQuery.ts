import {TransformRequestFunc, ConfigWildcard, string2any} from '../base'

function queryToJSON(str: string) {
  const result: string2any = {}
  str.split('&').forEach(item => {
    const [k, v] = item.split('=')
    result[k] = v
  })
  return result
}

const parseQuery: TransformRequestFunc = (config: ConfigWildcard) => {
  let query = config.query
  if (!query) {
    query = {}
  } else if (typeof query === 'string') {
    query = queryToJSON(query)
  }
  const re = /(.+)\?(.+?)(#|$)/ig.exec(config.url)
  if (!re) {
    config.query = query
    return config
  }
  config.url = re[1]
  config.query = {
    ...queryToJSON(re[2]),
    ...query,
  }
  return config
}

export default parseQuery
