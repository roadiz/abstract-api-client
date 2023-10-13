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

export interface RoadizNode extends JsonLdObject {
    nodeName?: string
    home?: boolean
    visible: boolean
    status?: number
    position?: number
    childrenOrder?: 'position' | 'nodeName' | 'createdAt' | 'updatedAt' | 'ns.publishedAt'
    childrenOrderDirection?: 'ASC' | 'DESC'
    nodeType?: RoadizNodeType
    tags?: Array<RoadizTag>
    attributeValues?: Array<Omit<RoadizAttributeValue, 'node'>>
}

export interface RoadizTranslation {
    locale: string // ISO 2-letter language code (fr, en, de).
}

export interface RoadizSecureRealm extends JsonLdObject {
    type: 'plain_password' | 'bearer_role' | 'bearer_user'
    behaviour: 'none' | 'deny' | 'hide_blocks'
    // Defines how frontend should pass credentials to API:
    // - PasswordQuery: pass `?password=xxxxx` in query-string
    // - Bearer: use standard `Authentication: Bearer xxxxxx` HTTP header
    authenticationScheme: 'PasswordQuery' | 'Bearer'
    name?: string
}

export interface RoadizNodesSources extends JsonLdObject {
    node: Omit<RoadizNode, 'home' | 'nodeType' | 'status'>
    translation?: RoadizTranslation
    slug: string // First urlAlias OR node.nodeName
    title: string
    publishedAt: string // ISO publication DateTime
    url?: string // Reachable nodes-sources URL
    metaTitle?: string
    metaDescription?: string
    noIndex?: boolean
    urlAliases?: Array<RoadizUrlAlias>
    listingSortOptions?: {
        [key: string]: 'ASC' | 'DESC'
    }
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

export interface RoadizAttributeValue extends JsonLdObject {
    node?: string
    position?: number
    type?: number
    code?: string
    color?: string | null
    label?: string
    value?: string | number | boolean | null
    documents?: Array<RoadizDocument>
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
    type?: string // mimeType short version
    imageWidth?: string // Only for processable documents, i.e. images
    imageHeight?: string // Only for processable documents, i.e. images
    imageAverageColor?: string // Only for processable documents, i.e. images
    imageCropAlignment?:
        | 'top-left'
        | 'top'
        | 'top-right'
        | 'left'
        | 'center'
        | 'right'
        | 'bottom-left'
        | 'bottom'
        | 'bottom-right' // Only for processable documents, i.e. images
    filename?: string
    filesize?: string
    thumbnail?: RoadizDocument // Only for none displayable documents, i.e. PDFs
    copyright?: string
    externalUrl?: string
    name?: string
    description?: string
    publicUrl?: string // Only for none processable documents, i.e. PDFs, SVG
    mediaDuration?: number
    folders?: Array<RoadizFolder>
    private?: boolean
    altSources?: Array<RoadizDocument> // Only for native video and audio documents
}

export interface RoadizFolder extends JsonLdObject {
    slug: string
    name: string
    visible: boolean
}

export interface RoadizAlternateLink {
    url: string
    title?: string
    locale: string
}

export interface RoadizWebResponse extends JsonLdObject {
    head: RoadizWebResponseHead
    item: RoadizWebResponseItem
    blocks: RoadizWebResponseBlocks
    breadcrumbs: RoadizBreadcrumbs
    realms?: Array<RoadizSecureRealm>
    hidingBlocks?: boolean
}

// depends on HTTP response format (application/json or application/ld+json)
export type RoadizWebResponseBlocks = HydraCollection<RoadizWalker> | Array<Omit<RoadizWalker, keyof JsonLdObject>>

export interface RoadizNodesSourcesHead extends JsonLdObject {
    siteName?: string | null
    metaTitle?: string | null
    metaDescription?: string | null
    policyUrl?: string | null
    homePageUrl?: string | null
    shareImage?: RoadizDocument | null
    facebookUrl?: string | null
    twitterUrl?: string | null
    linkedinUrl?: string | null
    instagramUrl?: string | null
    youtubeUrl?: string | null
    noIndex?: boolean
    googleAnalytics?: string | null
    googleTagManager?: string | null
    matomoUrl?: string | null
    matomoSiteId?: string | null
    matomoTagManager?: string | null
    mainColor?: string | null
}

// TODO: add generic for Events API to augment this interface?
export type RoadizWebResponseHead = RoadizNodesSourcesHead

export interface RoadizWebResponseItem extends JsonLdObject {
    url: string
}

export interface RoadizBreadcrumbs extends JsonLdObject {
    items: HydraCollection<JsonLdObject> | Array<unknown> // depends on HTTP response format (application/json or application/ld+json)
}

/**
 * A Roadiz entity archive exposes available months when entities were published at.
 * I.e /api/blog_posts/archives
 * @see RoadizApi.getArchivesForType()
 */
export interface RoadizEntityArchive extends JsonLdObject {
    year: number
    months: Record<string, string>
}

/*
 * User DTOs exposed by roadiz/user-bundle.
 * Extend this interface in your project when additional data is exposed.
 */

/*
 * Public user information to complete JWT with up-to-date data.
 * ALWAYS take authorization decisions based on RoadizUserOutput instead of
 * JWT scopes.
 */
export interface RoadizUserOutput extends JsonLdObject {
    identifier: string // email or username: identifier used for login
    roles?: string[]
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    company?: string | null
    job?: string | null
    birthday?: string | null
    emailValidated?: boolean
}

/*
 * Public user creation workflow:
 * - Create a user with email and plainPassword
 * This operation MUST be secured with HTTPS as payload holds a
 * plain password.
 */
export interface RoadizUserInput {
    email: string
    plainPassword: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    company?: string | null
    job?: string | null
    birthday?: string | null
    metadata?: unknown
}

/*
 * User password recovery workflow:
 * - user password request
 * - Email sent with temporary token (if account exists)
 * - user reset its password with token
 */
export interface RoadizUserPasswordRequest {
    identifier: string
}
export interface RoadizUserPasswordReset {
    token: string
    plainPassword: string
}

/*
 * User account validation workflow:
 * - validation request
 * - Email sent with temporary token
 * - account validation with received token
 */
export interface RoadizUserValidationRequest {
    identifier: string
}
export interface RoadizUserValidation {
    token: string
}
