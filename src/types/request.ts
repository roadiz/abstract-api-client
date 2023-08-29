/**
 * Roadiz Headless API (AbstractApiTheme) query params DTO
 *
 * @see https://github.com/roadiz/AbstractApiTheme/blob/develop/README.md#listing-nodes-sources
 */
import { AxiosRequestConfig } from 'axios'

export interface RoadizRequestConfig<P> extends AxiosRequestConfig {
    params?: P
}

export interface RoadizRequestParams {
    itemsPerPage?: number
    page?: number
    _preview?: boolean
    _locale?: string
    properties?: string[]
    [key: string]: unknown
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
    noIndex?: boolean
    publishedAt?: RoadizRequestDateTimeParams
    'node.position'?: RoadizRequestRangeParams | number | Array<number>
    'node.createdAt'?: RoadizRequestDateTimeParams
    'node.updatedAt'?: RoadizRequestDateTimeParams
    // Since Roadiz v2.1 node's tags relation is visible
    'node.nodesTags.tag'?: Array<string> | string
    'node.nodesTags.tag.tagName'?: Array<string> | string
    // Discriminate an existing filter with additional filtering value using a new inner join.
    intersect?: {
        'node.nodesTags.tag'?: Array<string> | string
        'node.nodesTags.tag.tagName'?: Array<string> | string
    }
    not?: {
        'node.nodesTags.tag.tagName'?: Array<string> | string
        'node.nodeType.name'?: Array<string> | string
        'node.id'?: Array<string> | string
    }
    'node.parent'?: string | number
    'node.visible'?: boolean
    'node.home'?: boolean
    'translation.id'?: string | Array<string>
    'translation.locale'?: string | Array<string>
    'node.nodeType'?: string | Array<string>
    'node.nodeType.reachable'?: boolean
    'node.nodeType.publishable'?: boolean
    'node.aNodes.nodeA'?: string | number
    'node.bNodes.nodeB'?: string | number
    'node.aNodes.field.name'?: string
    'node.bNodes.field.name'?: string
}

export interface RoadizRequestAttributeValuesParams extends RoadizRequestParams {
    order?: {
        [key: string]: 'ASC' | 'DESC'
    }
    node?: string | Array<string>
    'node.id'?: number | Array<number>
    'node.nodeName'?: string | Array<string>
    'node.nodeType'?: string | Array<string>
    'node.nodeType.name'?: string | Array<string>
    'node.visible'?: boolean
    'attribute.code'?: string | Array<string>
    'attribute.type'?: number | Array<number>
    'attribute.group.canonicalName'?: string | Array<string>
    'attributeValueTranslations.value'?: string | Record<'between' | 'gt' | 'gte' | 'lt' | 'lte', string>
    exists?: {
        'attributeValueTranslations.value': boolean | 'true' | 'false' | '0' | '1'
    }
}

export interface RoadizRequestTagsParams extends RoadizRequestParams {
    search?: string
    order?: {
        [key: string]: 'ASC' | 'DESC'
    }
    not?: {
        'parent.id'?: string
        'parent.tagName'?: string
    }
    tagName?: string
    'parent.id'?: string | Array<string>
    'parent.tagName'?: string | Array<string>
    'nodesTags.node.visible'?: boolean
    'nodesTags.node'?: string | Array<string>
    'nodesTags.node.nodeName'?: string | Array<string>
    'nodesTags.node.nodeType'?: string | Array<string>
    'nodesTags.node.nodeType.name'?: string | Array<string>
    'nodesTags.node.nodeType.reachable'?: boolean
    'nodesTags.node.parent.nodeName'?: string | Array<string>
    visible?: boolean
    locked?: boolean
}

export interface RoadizRequestDateTimeParams {
    after?: string
    before?: string
    strictly_after?: string
    strictly_before?: string
}

export interface RoadizRequestRangeParams {
    between?: string
    gt?: string
    gte?: string
    lt?: string
    lte?: string
}

export interface RoadizRequestSearchParams extends RoadizRequestParams {
    search?: string
}

export interface RoadizRequestWebResponseParams extends RoadizRequestParams {
    path: string
}
