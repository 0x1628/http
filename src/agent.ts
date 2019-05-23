import {fetch as whatwgFetch} from 'whatwg-fetch'
import {ConfigWildcard, Res} from './base'
import {omit, mapToObject} from './utils'
declare const wx: any

function makeFetchOptionFromConfig(config: ConfigWildcard) {
  let {data, headers = {}} = config

  if (data &&
    typeof data !== 'string' &&
    /* tslint:disable */
    (typeof FormData === 'undefined' || !(data instanceof FormData)) &&
    (typeof File === 'undefined' || (data instanceof File))
    /* tslint:enable */
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
          const res: Res = {
            data: {},
            status: r.statusCode,
            headers: r.header,
          }
          if (typeof data === 'string' && isResponseJson) {
            try {
              data = JSON.parse(data)
              res.data = data
            } catch (e) {
              res.rawData = data
            }
          } else if (typeof data === 'object') {
            res.data = data
          } else {
            res.rawData = data
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
  const ifetch: typeof fetch =
    typeof (global as any).fetch !== 'undefined' ? (global as any).fetch
      // tslint:disable-next-line
      : (typeof window !== 'undefined' ? whatwgFetch : require('node-fetch'))
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
          const isStringData = typeof data === 'string'
          const res: Res = {
            data: isStringData ? {} : data,
            status: r.status,
            headers: mapToObject(r.headers),
          }
          if (isStringData) {
            res.rawData = data
          }

          return r.ok ? Promise.resolve(res) : Promise.reject(res)
        })
      }).catch(e => {
        return Promise.reject({
          data: e.data || e,
          status: e.status || 500,
          headers: e.headers ? mapToObject(e.headers) : {},
        })
      })
  }
}

export default agent
