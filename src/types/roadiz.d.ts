/**
 * Roadiz CMS entities and DTO
 *
 * @see https://docs.roadiz.io/en/latest/developer/nodes-system/intro.html#what-is-a-node-type
 */

interface RoadizNodeType {
    name: string
}

interface RoadizNode {
    nodeName: string
    home: boolean
    visible: boolean
    status?: number
    nodeType?: RoadizNodeType
    tags?: Array<RoadizTag>
    attributeValues: Array<RoadizAttributeValue>
}

interface RoadizTranslation {
    locale: string
}

interface RoadizNodesSources {
    node: RoadizNode
    translation?: RoadizTranslation
    slug: string
    title: string
    publishedAt: string
    url?: string
    metaTitle?: string
    metaKeywords?: string
    metaDescription?: string
    blocks?: Array<RoadizWalker>
    '@type': string
    '@id'?: string
}

interface RoadizTag {}

interface RoadizAttributeValue {}

interface RoadizWalker {
    '@type': string
    item: RoadizNodesSources
    children: Array<RoadizWalker>
}

interface RoadizDocument {
    processable: boolean
    relativePath?: string
    alt?: string
    platform?: string
    embedId?: string
    embedPlatform?: string
    mimeType?: string
    image?: string
    imageWidth?: string
    imageHeight?: string
    imageAverageColor?: string
    fileSize?: string
    url?: string
    thumbnail?: RoadizDocument
    documentTranslations?: Array<RoadizDocumentTranslation>
}

interface RoadizDocumentTranslation {
    name?: string
    description?: string
    copyright?: string
    translation?: RoadizTranslation
}