import { expect } from 'chai'
import { Ecs } from './Ecs'
import { IndexedComponentManager } from './IndexedComponentManager'

// helpers

// This is here for me to be able to use ReturnType< >
const generateEcs = () => {
    return new Ecs({
        foo: new IndexedComponentManager<number>(),
        bar: new IndexedComponentManager<string>(),
        goo: new IndexedComponentManager<[number, number]>()
    })
}

describe('The Ecs instance', () => {
    let ecs: ReturnType<typeof generateEcs>

    beforeEach(() => {
        ecs = generateEcs()
    })

    describe('The createEntity method', () => {
        it('should the entity to the specified componentManagers', () => {
            // arrange & act
            const id = ecs.createEntity({
                foo: 7
            })

            // assert
            expect(ecs.componentManagers.foo.get(id)).to.equal(7)
        })
    })

    describe('The deleteEntity method', () => {
        it('should remove the entity from all managers', () => {
            // arrange
            const id = ecs.createEntity({
                foo: 7
            })

            // act
            ecs.deleteEntity(id)

            // assert
            expect(ecs.componentManagers.foo.get(id)).to.equal(null)
        })
    })

    describe('The getEntityById method', () => {
        it("should return an empty object if the entity doesn't exist", () => {
            // assert
            expect(ecs.getEntityById(0)).to.deep.equal({})
        })

        it('should return an empty object if the entity has no components', () => {
            // arrange
            const id = ecs.createEntity()

            // assert
            expect(ecs.getEntityById(id)).to.deep.equal({})
        })

        it('should return all the components of the entity', () => {
            // arrange
            const components = {
                foo: 7,
                bar: 'hello random guy reading my code'
            }

            const id = ecs.createEntity(components)

            // assert
            expect(ecs.getEntityById(id)).to.deep.equal(components)
        })
    })

    describe('The getComponentsByEntityId method', () => {
        it("should return an empty object if the entity doesn't exist", () => {
            // assert
            expect(
                ecs.getComponentsByEntityId(0, ['bar', 'foo', 'goo'])
            ).to.deep.equal({})
        })

        it('should return an empty object if the entity has none of the components', () => {
            // arrange
            const id = ecs.createEntity({
                foo: 4
            })

            // assert
            expect(ecs.getComponentsByEntityId(id, ['bar', 'goo']))
        })

        it('should return all the specified components if they exist', () => {
            // arrange
            const components = {
                foo: 1,
                bar: 'how are you?'
            }

            const id = ecs.createEntity(components)

            // assert
            expect(
                ecs.getComponentsByEntityId(id, ['foo', 'bar'])
            ).to.deep.equal(components)
        })

        it('should return the components which exist if passing a few which exist and a few which does not', () => {
            // arrange
            const id = ecs.createEntity({
                foo: 1,
                bar: 'why are you reading this?'
            })

            // assert
            expect(
                ecs.getComponentsByEntityId(id, ['bar', 'goo'])
            ).to.deep.equal({
                bar: 'why are you reading this?'
            })
        })
    })
})
