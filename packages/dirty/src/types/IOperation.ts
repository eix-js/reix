import { BitFieldEmitter } from '@reix/bits'

export interface IOperation<T> {
    get(): T
    dispose(): this

    emitter: BitFieldEmitter<void>
}

export type InputMap = Record<string, IOperation<unknown>>
export type ProcessingFunction<T extends InputMap, K> = (inputs: T) => K
