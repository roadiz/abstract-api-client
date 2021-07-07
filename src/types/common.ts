import { RoadizHead, RoadizWalker } from './roadiz'

export interface CommonContentResponse {
    head: RoadizHead
    mainMenuWalker?: RoadizWalker
    '@type': string
}
