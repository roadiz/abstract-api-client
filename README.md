# abstract-api-client
Abstract API Typescript client interfaces and SDK.

Based on *Axios* HTTP client.

## Usage

```bash
yarn add @roadiz/abstract-api-client
```

tsconfig.json
```json
{
  "compilerOptions": {
    "types": [
      "@roadiz/abstract-api-client"
    ]
  }
}
```

### Customize Roadiz API client against your own API schema

- Download latest `d.ts` definition file from Roadiz backoffice
- Extend `RoadizApi` class

```ts
export default class MyAwesomeRoadizApi extends RoadizApi {
    /*
     * Page node-type
     */
    getPages(params: RoadizRequestNSParams) {
        return this.get<HydraCollection<NSPage>, RoadizRequestNSParams>('pages', { params })
    }
    
    /*
     * BlogPost node-type
     */
    getBlogPosts(params: RoadizRequestNSParams) {
        // Additional default params…
        params = {
            order: {
                publishedAt: 'DESC'
            },
            ...params,
        }
        return this.get<HydraCollection<NSBlockPost>, RoadizRequestNSParams>('blog_posts', { params })
    }
}
```

### Fetch all URLs for a sitemap

```ts
const api = new RoadizApi(process.env.API_BASE_URL,)

return api.fetchAllUrlsForLocale('fr').then((urls: Array<string>) => {
    // build your sitemap
})
```

### Get all alternative URLs for a node-source

Alternative links are useful to build language navigation for each website page. It's based
on HTTP response header `Link`.
API `getAlternateLinks` method will return a `Array<AlternateLink>` from an `AxiosResponse`:

```ts
const api = new RoadizApi(process.env.API_BASE_URL)

api.getWebResponseByPath('/').then((response) => {
    /*
     * [{
     *     url: '/',
     *     locale: 'en'
     * }, {
     *     url: '/fr',
     *     locale: 'fr'
     * }]
     */
    api.getAlternateLinks(response)
})
```

## Test

Tests use *jest* and require a working Roadiz headless API to fetch responses from. Copy `.env.dist` to `.env` 
and fill your server credentials.

```
yarn
cp .env.dist .env
yarn test
```
