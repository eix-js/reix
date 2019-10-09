import { BitFieldEmitter } from '@reix/bits'

/**
 * Basic interface for all component managers to implement.
 */
export interface ComponentManager<T> {
    registerEntity(index: number, component: T): this
    deleteEntity(index: number): this
    get(id: number): T | null
    set(id: number, value: T): this
    emitter: BitFieldEmitter<number>
}

/**
 * Extract the underlyign type of any manager.
 */
export type ExtractManagerType<T> = T extends ComponentManager<infer R>
    ? R
    : never
