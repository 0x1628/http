import {ConfigWildcard, Res} from './base'
import {omit} from './utils'
declare const wx: any

function makeFetchOptionFromConfig(config: ConfigWildcard) {
  let {data, headers = {}} = config

  if (data &&
    typeof data !== 'string' &&
    !(data instanceof FormData) &&
    !(data instanceof File)
  ) {
    data = JSON.stringify(data)
    headers = {
      ...headers,
      'content-type': 'application/json',
    }
  }

  return {
    ...omit(config, 'url', 'timeout', 'query', 'data', 'withCrendentials'),
    method: (config.method || 'get').toUpperCase(),
    credentials: (config.withCredentials ? 'include' : 'omit') as RequestCredentials,
    headers,
    data,
  }
}

function isJSON(res: {status: number, contentLength: string, contentType: string}): boolean {
  if (res.status === 204) return false

  if (Number(res.contentLength) === 0) return false

  const type = res.contentType
  return type ? type.includes('application/json') : false
}

type Agent = (config: ConfigWildcard) => Promise<Res>

let agent: Agent

if (typeof wx !== 'undefined') {
  agent = (config: ConfigWildcard) => {
    return new Promise((resolve, reject) => {
      wx.request({
        url: config.url,
        data: config.data || {},
        header: config.headers || {},
        method: (config.method || 'get').toUpperCase(),
        success(r: any) {
          const isResponseJson = isJSON({
            status: r.statusCode,
            contentLength: (r.header || {})['content-length'],
            contentType: (r.header || {})['content-type'],
          })
          let data = r.data
          if (typeof data === 'string' && isResponseJson) {
            try {
              data = JSON.parse(data)
            } catch (e) {
              //
            }
          }
          const res = {
            data,
            status: r.statusCode,
            headers: r.header,
          }
          if (r.statusCode >= 300) {
            reject(res)
          } else {
            resolve(res)
          }
        },
        fail(e: any) {
          reject({
            data: e.data || e,
            status: e.statusCode || 500,
            headers: e.header || {},
          })
        },
      })
    })
  }
} else {
  // tslint:disable-next-line
  const ifetch: typeof fetch = require('isomorphic-fetch')
  agent = (config: ConfigWildcard) => {
    return ifetch(config.url, makeFetchOptionFromConfig(config))
      .then(r => {
        const isResponseJson = isJSON({
          status: r.status,
          contentLength: r.headers.get('content-length') || '',
          contentType: r.headers.get('content-type') || '',
        })
        const dataPromise = isResponseJson ? r.json() : r.text()
        return dataPromise.then(data => {
          const res = {
            data,
            status: r.status,
            headers: r.headers,
          }
          return r.ok ? Promise.resolve(res) : Promise.reject(res)
        })
      }).catch(e => {
        return Promise.reject({
          data: e.data || e,
          status: e.status || 500,
          headers: e.headers || {},
        })
      })
  }
}

export default agent
