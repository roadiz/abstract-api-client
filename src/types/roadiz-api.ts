/**
 * Roadiz Headless API (AbstractApiTheme) query params DTO
 *
 * @see https://github.com/roadiz/AbstractApiTheme/blob/develop/README.md#listing-nodes-sources
 */
export interface AlternateLink {
    url: string
    locale: string
}

export interface RoadizApiBaseParams {
    itemsPerPage?: number
    page?: number
    _preview?: boolean
    _locale?: string
    properties?: string[]
}

export interface RoadizApiNSParams extends RoadizApiBaseParams {
    search?: string
    order?: {
        [key: string]: 'ASC' | 'DESC'
    }
    archive?: string
    path?: string
    id?: number
    title?: string
    publishedAt?: RoadizApiPublishedParams
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

export interface RoadizApiTagsParams extends RoadizApiBaseParams {
    search?: string
    order?: {
        [key: string]: 'ASC' | 'DESC'
    }
    tagName?: string
    publishedAt?: RoadizApiPublishedParams
    parent?: string | number
    visible?: boolean
}

export interface RoadizApiPublishedParams {
    after?: string
    before?: string
    strictly_after?: string
    strictly_before?: string
}

export interface RoadizApiSearchParams extends RoadizApiBaseParams {
    search?: string
    archive?: string
    id?: number
    title?: string
    tags?: Array<string>
    publishedAt?: RoadizApiPublishedParams
    'node.nodeType'?: string | Array<string>
    'node.parent'?: string | number
    'node.visible'?: boolean
}
