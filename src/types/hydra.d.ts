/**
 * Hydra JSON-LD collection interface
 *
 * @see https://www.hydra-cg.com/spec/latest/core/
 */

interface HydraCollection<T> {
    'hydra:member': Array<T>
    'hydra:totalItems': number
    'hydra:view': HydraView
}

interface HydraView {
    '@id': string
    '@type': string
    'hydra:first'?: string
    'hydra:last'?: string
    'hydra:next'?: string
    'hydra:previous'?: string
}