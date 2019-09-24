import { IOperation, InputMap, ProcessingFunction } from '../types/IOperation'
import { operationFlags } from '../constants/operationFlags'
import { DisposableNode } from './DisposableNode'
import { operationEvents } from '../constants/operationEvents'

export class LazyComputationNode<T, K extends InputMap>
    extends DisposableNode<K>
    implements IOperation<T> {
    private state = operationFlags.dirty
    private value: T

    public constructor(inputs: K, private calculate: ProcessingFunction<K, T>) {
        super(inputs)

        for (const emitter of this.inputEmitters) {
            emitter.on(operationEvents.changed, () => {
                this.state |= operationFlags.dirty

                // TODO: unsubscribe on dispose
            })
        }
    }

    public triggerUpdate() {
        if (!this.active) {
            return this
        }

        const newValue = this.calculate(this.inputs)

        let toEmit = operationEvents.updated

        if (newValue !== this.value) {
            toEmit |= operationEvents.changed
            this.value = newValue
        }

        this.emitter.emit(toEmit)

        if (this.state & operationFlags.dirty) {
            this.state ^= operationFlags.dirty
        }

        return this
    }

    public get() {
        if (this.state & operationFlags.dirty) {
            this.triggerUpdate()
        }

        return this.value
    }
}
