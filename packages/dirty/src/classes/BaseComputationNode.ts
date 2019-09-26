import { BitFieldEmitter } from '@reix/bits'
import { computationEvents } from '../constants/computationEvents'
import {
    InputMap,
    IEventDrivenComputationNode,
    IDisposableComputationNode,
    ProcessingFunction
} from '../types/IComputation'
import { computationFlags } from '../constants/computationFlags'

/**
 * Base class for any non-input nodes with a "dispose" method.
 */
export class BaseComputationNode<T, K extends InputMap>
    implements IEventDrivenComputationNode, IDisposableComputationNode {
    /**
     * inner property keeping track of the state
     */
    protected state = computationFlags.active

    /**
     * Inner property containing the current value of the node
     */
    protected value: T

    /**
     * Array of all inputEmitters the node has
     */
    protected inputEmitters: BitFieldEmitter<void>[]

    /**
     * The base emitter implementing
     */
    public emitter = new BitFieldEmitter<void>()

    public constructor(
        protected inputs: K,
        protected calculate: ProcessingFunction<K, T>
    ) {
        this.inputEmitters = Object.values(inputs).map(input => input.emitter)

        const disposeHandler = () => {
            this.dispose()

            for (const emitter of this.inputEmitters) {
                emitter.remove(disposeHandler)
            }
        }

        for (const emitter of this.inputEmitters) {
            emitter.on(computationEvents.disposed, disposeHandler)
        }
    }

    /**
     * Dispose the current node.
     * Each node which extends this class is free to use the active state however it wants.
     *
     * @returns The BaseComputationNode instance.
     */
    public dispose() {
        if (this.state & computationFlags.active) {
            this.emitter.emit(computationEvents.disposed)
            this.state ^= computationFlags.active
        }

        return this
    }

    /**
     * Helper for extracting the "active" flag from the state property.
     */
    public isActive() {
        return this.state & computationFlags.active
    }

    /**
     * Trigger an update of the entire node.
     *
     * > Note: the "changed" event won't be emited if
     * the new value is the same as the old one.
     *
     * > Note: the "updated" event will be emited even if
     *  the value is the same as the old one.
     *
     * > Note: both the "updated" and "changed" events will
     *  be emitted at the same time.
     *
     * @emits computationEvents.updated
     * @emits computationEvents.changed
     *
     * @returns The LazyComputationNode instance.
     */
    public triggerUpdate() {
        if (!this.isActive) {
            return this
        }

        const newValue = this.calculate(this.inputs)

        let toEmit = computationEvents.updated

        if (newValue !== this.value) {
            toEmit |= computationEvents.changed
            this.value = newValue
        }

        this.emitter.emit(toEmit)

        if (this.state & computationFlags.dirty) {
            this.state ^= computationFlags.dirty
        }

        return this
    }
}
