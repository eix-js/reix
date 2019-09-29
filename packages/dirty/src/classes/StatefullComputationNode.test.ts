import { StatefullComputationNode } from './StatefullComputationNode'
import { computationFlags } from '../constants/computationFlags'
import { expect } from "chai"

describe('The StatefullComputationNode instance', () => {
    describe('The isActive method', () => {
        it('should return true if the active bit is 1', () => {
            // arrange
            const node = new StatefullComputationNode()

            // assert
            expect(Boolean(node.isActive())).to.be.true
        })

        it('should return false if the active bit is 0', () => {
            // arrange
            const node = new StatefullComputationNode()

            // act
            node.state ^= computationFlags.active

            // assert
            expect(Boolean(node.isActive())).to.be.false
        })
    })
})
