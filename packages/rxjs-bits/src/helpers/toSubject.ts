import { BitFieldEmitter } from '@reix/bits'
import { Subject } from 'rxjs'

/**
 * Interface for data required to emit events.
 */
export interface EmitHandlerArguments<T> {
    value: T
    code?: number
    maxBitHint?: number
}

/**
 * Interface for the data emitted by the on$ Subject.
 */
export interface OnHanlerArguments<T> {
    value: T
    code: number
}

/**
 * Generates an $on & an $emit Subject and a dispose function
 * from a BitFIeldEmitter instance.
 *
 * @param emitter The emitter to generate subjects from.
 * @param code The event code to generate subjects for.
 */
export const toSubjects = <T>(emitter: BitFieldEmitter<T>, code: number) => {
    // the user can listen to events on this
    const on$ = new Subject<OnHanlerArguments<T>>()

    // the user can emit events trough this
    const emit$ = new Subject<EmitHandlerArguments<T>>()

    // This passes the event emitted on the
    // bitFieldEmitter instance onto the on$ Subject
    const onHandler = (value: T, code: number) => on$.next({ value, code })

    // This emits an event
    const emitHandler = ({
        code: eventCode,
        value,
        maxBitHint
    }: EmitHandlerArguments<T>) => {
        emitter.emit(
            eventCode === undefined ? code : eventCode,
            value,
            maxBitHint
        )
    }

    // attach handlers
    emitter.on(code, onHandler)
    emit$.subscribe(emitHandler)

    // cleanup
    const dispose = () => {
        emitter.remove(onHandler)

        emit$.complete()
        on$.complete()
    }

    return {
        on$,
        emit$,
        dispose
    }
}
