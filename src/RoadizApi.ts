import {RoadizApiNSParams, RoadizApiSearchParams, RoadizApiTagsParams} from '../types/roadiz-api'
import {ArchivesHydraCollection, HydraCollection} from '../types/hydra'
import {RoadizNodesSources, RoadizSearchResultItem, RoadizTag} from '../types/roadiz'
import axios, {AxiosInstance, AxiosResponse} from 'axios'
import qs from 'qs'
import {CommonContentResponse} from '../types/common'

export default class RoadizApi {
    protected axios: AxiosInstance
    protected apiKey: string
    protected preview: boolean

    public constructor(baseURL: string, apiKey: string, preview: boolean = false, debug: boolean = false) {
        this.axios = axios.create();
        this.axios.defaults.withCredentials = false
        this.axios.defaults.headers.common = {
            'X-Api-Key': apiKey,
            'Accept': 'application/json',
        }
        this.axios.defaults.baseURL = baseURL
        this.axios.defaults.paramsSerializer = (params) => {
            return qs.stringify(params)
        }
        this.apiKey = apiKey;
        this.preview = preview;

        this.axios.interceptors.request.use((config) => {
            config.params = config.params || {}

            if (this.preview) {
                config.params['_preview'] = this.preview
            }
            return config
        })

        if (debug) {
            this.axios.interceptors.request.use(request => {
                console.log('Axios Request', JSON.stringify(request, null, 2))
                return request
            })
        }
    }

    public getCommonContent<T = CommonContentResponse>(params: RoadizApiNSParams): Promise<AxiosResponse<T>> {
        return this.axios.get<T>('/common', {params})
    }

    public getNodesSources(params: RoadizApiNSParams): Promise<AxiosResponse<HydraCollection<RoadizNodesSources>>> {
        return this.axios.get<HydraCollection<RoadizNodesSources>>(`/nodes-sources`, {
            params,
        })
    }

    /*
     * You should implement get`NodeType` method that use getNodesSourcesForType internally
     * and override return type.
     */
    public getNodesSourcesForType<T = RoadizNodesSources>(type: string, params: RoadizApiNSParams): Promise<AxiosResponse<HydraCollection<T>>> {
        return this.axios.get<HydraCollection<T>>(`/${type}`, {
            params,
        })
    }

    public getSingleNodesSourcesByPath(path: string = ''): Promise<AxiosResponse<RoadizNodesSources>> {
        const cleanPath = path.startsWith('/') ? path : ('/' + path)
        return this.axios.get<RoadizNodesSources>('/nodes-sources/by-path', {
            params: {
                path: cleanPath
            },
        })
    }

    /*
     * Returns RoadizSearchResultItem if search param is longer than 4 chars. Else return directly a RoadizNodesSources
     */
    public searchNodesSourcesByPath(params: RoadizApiSearchParams): Promise<AxiosResponse<HydraCollection<RoadizSearchResultItem | RoadizNodesSources>>> {
        return this.axios.get<HydraCollection<RoadizSearchResultItem | RoadizNodesSources>>('/nodes-sources/search', {
            params,
        })
    }

    public getTagsForType(type: string, params: RoadizApiTagsParams): Promise<AxiosResponse<HydraCollection<RoadizTag>>> {
        return this.axios.get<HydraCollection<RoadizTag>>(`/${type}/tags`, {
            params,
        })
    }

    /*
     * {
     *     "hydra:member": {
     *         "2021": {
     *             "2021-06": "2021-06-01T00:00:00+02:00",
     *             "2021-05": "2021-05-01T00:00:00+02:00",
     *             "2021-04": "2021-04-01T00:00:00+02:00"
     *         }
     *     },
     *     "hydra:totalItems": 1,
     *     "@id": "/api/1.0/post/archives",
     *     "@type": "hydra:Collection",
     *     "hydra:view": {
     *         "@id": "/api/1.0/post/archives?_locale=fr",
     *         "@type": "hydra:PartialCollectionView"
     *     }
     * }
     */
    public getArchivesForType(type: string, params: RoadizApiNSParams): Promise<AxiosResponse<ArchivesHydraCollection>> {
        return this.axios.get<ArchivesHydraCollection>(`/${type}/archives`, {
            params,
        })
    }

    public async fetchAllUrlsForLocale(_locale: string = 'fr'): Promise<Array<string>> {
        let page = 1
        let active = true
        const refs = [] as Array<string>

        do {
            await this.getNodesSources({
                'node.nodeType.reachable': true,
                properties: ['url'],
                page,
                _locale,
            })
            .then(({ data }): void => {
                if (data && data['hydra:member'] && data['hydra:totalItems']) {
                    data['hydra:member'].forEach((entry): void => {
                        if (entry.url) {
                            refs.push(entry.url)
                        }
                    })
                    active = !!(data['hydra:view'] && data['hydra:view']['hydra:next'])
                    ++page
                }
            })
        } while (active)

        return refs
    }
}
