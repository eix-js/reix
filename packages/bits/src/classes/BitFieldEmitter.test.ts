import { BitFieldEmitter } from './BitFieldEmitter'

describe('The BitFieldEmitter instance', () => {
    let emitter: BitFieldEmitter<number>

    beforeEach(() => {
        emitter = new BitFieldEmitter<number>()
    })

    describe('Adding a handler and emiting an event', () => {
        test('should call the handler if the event code matches the one of the handler', () => {
            // arrange
            const mock = jest.fn()
            emitter.on(1, mock)

            // act
            emitter.emit(1, Math.random())

            // assert
            expect(mock).toBeCalled()
        })

        test('should call the handler if the event code contains all bits of the handler', () => {
            // arrange
            const mock1 = jest.fn()
            const mock2 = jest.fn()

            emitter.on(1, mock1)
            emitter.on(2, mock2)

            // act
            emitter.emit(3, Math.random())

            // assert
            expect(mock1).toBeCalled()
            expect(mock2).toBeCalled()
        })

        test('should call the handler if the event code contains at least 1 bit of the handler', () => {
            // arrange
            const mock110 = jest.fn()
            const mock101 = jest.fn()

            emitter.on(0b110, mock110)
            emitter.on(0b101, mock101)

            // act
            emitter.emit(0b011, Math.random())

            // assert
            expect(mock110).toBeCalled()
            expect(mock101).toBeCalled()
        })
    })

    describe('The once method', () => {
        test('should only call the event once', () => {
            // arrange
            const mock = jest.fn()

            emitter.once(1, mock)

            // act
            emitter.emit(1, 0)
            emitter.emit(1, 0)

            // assert
            expect(mock).toBeCalledTimes(1)
        })
    })

    describe(`The remove method`, () => {
        test('should do nothing if there are no handlers to remove', () => {
            // act
            emitter.remove(jest.fn())
        })

        test('should remove the hander if it exists', () => {
            // arrange
            const mock = jest.fn()

            emitter.on(1, mock)

            // act
            emitter.emit(1, 0)
            emitter.remove(mock)
            emitter.emit(1, 0)

            // assert
            expect(mock).toBeCalledTimes(1)
        })

        test('should remove the handler if it was added multiple times', () => {
            // arrange
            const mock = jest.fn()

            emitter.on(1, mock)
            emitter.on(2, mock)

            // act
            emitter.emit(3, 0)
            emitter.remove(mock)
            emitter.emit(3, 0)

            // assert
            expect(mock).toBeCalledTimes(2)
        })
    })
})
