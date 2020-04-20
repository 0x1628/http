import parseQuery from '../req-parseQuery'
import {ConfigWildcard, string2any} from '../../base'

test('parse query simple', () => {
  const config: ConfigWildcard = {
    url: '/test',
    query: 't=1&c=2',
  }
  const query = parseQuery(config).query as string2any
  expect(query.t).toBe('1')
  expect(query.c).toBe('2')
})

test('parse query in url', () => {
  const config: ConfigWildcard = {
    url: '/test?t=1',
  }
  const query = parseQuery(config).query as string2any
  expect(query.t).toBe('1')
  expect(parseQuery(config).url).toBe('/test')
})

test('parse query with both url & query', () => {
  const config: ConfigWildcard = {
    url: '/test?t=1',
    query: {c: 2},
  }
  const query = parseQuery(config).query as string2any
  expect(query.t).toBe('1')
  expect(query.c).toBe(2)
})

test('parse query with override', () => {
  const config: ConfigWildcard = {
    url: '/test?t=1',
    query: {t: 2},
  }
  const query = parseQuery(config).query as string2any
  expect(query.t).toBe(2)
})
