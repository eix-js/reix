Typescript constant enums not only improve performance (most probably by a tiny bit)
and reduce bundle size (still by a tiny bit), but also free you from hardcoding the event
codes.

1. Create an enum:

```ts
const enum myEnum {
    foo = 0b01, // 1
    bar = 0b10 // 2
}
```

2. Then just create an emitter and use the values from the enum as event codes:

```ts
const emitter = new BitFieldEmitter<void>()

emitter.on(myEnum.foo, () => console.log('called 1'))
emitter.on(myEnum.bar, () => console.log('called 2'))

emitter.emit(myEnum.foo) // called 1
emitter.emit(myEnum.bar) // called 2
```

#### How to call both?

You can just use the `&` operator:

```ts
emitter.emit(myEnum.foo & myEnum.bar) // called 1, called 2
```

Or you can just declare it in the enum:

```ts
const enum myEnum {
    foo = 0b01, // 1
    bar = 0b10, // 2
    fooAndBar = 0b11 // 3
}

...

emitter.emit(myEnum.fooAndBar) // called 1, called 2
```
