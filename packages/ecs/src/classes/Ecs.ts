import Deque from 'double-ended-queue'

export type EcsOptions = {
    minimumUnusedTime: number
    dequeCapacity: number
    entityIndexBits: number
}

export const defaultEcsOptions: EcsOptions = {
    minimumUnusedTime: 256,
    dequeCapacity: 0,
    entityIndexBits: 23
}

/**
 * Inspired by: http://bitsquid.blogspot.com/2014/08/building-data-oriented-entity-system.html
 */
export class Ecs {
    private readonly generation: Array<number> = []
    private readonly recycleDeque: Deque<number>
    private readonly indexMask: number
    private readonly options: Readonly<EcsOptions>

    public constructor(options: Partial<EcsOptions> = {}) {
        this.options = { ...defaultEcsOptions, ...options }
        this.recycleDeque = options.dequeCapacity
            ? new Deque(options.dequeCapacity)
            : new Deque()

        this.indexMask = (1 << this.options.entityIndexBits) - 1
    }

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
            index = this.generation.push(0) - 1
        }

        return index
    }

    public alive(id: number) {
        return (
            this.generation[id & this.indexMask] ===
            id >> this.options.entityIndexBits
        )
    }

    public destroy(id: number) {
        const index = id & this.indexMask
        this.generation[index]++
        this.recycleDeque.push(index)
    }
}
