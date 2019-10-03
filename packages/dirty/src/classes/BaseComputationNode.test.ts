import { BaseComputationNode } from './BaseComputationNode'
import { ComputationInputNode } from './ComputationInput'
import { computationEvents } from '../constants/computationEvents'
import { expect } from 'chai'
import { spy } from 'sinon'

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
    it("should be disposed if any of it's parents is", () => {
        // arrange
        const { output, input } = createIdentityNode()
        const callback = spy()

        output.emitter.on(computationEvents.disposed, callback)

        // act
        input.dispose()

        // assert
        expect(callback.callCount).to.equal(1)
    })

    describe('The dispose method', () => {
        it('should emit the dispose event', () => {
            // arrange
            const output = new BaseComputationNode({}, () => {})
            const callback = spy()

            output.emitter.on(computationEvents.disposed, callback)

            // act
            output.dispose()

            // assert
            expect(callback.called).to.be.true
        })

        it('should do nothing if the object is already disposed', () => {
            // arrange
            const disposabe = new BaseComputationNode({}, spy())
            const callback = spy()

            disposabe.emitter.on(computationEvents.disposed, callback)

            // act
            disposabe.dispose().dispose()

            // assert
            expect(callback.callCount).to.equal(1)
        })
    })

    describe('The triggerUpdate method', () => {
        it("should still emit update even if the data didn't change", () => {
            // arrange
            const { output } = createIdentityNode(() => 7)
            const callback = spy()

            output.emitter.on(computationEvents.updated, callback)

            // act
            output.triggerUpdate().triggerUpdate()

            // assert
            expect(callback.callCount).to.equal(2)
        })

        it("shoud not emit changed if the data didn't change", () => {
            // arrange
            const { output } = createIdentityNode(() => 7)
            const callback = spy()

            output.emitter.on(computationEvents.changed, callback)

            // act
            output.triggerUpdate().triggerUpdate()

            // assert
            expect(callback.callCount).to.equal(1)
        })

        it('should not emit events more then 1 time per update', () => {
            // arrange
            const { output, input } = createIdentityNode()

            const updatedCallback = spy()
            const changedCallback = spy()
            const bothCallback = spy()

            output.emitter.on(computationEvents.changed, changedCallback)
            output.emitter.on(computationEvents.updated, updatedCallback)
            output.emitter.on(computationEvents.changedAndUpdated, bothCallback)

            // act
            input.set(Math.random())
            output.triggerUpdate()

            // assert
            expect(updatedCallback.callCount).to.equal(1)
            expect(changedCallback.callCount).to.equal(1)
            expect(bothCallback.callCount).to.equal(1)
            expect(
                bothCallback.calledWith(
                    undefined,
                    computationEvents.changedAndUpdated
                )
            ).to.be.true
        })
    })
})
