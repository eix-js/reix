type BitFieldEventHandler<T> = (data: T, code: number) => void

/**
 * An event emitter which uses bitFields as event codes,
 * making it easy to call multiple events at a time
 * & add handlers for multiple events at once.
 *
 * @typeparam T The type of data all events will recive. For more details on
 * the topic of type-safety you should read the
 * guide about [usage with unions](../modules/usageWithUnions.html)
 */
export class BitFieldEmitter<T> {
    /**
     * Array of event handler sets. Initialized in the constructors.
     */
    private handlers: Set<BitFieldEventHandler<T>>[]

    /**
     * @param maxBits THe max number of bits to check againts.
     * The default is 32 bits.
     *
     * @example ```ts
     *
     * // default is 32 bits:
     * const emitter = new BitFieldEmitter<void>()
     *
     * emitter.on(1 << 31, () => console.log('fired'))
     * emitter.emit(1 << 31) // fired
     *
     *
     * // passing less than the default:
     * const emitter = new BitFieldEmitter<void>(31)
     *
     * emitter.on(1 << 32, () => console.log('fired'))
     * emitter.emit(1 << 31) // nothing
     * ```
     */
    public constructor(public maxBits = 32) {
        this.handlers = Array(maxBits)
            .fill(1)
            .map(() => new Set<BitFieldEventHandler<T>>())
    }

    /**
     * Adds an event listener. The listener will be called
     * every time an event which overlaps with the passed code
     * for at least 1 bit is fired.
     *
     * ### How it works:
     * This methods iterates over all the bits of the event code. When a bit of
     * index n equal to 1 is found, this adds it to the nth set of the [[handlers]] property.
     *
     * @param code Bitfield containing encoding all the events to listen to.
     * @param handler The function to call when an event fires.
     *
     * @returns The BitFieldEventHandler instance.
     *
     * ```ts
     * const emitter = new BitFieldEmitter<void>()
     *
     * emitter.on(0b011, () => console.log('fired'))
     *
     * emitter.emit(0b001) // fired, last bit is the same
     * emitter.emit(0b100) // nothing, there's no overlap
     * emitter.emit(0b101) // fired, last bit is the same
     * emitter.emit(0b110) // fired, second bit is the same
     * ```
     */
    public on(
        code: number,
        handler: BitFieldEventHandler<T>,
        maxBitsHint = this.maxBits
    ) {
        for (let i = 0; i < maxBitsHint; i++) {
            // check for overlap with the current bit
            if (code & (1 << i)) {
                this.handlers[i].add(handler)
            }
        }

        return this
    }

    /**
     * Removes a listener.
     *
     * Note: This will remove **All** the listeners for that function.
     *
     * @param handler The event listener to remove.
     *
     * @returns The BitFieldEventHandler instance.
     *
     * @example
     * emitter.on(0, handler)
     * emitter.emit(0, ...) // fires
     *
     * emitter.remove(handler)
     * emitter.emit(0,...) // doesn't fire
     *
     * @example
     * emitter.on(0, handler)
     * emitter.on(1, handler)
     *
     * emitter.remove(handler)
     * emitter.emit(1) // doesn't fire
     */
    public remove(
        handler: BitFieldEventHandler<T>,
        maxBitsHint = this.maxBits
    ) {
        for (let bit = 0; bit < maxBitsHint; bit++) {
            this.handlers[bit].delete(handler)
        }

        return this
    }

    /**
     * Removes all handlers from a set.
     *
     * @param handlers Set with handlers to remove.
     *
     * @returns The BitFieldEventHandler instance.
     *
     * @example
     * const group = new Set([handler1, handler2])
     *
     * emitter.removeGroup(group)
     */
    public removeGroup(
        handlers: Iterable<BitFieldEventHandler<T>>,
        maxBitsHint = this.maxBits
    ) {
        for (let bit = 0; bit < maxBitsHint; bit++) {
            for (const handler of handlers) {
                this.handlers[bit].delete(handler)
            }
        }

        return this
    }

    /**
     * The same as .on but calls .remove after the first trigger
     *
     * @param code The bits to listen for.
     * @param handler The function to call when an event fires.
     *
     * @returns The BitFieldEventHandler instance.
     */
    public once(
        code: number,
        handler: BitFieldEventHandler<T>,
        maxBitsHint = this.maxBits
    ) {
        const onceHandler = (...args: Parameters<BitFieldEventHandler<T>>) => {
            handler(...args)

            this.remove(onceHandler, maxBitsHint)
        }

        this.on(code, onceHandler, maxBitsHint)

        return this
    }

    /**
     * Calls all handlers which have at least 1 bit in common with the passed event code.
     *
     * @param code The code to trigger the listeners with.
     * @param data The data to pass to the listeners.
     *
     * @returns The BitFieldEventHandler instance.
     */
    public emit(code: number, data: T, maxBitsHint = this.maxBits) {
        const called = new Set<BitFieldEventHandler<T>>()

        for (let bit = 0; bit < maxBitsHint; bit++) {
            if (code & (1 << bit)) {
                for (const handler of this.handlers[bit].values()) {
                    if (called.has(handler)) {
                        continue
                    }

                    handler(data, code)
                    called.add(handler)
                }
            }
        }

        return this
    }
}
