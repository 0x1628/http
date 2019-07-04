import {Res, Config, Data, ConfigWildcard, Method} from './base'
import agent from './agent'
import {queryToString} from './utils'

export class Http {
  defaults: Config = {
    baseURL: '',
    headers: {},
    withCredentials: false,
    timeout: 1000,
    transformRequest: [],
    transformResponse: [],
  }

  constructor(config?: Config) {
    if (config) {
      this.defaults = {
        ...this.defaults,
        ...config,
      }
    }
  }

  request(config: ConfigWildcard): Promise<Res> {
    const url = this._makeURL(config)
    config = {
      ...this.defaults,
      ...config,
    }

    const transformedConfig = this.defaults.transformRequest!.reduce((conf, next) => {
      return next(conf)
    }, config as Config)
    return agent({
      ...transformedConfig,
      method: config.method,
      url,
    }).then(res => {
      return this.defaults.transformResponse!.reduce((result, next) => {
        return next(res)
      }, res)
    })
  }

  private _makeURL(config: ConfigWildcard): string {
    let url = config.url
    if (!url.startsWith('http')) {
      const baseUrl = this.defaults.baseURL || ''
      url = `${baseUrl}${config.url}`
    }
    if (config.query) {
      let query = config.query
      if (typeof query === 'object') {
        query = queryToString(query)
      }

      url += `${url.includes('?') ? '&' : '?'}${query}`
    }
    return url
  }

  // must declare explicit for type checking
  private _noDataMethod(method: Method, url: string, config?: Config) {
    return this.request({
      ...config,
      method,
      url,
    })
  }

  private _dataMethod(method: Method, url: string, data?: Data, config?: Config) {
    return this.request({
      ...config,
      method,
      url,
      data,
    })
  }

  get(url: string, config?: Config) {
    return this._noDataMethod('get', url, config)
  }

  options(url: string, config?: Config) {
    return this._noDataMethod('options', url, config)
  }

  delete(url: string, config?: Config) {
    return this._noDataMethod('delete', url, config)
  }

  head(url: string, config?: Config) {
    return this._noDataMethod('head', url, config)
  }

  post(url: string, data?: Data, config?: Config) {
    return this._dataMethod('post', url, data, config)
  }

  patch(url: string, data?: Data, config?: Config) {
    return this._dataMethod('patch', url, data, config)
  }

  put(url: string, data?: Data, config?: Config) {
    return this._dataMethod('put', url, data, config)
  }
}
