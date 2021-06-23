import {RoadizApiNSParams, RoadizApiSearchParams, RoadizApiTagsParams} from '../types/roadiz-api'
import {ArchivesHydraCollection, HydraCollection} from '../types/hydra'
import {RoadizNodesSources, RoadizSearchResultItem, RoadizTag} from '../types/roadiz'
import axios, {AxiosInstance, AxiosResponse} from 'axios'
import {CommonContentResponse} from '../types/common'

export default class RoadizApi {
    protected axios: AxiosInstance
    protected apiKey: string
    protected preview: boolean

    constructor(baseURL: string, apiKey: string, preview: boolean = false, debug: boolean = false) {
        this.axios = axios.create();
        this.axios.defaults.withCredentials = false
        this.axios.defaults.headers['X-Api-Key'] = apiKey
        this.axios.defaults.baseURL = baseURL
        this.apiKey = apiKey;
        this.preview = preview;

        this.axios.interceptors.request.use((config) => {
            config.params = config.params || {}

            if (this.preview) {
                config.params['_preview'] = this.preview
            }
            return config
        })
    }

    getCommonContent(params: RoadizApiNSParams): Promise<AxiosResponse<CommonContentResponse>> {
        return this.axios.get<CommonContentResponse>('/common', {params})
    }

    getNodesSources(params: RoadizApiNSParams): Promise<AxiosResponse<HydraCollection<RoadizNodesSources>>> {
        return this.axios.get<HydraCollection<RoadizNodesSources>>(`/nodes-sources`, {
            params,
        })
    }

    getNodesSourcesByPath(path: string): Promise<AxiosResponse<RoadizNodesSources>> {
        return this.axios.get<RoadizNodesSources>('/nodes-sources/by-path', {
            params: {
                path: '/' + path || '',
            },
        })
    }

    /*
     * Returns RoadizSearchResultItem if search param is longer than 4 chars. Else return directly a RoadizNodesSources
     */
    searchNodesSourcesByPath(params: RoadizApiSearchParams): Promise<AxiosResponse<HydraCollection<RoadizSearchResultItem | RoadizNodesSources>>> {
        return this.axios.get<HydraCollection<RoadizSearchResultItem | RoadizNodesSources>>('/nodes-sources/search', {
            params,
        })
    }

    getTagsForType(type: string, params: RoadizApiTagsParams): Promise<AxiosResponse<HydraCollection<RoadizTag>>> {
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
    getArchivesForType(type: string, params: RoadizApiNSParams): Promise<AxiosResponse<ArchivesHydraCollection>> {
        return this.axios.get<ArchivesHydraCollection>(`/${type}/archives`, {
            params,
        })
    }
}
