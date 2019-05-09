import {queryToString, omit, mapToObject} from '../utils'

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

test('mapToObject', () => {
  const m = new Map([[1, 2], [3, 4]])
  expect(mapToObject(m)[1]).toBe(2)
})
