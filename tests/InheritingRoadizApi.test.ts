import RoadizApi from '../src/RoadizApi'
import { NSPage } from './types/roadiz-app-20210623-220029'
import { RoadizDocument } from '../src/types/roadiz'
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

test('Headless API: NSPage', () => {
    const api = new CustomRoadizApi(process.env.API_BASE_URL || '', { apiKey: process.env.API_NON_PREVIEW_API_KEY })

    return api
        .getPages({
            order: {
                'node.position': 'ASC',
            },
        })
        .then((response) => {
            expect(response.status).toBe(200)
            expect(response.data['hydra:member'][0]).toBeDefined()
            expect(response.data['hydra:member'][0]['@type']).toBe('Page')

            response.data['hydra:member'].forEach((page: NSPage) => {
                expect(page.url).toContain('/')
                page.image?.forEach((document: RoadizDocument) => {
                    expect(document.url).toContain('/files')
                })
            })
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
