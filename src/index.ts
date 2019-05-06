import {Http} from './Http'
import {Config} from './base'

export function create(config: Config) {
  return new Http(config)
}

export const http = new Http()
