import {Res, Config, Data, ConfigWildcard, Method, string2any} from './base'
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

  request<T = string2any>(config: ConfigWildcard): Promise<Res<T>> {
    config = {
      ...this.defaults,
      ...config,
      headers: {
        ...this.defaults.headers,
        ...config.headers,
      },
    }

    const transformedConfig = this.defaults.transformRequest!.reduce((conf, next) => {
      return next(conf)
    }, config)
    return agent<T>({
      ...transformedConfig,
      method: config.method,
      url: this._makeURL(config),
    }).then(res => {
      return this.defaults.transformResponse!.reduce((_, next) => {
        return next(res)
      }, res)
    }, e => {
      if (config.errorHandler) {
        config.errorHandler(e)
      }
      throw e
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
  private _noDataMethod<T>(method: Method, url: string, config?: Config) {
    return this.request<T>({
      ...config,
      method,
      url,
    })
  }

  private _dataMethod<T>(method: Method, url: string, data?: Data, config?: Config) {
    return this.request<T>({
      ...config,
      method,
      url,
      data,
    })
  }

  get<T = string2any>(url: string, config?: Config) {
    return this._noDataMethod<T>('get', url, config)
  }

  options<T = string2any>(url: string, config?: Config) {
    return this._noDataMethod<T>('options', url, config)
  }

  delete<T = string2any>(url: string, config?: Config) {
    return this._noDataMethod<T>('delete', url, config)
  }

  head<T = string2any>(url: string, config?: Config) {
    return this._noDataMethod<T>('head', url, config)
  }

  post<T = string2any>(url: string, data?: Data, config?: Config) {
    return this._dataMethod<T>('post', url, data, config)
  }

  patch<T = string2any>(url: string, data?: Data, config?: Config) {
    return this._dataMethod<T>('patch', url, data, config)
  }

  put<T = string2any>(url: string, data?: Data, config?: Config) {
    return this._dataMethod<T>('put', url, data, config)
  }
}
