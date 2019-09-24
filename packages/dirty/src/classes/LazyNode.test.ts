import { OperationInputNode } from './OperationInput'
import { LazyComputationNode } from './LazyNode'
import { operationEvents } from '../constants/operationEvents'

// helpers
const createIdentityNode = (transform = (a: number) => a) => {
    const input = new OperationInputNode(0)
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
        output.emitter.on(operationEvents.updated, mock)

        // act
        input.set(7)

        // assert
        expect(mock).not.toBeCalled()
    })

    test('should update if the data is requested for the first time', () => {
        // arrange
        const { input, output } = createIdentityNode()

        const mock = jest.fn()
        output.emitter.on(operationEvents.updated, mock)

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
        output.emitter.on(operationEvents.updated, mock)

        // act
        input.set(7)
        output.get()
        output.get()

        // assert
        expect(mock).toBeCalledTimes(1)
    })

    test("should still emit update even if the data didn't change", () => {
        // arrange
        const { output } = createIdentityNode(() => 7)

        const mock = jest.fn()
        output.emitter.on(operationEvents.updated, mock)

        // act
        output.triggerUpdate().triggerUpdate()

        // assert
        expect(mock).toBeCalledTimes(2)
    })

    test("shoud not emit changed if the data didn't change", () => {
        // arrange
        const { output } = createIdentityNode(() => 7)

        const mock = jest.fn()
        output.emitter.on(operationEvents.changed, mock)

        // act
        output.triggerUpdate().triggerUpdate()

        // assert
        expect(mock).toBeCalledTimes(1)
    })

    test('should not emit events more then 1 time per update', () => {
        // arrange
        const { output } = createIdentityNode(() => 7)

        const mockUpdated = jest.fn()
        const mockChanged = jest.fn()
        const mockBoth = jest.fn()

        output.emitter.on(operationEvents.changed, mockChanged)
        output.emitter.on(operationEvents.updated, mockUpdated)
        output.emitter.on(operationEvents.changedAndUpdated, mockBoth)

        // act
        output.triggerUpdate()

        // assert
        expect(mockUpdated).toBeCalledTimes(1)
        expect(mockChanged).toBeCalledTimes(1)
        expect(mockBoth).toBeCalledTimes(1)
    })
})
