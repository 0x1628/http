import {string2any} from './base'

export function omit<T extends string2any>(obj: T, ...keys: string[]): Partial<T> {
  return Object.keys(obj).reduce((target, next) => {
    if (!keys.includes(next)) {
      target[next] = obj[next]
    }
    return target
  // https://github.com/microsoft/TypeScript/issues/31661
  }, {} as string2any) as Partial<T>
}

export function queryToString(obj: string2any): string {
  return Object.keys(obj).reduce((target, next) => {
    return `${target}&${next}=${obj[next] || ''}`
  }, '').slice(1)
}

export function mapToObject(m: Headers | Map<any, any>): string2any {
  if (!m.forEach) return m
  const result: string2any = {}
  m.forEach((v: any, k: any) => {
    result[k] = v
  })
  return result
}
