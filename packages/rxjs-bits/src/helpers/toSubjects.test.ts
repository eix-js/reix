import { BitFieldEmitter } from '@reix/bits'
import { expect } from 'chai'
import { spy } from 'sinon'
import { toSubjects } from './toSubject'

describe('The toSubject helper', () => {
    let emitter: BitFieldEmitter<number>

    beforeEach(() => {
        emitter = new BitFieldEmitter<number>()
    })

    describe('The on$ Subject', () => {
        it('should not fire when no event is emitted', () => {
            // arrange
            const handler = spy()
            const { on$ } = toSubjects(emitter, 1)

            on$.subscribe(handler)

            // assert
            expect(handler.called).to.be.false
        })

        it('should fire when an event is emitted', () => {
            // arrange
            const random = Math.random()
            const handler = spy()
            const { on$ } = toSubjects(emitter, 1)

            on$.subscribe(handler)

            // act
            emitter.emit(1, random)

            // assert
            expect(handler.called).to.be.true
            expect(
                handler.calledWith({
                    value: random,
                    code: 1
                })
            ).to.be.true
        })
    })

    describe('The emit$ subject', () => {
        it('should emit the event', () => {
            // arrange
            const random = Math.random()
            const handler = spy()
            const { emit$ } = toSubjects(emitter, 1)

            emitter.on(1, handler)

            // act
            emit$.next({
                value: random,
                code: 3
            })

            // assert
            expect(handler.called, 'should emit the event').to.be.true
            expect(
                handler.calledWith(random, 3),
                'should emit the event with the correct arguments'
            ).to.be.true
        })
    })
})
