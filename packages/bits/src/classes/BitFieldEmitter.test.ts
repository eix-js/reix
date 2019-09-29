import { BitFieldEmitter } from './BitFieldEmitter'
import { expect } from "chai"
import { spy } from "sinon"

describe('The BitFieldEmitter instance', () => {
    let emitter: BitFieldEmitter<number>

    beforeEach(() => {
        emitter = new BitFieldEmitter<number>()
    })

    describe('Adding a handler and emiting an event', () => {
        it('should call the handler if the event code matches the one of the handler', () => {
            // arrange
            const mock = spy()
            emitter.on(1, mock)

            // act
            emitter.emit(1, Math.random())

            // assert
            expect(mock.called).to.be.true
        })

        it('should call the handler if the event code contains all bits of the handler', () => {
            // arrange
            const mock1 = spy()
            const mock2 = spy()

            emitter.on(1, mock1)
            emitter.on(2, mock2)

            // act
            emitter.emit(3, Math.random())

            // assert
            expect(mock1.called).to.be.true
            expect(mock2.called).to.be.true
        })

        it('should call the handler if the event code contains at least 1 bit of the handler', () => {
            // arrange
            const mock110 = spy()
            const mock101 = spy()

            emitter.on(0b110, mock110)
            emitter.on(0b101, mock101)

            // act
            emitter.emit(0b011, Math.random())

            // assert
            expect(mock110.called).to.be.true
            expect(mock101.called).to.be.true
        })
    })

    describe('The once method', () => {
        it('should only call the event once', () => {
            // arrange
            const mock = spy()

            emitter.once(1, mock)

            // act
            emitter.emit(1, 0)
            emitter.emit(1, 0)

            // assert
            expect(mock.callCount).to.equal(1)
        })
    })

    describe(`The remove method`, () => {
        it('should do nothing if there are no handlers to remove', () => {
            // act
            emitter.remove(spy())
        })

        it('should remove the hander if it exists', () => {
            // arrange
            const mock = spy()

            emitter.on(1, mock)

            // act
            emitter.emit(1, 0)
            emitter.remove(mock)
            emitter.emit(1, 0)

            // assert
            expect(mock.callCount).to.equal(1)
        })

        it('should remove the handler if it was added multiple times', () => {
            // arrange
            const mock = spy()

            emitter.on(1, mock)
            emitter.on(2, mock)

            // act
            emitter.emit(3, 0)
            emitter.remove(mock)
            emitter.emit(3, 0)

            // assert
            expect(mock.callCount).to.equal(2)
        })
    })
})
