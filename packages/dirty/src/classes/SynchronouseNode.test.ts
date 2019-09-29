import { ComputationInputNode } from './ComputationInput'
import { computationEvents } from '../constants/computationEvents'
import { SynchronousComputationNode } from './SynchronousNode'
import { expect } from "chai"
import { spy } from "sinon"

// helpers
const createIdentityNode = (transform = (a: number) => a) => {
    const input = new ComputationInputNode(0)
    const output = new SynchronousComputationNode(
        {
            input
        },
        ({ input }) => transform(input)
    )

    return { input, output }
}

describe('The SynchronousComputationNode instance', () => {
    it('should update the data on initialisation', () => {
        // arrange
        const { input, output } = createIdentityNode(x => x * 2)

        // assert
        expect(output.get()).to.equal(input.get() * 2)
    })

    it('should update the data on change', () => {
        // arrange
        const { input, output } = createIdentityNode(x => x * 2)
        const callback = spy()

        output.emitter.on(computationEvents.changed, callback)

        // act
        input.set(Math.random())

        // assert
        expect(callback.called).to.be.true
        expect(output.get()).to.equal(input.get() * 2)
    })
})
