/**
 * Roadiz Headless API (AbstractApiTheme) query params DTO
 *
 * @see https://github.com/roadiz/AbstractApiTheme/blob/develop/README.md#listing-nodes-sources
 */
import { AxiosRequestConfig } from 'axios'

export interface RoadizRequestConfig<P> extends AxiosRequestConfig {
    params: P
}

export interface RoadizRequestParams {
    itemsPerPage?: number
    page?: number
    _preview?: boolean
    _locale?: string
    properties?: string[]
}

export interface RoadizRequestNSParams extends RoadizRequestParams {
    search?: string
    order?: {
        [key: string]: 'ASC' | 'DESC'
    }
    archive?: string
    path?: string
    id?: number
    title?: string
    publishedAt?: RoadizRequestPublishedParams
    tags?: Array<string>
    tagExclusive?: boolean
    not?: number | string | Array<number | string>
    'node.parent'?: string | number
    'node.visible'?: boolean
    'node.home'?: boolean
    'node.nodeType'?: string | Array<string>
    'node.nodeType.reachable'?: boolean
    'node.aNodes.nodeA'?: string | number
    'node.bNodes.nodeB'?: string | number
    'node.aNodes.field.name'?: string
    'node.bNodes.field.name'?: string
}

export interface RoadizRequestTagsParams extends RoadizRequestParams {
    search?: string
    order?: {
        [key: string]: 'ASC' | 'DESC'
    }
    tagName?: string
    'parent.tagName'?: string
    'nodes.nodeType.name'?: string
    'nodes.parent.nodeName'?: string
    visible?: boolean
}

export interface RoadizRequestPublishedParams {
    after?: string
    before?: string
    strictly_after?: string
    strictly_before?: string
}

export interface RoadizRequestSearchParams extends RoadizRequestParams {
    search?: string
}

export interface RoadizRequestWebResponseParams extends RoadizRequestParams {
    path: string
}
