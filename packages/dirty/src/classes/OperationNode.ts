import { IOperation } from '../types/IOperation'

export enum OperationFlags {
    dirty = 1,
    lazy = 2
}

export type OperationNodeInputMap = Record<string, IOperation<unknown>>
export type OperationNodeProcessingFunction<
    T extends OperationNodeInputMap,
    K
> = (inputs: T) => K

export class LazyOperationNode<T, K extends OperationNodeInputMap = {}>
    implements IOperation<T> {
    private state = 0

    private value: T

    public constructor(
        private inputs: K,
        private calculate: OperationNodeProcessingFunction<K, T>
    ) {}

    public triggerUpdate() {
        this.value = this.calculate(this.inputs)
    }

    public get() {
        if (this.state & OperationFlags.dirty) {
            this.triggerUpdate()
        }

        return this.value
    }
}
