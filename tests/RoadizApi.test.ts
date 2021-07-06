import RoadizApi from '../src/RoadizApi'
import {AxiosError} from 'axios'

test('Non-configured API is not found', () => {
    const api = new RoadizApi('http://nope.test/api/1.0', 'xxxx', false)

    return api.getNodesSources({
        page: 1
    }).catch((reason: AxiosError) => {
        expect(reason.response).toBeUndefined()
    })
})

test('Bad api key API', () => {
    const api = new RoadizApi(process.env.API_BASE_URL || '', 'xxxxxx', false)

    return api.getNodesSources({
        page: 1
    }).catch((response: AxiosError) => {
        expect(response.response?.status).toBe(403)
    })
})

test('Configured API', () => {
    const api = new RoadizApi(process.env.API_BASE_URL || '', process.env.API_NON_PREVIEW_API_KEY || '', false)

    return api.getNodesSources({
        page: 1
    }).then((response) => {
        expect(response.status).toBe(200)
    })
})

test('Test NodesSources HydraCollection response', () => {
    const api = new RoadizApi(process.env.API_BASE_URL || '', process.env.API_NON_PREVIEW_API_KEY || '', false)

    return api.getNodesSources({}).then((response) => {
        expect(response.data["hydra:totalItems"]).toBeGreaterThan(1)
        expect(response.data["hydra:member"][0]).toHaveProperty('@type')
        expect(response.data["hydra:member"][0]).toHaveProperty('slug')
    })
})

test('Test CommonContent Response HydraCollection response', () => {
    const api = new RoadizApi(process.env.API_BASE_URL || '', process.env.API_NON_PREVIEW_API_KEY || '', false)

    return api.getNodesSources({}).then((response) => {
        expect(response.data["hydra:totalItems"]).toBeGreaterThan(1)
        expect(response.data["hydra:member"][0]).toHaveProperty('@type')
        expect(response.data["hydra:member"][0]).toHaveProperty('slug')
    })
})

test('Bad Api key preview API', () => {
    const api = new RoadizApi(process.env.API_BASE_URL || '', process.env.API_NON_PREVIEW_API_KEY || '', true)

    return api.getNodesSources({
        page: 1
    }).catch((response: AxiosError) => {
        expect(response.response?.status).toBe(403)
    })
})

test('Configured preview API', () => {
    const api = new RoadizApi(process.env.API_BASE_URL || '', process.env.API_PREVIEW_API_KEY || '', true)

    return api.getNodesSources({
        page: 1
    }).then((response) => {
        expect(response.status).toBe(200)
    })
})
