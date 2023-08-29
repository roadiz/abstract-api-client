import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import qs from 'qs'
import {
    RoadizRequestNSParams,
    RoadizRequestConfig,
    RoadizRequestParams,
    RoadizRequestSearchParams,
    RoadizRequestWebResponseParams,
    RoadizRequestAttributeValuesParams,
} from './types/request'
import { ArchivesHydraCollection, HydraCollection } from './types/hydra'
import {
    RoadizAlternateLink,
    RoadizAttributeValue,
    RoadizNodesSources,
    RoadizSearchResultItem,
    RoadizUserInput,
    RoadizUserOutput,
    RoadizUserPasswordRequest,
    RoadizUserPasswordReset,
    RoadizUserValidation,
    RoadizUserValidationRequest,
    RoadizWebResponse,
} from './types/roadiz'
import merge from 'deepmerge'

interface RoadizUserRequestHeaders {
    authorization?: string
    'x-g-recaptcha-response'?: string
}

export default class RoadizApi {
    protected apiKey?: string
    protected preview?: boolean
    protected debug?: boolean

    public axios: AxiosInstance

    public constructor(
        baseURL: string,
        config: { apiKey?: string; preview?: boolean; debug?: boolean; defaults?: AxiosRequestConfig } = {}
    ) {
        const { apiKey, preview, debug, defaults } = config
        const headers: { common: Record<string, string> } = {
            common: {
                Accept: 'application/ld+json',
            },
        }

        if (apiKey) headers.common['X-Api-Key'] = apiKey

        const internalDefaults: AxiosRequestConfig = {
            withCredentials: false,
            headers,
            baseURL,
            /*
             * Use qs to allow array query params
             */
            paramsSerializer: (params) => {
                return qs.stringify(params)
            },
        }

        const axiosDefaults = defaults ? merge(internalDefaults, defaults) : internalDefaults

        this.axios = axios.create(axiosDefaults)
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

    public getAttributeValues(
        params: RoadizRequestAttributeValuesParams
    ): Promise<AxiosResponse<HydraCollection<RoadizAttributeValue>>> {
        return this.get<HydraCollection<RoadizAttributeValue>, RoadizRequestAttributeValuesParams>(
            `/attribute_values`,
            {
                params,
            }
        )
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
        return this.get<HydraCollection<RoadizSearchResultItem | RoadizNodesSources>>('/nodes_sources/search', {
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

    /**
     * UserBundle: Fetch current logged-in user information.
     * @param {string} jwtToken
     */
    public getUserInformation(jwtToken: string): Promise<AxiosResponse<RoadizUserOutput>> {
        const headers = {
            authorization: `Bearer ${jwtToken}`,
        } as RoadizUserRequestHeaders
        return this.get<RoadizUserOutput>('/users/me', {
            headers,
            params: {},
        })
    }

    /**
     * UserBundle: Create a new public user. Anonymous request protected by Google reCAPTCHA.
     * Notice that you MUST log in user after success in order to get a JWT.
     *
     * @param {RoadizUserInput} data
     * @param {string | null} googleRecaptchaResponse
     */
    public postUser(data: RoadizUserInput, googleRecaptchaResponse: string | null = null): Promise<AxiosResponse> {
        const headers = {} as RoadizUserRequestHeaders
        if (null !== googleRecaptchaResponse) {
            headers['x-g-recaptcha-response'] = googleRecaptchaResponse
        }
        return this.axios.post('/users/signup', data, {
            headers,
            params: {},
        })
    }

    /**
     * UserBundle: Ask for a password reset request. Anonymous request protected by Google reCAPTCHA.
     * @param {RoadizUserPasswordRequest} data
     * @param {string | null} googleRecaptchaResponse
     */
    public postUserPasswordRequest(
        data: RoadizUserPasswordRequest,
        googleRecaptchaResponse: string | null = null
    ): Promise<AxiosResponse> {
        const headers = {} as RoadizUserRequestHeaders
        if (null !== googleRecaptchaResponse) {
            headers['x-g-recaptcha-response'] = googleRecaptchaResponse
        }
        return this.axios.post('/users/password_request', data, {
            headers,
            params: {},
        })
    }

    /**
     * UserBundle: Reset a user password. Anonymous request protected by given token.
     * @param {RoadizUserPasswordReset} data
     */
    public putUserPasswordReset(data: RoadizUserPasswordReset): Promise<AxiosResponse> {
        return this.axios.put('/users/password_reset', data, {
            params: {},
        })
    }

    /**
     * UserBundle: Asks for a User validation request. User MUST be logged-in.
     * @param {RoadizUserValidationRequest} data
     * @param {string} jwtToken
     */
    public postUserValidationRequest(data: RoadizUserValidationRequest, jwtToken: string): Promise<AxiosResponse> {
        const headers = {
            authorization: `Bearer ${jwtToken}`,
        } as RoadizUserRequestHeaders
        return this.axios.post('/users/validation_request', data, {
            headers,
            params: {},
        })
    }

    /**
     * UserBundle: Validate a User with temporary token. User MUST be logged-in at the same time.
     * @param {RoadizUserValidation} data
     * @param {string} jwtToken
     */
    public putUserValidation(data: RoadizUserValidation, jwtToken: string): Promise<AxiosResponse> {
        const headers = {
            authorization: `Bearer ${jwtToken}`,
        } as RoadizUserRequestHeaders
        return this.axios.put('/users/validate', data, {
            headers,
            params: {},
        })
    }

    public async fetchAllUrlsForLocale(_locale = 'fr', noIndex: boolean | undefined = false): Promise<Array<string>> {
        let page = 1
        let active = true
        const refs = [] as Array<string>

        do {
            await this.getNodesSources({
                'node.nodeType.reachable': true,
                noIndex,
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
                const title = attributes[3]?.split('title="').join('').split('"').join('').trim() || undefined

                return {
                    url: attributes[0].split('<').join('').split('>').join('').trim(),
                    locale: attributes[2].split('hreflang="').join('').split('"').join('').trim(),
                    // Must decode translation name from base64 because headers are ASCII only
                    title: title ? this.b64DecodeUnicode(title) : undefined,
                } as RoadizAlternateLink
            })
    }

    b64DecodeUnicode(str: string): string {
        return decodeURIComponent(
            Array.prototype.map
                .call(Buffer.from(str, 'base64').toString('binary'), function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                })
                .join('')
        )
    }
}
