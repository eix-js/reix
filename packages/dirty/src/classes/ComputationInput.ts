import { IComputationNode } from '../types/IComputation'
import { BitFieldEmitter } from '@reix/bits'
import { computationEvents } from '../constants/computationEvents'

/**
 * Input node for computation graphs
 */
export class ComputationInputNode<T> implements IComputationNode<T> {
    /**
     * Only allow calling methods if this is true
     */
    private active = true

    /**
     * Emits changed & disposed events
     */
    public emitter = new BitFieldEmitter<void>()

    public constructor(private value: T) {}

    /**
     * Gets the current value of the node.
     *
     * @returns The current value of the ndoe
     */
    public get() {
        return this.value
    }

    /**
     * Kills node and children.
     *
     * @returns The current OperationInputNode instance.
     * @emits disposed
     */
    public dispose() {
        if (!this.active) {
            return this
        }

        this.emitter.emit(computationEvents.disposed)
        this.active = false

        return this
    }

    /**
     * Sets the current value of a node.
     *
     * @param newValue The value to set the node to.
     * @returns The current OperationInputNode instance.
     * @emits changed
     *
     */
    public set(newValue: T) {
        if (!this.active || newValue === this.value) {
            return this
        }

        this.emitter.emit(computationEvents.changed)
        this.value = newValue

        return this
    }
}
