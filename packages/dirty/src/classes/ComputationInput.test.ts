import { ComputationInputNode } from './ComputationInput'
import { computationEvents } from '../constants/computationEvents'
import { expect } from "chai"
import { spy } from "sinon"

describe('The ComputationInput instance', () => {
    let input: ComputationInputNode<number>

    beforeEach(() => {
        input = new ComputationInputNode(7)
    })

    describe('The get method', () => {
        it('should initially return the initial value', () => {
            // assert
            expect(input.get()).to.equal(7)
        })

        it('should return the new value after calling set', () => {
            // arrange
            const random = Math.random()

            // act
            input.set(random)

            // assert
            expect(input.get()).to.equal(random)
        })
    })

    describe('The set method', () => {
        it('calling set(a) should get to the same state as calling set(a) and then set(b)', () => {
            // arrange
            const input1 = new ComputationInputNode(0)
            const input2 = new ComputationInputNode(0)

            const random = Math.random()

            // act
            input1.set(random)
            input2.set(random + Math.random()).set(random)

            // assert
            expect(input1.get()).to.equal(input2.get())
        })

        it('should emit a changed event', () => {
            // arrange
            const mock = spy()
            input.emitter.on(computationEvents.changed, mock)

            // act
            input.set(Math.random())

            // assert
            expect(mock.called).to.be.true
        })

        it('should ignore the current value', () => {
            // arrange
            const callback = spy()
            const random = Math.random()

            input.emitter.on(computationEvents.changed, callback)

            // act
            input.set(random).set(random)

            // assert
            expect(callback.callCount).to.equal(1)
        })
    })

    describe('The dispose method', () => {
        it('should emit the dispose event', () => {
            // arrange
            const callback = spy()

            input.emitter.on(computationEvents.disposed, callback)

            // act
            input.dispose()

            // assert
            expect(callback.called).to.be.true
        })

        it("should do nothing if the node isn't active anymroe", () => {
            // arrange
            const callback = spy()

            input.emitter.on(computationEvents.disposed, callback)

            // act
            input.dispose().dispose()

            // assert
            expect(callback.callCount).to.equal(1)
        })
    })
})
