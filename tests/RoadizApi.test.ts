import RoadizApi from '../src/RoadizApi'
import { AxiosError } from 'axios'

test('Non-configured API is not found', () => {
    const api = new RoadizApi('http://nope.test/api/1.0')

    return api
        .getNodesSources({
            page: 1,
        })
        .catch((reason: AxiosError) => {
            expect(reason.response?.status).toBeUndefined()
        })
})

test('Configured API', () => {
    const api = new RoadizApi(process.env.API_BASE_URL || '')

    return api
        .getNodesSources({
            page: 1,
        })
        .then((response) => {
            expect(response.status).toBe(200)
        })
})

test('Test NodesSources HydraCollection response', () => {
    const api = new RoadizApi(process.env.API_BASE_URL || '')

    return api.getNodesSources({}).then((response) => {
        expect(response.data['hydra:totalItems']).toBeGreaterThan(1)
        expect(response.data['hydra:member'][0]).toHaveProperty('@type')
        expect(response.data['hydra:member'][0]).toHaveProperty('slug')
    })
})

test('Test CommonContent Response HydraCollection response', () => {
    const api = new RoadizApi(process.env.API_BASE_URL || '')

    return api.getNodesSources({}).then((response) => {
        expect(response.data['hydra:totalItems']).toBeGreaterThan(1)
        expect(response.data['hydra:member'][0]).toHaveProperty('@type')
        expect(response.data['hydra:member'][0]).toHaveProperty('slug')
    })
})

test('Bad Api key preview API', () => {
    const api = new RoadizApi(process.env.API_BASE_URL || '')

    return api
        .getNodesSources({
            page: 1,
        })
        .catch((response: AxiosError) => {
            expect(response.response?.status).toBe(403)
        })
})

test('Configured preview API', () => {
    const api = new RoadizApi(process.env.API_BASE_URL || '', { apiKey: process.env.API_PREVIEW_API_KEY })

    return api
        .getNodesSources({
            page: 1,
        })
        .then((response) => {
            expect(response.status).toBe(200)
        })
})

test('Fetch all URLs', () => {
    const api = new RoadizApi(process.env.API_BASE_URL || '', { apiKey: process.env.API_PREVIEW_API_KEY })

    return api.fetchAllUrlsForLocale().then((response) => {
        expect(response).toEqual(expect.arrayContaining([expect.any(String)]))
    })
})

test('Decode header link base64', () => {
    const api = new RoadizApi(process.env.API_BASE_URL || '', { apiKey: process.env.API_PREVIEW_API_KEY })

    expect(api.b64DecodeUnicode('RGVmYXVsdCB0cmFuc2xhdGlvbg==')).toEqual('Default translation')
    expect(api.b64DecodeUnicode('RnJhbsOnYWlz')).toEqual('Français')
    expect(api.b64DecodeUnicode('4p2k77iP8J+Riw==')).toEqual('❤️👋')
})
