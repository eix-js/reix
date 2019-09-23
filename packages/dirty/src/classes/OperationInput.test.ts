import { OperationInputNode } from './OperationInput'

describe('The OperationInpput instance', () => {
    let input: OperationInputNode<number>

    beforeEach(() => {
        input = new OperationInputNode(7)
    })

    describe('The get method', () => {
        test('should initially return the initial value', () => {
            // assert
            expect(input.get()).toEqual(7)
        })

        test('should return the new value after calling set', () => {
            // arrange
            const random = Math.random()

            // act
            input.set(random)

            // assert
            expect(input.get()).toEqual(random)
        })
    })
})
