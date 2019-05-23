import {string2any} from '../base'

const baseResponse = {
  statusCode: 200,
  header: {},
  data: '{}',
}
let response: any = {...baseResponse}

const mockedFetch = jest.fn((options: any) => {
  options.success(response)
})
let http: any

beforeAll(async () => {
  (global as any).wx = {
    request: mockedFetch,
  }
  http = (await import('../index')).http
})

afterAll(() => {
  delete (global as any).wx
})

test('test basic function', async () => {
  expect.assertions(3)

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
  expect.assertions(1)

  response = {
    ...baseResponse,
    header: {
      'content-length': '10',
      'content-type': 'application/json',
    },
    data: {test: 1},
  }

  const res = await http.get('/test')
  expect(res.data.test).toBe(1)
})

test('test failed', async () => {
  expect.assertions(1)

  response = {
    ...baseResponse,
    statusCode: 404,
  }

  try {
    const res = await http.get('/test')
  } catch (e) {
    if (!e.data) throw e
    expect(e.status).toBe(404)
  }
})

test('test query', () => {
  response = {
    ...baseResponse,
  }

  http.get('/test', {
    query: {
      c: 2,
    },
  })

  expect(mockedFetch.mock.calls[mockedFetch.mock.calls.length - 1][0].url).toContain('c=2')
})

test('test post body', () => {
  http.post('/test', {
    test: 1,
  })

  function getPostArg() {
    return mockedFetch.mock.calls[mockedFetch.mock.calls.length - 1][0]
  }
  expect(getPostArg().data.test).toBe(1)
  // expect(getPostArg().header['content-type']).toBe('application/json')
})
