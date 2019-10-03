import {
    IComputationNode,
    InputMap,
    ProcessingFunction
} from '../types/IComputation'
import { BaseComputationNode } from './BaseComputationNode'
import { computationEvents } from '../constants/computationEvents'

export class SynchronousComputationNode<T, K extends InputMap>
    extends BaseComputationNode<T, K>
    implements IComputationNode<T> {
    /**
     * Lazy node for computation graphs.
     *
     * @param inputs Input nodes to react on.
     * @param calculate Function to calculate input from output.
     */
    public constructor(inputs: K, calculate: ProcessingFunction<K, T>) {
        // can't bind it to this cause this can't shouldn't
        // be accessed before super()
        super(inputs, calculate, () => {
            this.triggerUpdate()
        })

        this.triggerUpdate()
    }

    /**
     * Returns the current vaule of the node.
     */
    public get() {
        return this.value!
    }
}
