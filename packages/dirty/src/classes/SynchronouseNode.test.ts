import { ComputationInputNode } from './ComputationInput'
import { computationEvents } from '../constants/computationEvents'
import { SynchronousComputationNode } from './SynchronousNode'

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
    test('should update the data on initialisation', () => {
        // arrange
        const { input, output } = createIdentityNode(x => x * 2)

        // assert
        expect(output.get()).toEqual(input.get() * 2)
    })

    test('should update the data on change', () => {
        // arrange
        const { input, output } = createIdentityNode(x => x * 2)
        const mock = jest.fn()

        output.emitter.on(computationEvents.changed, mock)

        // act
        input.set(Math.random())

        // assert
        expect(mock).toBeCalled()
        expect(output.get()).toEqual(input.get() * 2)
    })
})
