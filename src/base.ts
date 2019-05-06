export type string2any = {
  [key: string]: any,
}

export type Data = string2any | string | FormData

export const methods = ['get', 'post', 'patch', 'put', 'delete',
  'options', 'head'] as const

export type Method = typeof methods[number]

interface ConfigBase {
  headers: {
    [key: string]: string,
  }
  data: Data,
  query: string2any | string,
  timeout: number,
  withCredentials: boolean,
  baseURL: string,
  transformRequest: ((config: Config) => Config)[],
  transformResponse: ((res: Res) => Res)[],
}

export type Config = Partial<ConfigBase>
export type ConfigWildcard = Partial<ConfigBase> & {
  method?: Method,
  url: string,
}

export type Res = {
  data: string2any | string,
  status: number,
  headers: string2any,
}