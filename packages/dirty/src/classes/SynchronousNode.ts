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
export class SynchronousComputationNode<T, K extends InputMap>
    extends BaseComputationNode<T, K>
    implements IComputationNode<T> {
    public constructor(inputs: K, calculate: ProcessingFunction<K, T>) {
        super(inputs, calculate)

        for (const emitter of this.inputEmitters) {
            emitter.on(computationEvents.changed, () => {
                this.triggerUpdate()

                // TODO: unsubscribe on dispose
            })
        }

        this.state |= computationFlags.dirty
    }

    /**
     * Returns the current vaule of the node.
     */
    public get() {
        return this.value
    }
}
