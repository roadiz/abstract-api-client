/*
 * This is an automated Roadiz interface declaration file.
 * RoadizNodesSources, RoadizDocument and other mentioned types are part of
 * roadiz/abstract-api-client package which must be installed in your project.
 *
 * @see https://github.com/roadiz/abstract-api-client
 *
 * Roadiz CMS node-types interfaces
 *
 * @see https://docs.roadiz.io/en/latest/developer/nodes-system/intro.html#what-is-a-node-type
 */

import { RoadizDocument, RoadizNodesSources } from '../../types/roadiz'

//
// Content block
//
// Reachable: false
// Publishable: false
// Visible: true
interface NSContentBlock extends RoadizNodesSources {
    // Content
    content?: string
    // Image
    image: Array<RoadizDocument>
}

//
// Neutral
//
// Reachable: false
// Publishable: false
// Visible: true
interface NSNeutral extends RoadizNodesSources {

}

//
// Page
//
// Reachable: true
// Publishable: true
// Visible: true
interface NSPage extends RoadizNodesSources {
    // This node-type uses "blocks" which are available through parent RoadizNodesSources.blocks
    // Possible block node-types: ContentBlock
    // Content
    content?: string
    // Content
    intro?: string
    // Image
    image: Array<RoadizDocument>
    // Reference to other page
    // Group: References
    // Possible values: Page
    pageReference: Array<NSPage>
}
