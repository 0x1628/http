import {create} from '../index'
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

test('create basic', async () => {
  expect.assertions(2)

  mockedFetch.mockResolvedValue({
    ...baseResponse,
  })

  const base = 'http://www.baidu.com'
  const http = create({
    baseURL: base,
    headers: {
      token: 'hi',
    },
  })

  const res = await http.get('/test')
  const params = mockedFetch.mock.calls[mockedFetch.mock.calls.length - 1]
  expect(params[0]).toBe('http://www.baidu.com/test')
  expect(params[1].headers.token).toBe('hi')
})
