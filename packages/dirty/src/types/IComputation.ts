import { BitFieldEmitter } from '@reix/bits'

/**
 * Interface for nodes which expose an evene emitter.
 */
export interface IEventDrivenComputationNode {
    emitter: BitFieldEmitter<void>
}

/**
 * Interface for nodes which have a "dispose" method.
 */
export interface IDisposableComputationNode {
    dispose(): this
}

export interface IStatefullComputationNode {
    state: number

    isActive(): number
}

/**
 * Interface for nodes which can are readable from the outside.
 */
export interface IReadableComputationNode<T> {
    get(): T
}

/**
 * Base interface for all prebuilt nodes.
 */
export type IComputationNode<T> = IEventDrivenComputationNode &
    IReadableComputationNode<T> &
    IDisposableComputationNode &
    IStatefullComputationNode

export type InputMap = Record<string, IComputationNode<unknown>>

export type ProcessingFunctionArguments<T extends InputMap> = {
    [key in keyof T]: ReturnType<T[key]['get']>
}

export type ProcessingFunction<T extends InputMap, K> = (
    inputs: ProcessingFunctionArguments<T>
) => K
