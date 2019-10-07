import { BitFieldEmitter } from '@reix/bits'

export interface ComponentManager<T> {
    registerEntity(index: number, component: T): this
    deleteEntity(index: number): this
    get(id: number): T | null
    set(id: number, value: T): this
    emitter: BitFieldEmitter<number>
}
