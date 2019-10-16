Each eventEmitter recives a type argument representing the type of data
all events will recive. If you want to allow for
different types of values you can use **an union**.

#### Just because you can, doesn't mean you should:

1. Not type safe:

Say we want an event `a` accepting a number and an event
`b` accepting a string::

```ts
const emitter = new BitFieldEmitter<number | string>()

emitter.emit(a, 2)
emitter.emit(b, '2')
```

Everything works fine! Or does it....

```ts
emitter.emit(a, '2')
emitter.emit(b, 2)
```

Typescript will let you use a string for `a` and a number for `b`.

Because this module works with bitFields as event codes, EventMaps are not relevant.

If you want a more common EventEmitter implementaion which plays nice
with typescript you can use [ee-ts](https://www.npmjs.com/package/ee-ts).

2. Kills performance:
   According to some comment in the source code of [react](https://github.com/facebook/react), making a function accept more then 1 data type is about 100 times slower because the js engine has to worry about different shapes of data.
