# abstract-api-client
Abstract API Typescript client interfaces and SDK.

Based on *Axios* HTTP client.

## Usage

```json
yarn add @roadiz/abstract-api-client
```

```json
// tsconfig.json
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
- Add `get{YourNodeType}` methods for each of your node-types. RoadizApi methods use Typescript generics to easily declare
your return type inside collections: `this.getNodesSourcesForType<NSPage>('page', params)` 
- Other methods can be overridden without specifying type

```ts
export default class MyAwesomeRoadizApi extends RoadizApi {
    /*
     * Page node-type
     */
    getPages(params: RoadizApiNSParams) {
        return this.getNodesSourcesForType<NSPage>('page', params)
    }
    getPagesTags(params: RoadizApiTagsParams) {
        return this.getTagsForType('page', params)
    }
    
    /*
     * BlogPost node-type
     */
    getBlogPosts(params: RoadizApiNSParams) {
        // Additional default params…
        params = {
            order: {
                publishedAt: 'DESC'
            },
            ...params,
        }
        return this.getNodesSourcesForType<NSBlogPost>('blog-post', params)
    }
    getBlogPostsTags(params: RoadizApiTagsParams) {
        return this.getTagsForType('blog-post', params)
    }
    getBlogPostsArchives(params: RoadizApiNSParams) {
        return this.getArchivesForType('blog-post', params)
    }
}
```

### Fetch all URLs for a sitemap

```ts
const api = new HeadlessRoadizApi(
    process.env.API_BASE_URL, 
    process.env.API_NON_PREVIEW_API_KEY, 
    false
)

return api.fetchAllUrlsForLocale('fr').then((urls: Array<string>) => {
    // build your sitemap
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
