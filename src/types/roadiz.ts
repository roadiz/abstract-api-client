/**
 * Roadiz CMS entities and DTO
 *
 * @see https://docs.roadiz.io/en/latest/developer/nodes-system/intro.html#what-is-a-node-type
 */
import { JsonLdObject } from './jsonld'
import { HydraCollection } from './hydra'

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

export interface RoadizNodesSources extends JsonLdObject {
    node: RoadizNode
    translation?: RoadizTranslation
    slug: string // First urlAlias OR node.nodeName
    title: string
    publishedAt: string // ISO publication DateTime
    url?: string // Reachable nodes-sources URL
    metaTitle?: string
    metaDescription?: string
    urlAliases?: Array<RoadizUrlAlias>
}

export interface RoadizSearchHighlighting {
    // eslint-disable-next-line camelcase
    collection_txt?: string[]
    // eslint-disable-next-line camelcase
    collection_txt_fr?: string[]
    // eslint-disable-next-line camelcase
    collection_txt_en?: string[]
}

export interface RoadizSearchResultItem {
    nodeSource?: RoadizNodesSources
    highlighting?: RoadizSearchHighlighting
}

export interface RoadizArchivesYear {
    [key: string]: string
}

export interface RoadizArchivesList {
    [key: string]: RoadizArchivesYear
}

export interface RoadizUrlAlias {
    alias?: string
}

export interface RoadizTag extends JsonLdObject {
    name?: string
    color?: string
    slug?: string
    visible?: boolean
    documents: Array<RoadizDocument>
    parent?: RoadizTag
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

export interface RoadizWalker extends JsonLdObject {
    item: RoadizNodesSources
    children: Array<RoadizWalker>
}

export interface RoadizDocument extends JsonLdObject {
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
    url?: string
}

export interface RoadizDocumentTranslation extends JsonLdObject {
    name?: string
    description?: string
    copyright?: string
    translation?: RoadizTranslation
}

export interface RoadizAlternateLink {
    url: string
    locale: string
}

export interface RoadizWebResponse extends JsonLdObject {
    head: RoadizWebResponseHead
    item: RoadizWebResponseItem
    blocks: HydraCollection<RoadizWalker> | Array<Exclude<RoadizWalker, JsonLdObject>> // depends on HTTP response format (application/json or application/ld+json)
    breadcrumbs: RoadizBreadcrumbs
}

export interface RoadizWebResponseHead extends JsonLdObject {
    facebookUrl?: string
    twitterUrl?: string
    linkedinUrl?: string
    instagramUrl?: string
    youtubeUrl?: string
    shareImage?: RoadizDocument
    googleAnalytics?: string
    googleTagManager?: string
    matomoUrl?: string
    matomoSiteId?: string
    policyUrl?: string
    siteName?: string
    mainColor?: string
    homePageUrl?: string
    metaTitle?: string
    metaDescription?: string
}

export interface RoadizWebResponseItem extends JsonLdObject {
    url: string
}

export interface RoadizBreadcrumbs extends JsonLdObject {
    items: HydraCollection<JsonLdObject> | Array<unknown> // depends on HTTP response format (application/json or application/ld+json)
}
