import { IOperation } from '../types/IOperation'
import { BitFieldEmitter } from '@reix/bits'
import { operationEvents } from '../constants/operationEvents.'

export class OperationInputNode<T> implements IOperation<T> {
    private active = true

    public constructor(private value: T) {}
    public emitter = new BitFieldEmitter<void>()

    public get() {
        return this.value
    }

    public dispose() {
        this.emitter.emit(operationEvents.disposed)
        this.active = false

        return this
    }

    public set(newValue: T) {
        if (!this.active || newValue === this.value) {
            return this
        }

        this.emitter.emit(operationEvents.changed)
        this.value = newValue

        return this
    }
}
