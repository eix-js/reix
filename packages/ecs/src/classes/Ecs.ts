import { EntityPoolOptions, EntityPool } from './EntityPool'
import { ComponentManager } from '../types/ComponentManager'
import { IndexedComponentManager } from './IndexedComponentManager'

export class Ecs<T extends Record<string, ComponentManager<unknown>>> {
    public pool: EntityPool

    public constructor(
        public componentManagers: T,
        poolOptions: Partial<EntityPoolOptions> = {}
    ) {
        this.pool = new EntityPool(poolOptions)
    }
}
