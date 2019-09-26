import { BaseComputationNode } from './BaseComputationNode'
import { ComputationInputNode } from './ComputationInput'
import { computationEvents } from '../constants/computationEvents'

// helpers
const createIdentityNode = (transform = (a: number) => a) => {
    const input = new ComputationInputNode(0)
    const output = new BaseComputationNode(
        {
            input
        },
        ({ input }) => transform(input)
    )

    return { input, output }
}

describe('The BaseComputationNode instance', () => {
    let mock: ReturnType<typeof jest.fn>

    beforeEach(() => {
        mock = jest.fn()
    })

    test("should be disposed if any of it's parents is", () => {
        // arrange
        const { output, input } = createIdentityNode()

        output.emitter.on(computationEvents.disposed, mock)

        // act
        input.dispose()

        // assert
        expect(mock).toBeCalledTimes(1)
    })

    describe('The dispose method', () => {
        test('should emit the dispose event', () => {
            // arrange
            const output = new BaseComputationNode({}, () => {})

            output.emitter.on(computationEvents.disposed, mock)

            // act
            output.dispose()

            // assert
            expect(mock).toBeCalled()
        })

        test('should do nothing if the object is already disposed', () => {
            // arrange
            const disposabe = new BaseComputationNode({}, jest.fn())

            disposabe.emitter.on(computationEvents.disposed, mock)

            // act
            disposabe.dispose().dispose()

            // assert
            expect(mock).toBeCalledTimes(1)
        })
    })

    describe('The triggerUpdate method', () => {
        test("should still emit update even if the data didn't change", () => {
            // arrange
            const { output } = createIdentityNode(() => 7)

            output.emitter.on(computationEvents.updated, mock)

            // act
            output.triggerUpdate().triggerUpdate()

            // assert
            expect(mock).toBeCalledTimes(2)
        })

        test("shoud not emit changed if the data didn't change", () => {
            // arrange
            const { output } = createIdentityNode(() => 7)

            output.emitter.on(computationEvents.changed, mock)

            // act
            output.triggerUpdate().triggerUpdate()

            // assert
            expect(mock).toBeCalledTimes(1)
        })

        test('should not emit events more then 1 time per update', () => {
            // arrange
            const { output, input } = createIdentityNode()

            const mockUpdated = jest.fn()
            const mockChanged = jest.fn()

            output.emitter.on(computationEvents.changed, mockChanged)
            output.emitter.on(computationEvents.updated, mockUpdated)
            output.emitter.on(computationEvents.changedAndUpdated, mock)

            // act
            input.set(Math.random())
            output.triggerUpdate()

            // assert
            expect(mockUpdated).toBeCalledTimes(1)
            expect(mockChanged).toBeCalledTimes(1)
            expect(mock).toBeCalledTimes(1)
            // expect(mock).toBeCalledWith(
            //     undefined,
            //     computationEvents.changedAndUpdated
            // )
        })
    })
})
