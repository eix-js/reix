import {
    IComputationNode,
    InputMap,
    ProcessingFunction
} from '../types/IComputation'
import { computationFlags } from '../constants/computationFlags'
import { BaseComputationNode } from './BaseComputationNode'

export class LazyComputationNode<T, K extends InputMap>
    extends BaseComputationNode<T, K>
    implements IComputationNode<T> {
    /**
     * inner property keeping track of the state
     */
    public state = computationFlags.activeAndDirty

    /**
     * Lazy node for computation graphs.
     *
     * @param inputs Input nodes to react on.
     * @param calculate Function to calculate input from output.
     */
    public constructor(inputs: K, calculate: ProcessingFunction<K, T>) {
        super(inputs, calculate, () => {
            this.state |= computationFlags.dirty
        })
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

        return this.value!
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
