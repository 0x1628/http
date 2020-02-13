import {Http} from './Http'
import {Config as ConfigOrigin, ConfigWildcard} from './base'

export function create(config: ConfigOrigin) {
  return new Http(config)
}

export const http = new Http()

export type Config = ConfigWildcard
