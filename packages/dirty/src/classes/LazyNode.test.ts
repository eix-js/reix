import { ComputationInputNode } from './ComputationInput'
import { LazyComputationNode } from './LazyNode'
import { computationEvents } from '../constants/computationEvents'
import { expect } from "chai"
import { spy } from "sinon"

// helpers
const createIdentityNode = (transform = (a: number) => a) => {
    const input = new ComputationInputNode(0)
    const output = new LazyComputationNode(
        {
            input
        },
        ({ input }) => transform(input)
    )

    return { input, output }
}

describe('The LazyNode instance', () => {
    it('should not update if the data isnt requested', () => {
        // arrange
        const { input, output } = createIdentityNode()
        const callback = spy()

        output.emitter.on(computationEvents.updated, callback)

        // act
        input.set(7)

        // assert
        expect(callback.called).to.be.false
    })

    it('should update if the data is requested for the first time', () => {
        // arrange
        const { input, output } = createIdentityNode()
        const callback = spy()

        output.emitter.on(computationEvents.updated, callback)

        // act
        input.set(7)
        output.get()

        // assert
        expect(callback.callCount).to.equal(1)
    })

    it('should only update once if the data is requested multiple tines', () => {
        // arrange
        const { input, output } = createIdentityNode()
        const callback = spy()

        output.emitter.on(computationEvents.updated, callback)

        // act
        input.set(7)
        output.get()
        output.get()

        // assert
        expect(callback.callCount).to.equal(1)
    })
})
