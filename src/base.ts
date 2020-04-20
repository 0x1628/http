export type string2any = {
  [key: string]: any,
}

export type Data = string2any | string | FormData

export const methods = ['get', 'post', 'patch', 'put', 'delete',
  'options', 'head'] as const

export type Method = typeof methods[number]

export type TransformRequestFunc = ((config: ConfigWildcard) => ConfigWildcard)
export type TransformResponseFunc = (<T>(res: Res<T>) => Res<T>)

interface ConfigBase {
  headers: {
    [key: string]: string,
  }
  data: Data,
  query: string2any | string,
  timeout: number,
  withCredentials: boolean,
  baseURL: string,
  transformRequest: TransformRequestFunc[],
  transformResponse: TransformResponseFunc[],
  errorHandler?(res: Res<any>): void,
}

export type Config = Partial<ConfigBase>
export type ConfigWildcard = Partial<ConfigBase> & {
  method?: Method,
  url: string,
}

export type Res<T = string2any> = {
  data: T,
  rawData?: string,
  status: number,
  headers: string2any,
}
