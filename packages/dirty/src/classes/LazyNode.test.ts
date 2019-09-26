import { ComputationInputNode } from './ComputationInput'
import { LazyComputationNode } from './LazyNode'
import { computationEvents } from '../constants/computationEvents'

// helpers
const createIdentityNode = (transform = (a: number) => a) => {
    const input = new ComputationInputNode(0)
    const output = new LazyComputationNode(
        {
            input
        },
        ({ input }) => transform(input.get())
    )

    return { input, output }
}

describe('The LazyNode instance', () => {
    test('should not update if the data isnt requested', () => {
        // arrange
        const { input, output } = createIdentityNode()

        const mock = jest.fn()
        output.emitter.on(computationEvents.updated, mock)

        // act
        input.set(7)

        // assert
        expect(mock).not.toBeCalled()
    })

    test('should update if the data is requested for the first time', () => {
        // arrange
        const { input, output } = createIdentityNode()

        const mock = jest.fn()
        output.emitter.on(computationEvents.updated, mock)

        // act
        input.set(7)
        output.get()

        // assert
        expect(mock).toBeCalledTimes(1)
    })

    test('should only update once if the data is requested multiple tines', () => {
        // arrange
        const { input, output } = createIdentityNode()

        const mock = jest.fn()
        output.emitter.on(computationEvents.updated, mock)

        // act
        input.set(7)
        output.get()
        output.get()

        // assert
        expect(mock).toBeCalledTimes(1)
    })
})
