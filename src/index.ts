import {Http} from './Http'
import {Config as ConfigOrigin, ConfigWildcard} from './base'

export function create(config: ConfigOrigin) {
  return new Http(config)
}

export * from './transforms'

export const http = new Http()

export type HttpType = typeof http

export type Config = ConfigWildcard
