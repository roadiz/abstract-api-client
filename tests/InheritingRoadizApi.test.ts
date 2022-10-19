import RoadizApi from '../src/RoadizApi'
import { NSPage } from './types/roadiz-app-20210623-220029'
import { RoadizRequestNSParams } from '../src/types/request'
import { HydraCollection } from '../dist/types/hydra'

class CustomRoadizApi extends RoadizApi {
    getPages(params: RoadizRequestNSParams) {
        return this.get<HydraCollection<NSPage>, RoadizRequestNSParams>('pages', { params })
    }
    // getNeutrals(params: RoadizRequestNSParams) {
    //     return this.get<HydraCollection<NSNeutral>, RoadizRequestNSParams>('neutral', { params })
    // }
}

test('Headless API: NodesSources', () => {
    const api = new CustomRoadizApi(process.env.API_BASE_URL || '', { apiKey: process.env.API_NON_PREVIEW_API_KEY })

    return api
        .getNodesSources({
            order: {
                'node.position': 'ASC',
            },
        })
        .then((response) => {
            expect(response.status).toBe(200)
            expect(response.data['hydra:member'][0]).toBeDefined()
            expect(response.data['hydra:member'][0]['@type']).toBeDefined()
            expect(response.data['hydra:member'][0]['slug']).toBeDefined()
            expect(response.data['hydra:member'][0]['@id']).toBeDefined()
        })
})

test('Headless API: Get User info with invalid JWT', () => {
    const api = new CustomRoadizApi(process.env.API_BASE_URL || '', { apiKey: process.env.API_NON_PREVIEW_API_KEY })

    return api.getUserInformation('nope').catch((error) => {
        expect(error.response.status).toBe(401)
        expect(error.response.data['message']).toBe('Invalid JWT Token')
    })
})

test('Headless API: Request User validation with invalid JWT', () => {
    const api = new CustomRoadizApi(process.env.API_BASE_URL || '', { apiKey: process.env.API_NON_PREVIEW_API_KEY })

    return api
        .postUserValidationRequest(
            {
                identifier: 'abstract-api-client-test@test.test',
            },
            'nope'
        )
        .catch((error) => {
            expect(error.response.status).toBe(401)
            expect(error.response.data['message']).toBe('Invalid JWT Token')
        })
})

test('Headless API: Validate User with invalid JWT and token', () => {
    const api = new CustomRoadizApi(process.env.API_BASE_URL || '', { apiKey: process.env.API_NON_PREVIEW_API_KEY })

    return api
        .putUserValidation(
            {
                token: 'a-non-valid-token',
            },
            'nope'
        )
        .catch((error) => {
            expect(error.response.status).toBe(401)
            expect(error.response.data['message']).toBe('Invalid JWT Token')
        })
})

test('Headless API: Create User without Recaptcha', () => {
    const api = new CustomRoadizApi(process.env.API_BASE_URL || '', { apiKey: process.env.API_NON_PREVIEW_API_KEY })

    return api
        .postUser({
            email: 'abstract-api-client-test@test.test',
            plainPassword: 'very-Strong-p4ssw0rd',
            firstName: 'john',
            lastName: 'doe',
        })
        .catch((error) => {
            expect(error.response.status).toBe(400)
            expect(error.response.data['hydra:description']).toBe(
                'You must provide x-g-recaptcha-response header for human verification.'
            )
        })
})

test('Headless API: Request new User password without Recaptcha', () => {
    const api = new CustomRoadizApi(process.env.API_BASE_URL || '', { apiKey: process.env.API_NON_PREVIEW_API_KEY })

    return api
        .postUserPasswordRequest({
            identifier: 'abstract-api-client-test@test.test',
        })
        .catch((error) => {
            expect(error.response.status).toBe(400)
            expect(error.response.data['hydra:description']).toBe(
                'You must provide x-g-recaptcha-response header for human verification.'
            )
        })
})

test('Headless API: Reset User password with invalid token', () => {
    const api = new CustomRoadizApi(process.env.API_BASE_URL || '', { apiKey: process.env.API_NON_PREVIEW_API_KEY })

    return api
        .putUserPasswordReset({
            token: 'a-non-valid-token',
            plainPassword: 'very-Strong-p4ssw0rd',
        })
        .catch((error) => {
            expect(error.response.status).toBe(404)
            expect(error.response.data['hydra:description']).toBe('User does not exist.')
        })
})

test('Headless API: By path', () => {
    const api = new CustomRoadizApi(process.env.API_BASE_URL || '', {
        apiKey: process.env.API_NON_PREVIEW_API_KEY,
    })

    return api.getWebResponseByPath('/').then((response) => {
        expect(response.status).toBe(200)
        expect(response.data).toBeDefined()
        expect(response.data.item).toBeDefined()
    })
})

test('Headless API: Home alternate links', () => {
    const api = new CustomRoadizApi(process.env.API_BASE_URL || '', { apiKey: process.env.API_NON_PREVIEW_API_KEY })

    return api.getWebResponseByPath('/').then((response) => {
        expect(api.getAlternateLinks(response)).toBeDefined()
    })
})

test('Headless API: Sitemap FR', () => {
    const api = new CustomRoadizApi(process.env.API_BASE_URL || '', { apiKey: process.env.API_NON_PREVIEW_API_KEY })

    return api.fetchAllUrlsForLocale('fr').then((urls) => {
        urls.forEach((url: string) => {
            expect(url).toContain('/')
        })
    })
})

test('Headless API: Sitemap EN', () => {
    const api = new CustomRoadizApi(process.env.API_BASE_URL || '', { apiKey: process.env.API_NON_PREVIEW_API_KEY })

    return api.fetchAllUrlsForLocale('en').then((urls) => {
        urls.forEach((url: string) => {
            expect(url).toContain('/')
        })
    })
})

// test('Headless API: NSNeutral', () => {
//     const api = new CustomRoadizApi(process.env.API_BASE_URL || '', { apiKey: process.env.API_NON_PREVIEW_API_KEY })
//
//     return api
//         .getNeutrals({
//             page: 1,
//         })
//         .then((response) => {
//             expect(response.status).toBe(200)
//             expect(response.data['hydra:member'][0]).toBeDefined()
//             expect(response.data['hydra:member'][0]['@type']).toBe('Neutral')
//         })
// })
