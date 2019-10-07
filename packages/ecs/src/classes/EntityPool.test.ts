import { expect } from 'chai'
import { EntityPool } from './EntityPool'

describe('The EntityPool instance', () => {
    describe('The alive method', () => {
        it('should return true on a newly created entity', () => {
            // arrange
            const ecs = new EntityPool()

            // act
            const id = ecs.create()

            // assert
            expect(ecs.alive(id)).to.be.true
        })

        it('should return false after deleting the entity', () => {
            // arrange
            const ecs = new EntityPool()

            // act
            const id = ecs.create()

            ecs.destroy(id)

            // assert
            expect(ecs.alive(id)).to.be.false
        })
    })
})
