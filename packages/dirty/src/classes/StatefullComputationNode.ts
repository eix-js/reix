import { IStatefullComputationNode } from '../types/IComputation'
import { computationFlags } from '../constants/computationFlags'

export class StatefullComputationNode implements IStatefullComputationNode {
    /**
     * inner property keeping track of the state
     */
    public state = computationFlags.active

    /**
     * Helper for extracting the "active" flag from the state property.
     */
    public isActive() {
        return this.state & computationFlags.active
    }
}
