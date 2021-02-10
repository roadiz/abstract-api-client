/**
 * Roadiz CMS entities and DTO
 *
 * @see https://docs.roadiz.io/en/latest/developer/nodes-system/intro.html#what-is-a-node-type
 */

export interface RoadizNodeType {
    name: string
}

export interface RoadizNode {
    nodeName: string
    home: boolean
    visible: boolean
    status?: number
    nodeType?: RoadizNodeType
    tags?: Array<RoadizTag>
    attributeValues: Array<RoadizAttributeValue>
}

export interface RoadizTranslation {
    locale: string // ISO 2-letter language code (fr, en, de).
}

export interface RoadizNodesSources {
    node: RoadizNode
    translation?: RoadizTranslation
    slug: string // First urlAlias OR node.nodeName
    title: string
    publishedAt: string // ISO publication DateTime
    url?: string // Reachable nodes-sources URL
    refererUrl?: string // Non-reachable nodes-sources parent URL
    metaTitle?: string
    metaKeywords?: string
    metaDescription?: string
    blocks?: Array<RoadizWalker>
    urlAliases?: Array<RoadizUrlAlias>
    '@type': string
    '@id'?: string
}

export interface RoadizUrlAlias {
    alias?: string
}

export interface RoadizTag {
    name?: string
    color?: string
    tagName?: string
    visible?: boolean
    '@type'?: string
    documents: Array<RoadizDocument>
}

export interface RoadizAttributeValue {
    attribute: RoadizAttribute
    attributeValueTranslations: Array<RoadizAttributeValueTranslation>
}

export interface RoadizAttributeValueTranslation {
    value?: string
    translation: RoadizTranslation
}

export interface RoadizAttribute {
    documents: Array<RoadizDocument>
    code?: string
    attributeTranslations: Array<RoadizAttributeTranslation>
}

export interface RoadizAttributeTranslation {
    label?: string
    translation: RoadizTranslation
}

export interface RoadizWalker {
    '@type': string
    item: RoadizNodesSources
    children: Array<RoadizWalker>
}

export interface RoadizDocument {
    processable: boolean // True if document can be processed by an image optimizer
    relativePath?: string
    alt?: string
    embedId?: string // Only for external documents (Youtube, Vimeo, …)
    embedPlatform?: string // Only for external documents (Youtube, Vimeo, …)
    mimeType?: string
    imageWidth?: string // Only for processable documents, i.e. images
    imageHeight?: string // Only for processable documents, i.e. images
    imageAverageColor?: string // Only for processable documents, i.e. images
    filename?: string
    filesize?: string
    thumbnail?: RoadizDocument // Only for none displayable documents, i.e. PDFs
    documentTranslations?: Array<RoadizDocumentTranslation>
    '@type': string
    url?: string
}

export interface RoadizDocumentTranslation {
    name?: string
    description?: string
    copyright?: string
    translation?: RoadizTranslation
}