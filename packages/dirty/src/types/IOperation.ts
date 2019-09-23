import { BitFieldEmitter } from '@reix/bits'

export interface IOperation<T> {
    get(): T
    dispose(): this

    emitter: BitFieldEmitter<void>
}
