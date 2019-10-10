import { expect } from 'chai'
import { IndexedComponentManager } from './IndexedComponentManager'
import { ComponentDiff } from './ComponentDiff'
import { ComponentOperation } from '../types/ComponentOperation'
import { componentOperations } from '../constants/componentOperations'

// helpers
const addAndCollect = (
    manager: IndexedComponentManager<number>,
    diff: ComponentDiff<number>
) => {
    const id = Math.random()

    manager.registerEntity(id, Math.random())
    diff.collect()

    return id
}

describe('The ComponentDiff instance', () => {
    let manager: IndexedComponentManager<number>
    let diff: ComponentDiff<number>

    beforeEach(() => {
        manager = new IndexedComponentManager()
        diff = new ComponentDiff(manager)
    })

    afterEach(() => {
        diff.dispose()
    })

    describe('The collect method', () => {
        it('should not reset the accumulated diff if the when passed false as the first argument', () => {
            // act
            manager.registerEntity(7, 7)
            diff.collect(false)

            // assert
            expect(diff.collect()).to.not.deep.equal([])
        })
    })

    describe('Added entities', () => {
        it("should mark an entity as 'added' after adding it to the component manager", () => {
            // arrange
            const random = Math.random()
            const expectedOperation: ComponentOperation<number> = {
                type: componentOperations.add,
                id: 7,
                component: random
            }

            // act
            manager.registerEntity(7, random)

            // assert
            expect(diff.collect()).to.deep.include(expectedOperation)
        })
    })
    describe('Removing entities', () => {
        it("should mark an entity as 'removed' after removing it from the component manager", () => {
            // arrange
            const id = addAndCollect(manager, diff)

            const expectedOperation: ComponentOperation<number> = {
                type: componentOperations.remove,
                id
            }

            // act
            manager.deleteEntity(id)

            // assert
            expect(diff.collect()).to.deep.include(expectedOperation)
        })

        it('should not contain an etity which was added then removed imediatly', () => {
            // act
            manager.registerEntity(7, 7).deleteEntity(7)

            // assert
            expect(diff.collect()).to.deep.equal([])
        })

        it('should not contain an entit which was added, changed and then removed imediatly', () => {
            // act
            manager
                .registerEntity(7, 7)
                .mutateOne(7)
                .deleteEntity(7)

            // assert
            expect(diff.collect()).to.deep.equal([])
        })

        it("should unmark the entity as 'removed'", () => {
            // arrange
            const id = addAndCollect(manager, diff)
            const random = Math.random()

            const expectedOperation: ComponentOperation<number> = {
                type: componentOperations.add,
                component: random,
                id
            }

            const unexpectedOperation: ComponentOperation<number> = {
                type: componentOperations.remove,
                id
            }

            // act
            manager.deleteEntity(id).registerEntity(id, random)
            const collected = diff.collect()

            // assert
            expect(collected).to.deep.include(expectedOperation)
            expect(collected).not.not.deep.include(unexpectedOperation)
        })
    })

    describe('Mutating entities', () => {
        it("should mark an entity as 'changed' after muating it", () => {
            // arrange
            const id = addAndCollect(manager, diff)
            const random = Math.random()

            const expectedOperation: ComponentOperation<number> = {
                type: componentOperations.change,
                id,
                component: random
            }

            // act
            manager.set(id, random)

            // assert
            expect(diff.collect()).to.deep.include(expectedOperation)
        })

        it('should not mark an entity as changed if it was added right before', () => {
            // arrange
            const random = Math.random()

            const expectedOperation: ComponentOperation<number> = {
                type: componentOperations.add,
                id: 7,
                component: random
            }

            // act
            manager.registerEntity(7, 7).set(7, random)

            expect(diff.collect()).to.deep.include(expectedOperation)
        })
    })
})
