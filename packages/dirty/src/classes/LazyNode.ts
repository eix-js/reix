import {
    IComputationNode,
    InputMap,
    ProcessingFunction
} from '../types/IComputation'
import { computationFlags } from '../constants/computationFlags'
import { BaseComputationNode } from './BaseComputationNode'
import { computationEvents } from '../constants/computationEvents'

/**
 * Lazy node for computation graphs
 */
export class LazyComputationNode<T, K extends InputMap>
    extends BaseComputationNode<T, K>
    implements IComputationNode<T> {
    public constructor(inputs: K, calculate: ProcessingFunction<K, T>) {
        super(inputs, calculate)

        for (const emitter of this.inputEmitters) {
            emitter.on(computationEvents.changed, () => {
                this.state |= computationFlags.dirty

                // TODO: unsubscribe on dispose
            })
        }

        this.state |= computationFlags.dirty
    }

    /**
     * Returns the current vaule of the node.
     *
     * > Note: if the state of the node is "dirty"
     * an update will be triggered.
     */
    public get() {
        if (this.state & computationFlags.dirty) {
            this.triggerUpdate()
        }

        return this.value
    }

    /**
     * Sets the dirty state to false.
     */
    protected postUpdate() {
        if (this.state & computationFlags.dirty) {
            this.state ^= computationFlags.dirty
        }
    }
}
