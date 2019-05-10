import {Http} from './Http'
import {Config, ConfigWildcard} from './base'

export function create(config: Config) {
  return new Http(config)
}

export const http = new Http()

export type Config = ConfigWildcard
