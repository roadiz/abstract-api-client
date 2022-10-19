import { RoadizEntityArchive } from './roadiz'
import { JsonLdObject } from './jsonld'

/**
 * Hydra JSON-LD collection interface
 *
 * @see https://www.hydra-cg.com/spec/latest/core/
 */

export interface HydraCollection<T> extends JsonLdObject {
    'hydra:member': Array<T>
    'hydra:totalItems': number
    'hydra:view': HydraView
}

export type ArchivesHydraCollection = HydraCollection<RoadizEntityArchive>

export interface HydraView extends JsonLdObject {
    'hydra:first'?: string
    'hydra:last'?: string
    'hydra:next'?: string
    'hydra:previous'?: string
}
