import { IComputationNode } from '../types/IComputation'
import { BitFieldEmitter } from '@reix/bits'
import { computationEvents } from '../constants/computationEvents'
import { StatefullComputationNode } from './StatefullComputationNode'
import { computationFlags } from '../constants/computationFlags'

/**
 * Input node for computation graphs
 */
export class ComputationInputNode<T> extends StatefullComputationNode
    implements IComputationNode<T> {
    /**
     * Emits changed & disposed events
     */
    public emitter = new BitFieldEmitter<void>()

    public constructor(private value: T) {
        super()
    }

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
        if (this.state & computationFlags.active) {
            this.state ^= computationFlags.active
            this.emitter.emit(computationEvents.disposed)
        }

        return this
    }

    /**
     * Sets the current value of a node.
     *
     * @param newValue The value to set the node to.
     * @returns The current OperationInputNode instance.
     * @emits changed
     */
    public set(newValue: T) {
        if (!this.isActive()) {
            return this
        }

        let toEmit = computationEvents.updated

        if (newValue !== this.value) {
            this.value = newValue
            toEmit |= computationEvents.changed
        }

        this.emitter.emit(toEmit)

        return this
    }
}
