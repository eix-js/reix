import { StatefullComputationNode } from './StatefullComputationNode'
import { computationFlags } from '../constants/computationFlags'

describe('The StatefullComputationNode instance', () => {
    describe('The isActive method', () => {
        test('should return true if the active bit is 1', () => {
            // arrange
            const node = new StatefullComputationNode()

            // assert
            expect(node.isActive()).toBeTruthy()
        })

        test('should return false if the active bit is 0', () => {
            // arrange
            const node = new StatefullComputationNode()

            // act
            node.state ^= computationFlags.active

            // assert
            expect(node.isActive()).not.toBeTruthy()
        })
    })
})
