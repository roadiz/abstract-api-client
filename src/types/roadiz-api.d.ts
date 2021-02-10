/**
 * Roadiz Headless API (AbstractApiTheme) query params DTO
 *
 * @see https://github.com/roadiz/AbstractApiTheme/blob/develop/README.md#listing-nodes-sources
 */
interface RoadizApiNSParams {
    itemsPerPage?: number
    page?: number
    _locale?: string
    search?: string
    order?: {
        [key: string]: 'ASC' | 'DESC'
    }
    archive?: string
    path?: string
    id?: number
    title?: number
    publishedAt?: RoadizApiPublishedParams
    tags?: Array<string>
    tagExclusive?: boolean
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

interface RoadizApiPublishedParams {
    after?: string
    before?: string
    strictly_after?: string
    strictly_before?: string
}