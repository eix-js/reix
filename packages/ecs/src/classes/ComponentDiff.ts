import { BitFieldEventHandler } from '@reix/bits'
import { ComponentOperation } from '../types/ComponentOperation'
import { ComponentManager } from '../types/ComponentManager'
import { componentOperations } from '../constants/componentOperations'
import { componentEvents } from '../constants/componentEvents'

export class ComponentDiff<T> {
    /**
     * Handlers to be removed on dispose.
     */
    private readonly volatileHandlers = new Set<BitFieldEventHandler<number>>()

    /**
     * Added entities since the last reset.
     */
    private readonly added = new Set<number>()

    /**
     * Changed entities since the last reset.
     */
    private readonly changed = new Set<number>()

    /**
     * Deleted entities since the alst reset.
     */
    private readonly removed = new Set<number>()

    /**
     * Low level class to get the diff of a ComponentManager.
     *
     * @param source The ComponentManager to get the diff of.
     * @param verboose Specifies if errors should be thrown when somehing is somewhat wrong.
     */
    public constructor(
        public readonly source: ComponentManager<T>,
        public verboose = true
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

    /**
     * Clean inner sets.
     */
    private clean() {
        this.removed.clear()
        this.added.clear()
        this.changed.clear()

        return this
    }

    /**
     * Remove handlers and clean everything.
     */
    public dispose() {
        this.clean()

        this.source.emitter.removeGroup(this.volatileHandlers)
        this.volatileHandlers.clear()
    }

    /**
     * Add an entity to the diff.
     *
     * @param id The id to add.
     */
    private addEntity(id: number) {
        this.added.add(id)
        this.changed.add(id)

        this.removed.delete(id)

        return this
    }

    /**
     * Remove an entity from the diff.
     *
     * @param id The id to remove.
     */
    private removeEntity(id: number) {
        this.changed.delete(id)

        if (this.added.has(id)) {
            this.added.delete(id)
        } else {
            this.removed.add(id)
        }

        return this
    }

    /**
     * Mark an entity as changed.
     *
     * @param id The id to mark as mutated.
     */
    private mutateEntity(id: number) {
        this.changed.add(id)

        return this
    }

    /**
     * Collet the diff accumulated. Pass "false" as the first argument to skip reseting.
     * (Next diff will be calculated from the last reset.)
     *
     * @param reset If set to true the inner state will automatically reset.
     */
    public collect(reset = true) {
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
            } else if (this.verboose) {
                throw new Error(`Cannot find component of entity with id ${id}`)
            }
        }

        for (const id of this.removed) {
            collected.push({
                type: componentOperations.remove,
                id
            })
        }

        if (reset) {
            this.clean()
        }

        return collected
    }
}
