import { BitFieldEmitter, BitFieldEventHandler } from '@reix/bits'
import { ComponentOperation } from '../types/ComponentOperation'
import { ComponentManager } from '../types/ComponentManager'
import { componentOperations } from '../constants/componentOperations'
import { componentEvents } from '../constants/componentEvents'

export class ComponentDiff<T> {
    private readonly volatileHandlers = new Set<BitFieldEventHandler<number>>()

    private readonly added = new Set<number>()
    private readonly changed = new Set<number>()
    private readonly removed = new Set<number>()

    public constructor(
        public readonly source: ComponentManager<T>,
        public silent = false
    ) {
        const addedHandler = this.addEntity.bind(this)
        const removedHandler = this.removeEntity.bind(this)
        const changedHandler = this.mutateEntity.bind(this)

        this.source.emitter
            .on(componentEvents.added, addedHandler)
            .on(componentEvents.removed, removedHandler)
            .on(componentEvents.changed, changedHandler)

        this.volatileHandlers
            .add(addedHandler)
            .add(removedHandler)
            .add(changedHandler)
    }

    private clean() {
        this.removed.clear()
        this.added.clear()
        this.changed.clear()

        return this
    }

    public dispose() {
        this.clean()

        this.source.emitter.removeGroup(this.volatileHandlers)
        this.volatileHandlers.clear()
    }

    public addEntity(id: number) {
        this.added.add(id)
        this.changed.add(id)

        this.removed.delete(id)

        return this
    }

    public removeEntity(id: number) {
        this.changed.delete(id)

        if (this.added.has(id)) {
            this.added.delete(id)
        } else {
            this.removed.add(id)
        }

        return this
    }

    public mutateEntity(id: number) {
        this.changed.add(id)

        return this
    }

    public collect() {
        const collected: ComponentOperation<T>[] = []

        for (const id of this.changed) {
            const type = this.added.has(id)
                ? componentOperations.add
                : componentOperations.change

            const component = this.source.get(id)

            if (component) {
                collected.push({
                    type,
                    component,
                    id
                })
            } else if (!this.silent) {
                throw new Error(`Cannot find component of entity with id ${id}`)
            }
        }

        for (const id of this.removed) {
            collected.push({
                type: componentOperations.remove,
                id
            })
        }

        this.clean()

        return collected
    }
}
