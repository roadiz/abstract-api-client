import {RoadizArchivesList} from './roadiz'

/**
 * Hydra JSON-LD collection interface
 *
 * @see https://www.hydra-cg.com/spec/latest/core/
 */

export interface HydraCollection<T> {
    'hydra:member': Array<T>
    'hydra:totalItems': number
    'hydra:view': HydraView
}

export interface ArchivesHydraCollection {
    'hydra:member': RoadizArchivesList
    'hydra:totalItems': number
    'hydra:view': HydraView
}

export interface HydraView {
    '@id': string
    '@type': string
    'hydra:first'?: string
    'hydra:last'?: string
    'hydra:next'?: string
    'hydra:previous'?: string
}
