import { EntityPoolOptions, EntityPool } from './EntityPool'
import {
    ComponentManagerMap,
    ComponentSubMap,
    ExtractComponentMap
} from '../types/ComponentMap'

export class Ecs<M> {
    public pool: EntityPool

    /**
     * Glues an EntityPool with ComponentManagers.
     *
     * @param componentManagers The Map of componentManagers to use.
     * @param poolOptions Options for the entityPool.
     */
    public constructor(
        public componentManagers: ComponentManagerMap<M>,
        poolOptions: Partial<EntityPoolOptions> = {}
    ) {
        this.pool = new EntityPool(poolOptions)
    }

    /**
     * Generates an entity id, registers the passed components.
     *
     * @param components The components the entity should have.
     * @returns The entity id.
     */
    public createEntity(components: Partial<ExtractComponentMap<M>> = {}) {
        const id = this.pool.create()

        for (const [name, initialValue] of Object.entries(components)) {
            this.componentManagers[name as keyof M].registerEntity(
                id,
                initialValue
            )
        }

        return id
    }

    /**
     * Gets all components of the entity with the given id.
     *
     * Note: If you only want to get a few of the components,
     * use the getComponentsByEntityId method instead.
     *
     * @param id The id of the entity.
     */
    public getEntityById<L extends Partial<ExtractComponentMap<M>>>(
        id: number
    ) {
        // :L throws an error
        const result = {} as L

        for (const [name, manager] of Object.entries(this.componentManagers)) {
            const value = manager.get(id)

            if (value !== null) {
                result[name as keyof M] = value as typeof result[keyof M]
            }
        }

        return result
    }

    public getComponentsByEntityId<L extends ReadonlyArray<keyof M>>(
        id: number,
        components: L
    ) {
        const result: Partial<ComponentSubMap<ExtractComponentMap<M>, L>> = {}

        for (const name of components) {
            const value = this.componentManagers[name as keyof M].get(id)

            if (value !== null) {
                result[name as keyof M] = value as typeof result[keyof M]
            }
        }

        return result
    }
}
