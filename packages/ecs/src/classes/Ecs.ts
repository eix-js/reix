import Deque from 'double-ended-queue'

/**
 * Options to be used by the ecs.
 */
export type EcsOptions = {
    minimumUnusedTime: number
    dequeCapacity: number
    entityIndexBits: number
}

/**
 * Default options for the ecs.
 */
export const defaultEcsOptions: EcsOptions = {
    minimumUnusedTime: 256,
    dequeCapacity: 0,
    entityIndexBits: 23
}

/**
 * Efficient implementation of the ecs pattern.
 * Inspired by: http://bitsquid.blogspot.com/2014/08/building-data-oriented-entity-system.html
 *
 * @param options Options to be used by the ecs.
 */
export class Ecs {
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
    private readonly options: Readonly<EcsOptions>

    public constructor(options: Partial<EcsOptions> = {}) {
        this.options = { ...defaultEcsOptions, ...options }
        this.recycleDeque = options.dequeCapacity
            ? new Deque(options.dequeCapacity)
            : new Deque()

        this.indexMask = (1 << this.options.entityIndexBits) - 1
    }

    /**
     * Generates a new entity id.
     *
     * @param allowRecycling Allows recycling entities.
     */
    public create(allowRecycling = true) {
        let index: number

        if (
            allowRecycling &&
            this.recycleDeque.length > this.options.minimumUnusedTime
        ) {
            if (this.recycleDeque.peekFront()) {
                index = this.recycleDeque.shift()!
            } else {
                index = this.create(false)
            }
        } else {
            index = this.generations.push(0) - 1
        }

        return index
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
