import RoadizApi from '../src/RoadizApi'
import {AlternateLink, RoadizApiNSParams, RoadizApiTagsParams} from '../types/roadiz-api'
import {NSNeutral, NSPage} from "./types/roadiz-app-20210623-220029"
import {RoadizDocument} from "../types/roadiz";

class HeadlessRoadizApi extends RoadizApi {
    getPages(params: RoadizApiNSParams) {
        return this.getNodesSourcesForType<NSPage>('page', params)
    }
    getPagesTags(params: RoadizApiTagsParams) {
        return this.getTagsForType('page', params)
    }
    getNeutrals(params: RoadizApiNSParams) {
        return this.getNodesSourcesForType<NSNeutral>('neutral', params)
    }
    getNeutralsTags(params: RoadizApiTagsParams) {
        return this.getTagsForType('neutral', params)
    }
}

test('Headless API: NSPage', () => {
    const api = new HeadlessRoadizApi(process.env.API_BASE_URL || '', process.env.API_NON_PREVIEW_API_KEY || '', false)

    return api.getPages({
        order: {
            'node.position': 'ASC'
        }
    }).then((response) => {
        expect(response.status).toBe(200)
        expect(response.data["hydra:member"][0]).toBeDefined()
        expect(response.data["hydra:member"][0]['@type']).toBe('Page')

        response.data["hydra:member"].forEach((page: NSPage) => {
            expect(page.url).toContain('/')
            page.image.forEach((document: RoadizDocument) => {
                expect(document.url).toContain('/files')
            })
        })
    })
})

test('Headless API: By path', () => {
    const api = new HeadlessRoadizApi(process.env.API_BASE_URL || '', process.env.API_NON_PREVIEW_API_KEY || '', false)

    return api.getSingleNodesSourcesByPath('/').then((response) => {
        expect(response.status).toBe(200)
        expect(response.data).toBeDefined()
        expect(response.data['@type']).toBe('Page')
        expect(response.data.url).toBe('/')
    })
})

test('Headless API: Home alternate links', () => {
    const api = new HeadlessRoadizApi(process.env.API_BASE_URL || '', process.env.API_NON_PREVIEW_API_KEY || '', false)

    return api.getSingleNodesSourcesByPath('/').then((response) => {
        expect(api.getAlternateLinks(response)).toStrictEqual([{
            url: '/',
            locale: 'en'
        }, {
            url: '/fr',
            locale: 'fr'
        }])
    })
})

test('Headless API: Sitemap FR', () => {
    const api = new HeadlessRoadizApi(process.env.API_BASE_URL || '', process.env.API_NON_PREVIEW_API_KEY || '', false)

    return api.fetchAllUrlsForLocale('fr').then((urls) => {
        urls.forEach((url: string) => {
            expect(url).toContain('/')
        })
    })
})

test('Headless API: Sitemap EN', () => {
    const api = new HeadlessRoadizApi(process.env.API_BASE_URL || '', process.env.API_NON_PREVIEW_API_KEY || '', false)

    return api.fetchAllUrlsForLocale('en').then((urls) => {
        urls.forEach((url: string) => {
            expect(url).toContain('/')
        })
    })
})

test('Headless API: NSNeutral', () => {
    const api = new HeadlessRoadizApi(process.env.API_BASE_URL || '', process.env.API_NON_PREVIEW_API_KEY || '', false)

    return api.getNeutrals({
        page: 1
    }).then((response) => {
        expect(response.status).toBe(200)
        expect(response.data["hydra:member"][0]).toBeDefined()
        expect(response.data["hydra:member"][0]['@type']).toBe('Neutral')
    })
})
