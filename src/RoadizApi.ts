import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import qs from 'qs'
import {
    RoadizRequestNSParams,
    RoadizRequestConfig,
    RoadizRequestParams,
    RoadizRequestSearchParams,
    RoadizRequestWebResponseParams,
} from './types/request'
import { ArchivesHydraCollection, HydraCollection } from './types/hydra'
import { RoadizAlternateLink, RoadizNodesSources, RoadizSearchResultItem, RoadizWebResponse } from './types/roadiz'

export default class RoadizApi {
    protected axios: AxiosInstance
    protected apiKey: string
    protected preview: boolean
    protected debug: boolean

    public constructor(baseURL: string, apiKey: string, preview = false, debug = false) {
        this.axios = axios.create()
        this.axios.defaults.withCredentials = false
        this.axios.defaults.headers.common = {
            'X-Api-Key': apiKey,
            Accept: 'application/ld+json',
        }
        this.axios.defaults.baseURL = baseURL
        /*
         * Use qs to allow array query params
         */
        this.axios.defaults.paramsSerializer = (params) => {
            return qs.stringify(params)
        }
        this.apiKey = apiKey
        this.preview = preview
        this.debug = debug

        this.axios.interceptors.request.use((config: AxiosRequestConfig) => {
            config.params = config.params || {}
            /*
             * Need to set at lease
             */
            config = this.onApiRequest(config)

            if (this.preview) {
                config.params['_preview'] = this.preview
            }
            if (this.debug) {
                console.log('Axios Request', JSON.stringify(config, null, 2))
            }
            return config
        })
    }

    /**
     * @override Override this method to alter each Axios requests
     * @param config
     */
    protected onApiRequest(config: AxiosRequestConfig): AxiosRequestConfig {
        return config
    }

    public getNodesSources(params: RoadizRequestNSParams): Promise<AxiosResponse<HydraCollection<RoadizNodesSources>>> {
        return this.get<HydraCollection<RoadizNodesSources>, RoadizRequestNSParams>(`/nodes_sources`, {
            params,
        })
    }

    public getWebResponseByPath(
        params: RoadizRequestWebResponseParams | string
    ): Promise<AxiosResponse<RoadizWebResponse>> {
        const requestParams: RoadizRequestWebResponseParams = typeof params === 'string' ? { path: params } : params

        return this.get<RoadizWebResponse, RoadizRequestWebResponseParams>(`/web_response_by_path`, {
            params: requestParams,
        })
    }

    /*
     * Returns RoadizSearchResultItem if search param is longer than 4 chars. Else return directly a RoadizNodesSources
     */
    public searchNodesSourcesByPath(
        params: RoadizRequestSearchParams
    ): Promise<AxiosResponse<HydraCollection<RoadizSearchResultItem | RoadizNodesSources>>> {
        return this.axios.get<HydraCollection<RoadizSearchResultItem | RoadizNodesSources>>('/nodes_sources/search', {
            params,
        })
    }

    public getArchivesForType(
        type: string,
        params: RoadizRequestNSParams
    ): Promise<AxiosResponse<ArchivesHydraCollection>> {
        return this.get<ArchivesHydraCollection, RoadizRequestNSParams>(`/${type}/archives`, {
            params,
        })
    }

    /**
     * Generic method for any url
     * @param url
     * @param config
     */
    public get<T, R = RoadizRequestParams>(url: string, config?: RoadizRequestConfig<R>): Promise<AxiosResponse<T>> {
        return this.axios.get<T>(url, config)
    }

    public async fetchAllUrlsForLocale(_locale = 'fr'): Promise<Array<string>> {
        let page = 1
        let active = true
        const refs = [] as Array<string>

        do {
            await this.getNodesSources({
                'node.nodeType.reachable': true,
                properties: ['url'],
                page,
                _locale,
            }).then(({ data }): void => {
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

    getAlternateLinks(response: AxiosResponse): Array<RoadizAlternateLink> {
        if (!response.headers.link) return []

        return response.headers.link
            .split(',')
            .filter((link: string) => {
                return link
                    .split(';')
                    .map((attribute) => attribute.trim())
                    .includes('type="text/html"')
            })
            .map((link: string) => {
                const attributes = link.split(';')

                return {
                    url: attributes[0].split('<').join('').split('>').join('').trim(),
                    locale: attributes[2].split('hreflang="').join('').split('"').join('').trim(),
                } as RoadizAlternateLink
            })
    }
}
