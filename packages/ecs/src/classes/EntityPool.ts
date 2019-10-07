import Deque from 'double-ended-queue'

/**
 * Options to be used by the pool.
 */
export type EntityPoolOptions = {
    minimumUnusedTime: number
    entityIndexBits: number
}

/**
 * Default options for the EntityPool.
 */
export const defaultEcsOptions: EntityPoolOptions = {
    minimumUnusedTime: 256,
    entityIndexBits: 23
}

export class EntityPool {
    /**
     * Array with the generation of all avabile entities.
     */
    private readonly generations: Array<number> = []

    /**
     * Deque with all the entities ready to be reused.
     */
    private readonly recycleDeque: Deque<number>

    /**
     * Bitmask for getting the index from an entity id.
     */
    private readonly indexMask: number

    /**
     * The final set of options to be used by the ecs
     */
    private readonly options: Readonly<EntityPoolOptions>

    /**
     * Class to keep track of alive entities
     * Inspired by: http://bitsquid.blogspot.com/2014/08/building-data-oriented-entity-system.html
     *
     * @param options Options to be used by the ecs.
     */
    public constructor(options: Partial<EntityPoolOptions> = {}) {
        this.options = { ...defaultEcsOptions, ...options }
        this.recycleDeque = new Deque()

        this.indexMask = (1 << this.options.entityIndexBits) - 1
    }

    /**
     * Generates a new entity id.
     *
     * @param allowRecycling Allows recycling entities.
     */
    public create(allowRecycling = true): number {
        if (
            allowRecycling &&
            this.recycleDeque.length > this.options.minimumUnusedTime
        ) {
            if (this.recycleDeque.peekFront()) {
                return this.recycleDeque.shift()!
            } else {
                return this.create(false)
            }
        } else {
            return this.generations.push(0) - 1
        }
    }

    /**
     * Gets the state of an entity (alive / dead).
     *
     * @param id The id of the entity.
     */
    public alive(id: number) {
        return (
            this.generations[id & this.indexMask] ===
            id >> this.options.entityIndexBits
        )
    }

    /**
     * Destroys an entity and flags it for recycling.
     *
     * @param id The id of the entity
     */
    public destroy(id: number) {
        const index = id & this.indexMask
        this.generations[index]++
        this.recycleDeque.push(index)
    }
}
