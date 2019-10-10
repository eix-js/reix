import { expect } from 'chai'
import { spy } from 'sinon'
import { componentEvents } from '../constants/componentEvents'
import { IndexedComponentManager } from './IndexedComponentManager'

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
        it('should emit the added event with the correct id if the entity existed', () => {
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

        it('should not emit the added event if the entity does not exist', () => {
            // arrange
            const random = Math.random()
            const handler = spy()

            manager.emitter.on(componentEvents.removed, handler)

            // act
            manager.deleteEntity(random)

            // assert
            expect(handler.called).to.be.false
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

    describe('The clear method', () => {
        it('should empty the manager', () => {
            // arrange
            manager.registerEntity(0, 1)

            // act
            manager.clear()

            // assert
            expect(manager.isEmpty()).to.be.true
        })
    })

    describe('The get method', () => {
        it("should return null if the entity doesn't exist", () => {
            // assert
            expect(manager.get(0)).to.equal(null)
        })

        it('should return the actual component if it exists', () => {
            // arrange
            const random = Math.random()

            // act
            manager.registerEntity(7, random)

            // assert
            expect(manager.get(7)).to.equal(random)
        })
    })

    describe('The set method', () => {
        it("should do nothing if the entity doesn't exist", () => {
            // act
            manager.set(7, 1)
        })

        it('should change the value of the component if the entity exists', () => {
            // arrange
            const random = Math.random()

            // act
            manager.registerEntity(7, 2).set(7, random)

            // assert
            expect(manager.get(7)).to.equal(random)
        })

        it('should emit the changed event with the correct id', () => {
            // arrange
            const random = Math.random()
            const handler = spy()

            manager.emitter.on(componentEvents.changed, handler)

            // act
            manager.registerEntity(7, 2).set(7, random)

            // assert
            expect(handler.called).to.be.true
            expect(handler.calledWith(7)).to.be.true
        })

        it('should allow ignoring the mutation by passing false as the last argument', () => {
            // arrange
            const random = Math.random()
            const handler = spy()

            manager.emitter.on(componentEvents.changed, handler)

            // act
            manager.registerEntity(7, 2).set(7, random, false)

            // assert
            expect(handler.called).to.be.false
        })
    })

    describe('The mutateMany method', () => {
        it('should emit nothing if passed an empty array', () => {
            // arrange
            const handler = spy()

            manager.emitter.on(componentEvents.changed, handler)

            // act
            manager.mutateMany([])

            // assert
            expect(handler.called).to.be.false
        })

        it('should emit the changed event with the id passed.', () => {
            // arrange
            const handler = spy()

            manager.emitter.on(componentEvents.changed, handler)

            // act
            manager.mutateMany([7])

            // assert
            expect(handler.called).to.be.true
            expect(handler.calledWith(7)).to.be.true
        })

        it('should emit the changed event with the ids passed', () => {
            // arrange
            const handler = spy()

            manager.emitter.on(componentEvents.changed, handler)

            // act
            manager.mutateMany([1, 2, 3])

            // assert
            expect(handler.calledWith(1), 'called with 1').to.be.true
            expect(handler.calledWith(2), 'called with 2').to.be.true
            expect(handler.calledWith(3), 'called with 3').to.be.true
            expect(handler.callCount, 'called 3 times').to.equal(3)
        })
    })

    describe('The mutateOne method', () => {
        it('should emit the changed event with the id passed.', () => {
            // arrange
            const handler = spy()

            manager.emitter.on(componentEvents.changed, handler)

            // act
            manager.mutateOne(7)

            // assert
            expect(handler.called).to.be.true
            expect(handler.calledWith(7)).to.be.true
        })
    })

    describe('The withMutations method', () => {
        it('should emit nothing if returning an empty array', () => {
            // arrange
            const handler = spy()

            manager.emitter.on(componentEvents.changed, handler)

            // act
            manager.withMutations(() => [])

            // assert
            expect(handler.called).to.be.false
        })

        it('should emit the changed event with the id returned.', () => {
            // arrange
            const handler = spy()

            manager.emitter.on(componentEvents.changed, handler)

            // act
            manager.withMutations(() => [7])

            // assert
            expect(handler.called).to.be.true
            expect(handler.calledWith(7)).to.be.true
        })

        it('should emit the changed event with the ids passed', () => {
            // arrange
            const handler = spy()

            manager.emitter.on(componentEvents.changed, handler)

            // act
            manager.withMutations(() => [1, 2, 3])

            // assert
            expect(handler.calledWith(1), 'called with 1').to.be.true
            expect(handler.calledWith(2), 'called with 2').to.be.true
            expect(handler.calledWith(3), 'called with 3').to.be.true
            expect(handler.callCount, 'called 3 times').to.equal(3)
        })
    })

    describe('The withMutation method', () => {
        it('should emit the changed event with the id returned.', () => {
            // arrange
            const handler = spy()

            manager.emitter.on(componentEvents.changed, handler)

            // act
            manager.withMutation(() => 7)

            // assert
            expect(handler.called).to.be.true
            expect(handler.calledWith(7)).to.be.true
        })
    })
})
