import {string2any} from './base'

export function omit<T extends string2any>(obj: T, ...keys: string[]): Partial<T> {
  return Object.keys(obj).reduce((target, next) => {
    if (!keys.includes(next)) {
      target[next] = obj[next]
    }
    return target
  }, {} as T)
}

export function queryToString(obj: string2any): string {
  return Object.keys(obj).reduce((target, next) => {
    return `${target}&${next}=${obj[next] || ''}`
  }, '').slice(1)
}
