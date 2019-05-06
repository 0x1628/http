import {queryToString, omit} from '../utils'

test('queryToString', () => {
  expect(queryToString({h: 1, c: 2})).toEqual('h=1&c=2')
  expect(queryToString({
    d: '222',
    e: true,
  })).toEqual('d=222&e=true')
})

test('omit', () => {
  expect(omit({h: 1, c: 2}, 'c').c).toBeUndefined()
  expect(omit({h: 1, c: 2}, 'd').c).toBe(2)
  const obj = omit({h: 1, c: 2}, 'c', 'h')
  expect(obj.c).toBeUndefined()
  expect(obj.h).toBeUndefined()
})
