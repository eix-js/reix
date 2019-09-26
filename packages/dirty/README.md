# `Dirty`

> Generatlised computation graphs for the reix game engine

## Why is this package called "dirty"?

Because all computation nodes exposed by this package have a `state` property. That property is set to true if the node is dirty (It needs an update). The moment the updates are performed depends on the type of node used.

## Usage

```ts
import {
    ComputationInputNode,
    LazyComputationNode,
    SynchronousComputationNode
} from '@reix/dirty'

const myInput = new ComputationInputNode(0)

// Both ways will return the values in a synchronous way.
// The difference is the timing of the updates.
const lazy = new LazyComputationNode({ myInput }, inputs => inputs.myInput * 2)
const sync = new SynchronousComputationNode(
    { myInput },
    inputs => inputs.myInput * 3
)

myInput.set(7)
console.log(myInput.get()) // 7

// lazy hasn't been updated
// immediate has been updated

// the calculation was already performed so it returns the result
console.log(sync.get()) // 21

// perform calculation and then return the result
console.log(lazy.get()) // 14

// the calculation was already performed so it returns the result
console.log(lazy.get()) // 14

// cleanup
// every child is disposed automatically when you dispose it's parent
myInput.dispose()
```

## Advanced usage:

<h3>Events:</h3>

Each node has an `emitter` property which is an instance of `BitFieldEmitter` (from @reix/bits). You can get the event codes from the `computationEvents` enum:

```ts
import {
    ComputationInputNode,
    LazyComputationNode,
    computationEvents
} from '@reix/dirty'

const myInput = new ComputationInputNode(0)
const lazy = new LazyComputationNode({ myInput }, inputs => inputs.myInput * 2)

lazy.emitter.on(computationEvents.changed, () => console.log('changed'))
lazy.emitter.on(computationEvents.updated, () => console.log('updated'))
lazy.emitter.on(computationEvents.disposed, () => console.log('disposed'))

myInput.set(7) // updated, changed
myInput.set(7) // updated (the result of the calculation is the same)

myInput.dispose() // disposed
// or
lazy.dispose() // disposed
```

> Note: Both the `changed` and `updated` events will be emitted at the same time, so you can listen to both:

```ts
lazy.emitter.on(
    computationEvents.changed & computationEvents.updated,
    something
)
// or
lazy.emitter.on(computationEvents.changedAndUpdated, something)
```

<h3>States:</h3>

Each node has a `state` property. You can get the state flags from the `computationFlags` enum:

```ts
import { ComputationInputNode, LazyComputationNode } from '../src'
import { computationFlags } from '../dist'

const myInput = new ComputationInputNode(0)
const lazy = new LazyComputationNode({ myInput }, inputs => inputs.myInput * 2)

// Active
console.log(lazy.state & computationFlags.active) // truthy

// Dirty:
console.log(lazy.state & computationFlags.dirty) // truthy
lazy.get()
console.log(lazy.state & computationFlags.dirty) // falsy

// Active after disposing
lazy.dispose()
console.log(lazy.state & computationFlags.active) // falzy
```

> Note: Instead of doing `lazy.state & computationFlags.dirty` you can use the `isActive` method
