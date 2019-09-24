import { BitFieldEmitter } from '@reix/bits'
import { operationEvents } from '../constants/operationEvents'
import { InputMap } from '../types/IOperation'

export class DisposableNode<T extends InputMap> {
    protected active = true
    protected inputEmitters: BitFieldEmitter<void>[]

    public emitter = new BitFieldEmitter<void>()

    public constructor(protected inputs: T) {
        this.inputEmitters = Object.values(inputs).map(input => input.emitter)

        const disposeHandler = () => {
            this.dispose()

            for (const emitter of this.inputEmitters) {
                emitter.remove(disposeHandler)
            }
        }

        for (const emitter of this.inputEmitters) {
            emitter.on(operationEvents.disposed, disposeHandler)
        }
    }

    public dispose() {
        if (!this.active) {
            return this
        }

        this.emitter.emit(operationEvents.disposed)
        this.active = false

        return this
    }
}
