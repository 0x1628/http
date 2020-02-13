import {http} from '../index'
import fetch from 'node-fetch'
import {string2any} from '../base'

jest.mock('node-fetch')
const mockedFetch = fetch as any

const baseResponse = {
  status: 200,
  ok: true,
  headers: new Map(),
  data: {},
  json() {
    // tslint:disable-next-line
    return Promise.resolve(this.data)
  },
  text() {
    // tslint:disable-next-line
    return Promise.resolve(JSON.stringify(this.data))
  },
}

test('test basic function', async () => {
  expect.assertions(3)

  mockedFetch.mockResolvedValue({
    ...baseResponse,
  })
  try {
    const res = await http.get('/test')
    expect(res.status).toBe(200)
    expect(Object.keys(res.data).length).toBe(0)
    expect(res.rawData).toBe('{}')
  } catch (e) {
    throw e
  }
})

test('test json format', async () => {
  expect.assertions(2)

  type Data = {test: number}

  mockedFetch.mockResolvedValue({
    ...baseResponse,
    headers: new Map([
      ['content-length', '10'],
      ['content-type', 'application/json'],
    ]),
    data: {test: 1},
  })

  const res = await http.get<Data>('/test')
  expect(res.data.test).toBe(1)

  type DataArr = string[]

  mockedFetch.mockResolvedValue({
    ...baseResponse,
    headers: new Map([
      ['content-length', '10'],
      ['content-type', 'application/json'],
    ]),
    data: ['123'],
  })

  const resArr = await http.get<DataArr>('/test')
  const result = resArr.data[0]
  expect(result).toBe('123')
})

test('test failed', async () => {
  expect.assertions(1)

  mockedFetch.mockResolvedValue({
    ...baseResponse,
    status: 404,
    ok: false,
  })

  try {
    const res = await http.get('/test')
  } catch (e) {
    if (!e.data) throw e
    expect(e.status).toBe(404)
  }
})

test('test query', () => {
  mockedFetch.mockResolvedValue({
    ...baseResponse,
  })

  http.get('/test', {
    query: {
      c: 2,
    },
  })

  expect(mockedFetch.mock.calls[mockedFetch.mock.calls.length - 1][0]).toContain('c=2')
})

test('test post body', () => {
  mockedFetch.mockResolvedValue({
    ...baseResponse,
  })
  http.post('/test', {
    test: 1,
  })

  function getPostArg() {
    return mockedFetch.mock.calls[mockedFetch.mock.calls.length - 1][1]
  }

  expect(JSON.parse(getPostArg().body).test).toBe(1)
  expect(getPostArg().headers['content-type']).toBe('application/json')
})

test('test post body in browser', () => {
  (global as any).FormData = function() {/**/};
  (global as any).File = function() {/**/}
  mockedFetch.mockResolvedValue({
    ...baseResponse,
  })
  http.post('/test', {
    test: 1,
  })

  function getPostArg() {
    return mockedFetch.mock.calls[mockedFetch.mock.calls.length - 1][1]
  }

  expect(typeof getPostArg().body).toBe('string')
  expect(JSON.parse(getPostArg().body).test).toBe(1)
  expect(getPostArg().headers['content-type']).toBe('application/json')

  delete (global as any).FormData
  delete (global as any).File
})
