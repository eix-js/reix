import { IndexedComponentManager } from './IndexedComponentManager'
import { expect } from 'chai'
import { spy } from 'sinon'
import { componentEvents } from '../constants/componentEvents'

describe('The IndexedComponentManager instance', () => {
    let manager: IndexedComponentManager<number>

    beforeEach(() => {
        manager = new IndexedComponentManager()
    })

    describe('The registerEntity method', () => {
        it('should emit the added event with the correct id', () => {
            // arrange
            const random = Math.random()
            const handler = spy()

            manager.emitter.on(componentEvents.added, handler)

            // act
            manager.registerEntity(random, 0)

            // assert
            expect(handler.called).to.be.true
            expect(handler.calledWith(random)).to.be.true
        })
    })

    describe('The deleteEntity method', () => {
        it('should emit the added event with the correct id', () => {
            // arrange
            const random = Math.random()
            const handler = spy()

            manager.emitter.on(componentEvents.removed, handler)

            // act
            manager.registerEntity(random, 0).deleteEntity(random)

            // assert
            expect(handler.called).to.be.true
            expect(handler.calledWith(random)).to.be.true
        })
    })

    describe('The isEmpty methdo', () => {
        it('should be empty after doing nothing', () => {
            // assert
            expect(manager.isEmpty()).to.be.true
        })

        it("shouldn't be empty after adding an entity", () => {
            // act
            manager.registerEntity(0, 7)

            // assert
            expect(manager.isEmpty()).to.be.false
        })

        it('should be empty after adding an entity and then removing it', () => {
            // act
            manager.registerEntity(0, 7).deleteEntity(0)

            // assert
            expect(manager.isEmpty()).to.be.true
        })

        it('should be empty after adding 2 entities and then removing them in the reverse order', () => {
            // act
            manager
                .registerEntity(0, 7)
                .registerEntity(1, 8)
                .deleteEntity(1)
                .deleteEntity(0)

            // assert
            expect(manager.isEmpty()).to.be.true
        })
    })

    describe('The has method', () => {
        it("should return false if the entity hasn' been added", () => {
            // assert
            expect(manager.has(0)).to.be.false
        })

        it('should return true if the entity has been added', () => {
            // act
            manager.registerEntity(0, 7)

            // assert
            expect(manager.has(0)).to.be.true
        })
    })
})
